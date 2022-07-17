import { useRef, useState } from 'react';
import {
	Input,
	Text,
	VStack,
	HStack,
	IconButton,
	Button,
	Modal,
	Heading,
	Radio
} from 'native-base';

import ExtraChars from '../components/ExtraCharsButton';
import {
	CloseCircleIcon,
	SaveIcon,
	AddCircleIcon,
	DragHandleIcon,
	TrashIcon
} from '../components/icons';



const ModalLexiconEditingColumns = ({
	isEditing,
	labels,
	sizes,
	maxColumns,
	saveColumnsFunc,
	deleteColumnFunc,
	endEditingColumnsFunc
}) => {
	//
	//
	// EDITING LEXICON COLUMNS MODAL
	//
	//
	const [newLabels, setNewLabels] = useState([]);
	const [newSizes, setNewSizes] = useState([]);
	const [active, setActive] = useState(false);
	const doneRef = useRef(null);

	const doClose = () => {
		setActive(false);
		setNewLabels([]);
		setNewSizes([]);
		endEditingColumnsFunc();
	};
	const AddColumnButton = () => {
		return labels.length === maxColumns ? <></> : (
			<Button
				startIcon={<AddCircleIcon color="success.50" m={0} />}
				bg="success.500"
				onPress={() => {
					// TO-DO yes/no prompt
					//setActive(false);
					addNewColumnFunc();
				}}
				_text={{color: "success.50"}}
				p={1}
				m={2}
			>TO-DO ADD COLUMN</Button>
		);
	};
	const addNewColumnFunc = () => {
		// Adds a new column.
		setNewLabels([...newLabels, ""]);
		setNewSizes([...newSizes, "lexMd"]);
	};
	const maybeSaveColumns = () => {
		// TO-DO
		// yes/no prompt?
		// detect columns without labels
		//saveItemFunc([...newLabels], [...newSizes]);
		doClose();
};
	return (
		<Modal isOpen={isEditing} closeOnOverlayClick={false} initialFocusRef={doneRef}>
			<Modal.Content>
				<Modal.Header m={0} p={0}>
					<HStack pl={2} w="full" justifyContent="space-between" space={5} alignItems="center" bg="primary.500">
						<Heading color="primaryContrast" size="md">Edit Lexicon Columns</Heading>
						<HStack justifyContent="flex-end" space={2}>
							<ExtraChars iconProps={{color: "primaryContrast", size: "sm"}} buttonProps={{p: 1, m: 0}} />
							<IconButton icon={<CloseCircleIcon color="primaryContrast" />} p={1} m={0} variant="ghost" onPress={() => doClose()} />
						</HStack>
					</HStack>
				</Modal.Header>
				<Modal.Body m={0} p={0}>
					<VStack m={0} p={4} pb={10} space={6}>
						{labels.map((label, i) => {
							const size = sizes[i];
							return (
								<HStack key={label + "-" + String(i)} alignItems="center" justifyContent="space-between">
									<Text>{/* TO-DO drag handle */}<DragHandleIcon /></Text>
									<VStack px={4}>
										<Input
											defaultValue={label}
											size="md"
											onChangeText={(value) => {
												let fields = [...newLabels];
												if(!active) {
													// We need to set everything up
													fields = [...labels];
													setNewSizes([...sizes]);
													setActive(true);
												}
												//fields.splice(i, 1, value.trim());
												fields[i] = value.trim();
												setNewLabels(fields);
											}}
										/>
										<HStack alignItems="center" justifyContent="space-between">
											<Radio.Group
												colorScheme="primary"
												defaultValue={size}
												onChange={(value) => {
													let fields = [...newSizes];
													if(!active) {
														// We need to set everything up
														fields = [...sizes];
														setNewLabels([...labels]);
														setActive(true);
													}
													//fields.splice(i, 1, value);
													fields[i] = value;
													setNewSizes(fields);	
												}}
											>
												<Radio value="lexSm">Small</Radio>
												<Radio value="lexMd">Medium</Radio>
												<Radio value="lexLg">Large</Radio>
											</Radio.Group>
										</HStack>
									</VStack>
									<Text alignSelf="flex-start">{/* TO-DO delete column */}<TrashIcon color="danger.500" /></Text>
								</HStack>
							);
						})}
					</VStack>
				</Modal.Body>
				<Modal.Footer m={0} p={0} borderTopWidth={0}>
					<HStack justifyContent="flex-end" w="full">
						<AddColumnButton />
						<Button
							startIcon={<SaveIcon color="tertiary.50" m={0} />}
							bg="tertiary.500"
							onPress={() => maybeSaveColumns()}
							_text={{color: "tertiary.50"}}
							p={1}
							m={2}
							ref={doneRef}
						>DONE</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};

export default ModalLexiconEditingColumns;
