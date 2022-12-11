import React, { useCallback, useEffect, useState } from 'react';
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
	const headerHeight = lineHeight * 1.25;
	const footerHeight = lineHeight * 1.5;
	const rowHeight = lineHeight * 1.5;
	const renderItem = useCallback(({item, drag, isActive}) => {
		return (
			<Pressable onPressIn={drag}>
				<HStack
					alignItems="center"
					justifyContent="space-evenly"
					p={1}
					bg={isActive ? "main.700" : "main.800"}
					style={{height: rowHeight}}
				>
					<DragHandleIcon
						size={textSize}
						flexGrow={0}
						flexShrink={0}
					/>
					<HStack
						py={1}
						px={2}
						bg="lighter"
						flex={1}
						mr={1}
						alignItems="center"
						justifyContent="flex-start"
					>
						<Text
							color="text.50"
							fontSize={textSize}
							isTruncated={true}
							lineHeight={lineHeight}
						>{item.label}</Text>
					</HStack>
				</HStack>
			</Pressable>
		);
	}, [lineHeight, rowHeight, textSize]);
	const primaryContrast = useContrastText('primary.500');
	const modalHeight = (rowHeight * newColumns.length) + 10 // drag area
		+ headerHeight + footerHeight;
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
				style={{width: minWidth, height: headerHeight}}
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
						maxHeight: ((rowHeight * 1.5) * 10) + 10 // ten rows
					}}
				>
					<DraggableFlatList
						data={newColumns}
						renderItem={renderItem}
						keyExtractor={(item, index) => `${item.id}-${index}`}
						onDragEnd={(data) => setNewColumns(data.data.map(d => { return {...d} }))}
					/>
				</GestureHandlerRootView>
			</VStack>
			<HStack
				flexGrow={0}
				flexShrink={0}
				style={{width: minWidth, height: footerHeight}}
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
				>Done</Button>
			</HStack>
		</VStack>
	);
};

export default LexiconColumnReorderingShell;
