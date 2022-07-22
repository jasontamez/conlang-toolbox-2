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
	Radio,
	Pressable,
	Factory
} from 'native-base';
import DFL, { ShadowDecorator } from 'react-native-draggable-flatlist';

import ExtraChars from '../components/ExtraCharsButton';
import {
	CloseCircleIcon,
	SaveIcon,
	AddCircleIcon,
	DragHandleIcon,
	TrashIcon
} from '../components/icons';
import { gestureHandlerRootHOC, GestureHandlerRootView } from 'react-native-gesture-handler';



const ModalLexiconEditingColumns = ({
	isEditing,
	labels,
	sizes,
	columns, //?
	maxColumns,
	saveColumnsFunc,
	deleteColumnFunc,
	endEditingColumnsFunc
}) => {
	const DraggableFlatList = Factory(DFL);
	//
	//
	// EDITING LEXICON COLUMNS MODAL
	//
	//
	//
	// //
	// // PAGE INSTEAD OF MODAL?
	// // (It doesn't seem to be working on a bare page, though)
	// //
	//
	//
	//
	const [newLabels, setNewLabels] = useState([]);
	const [newSizes, setNewSizes] = useState([]);
	const [active, setActive] = useState(false);
	const doneRef = useRef(null);
	const ModalContent = gestureHandlerRootHOC((props) => <Modal.Content {...props} />)

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
			>{/* TO-DO */}ADD COLUMN</Button>
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
	// Data for sortable flatlist
	const renderItem = ({item, index, drag, isActive}) => {
		const size = sizes[index];
		return (
			<Pressable onLongPress={drag}>
				<HStack
					alignItems="center"
					justifyContent="space-between"
					p={1}
					w="full"
					borderBottomWidth={1}
					borderBottomColor="lighter"
				>
					<Text>{/* TO-DO drag handle */}[<DragHandleIcon />]</Text>
					<VStack px={4}>
						<Input
							defaultValue={item}
							size="md"
							p={1}
							onChangeText={(value) => {
								let fields = [...newLabels];
								if(!active) {
									// We need to set everything up
									fields = [...labels];
									setNewSizes([...sizes]);
									setActive(true);
								}
								//fields.splice(index, 1, value.trim());
								fields[index] = value.trim();
								setNewLabels(fields);
							}}
						/>
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
								//fields.splice(index, 1, value);
								fields[index] = value;
								setNewSizes(fields);	
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
							<Radio size="sm" value="lexSm">Small {String(item)}</Radio>
							<Radio size="sm" value="lexMd">Med {String(index)}</Radio>
							<Radio size="sm" value="lexLg">Large {String(isActive)}</Radio>
						</Radio.Group>
					</VStack>{/* TO-DO delete column */}
					<IconButton size="sm" alignSelf="flex-start" px={2} py={1} icon={<TrashIcon color="danger.50" size="sm" />} bg="danger.500" />
				</HStack>
			</Pressable>
		);
	};
	return (
		<Modal isOpen={isEditing} closeOnOverlayClick={false} initialFocusRef={doneRef}>
			<ModalContent borderRadius={0} w="full" h="full">
				<Modal.Header m={0} p={0} borderRadius={0}>
					<HStack pl={2} w="full" justifyContent="space-between" space={5} alignItems="center" bg="primary.500">
						<Heading color="primaryContrast" size="md">Edit Lexicon Columns</Heading>
						<HStack justifyContent="flex-end" space={2}>
							<ExtraChars iconProps={{color: "primaryContrast", size: "sm"}} buttonProps={{p: 1, m: 0}} />
							<IconButton icon={<CloseCircleIcon color="primaryContrast" />} p={1} m={0} variant="ghost" onPress={() => doClose()} />
						</HStack>
					</HStack>
				</Modal.Header>
				<Modal.Body m={0} p={0}></Modal.Body>
				<Modal.Footer
					m={0}
					p={0}
					w="full"
					borderTopWidth={0}
					bg="main.800"
					borderRadius={0}
					d="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
				>
					<DraggableFlatList
						m={0}
						w="full"
						bg="blue.900"
						data={labels}
						renderItem={renderItem}
						keyExtractor={(item, index) => item + "-" + String(index)}
						onDragEnd={(data) => console.log(data)}
						onDragBegin={(data) => console.log([0, data])}
						onDragRelease={(data) => console.log([1, data])}
						dragItemOverflow
					/>
					<HStack justifyContent="flex-end" w="full" bg="main.700">
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
			</ModalContent>
		</Modal>
	);
};

export default ModalLexiconEditingColumns;

const OldColumns = () => {
return					
	(<VStack m={0} p={4} pb={10} space={6}>
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
								accessibilityLabel="Column Size"
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
	</VStack>);
}
