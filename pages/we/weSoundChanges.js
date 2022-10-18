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
import { Fragment, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReAnimated, {
	CurvedTransition,
	StretchInY,
	StretchOutY
} from "react-native-reanimated";
import { v4 as uuidv4 } from 'uuid';

import {
	AddIcon,
	CloseCircleIcon,
	DownIcon,
	EditIcon,
	ReorderIcon,
	SaveIcon,
	StopIcon,
	TrashIcon,
	UpIcon
} from "../../components/icons";
import { TextSetting } from "../../components/inputTags";
import StandardAlert from "../../components/StandardAlert";
import {
	addSoundChange,
	deleteSoundChange,
	editSoundChange,
	rearrangeSoundChanges
} from "../../store/weSlice";
import ExtraChars from "../../components/ExtraCharsButton";
import doToast from "../../helpers/toast";
import { ensureEnd, saveOnEnd } from "../../helpers/saveTextInput";

const WESoundChanges = () => {
	const { soundChanges } = useSelector(state => state.we);
	const { sizes, disableConfirms } = useSelector(state => state.appState);
	const dispatch = useDispatch();
	const [alertOpenError, setAlertOpenError] = useState(false);
	const [saveSoundChangeError, setSaveSoundChangeError] = useState('');

	const [deletingSoundChange, setDeletingSoundChange] = useState(false);
	const [soundChangeDeletingString, setSoundChangeDeletingString] = useState("");

	const [reordering, setReordering] = useState(false);

	const [editingSoundChange, setEditingSoundChange] = useState(false);
	const [modifiedID, setModifiedID] = useState(false);
	const [modifiedBeginning, setModifiedBeginning] = useState("");
	const [modifiedEnding, setModifiedEnding] = useState("");
	const [modifiedContext, setModifiedContext] = useState("");
	const [modifiedAnticontext, setModifiedAnticontext] = useState("");
	const [modifiedDesc, setModifiedDesc] = useState("");
	// are these even needed?
	const refEditBeginning = useRef(null);
	const refEditEnding = useRef(null);
	const refEditContext = useRef(null);
	const refEditAnticontext = useRef(null);
	const refEditDesc = useRef(null);

	const [addSoundChangeOpen, setAddSoundChangeOpen] = useState(false);
	const [addBeginning, setAddBeginning] = useState("");
	const [addEnding, setAddEnding] = useState("");
	const [addContext, setAddContext] = useState("");
	const [addAnticontext, setAddAnticontext] = useState("");
	const [addDesc, setAddDesc] = useState("");
	const refAddBeginning = useRef(null);
	const refAddEnding = useRef(null);
	const refAddContext = useRef(null);
	const refAddAnticontext = useRef(null);
	const refAddDesc = useRef(null);

	const fabSize = useBreakpointValue(sizes.md);
	const textSize = useBreakpointValue(sizes.sm);
	const smallerSize = useBreakpointValue(sizes.xs);
	const toast = useToast();
	const primaryContrast = useContrastText("primary.500");
	const secondaryContrast = useContrastText("secondary.500");
	const tertiaryContrast = useContrastText("tertiary.500");
	const dangerContrast = useContrastText("danger.500");
	// add soundChange
	const addNewSoundChange = (closeAfterAdd) => {
		// attempts to add the modal info as a new soundChange
		ensureEnd([refAddBeginning, refAddEnding, refAddContext, refAddAnticontext]);
		const beginning = addBeginning.trim();
		const ending = addEnding.trim();
		const context = addContext.trim() || "_";
		const anticontext = addAnticontext.trim();
		const description = addDesc.trim();
		let msg = [];
		let id;
		if(!beginning) {
			msg.push("Beginning expression not provided");
		} else if (!ending) {
			msg.push("Ending expression not provided")
		} else if (!context) {
			// This shouldn't happen...
			msg.push("Context not provided")
		} else {
			const ind = context.indexOf("_");
			if(ind === -1 || ind !== context.lastIndexOf("_")) {
				msg.push("Context must contain exactly one instance of _ the underscore")
			}
			if(anticontext) {
				const ind = anticontext.indexOf("_");
				if(ind === -1 || ind !== anticontext.lastIndexOf("_")) {
					msg.push("Anticontext must contain exactly one instance of _ the underscore")
				}
			}
		}
		if(msg.length > 0) {
			// If we have errors, abort with an alert
			setSaveSoundChangeError(msg.join(", ") + ".");
			setAlertOpenError(true);
			return;
		}
		do {
			id = uuidv4();
		} while(soundChanges.some(t => t.id === id));
		let newSC = {
			id,
			beginning,
			ending,
			context
		};
		if(anticontext) {
			newSC.anticontext = anticontext;
		}
		if(description) {
			newSC.description = description;
		}
		dispatch(addSoundChange(newSC));
		doToast({
			toast,
			placement: "top",
			msg: "Sound Change added!",
			fontSize: smallerSize
		});
		if (closeAfterAdd) {
			closeAddSoundChange();
		} else {
			clearAddModal();
			refAddBeginning.current && refAddBeginning.current.focus && refAddBeginning.current.focus();
		}
	};
	const clearAddModal = () => {
		// clears the form info
		refAddBeginning.current && refAddBeginning.current.clear && refAddBeginning.current.clear();
		refAddContext.current && refAddContext.current.clear && refAddContext.current.clear();
		refAddEnding.current && refAddEnding.current.clear && refAddEnding.current.clear();
		refAddAnticontext.current && refAddAnticontext.current.clear && refAddAnticontext.current.clear();
		refAddDesc.current && refAddDesc.current.clear && refAddDesc.current.clear();
		setAddBeginning("");
		setAddEnding("");
		setAddContext("");
		setAddAnticontext("");
		setAddDesc("");
	};
	const closeAddSoundChange = () => {
		// closes the adding modal
		clearAddModal();
		setAddSoundChangeOpen(false);
	};

	// edit soundChange
	const startEditSoundChange = (soundChange) => {
		// Opens the editing modal and populates it
		const {id, beginning, ending, context, anticontext, description} = soundChange;
		setModifiedID(id);
		setModifiedBeginning(beginning);
		setModifiedEnding(ending);
		setModifiedContext(context);
		setModifiedAnticontext(anticontext || "");
		setModifiedDesc(description || "")
		setEditingSoundChange(soundChange);
	};
	const maybeSaveEditedSoundChange = () => {
		const msg = [];
		const modEnding = (modifiedEnding.trim());
		const modBeginning = (modifiedBeginning.trim());
		const modContext = (modifiedContext.trim());
		const modAnticontext = (modifiedAnticontext.trim());
		const modDesc = (modifiedDesc.trim());
		if(!modBeginning) {
			msg.push("Beginning expression not provided");
		} else if (!modEnding) {
			msg.push("Ending expression not provided")
		} else if (!modContext) {
			// This shouldn't happen...
			msg.push("Context not provided")
		} else {
			const ind = modContext.indexOf("_");
			if(ind === -1 || ind !== modContext.lastIndexOf("_")) {
				msg.push("Context must contain exactly one instance of _ the underscore")
			}
			if(modAnticontext) {
				const ind = modAnticontext.indexOf("_");
				if(ind === -1 || ind !== modAnticontext.lastIndexOf("_")) {
					msg.push("Anticontext must contain exactly one instance of _ the underscore")
				}
			}
		}
		if(msg.length > 0) {
			// If we have errors, abort with an alert
			setSaveSoundChangeError(msg.join(", ") + ".");
			setAlertOpenError(true);
			return;
		}
		let edited = {
			id: modifiedID,
			beginning: modBeginning,
			ending: modEnding,
			context: modContext
		}
		if(modAnticontext) {
			edited.anticontext = modAnticontext;
		}
		if(modDesc) {
			edited.description = modDesc;
		}
		dispatch(editSoundChange(edited));
		doToast({
			toast,
			placement: "top",
			msg: "Sound Change edited!",
			fontSize: smallerSize
		});
		setEditingSoundChange(false);
	};

	// delete soundChange
	const maybeDeleteSoundChange = (soundChange) => {
		if(disableConfirms) {
			return doDeleteSoundChange(soundChange);
		}
		// create the label
		const {beginning, ending, context, anticontext} = soundChange;
		setSoundChangeDeletingString(
			`${beginning} ⟶ ${ending} / ${context}`
			+ (anticontext ? ` ! ${anticontext}` : "")
		);
		// open the delete alert
		setDeletingSoundChange(soundChange);
	};
	const doDeleteSoundChange = (soundChange) => {
		dispatch(deleteSoundChange(soundChange.id));
		doToast({
			toast,
			placement: "bottom",
			msg: "Deleted",
			bg: "warning.500",
			fontSize: smallerSize
		});
		setEditingSoundChange(false);
		setDeletingSoundChange(false);
	};

	// rearrange sound changes
	const lastSC = soundChanges.length - 1;
	const moveUpInList = (i) => {
		if(i === 0) {
			return;
		}
		const item = soundChanges[i];
		const pre = soundChanges.slice(0, i);
		const post = soundChanges.slice(i + 1);
		const moved = pre.pop();
		dispatch(rearrangeSoundChanges([...pre, item, moved, ...post]));
	};
	const moveDownInList = (i) => {
		if(i === lastSC) {
			return;
		}
		const item = soundChanges[i];
		const pre = soundChanges.slice(0, i);
		const post = soundChanges.slice(i + 1);
		const moved = post.shift();
		dispatch(rearrangeSoundChanges([...pre, moved, item, ...post]));
	};

	// render sound change
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
	const T = (props) => <Text fontSize={textSize} {...props} />;
	const ArrowUp = ({index}) => {
		return reordering ?
			(
				<IconButton
					icon={<UpIcon color={index === 0 ? "transparent" : "primary.400"} size={textSize} />}
					accessibilityLabel="Move Up in List"
					bg={index === 0 ? "transparent" : "darker"}
					p={1}
					my={0.5}
					mr={2}
					flexGrow={0}
					flexShrink={0}
					onPress={() => moveUpInList(index)}
				/>
			)
		:
			<></>
		;
	};
	const ArrowDown = ({index}) => {
		return reordering ?
			(
				<IconButton
					icon={<DownIcon color={index === lastSC ? "transparent" : "primary.400"} size={textSize} />}
					accessibilityLabel="Move Down in List"
					bg={index === lastSC ? "transparent" : "darker"}
					p={1}
					my={0.5}
					ml={2}
					flexGrow={0}
					flexShrink={0}
					onPress={() => moveDownInList(index)}
				/>
			)
		:
			<></>
		;
	};
	const renderSoundChange = (soundChange, i) => {
		const {id, beginning, ending, context, anticontext, description} = soundChange;
		return (
			<HStack
				justifyContent="flex-start"
				alignItems="center"
				w="full"
				bg="main.800"
				py={1.5}
				px={2}
				borderBottomWidth={0.5}
				borderColor="main.700"
				key={`${id}-SoundChange`}
			>
				<ArrowUp index={i} />
				<VStack
					justifyContent="center"
					alignItems="flex-start"
					flex={1}
				>
					<HStack
						justifyContent="flex-start"
						alignItems="center"
						space={1.5}
					>
						<Unit>{beginning}</Unit>
						<T>⟶</T>
						<Unit>{ending}</Unit>
						<T>/</T>
						<Unit>{context}</Unit>
						{
							anticontext ?
								<>
									<T key={`${id}-anticontext-point`}>!</T>
									<Unit key={`${id}-anticontext`}>{anticontext}</Unit>
								</>
							:
								<Fragment key={`${id}-no-anticontext`} />
						}
					</HStack>
					<Text italic>{description || ""}</Text>
				</VStack>
				<HStack
					flexShrink={0}
					flexGrow={0}
				>
					<IconButton
						icon={<EditIcon color="primary.400" size={smallerSize} />}
						accessibilityLabel="Edit"
						bg="transparent"
						p={1}
						m={0.5}
						onPress={() => startEditSoundChange(soundChange)}
					/>
					<IconButton
						icon={<TrashIcon color="danger.400" size={smallerSize} />}
						accessibilityLabel="Delete"
						bg="transparent"
						p={1}
						m={0.5}
						onPress={() => maybeDeleteSoundChange(soundChange)}
					/>
				</HStack>
				<ArrowDown index={i} />
			</HStack>
		);
	};
	return (
		<VStack h="full">
			<StandardAlert
				alertOpen={!!deletingSoundChange}
				setAlertOpen={setDeletingSoundChange}
				bodyContent={<Text fontSize={textSize}>Are you sure you want to delete the sound change <Text bold>{soundChangeDeletingString}</Text>? This cannot be undone.</Text>}
				continueText="Yes, Delete It"
				continueProps={{
					bg: "danger.500",
				}}
				continueFunc={() => doDeleteSoundChange(deletingSoundChange)}
				fontSize={textSize}
			/>
			<StandardAlert
				alertOpen={alertOpenError}
				setAlertOpen={setAlertOpenError}
				headerContent="Cannot Save Sound Change"
				headerProps={{
					bg: "error.500"
				}}
				bodyContent={saveSoundChangeError}
				overrideButtons={[
					({leastDestructiveRef}) => <Button
						onPress={() => setAlertOpenError(false)}
						ref={leastDestructiveRef}
					>Ok</Button>
				]}
				fontSize={textSize}
			/>
			<Modal isOpen={!!editingSoundChange}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center">
							<Text flex={1} px={3} fontSize={textSize} color={primaryContrast} textAlign="left">Edit Sound Change</Text>
							<ExtraChars color={primaryContrast} size={textSize} buttonProps={{flexGrow: 0, flexShrink: 0}} />
							<IconButton
								flexGrow={0}
								flexShrink={0}
								icon={<CloseCircleIcon color={primaryContrast} size={textSize}  />}
								onPress={() => setEditingSoundChange(false)}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack>
							<TextSetting
								text="Beginning Expression"
								placeholder="(what to replace)"
								inputProps={{ mt: 1, ref: refEditBeginning, fontSize: smallerSize }}
								labelProps={{ fontSize: textSize }}
								boxProps={{ pb: 2 }}
								value={modifiedBeginning}
								onChangeText={(v) => setModifiedBeginning(v)}
							/>
							<TextSetting
								text="Ending Expression"
								placeholder="(what to replace with)"
								boxProps={{ py: 2 }}
								inputProps={{ mt: 1, ref: refEditEnding, fontSize: smallerSize }}
								labelProps={{ fontSize: textSize }}
								value={modifiedEnding}
								onChangeText={(v) => setModifiedEnding(v)}
							/>
							<TextSetting
								text="Context"
								placeholder="(where to replace)"
								boxProps={{ py: 2 }}
								inputProps={{ mt: 1, ref: refEditContext, fontSize: smallerSize }}
								labelProps={{ fontSize: textSize }}
								value={modifiedContext}
								onChangeText={(v) => setModifiedContext(v)}
							/>
							<TextSetting
								text="Anticontext"
								placeholder="(where not to replace; optional)"
								boxProps={{ py: 2 }}
								inputProps={{ mt: 1, ref: refEditAnticontext, fontSize: smallerSize }}
								labelProps={{ fontSize: textSize }}
								value={modifiedAnticontext}
								onChangeText={(v) => setModifiedAnticontext(v)}
							/>
							<TextSetting
								text="Description"
								placeholder="(optional)"
								boxProps={{ py: 2 }}
								inputProps={{ mt: 1, ref: refEditDesc, fontSize: smallerSize }}
								labelProps={{ fontSize: textSize }}
								value={modifiedDesc}
								onChangeText={(v) => setModifiedDesc(v)}
							/>
						</VStack>
					</Modal.Body>
					<Modal.Footer>
						<HStack justifyContent="space-between" p={1} flexWrap="wrap">
							<Button
								startIcon={<TrashIcon color={dangerContrast} size={textSize} />}
								bg="danger.500"
								px={2}
								py={1}
								mx={1}
								onPress={() => maybeDeleteSoundChange(editingSoundChange)}
								_text={{fontSize: textSize}}
							>Delete</Button>
							<Button
								startIcon={<SaveIcon size={textSize} />}
								px={2}
								py={1}
								onPress={() => maybeSaveEditedSoundChange()}
								_text={{fontSize: textSize}}
							>Save</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<Modal isOpen={addSoundChangeOpen}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center">
							<Text flex={1} px={3} fontSize={textSize} color={primaryContrast}>Add Sound Change</Text>
							<ExtraChars color={primaryContrast} size={textSize} buttonProps={{flexGrow: 0, flexShrink: 0}} />
							<IconButton
								flexGrow={0}
								flexShrink={0}
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => closeAddSoundChange()}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack>
							<TextSetting
								text="Beginning Expression"
								placeholder="(what to replace)"
								inputProps={{ mt: 1, ref: refAddBeginning, fontSize: smallerSize, ...saveOnEnd(setAddBeginning) }}
								labelProps={{ fontSize: textSize }}
								boxProps={{ pb: 2 }}
							/>
							<TextSetting
								text="Ending Expression"
								placeholder="(what to replace with)"
								boxProps={{ py: 2 }}
								inputProps={{ mt: 1, ref: refAddEnding, fontSize: smallerSize, ...saveOnEnd(setAddEnding) }}
								labelProps={{ fontSize: textSize }}
							/>
							<TextSetting
								text="Context"
								placeholder="(where to replace)"
								boxProps={{ py: 2 }}
								inputProps={{ mt: 1, ref: refAddContext, fontSize: smallerSize, ...saveOnEnd(setAddContext) }}
								labelProps={{ fontSize: textSize }}
							/>
							<TextSetting
								text="Anticontext"
								placeholder="(where not to replace; optional)"
								boxProps={{ py: 2 }}
								inputProps={{ mt: 1, ref: refAddAnticontext, fontSize: smallerSize, ...saveOnEnd(setAddAnticontext) }}
								labelProps={{ fontSize: textSize }}
							/>
							<TextSetting
								text="Description"
								placeholder="(optional)"
								inputProps={{ mt: 1, ref: refAddDesc, fontSize: smallerSize, ...saveOnEnd(setAddDesc) }}
								labelProps={{ fontSize: textSize }}
								boxProps={{ pb: 2 }}
							/>
						</VStack>
					</Modal.Body>
					<Modal.Footer>
						<HStack justifyContent="flex-end" p={1} flexWrap="wrap">
							<Button
								startIcon={<AddIcon color={secondaryContrast} size={textSize} />}
								bg="secondary.500"
								px={2}
								py={1}
								mx={1}
								onPress={() => addNewSoundChange(false)}
								_text={{fontSize: textSize}}
							>Add</Button>
							<Button
								startIcon={<AddIcon size={textSize} />}
								px={2}
								py={1}
								onPress={() => addNewSoundChange(true)}
								_text={{fontSize: textSize}}
							>Add and Close</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<Fab
				bg="tertiary.500"
				renderInPortal={false}
				icon={<AddIcon color={tertiaryContrast} size={fabSize} />}
				accessibilityLabel="Add Sound Change"
				onPress={() => {
					setAddSoundChangeOpen(true);
					setReordering(false);
				}}
			/>
			<Fab
				bg="secondary.500"
				renderInPortal={false}
				icon={reordering ?
					<StopIcon color={secondaryContrast} size={fabSize} />
				:
					<ReorderIcon color={secondaryContrast} size={fabSize} />
				}
				accessibilityLabel={reordering ?
					"Stop Reordering"
				:
					"Reorder Sound Changes"
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
					{soundChanges.map((soundChange, i) => renderSoundChange(soundChange, i))}
				</ReAnimated.View>
				<Box h={20} bg="main.900" />
			</ScrollView>
		</VStack>
	);
};

export default WESoundChanges;
