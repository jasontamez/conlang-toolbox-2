import { useEffect, useRef, useState } from 'react';
import { useWindowDimensions  } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
	Input,
	ScrollView,
	Text,
	TextArea,
	VStack,
	FlatList,
	HStack,
	Box,
	IconButton,
	Menu,
	Button,
	useToast
} from 'native-base';

import debounce from '../components/debounce';
import {
	EditIcon,
	DoubleCaretIcon,
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
	changeSortDir,
	equalityCheck,
	editLexiconItem,
	consts
} from '../store/lexiconSlice';
import doToast from '../components/toast';
import ModalLexiconEditingItem from './LexEditItemModal';
import LexiconColumnEditorModal from './LexEditColumnsModal';
import LexiconColumnReorderingModal from './LexReorderColumnsModal';

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
		wrap,
		columns,
		sortDir,
		sortPattern,
		disableBlankConfirms
	} = useSelector((state) => state.lexicon, equalityCheck);
	const disableConfirms = useSelector((state) => state.appState.disableConfirms);
	const extraData = [wrap, columns];
	const isTruncated = !wrap;
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
	}, [columns]);
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
		}, [], 250, String(i));
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
				bg: "info.500",
				color: "info.50",
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
			bg: "danger.500",
			color: "danger.50",
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
	const renderList = ({item, index}) => {
		const id = item.id;
		const cols = item.columns;
		const bg = index % 2 ? "lighter" : "darker";
		const buttonProps =
			deletingMode ?
				{
					icon: <TrashIcon size="xs" color="danger.50" />,
					accessibilityLabel: "Mark for Deletion",
					bg: "danger." + (itemsToDelete.findIndex(itd => itd === id) >= 0 ? "400" : "700"),
					onPress: () => toggleMarkedForDeletion(id),
					p: 1,
					m: 0.5
				}
			:
				{
					icon: <EditIcon size="xs" color="primary.400" />,
					accessibilityLabel: "Edit",
					bg: "transparent",
					onPress: () => startEditingFunc(item),
					p: 1,
					m: 0.5
				};
		return (
			<HStack key={id} py={3.5} px={1.5} bg={bg}>
				{cols.map(
					(text, i) =>
						<Box px={1} size={columns[i].size} key={id + "-Column-" + String(i)}>
							<Text isTruncated={isTruncated}>{text}</Text>
						</Box>
					)
				}
				<Box size="lexXs">
					<IconButton {...buttonProps} />
				</Box>
			</HStack>
		);
	}
	const screenHeight = useWindowDimensions().height;
	//
	//
	// RETURN JSX
	//
	//
	return (
		<>
			<ScrollView flex={1}>
				<VStack m={3} mb={0}>
					<Text fontSize="sm">Lexicon Title:</Text>
					<Input
						mt={2}
						defaultValue={title}
						placeholder="Usually the language name."
						onChangeText={(v) => debounce(() => dispatch(setTitle(v)))}
					/>
				</VStack>
				<VStack m={3} mt={2}>
					<Text fontSize="sm">Description:</Text>
					<TextArea mt={2}
						defaultValue={description}
						placeholder="A short description of this lexicon."
						totalLines={3}
						onChangeText={(v) => debounce(() => dispatch(setDesc(v)))}
					/>
				</VStack>
			</ScrollView>
			<VStack
				flex={3}
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
									bg: "danger.500",
									_text: {
										color: "danger.50"
									}
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
									bg: "danger.500",
									_text: {
										color: "danger.50"
									}
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
					alignItems="flex-end"
				>
					<Box
						flexGrow={1}
						flexShrink={0}
						style={{minWidth: 110}}
					>
						<Text fontSize="2xl">{String(lexicon.length)} Word{maybePlural(lexicon.length)}</Text>
					</Box>
					<HStack
						mx={3}
						justifyContent="flex-end"
						alignItems="flex-end"
						flexGrow={0}
						flexShrink={0}
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
										flexBasis={0}
										_text={{
											color: "secondary.50",
											w: "full",
											isTruncated: true,
											textAlign: "left",
											noOfLines: 1,
											style: {
												overflow: "hidden"
											}
										}}
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
										startIcon={<DoubleCaretIcon mr={1} color="secondary.50" />}
										{...props}
									>
										{columns[sortPattern[0]].label}
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
							onPress={() => dispatch(changeSortDir(!sortDir))}
							icon={sortDir ? <SortUpIcon /> : <SortDownIcon />}
							p={1}
							_icon={{color: "secondary.50"}}
							bg="secondary.500"
							accessibilityLabel="Change sort direction."
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
								icon={<TrashIcon color="danger.50" />}
								bg="danger.500"
								onPress={() => maybeMassDelete()}
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
									icon={<SettingsIcon color="tertiary.50" name="settings" />}
									bg="tertiary.500"
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
					style={{maxHeight: screenHeight - 40}}
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
									px={0.5}
									key={col.id + "-ColumnLabel"}
									size={col.size}
								>
									<Text bold isTruncated={isTruncated}>{col.label}</Text>
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
								icon={<AddIcon size="xs" color="success.50" />}
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
