import {
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
	Center,
	Input,
	useToast,
	useTheme
} from "native-base";
import { useRef, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, MotiView } from "moti";
//TO-DO: consider remove reanimated in favor of Moti
//   here, LoadCustomInfoModal, Transformations, weOutput,
//   weSoundChanges, wgOutput, wgSyllables

import {
	AddIcon,
	SuggestLeftIcon,
	CloseCircleIcon,
	EditIcon,
	EquiprobableIcon,
	SaveIcon,
	SharpDropoffIcon,
	TrashIcon
} from "./icons";
import { SliderWithValueDisplay, TextSetting, ToggleSwitch } from "./inputTags";
import StandardAlert from "./StandardAlert";
import ExtraChars from "./ExtraCharsButton";
import doToast from "../helpers/toast";
import { ensureEnd, saveOnEnd } from "../helpers/saveTextInput";
import { fontSizesInWs } from "../store/appStateSlice";
import getSizes from "../helpers/getSizes";
import { fromToZero } from "../helpers/motiAnimations";

const CharGroups = ({
	useDropoff,
	selector,
	addCharacterGroup,
	deleteCharacterGroup,
	editCharacterGroup,
	setCharacterGroupDropoff
}) => {
	const { characterGroups, characterGroupDropoff } = useSelector(state => state[selector]);
	const { disableConfirms } = useSelector(state => state.appState);
	const dispatch = useDispatch();
	const [alertOpenError, setAlertOpenError] = useState(false);
	const [saveGroupError, setSaveGroupError] = useState('');
	const [deletingGroup, setDeletingGroup] = useState(false);
	const [groupDeletingString, setGroupDeletingString] = useState("");
	const [editingGroup, setEditingGroup] = useState(false);
	const [modifiedDesc, setModifiedDesc] = useState("");
	const [modifiedLabel, setModifiedLabel] = useState("");
	// TO-DO: labels need to be limited to one character on mobile, and the
	//          "Suggest" button isn't showing up
	// TO-DO: Error: "no characters assigned to group" when button is pressed
	//          while in the input box (new group modal)
	// TO-DO: ALL MODALS need to avoid keyboard
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
		const dropoff = useDropoff && addOverrideSwitch ? addOverrideValue : undefined;
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
		dispatch(addCharacterGroup(
			useDropoff ?
				{description, label, run, dropoff}
			:
				{description, label, run}
		));
		doToast({
			toast,
			placement: "top",
			msg: "Character Group added!",
			fontSize: smallerSize
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
		useDropoff && addOverrideSwitch && setAddOverrideSwitch(false);
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
				},
				fontSize: smallerSize
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
		} else if(useDropoff) {
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
		const edited = useDropoff ? {
			description: modDesc,
			label: modLabel,
			run: modRun,
			dropoff: editOverrideSwitch ? editOverrideValue : undefined
		} : {
			description: modDesc,
			label: modLabel,
			run: modRun
		}
		dispatch(editCharacterGroup({
			old: editingGroup,
			edited
		}));
		doToast({
			toast,
			placement: "top",
			msg: "Character Group edited!",
			fontSize: smallerSize
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
			bg: "warning.500",
			fontSize: smallerSize
		});
		setEditingGroup(false);
		setDeletingGroup(false);
	};
	const [textSize, smallerSize] = getSizes("sm", "xs");
	const smallestWidth = fontSizesInWs[textSize] * 2;
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
				key={`${selector}-${label}`}
				bg="main.800"
			>
				<VStack
					alignItems="flex-start"
					justifyContent="center"
				>
					<Text fontSize={textSize} isTruncated><Text bold>{label}</Text>={run}</Text>
					{description ? <Text key={`${selector}-${label}-Text-Box`} italic fontSize={smallerSize} noOfLines={3}>{description}</Text> : <Fragment key={`${selector}-Frag1`} />}
				</VStack>
				<HStack>
					{dropoff === undefined ?
						<Fragment key={`${selector}-Frag2`} />
					:
						<Text key={`${selector}-${label}-Dropoff-Percent`} bg="lighter" px={1.5} py={1} m={0.5} lineHeight={smallerSize} fontSize={smallerSize} italic>{dropoff}%</Text>
					}
					<IconButton
						icon={<EditIcon color="primary.400" size={smallerSize} />}
						accessibilityLabel="Edit"
						bg="transparent"
						p={1}
						m={0.5}
						onPress={() => startEditGroup(group)}
					/>
					<IconButton
						icon={<TrashIcon color="danger.400" size={smallerSize} />}
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
				fontSize={textSize}
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
				fontSize={textSize}
			/>
			<Modal avoidKeyboard isOpen={!!editingGroup}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center">
							<Text flex={1} px={3} fontSize={textSize} color={primaryContrast} textAlign="left">Edit Character Group</Text>
							<ExtraChars color={primaryContrast} size={textSize} buttonProps={{flexGrow: 0, flexShrink: 0}} />
							<IconButton
								flexGrow={0}
								flexShrink={0}
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
								inputProps={{ mt: 1, fontSize: smallerSize }}
								boxProps={{ pb: 2 }}
								value={modifiedDesc}
								labelProps={{fontSize: textSize}}
								onChangeText={(v) => setModifiedDesc(v)}
								key={`${selector}-title-description-edit-group`}
							/>
							<HStack
								py={2}
								justifyContent="flex-start"
								alignItems="center"
								w="full"
							>
								<Text fontSize={textSize}>Short Label:</Text>
								<Input
									py={1}
									px={0}
									textAlign="center"
									mx={2}
									value={modifiedLabel}
									fontSize={smallerSize}
									w={smallestWidth}
									onChangeText={v => {
										if(v.length > 1) {
											setModifiedLabel(v[0]);
										} else {
											setModifiedLabel(v);
										}
									}}
						/>
							</HStack>
							<TextSetting
								text="Letters/Characters"
								placeholder="Enter characters in group here"
								boxProps={{ py: 2 }}
								inputProps={{ mt: 1, fontSize: smallerSize }}
								value={modifiedRun}
								labelProps={{fontSize: textSize}}
								onChangeText={(v) => setModifiedRun(v)}
							/>
							{useDropoff ?
								<Fragment key={`${selector}-override-switch-modal-useDropoff-true`}>
									<ToggleSwitch
										hProps={{ py: 2 }}
										label="Use separate dropoff rate"
										labelSize={textSize}
										switchState={editOverrideSwitch}
										switchToggle={() => setEditOverrideSwitch(!editOverrideSwitch)}
									/>
									<AnimatePresence>
										{editOverrideSwitch ?
											<MotiView
												style={{
													overflow: "hidden",
													display: "flex",
													flexDirection: "column",
													justifyContent: "center",
													borderColor: useTheme().colors.primary["600"]
												}}
												key={`${selector}-override-switch-modal-reanimated`}
												{...fromToZero({
													height: smallestWidth * 12,
													padding: 8,
													marginTop: 12,
													borderWidth: 1,
													opacity: 1,
													scaleY: 1
												})}
											>
												<SliderWithValueDisplay
													max={50}
													beginLabel={<EquiprobableIcon color="text.50" size={smallerSize} />}
													endLabel={<SharpDropoffIcon color="text.50" size={smallerSize} />}
													value={editOverrideValue}
													sliderProps={{
														accessibilityLabel: "Dropoff rate",
														onChangeEnd: (v) => setEditOverrideValue(v)
													}}
													Display={({value}) => (
														<Center>
															<Text fontSize={textSize}>Rate: <Text px={2.5} bg="lighter">{value}%</Text></Text>
														</Center>
													)}
													stackProps={{
														space: 1
													}}
												/>
											</MotiView>
										:
											<Fragment key={`${selector}-Frag3`} />
										}
									</AnimatePresence>
								</Fragment>
							:
								<Fragment key={`${selector}-Frag4`} />
							}
						</VStack>
					</Modal.Body>
					<Modal.Footer>
						<HStack justifyContent="space-between" p={1} flexWrap="wrap">
							<Button
								startIcon={<TrashIcon color="danger.50" size={textSize} />}
								bg="danger.500"
								px={2}
								py={1}
								mx={1}
								onPress={() => maybeDeleteGroup(editingGroup)}
								_text={{fontSize: textSize}}
							>Delete</Button>
							<Button
								startIcon={<SaveIcon size={textSize} />}
								px={2}
								py={1}
								onPress={() => maybeSaveEditedGroup()}
								_text={{fontSize: textSize}}
							>Save</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<Modal avoidKeyboard isOpen={addGroupOpen}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center">
							<Text flex={1} px={3} fontSize={textSize} color={primaryContrast}>Add Character Group</Text>
							<ExtraChars color={primaryContrast} size={textSize} buttonProps={{flexGrow: 0, flexShrink: 0}} />
							<IconButton
								flexGrow={0}
								flexShrink={0}
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
								inputProps={{ mt: 1, ref: refAddDesc, fontSize: smallerSize, ...saveOnEnd(setAddDesc) }}
								labelProps={{fontSize: textSize}}
								boxProps={{ pb: 2 }}
								key={`${selector}-title-description-add-group`}
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
										py={1}
										px={0}
										textAlign="center"
										mx={2}
										value={addLabel}
										fontSize={smallerSize}
										w={smallestWidth}
										onChangeText={v => {
											if(v.length > 1) {
												setAddLabel(v[0]);
											} else {
												setAddLabel(v);
											}
										}}
										isFullWidth={false}
									/>
								</HStack>
								<Button
									startIcon={
										<SuggestLeftIcon
											size={smallerSize}
											color={primaryContrast}
										/>
									}
									py={1}
									bg="primary.500"
									_text={{ fontSize: smallerSize }}
									_stack={{ space: 0.5 }}
									onPress={suggestLabel}
								>Suggest</Button>
							</HStack>
							<TextSetting
								text="Letters/Characters"
								placeholder="Enter characters in group here"
								boxProps={{ py: 2 }}
								inputProps={{ mt: 1, ref: refAddRun, fontSize: smallerSize, ...saveOnEnd(setAddRun) }}
								labelProps={{fontSize: textSize}}
							/>
							{useDropoff ?
								<Fragment key={`${selector}-useDropoff-true-modal-add-switch`}>
									<ToggleSwitch
										hProps={{ py: 2 }}
										label="Use separate dropoff rate"
										labelSize={textSize}
										switchState={addOverrideSwitch}
										switchToggle={() => setAddOverrideSwitch(!addOverrideSwitch)}
									/>
									<AnimatePresence>
										{addOverrideSwitch ?
											<MotiView
												style={{
													overflow: "hidden",
													display: "flex",
													flexDirection: "column",
													justifyContent: "center"
												}}
												key={`${selector}-override-switch-modal-reanimated`}
												{...fromToZero({
													height: smallestWidth * 12,
													padding: 8,
													marginTop: 12,
													borderWidth: 1,
													opacity: 1,
													scaleY: 1
												})}
											>
											<SliderWithValueDisplay
													max={50}
													beginLabel={<EquiprobableIcon color="text.50" size={smallerSize} />}
													endLabel={<SharpDropoffIcon color="text.50" size={smallerSize} />}
													value={addOverrideValue}
													sliderProps={{
														accessibilityLabel: "Dropoff rate",
														onChangeEnd: (v) => setAddOverrideValue(v)
													}}
													Display={({value}) => (
														<Center>
															<Text fontSize={textSize}>Rate: <Text px={2.5} bg="lighter">{value}</Text></Text>
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
											</MotiView>
										:
											<Fragment key={`${selector}-Frag5`} />
										}
									</AnimatePresence>
								</Fragment>
							:
								<Fragment key={`${selector}-Frag6`} />
							}
						</VStack>
					</Modal.Body>
					<Modal.Footer>
						<HStack justifyContent="flex-end" p={1} flexWrap="wrap">
							<Button
								startIcon={<AddIcon color="secondary.50" size={textSize} />}
								bg="secondary.500"
								px={2}
								py={1}
								mx={1}
								onPress={() => addNewGroup(false)}
								_text={{fontSize: textSize}}
							>Add</Button>
							<Button
								startIcon={<AddIcon size={textSize} />}
								px={2}
								py={1}
								onPress={() => addNewGroup(true)}
								_text={{fontSize: textSize}}
							>Add and Close</Button>
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
				{useDropoff ?
					<Fragment key={`${selector}-main-display-useDropoff-true`}>
						<SliderWithValueDisplay
							max={50}
							beginLabel={<EquiprobableIcon color="text.50" size={smallerSize} />}
							endLabel={<SharpDropoffIcon color="text.50" size={smallerSize} />}
							value={characterGroupDropoff}
							sliderProps={{
								accessibilityLabel: "Dropoff rate",
								onChangeEnd: (v) => dispatch(setCharacterGroupDropoff(v))
							}}
							Display={({value}) => (
								<Box pb={1}>
									<HStack
										justifyContent="space-between"
										alignItems="flex-end"
										pb={1}
									>
										<Text bold fontSize={textSize}>Dropoff Rate</Text>
										<Text px={2.5} bg="lighter" fontSize={textSize}>{value}%</Text>
									</HStack>
									<Text fontSize={smallerSize}>Characters at the beginning of a group tend to be picked more often than characters at the end of the group. This slider controls this tendency. A rate of zero is flat, making all characters equiprobable.</Text>
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
					</Fragment>
				:
					<Fragment key={`${selector}-Frag7`} />
				}
				{characterGroups.map(group => renderGroup(group))}
			</ScrollView>
		</VStack>
	);
};

export default CharGroups;
