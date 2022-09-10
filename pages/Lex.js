import { useEffect, useRef, useState } from 'react';
import { useWindowDimensions  } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
	Input,
	ScrollView,
	Text,
	VStack,
	FlatList,
	HStack,
	Box,
	IconButton,
	Menu,
	Button,
	useToast,
	useBreakpointValue
} from 'native-base';

import debounce from '../helpers/debounce';
import {
	EditIcon,
	SortEitherIcon,
	SortDownIcon,
	SortUpIcon,
	AddIcon,
	SettingsIcon,
	TrashIcon
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
	consts
} from '../store/lexiconSlice';
import doToast from '../helpers/toast';
import ModalLexiconEditingItem from './LexEditItemModal';
import LexiconColumnEditorModal from './LexEditColumnsModal';
import LexiconColumnReorderingModal from './LexReorderColumnsModal';
import { TextAreaSetting, TextSetting } from '../components/layoutTags';
import { fontSizesInPx } from '../store/appStateSlice';
// TO-DO: Fix Menu sizes of sort menu/settings menu

const Lex = () => {
	//
	//
	// GET DATA
	//
	//
	const dispatch = useDispatch();
	const {
		title,
		description,
		lexicon,
		truncateColumns,
		columns,
		sortDir,
		sortPattern,
		disableBlankConfirms
	} = useSelector((state) => state.lexicon, equalityCheck);
	const { sizes, disableConfirms } = useSelector((state) => state.appState);
	const extraData = [truncateColumns, columns];
	const {absoluteMaxColumns} = consts;
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
			msg: String(amount) + " item" + maybePlural(amount) + " deleted"
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
	// RENDER
	//
	//
	const ListEmpty = <Box><Text>Nothing here yet.</Text></Box>;
	const { width, height } = useWindowDimensions();
	const smallerSize = useBreakpointValue(sizes.sm);
	const textSize = useBreakpointValue(sizes.md);
	const bigTextSize = useBreakpointValue(sizes.x2);
	const [] = useBreakpointValue({
		base: [1, 3],
	});
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
						<Box px={1} size={columns[i].size} key={id + "-Column-" + String(i)}>
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
			<ScrollView height={infoHeight} flexGrow={0} flexShrink={0}>
				<VStack m={3} mb={0}>
					<TextSetting
						text="Lexicon Title:"
						defaultValue={title}
						onChangeText={(v) => debounce(
							() => dispatch(setTitle(v)),
							{ namespace: "LexTitle" }
						)}
						labelProps={{fontSize: textSize}}
						inputProps={{mt: 2, fontSize: smallerSize}}
						placeholder="Usually the language name."
					/>
				</VStack>
				<VStack m={3} mt={2}>
					<TextAreaSetting
						text="Description:"
						defaultValue={description}
						onChangeText={(v) => debounce(
							() => dispatch(setDesc(v)),
							{ namespace: "LexDesc" }
						)}
						labelProps={{fontSize: textSize}}
						inputProps={{mt: 2, fontSize: smallerSize}}
						rows={3}
						placeholder="A short description of this lexicon."
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
					sharedProps={{}}
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
								bodyContent: "You have marked " + String(itemsToDelete.length) + " item" + maybePlural(itemsToDelete.length) + " for deletion. Do you want to delete them?"
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
									<Text>You are about to delete <Text bold>{String(itemsToDelete.length)}</Text> word{maybePlural(itemsToDelete.length)}. Are you sure? This cannot be undone.</Text>
								)
							}
						},
						{}
					]}
				/>
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
						<Text fontSize={bigTextSize} isTruncated>{String(lexicon.length)} Word{maybePlural(lexicon.length)}</Text>
					</Box>
					<HStack
						mx={3}
						style={{maxWidth: width - 110 - 36}}
						flexWrap="wrap"
					>
						<Menu
							placement="top right"
							closeOnSelect={true}
							trigger={
								(props) => (
									<Button
										p={1}
										ml={2}
										mr={1}
										bg="secondary.500"
										flexGrow={1}
										flexShrink={2}
										maxW={width / 2}
										_stack={{
											justifyContent: "space-between",
											alignItems: "center",
											flexGrow: 1,
											flexShrink: 1,
											flexBasis: 0,
											space: 0,
											style: {
												overflow: "hidden"
											}
										}}
										startIcon={<SortEitherIcon size={smallerSize} mr={1} color="secondary.50" flexGrow={0} flexShrink={0} />}
										{...props}
									>
										<Box
											overflow="hidden"
										>
											<Text fontSize={smallerSize} color="secondary.50" isTruncated textAlign="left" noOfLines={1}>{columns[sortPattern[0]].label}</Text>
										</Box>
									</Button>
								)
							}
						>
							<Menu.OptionGroup
								title="Sort By:"
								defaultValue={sortPattern[0]+1}
								type="radio"
								onChange={(v) => doSortBy(v)}
							>
								{
									columns.map((item, i) => (
										<Menu.ItemOption
											key={item.id + "-Sorting"}
											value={i+1}
										>
											{item.label}
										</Menu.ItemOption>
									))
								}
							</Menu.OptionGroup>
						</Menu>
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
						{deletingMode ?
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
						:
							<></>
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
							<Menu.Group title="Columns">
								<Menu.Item
									onPress={() => setModalOpen('edit')}
								>
									Edit Column Info
								</Menu.Item>
								<Menu.Item
									onPress={() => setModalOpen('reorder')}
								>
									Reorder Columns
								</Menu.Item>
							</Menu.Group>
							<Menu.OptionGroup
								title="Lexicon Entries"
								type="checkbox"
								value={deletingMode ? ["mass delete"] : []}
							>
								<Menu.ItemOption
									onPress={() => toggleDeletingMode()}
									value="mass delete"
								>
									Mass Delete Mode
								</Menu.ItemOption>
							</Menu.OptionGroup>
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
							columns.map((col, i) => (
								<Box
									pr={1}
									key={col.id + "-ColumnLabel"}
									size={col.size}
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
								size={col.size}
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
