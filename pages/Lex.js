import { Input, FlatList, Text, TextArea, VStack, HStack, Box, IconButton, Menu, Button, Modal, Pressable, Heading } from 'native-base';
import { useState } from 'react';
import { Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ExtraChars from '../components/ExtraCharsButton';
import {
	EditIcon,
	DoubleCaretIcon,
	SettingsIcon,
	SortDownIcon,
	SortUpIcon,
	CloseCircleIcon,
	TrashIcon,
	SaveIcon
} from '../components/icons';
import {
	setTitle,
	setDesc,
	addLexiconItem,
	deleteLexiconItem,
	reorganizeLexiconItems,
	changeSortOrder,
	changeSortDir,
	changeLexiconWrap,
	equalityCheck,
	editLexiconItem
} from '../store/lexiconSlice';

const EditingModal = ({isEditing, columns, labels, saveInfo, deleteInfo, endEditing}) => {
	//
	//
	// 	EDITING MODAL
	//
	//
	// (has to be separate to keep State updates from flickering this all the time)
	const [newFields, setNewFields] = useState([]);
	const [active, setActive] = useState(false);
	const doClose = () => {
		setActive(false);
		setNewFields([]);
		endEditing();
	};
	return (
		<Modal isOpen={isEditing} closeOnOverlayClick={false}>
			<Modal.Content>
				<Modal.Header m={0} p={0}>
					<HStack pl={2} w="full" justifyContent="space-between" space={5} alignItems="center" bg="primary.500">
						<Heading color="primaryContrast" size="md">Edit Lexicon Item</Heading>
						<HStack justifyContent="flex-end" space={2}>
							<ExtraChars iconProps={{color: "primaryContrast", size: "sm"}} buttonProps={{p: 1, m: 0}} />
							<IconButton icon={<CloseCircleIcon color="primaryContrast" />} p={1} m={0} variant="ghost" onPress={() => doClose()} />
						</HStack>
					</HStack>
				</Modal.Header>
				<Modal.Body m={0} p={0}>
					<VStack m={0} p={4} pb={10} space={6}>
						{columns.map((info, i) => {
							return (
								<VStack key={info + "-" + String(i)} >
									<Text fontSize="sm">{labels[i]}</Text>
									<Input
										defaultValue={info}
										size="md"
										onChangeText={(value) => {
											let fields = [...newFields];
											if(!active) {
												// We need to set everything up
												fields = [...columns];
												setActive(true);
											}
											fields.splice(i, 1, value);
											setNewFields([...fields]);
										}}
										onBlurry={(e) => {
											let value = e.target.value;
											if(!active) {
												// We need to set everything up
												let fields = [...columns];
												if(value !== undefined) {
													fields.splice(i, 1, value);
												}
												setNewFields([...fields]);
												setActive(true);
											} else if(value !== undefined && value !== newFields[i]) {
												let fields = [...newFields];
												fields.splice(i, 1, value);
												setNewFields(fields);
											}
										}}
									/>
								</VStack>
							);
						})}
					</VStack>
				</Modal.Body>
				<Modal.Footer m={0} p={0} borderTopWidth={0}>
					<HStack justifyContent="space-between" w="full">
						<Button
							startIcon={<TrashIcon color="danger.50" m={0} />}
							bg="danger.500"
							onPress={() => {
								// yes/no prompt
								setActive(false);
								deleteInfo();
							}}
							_text={{color: "danger.50"}}
							p={1}
							m={2}
						>DELETE ITEM</Button>
						<Button
							startIcon={<SaveIcon color="tertiary.50" m={0} />}
							bg="tertiary.500"
							onPress={() => {
								setActive(false);
								saveInfo([...newFields]);
							}}
							_text={{color: "tertiary.50"}}
							p={1}
							m={2}
						>SAVE ITEM</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};


const Lex = () => {
	//
	//
	// GET DATA
	//
	//
	const dispatch = useDispatch();
	const { title, description, lexicon, wrap, columns, sortDir, sortPattern } = useSelector((state) => state.lexicon, equalityCheck);
	const extraData = [wrap, columns];
	const labels = [];
	const sizes = columns.map(({label, size}) => {
		labels.push(label);
		return size;
	});
	const isTruncated = !wrap;
	//
	//
	// GET STATE
	//
	//
	const [editingID, setEditingID] = useState(null);
	const [editingColumns, setEditingColumns] = useState([]);
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
	// HANDLE EDITING MODAL
	//
	//
	const startEditing = (item) => {
		const {id, columns} = item;
		// set editing info
		setEditingColumns([...columns]);
		// open modal
		setEditingID(id);
	};
	const endEditing = () => {
		setEditingID(null);
		setEditingColumns([]);
	};
	const deleteInfo = () => {
		dispatch(deleteLexiconItem(editingID));
		endEditing();
	};
	const saveInfo = (columns) => {
		const edited = {
			id: editingID,
			columns: [...columns]
		};
		dispatch(editLexiconItem(edited));
		endEditing();
	};
	//
	//
	// RENDER
	//
	//
	const ListEmpty = <Box><Text>Nothing here yet.</Text></Box>;
	const renderList = ({item, index}) => {
		const {id, columns} = item;
		const bg = index % 2 ? "lighter" : "darker";
		return (
			<HStack key={id} py={3.5} px={1.5} bg={bg}>
				{columns.map(
					(text, i) =>
						<Box px={0.5} size={sizes[i]} key={id + "-" + String(i)}>
							<Text isTruncated={isTruncated}>{text}</Text>
						</Box>
					)
				}
				<Box size="lexXs">
					<IconButton
						icon={<EditIcon size="xs" color="primary.400" />}
						p={1}
						accessibilityLabel="Edit"
						bg="bg.400"
						onPress={() => startEditing(item)}
					/>
				</Box>
			</HStack>
		);
	}
	const screen = Dimensions.get("screen");
	return (
		<VStack flex={1}>
			<EditingModal isEditing={editingID !== null} saveInfo={saveInfo} deleteInfo={deleteInfo} endEditing={endEditing} columns={editingColumns} labels={labels} />
			<VStack m={3} mb={0}>
				<Text fontSize="sm">Lexicon Title:</Text>
				<Input
					mt={2}
					defaultValue={title}
					placeholder="Usually the language name."
					onChangeText={(v) => dispatch(setTitle(v))}
				/>
			</VStack>
			<VStack m={3} mt={2}>
				<Text fontSize="sm">Description:</Text>
				<TextArea mt={2}
					defaultValue={description}
					placeholder="A short description of this lexicon."
					totalLines={3}
					onChangeText={(v) => dispatch(setDesc(v))}
				/>
			</VStack>
			<HStack mx={3} justifyContent="space-between" alignItems="flex-end">
				<Text fontSize="2xl" flex="1 0 10">{String(lexicon.length)} Words</Text>
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
									flex="1 2 0%"
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
					<IconButton px={3} py={1} icon={<SettingsIcon color="tertiary.50" name="settings" />} bg="tertiary.500" />
				</HStack>
			</HStack>
			<VStack flex={1} maxH={String(screen.height - 40) + "px"}>
				<HStack alignItems="flex-end" pt={3.5} mx={1.5} flex="1 0 4">
					{columns.map((col, i) => <Box px={0.5} key={String(i) + "-Col"} size={col.size}><Text bold isTruncated={isTruncated}>{col.label}</Text></Box>)}
					{/* ... extra blank space here, with size="lexXs" */}
				</HStack>
				<HStack alignItems="flex-end" mx={1.5} mb={1} flex="1 0 4">
					{columns.map((col, i) => <Box px={0.5} mx={0} size={col.size} key={String(i) + "-Input"}><Input w="full" /></Box>)}
					{/* ... extra buttons here, with size="lexXs" */}
				</HStack>
				<FlatList
					m={0}
					mb={1}
					flex="1 1 0%"
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
