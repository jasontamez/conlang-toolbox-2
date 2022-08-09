import React, { useEffect, useState } from 'react';
import {
	Input,
	VStack,
	HStack,
	IconButton,
	Button,
	Heading,
	Pressable,
	Center
} from 'native-base';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { Modal as ReactNativeModal, useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
	CloseCircleIcon,
	SaveIcon,
	DragHandleIcon
} from '../components/icons';
import { equalityCheck, modifyLexiconColumns } from '../store/lexiconSlice';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

const LexiconColumnReorderingShell = ({triggerOpen, clearTrigger}) => {
	const [reordering, setReordering] = useState(false);
	useEffect(() => {
		setReordering(triggerOpen);
	}, [triggerOpen]);
	return (
		<>
			<ReactNativeModal
				animationType="fade"
				onRequestClose={() => clearTrigger()}
				visible={reordering}
				transparent
			>
				<Center flex={1} bg="#000000cc">
					<LexiconColumnReorderer
						setReordering={setReordering}
					/>
				</Center>
			</ReactNativeModal>
		</>
	);
};

const LexiconColumnReorderer = ({setReordering}) => {
	const {columns} = useSelector((state) => state.lexicon, equalityCheck);
	const dispatch = useDispatch();
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
	const doClose = () => {
		setReordering(false);
	};
	const doSaveColumns = () => {
		dispatch(modifyLexiconColumns(newColumns));
		doClose();
	};
	const reorderColumns = (info) => {
		//let {from, to, data} = info;
		//let nCols = [...newColumns];
		//let moved = nCols[from];
		//nCols.splice(from, 1);
		//nCols.splice(to, 0, moved);
		//setNewColumns(nCols);
		//return nCols;
		setNewColumns(info.data.map(d => { return {...d} }));
	};
	// Data for sortable flatlist
	const renderItem = ({item, index, drag, isActive}) => {
		return (
			<Pressable onPressIn={drag}>
				<HStack
					alignItems="center"
					justifyContent="space-between"
					p={1}
					bg={isActive ? "main.700" : "main.800"}
					h={12}
				>
					<DragHandleIcon />
					<Input
						value={item.label}
						size="md"
						p={1}
						mx={4}
						disabled
					/>
				</HStack>
			</Pressable>
		);
	};
	// The actual flatlist
	const TheDrag = gestureHandlerRootHOC(() => (
		<DraggableFlatList
			data={newColumns}
			renderItem={renderItem}
			keyExtractor={(item, index) => item.id + "-" + String(index)}
			onDragEnd={(data) => reorderColumns(data)}
			dragItemOverflow
			style={{
				flex: 1,
				margin: 0,
				marginTop: 5,
				marginBottom: 5,
				width: minWidth,
				maxHeight: 480, // size 12 is 48px, so ten rows is 480
			}}
		/>
	));
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
			<HStack h={8} style={{width: minWidth}} pl={2} justifyContent="space-between" alignItems="center" space={3} bg="primary.500" borderTopRadius="lg">
				<Heading color="primaryContrast" size="md">Reorder Columns</Heading>
				<IconButton icon={<CloseCircleIcon color="primaryContrast" />} p={1} m={0} variant="ghost" onPress={() => doClose()} />
			</HStack>
			<VStack alignItems="center" bg="main.800" style={{height: Math.min(490, (newColumns.length * 48) + 10)}}>
				<TheDrag />
			</VStack>
			<HStack h={10} style={{width: minWidth}} justifyContent="flex-end" bg="main.700" borderBottomRadius="lg">
				<Button
					startIcon={<SaveIcon color="success.50" m={0} />}
					bg="success.500"
					disabled={newColumns.length === 0}
					onPress={() => doSaveColumns()}
					_text={{color: "success.50"}}
					px={1}
					py={0.5}
					m={1}
				>DONE</Button>
			</HStack>
		</VStack>
	);
};

export default LexiconColumnReorderingShell;
