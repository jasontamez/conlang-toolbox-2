import {
	Text,
	HStack,
	Box,
	VStack,
	IconButton,
	Fab,
	Modal,
	useContrastText,
	Button,
	useToast,
	useTheme
} from "native-base";
import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, MotiView } from "moti";
import { useOutletContext } from "react-router-dom";
import { GestureHandlerRootView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import DraggableFlatList from "react-native-draggable-flatlist";

import {
	AddIcon,
	CloseCircleIcon,
	DragHandleIcon,
	EditIcon,
	ReorderIcon,
	StopIcon,
	TrashIcon
} from "./icons";
import { DropDown, TextSetting } from "./inputTags";
import StandardAlert from "./StandardAlert";
import ExtraChars from "./ExtraCharsButton";
import doToast from "../helpers/toast";
import ModalTransformEditingItem from "./ModalTransformEditor";
import { ensureEnd, saveOnEnd } from "../helpers/saveTextInput";
import getSizes from "../helpers/getSizes";
import { fontSizesInPx } from "../store/appStateSlice";
import uuidv4 from '../helpers/uuidv4';

//direction: both | in | out | double
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
	const [reordering, setReordering] = useState(false);
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
	const [movedTransform, setMovedTransform] = useState("");
	const [reorderedTransform, setReorderedTransform] = useState("");
	const [reorderedOrder, setReorderedOrder] = useState(false);
	const [reorderState, setReorderState] = useState(0);
	const [iconWidths, setIconWidths] = useState(0);

	const [textSize, fabSize, descSize] = getSizes("sm", "md", "xs");
	const emSize = fontSizesInPx[textSize] || fontSizesInPx.xs;
	const primaryContrast = useContrastText("primary.500");
	const colors = useTheme().colors;
	const highlightColor = colors.text["50"];
	const bgColor = colors.primary["500"];

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
		ensureEnd([refSearch, refReplace, refDescription]);
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

	const triggerReorder = (prop, finished) => {
		if(prop === "backgroundColor" && finished) {
			dispatch(rearrangeTransforms(reorderedOrder));
		}
	};
	const maybeEndReorder = (func) => {
		func('');
		const newState = reorderState - 1;
		setReorderState(newState);
		if(!newState) {
			// We're done
			setReorderState(0);
		}
	};
	// Once reordering is passed to redux state, allow the new
	//   positions to appear
	useEffect(() => {
		reorderedOrder && setReorderState(2);
		setReorderedOrder(false);
	}, [transforms]);
	const reorderAnimations = {
		basic: {
			animate: {
				opacity: 1,
				backgroundColor: bgColor
			}
		},
		// The tapped-on one, fading away
		reordering: {
			animate: {
				opacity: 0,
				backgroundColor: highlightColor
			},
			onDidAnimate: triggerReorder
		},
		// The tapped-on one, fading in
		reordered: {
			animate: {
				opacity: 1,
				backgroundcolor: bgColor
			},
			onDidAnimate: () => maybeEndReorder(setReorderedTransform),
			transition: {
				type: "timing",
				duration: 500
			}
		},
		// The other one, fading away
		moving: {
			animate: {
				opacity: 0,
				backgroundcolor: "#000000"
			}
		},
		// The other one, fading in
		moved: {
			animate: {
				opacity: 1,
				backgroundcolor: bgColor
			},
			onDidAnimate: () => maybeEndReorder(setMovedTransform)
		}
	};
	const findReorderState = (id) => {
		const {
			basic,
			moving,
			moved,
			reordering,
			reordered
		} = reorderAnimations;
		if(!reorderState) {
			// Do nothing
		} else if(id === movedTransform) {
			if(reorderState < 0) {
				return moving;
			}
			return moved;
		} else if (id === reorderedTransform) {
			if(reorderState < 0) {
				return reordering;
			}
			return reordered;
		}
		return basic;
	};

	// JSX
	const Unit = (props) => (
		<Box
			borderColor="text.50"
			borderWidth={1.5}
			py={1}
			px={2}
		>
			<Text fontSize={textSize} fontFamily="serif" bold {...props} />
		</Box>
	);
	const Arrow = (props) => <Text fontSize={textSize} {...props}>⟶</Text>;
	const Direction = ({direction}) => {
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
				<Text fontSize={descSize}>{msg}</Text>
			</Box>
		);
	};
	const Item = ({item, key}) => {
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
					<Unit>{search}</Unit>
					<Arrow />
					<Unit>{replace || " "}</Unit>
					{useDirection && <Direction direction={direction} />}
				</HStack>
				{description && <Text key={`${key}//desc`} italic fontSize={descSize}>{description}</Text>}
			</VStack>
		);
	};
	const directionTexts = {
		both: "at input, then undo at output",
		input: "at input only",
		output: "at output only",
		double: "at input, then again at output"
	};
	// TO-DO: Fix slowness issue
	// VirtualizedList: You have a large list that is slow to update - make sure
	//		your renderItem function renders components that follow React performance
	//		best practices like PureComponent, shouldComponentUpdate
	// I think I need to change these from icon-actions to Swipeables
	//		https://github.com/computerjazz/react-native-swipeable-item
	const renderItem = useCallback(({item, index, drag, isActive}) => {
		const {id} = item;
		const onPressIn = reordering ? drag : undefined;
		return (
			<TouchableWithoutFeedback
				onPressIn={onPressIn}
			>
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
					<MotiView
						animate={{
							width: reordering ? emSize * 1.25 : 0,
							scaleX: reordering ? 1 : 0
						}}
						transition={{
							type: "timing",
							duration: 300
						}}
					>
						<DragHandleIcon color="primary.500" size={textSize} />
					</MotiView>
					<Item
						item={item}
						key={`${id}-The-Transform`}
					/>
					{reordering ||
						<AnimatePresence key={`${id}-Editing-Buttons`}>
							<MotiView
								from={{
									width: iconWidths ? 0 : undefined,
									opacity: iconWidths ? 0 : 1
								}}
								animate={{
									width: iconWidths || undefined,
									opacity: 1
								}}
								exit={{
									width: 0,
									opacity: 0
								}}
								transition={{
									type: "timing",
									duration: 300
								}}
								style={{
									overflow: "hidden"
								}}
								key={`${id}/edit/delete`}
							>
								<HStack
									flexShrink={0}
									flexGrow={0}
									onLayout={(event => {
										const {width} = event.nativeEvent.layout;
										if(!iconWidths || width > iconWidths) {
											setIconWidths(width)
										}
									})}
								>
									<IconButton
										icon={<EditIcon color="primary.400" size={textSize} />}
										accessibilityLabel="Edit"
										bg="transparent"
										p={1}
										m={0.5}
										flexGrow={0}
										flexShrink={0}
										onPress={() => setEditingTransform(item)}
									/>
									<IconButton
										icon={<TrashIcon color="danger.400" size={textSize} />}
										accessibilityLabel="Delete"
										bg="transparent"
										p={1}
										m={0.5}
										flexGrow={0}
										flexShrink={0}
										onPress={() => maybeDeleteTransform(item)}
									/>
								</HStack>
							</MotiView>
						</AnimatePresence>
					}
				</HStack>
			</TouchableWithoutFeedback>
		);
	}, [reordering, emSize, textSize, iconWidths]);
	return (
		<VStack style={{height: viewHeight}} bg="main.900">
			<StandardAlert
				alertOpen={!!deletingTransform}
				setAlertOpen={setDeletingTransform}
				bodyContent={
					<Text fontSize={textSize}>Are you sure you want to delete the transform <Text bold>{transformDeleteString}</Text>? This cannot be undone.</Text>
				}
				continueText="Yes, Delete It"
				continueProps={{
					bg: "danger.500",
				}}
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
							<Text flex={1} px={3} fontSize={textSize} color={primaryContrast} textAlign="left">Add Transform</Text>
							<ExtraChars color={primaryContrast} size={textSize} buttonProps={{flexGrow: 0, flexShrink: 0}} />
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => closeAddTransform()}
								flexGrow={0}
								flexShrink={0}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack>
							<TextSetting
								text="Search Expression"
								placeholder="(what to replace)"
								inputProps={{ mt: 1, ref: refSearch, ...saveOnEnd(setAddSearch), fontSize: descSize }}
								boxProps={{ pb: 2 }}
								labelProps={{ fontSize: textSize }}
							/>
							<TextSetting
								text="Replacement Expression"
								placeholder="(what to replace with)"
								inputProps={{ mt: 1, ref: refReplace, ...saveOnEnd(setAddReplace), fontSize: descSize }}
								boxProps={{ py: 2 }}
								labelProps={{ fontSize: textSize }}
							/>
							<TextSetting
								text="Transformation Description"
								placeholder="(optional)"
								inputProps={{ mt: 1, ref: refDescription, ...saveOnEnd(setAddDescription), fontSize: descSize }}
								boxProps={{ pb: 2 }}
								labelProps={{ fontSize: textSize }}
							/>
							{useDirection &&
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
										fontSize={textSize}
										labelFunc={() => directionTexts[addDirection]}
										onChange={(v) => setAddDirection(v)}
										defaultValue={addDirection}
										title="When Used?"
										options={Object.keys(directionTexts).map(opt => {
											return {
												key: `${opt}-AddDirectionChoice`,
												value: opt,
												label: directionTexts[opt]
											};
										})}
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
							}
						</VStack>
					</Modal.Body>
					<Modal.Footer>
						<HStack justifyContent="flex-end" p={1} flexWrap="wrap">
							<Button
								startIcon={<AddIcon color="secondary.50" size={textSize} />}
								_text={{fontSize: textSize}}
								bg="secondary.500"
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
			{reordering ||
				<Fab
					bg="tertiary.500"
					renderInPortal={false}
					icon={<AddIcon color="tertiary.50" size={fabSize} />}
					accessibilityLabel="Add Transform"
					onPress={() => {
						setAddTransformOpen(true);
						setReordering(false);
					}}
				/>
			}
			<Fab
				bg="secondary.500"
				renderInPortal={false}
				icon={reordering ?
					<StopIcon color="secondary.50" size={fabSize} />
				:
					<ReorderIcon color="secondary.50" size={fabSize} />
				}
				accessibilityLabel={reordering ?
					"Stop Reordering"
				:
					"Reorder Transforms"
				}
				onPress={() => setReordering(!reordering)}
				placement="bottom-left"
			/>
			<GestureHandlerRootView>
				<DraggableFlatList
					data={transforms}
					renderItem={renderItem}
					keyExtractor={(item, index) => `${item.id}-${index}`}
					onDragEnd={(end) => {
						const { from, to, data } = end;
						from !== to && dispatch(rearrangeTransforms(data));
					}}
					autoscrollThreshold={20}
					containerStyle={{
						maxHeight: viewHeight
					}}
					ListFooterComponent={<Box h={20} />}
					initialNumToRender={renderNum}
				/>
			</GestureHandlerRootView>
		</VStack>
	);
};

export default Transformations;
