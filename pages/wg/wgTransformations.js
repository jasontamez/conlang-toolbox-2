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

import {
	AddIcon,
	CloseCircleIcon,
	EditIcon,
	ReorderIcon,
	StopIcon,
	TrashIcon
} from "../../components/icons";
import { TextSetting } from "../../components/layoutTags";
import StandardAlert from "../../components/StandardAlert";
import { sizes } from "../../store/appStateSlice";
import {
	equalityCheck,
	addTransform,
	deleteTransform
} from "../../store/wgSlice";
import ExtraChars from "../../components/ExtraCharsButton";
import doToast from "../../components/toast";
import ModalTransformEditingItem from "./wgModalTransformEditor";

const WGTransformations = () => {
	const { transforms } = useSelector(state => state.wg, equalityCheck);
	const disableConfirms = useSelector(state => state.appState.disableConfirms);
	const dispatch = useDispatch();
	const toast = useToast();
	const [reordering, setReordering] = useState(false);
	const [editingTransform, setEditingTransform] = useState(false);
	const [addTransformOpen, setAddTransformOpen] = useState(false);
	const addSearchRef = useRef(null);
	const addReplaceRef = useRef(null);
	const addDescriptionRef = useRef(null);
	const [alertOpenError, setAlertOpenError] = useState(false);
	const [deletingTransform, setDeletingTransform] = useState(false);
	const textSize = useBreakpointValue(sizes.sm);
	const descSize = useBreakpointValue(sizes.xs);
	const primaryContrast = useContrastText("primary.500");
	const maybeDeleteTransform = (transform = deletingTransform) => {
		if(disableConfirms) {
			return doDeleteTransform(transform);
		}
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
		addSearchRef.current.value = "";
		addReplaceRef.current.value = "";
		addDescriptionRef.current.value = "";
	};
	const closeAddTransform = () => {
		clearAddTransformModal();
		setAddTransformOpen(false);
	};
	const addNewTransform = (closeModal) => {
		let id;
		const search = addSearchRef.current.value.trim();
		const replace = addReplaceRef.current.value.trim();
		const description = addDescriptionRef.current.value.trim();
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
		closeModal && setAddTransformOpen(false);
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
				alertOpen={deletingTransform}
				setAlertOpen={setDeletingTransform}
				bodyContent={
					<Text fontSize={textSize}>Are you sure you want to delete the transform <Text bold>{
						deletingTransform.description ?
							"\""
							+ deletingTransform.description
							+ "\""
						:
							deletingTransform.search
							+ " ⟶ "
							+ deletingTransform.replace
					}</Text>? This cannot be undone.</Text>
				}
				continueText="Yes, Delete It"
				continueProps={{
					bg: "danger.500",
				}}
				continueFunc={() => doDeleteTransform(deletingTransform)}
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
			/>
			<ModalTransformEditingItem
				transform={editingTransform}
				alertOpener={() => setAlertOpenError(true)}
				endEditingFunc={() => setEditingTransform(false)}
				maybeDeleteTransform={() => maybeDeleteTransform()}
				iconSize={descSize}
			/>
			<Modal isOpen={addTransformOpen}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center">
							<Text flex={1} px={3} fontSize={textSize} color={primaryContrast} justifySelf="flex-start">Add Character Group</Text>
							<ExtraChars color={primaryContrast} buttonProps={{size: textSize}} />
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => closeAddTransform()}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack>
							<TextSetting
								text="Search Expression"
								placeholder="(what to replace)"
								inputProps={{
									ref: addSearchRef,
									mt: 1
								}}
								boxProps={{ pb: 2 }}
							/>
							<TextSetting
								text="Replacement Expression"
								placeholder="(what to replace with)"
								boxProps={{ py: 2 }}
								inputProps={{
									ref: addReplaceRef,
									mt: 1
								}}
								onChangeText={(v) => setModifiedReplace(v)}
							/>
							<TextSetting
								text="Transformation Description"
								placeholder="(optional)"
								inputProps={{
									ref: addDescriptionRef,
									mt: 1
								}}
								boxProps={{ pb: 2 }}
							/>
						</VStack>
					</Modal.Body>
					<Modal.Footer>
						<HStack justifyContent="flex-end" p={1}>
							<Button
								startIcon={<AddIcon size={descSize} color="secondary.50" />}
								bg="secondary.500"
								px={2}
								py={1}
								mx={1}
								onPress={() => addNewTransform(false)}
							>ADD TRANSFORM</Button>
							<Button
								startIcon={<AddIcon size={descSize} />}
								px={2}
								py={1}
								onPress={() => addNewTransform(true)}
							>ADD AND CLOSE</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<Fab
				bg="tertiary.500"
				renderInPortal={false}
				icon={<AddIcon size={textSize} color="tertiary.50" />}
				accessibilityLabel="Add Transform"
				onPress={() => setAddTransformOpen(true)}
			/>
			<Fab
				bg="secondary.500"
				renderInPortal={false}
				icon={reordering ?
					<StopIcon size={useBreakpointValue(sizes.md)} color="secondary.50" />
				:
					<ReorderIcon size={useBreakpointValue(sizes.md)} color="secondary.50" />
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
				{transforms.map(item => (
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
						{reordering ? // Reorder up ONLY (no HStack)
							<HStack
								key={item.id + "-Reordering-Buttons"}
								mr={2}
								space={2}
							>
								<Text>UP</Text>
								<Text>DN</Text>
							</HStack>							
						:
							<React.Fragment key={item.id + "-No-Reordering-Buttons"}></React.Fragment>
						}
						<Item
							item={item}
							key={item.id + "-The-Item"}
							stackProps={{
								flexGrow: 1,
								flexShrink: 1,
								overflow: "hidden"
							}}
						/>
						{reordering ? // Reorder Down
							<React.Fragment key={item.id + "-No-Editing-Buttons"}></React.Fragment>
						:
							<React.Fragment key={item.id + "-Editing-Buttons"}>
								<IconButton
									icon={<EditIcon size={textSize} color="primary.400" />}
									accessibilityLabel="Edit"
									bg="transparent"
									p={1}
									m={0.5}
									flexGrow={0}
									flexShrink={0}
									onPress={() => setEditingTransform(item)}
								/>
								<IconButton
									icon={<TrashIcon size={textSize} color="danger.400" />}
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
				<Box h={20} bg="main.900" />
			</ScrollView>	
		</VStack>
	);
};

export default WGTransformations;