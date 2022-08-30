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
import ReAnimated, {
	CurvedTransition,
	FadeInUp,
	FadeOutUp
} from 'react-native-reanimated';

import {
	AddIcon,
	SuggestLeftIcon,
	CloseCircleIcon,
	EditIcon,
	EquiprobableIcon,
	SaveIcon,
	SharpDropoffIcon,
	TrashIcon
} from "../../components/icons";
import { SliderWithLabels, TextSetting } from "../../components/layoutTags";
import StandardAlert from "../../components/StandardAlert";
import { sizes } from "../../store/appStateSlice";
import {
	addCharacterGroup,
	deleteCharacterGroup,
	editCharacterGroup,
	setCharacterGroupDropoff,
	equalityCheck
} from "../../store/wgSlice";
import ExtraChars from "../../components/ExtraCharsButton";
import doToast from "../../components/toast";


const WGChar = () => {
	const { characterGroups, characterGroupDropoff } = useSelector(state => state.wg, equalityCheck);
	const { disableConfirms } = useSelector(state => state.appState);
	const dispatch = useDispatch();
	const addDescRef = useRef(null);
	const addLabelRef = useRef(null);
	const addRunRef = useRef(null);
	const [alertOpenError, setAlertOpenError] = useState(false);
	const [saveGroupError, setSaveGroupError] = useState('');
	const [deletingGroup, setDeletingGroup] = useState(false);
	const [groupDeletingString, setGroupDeletingString] = useState("");
	const [editingGroup, setEditingGroup] = useState(false);
	const [modifiedDesc, setModifiedDesc] = useState("");
	const [modifiedLabel, setModifiedLabel] = useState("");
	const [modifiedRun, setModifiedRun] = useState("");
	const [editOverrideSwitch, setEditOverrideSwitch] = useState(false);
	const [editOverrideValue, setEditOverrideValue] = useState(20);
	const [addGroupOpen, setAddGroupOpen] = useState(false);
	const [addOverrideSwitch, setAddOverrideSwitch] = useState(false);
	const [addOverrideValue, setAddOverrideValue] = useState(characterGroupDropoff);
	const toast = useToast();
	const primaryContrast = useContrastText("primary.500");
	// add group
	const addNewGroup = (closeAfterAdd) => {
		// attempts to add the modal info as a new group
		const description = addDescRef.current.value.trim();
		const label = addLabelRef.current.value.trim();
		const run = addRunRef.current.value.trim();
		const dropoff = addOverrideSwitch ? addOverrideValue : undefined;
		let msg = [];
		if(!label) {
			msg.push("Label not provided");
		} else if(characterGroups.some(group => group.label === label)) {
			msg.push("Label \"" + label + "\" is already in use");
		}
		if (!description) {
			msg.push("Title not provided");
		}
		if (!run) {
			msg.push("No characters assigned to the group");
		}
		if(msg.length > 0) {
			// If we have errors, abort with an alert
			setSaveGroupError(msg.join(", ") + ".");
			setAlertOpenError(true);
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
	const suggestLabel = () => {
		const v = addDescRef.current.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
		let labels = {};
		characterGroups.forEach(group => labels[group.label] = true);
		let length = v.length;
		let pos = 0;
		let label = null;
		while(!label && pos < length) {
			const test = v.charAt(pos);
			if(!labels[test]) {
				label = test;
			}
			pos++;
		}
		if(!label) {
			// No suitable label found
			doToast({
				toast,
				placement: "bottom",
				duration: 4000,
				msg: "Unable to suggest a unique label from the given descrption.",
				bg: "error.500",
				center: true,
				boxProps: {
					maxW: "2/3"
				}
			});
		} else {
			// Suitable label found
			addLabelRef.current.value = label;
		}
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
		} else {
			setEditOverrideSwitch(false);
			setEditOverrideValue(characterGroupDropoff);
		}
		setEditingGroup(group);
	};
	const maybeSaveEditedGroup = () => {
		const msg = [];
		const modLabel = (modifiedLabel.trim());
		const modDesc = (modifiedDesc.trim());
		const modRun = (modifiedRun.trim());
		if(!modLabel) {
			msg.push("Label not provided");
		} else if(characterGroups.some(group =>
			group.label !== editingGroup.label && group.label === modLabel
		)) {
			msg.push("Label \"" + modLabel + "\" is already in use");
		}
		if (!modDesc) {
			msg.push("Title not provided");
		}
		if (!modRun) {
			msg.push("No characters assigned to the group");
		}
		if(msg.length > 0) {
			// If we have errors, abort with an alert
			setSaveGroupError(msg.join(", ") + ".");
			setAlertOpenError(true);
			return;
		}
		dispatch(editCharacterGroup({
			old: editingGroup,
			edited: {
				description: modDesc,
				label: modLabel,
				run: modRun,
				dropoff: editOverrideSwitch ? editOverrideValue : undefined
			}
		}));
		doToast({
			toast,
			placement: "top",
			msg: "Character Group edited!"
		});
		setEditingGroup(false);
	};
	// delete group
	const maybeDeleteGroup = (group) => {
		if(disableConfirms) {
			return doDeleteGroup(group);
		}
		// open the delete alert
		setGroupDeletingString(group.label);
		setDeletingGroup(group);
	};
	const doDeleteGroup = (group = deletingGroup) => {
		dispatch(deleteCharacterGroup(group));
		doToast({
			toast,
			placement: "bottom",
			msg: "Deleted",
			bg: "warning.500"
		});
		setEditingGroup(false);
		setDeletingGroup(false);
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
						<Text bg="lighter" px={1.5} py={1} m={0.5} lineHeight={descSize} fontSize={descSize} italic>{dropoff}%</Text>
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
	return (
		<VStack h="full">
			<StandardAlert
				alertOpen={deletingGroup}
				setAlertOpen={setDeletingGroup}
				bodyContent={<Text fontSize={textSize}>Are you sure you want to delete the character group <Text bold>{groupDeletingString}</Text>? This cannot be undone.</Text>}
				continueText="Yes, Delete It"
				continueProps={{
					bg: "danger.500",
				}}
				continueFunc={() => doDeleteGroup(deletingGroup)}
			/>
			<StandardAlert
				alertOpen={alertOpenError}
				setAlertOpen={setAlertOpenError}
				headerContent="Cannot Save Group"
				headerProps={{
					bg: "error.500"
				}}
				bodyContent={saveGroupError}
				overrideButtons={[
					({leastDestructiveRef}) => <Button
						onPress={() => setAlertOpenError(false)}
						ref={leastDestructiveRef}
					>Ok</Button>
				]}
			/>
			<Modal isOpen={editingGroup}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center">
							<Text flex={1} px={3} fontSize={textSize} color={primaryContrast} justifySelf="flex-start">Edit Character Group</Text>
							<ExtraChars color={primaryContrast} buttonProps={{size: textSize}} />
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => setEditingGroup(false)}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack>
							<TextSetting
								text="Title/Description"
								placeholder="Type description here"
								inputProps={{ mt: 1 }}
								boxProps={{ pb: 2 }}
								value={modifiedDesc}
								onChangeText={(v) => setModifiedDesc(v)}
							/>
							<HStack
								py={2}
								justifyContent="flex-start"
								alignItems="center"
								w="full"
							>
								<Text>Short Label:</Text>
								<Input
									w={8}
									py={1}
									px={0}
									textAlign="center"
									mx={2}
									value={modifiedLabel}
									onChangeText={(v) => setModifiedLabel(v)}
								/>
							</HStack>
							<TextSetting
								text="Letters/Characters"
								placeholder="Enter characters in group here"
								boxProps={{ py: 2 }}
								inputProps={{ mt: 1 }}
								value={modifiedRun}
								onChangeText={(v) => setModifiedRun(v)}
							/>
							<HStack
								w="full"
								alignItems="center"
								justifyContent="space-between"
								py={2}
							>
								<Text fontSize={textSize}>Use separate dropoff rate</Text>
								<Switch
									isChecked={editOverrideSwitch}
									onToggle={() => setEditOverrideSwitch(!editOverrideSwitch)}
								/>
							</HStack>
							{editOverrideSwitch ?
								<ReAnimated.View
									entering={FadeInUp}
									exiting={FadeOutUp}
									layout={CurvedTransition}
								>
									<SliderWithLabels
										max={50}
										beginLabel={<EquiprobableIcon color="text.50" />}
										endLabel={<SharpDropoffIcon color="text.50" />}
										value={editOverrideValue}
										sliderProps={{
											accessibilityLabel: "Dropoff rate",
											onChangeEnd: (v) => setEditOverrideValue(v)
										}}
										Label={({value}) => (
											<Center>
												<Text>Rate: <Text px={2.5} bg="lighter" fontSize={textSize}>{value}%</Text></Text>
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
								</ReAnimated.View>
							:
								<></>
							}
						</VStack>
					</Modal.Body>
					<Modal.Footer>
						<HStack justifyContent="space-between" p={1}>
							<Button
								startIcon={<TrashIcon size={descSize} color="danger.50" />}
								bg="danger.500"
								px={2}
								py={1}
								mx={1}
								onPress={() => maybeDeleteGroup(editingGroup)}
							>DELETE GROUP</Button>
							<Button
								startIcon={<SaveIcon size={descSize} />}
								px={2}
								py={1}
								onPress={() => maybeSaveEditedGroup()}
							>SAVE GROUP</Button>
						</HStack>
					</Modal.Footer>
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
										<SuggestLeftIcon
											size={descSize}
											color={primaryContrast}
										/>
									}
									justifySelf="flex-end"
									py={1}
									bg="primary.500"
									_text={{ fontSize: descSize }}
									_stack={{ space: 0.5 }}
									onPress={suggestLabel}
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
									isChecked={addOverrideSwitch}
									onToggle={() => setAddOverrideSwitch(!addOverrideSwitch)}
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
							>ADD</Button>
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
								<Text px={2.5} bg="lighter" fontSize={textSize}>{value}%</Text>
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
