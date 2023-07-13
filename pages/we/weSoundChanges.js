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
	useToast
} from "native-base";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import SwipeableItem from "react-native-swipeable-item";

import {
	AddIcon,
	CloseCircleIcon,
	SaveIcon,
	TrashIcon,
	DragIndicatorIcon
} from "../../components/icons";
import { TextSetting } from "../../components/inputTags";
import StandardAlert from "../../components/StandardAlert";
import uuidv4 from '../../helpers/uuidv4';
import {
	addSoundChange,
	deleteSoundChange,
	editSoundChange,
	rearrangeSoundChanges
} from "../../store/weSlice";
import ExtraChars from "../../components/ExtraCharsButton";
import doToast from "../../helpers/toast";
import { ensureEnd, saveOnEnd } from "../../helpers/saveTextInput";
import getSizes from "../../helpers/getSizes";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { fontSizesInPx } from "../../store/appStateSlice";
import Underlay from "../../components/Underlay";

const WESoundChanges = () => {
	const { soundChanges } = useSelector(state => state.we);
	const { disableConfirms } = useSelector(state => state.appState);
	const dispatch = useDispatch();
	const [alertOpenError, setAlertOpenError] = useState(false);
	const [saveSoundChangeError, setSaveSoundChangeError] = useState('');

	const [deletingSoundChange, setDeletingSoundChange] = useState(false);
	const [soundChangeDeletingString, setSoundChangeDeletingString] = useState("");

	const [editingSoundChange, setEditingSoundChange] = useState(false);
	const [modifiedID, setModifiedID] = useState(false);
	const [modifiedBeginning, setModifiedBeginning] = useState("");
	const [modifiedEnding, setModifiedEnding] = useState("");
	const [modifiedContext, setModifiedContext] = useState("");
	const [modifiedException, setModifiedException] = useState("");
	const [modifiedDesc, setModifiedDesc] = useState("");
	// are these even needed?
	const refEditBeginning = useRef(null);
	const refEditEnding = useRef(null);
	const refEditContext = useRef(null);
	const refEditException = useRef(null);
	const refEditDesc = useRef(null);

	const [addSoundChangeOpen, setAddSoundChangeOpen] = useState(false);
	const [addBeginning, setAddBeginning] = useState("");
	const [addEnding, setAddEnding] = useState("");
	const [addContext, setAddContext] = useState("");
	const [addException, setAddException] = useState("");
	const [addDesc, setAddDesc] = useState("");
	const refAddBeginning = useRef(null);
	const refAddEnding = useRef(null);
	const refAddContext = useRef(null);
	const refAddException = useRef(null);
	const refAddDesc = useRef(null);

	const [fabSize, textSize, smallerSize] = getSizes("md", "sm", "xs");
	const emSize = fontSizesInPx[textSize] || fontSizesInPx.xs;
	const toast = useToast();
	const primaryContrast = useContrastText("primary.500");
	const secondaryContrast = useContrastText("secondary.500");
	const tertiaryContrast = useContrastText("tertiary.500");
	const dangerContrast = useContrastText("danger.500");

	const [appHeaderHeight, viewHeight, tabBarHeight] = useOutletContext();

	const [renderNum, setRenderNum] = useState(10);
	useEffect(() => {
		const estimatedRow = emSize * 3.5;
		setRenderNum(Math.ceil(viewHeight / estimatedRow));
	}, [viewHeight, emSize]);

	// add soundChange
	const addNewSoundChange = (closeAfterAdd) => {
		// attempts to add the modal info as a new soundChange
		ensureEnd([refAddBeginning, refAddEnding, refAddContext, refAddException]);
		const beginning = addBeginning.trim();
		const ending = addEnding.trim();
		const context = addContext.trim() || "_";
		const exception = addException.trim();
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
			if(exception) {
				const ind = exception.indexOf("_");
				if(ind === -1 || ind !== exception.lastIndexOf("_")) {
					msg.push("Exception must contain exactly one instance of _ the underscore")
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
		if(exception) {
			newSC.exception = exception;
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
		refAddException.current && refAddException.current.clear && refAddException.current.clear();
		refAddDesc.current && refAddDesc.current.clear && refAddDesc.current.clear();
		setAddBeginning("");
		setAddEnding("");
		setAddContext("");
		setAddException("");
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
		const {id, beginning, ending, context, exception, description} = soundChange;
		setModifiedID(id);
		setModifiedBeginning(beginning);
		setModifiedEnding(ending);
		setModifiedContext(context);
		setModifiedException(exception || "");
		setModifiedDesc(description || "")
		setEditingSoundChange(soundChange);
	};
	const maybeSaveEditedSoundChange = () => {
		const msg = [];
		const modEnding = (modifiedEnding.trim());
		const modBeginning = (modifiedBeginning.trim());
		const modContext = (modifiedContext.trim());
		const modException = (modifiedException.trim());
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
			if(modException) {
				const ind = modException.indexOf("_");
				if(ind === -1 || ind !== modException.lastIndexOf("_")) {
					msg.push("Exception must contain exactly one instance of _ the underscore")
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
		if(modException) {
			edited.exception = modException;
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
		const {beginning, ending, context, exception} = soundChange;
		setSoundChangeDeletingString(
			`${beginning} ⟶ ${ending} / ${context}`
			+ (exception ? ` ! ${exception}` : "")
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
	const renderSoundChange = ({item, index, drag, isActive}) => {
		const {id, beginning, ending, context, exception, description} = item;
		return (
			<SwipeableItem
				renderUnderlayRight={() => <Underlay fontSize={textSize} onPress={() => startEditSoundChange(item)} />}
				renderUnderlayLeft={() => <Underlay left fontSize={textSize} onPress={() => maybeDeleteSoundChange(item)} />}
				snapPointsLeft={[150]}
				snapPointsRight={[150]}
				swipeEnabled={true}
				activationThreshold={5}
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
						/>
						<VStack
							justifyContent="center"
							alignItems="flex-start"
							flex={1}
							ml={2}
							style={{overflow: "hidden"}}
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
								{exception &&
									<Fragment key={`${id}-no-exception`}>
										<T key={`${id}-exception-point`}>!</T>
										<Unit key={`${id}-exception`}>{exception}</Unit>
									</Fragment>
								}
							</HStack>
							{description && <Text italic key={`${id}//desc`}>{description}</Text>}
						</VStack>
						<DragIndicatorIcon
							size={textSize}
							flexGrow={0}
							flexShrink={0}
						/>
					</HStack>
				</TouchableWithoutFeedback>
			</SwipeableItem>
		);
	};
	return (
		<GestureHandlerRootView style={{maxHeight: viewHeight}}><VStack style={{maxHeight: viewHeight}} bg="main.900">
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
								text="Exception"
								placeholder="(where not to replace; optional)"
								boxProps={{ py: 2 }}
								inputProps={{ mt: 1, ref: refEditException, fontSize: smallerSize }}
								labelProps={{ fontSize: textSize }}
								value={modifiedException}
								onChangeText={(v) => setModifiedException(v)}
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
								text="Exception"
								placeholder="(where not to replace; optional)"
								boxProps={{ py: 2 }}
								inputProps={{ mt: 1, ref: refAddException, fontSize: smallerSize, ...saveOnEnd(setAddException) }}
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
				}}
			/>
			<DraggableFlatList
				data={soundChanges}
				renderItem={renderSoundChange}
				keyExtractor={(item, index) => `${item.id}-${index}`}
				onDragEnd={(end) => {
					const { from, to, data } = end;
					from !== to && dispatch(rearrangeSoundChanges(data));
				}}
				autoscrollThreshold={20}
				containerStyle={{
					maxHeight: viewHeight
				}}
				ListFooterComponent={<Box h={20} />}
				initialNumToRender={renderNum}
			/>
		</VStack></GestureHandlerRootView>
	);
};

export default WESoundChanges;
