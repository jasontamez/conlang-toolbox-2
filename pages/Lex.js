import { useEffect, useRef, useState } from 'react';
import { useWindowDimensions  } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
	Input,
	Text as Tx,
	VStack,
	FlatList,
	HStack,
	Box,
	Menu,
	Modal,
	Pressable,
	useToast
} from 'native-base';
import { AnimatePresence, MotiScrollView } from 'moti';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SwipeableItem from 'react-native-swipeable-item';

import debounce from '../helpers/debounce';
import uuidv4 from '../helpers/uuidv4';
import {
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
	ExportIcon,
	RestoreIcon,
	MinimizeIcon,
	DragIndicatorIcon
} from '../components/icons';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import { MultiAlert } from '../components/StandardAlert';
import {
	setTitle,
	setDesc,
	addLexiconItem,
	deleteLexiconItem,
	changeSortOrder,
	toggleSortDir,
	equalityCheck,
	editLexiconItem,
	loadStateLex as loadState,
	setLastSave,
	setID,
	setStoredCustomInfo,
	setMinimizedInfo,
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
import { fromToZero, maybeAnimate } from '../helpers/motiAnimations';
import doExport from '../helpers/exportTools';
import Underlay from '../components/Underlay';

const Lex = () => {
	//
	//
	// GET DATA
	//
	//
	const dispatch = useDispatch();
	const { disableConfirms } = useSelector((state) => state.appState);
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
		minimizedInfo,
		maxColumns,
		fontType,
		storedCustomInfo,
		storedCustomIDs
	} = useSelector((state) => state.lexicon, equalityCheck);
	const { width, height } = useWindowDimensions();
	const titleRef = useRef(null);
	const descRef = useRef(null);
	const extraData = [truncateColumns, columns];
	const { absoluteMaxColumns } = consts;
	const [miniSize, smallerSize, textSize, largeSize, bigTextSize] = getSizes("xs", "sm", "md", "lg", "x2")
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
	const [deletingItem, setDeletingItem] = useState(false);
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

	const [usedButton, setUsedButton] = useState(false);

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
	// DELETE ITEM FROM LEXICON
	//
	//
	const maybeDeleteItemFunc = (item) => {
		const {id, columns} = item;
		const text = labels.map((col, i) => `${col}: ${columns[i]}`).join("\n");
		setDeletingItem({id, columns, text});
		setAlertOpen("willDeleteItem");
	};
	const doDeleteItemFunc = () => {
		dispatch(deleteLexiconItem(deletingItem.id));
		setDeletingItem(false);
		setAlertOpen(false);
	};
	const cancelDeleteFunc = () => {
		setAlertOpen(false);
		setDeletingItem(false);
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
		setLoadingOverlayOpen("Loading Lexicon...");
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
		return storedCustomIDs.map((info, index) => {
			const [title, lastSave, lexNumber, columns] = storedCustomInfo[info];
			const time = new Date(lastSave);
			const color = loadChosen === info ? "primary.50" : "text.50"
			const timeString = time.toLocaleString();
			const striping = !(index % 2) ? {
				// odd rows (0-indexed!)
				borderColor: loadChosen === info ? "primary.500" : "darker",
				bg: "darker"
			} : {
				// even rows
				borderColor: loadChosen === info ? "primary.500" : "lighter",
				bg: "lighter"
			};
			// TO-DO: Determine if time.toLocaleString() is going to work
			//    or if we need to use Moment.js or something else
			return (
				<HStack
					key={info}
					alignItems="center"
					justifyContent="space-between"
					space={3}
					borderWidth={1}
					borderRadius="md"
					{...striping}
				>
					<Pressable
						onPress={() => setLoadChosen(info)}
						flex={1}
						_pressed={{bg: "lighter"}}
					>
						<HStack
							justifyContent="space-between"
							alignItems="center"
							px={1.5}
							py={1}
							space={3}
						>
							<VStack
								alignItems="flex-start"
								justifyContent="center"
							>
								<Text color={color} fontSize={textSize}>{title}</Text>
								<Text color={color} fontSize={smallerSize}>[{lexNumber} words]</Text>
							</VStack>
							<Text flexShrink={1} color={color} italic fontSize={smallerSize} textAlign="center">Saved: {timeString}</Text>
						</HStack>
					</Pressable>
					<IconButton
						icon={<TrashIcon size={smallerSize} />}
						_icon={{color: "danger.500"}}
						variant="ghost"
						scheme="danger"
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
	// EXPORT LEXICON
	//
	//
	const doText = (spacer, separator = "\n") => {
		// 'spacer' separates columns of an entry
		// 'separator' separates entries from each other
		return `${title}\n${description}\n\n${columns.map(col => col.label).join(spacer)}${separator}`
			+ lexicon.map(lex => lex.columns.join(spacer)).join(separator) + "\n";
	};
	const doCSV = (showAll = false) => {
		// if 'showAll' is true, add the title and description to the top of the document
		let extraSep = "";
		const quotify = (input) => JSON.stringify(input).replace(/\\"/g, "\"\"");
		let beginning = "";
		if(showAll) {
			const limit = columns.length;
			if(limit < 2) {
				extraSep = ",";
			}
			let filler = "";
			if(limit >= 2) {
				for(let x = 2; x < limit; x++) {
					filler += ",";
				}
			}
			beginning = `"TITLE",${quotify(title)}${filler}\n"DESCRIPTION",${quotify(description)}${filler}\n`;
		}
		return beginning + [
			columns.map(col => quotify(col.label)).join(","),
			...lexicon.map(lex => lex.columns.map((title) => quotify(title)).join(",") + extraSep)
		].join("\n") + "\n";
	};
	const doJSON = () => {
		return JSON.stringify({
			title,
			description,
			content: lexicon.map(lex => {
				const lexItemColumns = lex.columns;
				const output = {};
				columns.forEach((col, i) => {
					output[col.label] = lexItemColumns[i];
				});
				return output;
			})
		});
	};
	const exportFormats = [
		{
			text: "Text, Tabbed",
			getInfo: () => doText("\t")
		},
		{
			text: "Text, Semicolons",
			getInfo: () => doText("; "),
			scheme: "tertiary"
		},
		{
			text: "Text, Newlines",
			getInfo: () => doText("\n", "\n\n")
		},
		{
			text: "CSV File",
			getInfo: () => doCSV(true),
			extension: "csv",
			encoding: "csv",
			scheme: "tertiary"
		},
		{
			text: "CSV File, no title/description",
			getInfo: () => doCSV(),
			extension: "csv",
			encoding: "csv"
		},
		{
			text: "JSON File",
			getInfo: () => doJSON(),
			extension: "json",
			encoding: "json",
			scheme: "tertiary"
		}
	];

	//
	//
	// RENDER
	//
	//
	const ListEmpty = <Box><Text>Nothing here yet.</Text></Box>;
	const getBoxSize = (size) => {
		if(size === "s") {
			return "lexSm";
		} else if (size === "l") {
			return "lexLg";
		}
		return "lexMd";
	};
	// Calculate dimensions of the upper area so they are readable
	const calculateInfoHeight = () => {
		// Header height is based on the 'lg' font
		const headerHeight = fontSizesInPx[largeSize] * 2.5;
		// Base height is 1/4 the area
		const base = (height - headerHeight) / 4;
		// Max height is 1/2 the area
		const max = (height / 2) - headerHeight;
		// fontSize is an estimate of the amount of space the font takes up
		const fontSize = fontSizesInPx[textSize];
		// return a value at least `base`, but modified by `fontSize`
		//    to a point no greater than `max`
		return Math.min(max, Math.max(base, fontSize * 12));
	};
	const infoHeight = calculateInfoHeight();
	const renderList = ({item}) => {
		const id = item.id;
		const cols = item.columns;
		return (
			<SwipeableItem
				renderUnderlayRight={() => <Underlay fontSize={textSize} onPress={() => startEditingFunc(item)} />}
				renderUnderlayLeft={() => <Underlay left fontSize={textSize} onPress={() => maybeDeleteItemFunc(item)} />}
				snapPointsLeft={[150]}
				snapPointsRight={[150]}
				swipeEnabled={true}
				activationThreshold={5}
				key={id}
			>
				<HStack
					py={3.5}
					px={0}
					alignItems="center"
					borderBottomWidth={1}
					borderColor="main.700"
					bg="main.800"
				>
					<Box size="lexXs">
						<DragIndicatorIcon
							size={smallerSize}
							flexGrow={0}
							flexShrink={0}
							color="primary.600"
						/>
					</Box>
					{cols.map(
						(text, i) =>
							<Box px={1} size={getBoxSize(columns[i].size)} key={`${id}-Column-${i}`}>
								<Text fontSize={smallerSize} isTruncated={truncateColumns} fontFamily={fontType}>{text}</Text>
							</Box>
						)
					}
					<Box size="lexXs">
						<DragIndicatorIcon
							size={smallerSize}
							flexGrow={0}
							flexShrink={0}
							color="primary.600"
						/>
					</Box>
				</HStack>
			</SwipeableItem>
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
							color: "warning.50",
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
						id: "willDeleteItem",
						properties: {
							continueText: "Yes, Delete It",
							continueFunc: doDeleteItemFunc,
							cancelText: "No, Don't Delete",
							cancelFunc: cancelDeleteFunc,
							bodyContent: `${deletingItem && deletingItem.text}\n\nDo you want to delete this? It cannot be undone.`
						}
					},
					{
						id: "willClearLexicon",
						properties: {
							continueText: "Yes",
							continueFunc: doClearLexicon,
							continueProps: { scheme: "danger" },
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
							continueProps: { scheme: "danger" },
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
									color: "primary.50"
								}
							},
							headerContent: "Where to Save?",
							bodyContent: (
								<VStack
									justifyContent="center"
									alignItems="center"
									w="full"
									space={4}
									flex={1}
									m={2}
								>
									<Button
										onPress={() => {
											setAlertOpen(false);
											doSaveNewLexicon();
										}}
										scheme="primary"
										_text={{
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
											scheme="secondary"
											_text={{
												fontSize: largeSize
											}}
											px={2.5}
											py={1.5}
										>Overwrite Previous Save</Button>
									}
								</VStack>
							),
							overrideButtons: [
								({leastDestructiveRef}) => <Button
									onPress={() => {
										setAlertOpen(false);
									}}
									bg="darker"
									ref={leastDestructiveRef}
									color="text.50"
									_pressed={{bg: "lighter"}}
									_text={{fontSize: textSize}}
									px={2}
									py={1}
								>Cancel</Button>
							]
						}
					},
					{
						id: "exportLexicon",
						properties: {
							fontSize: textSize,
							detatchButtons: true,
							headerProps: {
								bg: "primary.500",
								_text: {
									color: "primary.50"
								}
							},
							headerContent: "Choose an Export Format",
							bodyContent: (
								<VStack
									justifyContent="center"
									alignItems="center"
									w="full"
									space={3}
								>
									{exportFormats.map(({text, getInfo, extension = "txt", encoding = "plain", scheme = "secondary"}) => (
										<Button
											key={`button - ${text}`}
											onPress={async () => {
												setAlertOpen(false);
												setLoadingOverlayOpen("Exporting Lexicon...");
												return doExport(getInfo(), `Lexicon - ${title}.${extension}`, `text/${encoding}`).then((result) => {
													const {
														fail,
														filename
													} = result || { fail: true };
													doToast({
														toast,
														msg: fail || `Exported as "${filename}"`,
														scheme: fail ? "error" : "success",
														placement: "bottom",
														fontSize: textSize
													});
												}).finally(() => {
													setLoadingOverlayOpen(false);
												});
											}}
											scheme={scheme}
											_text={{
												fontSize: smallerSize,
												textAlign: "center"
											}}
											px={2.5}
											py={1.5}
										>Export as {text}</Button>
									))}
								</VStack>
							),
							overrideButtons: [
								({leastDestructiveRef}) => <Button
									onPress={() => setAlertOpen(false)}
									bg="darker"
									ref={leastDestructiveRef}
									_text={{fontSize: textSize}}
									color="text.50"
									_pressed={{bg: "lighter"}}
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
							<Text color="primary.50" fontSize={textSize}>Load Lexicon</Text>
							<IconButton
								icon={<CloseCircleIcon size={textSize} />}
								onPress={() => setLoadLexicon(false)}
								variant="ghost"
								scheme="primary"
								px={0}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						{displayPreviousSaves()}
						<HStack justifyContent="center" alignItems="center">
							<Text flexShrink={1} textAlign="right" italic>How to Load:</Text>
							<DropDownMenu
								placement="top left"
								fontSize={textSize}
								menuSize={smallerSize}
								titleSize={smallerSize}
								labelFunc={() => loadingMethods[loadingMethod].desc}
								options={loadingMethods}
								title="How to Load Lexicon"
								buttonProps={{mx: 4, my: 2, flexShrink: 1}}
								isMarked={(key) => loadingMethods[loadingMethod].key === key}
							/>
						</HStack>
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
								_pressed={{bg: "darker"}}
								onPress={() => setLoadLexicon(false)}
							>Cancel</Button>
							<Button
								startIcon={<LoadIcon m={0} size={textSize} />}
								bg={loadChosen ? "success.500" : "muted.800"}
								scheme="success"
								_text={{fontSize: textSize}}
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
							<Text color="primary.50" fontSize={textSize}>Save Lexicon</Text>
							<IconButton
								scheme="primary"
								icon={<CloseCircleIcon size={textSize} />}
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
								_pressed={{bg: "darker"}}
								onPress={() => setSaveLexicon(false)}
							>Cancel</Button>
							<Button
								startIcon={<SaveIcon m={0} size={textSize} />}
								scheme="primary"
								_text={{fontSize: textSize}}
								p={1}
								m={2}
								onPress={() => {
									setSaveLexicon(false);
									doSaveNewLexicon();
								}}
							>New Save</Button>
							<Button
								startIcon={<SaveIcon m={0} size={textSize} />}
								_text={{fontSize: textSize}}
								scheme="success"
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
				color="primary.50"
				closeModal={() => setLoadingColumnsPicker(false)}
				endingFunc={doLoadLexicon}
				currentColumns={columns}
				incomingColumns={loadChosen ? storedCustomInfo[loadChosen][3] : []}
			/>
			<LoadingOverlay
				overlayOpen={loadingOverlayOpen !== false}
				colorFamily="secondary"
				contents={<Text fontSize={largeSize} color="secondary.50" textAlign="center">{loadingOverlayOpen}</Text>}
			/>
			<HStack alignItems="flex-start" justifyContent="flex-end">
				<AnimatePresence style={{flex: 1, alignItems: "flex-start", justifyContent: "flex-end"}}>
					{ minimizedInfo || (
						<MotiScrollView
							style={{ overflow: "hidden", flexGrow: 1, flexShrink: 0}}
							{...maybeAnimate(
								usedButton,
								fromToZero,
								{
									height: infoHeight
								},
								150
							)}
							key="scrolly"
						>
							<VStack pt={3} pl={3} pr={1} pb={0}>
								<ResettableTextSetting
									text="Lexicon Title:"
									defaultValue={title}
									onChangeText={(v) => debounce(
										() => dispatch(setTitle(v)),
										{ namespace: "LexTitle" }
									)}
									labelSize={textSize}
									inputProps={{mt: 2, ref: titleRef}}
									inputSize={smallerSize}
									placeholder="Usually the language name."
									reloadTrigger={reloadTrigger}
								/>
							</VStack>
							<VStack pl={3} pt={2} pr={1} pb={3}>
								<ResettableTextAreaSetting
									text="Description:"
									defaultValue={description}
									onChangeText={(v) => debounce(
										() => dispatch(setDesc(v)),
										{ namespace: "LexDesc" }
									)}
									labelSize={textSize}
									inputProps={{mt: 2, ref: descRef}}
									inputSize={smallerSize}
									rows={3}
									placeholder="A short description of this lexicon."
									reloadTrigger={reloadTrigger}
								/>
							</VStack>
						</MotiScrollView>
					)}
					<IconButton
						scheme="primary"
						variant="solid"
						icon={minimizedInfo ? <RestoreIcon /> : <MinimizeIcon />}
						_icon={{size: miniSize}}
						onPress={() => {
							setUsedButton(true);
							dispatch(setMinimizedInfo(!minimizedInfo));
						}}
						flexGrow={0}
						flexShrink={1}
						mt={3}
						mb={1}
						mr={3}
						p={1}
						size={miniSize}
						style={{
							height: fontSizesInPx[textSize] + 8, // padding
							width: fontSizesInPx[textSize] + 8
						}}
					/>
				</AnimatePresence>
			</HStack>
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
						alignContent="center"
						justifyContent="flex-end"
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
							scheme="secondary"
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
						<Menu
							placement="bottom right"
							closeOnSelect={true}
							trigger={(props) => (
								<IconButton
									p={1}
									px={1.5}
									ml={2}
									icon={<SettingsIcon name="settings" size={smallerSize} />}
									scheme="tertiary"
									flexGrow={0}
									flexShrink={0}
									{...props}
								/>
							)}
						>
							<Menu.Group
								title="Columns"
								_title={{fontSize: smallerSize, color: "primary.500"}}
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
						</Menu>
						<Menu
							placement="bottom right"
							closeOnSelect={true}
							trigger={(props) => (
								<IconButton
									p={1}
									px={1.5}
									ml={2}
									icon={<LoadSaveIcon size={smallerSize} />}
									scheme="tertiary"
									flexGrow={0}
									flexShrink={0}
									{...props}
								/>
							)}
						>
							<Menu.Group
								title="Lexicon"
								_title={{fontSize: smallerSize, color: "primary.500"}}
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
										dispatch(setMinimizedInfo(false));
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
										dispatch(setMinimizedInfo(false));
										return doToast({
											toast,
											msg: "Please create a title for your Lexicon before exporting.",
											scheme: "error",
											placement: "top",
											fontSize: textSize
										});
									}
									setAlertOpen('exportLexicon');
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
						<Box size="lexXxs"></Box>
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
					<HStack
						alignItems="center"
						px={1.5}
						pb={1}
						flexGrow={0}
						flexShrink={0}
						borderBottomWidth={1}
						borderColor="main.700"
					>
						<Box size="lexXxs"></Box>
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
								icon={<AddIcon size={smallerSize} />}
								accessibilityLabel="Add to Lexicon"
								scheme="success"
								onPress={() => addToLexicon()}
							/>
						</Box>
					</HStack>
					<GestureHandlerRootView flex={1}>
						<FlatList
							m={0}
							mb={1}
							data={lexicon}
							keyExtractor={(word) => word.id}
							ListEmptyComponent={ListEmpty}
							extraData={extraData}
							renderItem={renderList}
						/>
					</GestureHandlerRootView>
				</VStack>
			</VStack>
		</>
	);
};

export default Lex;
