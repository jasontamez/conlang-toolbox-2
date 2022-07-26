import { useState } from 'react';
import {
	Input,
	VStack,
	HStack,
	IconButton,
	Button,
	Heading,
	Radio,
	Text,
	Pressable,
	Factory,
	Center,
	Modal as BaseModal
} from 'native-base';
import DFL, { ShadowDecorator } from 'react-native-draggable-flatlist';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Modal as ModalRN, Alert, Platform, useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import debounce from '../components/debounce';
import ExtraChars from '../components/ExtraCharsButton';
import {
	CloseCircleIcon,
	SaveIcon,
	AddCircleIcon,
	DragHandleIcon,
	TrashIcon,
	SettingsIcon,
	EditIcon
} from '../components/icons';
import { equalityCheck, modifyLexiconColumns } from '../store/lexiconSlice';

const LexiconColumnEditingShell = () => {
	const [active, setActive] = useState(false);
	const [columnToEdit, setColumnToEdit] = useState(false);
	const [editedColumn, setEditedColumn] = useState(false);
	const Modal = Factory(ModalRN);
	const doOpen = () => {
		setActive(true);
	};
	const doClose = () => {
		setActive(false);
	};
	return (
		<>
			<Modal
				animationType="fade"
				onRequestClose={() => {}}
				visible={active && !columnToEdit}
				transparent
			>
				<Center flex={1} bg="#000000cc">
					<LexiconColumnReorderer
						closeFunc={doClose}
						columnEditorProps={{
							columnToEdit,
							setColumnToEdit,
							editedColumn,
							setEditedColumn
						}}
					/>
				</Center>
			</Modal>
			<LexiconColumnEditor
				columnEditorProps={{
					columnToEdit,
					setColumnToEdit,
					setEditedColumn
				}}
			/>
			<IconButton
				px={3}
				py={1}
				icon={<SettingsIcon color="tertiary.50" name="settings" />}
				bg="tertiary.500"
				onPress={() => doOpen()}
			/>
		</>
	);
};

const LexiconColumnReorderer = ({closeFunc, columnEditorProps}) => {
	const {columns, maxColumns, disableBlankConfirms} = useSelector((state) => state.lexicon, equalityCheck);
	const disableConfirms = useSelector(state => state.appState.disableConfirms);
	const dispatch = useDispatch();
	const [newColumns, setNewColumns] = useState(columns.map(c => { return {...c} }));
	const [columnLabelsToBeDeleted, setColumnLabelsToBeDeleted] = useState([]);
	const [editingColumnIndex, setEditingColumnIndex] = useState(-1);
	const {setColumnToEdit, editedColumn, setEditedColumn} = columnEditorProps;
	const {height, width} = useWindowDimensions();
	const maxHeight = Math.floor(height * 0.8);
	const minWidth = Math.min(300, Math.floor(width * 0.8));
	const ModalGuts = gestureHandlerRootHOC((props) => <VStack {...props} />);
	const DraggableFlatList = Factory(DFL);

	//
	//
	// HANDLE EDITED COLUMN
	//
	//
	if(editedColumn) {
		// Something has changed.
		let newCols = [...newColumns];
		newCols[editingColumnIndex] = editedColumn;
		setNewColumns(newCols);
		setEditedColumn(false);
	}

	//
	//
	// REODRERING LEXICON COLUMNS MODAL
	//
	//
	const doClose = () => {
		closeFunc();
	};
	const AddColumnButton = () => {
		return newColumns.length === maxColumns ? <></> : (
			<Button
				startIcon={<AddCircleIcon color="tertiary.50" m={0} />}
				bg="tertiary.700"
				onPress={() => {
					addNewColumnFunc();
				}}
				_text={{color: "tertiary.50"}}
				p={1}
				m={2}
			>ADD COLUMN</Button>
		);
	};
	const addNewColumnFunc = () => {
		// Adds a new column.
		let id = "";
		do {
			id = uuidv4();
		} while(newColumns.some(c => c.id === id));
		setNewColumns([...newColumns, {
			id,
			label: "",
			size: "lexMd"
		}]);
	};
	const maybeDeleteColumn = (item, index) => {
		// Check if we need to make a yes/no prompt
		// Is this an existing column? (It may be one we made but haven't saved yet)
		if(!columns.some(c => c.id === item.id)) {
			// New, unsaved column. We can delete without hurting anything.
			return doDeleteColumn(index, false);
		} else if(disableConfirms) {
			// We are not bothering with destructuve yes/no prompts
			return doDeleteColumn(index);
		}
		// Ask.
		makeAlert(
			"Warning",
			"Deleting a column will destroy all data in the Lexicon associated with that column. Are you sure you want to do this?",
			() => doDeleteColumn(index),
			"Yes"
		);
	};
	const doDeleteColumn = (index, addToDeleteReminder = true) => {
		// Save this deleted column
		addToDeleteReminder && setColumnLabelsToBeDeleted([...columnLabelsToBeDeleted, newColumns[index].label]);
		// Reset the stored info
		// Actually do the deleting
		const newCols = newColumns.slice();
		newCols.splice(index, 1);
		setNewColumns(newCols);
	};
	const maybeSaveColumns = () => {
		// detect columns without labels
		if(!disableBlankConfirms && newColumns.some(nc => !nc.label)) {
			return makeAlert(
				"Warning",
				"One or more of the column labels are blank. This may make it harder for you to read your Lexicon or sort it.",
				maybeSaveColumns2
			);
		}
		maybeSaveColumns2();
	};
	const sizeObject = {
		lexSm: "Small",
		lexMd: "Medium",
		lexLg: "Large"
	};
	const maybeSaveColumns2 = () => {
		// see if we're deleting columns
		if(!disableConfirms && columnLabelsToBeDeleted.length > 0) {
			return makeAlert(
				"Final Warning",
				"Remember, you will be deleting all data associated with the column" +
					((columnLabelsToBeDeleted.length > 1)
						?
							 "s "
						:
							" ") +
					(
						columnLabelsToBeDeleted.length === 1
							?
								"\"" + columnLabelsToBeDeleted[0] + "\""
							: (
								columnLabelsToBeDeleted.length === 2
									?
										"\"" + columnLabelsToBeDeleted.join("\" and \"") + "\""
									: (
										columnLabelsToBeDeleted.map((dc, i) => {
											const test = i + 1;
											if(i === 0) {
												return "\"" + dc + "\"";
											} else if (test === columnLabelsToBeDeleted.length) {
												return ", and \"" + dc + "\"";
											}
											return ", \"" + dc + "\"";
										}).join('')
									)
							)
					) +
					". Are you sure you want to do this?",
				doSaveColumns,
				"Yes, I am sure"
			);
		}
		doSaveColumns();
	};
	const doSaveColumns = () => {
		dispatch(modifyLexiconColumns(newColumns));
		doClose();
	};
	const reorderColumns = (info) => {
		let {from, to} = info;
		let nCols = [...newColumns];
		let moved = nCols[from];
		nCols.splice(from, 1);
		nCols.splice(to, 0, moved);
		setNewColumns(nCols);
		return nCols;
	};
	// Data for sortable flatlist
	//TO-DO: limit to just the drag handle somehow?
	//         or just omit the drag handle?
	const renderItem = ({item, index, drag, isActive}) => {
		const {id, label, size} = item;
		return (
			<Pressable onLongPress={drag}>
				<HStack
					alignItems="center"
					justifyContent="space-between"
					p={1}
					borderBottomWidth={1}
					borderBottomColor="lighter"
					bg={isActive ? "main.700" : "main.800"}
				>
					<DragHandleIcon />
					<VStack px={4}>
						<Input
							defaultValue={label}
							size="md"
							p={1}
							disabled
							onBlurry={(e) => {
								//e.nativeEvent.text
								//e.target.value
								const { value } = e.target;
								let nCols = [...newColumns];
								nCols[index].label = value.trim();
								debounce(setNewColumns, [nCols]);
							}}
						/>
						<Text>Size: <Text fontFamily="mono" color="primary.200">[{sizeObject[size]}]</Text></Text>
					</VStack>
					<VStack justifyContent="space-between" alignItems="center">
						<IconButton
							size="sm"
							alignSelf="flex-end"
							p={1}
							icon={<EditIcon color="tertiary.50" size="sm" />}
							bg="tertiary.500"
							onPress={() => {
								setEditingColumnIndex(index);
								setColumnToEdit(item);
							}}
						/>
						<IconButton
							size="sm"
							alignSelf="flex-start"
							p={1}
							mt={1}
							icon={<TrashIcon color="danger.50" size="sm" />}
							bg="danger.500"
							onPress={() => maybeDeleteColumn(item, index)}
						/>
					</VStack>
				</HStack>
			</Pressable>
		);
	};
	return (
		<ModalGuts
			flex={1}
			justifyContent="center"
			alignItems="center"
			borderRadius="lg"
			style={{
				maxHeight: maxHeight,
				minWidth: minWidth
			}}
		>
			<HStack style={{minWidth: minWidth}} pl={2} justifyContent="space-between" alignItems="center" space={3} bg="primary.500" borderTopRadius="lg">
				<Heading color="primaryContrast" size="md">Edit Lexicon Columns</Heading>
				<IconButton icon={<CloseCircleIcon color="primaryContrast" />} p={1} m={0} variant="ghost" onPress={() => doClose()} />
			</HStack>
			<HStack style={{minWidth: minWidth}} alignItems="center" justifyContent="center" bg="main.800">
				<DraggableFlatList
					m={0}
					w="full"
					data={newColumns}
					renderItem={renderItem}
					keyExtractor={(item, index) => item.id + "-" + String(index)}
					onDragEnd={(data) => reorderColumns(data)}
					dragItemOverflow
				/>
			</HStack>
			<HStack style={{minWidth: minWidth}} justifyContent="flex-end" bg="main.700" borderBottomRadius="lg">
				<AddColumnButton />
				<Button
					startIcon={<SaveIcon color="success.50" m={0} />}
					bg="success.500"
					disabled={newColumns.length === 0}
					onPress={() => maybeSaveColumns()}
					_text={{color: "success.50"}}
					p={1}
					m={2}
				>DONE</Button>
			</HStack>
		</ModalGuts>
	);
};

	// LATEST ERROR:
	// cannot update outside of component
	//
	// need to either...
	// 1) expose the columns in the base component and alter them there
	//     (this will likely make the Modal flash)
	// 2) dispatch an event from the editor
	//     (will need to move blank-column-label logic to that editor)
	// 3) scrap dragging altogether and just use fancy arrow buttons
	//     (can go back to editing in-line again)

const LexiconColumnEditor = ({columnEditorProps}) => {
	const {columnToEdit, setColumnToEdit, setEditedColumn} = columnEditorProps;
	const [label, setLabel] = useState(false);
	const [size, setSize] = useState(false);
	return (
		<BaseModal isOpen={columnToEdit}>
			<BaseModal.Content>
				<BaseModal.Header>
						<Heading color="primaryContrast" size="md">Edit Lexicon Columns</Heading>
						<ExtraChars iconProps={{color: "primaryContrast", size: "sm"}} buttonProps={{p: 1, m: 0}} />
				</BaseModal.Header>
				<BaseModal.Body>
					<VStack alignItems="center" justifyContent="center" bg="main.800">
						<Input
							defaultValue={label || columnToEdit ? columnToEdit.label : "null"}
							size="md"
							p={1}
							onChangeText={(value) => {
								setLabel(value.trim());
							}}
						/>
						<Radio.Group
							colorScheme="primary"
							defaultValue={size || columnToEdit ? columnToEdit.size : "lexMd"}
							onChange={(value) => {
								setSize(value);
							}}
							d="flex"
							m={2}
							flexDirection="row"
							flexWrap="wrap"
							accessibilityLabel="Column Size"
							_stack={{
								justifyContent: "space-between",
								alignItems: "flex-start"
							}}
							_radio={{
								_stack: {
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "flex-start",
									m: 1
								}
							}}
						>
							<Radio size="sm" value="lexSm">Small</Radio>
							<Radio size="sm" value="lexMd">Med</Radio>
							<Radio size="sm" value="lexLg">Large</Radio>
						</Radio.Group>
					</VStack>
				</BaseModal.Body>
				<BaseModal.Footer>
					<HStack justifyContent="flex-end" bg="main.700" borderBottomRadius="lg">
						<Button
							startIcon={<SaveIcon color="success.50" m={0} />}
							bg="success.500"
							onPress={() => {
								setEditedColumn({
									id: columnToEdit.id,
									label: label === false ? columnToEdit.label : label,
									size: size === false ? columnToEdit.size : size
								});
								setColumnToEdit(false);
							}}
							_text={{color: "success.50"}}
							p={1}
							m={2}
						>SAVE COLUMN</Button>
					</HStack>
				</BaseModal.Footer>
			</BaseModal.Content>
		</BaseModal>
	);
};

const makeAlert = (title, description, continueFunc, continueText = "Continue") => {
	if(Platform.OS === "web") {
		if(confirm(title + ": " + description)) {
			continueFunc();
		}
	} else {
		// Android
		Alert.alert(
			title,
			description,
			[ // Button array
				{
					text: "Cancel"
				},
				{
					text: continueText,
					onPress: () => continueFunc()
				}
			],
			{
				cancelable: true
			}
		);
	}
};

export default LexiconColumnEditingShell;
