import React, { useEffect, useState } from 'react';
import {
	Input,
	VStack,
	HStack,
	IconButton,
	Button,
	Heading,
	Radio,
	Modal
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import ExtraChars from '../components/ExtraCharsButton';
import {
	CloseCircleIcon,
	SaveIcon,
	AddCircleIcon,
	TrashIcon
} from '../components/icons';
import { equalityCheck, modifyLexiconColumns } from '../store/lexiconSlice';
import { MultiAlert } from '../components/StandardAlert';

const LexiconColumnEditor = ({triggerOpen, clearTrigger}) => {
	const {columns, maxColumns, disableBlankConfirms} = useSelector((state) => state.lexicon, equalityCheck);
	const disableConfirms = useSelector(state => state.appState.disableConfirms);
	const [editing, setEditing] = useState(false);
	const [newColumns, setNewColumns] = useState([]);
	const [columnLabelsToBeDeleted, setColumnLabelsToBeDeleted] = useState([]);
	const [alertOpen, setAlertOpen] = useState('');
	const [savedIndex, setSavedIndex] = useState(null);
	const dispatch = useDispatch();
	useEffect(() => {
		// Load column info when mounted or when columns change.
		setNewColumns(columns.map(c => {return {...c}}));
	}, [columns]);
	useEffect(() => {
		setEditing(triggerOpen);
	}, [triggerOpen]);
	const doClose = () => {
		setColumnLabelsToBeDeleted([]);
		clearTrigger();
	};
	const AddColumnButton = () => {
		return newColumns.length === maxColumns ? <></> : (
			<Button
				startIcon={<AddCircleIcon color="tertiary.50" m={0} />}
				bg="tertiary.700"
				onPress={() => addNewColumnFunc()}
				_text={{color: "tertiary.50"}}
				p={1}
				m={2}
			>ADD</Button>
		);
	};
	const addNewColumnFunc = () => {
		// Adds a new column.
		let id = "";
		const nCols = [...newColumns];
		do {
			id = uuidv4();
		} while(newColumns.some(c => c.id === id));
		nCols.push({
			id,
			label: "",
			size: "lexMd"
		});
		setNewColumns(nCols);
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
		// Store index for the alert confirmation.
		setSavedIndex(index);
		// Ask.
		setAlertOpen('deleteColumn');
	};
	const doDeleteColumn = (index, addToDeleteReminder = true) => {
		// Save this deleted column's label
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
			return setAlertOpen('blankColumnLabel');
		}
		maybeSaveColumns2();
	};
	const maybeSaveColumns2 = () => {
		// see if we're deleting columns
		if(!disableConfirms && columnLabelsToBeDeleted.length > 0) {
			return setAlertOpen('finalDeleteColumn');
		}
		doSaveColumns();
	};
	const doSaveColumns = () => {
		dispatch(modifyLexiconColumns(newColumns));
		setColumnLabelsToBeDeleted([]);
		clearTrigger();
	};
	const fixColumnMismatch = () => {
		return columns.map(col => { return {...col} });
	};
	const renderItem = (col, i) => {
		const {id, label, size} = col;
		return (
			<HStack
				alignItems="center"
				justifyContent="space-between"
				p={1}
				borderTopWidth={i ? 1 : 0}
				borderTopColor="lighter"
				bg="main.800"
				key={id + "-Editable-" + String(i)}
			>
				<VStack px={4}>
					<Input
						defaultValue={label}
						size="md"
						p={1}
						onChangeText={(value) => {
							let newCols;
							if(newColumns[i].id !== id) {
								// Rendering mismatch?
								newCols = fixColumnMismatch();
							} else {
								newCols = [...newColumns];
							}
							const item = {
								id,
								label: value.trim(),
								size
							};
							newCols[i] = item;
							setNewColumns(newCols);
						}}
					/>
					<Radio.Group
						colorScheme="primary"
						defaultValue={size}
						onChange={(value) => {
							let newCols;
							if(newColumns[i].id !== id) {
								// Rendering mismatch?
								newCols = fixColumnMismatch();
							} else {
								newCols = [...newColumns];
							}
							const item = {
								id,
								label,
								size: value
							};
							newCols[i] = item;
							setNewColumns(newCols);
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
				<VStack justifyContent="space-between" alignItems="center">
					<IconButton
						size="sm"
						alignSelf="flex-start"
						p={1}
						mt={1}
						icon={<TrashIcon color="danger.50" size="sm" />}
						bg="danger.500"
						onPress={() => maybeDeleteColumn(col, i)}
					/>
				</VStack>
			</HStack>
		);
	};
	return (
		<>
			<Modal isOpen={editing}>
				<Modal.Content>
					<Modal.Header p={0} m={0}>
						<HStack pl={2} w="full" justifyContent="space-between" space={5} alignItems="center" bg="primary.500">
							<Heading color="primaryContrast" size="md">Edit Lexicon Columns</Heading>
							<HStack justifyContent="flex-end" space={2}>
								<ExtraChars iconProps={{color: "primaryContrast", size: "sm"}} buttonProps={{p: 1, m: 0}} />
								<IconButton icon={<CloseCircleIcon color="primaryContrast" />} p={1} m={0} variant="ghost" onPress={() => doClose()} />
							</HStack>
						</HStack>
					</Modal.Header>
					<Modal.Body m={0} p={0}>
						<VStack m={0} alignItems="center" justifyContent="center" bg="main.800">
							{newColumns.map((col, i) => renderItem(col, i))}
						</VStack>
					</Modal.Body>
					<Modal.Footer
						m={0}
						p={0}
						display="flex"
						justifyContent="flex-end"
						flexWrap="wrap"
						bg="main.700"
					>
						<AddColumnButton />
						<Button
							startIcon={<SaveIcon color="success.50" m={0} />}
							bg="success.500"
							onPress={() => {
								maybeSaveColumns()
							}}
							_text={{color: "success.50"}}
							p={1}
							m={2}
						>SAVE</Button>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<MultiAlert
				alertOpen={alertOpen}
				setAlertOpen={setAlertOpen}
				sharedProps={{}}
				passedProps={[
					{
						id: "deleteColumn",
						properties: {
							continueText: "Yes",
							continueFunc: () => doDeleteColumn(savedIndex),
							continueProps: {
								bg: "danger.500",
								_text: {
									color: "danger.50"
								}
							},
							bodyContent: "Deleting a column will destroy all data in the Lexicon associated with that column. Are you sure you want to do this?"
						}
					},
					{
						id: "blankColumnLabel",
						properties: {
							continueFunc: maybeSaveColumns2,
							bodyContent: "One or more of the column labels are blank. This may make it harder for you to read your Lexicon or sort it."
						}
					},
					{
						id: "finalDeleteColumn",
						properties: {
							headerContent: "Final Warning",
							continueFunc: doSaveColumns,
							continueText: "Yes, I am sure",
							continueProps: {
								bg: "danger.500",
								_text: {
									color: "danger.50"
								}
							},
							bodyContent: "Remember, you will be deleting all data associated with the column" +
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
								". Are you sure you want to do this?"
						}
					}
				]}
			/>
		</>
	);
};

export default LexiconColumnEditor;
