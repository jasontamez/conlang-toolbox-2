import { useState } from 'react';
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
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';


import ExtraChars from '../components/ExtraCharsButton';
import {
	CloseCircleIcon,
	SaveIcon,
	AddCircleIcon,
	DragHandleIcon,
	TrashIcon,
	SettingsIcon
} from '../components/icons';
import { equalityCheck } from '../store/lexiconSlice';

const LexiconColumnEditor = ({
	saveColumnsFunc
}) => {
	const {columns, maxColumns} = useSelector((state) => state.lexicon, equalityCheck);
	const DraggableFlatList = Factory(DFL);
	const Modal = Factory(ModalRN);
	//
	//
	// EDITING LEXICON COLUMNS MODAL
	//
	//
	const [newColumns, setNewColumns] = useState([]);
	const [active, setActive] = useState(false);
	//const {width, height} = useWindowDimensions();
	const ModalContent = gestureHandlerRootHOC((props) => <VStack {...props} />)

	const doOpen = () => {
		setActive(true);
		setNewColumns(columns.map(c => {return {...c}}));
	};
	const doClose = () => {
		setActive(false);
		setNewColumns([]);
	};
	const AddColumnButton = () => {
		return newColumns.length === maxColumns ? <></> : (
			<Button
				startIcon={<AddCircleIcon color="success.50" m={0} />}
				bg="success.500"
				onPress={() => {
					// TO-DO yes/no prompt
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
		} while(newColumns.some(c => c.id === id));
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
		saveColumnsFunc(newColumns);
		doClose();
	};
	const reorderColumns = (info) => {
		let {from, to} = info;
		let nCols = [...newColumns];
		let moved = nCols[from];
		nCols.splice(from, 1);
		nCols.splice(to, 0, moved);
		setNewColumns(nCols);
	};
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
								item.label = value.trim();
								setNewColumns(newColumns);
							}}
						/>
						<Radio.Group
							colorScheme="primary"
							defaultValue={size}
							onChange={(value) => {
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
							<Radio size="sm" value="lexLg">Large</Radio>
						</Radio.Group>
					</VStack>{/* TO-DO delete column */}
					<IconButton size="sm" alignSelf="flex-start" px={2} py={1} icon={<TrashIcon color="danger.50" size="sm" />} bg="danger.500" />
				</HStack>
			</Pressable>
		);
	};
	return (<>
		<Modal
			animationType="fade"
			onRequestClose={() => {}}
			visible={active}
			transparent
			h="full"
			w="full"
		>
			<Center flex={1} h="full" w="full" bg="#000000cc">
				<ModalContent flex={1} justifyContent="center" alignItems="center" borderRadius="lg">
					<HStack pl={2} w="full" justifyContent="space-between" alignItems="center" space={3} bg="primary.500" borderTopRadius="lg">
						<Heading color="primaryContrast" size="md">Edit Lexicon Columns</Heading>
						<HStack justifyContent="flex-end" space={1}>
							<ExtraChars iconProps={{color: "primaryContrast", size: "sm"}} buttonProps={{p: 1, m: 0}} />
							<IconButton icon={<CloseCircleIcon color="primaryContrast" />} p={1} m={0} variant="ghost" onPress={() => doClose()} />
						</HStack>
					</HStack>
					<HStack w="full" alignItems="center" justifyContent="center" bg="main.800">
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
					<HStack justifyContent="flex-end" w="full" bg="main.700" borderBottomRadius="lg">
						<AddColumnButton />
						<Button
							startIcon={<SaveIcon color="tertiary.50" m={0} />}
							bg="tertiary.500"
							onPress={() => maybeSaveColumns()}
							_text={{color: "tertiary.50"}}
							p={1}
							m={2}
						>DONE</Button>
					</HStack>
				</ModalContent>
			</Center>
		</Modal>
		<IconButton
			px={3}
			py={1}
			icon={<SettingsIcon color="tertiary.50" name="settings" />}
			bg="tertiary.500"
			onPress={() => doOpen()}
		/>
	</>);
};

export default LexiconColumnEditor;
