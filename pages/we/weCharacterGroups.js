import {
	useBreakpointValue,
	Text,
	HStack,
	ScrollView,
	VStack,
	IconButton,
	Fab,
	Modal,
	useContrastText,
	Button,
	Input,
	useToast
} from "native-base";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
	AddIcon,
	SuggestLeftIcon,
	CloseCircleIcon,
	EditIcon,
	SaveIcon,
	TrashIcon
} from "../../components/icons";
import { TextSetting } from "../../components/inputTags";
import StandardAlert from "../../components/StandardAlert";
import {
	addCharacterGroup,
	deleteCharacterGroup,
	editCharacterGroup,
	//equalityCheck
} from "../../store/weSlice";
import ExtraChars from "../../components/ExtraCharsButton";
import doToast from "../../helpers/toast";
import { ensureEnd, saveOnEnd } from "../../helpers/saveTextInput";
import { fontSizesInPx } from "../../store/appStateSlice";

const WEChar = () => {
	const { characterGroups } = useSelector(state => state.we, /*equalityCheck*/);
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
	const [addGroupOpen, setAddGroupOpen] = useState(false);
	const [addDesc, setAddDesc] = useState("");
	const [addLabel, setAddLabel] = useState("");
	const [addRun, setAddRun] = useState("");
	const refAddDesc = useRef(null);
	const refAddRun = useRef(null);
	const toast = useToast();
	const primaryContrast = useContrastText("primary.500");
	// add group
	const addNewGroup = (closeAfterAdd) => {
		// attempts to add the modal info as a new group
		ensureEnd([refAddDesc, refAddRun]);
		const description = addDesc.trim();
		const label = addLabel.trim();
		const run = addRun.trim();
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
		dispatch(addCharacterGroup({description, label, run}));
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
		const {label, description, run} = group;
		setModifiedDesc(description);
		setModifiedLabel(label);
		setModifiedRun(run);
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
				run: modRun
			}
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
	const textSize = useBreakpointValue(sizes.sm);
	const smallerSize = useBreakpointValue(sizes.xs);
	const emSize = fontSizesInPx[textSize];
	const renderGroup = (group) => {
		const {label, run, description} = group;
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
					{description ? <Text italic fontSize={smallerSize} noOfLines={3}>{description}</Text> : <></>}
				</VStack>
				<HStack>
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
					bg: "danger.500"
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
			<Modal isOpen={!!editingGroup}>
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
									onChangeText={(v) => setModifiedLabel(v)}
									fontSize={smallerSize}
									style={{width: emSize * 2}}
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
			<Modal isOpen={addGroupOpen}>
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
										style={{width: emSize * 2}}
										onChangeText={v => setAddLabel(v)}
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
				{characterGroups.map(group => renderGroup(group))}
			</ScrollView>
		</VStack>
	);
};

export default WEChar;
