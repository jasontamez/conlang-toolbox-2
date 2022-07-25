import { useState } from 'react';
import {
	Input,
	VStack,
	HStack,
	IconButton,
	Button,
	Heading,
	Radio,
	Pressable,
	Factory,
	Center
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
	SettingsIcon
} from '../components/icons';
import { equalityCheck, modifyLexiconColumns } from '../store/lexiconSlice';

const LexiconColumnEditorShell = () => {
	const [active, setActive] = useState(false);
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
				visible={active}
				transparent
			>
				<Center flex={1} bg="#000000cc">
					<LexiconColumnEditor closeFunc={doClose} />
				</Center>
			</Modal>
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

const LexiconColumnEditor = ({closeFunc}) => {
	const {columns, maxColumns, disableBlankConfirms} = useSelector((state) => state.lexicon, equalityCheck);
	const disableConfirms = useSelector(state => state.appState.disableConfirms);
	const dispatch = useDispatch();
	const [newColumns, setNewColumns] = useState(columns.map(c => { return {...c} }));
	const [tempStoredInfo, setTempStoredInfo] = useState(columns.map(c => { return {...c} }));
	const [columnLabelsToBeDeleted, setColumnLabelsToBeDeleted] = useState([]);
	const {height, width} = useWindowDimensions();
	const maxHeight = Math.floor(height * 0.8);
	const minWidth = Math.min(300, Math.floor(width * 0.8));
	const widthStyle = { minWidth: minWidth };
	const ModalGuts = gestureHandlerRootHOC((props) => <VStack {...props} />);
	const DraggableFlatList = Factory(DFL);

	//
	//
	// EDITING LEXICON COLUMNS MODAL
	//
	//
	const doClose = () => {
		closeFunc();
	};
	const AddColumnButton = () => {
		return newColumns.length === maxColumns ? <></> : (
			<Button
				startIcon={<AddCircleIcon color="success.50" m={0} />}
				bg="success.500"
				onPress={() => {
					addNewColumnFunc();
				}}
				_text={{color: "success.50"}}
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
	//TO-DO: try to stop the de-focusing and re-rendering of
	//         the modal, perhaps by only modifying a separate
	//         state Array when labels/sizes are edited? Only
	//         modify the main State when reordering or deleting?
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
							onBlur={(e) => {
								//e.nativeEvent.text
								//e.target.value
								const { value } = e.target;
								let nCols = [...newColumns];
								nCols[index].label = value.trim();
								debounce(setNewColumns, [nCols]);
							}}
						/> {/* TO-DO: fix the editing problem with debounce */}
						<Radio.Group
							colorScheme="primary"
							defaultValue={size}
							onChange={(value) => {
								let nCols = [...newColumns];
								nCols[index].size = value;
								setNewColumns(nCols);
							}}
							d="flex"
							m={2}
							flexDirection="row"
							flexWrap="wrap"
							w="full"
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
					<IconButton
						size="sm"
						alignSelf="flex-start"
						px={2}
						py={1}
						icon={<TrashIcon color="danger.50" size="sm" />}
						bg="danger.500"
						onPress={() => maybeDeleteColumn(item, index)}
					/>
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
			<HStack style={widthStyle} pl={2} justifyContent="space-between" alignItems="center" space={3} bg="primary.500" borderTopRadius="lg">
				<Heading color="primaryContrast" size="md">Edit Lexicon Columns</Heading>
				<HStack justifyContent="flex-end" space={1}>
					<ExtraChars iconProps={{color: "primaryContrast", size: "sm"}} buttonProps={{p: 1, m: 0}} />
					<IconButton icon={<CloseCircleIcon color="primaryContrast" />} p={1} m={0} variant="ghost" onPress={() => doClose()} />
				</HStack>
			</HStack>
			<HStack style={widthStyle} alignItems="center" justifyContent="center" bg="main.800">
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
			<HStack style={widthStyle} justifyContent="flex-end" bg="main.700" borderBottomRadius="lg">
				<AddColumnButton />
				<Button
					startIcon={<SaveIcon color="tertiary.50" m={0} />}
					bg="tertiary.500"
					disabled={newColumns.length === 0}
					onPress={() => maybeSaveColumns()}
					_text={{color: "tertiary.50"}}
					p={1}
					m={2}
				>DONE</Button>
			</HStack>
		</ModalGuts>
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

export default LexiconColumnEditorShell;
