import { useRef, useState } from 'react';
import {
	Input,
	Text,
	VStack,
	HStack,
	IconButton,
	Button,
	//Modal,
	Heading,
	Radio,
	Pressable,
	Factory,
	Center
} from 'native-base';
import DFL, { ShadowDecorator } from 'react-native-draggable-flatlist';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Modal as ModalRN } from 'react-native';
import { v4 as uuidv4 } from 'uuid';


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
	columns,
	maxColumns,
	saveColumnsFunc,
	deleteColumnFunc,
	endEditingColumnsFunc,
	screen
}) => {
	const DraggableFlatList = Factory(DFL);
	const Modal = Factory(ModalRN);
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
	const [newColumns, setNewColumns] = useState([]);
	const [active, setActive] = useState(false);
	const doneRef = useRef(null);
	const ModalContent = gestureHandlerRootHOC((props) => <VStack {...props} />)

	const doClose = () => {
		setActive(false);
		setNewColumns([]);
		endEditingColumnsFunc();
	};
	const AddColumnButton = () => {
		return columns.length === maxColumns ? <></> : (
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
		let id = "";
		do {
			id = uuidv4();
		} while(columns.some(c => c.id === id));
		setNewColumns([...newColumns, {
			id,
			label: "",
			size: "lexMd"
		}]);
	};
	const maybeSaveColumns = () => {
		// TO-DO
		// yes/no prompt?
		// detect columns without labels
		//saveItemFunc([...newLabels], [...newSizes]);
		doClose();
	};
	const reorderColumns = (info) => {
		let {from, to} = info;
		if(!active) {
			// We need to set everything up
			setNewColumns(getColumns());
			setActive(true);
		}
		let x = [...newColumns];
		let moved = x[from];
		x.splice(from, 1);
		x.splice(to, 0, moved);
		setNewColumns(x);
};
	const getColumns = () => columns.map(c => {return {...c}});
	// Data for sortable flatlist
	const renderItem = ({item, index, drag, isActive}) => {
		const {id, label, size} = item;
		return (
			<Pressable onLongPress={drag}>
				<HStack
					alignItems="center"
					justifyContent="space-between"
					p={1}
					w="full"
					borderBottomWidth={1}
					borderBottomColor="lighter"
					bg={isActive ? "main.700" : "main.800"}
				>
					<Text>{/* TO-DO drag handle */}[<DragHandleIcon />]</Text>
					<VStack px={4}>
						<Input
							defaultValue={label}
							size="md"
							p={1}
							onChangeText={(value) => {
								if(!active) {
									// We need to set everything up
									setNewColumns(getColumns());
									setActive(true);
								}
								item.label = value.trim();
								setNewColumns(newColumns);
							}}
						/>
						<Radio.Group
							colorScheme="primary"
							defaultValue={size}
							onChange={(value) => {
								if(!active) {
									// We need to set everything up
									setNewColumns(getColumns());
									setActive(true);
								}
								item.size = value;
								setNewColumns(newColumns);
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
							<Radio size="sm" value="lexLg">Large {String(isActive)}</Radio>
						</Radio.Group>
					</VStack>{/* TO-DO delete column */}
					<IconButton size="sm" alignSelf="flex-start" px={2} py={1} icon={<TrashIcon color="danger.50" size="sm" />} bg="danger.500" />
				</HStack>
			</Pressable>
		);
	};
	return (
		<Modal
			animationType="fade"
			onRequestClose={() => {}}
			visible={isEditing}
			transparent
			h={screen.height} w={screen.width}
		>
			<Center flex={1} h={screen.height} w={screen.width} bg="#000000cc">
				<ModalContent flex={1} borderRadius="lg" bg="main.900">
					<Center>
					<HStack pl={2} w="full" justifyContent="space-between" alignItems="center" bg="primary.500" borderTopRadius="lg">
						<Heading color="primaryContrast" size="md">Edit Lexicon Columns</Heading>
						<HStack justifyContent="flex-end" space={2}>
							<ExtraChars iconProps={{color: "primaryContrast", size: "sm"}} buttonProps={{p: 1, m: 0}} />
							<IconButton icon={<CloseCircleIcon color="primaryContrast" />} p={1} m={0} variant="ghost" onPress={() => doClose()} />
						</HStack>
					</HStack>
					<DraggableFlatList
						m={0}
						w="full"
						data={columns}
						renderItem={renderItem}
						keyExtractor={(item, index) => item.id + "-" + String(index)}
						onDragEnd={(data) => reorderColumns(data)}
						dragItemOverflow
					/>
					<HStack justifyContent="flex-end" w="full" bg="main.700" borderBottomRadius="lg">
						<AddColumnButton />
						<Button
							startIcon={<SaveIcon color="tertiary.50" m={0} />}
							bg="tertiary.500"
							onPress={() => maybeSaveColumns()}
							_text={{color: "tertiary.50"}}
							p={1}
							m={2}
							ref={doneRef}
						>DONE {screen.height}h {screen.width}w</Button>
					</HStack>
					</Center>
				</ModalContent>
			</Center>
		</Modal>
	);
};

const old = () => {
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
						data={columns}
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
	const labels = [];
	const sizes = [];
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
