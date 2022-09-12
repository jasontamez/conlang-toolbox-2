import React, { useEffect, useState } from 'react';
import {
	Text,
	VStack,
	HStack,
	IconButton,
	Button,
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
import { fontSizesInPx } from '../store/appStateSlice';

const LexiconColumnReorderingShell = ({triggerOpen, clearTrigger}) => {
	return (
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
	const textSize = useBreakpointValue(sizes.sm);
	const lineHeight = fontSizesInPx[textSize] * 2;
	const [newColumns, setNewColumns] = useState([]);
	const {height, width} = useWindowDimensions();
	const maxHeight = Math.floor(height * 0.8);
	const minWidth = Math.max(300, Math.floor(width * 0.8));

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
					style={{height: lineHeight + 8}}
				>
					<DragHandleIcon
						size={textSize}
						flexGrow={0}
						flexShrink={0}
					/>
					<Box
						py={1}
						px={2}
						bg="lighter"
						flex={1}
						mr={1}
					>
						<Text
							color="text.50"
							fontSize={textSize}
							isTruncated={true}
							style={{lineHeight: lineHeight - 4}}
						>{item.label}</Text>
					</Box>
				</HStack>
			</Pressable>
		);
	};
	const primaryContrast = useContrastText('primary.500');
	const modalHeight = ((lineHeight + 8) * newColumns.length) + 10 // drag area
		+ lineHeight + 4 // header
		+ lineHeight + 10; // footer
	return (
		<VStack
			flex={1}
			justifyContent="center"
			alignItems="center"
			borderRadius="lg"
			style={{
				maxHeight: Math.min(maxHeight, modalHeight),
				width: minWidth,
				height: modalHeight
			}}
		>
			<HStack
				style={{width: minWidth, height: lineHeight + 4}}
				pl={2}
				justifyContent="space-between"
				alignItems="center"
				bg="primary.500"
				borderTopRadius="lg"
				flexGrow={0}
				flexShrink={0}
			>
				<Text
					bold
					color={primaryContrast}
					fontSize={textSize}
					isTruncated
				>Reorder Columns</Text>
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
				flex={1}
			>
				<GestureHandlerRootView
					style={{
						flex: 1,
						margin: 0,
						marginTop: 5,
						marginBottom: 5,
						width: minWidth,
						maxHeight: ((lineHeight + 8) * 10) + 10 // ten rows
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
				flexGrow={0}
				flexShrink={0}
				style={{width: minWidth, height: lineHeight + 10}}
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
					mr={2}
				>DONE</Button>
			</HStack>
		</VStack>
	);
};

export default LexiconColumnReorderingShell;
