import {
	useBreakpointValue,
	Text,
	HStack,
	Box,
	Switch,
	ScrollView,
	VStack,
	IconButton,
	Fab,
	Modal,
	useContrastText,
	Button,
	Center,
	Input,
	useToast
} from "native-base";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
	AddIcon,
	ChevronLeftIcon,
	CloseCircleIcon,
	EditIcon,
	EquiprobableIcon,
	SharpDropoffIcon,
	TrashIcon
} from "../../components/icons";
import { SliderWithLabels, TextSetting } from "../../components/layoutTags";
import StandardAlert from "../../components/StandardAlert";
import { sizes } from "../../store/appStateSlice";
import {
	addCharacterGroup,
	deleteCharacterGroup,
	setCharacterGroupDropoff
} from "../../store/wgSlice";
import ExtraChars from "../../components/ExtraCharsButton";
import doToast from "../../components/toast";


const WGChar = () => {
	const { characterGroups, characterGroupDropoff } = useSelector(state => state.wg);
	const { disableConfirms } = useSelector(state => state.appState);
	const dispatch = useDispatch();
	const addDescRef = useRef(null);
	const addLabelRef = useRef(null);
	const addRunRef = useRef(null);
	const [alertOpen, setAlertOpen] = useState(false);
	const [deletingGroup, setDeletingGroup] = useState(false);
	const [editingGroup, setEditingGroup] = useState(false);
	const [modifiedDesc, setModifiedDesc] = useState("");
	const [modifiedLabel, setModifiedLabel] = useState("");
	const [modifiedRun, setModifiedRun] = useState("");
	const [editOverrideSwitch, setEditOverrideSwitch] = useState(false);
	const [editOverrideValue, setEditOverrideValue] = useState(20);
	const [addGroupOpen, setAddGroupOpen] = useState(false);
	const [addOverrideSwitch, setAddOverrideSwitch] = useState(false);
	const [addOverrideValue, setAddOverrideValue] = useState(20);
	const toast = useToast();
	// add group
	const addNewGroup = (closeAfterAdd) => {
		// attempts to add the modal info as a new group
		const description = addDescRef.current.value;
		const label = addLabelRef.current.value;
		const run = addRunRef.current.value;
		const dropoff = addOverrideSwitch ? addOverrideValue : undefined;
		let msg = [];
		if(!label) {
			msg.push("Label not provided");
		} else if(characterGroups.some(group => group.label === label)) {
			msg.push("Label \"" + label + "\" is already in use")
		}
		if (!description) {
			msg.push("Title not provided");
		}
		if (!run) {
			msg.push("No characters assigned to the group")
		}
		if(msg.length > 0) {
			// If we have errors, abort with a toast
			doToast({
				toast,
				scheme: "error",
				duration: 3500,
				placement: "top",
				boxProps: {
					maxWidth: "3/4"
				},
				center: true,
				msg: "ERROR: " + msg.join(", ") + "."
			});
			return;
		}
		dispatch(addCharacterGroup({description, label, run, dropoff}));
		doToast({
			toast,
			placement: "top",
			msg: "Character Group added!"
		});
		closeAfterAdd && closeAddGroup();
	};
	const closeAddGroup = () => {
		// closes the adding modal
		addDescRef.current.value = "";
		addLabelRef.current.value = "";
		addRunRef.current.value = "";
		addOverrideSwitch && setAddOverrideSwitch(false);
		setAddGroupOpen(false);
	};
	// edit group
	const startEditGroup = (group) => {
		// Opens the editing modal and populates it
		const {label, description, run, dropoff} = group;
		setModifiedDesc(description);
		setModifiedLabel(label);
		setModifiedRun(run);
		if(dropoff !== undefined) {
			setEditOverrideSwitch(true);
			setEditOverrideValue(dropoff);
		}
		setEditingGroup(group);
	};
	// delete group
	const maybeDeleteGroup = (group) => {
		if(disableConfirms) {
			return doDeleteGroup(group);
		}
		setDeletingGroup(group);
	};
	const doDeleteGroup = (group = deletingGroup) => {
		dispatch(deleteCharacterGroup(group));
		// TO-DO: toast confirm?
	};
	const textSize = useBreakpointValue(sizes.sm);
	const descSize = useBreakpointValue(sizes.xs);
	const renderGroup = (group) => {
		const {label, run, description, dropoff} = group;
		return (
			<HStack
				justifyContent="space-between"
				alignItems="center"
				borderBottomWidth={0.5}
				borderColor="main.700"
				py={1.5}
				px={2}
				key={label}
				bg="main.800"
			>
				<VStack
					alignItems="flex-start"
					justifyContent="center"
				>
					<Text fontSize={textSize} isTruncated><Text bold>{label}</Text>={run}</Text>
					{description ? <Text italic fontSize={descSize} noOfLines={3}>{description}</Text> : <></>}
				</VStack>
				<HStack>
					{dropoff === undefined ?
						<></>
					:
						<Text bg="lighter" px={1.5} m={0.5} fontSize={descSize} italic>{dropoff}</Text>
					}
					<IconButton
						icon={<EditIcon size={textSize} color="primary.400" />}
						accessibilityLabel="Edit"
						bg="transparent"
						p={1}
						m={0.5}
						onPress={() => startEditGroup(group)}
					/>
					<IconButton
						icon={<TrashIcon size={textSize} color="danger.400" />}
						accessibilityLabel="Delete"
						bg="transparent"
						p={1}
						m={0.5}
						onPress={() => maybeDeleteGroup(group)}
					/>
				</HStack>
			</HStack>
		);
	};
	const primaryContrast = useContrastText("primary.500");
	return (
		<VStack h="full">
			<StandardAlert
				alertOpen={alertOpen}
				setAlertOpen={setAlertOpen}
				bodyContent={<Text fontSize={textSize}>Are you sure you want to delete the character group <Text bold>{deletingGroup.label}</Text>? This cannot be undone.</Text>}
				continueText="Yes, Delete It"
				continueProps={{
					bg: "danger.500",
					_text: {
						color: "danger.50"
					}
				}}
				continueFunc={() => doDeleteGroup(group)}
			/>
			<Modal isOpen={editingGroup}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" w="full">
							<Text flex={1} px={3} fontSize={textSize} color={primaryContrast} justifySelf="flex-start">Edit Character Group</Text>
							<ExtraChars color={primaryContrast} buttonProps={{size: textSize}} />
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => setEditingGroup(false)}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body></Modal.Body>
					<Modal.Footer></Modal.Footer>
				</Modal.Content>
			</Modal>
			<Modal isOpen={addGroupOpen}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center">
							<Text flex={1} px={3} fontSize={textSize} color={primaryContrast} justifySelf="flex-start">Add Character Group</Text>
							<ExtraChars color={primaryContrast} buttonProps={{size: textSize}} />
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => closeAddGroup()}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack>
							<TextSetting
								text="Title/Description"
								placeholder="Type description here"
								inputProps={{
									ref: addDescRef,
									mt: 1
								}}
								boxProps={{ pb: 2 }}
							/>
							<HStack
								py={2}
								justifyContent="space-between"
								alignItems="center"
								w="full"
							>
								<HStack alignItems="center">
									<Text>Short Label:</Text>
									<Input
										ref={addLabelRef}
										w={8}
										py={1}
										px={0}
										textAlign="center"
										mx={2}
									/>
								</HStack>
								<Button
									startIcon={
										<ChevronLeftIcon
											size={descSize}
											color={primaryContrast}
										/>
									}
									justifySelf="flex-end"
									py={1}
									bg="primary.500"
									_text={{ fontSize: descSize }}
									_stack={{ space: 0.5 }}
								>SUGGEST</Button>
							</HStack>
							<TextSetting
								text="Letters/Characters"
								placeholder="Enter characters in group here"
								boxProps={{ py: 2 }}
								inputProps={{
									ref: addRunRef,
									mt: 1
								}}
							/>
							<HStack
								w="full"
								alignItems="center"
								justifyContent="space-between"
								py={2}
							>
								<Text fontSize={textSize}>Use separate dropoff rate</Text>
								<Switch
									defaultIsChecked={addOverrideSwitch}
									onValueChange={(v) => setAddOverrideSwitch(v)}
								/>
							</HStack>
							{addOverrideSwitch ?
								<SliderWithLabels
									max={50}
									beginLabel={<EquiprobableIcon color="text.50" />}
									endLabel={<SharpDropoffIcon color="text.50" />}
									value={addOverrideValue}
									sliderProps={{
										accessibilityLabel: "Dropoff rate",
										onChangeEnd: (v) => setAddOverrideValue(v)
									}}
									Label={({value}) => (
										<Center>
											<Text>Rate: <Text px={2.5} bg="lighter" fontSize={textSize}>{value}</Text></Text>
										</Center>
									)}
									stackProps={{
										p: 2,
										mt: 3,
										space: 1,
										borderWidth: 1,
										borderColor: "primary.600"
									}}
								/>
							:
								<></>
							}
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
								onPress={() => addNewGroup(false)}
							>ADD GROUP</Button>
							<Button
								startIcon={<AddIcon size={descSize} />}
								px={2}
								py={1}
								onPress={() => addNewGroup(true)}
							>ADD AND CLOSE</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<Fab
				bg="secondary.500"
				renderInPortal={false}
				icon={<AddIcon size={textSize} color="secondary.50" />}
				accessibilityLabel="Add Group"
				onPress={() => setAddGroupOpen(true)}
			/>
			<ScrollView bg="main.900">
				<SliderWithLabels
					max={50}
					beginLabel={<EquiprobableIcon color="text.50" />}
					endLabel={<SharpDropoffIcon color="text.50" />}
					value={characterGroupDropoff}
					sliderProps={{
						accessibilityLabel: "Dropoff rate",
						onChangeEnd: (v) => dispatch(setCharacterGroupDropoff(v))
					}}
					Label={({value}) => (
						<Box pb={1}>
							<HStack
								justifyContent="space-between"
								alignItems="flex-end"
								pb={1}
							>
								<Text bold fontSize={textSize}>Dropoff Rate</Text>
								<Text px={2.5} bg="lighter" fontSize={textSize}>{value}</Text>
							</HStack>
							<Text fontSize={descSize}>Characters at the beginning of a group tend to be picked more often than characters at the end of the group. This slider controls this tendency. A rate of zero is flat, making all characters equiprobable.</Text>
						</Box>
					)}
					stackProps={{
						borderBottomWidth: 0.5,
						borderColor: "main.700",
						py: 2.5,
						px: 2,
						bg: "main.800"
					}}
				/>
				{characterGroups.map(group => renderGroup(group))}
			</ScrollView>
		</VStack>
	);
};

export default WGChar;
