import {
	useBreakpointValue,
	Text,
	HStack,
	Box,
	ScrollView,
	VStack,
	IconButton,
	Fab,
	Modal,
	useContrastText,
	Button,
	useToast
} from "native-base";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import ReAnimated, {
	CurvedTransition,
	StretchInY,
	StretchOutY
} from "react-native-reanimated";

import {
	AddIcon,
	CloseCircleIcon,
	DownIcon,
	EditIcon,
	ReorderIcon,
	StopIcon,
	TrashIcon,
	UpIcon
} from "./icons";
import { TextSetting } from "./inputTags";
import StandardAlert from "./StandardAlert";
import ExtraChars from "./ExtraCharsButton";
import doToast from "../helpers/toast";
import ModalTransformEditingItem from "./ModalTransformEditor";
import { ensureEnd, saveOnEnd } from "../helpers/saveTextInput";

const Transformations = ({
	selector,
	addTransform,
	editTransform,
	deleteTransform,
	rearrangeTransforms,
}) => {
	const { transforms } = useSelector(state => state[selector]);
	const lastTransform = transforms.length - 1;
	const { sizes, disableConfirms } = useSelector(state => state.appState);
	const dispatch = useDispatch();
	const toast = useToast();
	const [reordering, setReordering] = useState(false);
	const [editingTransform, setEditingTransform] = useState(false);
	const [addTransformOpen, setAddTransformOpen] = useState(false);
	const [addSearch, setAddSearch] = useState("");
	const [addReplace, setAddReplace] = useState("");
	const [addDescription, setAddDescription] = useState("");
	const refSearch = useRef(null);
	const refReplace = useRef(null);
	const refDescription = useRef(null);
	const [alertOpenError, setAlertOpenError] = useState(false);
	const [deletingTransform, setDeletingTransform] = useState(false);
	const [transformDeleteString, setTransformDeleteString] = useState("");
	const textSize = useBreakpointValue(sizes.sm);
	const fabSize = useBreakpointValue(sizes.md);
	const descSize = useBreakpointValue(sizes.xs);
	const primaryContrast = useContrastText("primary.500");
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
	const moveUpInList = (item, i) => {
		if(i === 0) {
			return;
		}
		const pre = transforms.slice(0, i);
		const post = transforms.slice(i + 1);
		const moved = pre.pop();
		dispatch(rearrangeTransforms([...pre, item, moved, ...post]));
	};
	const moveDownInList = (item, i) => {
		if(i === lastTransform) {
			return;
		}
		const pre = transforms.slice(0, i);
		const post = transforms.slice(i + 1);
		const moved = post.shift();
		dispatch(rearrangeTransforms([...pre, moved, item, ...post]));
	};
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
	const Item = ({item, stackProps}) => {
		const { search, replace, description } = item;
		return (
			<VStack
				alignItems="flex-start"
				justifyContent="center"
				{...(stackProps || {})}
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
				</HStack>
				<Text italic fontSize={descSize}>{description}</Text>
			</VStack>
		);
	};
	return (
		<VStack h="full">
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
			<Fab
				bg="tertiary.500"
				renderInPortal={false}
				icon={<AddIcon color="tertiary.50" size={fabSize} />}
				accessibilityLabel="Add Transform"
				onPress={() => setAddTransformOpen(true)}
			/>
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
			<ScrollView bg="main.900">
				<ReAnimated.View
					entering={StretchInY}
					exiting={StretchOutY}
					layout={CurvedTransition}
				>
					{transforms.map((item, index) => (
						<HStack
							key={item.id}
							alignItems="center"
							justifyContent="flex-start"
							borderBottomWidth={0.5}
							borderColor="main.700"
							py={2.5}
							px={2}
							bg="main.800"
							w="full"
						>
							{reordering ?
								<IconButton
									key={item.id + "-reorder-up"}
									icon={<UpIcon color={index === 0 ? "transparent" : "primary.400"} size={textSize} />}
									accessibilityLabel="Move Up in List"
									bg={index === 0 ? "transparent" : "darker"}
									p={1}
									my={0.5}
									mr={2}
									flexGrow={0}
									flexShrink={0}
									onPress={() => moveUpInList(item, index)}
								/>
							:
								<React.Fragment key={item.id + "-No-Reordering-Button"}></React.Fragment>
							}
							<Item
								item={item}
								key={item.id + "-The-Transform"}
								stackProps={{
									flexGrow: 1,
									flexShrink: 1,
									overflow: "hidden"
								}}
							/>
							{reordering ?
								<IconButton
									key={item.id + "-reorder-down"}
									icon={<DownIcon color={index === lastTransform ? "transparent" : "primary.400"} size={textSize} />}
									accessibilityLabel="Move Down in List"
									bg={index === lastTransform ? "transparent" : "darker"}
									p={1}
									my={0.5}
									ml={2}
									flexGrow={0}
									flexShrink={0}
									onPress={() => moveDownInList(item, index)}
								/>
							:
								<React.Fragment key={item.id + "-Editing-Buttons"}>
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
								</React.Fragment>
							}
						</HStack>
					))}
				</ReAnimated.View>
				<Box h={20} bg="main.900" />
			</ScrollView>
		</VStack>
	);
};

export default Transformations;
