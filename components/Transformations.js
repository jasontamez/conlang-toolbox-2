import {
	Text,
	HStack,
	Box,
	VStack,
	Fab,
	Modal,
	useContrastText,
	useToast
} from "native-base";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { GestureHandlerRootView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import DraggableFlatList from "react-native-draggable-flatlist";
import SwipeableItem from 'react-native-swipeable-item';

import {
	AddIcon,
	CloseCircleIcon,
	DragIndicatorIcon
} from "./icons";
import Button from "./Button";
import IconButton from "./IconButton";
import { DropDown, TextSetting } from "./inputTags";
import StandardAlert from "./StandardAlert";
import doToast from "../helpers/toast";
import ModalTransformEditingItem from "./ModalTransformEditor";
import getSizes from "../helpers/getSizes";
import { fontSizesInPx } from "../store/appStateSlice";
import uuidv4 from '../helpers/uuidv4';
import Underlay from "./Underlay";

const Unit = (props) => (
	<Box
		borderColor="text.50"
		borderWidth={1.5}
		py={1}
		px={2}
	>
		<Text fontFamily="serif" bold {...props} />
	</Box>
);
const Direction = ({direction, fontSize}) => {
	// input only
	// output only
	// input, then reverse at output
	// input, again at output
	let msg = "ERROR";
	switch(direction) {
		case "input":
			msg = "[input only]";
			break;
		case "output":
			msg = "[output only]";
			break;
		case "both":
			msg = "[input, then undo]";
			break;
		case "double":
			msg = "[input and output]";
			break;
	}
	return (
		<Box bg="lighter" mx={1} px={1.5} py={0.5}>
			<Text fontSize={fontSize}>{msg}</Text>
		</Box>
	);
};
const Item = ({item, key, fontSize, descSize, useDirection}) => {
	const { search, replace, description, direction } = item;
	return (
		<VStack
			alignItems="flex-start"
			justifyContent="center"
			flexGrow={1}
			flexShrink={1}
			overflow="hidden"
			pl={2}
		>
			<HStack
				alignItems="center"
				justifyContent="flex-start"
				overflow="hidden"
				space={2}
			>
				<Unit fontSize={fontSize}>{search}</Unit>
				<Text fontSize={fontSize}>⟶</Text>
				<Unit fontSize={fontSize}>{replace || " "}</Unit>
				{useDirection && <Direction fontSize={descSize} direction={direction} />}
			</HStack>
			{!!description && <Text key={`${key}//desc`} italic fontSize={fontSize} noOfLines={1}>{description}</Text>}
		</VStack>
	);
};
const directionTexts = {
	both: "at input, then undo at output",
	input: "at input only",
	output: "at output only",
	double: "at input, then again at output"
};
const directionOptions = Object.keys(directionTexts).map(opt => ({
	key: `${opt}-AddDirectionChoice`,
	value: opt,
	label: directionTexts[opt]
}));


const Transformations = ({
	useDirection,
	selector,
	addTransform,
	editTransform,
	deleteTransform,
	rearrangeTransforms,
}) => {
	const { transforms } = useSelector(state => state[selector]);
	const { disableConfirms } = useSelector(state => state.appState);
	const dispatch = useDispatch();
	const toast = useToast();

	// useState
	const [editingTransform, setEditingTransform] = useState(false);
	const [addTransformOpen, setAddTransformOpen] = useState(false);
	const [addSearch, setAddSearch] = useState("");
	const [addReplace, setAddReplace] = useState("");
	const [addDescription, setAddDescription] = useState("");
	const [addDirection, setAddDirection] = useState("both");
	const refSearch = useRef(null);
	const refReplace = useRef(null);
	const refDescription = useRef(null);
	const [alertOpenError, setAlertOpenError] = useState(false);
	const [deletingTransform, setDeletingTransform] = useState(false);
	const [transformDeleteString, setTransformDeleteString] = useState("");

	const [textSize, fabSize, descSize] = getSizes("sm", "md", "xs");
	const emSize = fontSizesInPx[textSize] || fontSizesInPx.xs;

	const [appHeaderHeight, viewHeight, tabBarHeight] = useOutletContext();

	const [renderNum, setRenderNum] = useState(10);
	useEffect(() => {
		const estimatedRow = emSize * 3.5;
		setRenderNum(Math.ceil(viewHeight / estimatedRow));
	}, [viewHeight, emSize]);

	// Delete
	const maybeDeleteTransform = (transform = deletingTransform) => {
		if(disableConfirms) {
			return doDeleteTransform(transform);
		}
		setTransformDeleteString(
			transform.description ?
				"\""
				+ transform.description
				+ "\""
			:
			transform.search
				+ " ⟶ "
				+ transform.replace
		);
		setDeletingTransform(transform);
	};
	const doDeleteTransform = (transform = deletingTransform) => {
		dispatch(deleteTransform(transform.id));
		doToast({
			toast,
			placement: "bottom",
			msg: "Deleted",
			bg: "warning.500"
		});
		setEditingTransform(false);
		setDeletingTransform(false);
	};

	// Add Modal
	const clearAddTransformModal = () => {
		refSearch.current && refSearch.current.clear && refSearch.current.clear();
		refReplace.current && refReplace.current.clear && refReplace.current.clear();
		refDescription.current && refDescription.current.clear && refDescription.current.clear();
		setAddSearch("");
		setAddReplace("");
		setAddDescription("");
	};
	const closeAddTransform = () => {
		clearAddTransformModal();
		setAddTransformOpen(false);
	};
	const addNewTransform = (closeModal) => {
		let id;
		const search = addSearch.trim();
		const replace = addReplace.trim();
		const description = addDescription.trim();
		if(!search) {
			// If we have errors, abort with an alert
			setAlertOpenError(true);
			return;
		}
		clearAddTransformModal();
		do {
			id = uuidv4();
		} while(transforms.some(t => t.id === id));
		let newTransform = {
			id,
			search,
			replace
		};
		if(useDirection) {
			newTransform.direction = addDirection;
		}
		if(description) {
			newTransform.description = description;
		}
		dispatch(addTransform(newTransform));
		doToast({
			toast,
			placement: "top",
			msg: "Transform added!"
		});
		if(closeModal) {
			closeAddTransform();
		} else {
			clearAddTransformModal();
			refSearch.current && refSearch.current.focus && refSearch.current.focus();
		}
	};

	// JSX
	// !!!TO-DO: Fix slowness issue, ask online?
	// VirtualizedList: You have a large list that is slow to update - make sure
	//		your renderItem function renders components that follow React performance
	//		best practices like PureComponent, shouldComponentUpdate
	const renderItem = useCallback(({item, index, drag, isActive}) => {
		const {id} = item;
		const rightFunc = useCallback(() => setEditingTransform(item), []);
		const leftFunc = useCallback(() => maybeDeleteTransform(item), []);
		const underlayRight = useCallback(() => <Underlay fontSize={textSize} onPress={rightFunc} />, [textSize, rightFunc]);
		const underlayLeft = useCallback(() => <Underlay left fontSize={textSize} onPress={leftFunc} />, [textSize, leftFunc]);
		return (
			<SwipeableItem
				renderUnderlayRight={underlayRight}
				renderUnderlayLeft={underlayLeft}
				snapPointsLeft={[150]}
				snapPointsRight={[150]}
				swipeEnabled={true}
				activationThreshold={8}
			>
				<TouchableWithoutFeedback onLongPress={drag}>
					<HStack
						alignItems="center"
						justifyContent="flex-start"
						borderBottomWidth={1}
						borderColor="main.700"
						py={2.5}
						px={2}
						bg={isActive ? "main.700" : "main.800"}
						w="full"
					>
						<DragIndicatorIcon
							size={textSize}
							flexGrow={0}
							flexShrink={0}
							color="primary.600"
						/>
						<Item
							item={item}
							key={`${id}-The-Transform`}
							useDirection={useDirection}
							fontSize={textSize}
							descSize={descSize}
						/>
						<DragIndicatorIcon
							size={textSize}
							flexGrow={0}
							flexShrink={0}
							color="primary.600"
						/>
					</HStack>
				</TouchableWithoutFeedback>
			</SwipeableItem>
		);
	}, [textSize]);
	const MaybeDirection = ({useDirection, direction}) => {
		if(!useDirection) {
			return <></>;
		}
		const labelFunc = useCallback(() => directionTexts[direction], [direction, directionTexts]);
		const onChange = useCallback((v) => setAddDirection(v), []);
		return (
			<HStack
				space={1}
				flexWrap="wrap"
				alignItems="center"
				justifyContent="flex-start"
				key="ModalDirectionality"
			>
				<Text fontSize={textSize}>Transform:</Text>
				<DropDown
					placement="top right"
					bg="lighter"
					color="text.50"
					pressedBg="darker"
					fontSize={textSize}
					labelFunc={labelFunc}
					onChange={onChange}
					defaultValue={direction}
					title="When Used?"
					options={directionOptions}
					buttonProps={{
						flex: 1,
						px: 2,
						_stack: {
							justifyContent: "flex-start",
							alignItems: "center",
							flex: 1,
							space: 0,
							style: {
								overflow: "hidden"
							}
						}
					}}
				/>
			</HStack>
		);
	};
	const keyExtractor = useCallback((item, index) => `${item.id}-${index}`, []);
	const dragEnd = useCallback((end) => {
		const { from, to, data } = end;
		from !== to && dispatch(rearrangeTransforms(data));
	}, []);
	return (
		<VStack style={{height: viewHeight}} bg="main.900">
			<StandardAlert
				alertOpen={!!deletingTransform}
				setAlertOpen={setDeletingTransform}
				bodyContent={
					<Text fontSize={textSize}>Are you sure you want to delete the transform <Text bold>{transformDeleteString}</Text>? This cannot be undone.</Text>
				}
				continueText="Yes, Delete It"
				continueProps={{ scheme: "danger" }}
				continueFunc={() => doDeleteTransform(deletingTransform)}
				fontSize={textSize}
			/>
			<StandardAlert
				alertOpen={alertOpenError}
				setAlertOpen={setAlertOpenError}
				headerContent="Cannot Save Group"
				headerProps={{
					bg: "error.500"
				}}
				bodyContent="Search expression not provided"
				overrideButtons={[
					({leastDestructiveRef}) => <Button
						onPress={() => setAlertOpenError(false)}
						ref={leastDestructiveRef}
					>Ok</Button>
				]}
				fontSize={textSize}
			/>
			<ModalTransformEditingItem
				transform={editingTransform}
				alertOpener={() => setAlertOpenError(true)}
				endEditingFunc={() => setEditingTransform(false)}
				maybeDeleteTransform={maybeDeleteTransform}
				editTransform={editTransform}
				useDirection={useDirection}
			/>
			<Modal isOpen={addTransformOpen}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center">
							<Text flex={1} px={3} fontSize={textSize} color="primary.50" textAlign="left">Add Transform</Text>
							<IconButton
								icon={<CloseCircleIcon size={textSize} />}
								onPress={() => closeAddTransform()}
								flexGrow={0}
								flexShrink={0}
								scheme="primary"
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack>
							<TextSetting
								text="Search Expression"
								placeholder="(what to replace)"
								inputProps={{ mt: 1, fontSize: descSize }}
								boxProps={{ pb: 2 }}
								labelProps={{ fontSize: textSize }}
								value={addSearch}
								onChangeText={setAddSearch}
							/>
							<TextSetting
								text="Replacement Expression"
								placeholder="(what to replace with)"
								inputProps={{ mt: 1, fontSize: descSize }}
								boxProps={{ py: 2 }}
								labelProps={{ fontSize: textSize }}
								value={addReplace}
								onChangeText={setAddReplace}
							/>
							<TextSetting
								text="Transformation Description"
								placeholder="(optional)"
								inputProps={{ mt: 1, fontSize: descSize }}
								boxProps={{ pb: 2 }}
								labelProps={{ fontSize: textSize }}
								value={addDescription}
								onChangeText={setAddDescription}
							/>
							<MaybeDirection useDirection={useDirection} direction={addDirection} />
						</VStack>
					</Modal.Body>
					<Modal.Footer>
						<HStack justifyContent="flex-end" p={1} flexWrap="wrap">
							<Button
								startIcon={<AddIcon size={textSize} />}
								_text={{fontSize: textSize}}
								scheme="secondary"
								px={2}
								py={1}
								mx={1}
								onPress={() => addNewTransform(false)}
							>Add</Button>
							<Button
								startIcon={<AddIcon size={textSize} />}
								_text={{fontSize: textSize}}
								px={2}
								py={1}
								onPress={() => addNewTransform(true)}
							>Add and Close</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<Fab
				bg="tertiary.500"
				renderInPortal={false}
				icon={<AddIcon color="tertiary.50" size={fabSize} />}
				accessibilityLabel="Add Transform"
				onPress={() => {
					setAddTransformOpen(true);
				}}
			/>
			<GestureHandlerRootView>
				<DraggableFlatList
					data={transforms}
					renderItem={renderItem}
					keyExtractor={keyExtractor}
					onDragEnd={dragEnd}
					autoscrollThreshold={20}
					containerStyle={{ maxHeight: viewHeight }}
					ListFooterComponent={<Box h={20} />}
					initialNumToRender={renderNum}
				/>
			</GestureHandlerRootView>
		</VStack>
	);
};

export default Transformations;
