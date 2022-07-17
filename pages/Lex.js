import { useRef, useState } from 'react';
import { Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
	Input,
	FlatList,
	Text,
	TextArea,
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
	SettingsIcon,
	SortDownIcon,
	SortUpIcon,
	AddIcon
} from '../components/icons';
import { MultiAlert } from '../components/StandardAlert';
import {
	setTitle,
	setDesc,
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
import ModalLexiconEditingColumns from './LexEditColumnsModal';

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
		disableBlankConfirms,
		maxColumns
	} = useSelector((state) => state.lexicon, equalityCheck);
	const disableConfirms = useSelector((state) => state.appState.disableConfirms);
	const extraData = [wrap, columns];
	const initCols = [];
	const labels = [];
	const sizes = columns.map(({label, size}) => {
		initCols.push("");
		labels.push(label);
		return size;
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
	const [addingColumns, setAddingColumns] = useState([...initCols]);
	const [alertOpen, setAlertOpen] = useState(false);
	// Have to introduce a hard limit of 30 columns.
	// We have to create the exact same number of Refs each time we render.
	// 10 seems like a decent amount that would strain even a wide-screen
	//   tablet, so 3x that is a good upper bound.
	const addingRefs = [];
	for(let i=1; i <= absoluteMaxColumns; i++) {
		addingRefs.push(useRef(null));
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
	// ADD/DELETE ITEM TO/FROM LEXICON
	//
	//
	const toast = useToast();
	const addToLexicon = () => {
		// Check for blank columns
		if(disableBlankConfirms || addingColumns.every((col) => col)) {
			// None? Or we don't care? Continue!
			return doAddToLexicon();
		}
		// We need to ask
		setAlertOpen("hasBlankColumns");
	}
	const doAddToLexicon = () => {
		// Does the actual work of adding to the Lexicon
		dispatch(addLexiconItem([...addingColumns]));
		setAddingColumns([...initCols]);
		doToast(toast, "Word Added");
		addingRefs.forEach(ref => {
			ref && ref.current && ref.current.clear();
		});
	};
	// TO-DO: DELETING AN ITEM
	const maybeUpdateText = (text, i) => {
		let newCols = [...addingColumns];
		newCols[i] = text;
		debounce(setAddingColumns, [newCols]);
	};
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
		const {id, columns} = item;
		const bg = index % 2 ? "lighter" : "darker";
		return (
			<HStack key={id} py={3.5} px={1.5} bg={bg}>
				{columns.map(
					(text, i) =>
						<Box px={1} size={sizes[i]} key={id + "-" + String(i)}>
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
	const screen = Dimensions.get("screen");
	//
	//
	// RETURN JSX
	//
	//
	return (
		<VStack flex={1}>
			<ModalLexiconEditingItem
				isEditing={editingItemID !== null}
				saveItemFunc={saveItemFunc}
				deleteEditingItemFunc={deleteEditingItemFunc}
				endEditingFunc={endEditingFunc}
				columns={editingItemColumns}
				labels={labels}
			/>
			<ModalLexiconEditingColumns
				isEditing={false}
				columns={columns}
				labels={labels}
				sizes={sizes}
				maxColumns={maxColumns}
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
			<HStack mx={3} justifyContent="space-between" alignItems="flex-end">
				<Box flex="1 0 10">
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
									flex="1 2 0"
									_text={{
										color: "secondary.50",
										w: "full",
										isTruncated: true,
										textAlign: "left",
										noOfLines: 1,
										style: {
											overflow: "hidden",
											textOverflow: "ellipsis"
										}
									}}
									_stack={{
										justifyContent: "space-between",
										alignItems: "center",
										flex: 1,
										space: 0,
										style: {
											overflow: "hidden",
											textOverflow: "ellipsis"
										}
									}}
									startIcon={<DoubleCaretIcon mr={1} color="secondary.50" />}
									{...props}
								>
									{labels[sortPattern[0]]}
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
							{labels.map((label, i) => <Menu.ItemOption key={label + "-" + i} value={i+1}>{label}</Menu.ItemOption>)}
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
					<IconButton
						px={3}
						py={1}
						icon={<SettingsIcon color="tertiary.50" name="settings" />}
						bg="tertiary.500"
						onPress={() => 222}
					/>
				</HStack>
			</HStack>
			<VStack flex={1} maxH={String(screen.height - 40) + "px"}>
				<HStack alignItems="flex-end" pt={3.5} mx={2} flex="1 0 4">
					{columns.map((col, i) => <Box px={0.5} key={String(i) + "-Col"} size={col.size}><Text bold isTruncated={isTruncated}>{col.label}</Text></Box>)}
					{/* ... extra blank space here, with size="lexXs" */}
					<Box size="lexXs"></Box>
				</HStack>
				<HStack alignItems="center" mx={1.5} mb={1} flex="1 0 4">
					{columns.map((col, i) => (
						<Box px={0.5} mx={0} size={col.size} key={String(i) + "-Input"}>
							<Input w="full" p={0.5} ref={addingRefs[i]} defaultValue={addingColumns[i]} onChangeText={(v) => maybeUpdateText(v, i)} />
						</Box>
					))}
					{/* ... add button here, with size="lexXs" */}
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
					flex="1 1"
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
