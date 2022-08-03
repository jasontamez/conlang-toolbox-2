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

// TO-DO:
// LATEST ERROR:
// index.js:1 Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
//at DraggableFlatListInner (http://localhost:19006/static/js/bundle.js:124775:37)
//at RefProvider (http://localhost:19006/static/js/bundle.js:126507:21)
//at AnimatedValueProvider (http://localhost:19006/static/js/bundle.js:125936:21)
//at PropsProvider (http://localhost:19006/static/js/bundle.js:126399:21)
//at DraggableFlatList
//at http://localhost:19006/static/js/bundle.js:95988:22

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
					borderTopWidth={1}
					borderTopColor={index ? "lighter" : "transparent"}
					bg={isActive ? "main.700" : "main.800"}
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
	return (
		<VStack
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
				<Heading color="primaryContrast" size="md">Reorder Columns</Heading>
				<IconButton icon={<CloseCircleIcon color="primaryContrast" />} p={1} m={0} variant="ghost" onPress={() => doClose()} />
			</HStack>
			<HStack style={{minWidth: minWidth}} alignItems="center" justifyContent="center" bg="main.800">
				<DraggableFlatList
					data={newColumns}
					renderItem={renderItem}
					keyExtractor={(item, index) => item.id + "-" + String(index)}
					onDragEnd={(data) => reorderColumns(data)}
					dragItemOverflow
					style={{
						flex: 1,
						margin: 0
					}}
				/>
			</HStack>
			<HStack style={{minWidth: minWidth}} justifyContent="flex-end" bg="main.700" borderBottomRadius="lg">
				<Button
					startIcon={<SaveIcon color="success.50" m={0} />}
					bg="success.500"
					disabled={newColumns.length === 0}
					onPress={() => doSaveColumns()}
					_text={{color: "success.50"}}
					p={1}
					m={2}
				>DONE</Button>
			</HStack>
		</VStack>
	);
};

export default LexiconColumnReorderingShell;
