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
import { SliderWithLabels, TextSetting, ToggleSwitch } from "../../components/layoutTags";
import StandardAlert from "../../components/StandardAlert";
import {
	addCharacterGroup,
	deleteCharacterGroup,
	editCharacterGroup,
	setCharacterGroupDropoff,
	equalityCheck
} from "../../store/wgSlice";
import ExtraChars from "../../components/ExtraCharsButton";
import doToast from "../../helpers/toast";
import { ensureEnd, saveOnEnd } from "../../helpers/saveTextInput";

const WGChar = () => {
	const { characterGroups, characterGroupDropoff } = useSelector(state => state.wg, equalityCheck);
	const { sizes, disableConfirms } = useSelector(state => state.appState);
	const dispatch = useDispatch();
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
	const [addDesc, setAddDesc] = useState("");
	const [addLabel, setAddLabel] = useState("");
	const [addRun, setAddRun] = useState("");
	const refAddDesc = useRef(null);
	const refAddRun = useRef(null);
	const [addOverrideSwitch, setAddOverrideSwitch] = useState(false);
	const [addOverrideValue, setAddOverrideValue] = useState(characterGroupDropoff);
	const toast = useToast();
	const primaryContrast = useContrastText("primary.500");
	// add group
	const addNewGroup = (closeAfterAdd) => {
		// attempts to add the modal info as a new group
		ensureEnd([refAddDesc, refAddRun]);
		const description = addDesc.trim();
		const label = addLabel.trim();
		const run = addRun.trim();
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
		if (closeAfterAdd) {
			closeAddGroup();
		} else {
			clearAddModal();
			refAddDesc.current && refAddDesc.current.focus && refAddDesc.current.focus();
		}
	};
	const clearAddModal = () => {
		// clears the form info
		refAddDesc.current && refAddDesc.current.clear && refAddDesc.current.clear();
		refAddRun.current && refAddRun.current.clear && refAddRun.current.clear();
		setAddDesc("");
		setAddLabel("");
		setAddRun("");
		addOverrideSwitch && setAddOverrideSwitch(false);
	};
	const closeAddGroup = () => {
		// closes the adding modal
		clearAddModal();
		setAddGroupOpen(false);
	};
	const suggestLabel = () => {
		const v = addDesc.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
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
			setAddLabel(label);
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
						icon={<EditIcon color="primary.400" size={descSize} />}
						accessibilityLabel="Edit"
						bg="transparent"
						p={1}
						m={0.5}
						onPress={() => startEditGroup(group)}
					/>
					<IconButton
						icon={<TrashIcon color="danger.400" size={descSize} />}
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
				alertOpen={!!deletingGroup}
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
					>Ok</Button> //TO-DO: Figure out how Short Label shrunk? also, fix header flex and size of both modals?
				]}
			/>
			<Modal isOpen={!!editingGroup}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center">
							<Text flex={1} px={3} fontSize={textSize} color={primaryContrast} textAlign="left">Edit Character Group</Text>
							<ExtraChars flex={0} color={primaryContrast} size={textSize} />
							<IconButton
								flex={0}
								icon={<CloseCircleIcon color={primaryContrast} size={textSize}  />}
								onPress={() => setEditingGroup(false)}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack>
							<TextSetting
								text="Title/Description"
								placeholder="Type description here"
								inputProps={{ mt: 1, fontSize: descSize }}
								boxProps={{ pb: 2 }}
								value={modifiedDesc}
								labelProps={{fontSize: textSize}}
								onChangeText={(v) => setModifiedDesc(v)}
							/>
							<HStack
								py={2}
								justifyContent="flex-start"
								alignItems="center"
								w="full"
							>
								<Text size={textSize}>Short Label:</Text>
								<Input
									w={8}
									py={1}
									px={0}
									textAlign="center"
									mx={2}
									value={modifiedLabel}
									onChangeText={(v) => setModifiedLabel(v)}
									fontSize={descSize}
								/>
							</HStack>
							<TextSetting
								text="Letters/Characters"
								placeholder="Enter characters in group here"
								boxProps={{ py: 2 }}
								inputProps={{ mt: 1, fontSize: descSize }}
								value={modifiedRun}
								labelProps={{fontSize: textSize}}
								onChangeText={(v) => setModifiedRun(v)}
							/>
							<ToggleSwitch
								hProps={{ py: 2 }}
								label="Use separate dropoff rate"
								labelSize={textSize}
								switchState={editOverrideSwitch}
								switchToggle={() => setEditOverrideSwitch(!editOverrideSwitch)}
							/>
							{editOverrideSwitch ?
								<ReAnimated.View
									entering={FadeInUp}
									exiting={FadeOutUp}
								>
									<SliderWithLabels
										max={50}
										beginLabel={<EquiprobableIcon color="text.50" size={descSize} />}
										endLabel={<SharpDropoffIcon color="text.50" size={descSize} />}
										value={editOverrideValue}
										sliderProps={{
											accessibilityLabel: "Dropoff rate",
											onChangeEnd: (v) => setEditOverrideValue(v)
										}}
										Label={({value}) => (
											<Center>
												<Text fontSize={textSize}>Rate: <Text px={2.5} bg="lighter">{value}%</Text></Text>
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
								startIcon={<TrashIcon color="danger.50" size={textSize} />}
								bg="danger.500"
								px={2}
								py={1}
								mx={1}
								onPress={() => maybeDeleteGroup(editingGroup)}
								_text={{fontSize: textSize}}
							>DELETE</Button>
							<Button
								startIcon={<SaveIcon size={textSize} />}
								px={2}
								py={1}
								onPress={() => maybeSaveEditedGroup()}
								_text={{fontSize: textSize}}
							>SAVE</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<Modal isOpen={addGroupOpen}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center">
							<Text flex={1} px={3} fontSize={textSize} color={primaryContrast}>Add Character Group</Text>
							<ExtraChars color={primaryContrast} size={textSize} buttonProps={{flex: 0, mx: 1}} />
							<IconButton
								flex={0}
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => closeAddGroup()}
								mx={1}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack>
							<TextSetting
								text="Title/Description"
								placeholder="Type description here"
								inputProps={{ mt: 1, ref: refAddDesc, fontSize: descSize, ...saveOnEnd(setAddDesc) }}
								labelProps={{fontSize: textSize}}
								boxProps={{ pb: 2 }}
							/>
							<HStack
								py={2}
								justifyContent="space-between"
								alignItems="center"
								w="full"
							>
								<HStack alignItems="center">
									<Text fontSize={textSize}>Short Label:</Text>
									<Input
										w={8}
										py={1}
										px={0}
										textAlign="center"
										mx={2}
										value={addLabel}
										fontSize={descSize}
										onChangeText={v => setAddLabel(v)}
									/>
								</HStack>
								<Button
									startIcon={
										<SuggestLeftIcon
											size={descSize}
											color={primaryContrast}
										/>
									}
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
								inputProps={{ mt: 1, ref: refAddRun, fontSize: descSize, ...saveOnEnd(setAddRun) }}
								labelProps={{fontSize: textSize}}
							/>
							<ToggleSwitch
								hProps={{ py: 2 }}
								label="Use separate dropoff rate"
								labelSize={textSize}
								switchState={addOverrideSwitch}
								switchToggle={() => setAddOverrideSwitch(!addOverrideSwitch)}
							/>
							{addOverrideSwitch ?
								<SliderWithLabels
									max={50}
									beginLabel={<EquiprobableIcon color="text.50" size={descSize} />}
									endLabel={<SharpDropoffIcon color="text.50" size={descSize} />}
									value={addOverrideValue}
									sliderProps={{
										accessibilityLabel: "Dropoff rate",
										onChangeEnd: (v) => setAddOverrideValue(v)
									}}
									Label={({value}) => (
										<Center>
											<Text fontSize={fontSize}>Rate: <Text px={2.5} bg="lighter">{value}</Text></Text>
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
								startIcon={<AddIcon color="secondary.50" size={textSize} />}
								bg="secondary.500"
								px={2}
								py={1}
								mx={1}
								onPress={() => addNewGroup(false)}
								_text={{fontSize: textSize}}
							>ADD</Button>
							<Button
								startIcon={<AddIcon size={textSize} />}
								px={2}
								py={1}
								onPress={() => addNewGroup(true)}
								_text={{fontSize: textSize}}
							>ADD AND CLOSE</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<Fab
				bg="secondary.500"
				renderInPortal={false}
				icon={<AddIcon color="secondary.50" size={textSize} />}
				accessibilityLabel="Add Group"
				onPress={() => setAddGroupOpen(true)}
			/>
			<ScrollView bg="main.900">
				<SliderWithLabels
					max={50}
					beginLabel={<EquiprobableIcon color="text.50" size={descSize} />}
					endLabel={<SharpDropoffIcon color="text.50" size={descSize} />}
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
