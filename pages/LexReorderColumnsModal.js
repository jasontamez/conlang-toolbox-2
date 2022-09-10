import React, { useEffect, useState } from 'react';
import {
	Text,
	VStack,
	HStack,
	IconButton,
	Button,
	Heading,
	Pressable,
	Center,
	Box,
	useBreakpointValue,
	useContrastText
} from 'native-base';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Modal, useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
	CloseCircleIcon,
	SaveIcon,
	DragHandleIcon
} from '../components/icons';
import { equalityCheck, modifyLexiconColumns } from '../store/lexiconSlice';

const LexiconColumnReorderingShell = ({triggerOpen, clearTrigger}) => {
	return ( //TO-DO: Fix sizing of modal
		<>
			<Modal
				animationType="fade"
				onRequestClose={() => clearTrigger()}
				visible={triggerOpen}
				transparent
			>
				<Center flex={1} bg="#000000cc">
					<LexiconColumnReorderer
						doClose={clearTrigger}
					/>
				</Center>
			</Modal>
		</>
	);
};

const LexiconColumnReorderer = ({doClose}) => {
	const {columns} = useSelector((state) => state.lexicon, equalityCheck);
	const sizes = useSelector(state => state.appState.sizes);
	const dispatch = useDispatch();
	const textSize = useBreakpointValue(sizes.md);
	const [newColumns, setNewColumns] = useState([]);
	const {height, width} = useWindowDimensions();
	const maxHeight = Math.floor(height * 0.8);
	const minWidth = Math.min(300, Math.floor(width * 0.8));

	useEffect(() => {
		// Load column info when mounted or when columns change.
		setNewColumns(columns.map(c => { return {...c} }));
	}, [columns]);

	//
	//
	// REODRERING LEXICON COLUMNS MODAL
	//
	//
	const doSaveColumns = () => {
		dispatch(modifyLexiconColumns(newColumns));
		doClose();
	};
	const renderItem = ({item, drag, isActive}) => {
		return (
			<Pressable onPressIn={drag}>
				<HStack
					alignItems="center"
					justifyContent="space-evenly"
					p={1}
					bg={isActive ? "main.700" : "main.800"}
					h={12}
				>
					<DragHandleIcon fontSize={textSize} />
					<Box
						py={1}
						px={2}
						bg="lighter"
						style={{width: Math.round(minWidth * 0.8)}}
					>
						<Text color="text.50" fontSize={textSize} isTruncated={true}>{item.label}</Text>
					</Box>
				</HStack>
			</Pressable>
		);
	};
	const primaryContrast = useContrastText('primary.500');
	return (
		<VStack
			flex={1}
			justifyContent="center"
			alignItems="center"
			borderRadius="lg"
			style={{
				maxHeight: maxHeight,
				minWidth: minWidth,
				maxHeight: 562, // {12}*10 + {10} + {8} + 10px margin = 562
			}}
		>
			<HStack
				h={8}
				style={{width: minWidth}}
				pl={2}
				justifyContent="space-between"
				alignItems="center"
				space={3}
				bg="primary.500"
				borderTopRadius="lg"
				flex={2}
			>
				<Heading color={primaryContrast} size={textSize}>Reorder Columns</Heading>
				<IconButton
					icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
					p={1}
					m={0}
					variant="ghost"
					onPress={() => doClose()}
				/>
			</HStack>
			<VStack
				alignItems="center"
				bg="main.800"
				flex={5}
				style={{
					height: Math.min(490, (newColumns.length * 48) + 10)
				}}
			>
				<GestureHandlerRootView
					style={{
						flex: 1,
						margin: 0,
						marginTop: 5,
						marginBottom: 5,
						width: minWidth,
						maxHeight: 480, // size 12 is 48px, so ten rows is 480
					}}
				>
					<DraggableFlatList
						data={newColumns}
						renderItem={renderItem}
						keyExtractor={(item, index) => item.id + "-" + String(index)}
						onDragEnd={(data) => setNewColumns(data.data.map(d => { return {...d} }))}
					/>
				</GestureHandlerRootView>
			</VStack>
			<HStack
				h={10}
				flex={1}
				style={{width: minWidth}}
				justifyContent="flex-end"
				alignItems="center"
				bg="main.700"
				borderBottomRadius="lg"
			>
				<Button
					startIcon={<SaveIcon color="success.50" m={0} size={textSize} />}
					bg="success.500"
					disabled={newColumns.length === 0}
					onPress={() => doSaveColumns()}
					_text={{color: "success.50", fontSize: textSize}}
					px={1}
					py={0.5}
					m={1}
				>DONE</Button>
			</HStack>
		</VStack>
	);
};

export default LexiconColumnReorderingShell;
