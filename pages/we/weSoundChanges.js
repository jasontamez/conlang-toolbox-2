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
	Pressable
} from "native-base";
import { Fragment, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, MotiView } from 'moti';
import { useOutletContext } from "react-router-dom";

import {
	AddIcon,
	CloseCircleIcon,
	DownIcon,
	DragHandleIcon,
	EditIcon,
	ReorderIcon,
	SaveIcon,
	StopIcon,
	TrashIcon,
	UpIcon
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

const WESoundChanges = () => {
	const { soundChanges } = useSelector(state => state.we);
	const { disableConfirms } = useSelector(state => state.appState);
	const dispatch = useDispatch();
	const [alertOpenError, setAlertOpenError] = useState(false);
	const [saveSoundChangeError, setSaveSoundChangeError] = useState('');

	const [deletingSoundChange, setDeletingSoundChange] = useState(false);
	const [soundChangeDeletingString, setSoundChangeDeletingString] = useState("");

	const [reordering, setReordering] = useState(false);
	const [reorderingInProgress, setReorderingInProgress] = useState(false);
	const [unitHeights, setUnitHeights] = useState({});
	const [iconWidths, setIconWidths] = useState(0);

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

	// rearrange sound changes
	const lastSC = soundChanges.length - 1;
	const moveUpInList = (i) => {
		if(reorderingInProgress || i === 0) {
			return;
		}
		const item = soundChanges[i];
		const pre = soundChanges.slice(0, i);
		const post = soundChanges.slice(i + 1);
		const moved = pre.pop();
		doMove(pre, item, [moved, ...post]);
	};
	const moveDownInList = (i) => {
		if(reorderingInProgress || i === lastSC) {
			return;
		}
		const item = soundChanges[i];
		const pre = soundChanges.slice(0, i);
		const post = soundChanges.slice(i + 1);
		const moved = post.shift();
		doMove([...pre, moved], item, post);
	};
	const doMove = (pre, item, post) => {
		setReorderingInProgress(true);
		dispatch(rearrangeSoundChanges([...pre, ...post]));
		setTimeout(() => {
			dispatch(rearrangeSoundChanges([...pre, item, ...post]));
			setTimeout(() => {
				setReorderingInProgress(false);
			}, 300);
		}, 300);
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
	const renderSoundChangeOLD = (soundChange, i) => {
		const {id, beginning, ending, context, exception, description} = soundChange;
		const unitHeight = unitHeights[id] || undefined;
		return (
			<MotiView
				from={{
					scaleY: 1,
					height: unitHeight
				}}
				animate={{
					scaleY: 1,
					height: unitHeight
				}}
				exit={{
					scaleY: reordering ? 0 : 1,
					height: reordering ? 0 : unitHeight
				}}
				transition={{
					type: "timing",
					duration: 200
				}}
				key={`${id}-SoundChange`}
			>
				<HStack
					justifyContent="flex-start"
					alignItems="center"
					w="full"
					bg="main.800"
					py={1.5}
					px={2}
					borderBottomWidth={0.5}
					borderColor="main.700"
					onLayout={(event) => {
						const {height} = event.nativeEvent.layout;
						if(!unitHeight || height > unitHeight) {
							const newHeights = {
								...unitHeights,
								[id]: height
							};
							setUnitHeights(newHeights);
							console.log(`${id} set to ${height}`);
							console.log(unitHeights);
						}
					}}
				>
					<ArrowUp index={i} />
					<VStack
						justifyContent="center"
						alignItems="flex-start"
						flex={1}
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
							{
								exception ?
									<>
										<T key={`${id}-exception-point`}>!</T>
										<Unit key={`${id}-exception`}>{exception}</Unit>
									</>
								:
									<Fragment key={`${id}-no-exception`} />
							}
						</HStack>
						{description && <Text italic key={`${id}//desc`}>{description}</Text>}
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
			</MotiView>
		);
	};
	const renderSoundChange = ({item, index, drag, isActive}) => {
		const {id, beginning, ending, context, exception, description} = item;
		const onPressIn = reordering ? drag : undefined;
		return (
			<TouchableWithoutFeedback
				onPressIn={onPressIn}
			>
				<HStack
					justifyContent="flex-start"
					alignItems="center"
					w="full"
					bg={isActive ? "main.700" : "main.800"}
					py={1.5}
					px={2}
					borderBottomWidth={0.5}
					borderColor="main.700"
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
					<AnimatePresence>
						{reordering ||
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
										icon={<EditIcon color="primary.400" size={smallerSize} />}
										accessibilityLabel="Edit"
										bg="transparent"
										p={1}
										m={0.5}
										onPress={() => startEditSoundChange(item)}
									/>
									<IconButton
										icon={<TrashIcon color="danger.400" size={smallerSize} />}
										accessibilityLabel="Delete"
										bg="transparent"
										p={1}
										m={0.5}
										onPress={() => maybeDeleteSoundChange(item)}
									/>
								</HStack>
							</MotiView>
						}
					</AnimatePresence>
				</HStack>
			</TouchableWithoutFeedback>
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
			{ reordering ||
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
			}
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
			{/*<ScrollView bg="main.900">
				<AnimatePresence>
					{soundChanges.map((soundChange, i) => renderSoundChangeOLD(soundChange, i))}
				</AnimatePresence>
				<Box h={20} bg="main.900" />
			</ScrollView>*/}
			<DraggableFlatList
				data={soundChanges}
				renderItem={renderSoundChange}
				keyExtractor={(item, index) => `${item.id}-${index}`}
				onDragEnd={(end) => {
					const { from, to, data } = end;
					from !== to && dispatch(rearrangeSoundChanges(data));
				}}
				autoscrollThreshold={1}
				containerStyle={{
					maxHeight: viewHeight
				}}
				ListFooterComponent={<Box h={20} />}
			/>
		</VStack></GestureHandlerRootView>
	);
};

export default WESoundChanges;
