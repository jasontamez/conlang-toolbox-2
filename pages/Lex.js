import { useEffect, useRef, useState } from 'react';
import { useWindowDimensions  } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
	Input,
	ScrollView,
	Text as Tx,
	VStack,
	FlatList,
	HStack,
	Box,
	IconButton,
	Menu,
	Button,
	Modal,
	Pressable,
	useToast,
	useContrastText
} from 'native-base';

import debounce from '../helpers/debounce';
import uuidv4 from '../helpers/uuidv4';
import {
	EditIcon,
	SortDownIcon,
	SortUpIcon,
	AddIcon,
	SettingsIcon,
	TrashIcon,
	RemoveCircleIcon,
	AddCircleIcon,
	SaveIcon,
	CloseCircleIcon,
	LoadIcon,
	LoadSaveIcon,
	ExportIcon
} from '../components/icons';
import { MultiAlert } from '../components/StandardAlert';
import {
	setTitle,
	setDesc,
	addLexiconItem,
	deleteLexiconItem,
	deleteMultipleLexiconItems,
	changeSortOrder,
	toggleSortDir,
	equalityCheck,
	editLexiconItem,
	loadState,
	setLastSave,
	setID,
	setStoredCustomInfo,
	consts
} from '../store/lexiconSlice';
import doToast from '../helpers/toast';
import ModalLexiconEditingItem from './LexEditItemModal';
import LexiconColumnEditorModal from './LexEditColumnsModal';
import LexiconColumnReorderingModal from './LexReorderColumnsModal';
import LoadingColumnsPickerModal from './LexLoadingColumnsPickerModal';
import {
	DropDown,
	DropDownMenu,
	ResettableTextSetting,
	ResettableTextAreaSetting
} from '../components/inputTags';
import { fontSizesInPx } from '../store/appStateSlice';
import blankAppState from '../store/blankAppState';
import { LoadingOverlay } from '../components/FullBodyModal';
import { lexCustomStorage } from '../helpers/persistentInfo';
import getSizes from '../helpers/getSizes';

const Lex = () => {
	//
	//
	// GET DATA
	//
	//
	const dispatch = useDispatch();
	const {
		id,
		lastSave,
		title,
		description,
		lexicon,
		truncateColumns,
		columns,
		sortDir,
		sortPattern,
		disableBlankConfirms,
		maxColumns,
		storedCustomInfo,
		storedCustomIDs
	} = useSelector((state) => state.lexicon, equalityCheck);
	const titleRef = useRef(null);
	const descRef = useRef(null);
	const { disableConfirms } = useSelector((state) => state.appState);
	const extraData = [truncateColumns, columns];
	const { absoluteMaxColumns } = consts;
	const [smallerSize, textSize, largeSize, bigTextSize] = getSizes("sm", "md", "lg", "x2")
	const Text = (props) => {
		return <Tx fontSize={textSize} {...props} />;
	};
	//
	//
	// GET STATE
	//
	//
	const [editingItemID, setEditingItemID] = useState(null);
	const [editingItemColumns, setEditingItemColumns] = useState([]);
	const [newLexiconItemColumns, setNewLexiconItemColumns] = useState([]);
	const [blankLexiconItemColumns, setBlankLexiconItemColumns] = useState([]);
	const [labels, setLabels] = useState([]);
	const [deletingMode, setDeletingMode] = useState(false);
	const [itemsToDelete, setItemsToDelete] = useState([]);
	const [alertOpen, setAlertOpen] = useState(false);
	const [modalOpen, setModalOpen] = useState('');

	const [loadLexicon, setLoadLexicon] = useState(false);
	const [loadChosen, setLoadChosen] = useState(storedCustomIDs && storedCustomIDs.length > 0 && storedCustomIDs[0]);
	const [loadingMethod, setLoadingMethod] = useState(0);
	const [loadingColumnsPicker, setLoadingColumnsPicker] = useState(false);
	const [loadingOverlayOpen, setLoadingOverlayOpen] = useState(false);

	const [destroyingLexicon, setDestroyingLexicon] = useState({});

	const [saveLexicon, setSaveLexicon] = useState(false);

	const [reloadTrigger, setReloadTrigger] = useState(0);

	const primaryContrast = useContrastText('primary.500');
	const secondaryContrast = useContrastText('secondary.500');
	const warningContrast = useContrastText('warning.500');

	// Have to introduce a hard limit of 30 columns. (absoluteMaxColumns)
	// We have to create the exact same number of Refs each time we render.
	// 10 seems like a decent amount that would strain even a wide-screen
	//   tablet, so 3x that is a good upper bound.
	const newLexiconRefs = [];
	for(let i=1; i <= absoluteMaxColumns; i++) {
		newLexiconRefs.push(useRef(null));
	}
	const toast = useToast();
	const maybePlural = (x, singular="", plural="s") => x === 1 ? singular : plural;
	//
	//
	// USE EFFECT
	//
	//
	useEffect(() => {
		const blankCols = [];
		const labs = columns.map(c => {
			blankCols.push("");
			return c.label;
		});
		setLabels(labs);
		setNewLexiconItemColumns([...blankCols]);
		setBlankLexiconItemColumns(blankCols);
	}, extraData);
	//
	//
	// SORTING ROUTINES
	//
	//
	const doSortBy = (v) => {
		// Adjust by -1, since "0" causes a display error in Menu
		const col = v - 1;
		// Put the chosen column first, followed by all previously chosen columns.
		const newOrder = [col, ...sortPattern.filter(c => c !== col)];
		// Save to state
		dispatch(changeSortOrder(newOrder));
	};
	//
	//
	// EDIT ITEM IN LEXICON
	//
	//
	const startEditingFunc = (item) => {
		const {id, columns} = item;
		// set editing info
		setEditingItemColumns([...columns]);
		// open modal
		setEditingItemID(id);
	};
	const endEditingFunc = () => {
		setEditingItemID(null);
		setEditingItemColumns([]);
	};
	const deleteEditingItemFunc = () => {
		dispatch(deleteLexiconItem(editingItemID));
		endEditingFunc();
	};
	const saveItemFunc = (columns) => {
		const edited = {
			id: editingItemID,
			columns: [...columns]
		};
		dispatch(editLexiconItem(edited));
		endEditingFunc();
	};
	//
	//
	// ADD ITEM TO LEXICON
	//
	//
	const addToLexicon = () => {
		// Check for blank columns
		if(disableBlankConfirms || newLexiconItemColumns.every((col) => col)) {
			// None? Or we don't care? Continue!
			return doAddToLexicon();
		}
		// We need to ask
		setAlertOpen("hasBlankColumns");
	}
	const doAddToLexicon = () => {
		// Does the actual work of adding to the Lexicon
		dispatch(addLexiconItem([...newLexiconItemColumns]));
		setNewLexiconItemColumns([...blankLexiconItemColumns]);
		doToast({
			toast,
			msg: "Word Added"
		});
		newLexiconRefs.forEach(ref => {
			ref && ref.current && ref.current.clear();
		});
	};
	const maybeUpdateText = (text, i) => {
		debounce(() => {
			let newCols = [...newLexiconItemColumns];
			newCols[i] = text;
			setNewLexiconItemColumns(newCols)			;
		}, {namespace: String(i)});
	};
	//
	//
	// MASS DELETE
	//
	//
	const toggleDeletingMode = (force = false) => {
		if(!force && deletingMode && itemsToDelete.length > 0) {
			// Ask if they want to delete the marked ones before they go
			return setAlertOpen('pendingDeleteQueue');
		}
		// Toggle the mode
		setItemsToDelete([]);
		setDeletingMode(!deletingMode);
	};
	const maybeMassDelete = () => {
		if(itemsToDelete.length === 0) {
			return doToast({
				toast,
				placement: "top",
				scheme: "info",
				msg: "You haven't marked anything for deletion yet."
			});
		} else if (!disableConfirms) {
			return setAlertOpen('willMassDelete');
		}
		// We're ok to go
		doMassDelete();
	};
	const doMassDelete = () => {
		const amount = itemsToDelete.length;
		// Delete from lexicon
		dispatch(deleteMultipleLexiconItems([...itemsToDelete]));
		// Reset everything else
		setItemsToDelete([]);
		setDeletingMode(false);
		doToast({
			toast,
			placement: "top",
			scheme: "danger",
			msg: `${amount} item${maybePlural(amount)} deleted`
		});
	};
	const toggleMarkedForDeletion = (id) => {
		// Remove the ID from the list, if it's there.
		const newItemsToDelete = itemsToDelete.filter(item => item !== id);
		if(itemsToDelete.length === newItemsToDelete.length) {
			// The ID was not in the list already, so add it.
			newItemsToDelete.push(id);
		}
		// Save to state
		setItemsToDelete(newItemsToDelete);
	};
	//
	//
	// LOAD LEXICON
	//
	//
	const loadingMethods = [
		{
			key: "overwrite",
			desc: "Overwrite all",
			label: "Overwrite title, description, and lexicon items",
			onPress: () => setLoadingMethod(0)
		},
		{
			key: "overappend",
			desc: "Overwrite info, append items",
			label: "Overwrite title and description, keep current lexicon items and append new items",
			onPress: () => setLoadingMethod(1)
		},
		{
			key: "append",
			desc: "Append new items",
			label: "Keep current lexicon info and only append new items",
			onPress: () => setLoadingMethod(2)
		},
	];
	const maybeLoadLexicon = () => {
		// [title, lastSave, numberOfLexiconWords, columns]
		// My Lang                 Saved: 10/12/2022, 10:00:00 PM
		// [14 Words]
		// Overwrite, Append/Overwrite, Append Only
		// method: overwrite | overappend | append
		// We will need to match columns
		// columnConversion: [(integer | null)...]
		if(storedCustomIDs.length < 1) {
			return doToast({
				toast,
				msg: "There are no previous saves to load.",
				scheme: "error",
				placement: "bottom"
			});
		}
		setLoadLexicon(true);
	};
	const checkLexiconToLoad = () => {
		// Check columns against each other.
		if(loadingMethods[loadingMethod].key === "overwrite") {
			// No need to check columns or anything.
			return doLoadLexicon(null);
		}
		// columnConversion: [(integer | null)...] | null
		// [title, lastSave, lexiconLength, incomingColumns]
		const incomingCols = storedCustomInfo[loadChosen][3];
		if(columns.length === incomingCols.length) {
			if (columns.every((col, i) => col.label === incomingCols[i].label)) {
				// All columns are equal
				return doLoadLexicon(null);
			}
			let colsNow = columns.map((col, i) => [col, i]);
			let colsNext = incomingCols.map((col, i) => [col, i]);
			const sorter = (x, y) => {
				const a = x[0];
				const b = y[0];
				return a.label.localeCompare(b.label, "en", { sensitivity: "variant" })
					|| a.size.localeCompare(b.size, "en", { sensitivity: "base" });
			};
			colsNow.sort(sorter);
			colsNext.sort(sorter);
			if (colsNow.every((col, i) => col[0].label === colsNext[0][i].label)) {
				// All columns are equal
				const order = colsNow.map(col => col[1]);
				const columnConversion = order.map(o => colsNext[o][1]);
				return doLoadLexicon(columnConversion);
			}
		}
		setLoadingColumnsPicker(true);
	};
	const doLoadLexicon = (columnConversion) => {
		setLoadingOverlayOpen(true);
		lexCustomStorage.getItem(loadChosen).then(savedInfo => {
			const newLex = JSON.parse(savedInfo);
			dispatch(loadState({
				method: loadingMethods[loadingMethod].key,
				columnConversion,
				lexicon: newLex
			}));
			debounce(() => {
				setLoadLexicon(false);
				setLoadingColumnsPicker(false);
				setReloadTrigger(reloadTrigger + 1);
				setLoadingOverlayOpen(false);
				doToast({
					toast,
					msg: "Lexicon Loaded",
					scheme: "success",
					fontSize: textSize
				})
			}, {
				namespace: "loadingLexicon",
				amount: 500
			});
		});
	};
	//
	//
	// SAVE LEXICON
	//
	//
	const displayPreviousSaves = () => {
		return storedCustomIDs.map(info => {
			const [title, lastSave, lexNumber, columns] = storedCustomInfo[info];
			const time = new Date(lastSave);
			const color = loadChosen === info ? primaryContrast : "text.50"
			const timeString = time.toLocaleString();
			// TO-DO: Determine if time.toLocaleString() is going to work
			//    or if we need to use Moment.js or something else
			return (
				<HStack
					key={info}
					alignItems="center"
					justifyContent="space-between"
					space={3}
				>
					<Pressable
						onPress={() => setLoadChosen(info)}
						flex={1}
					>
						<HStack
							justifyContent="space-between"
							alignItems="center"
							borderWidth={1}
							borderColor={loadChosen === info ? "primary.500" : "darker"}
							borderRadius="xs"
							bg={loadChosen === info ? "primary.800" : "main.800"}
							px={1.5}
							py={1}
						>
							<VStack
								alignItems="flex-start"
								justifyContent="center"
							>
								<Text color={color} fontSize={textSize}>{title}</Text>
								<Text color={color} fontSize={smallerSize}>[{lexNumber} words]</Text>
							</VStack>
							<Text color={color} italic fontSize={smallerSize}>Saved: {timeString}</Text>
						</HStack>
					</Pressable>
					<IconButton
						icon={<TrashIcon color="danger.500" size={smallerSize} />}
						variant="ghost"
						onPress={() => maybeDeleteLexicon(info, title, timeString, lexNumber)}
					/>
				</HStack>
			);
		});
	};
	const maybeDeleteLexicon = (id, title, time, lexNumber) => {
		if(disableConfirms) {
			return doDeleteLexicon(id, title);
		}
		setDestroyingLexicon({
			id,
			title,
			time,
			lexNumber,
			msg: "delete",
			func: () => doDeleteLexicon(id, title)
		});
		setAlertOpen('willDestroyLexicon');
	};
	const doDeleteLexicon = (id, title) => {
		const newInfo = {...storedCustomInfo};
		delete newInfo[id];
		doToast({
			toast,
			msg: `Deleting "${title}"...`,
			scheme: "danger",
			fontSize: textSize
		});
		setLoadChosen(false);
		lexCustomStorage.removeItem(id).then(() => {
			dispatch(setStoredCustomInfo(newInfo));
			doToast({
				toast,
				msg: `"${title}" deleted`,
				scheme: "danger",
				fontSize: textSize
			});
		}).catch((err) => {
			console.log(err);
			console.log(`${id} - "${title}"`);
			doToast({
				toast,
				msg: `Unable to delete "${title}"`,
				scheme: "danger",
				fontSize: textSize
			});
		});
	};
	const maybeSaveLexicon = () => {
		// if there's a previous save loaded, default to overwriting that
		if(!title) {
			return doToast({
				toast,
				msg: "Please create a title for your Lexicon before saving.", // at...
				scheme: "error",
				placement: "top",
				fontSize: textSize
			});
		} else if(id) {
			// Previous save found.
			return doSaveLexicon();
		}
		// Otherwise, make an id and save
		doSaveNewLexicon();
	};
	const doSaveLexicon = (saveID = id) => {
		const time = Date.now();
		doToast({
			toast,
			msg: "Saving Lexicon...",
			scheme: "info",
			placement: "bottom",
			fontSize: textSize
		});
		lexCustomStorage.setItem(saveID, JSON.stringify({
			id: saveID,
			lastSave: time,
			title,
			description,
			lexicon,
			columns,
			sortDir,
			sortPattern,
			truncateColumns,
			maxColumns
		})).then(() => {
			// return val is undefined?
			id !== saveID && dispatch(setID(saveID));
			dispatch(setLastSave(time));
			//  id: [title, lastSave, lexicon-length, columns],
			let info = {...storedCustomInfo};
			info[saveID] = [
				title,
				time,
				lexicon.length,
				[...columns]
			];
			dispatch(setStoredCustomInfo(info));
			doToast({
				toast,
				msg: "Lexicon saved", // at...?
				scheme: "success",
				placement: "bottom",
				fontSize: textSize
			});
		});
	};
	const doSaveNewLexicon = () => doSaveLexicon(uuidv4());
	const maybeOverwriteSaveLexicon = () => {
		const [title, lastSave, lexNumber, columns] = storedCustomInfo[loadChosen];
		if(disableConfirms) {
			return doSaveLexicon(loadChosen);
		}
		const time = (new Date(lastSave)).toLocaleString();
		setDestroyingLexicon({
			id,
			title,
			time,
			lexNumber,
			msg: "overwrite",
			func: () => doSaveLexicon(loadChosen)
		});
		setAlertOpen('willDestroyLexicon');
	};


	//
	//
	// CLEAR LEXICON
	//
	//
	const doClearLexicon = () => {
		dispatch(loadState({
			method: "overwrite",
			lexicon: blankAppState.lexicon
		}));
		titleRef && titleRef.current && titleRef.current.clear();
		descRef && descRef.current && descRef.current.clear();
		doToast({
			toast,
			msg: "Lexicon cleared",
			scheme: "danger",
			placement: "top",
			fontSize: textSize
		});
	};

	//
	//
	// RENDER
	//
	//
	const ListEmpty = <Box><Text>Nothing here yet.</Text></Box>;
	const { width, height } = useWindowDimensions();
	const getBoxSize = (size) => {
		if(size === "s") {
			return "lexSm";
		} else if (size === "l") {
			return "lexLg";
		}
		return "lexMd";
	};
	//const [] = useBreakpointValue({
	//	base: [1, 3],
	//});
	// Calculate dimensions of the upper area so they are readable
	const calculateInfoHeight = () => {
		// Base height is 1/4 the area
		const base = (height - 40) / 4;
		// Max height is 1/2 the area
		const max = base * 2;
		// fontSize is an estimate of the amount of space the font takes up
		const fontSize = fontSizesInPx[textSize];
		// return a value at least `base`, but modified by `fontSize`
		//    to a point no greater than `max`
		return Math.min(max, Math.max(base, fontSize * 10));
	};
	const infoHeight = calculateInfoHeight();
	const renderList = ({item, index}) => {
		const id = item.id;
		const cols = item.columns;
		const bg = index % 2 ? "lighter" : "darker";
		const buttonProps =
			deletingMode ?
				{
					icon: <TrashIcon size={smallerSize} color="danger.50" />,
					accessibilityLabel: "Mark for Deletion",
					bg: "danger." + (itemsToDelete.findIndex(itd => itd === id) >= 0 ? "400" : "700"),
					onPress: () => toggleMarkedForDeletion(id)
				}
			:
				{
					icon: <EditIcon size={smallerSize} color="primary.400" />,
					accessibilityLabel: "Edit",
					bg: "transparent",
					onPress: () => startEditingFunc(item)
				};
		return (
			<HStack key={id} py={3.5} px={1.5} bg={bg}>
				{cols.map(
					(text, i) =>
						<Box px={1} size={getBoxSize(columns[i].size)} key={`${id}-Column-${i}`}>
							<Text fontSize={smallerSize} isTruncated={truncateColumns}>{text}</Text>
						</Box>
					)
				}
				<Box size="lexXs">
					<IconButton
						py={1}
						px={2}
						m={0.5}
						{...buttonProps}
					/>
				</Box>
			</HStack>
		);
	}
	//
	//
	// RETURN JSX
	//
	//
	return (
		<>
			<ModalLexiconEditingItem
				isEditing={editingItemID !== null}
				columns={editingItemColumns}
				{...{
					saveItemFunc,
					deleteEditingItemFunc,
					disableConfirms,
					endEditingFunc,
					labels
				}}
			/>
			<MultiAlert
				alertOpen={alertOpen}
				setAlertOpen={setAlertOpen}
				sharedProps={{
					headerProps: {
						_text: {
							color: warningContrast,
							fontSize: largeSize
						}
					}
				}}
				passedProps={[
					{
						id: "hasBlankColumns",
						properties: {
							continueFunc: doAddToLexicon,
							continueText: "Yes",
							bodyContent: "You have one or more blank columns in this entry. Are you sure you want to add this to your Lexicon?"
						}
					},
					{
						id: "pendingDeleteQueue",
						properties: {
							continueText: "No, Don't Delete",
							continueFunc: () => toggleDeletingMode(true),
							leastDestructiveContinue: true,
							cancelText: "Yes, Delete Them",
							cancelFunc: doMassDelete,
							cancelProps: {
								bg: "danger.500"
							},
							bodyContent: `You have marked ${itemsToDelete.length} item${maybePlural(itemsToDelete.length)} for deletion. Do you want to delete them?`
						}
					},
					{
						id: "willMassDelete",
						properties: {
							continueText: "Yes",
							continueFunc: doMassDelete,
							continueProps: {
								bg: "danger.500"
							},
							bodyContent: (
								<Text>You are about to delete <Text bold>{itemsToDelete.length}</Text> word{maybePlural(itemsToDelete.length)}. Are you sure? This cannot be undone.</Text>
							)
						}
					},
					{
						id: "willClearLexicon",
						properties: {
							continueText: "Yes",
							continueFunc: doClearLexicon,
							continueProps: {
								bg: "danger.500"
							},
							bodyContent: (
								<Text>This will erase the Title, Description, and every item in the Lexicon. It cannot be undone. Are you sure you want to do this?</Text>
							)
						}
					},
					{
						id: "willDestroyLexicon",
						properties: {
							continueText: "Yes",
							continueFunc: destroyingLexicon.func,
							continueProps: {
								bg: "danger.500"
							},
							bodyContent: (
								<VStack
									alignItems="center"
									justifyContent="center"
									py={2}
									px={4}
									space={2}
								>
									<Text textAlign="center">You are about to {destroyingLexicon.msg}:</Text>
									<Box bg="darker" px={2} py={1}>
										<Text textAlign="center" fontSize={smallerSize}>
											<Tx bold>{destroyingLexicon.title}</Tx>: {destroyingLexicon.lexNumber === 1 ? "1 item" : `${destroyingLexicon.lexNumber} items`}
										</Text>
										<Text textAlign="center">Last save: <Tx italic>{destroyingLexicon.time}</Tx></Text>
									</Box>
									<Text textAlign="center">Are you sure you want to {destroyingLexicon.msg} this? It cannot be undone.</Text>
								</VStack>
							)
						}
					},
					{
						id: "howToSaveLexicon",
						properties: {
							fontSize: textSize,
							detatchButtons: true,
							headerProps: {
								bg: "primary.500",
								_text: {
									color: primaryContrast
								}
							},
							headerContent: "Where to Save?",
							bodyContent: (
								<VStack
									justifyContent="center"
									alignItems="center"
									w="full"
								>
									<HStack
										flexWrap="wrap"
										justifyContent="space-between"
										flex={1}
										my={2}
										mx={2}
										space={2}
									>
										<Button
											onPress={() => {
												setAlertOpen(false);
												doSaveNewLexicon();
											}}
											bg="primary.500"
											_text={{
												color: primaryContrast,
												fontSize: largeSize
											}}
											px={2.5}
											py={1.5}
										>New Save</Button>
										{storedCustomIDs.length > 0 &&
											<Button
												onPress={() => {
													setAlertOpen(false);
													setSaveLexicon(true);
												}}
												bg="secondary.500"
												_text={{
													color: primaryContrast,
													fontSize: largeSize
												}}
												px={2.5}
												py={1.5}
											>Overwrite Previous Save</Button>
										}
									</HStack>
								</VStack>
							),
							overrideButtons: [
								({leastDestructiveRef}) => <Button
									onPress={() => {
										setAlertOpen(false);
									}}
									bg="darker"
									ref={leastDestructiveRef}
									_text={{fontSize: textSize}}
									px={2}
									py={1}
								>Cancel</Button>
							]
						}
					}
				]}
			/>
			<Modal isOpen={loadLexicon}>
				<Modal.Content>
					<Modal.Header
						bg="primary.500"
						borderBottomWidth={0}
						px={3}
					>
						<HStack w="full" justifyContent="space-between" alignItems="center" pl={1.5}>
							<Text color={primaryContrast} fontSize={textSize}>Load Lexicon</Text>
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => setLoadLexicon(false)}
								variant="ghost"
								px={0}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						{displayPreviousSaves()}
					</Modal.Body>
					<Modal.Footer
						borderTopWidth={0}
					>
						<HStack
							justifyContent="space-between"
							w="full"
						>
							<Button
								bg="lighter"
								_text={{color: "text.50", fontSize: textSize}}
								p={1}
								m={2}
								onPress={() => setLoadLexicon(false)}
							>Cancel</Button>
							<DropDownMenu
								placement="top left"
								fontSize={textSize}
								menuSize={smallerSize}
								titleSize={smallerSize}
								labelFunc={() => loadingMethods[loadingMethod].desc}
								options={loadingMethods}
								title="How to Load Lexicon"
								buttonProps={{mx: 4, my: 2}}
								isMarked={(key) => loadingMethods[loadingMethod].key === key}
							/>
							<Button
								startIcon={<LoadIcon color="success.50" m={0} size={textSize} />}
								bg={loadChosen ? "success.500" : "muted.800"}
								_text={{color: "success.50", fontSize: textSize}}
								p={1}
								m={2}
								disabled={!loadChosen}
								onPress={checkLexiconToLoad}
							>Load</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<Modal isOpen={saveLexicon}>
				<Modal.Content>
					<Modal.Header
						bg="primary.500"
						borderBottomWidth={0}
						px={3}
					>
						<HStack w="full" justifyContent="space-between" alignItems="center" pl={1.5}>
							<Text color={primaryContrast} fontSize={textSize}>Save Lexicon</Text>
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => setSaveLexicon(false)}
								variant="ghost"
								px={0}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						{displayPreviousSaves()}
					</Modal.Body>
					<Modal.Footer
						borderTopWidth={0}
					>
						<HStack
							justifyContent="space-between"
							w="full"
							flexWrap="wrap"
						>
							<Button
								bg="lighter"
								_text={{color: "text.50", fontSize: textSize}}
								p={1}
								m={2}
								onPress={() => setSaveLexicon(false)}
							>Cancel</Button>
							<Button
								startIcon={<SaveIcon color={primaryContrast} m={0} size={textSize} />}
								bg="primary.500"
								_text={{color: primaryContrast, fontSize: textSize}}
								p={1}
								m={2}
								onPress={() => {
									setSaveLexicon(false);
									doSaveNewLexicon();
								}}
							>New Save</Button>
							<Button
								startIcon={<SaveIcon color="success.50" m={0} size={textSize} />}
								bg="success.500"
								_text={{color: "success.50", fontSize: textSize}}
								p={1}
								m={2}
								disabled={!loadChosen || storedCustomIDs.length === 0}
								onPress={() => {
									setSaveLexicon(false);
									maybeOverwriteSaveLexicon();
								}}
							>Overwrite Save</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<LoadingColumnsPickerModal
				modalOpen={loadingColumnsPicker}
				textSizes={[smallerSize, textSize]}
				primaryContrast={primaryContrast}
				closeModal={() => setLoadingColumnsPicker(false)}
				endingFunc={doLoadLexicon}
				currentColumns={columns}
				incomingColumns={loadChosen ? storedCustomInfo[loadChosen][3] : []}
			/>
			<LoadingOverlay
				overlayOpen={loadingOverlayOpen}
				colorFamily="secondary"
				contents={<Text fontSize={largeSize} color={secondaryContrast} textAlign="center">Loading Lexicon...</Text>}
			/>
			<ScrollView height={infoHeight} flexGrow={0} flexShrink={0}>
				<VStack m={3} mb={0}>
					<ResettableTextSetting
						text="Lexicon Title:"
						defaultValue={title}
						onChangeText={(v) => debounce(
							() => dispatch(setTitle(v)),
							{ namespace: "LexTitle" }
						)}
						labelProps={{fontSize: textSize}}
						inputProps={{mt: 2, fontSize: smallerSize, ref: titleRef}}
						placeholder="Usually the language name."
						reloadTrigger={reloadTrigger}
					/>
				</VStack>
				<VStack m={3} mt={2}>
					<ResettableTextAreaSetting
						text="Description:"
						defaultValue={description}
						onChangeText={(v) => debounce(
							() => dispatch(setDesc(v)),
							{ namespace: "LexDesc" }
						)}
						labelProps={{fontSize: textSize}}
						inputProps={{mt: 2, fontSize: smallerSize, ref: descRef}}
						rows={3}
						placeholder="A short description of this lexicon."
						reloadTrigger={reloadTrigger}
					/>
				</VStack>
			</ScrollView>
			<VStack
				flex={1}
				justifyContent="flex-start"
				alignItems="stretch"
				style={{
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: -2
					},
					shadowOpacity: 0.23,
					shadowRadius: 3.84,
					elevation: 10
				}}
			>
				<HStack
					ml={3}
					justifyContent="space-between"
					alignItems="center"
				>
					<Box
						flexGrow={1}
						flexShrink={1}
						style={{minWidth: 110}}
					>
						<Text fontSize={bigTextSize} isTruncated>{lexicon.length} Word{maybePlural(lexicon.length)}</Text>
					</Box>
					<HStack
						mx={3}
						style={{maxWidth: width - 110 - 36}}
						flexWrap="wrap"
						flexGrow={0}
						flexShrink={1}
					>
						<DropDown
							placement="top right"
							fontSize={smallerSize}
							menuSize={textSize}
							labelFunc={() => columns[sortPattern[0]].label}
							onChange={(v) => doSortBy(v)}
							defaultValue={sortPattern[0]+1}
							title="Sort By:"
							options={columns.map((item, i) => {
								const {id, label} = item;
								return {
									key: `${id}-Sorting`,
									value: i + 1,
									label
								};
							})}
							buttonProps={{
								maxW: width / 2,
								flexShrink: 2
							}}
						/>
						<IconButton
							onPress={() => dispatch(toggleSortDir())}
							icon={sortDir ? <SortUpIcon size={smallerSize} /> : <SortDownIcon size={smallerSize} />}
							p={1}
							_icon={{color: "secondary.50"}}
							bg="secondary.500"
							accessibilityLabel="Change sort direction."
							flexGrow={0}
							flexShrink={0}
						/>
						<LexiconColumnEditorModal
							triggerOpen={modalOpen === 'edit'}
							clearTrigger={() => setModalOpen('')}
						/>
						<LexiconColumnReorderingModal
							triggerOpen={modalOpen === 'reorder'}
							clearTrigger={() => setModalOpen('')}
						/>
						{deletingMode &&
							<IconButton
								p={1}
								px={1.5}
								ml={2}
								icon={<TrashIcon color="danger.50" size={smallerSize} />}
								bg="danger.500"
								onPress={() => maybeMassDelete()}
								flexGrow={0}
								flexShrink={0}
							/>
						}
						<Menu
							placement="bottom right"
							closeOnSelect={true}
							trigger={(props) => (
								<IconButton
									p={1}
									px={1.5}
									ml={2}
									icon={<SettingsIcon color="tertiary.50" name="settings" size={smallerSize} />}
									bg="tertiary.500"
									flexGrow={0}
									flexShrink={0}
									{...props}
								/>
							)}
						>
							<Menu.Group
								title="Columns"
								_title={{fontSize: smallerSize}}
							>
								<Menu.Item
									onPress={() => setModalOpen('edit')}
								>
									<Text>Edit Column Info</Text>
								</Menu.Item>
								<Menu.Item
									onPress={() => setModalOpen('reorder')}
								>
									<Text>Reorder Columns</Text>
								</Menu.Item>
							</Menu.Group>
							<Menu.OptionGroup
								title="Lexicon Entries"
								_title={{fontSize: smallerSize}}
								type="checkbox"
								value={deletingMode ? ["mass delete"] : []}
							>
								<Menu.ItemOption
									_text={{fontSize: textSize}}
									onPress={() => toggleDeletingMode()}
									value="mass delete"
								>
									<Text>Mass Delete Mode</Text>
								</Menu.ItemOption>
							</Menu.OptionGroup>
						</Menu>
						<Menu
							placement="bottom right"
							closeOnSelect={true}
							trigger={(props) => (
								<IconButton
									p={1}
									px={1.5}
									ml={2}
									icon={<LoadSaveIcon color="tertiary.50" size={smallerSize} />}
									bg="tertiary.500"
									flexGrow={0}
									flexShrink={0}
									{...props}
								/>
							)}
						>
							<Menu.Group
								title="Lexicon"
								_title={{fontSize: smallerSize}}
							>
								<Menu.Item
									_text={{fontSize: textSize}}
									onPress={() => setAlertOpen('willClearLexicon')}
								>
									<HStack
										space={4}
										justifyContent="flex-start"
										alignItems="center"
									>
										<RemoveCircleIcon size={smallerSize} color="text.50" />
										<Text>Clear Lexicon</Text>
									</HStack>
								</Menu.Item>
								<Menu.Item onPress={() => {
									//setMenuOpen(false);
									maybeLoadLexicon();
								}}>
									<HStack
										space={4}
										justifyContent="flex-start"
										alignItems="center"
									>
										<AddCircleIcon size={smallerSize} color="text.50" />
										<Text>Load Lexicon</Text>
									</HStack>
								</Menu.Item>
								<Menu.Item onPress={() => {
									maybeSaveLexicon();
								}}>
									<HStack
										space={4}
										justifyContent="flex-start"
										alignItems="center"
									>
										<SaveIcon size={smallerSize} color="text.50"  />
										<Text>Save Lexicon</Text>
									</HStack>
								</Menu.Item>
								<Menu.Item onPress={() => {
									if(!title) {
										return doToast({
											toast,
											msg: "Please create a title for your Lexicon before saving.",
											scheme: "error",
											placement: "top",
											fontSize: textSize
										});
									}
									setAlertOpen('howToSaveLexicon');
								}}>
									<HStack
										space={4}
										justifyContent="flex-start"
										alignItems="center"
									>
										<SaveIcon size={smallerSize} color="text.50" />
										<Text>Save as...</Text>
									</HStack>
								</Menu.Item>
								<Menu.Item onPress={() => {
									if(!title) {
										return doToast({
											toast,
											msg: "Please create a title for your Lexicon before exporting.",
											scheme: "error",
											placement: "top",
											fontSize: textSize
										});
									}
									setAlertOpen('howToSaveLexicon');
								}}>
									<HStack
										space={4}
										justifyContent="flex-start"
										alignItems="center"
									>
										<ExportIcon size={smallerSize} color="text.50" />
										<Text>Export Lexicon</Text>
									</HStack>
								</Menu.Item>
							</Menu.Group>
						</Menu>
					</HStack>
				</HStack>
				<VStack
					flex={1}
					style={{maxHeight: height - 40}}
					alignItems="stretch"
					justifyContent="flex-start"
				>
					<HStack
						alignItems="flex-end"
						pt={1.5}
						mx={2}
						flexGrow={0}
						flexShrink={0}
					>
						{
							columns.map(col => (
								<Box
									pr={1}
									key={col.id + "-ColumnLabel"}
									size={getBoxSize(col.size)}
								>
									<Text bold isTruncated={truncateColumns} fontSize={textSize}>{col.label}</Text>
								</Box>
							))
						}
						<Box size="lexXs"></Box>
					</HStack>
					<HStack alignItems="center" mx={1.5}
						mb={1}
						flexGrow={0}
						flexShrink={0}
					>
						{columns.map((col, i) => (
							<Box
								px={0.5}
								mx={0}
								size={getBoxSize(col.size)}
								key={col.id + "-Input"}
							>
								<Input
									w="full"
									fontSize={textSize}
									p={0.5}
									ref={newLexiconRefs[i]}
									defaultValue={newLexiconItemColumns[i]}
									onChangeText={(v) => maybeUpdateText(v, i)}
								/>
							</Box>
						))}
						<Box size="lexXs" ml={0.5}>
							<IconButton
								p={1}
								m={0.5}
								icon={<AddIcon size={smallerSize} color="success.50" />}
								accessibilityLabel="Add to Lexicon"
								bg="success.500"
								onPress={() => addToLexicon()}
							/>
						</Box>
					</HStack>
					<FlatList
						m={0}
						mb={1}
						data={lexicon}
						keyExtractor={(word) => word.id}
						ListEmptyComponent={ListEmpty}
						extraData={extraData}
						renderItem={renderList}
					/>
				</VStack>
			</VStack>
		</>
	);
};

export default Lex;
