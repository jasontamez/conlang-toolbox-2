import { useRef, useState } from 'react';
import { useWindowDimensions  } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
	Input,
	FlatList,
	Text,
	VStack,
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
	AddIcon
} from '../components/icons';
import { MultiAlert } from '../components/StandardAlert';
import {
	addLexiconItem,
	deleteLexiconItem,
	changeSortOrder,
	changeSortDir,
	equalityCheck,
	editLexiconItem,
	consts
} from '../store/lexiconSlice';
import doToast from '../components/toast';
import ModalLexiconEditingItem from './LexEditItemModal';
import LexiconColumnEditorModal from './LexEditColumnsModal';

const Lex = () => {
	//
	//
	// GET DATA
	//
	//
	const dispatch = useDispatch();
	const {
		lexicon,
		wrap,
		columns,
		sortDir,
		sortPattern,
		disableBlankConfirms
	} = useSelector((state) => state.lexicon, equalityCheck);
	const disableConfirms = useSelector((state) => state.appState.disableConfirms);
	const extraData = [wrap, ...columns];
	const blankLexiconItemColumns = [];
	const labels = columns.map(c => {
		blankLexiconItemColumns.push("");
		return c.label;
	});
	const isTruncated = !wrap;
	const {absoluteMaxColumns} = consts;
	//
	//
	// GET STATE
	//
	//
	const [editingItemID, setEditingItemID] = useState(null);
	const [editingItemColumns, setEditingItemColumns] = useState([]);
	const [newLexiconItemColumns, setNewLexiconItemColumns] = useState([...blankLexiconItemColumns]);
	const [alertOpen, setAlertOpen] = useState(false);
	// Have to introduce a hard limit of 30 columns. (absoluteMaxColumns)
	// We have to create the exact same number of Refs each time we render.
	// 10 seems like a decent amount that would strain even a wide-screen
	//   tablet, so 3x that is a good upper bound.
	const newLexiconRefs = [];
	for(let i=1; i <= absoluteMaxColumns; i++) {
		newLexiconRefs.push(useRef(null));
	}
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
		disableConfirms ? doDeleteItem() : setAlertOpen("deleteLexiconItem");
	};
	const doDeleteItem = () => {
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
	const toast = useToast();
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
		doToast(toast, "Word Added");
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
	// TO-DO: DELETING AN ITEM
	//   Need context menu option to turn on mass-delete mode
	//
	//
	// RENDER
	//
	//
	const xsButtonProps = {
		p: 1,
		m: 0.5
	};
	const ListEmpty = <Box><Text>Nothing here yet.</Text></Box>;
	const renderList = ({item, index}) => {
		const id = item.id;
		const cols = item.columns;
		const bg = index % 2 ? "lighter" : "darker";
		return (
			<HStack key={id} py={3.5} px={1.5} bg={bg}>
				{cols.map(
					(text, i) =>
						<Box px={1} size={columns[i].size} key={id + "-" + String(i)}>
							<Text isTruncated={isTruncated}>{text}</Text>
						</Box>
					)
				}
				<Box size="lexXs">
					<IconButton
						icon={<EditIcon size="xs" color="primary.400" />}
						accessibilityLabel="Edit"
						bg="bg.400"
						onPress={() => startEditingFunc(item)}
						{...xsButtonProps}
					/>
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
		<VStack
			flex={3}
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
				saveItemFunc={saveItemFunc}
				deleteEditingItemFunc={deleteEditingItemFunc}
				endEditingFunc={endEditingFunc}
				columns={editingItemColumns}
				labels={labels}
			/>
			<MultiAlert
				alertOpen={alertOpen}
				setAlertOpen={setAlertOpen}
				sharedProps={{
					cancelProps: {bg: "darker"}
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
						id: "deleteLexiconItem",
						properties: {
							continueFunc: doDeleteItem,
							continueText: "Yes",
							bodyContent: (
								<VStack space={5} px={2} py={3}>
									<Text bold>{editingItemColumns.join(" / ")}</Text>
									<Text>Are you sure you want to delete this? This cannot be undone.</Text>
								</VStack>
							)
						}
					}
				]}
			/>
			<HStack mx={3} justifyContent="space-between" alignItems="flex-end">
				<Box minW="110px">
					<Text fontSize="2xl">{String(lexicon.length)} Word{lexicon.length === 1 ? "" : "s"}</Text>
				</Box>
				<HStack mx={3} justifyContent="flex-end" alignItems="flex-end" flex={1}>
					<Menu
						placement="top left"
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
							{columns.map((item, i) => <Menu.ItemOption key={item.id + "-Sorting"} value={i+1}>{item.label}</Menu.ItemOption>)}
						</Menu.OptionGroup>
					</Menu>
					<IconButton
						mr={2}
						onPress={() => dispatch(changeSortDir(!sortDir))}
						icon={sortDir ? <SortUpIcon /> : <SortDownIcon />}
						p={1}
						_icon={{color: "secondary.50"}}
						bg="secondary.500"
						accessibilityLabel="Change sort direction."
					/>
					<LexiconColumnEditorModal />
				</HStack>
			</HStack>
			<VStack flex={1} maxH={String(screenHeight - 40) + "px"}>
				<HStack alignItems="flex-end" pt={3.5} mx={2} flexGrow={1} flexShrink={1} flexBasis={40}>
					{columns.map((col, i) => <Box px={0.5} key={col.id + "-Col"} size={col.size}><Text bold isTruncated={isTruncated}>{col.label}</Text></Box>)}
					<Box size="lexXs"></Box>
				</HStack>
				<HStack alignItems="center" mx={1.5} mb={1} flexGrow={1} flexShrink={1} flexBasis={40}>
					{columns.map((col, i) => (
						<Box px={0.5} mx={0} size={col.size} key={col.id + "-Input"}>
							<Input w="full" p={0.5} ref={newLexiconRefs[i]} defaultValue={newLexiconItemColumns[i]} onChangeText={(v) => maybeUpdateText(v, i)} />
						</Box>
					))}
					<Box size="lexXs" ml={0.5}>
						<IconButton
							icon={<AddIcon size="xs" color="success.50" />}
							accessibilityLabel="Add to Lexicon"
							bg="success.500"
							onPress={() => addToLexicon()}
							{...xsButtonProps}
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
	);
};
 
export default Lex;
