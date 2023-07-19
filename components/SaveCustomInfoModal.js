import {
	Box,
	Button,
	HStack,
	IconButton,
	Modal,
	Text,
	useContrastText,
	useToast
} from 'native-base';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, MotiView } from 'moti';
import { useWindowDimensions } from 'react-native';
import { StorageAccessFramework } from 'expo-file-system';

import { CloseCircleIcon, ExportIcon, SaveIcon } from './icons';
import StandardAlert from './StandardAlert';
import { DropDown, TextSetting, ToggleSwitch } from './inputTags';
import doToast from '../helpers/toast';
import { LoadingOverlay } from './FullBodyModal';
import getSizes from '../helpers/getSizes';
import { flipFlop, maybeAnimate } from '../helpers/motiAnimations';
import { fontSizesInPx } from '../store/appStateSlice';
import uuidv4 from '../helpers/uuidv4';
//import doExport from './ExportServices';

const SaveCustomInfoModal = ({
	modalOpen,
	closeModal,
	customStorage,
	saveableObject,
	setStoredCustomInfo,
	storedCustomInfo,
	storedCustomIDs,
	savedInfoString
}) => {
	const dispatch = useDispatch();
	const { disableConfirms } = useSelector(state => state.appState);
	// state variable for holding saved custom info keys
	const [saveName, setSaveName] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [newSave, setNewSave] = useState(true);
	const [overwriteSaveID, setOverwriteSaveID] = useState(null);
	const [overwriteSaveLabel, setOverwriteSaveLabel] = useState(null);
	const [missingLabelAlert, setMissingLabelAlert] = useState(false);
	const [overwriteAlert, setOverwriteAlert] = useState(false);
	const [textSize, largeText] = getSizes("sm", "xl");
	const primaryContrast = useContrastText("primary.500");
	const tertiaryContrast = useContrastText("tertiary.500");
	const toast = useToast();
	const labelTextRef = useRef(null);
	const { width } = useWindowDimensions();
	const height = fontSizesInPx[textSize] * 5.5;
	useEffect(() => {
		const timeout = setTimeout(() => {
			if(storedCustomIDs.length > 0) {
				const id = storedCustomIDs[0];
				setOverwriteSaveID(id);
				setOverwriteSaveLabel(storedCustomInfo[id]);
			} else {
				setOverwriteSaveID(null);
				setOverwriteSaveLabel(null);
			}
		}, 50);
		return () => clearTimeout(timeout);
	}, [storedCustomIDs, storedCustomInfo]);
	// TO-DO: Double-check if this needs anything else
	const maybeSaveNewInfo = () => {
		let label = saveName.trim();
		setSaveName(label);
		// Warning if blank title
		if(label === "") {
			return setMissingLabelAlert(true);
		}
		// Go ahead and save
		const id = uuidv4();
		doSaving(id, label);
	};
	const maybeOverwriteSave = () => {
		if(disableConfirms) {
			// Just go ahead and overwrite
			return doOverwriteSave();
		}
		// open the alert box
		setOverwriteAlert(true);
	};
	const doOverwriteSave = () => doSaving(overwriteSaveID, overwriteSaveLabel);
	const doSaving = (id, label) => {
		const save = {
			label,
			info: saveableObject
		};
		setIsSaving(true);
		customStorage.setItem(id, JSON.stringify(save)).then(() => {
			let newStoredInfo = {...storedCustomInfo};
			newStoredInfo[id] = label;
			dispatch(setStoredCustomInfo(newStoredInfo));
			doToast({
				toast,
				msg: `Info Saved as "${label}"`,
				position: "top"
			});
			setSaveName("");
			labelTextRef.current && labelTextRef.current.clear && labelTextRef.current.clear();
		}).finally(() => {
			setIsSaving(false);
			closeModal();
		});
	};
	const maybeExportInfo = () => {
		let label = saveName.trim();
		setSaveName(label);
		// Warning if blank title
		if(label === "") {
			return setMissingLabelAlert(true);
		}
		// Go ahead and save
		try {
			const directory = StorageAccessFramework.getUriForDirectoryInRoot(".");
			closeModal();
			StorageAccessFramework.requestDirectoryPermissionsAsync(directory).then((result) => {
				const { directoryUri, granted } = result;
				doToast({
					toast,
					msg: "Requested: " + JSON.stringify(`${granted}: "${directoryUri}"`),
					position: "top",
					duration: 10000
				});
				StorageAccessFramework.createFileAsync(directoryUri, label, "text/json").then((x) => {
					doToast({
						toast,
						msg: "Created: " + JSON.stringify(x),
						position: "top",
						duration: 10000
					});
					StorageAccessFramework.writeAsStringAsync(`${directoryUri}/${label}.json`, JSON.stringify(saveableObject), {}).then((x) => {
						doToast({
							toast,
							msg: "Written: " + JSON.stringify(x),
							position: "top",
							duration: 10000
						});
					}).catch((x) => {
						doToast({
							toast,
							msg: "Not Written:",
							position: "top",
							duration: 10000
						});
						Object.keys(x).forEach(z => console.log(`"${z}": ${JSON.stringify(x[z])}`));
					});
				}).catch((x) => {
					doToast({
						toast,
						msg: "Did not create",
						position: "top",
						duration: 10000
					});
					console.log(JSON.stringify(x));
				});
			});
		} catch(err) {
			console.log(err);
			doToast({
				toast,
				msg: `ERROR`,
				position: "top"
			});
		}
	};
	//const maybeExportInfo = () => {
	//	let title = ($i("currentInfoExportName").value).trim();
	//	if(title === "") {
	//		// Toast error - needs title
	//	}
	//	title = title + ".json";
	//	const exporting = {
	//		categories,
	//		syllables,
	//		rules,
	//		settingsWG: {...settingsWG}
	//	}
	//	doExport(JSON.stringify(exporting), title)
	//		.catch((e = "Error?") => console.log(e))
	//		.then(() => doCleanClose());
	//};
	// TO-DO: Export Current Info to File
	//   name input
	return (<>
		<LoadingOverlay
			overlayOpen={isSaving}
			contents={<Text fontSize={largeText} color={tertiaryContrast} textAlign="center">Saving "{saveName}"...</Text>}
			colorFamily="tertiary"
		/>
		<Modal isOpen={modalOpen} size="md">
			<StandardAlert
				alertOpen={overwriteAlert}
				setAlertOpen={setOverwriteAlert}
				bodyContent={`Are you sure you want to overwrite "${overwriteSaveLabel}"? This cannot be undone.`}
				continueText="Yes"
				continueFunc={() => {
					setOverwriteAlert(false);
					doOverwriteSave();
				}}
				fontSize={textSize}
			/>
			<StandardAlert
				alertOpen={missingLabelAlert}
				setAlertOpen={setMissingLabelAlert}
				headerContent="Cannot Save"
				headerProps={{
					bg: "error.500"
				}}
				bodyContent="Please enter a title for this save."
				overrideButtons={[
					({leastDestructiveRef}) => <Button
						onPress={() => setMissingLabelAlert(false)}
						ref={leastDestructiveRef}
						py={1}
						px={2}
					>Ok</Button>
				]}
				fontSize={textSize}
			/>
			<Modal.Content>
				<Modal.Header>
					<HStack
						pl={2}
						w="full"
						justifyContent="space-between"
						space={5}
						alignItems="center"
						bg="primary.500"
					>
						<Text
							color={primaryContrast}
							fontSize={textSize}
							bold
						>Save Custom Info</Text>
						<IconButton
							icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
							p={1}
							m={0}
							variant="ghost"
							onPress={closeModal}
						/>
					</HStack>
				</Modal.Header>
				<Modal.Body m={0} p={4}>
					<Box pb={4}>
						<Text textAlign="center">This will save {savedInfoString}.</Text>
					</Box>
					{storedCustomIDs.length > 0 &&
						<ToggleSwitch
							key="previousSaveOrOverwrite"
							label={newSave ? "Making a New Save" : "Overwriting a Previous Save"}
							labelSize={textSize}
							switchState={newSave}
							switchToggle={() => setNewSave(!newSave)}
							hProps={{
								justifyContent: "center",
								space: 2,
								borderRadius: "sm",
								bg: "darker"
							}}
							vProps={{
								flexGrow: undefined,
								flexShrink: undefined
							}}
						/>
					}
					<AnimatePresence exitBeforeEnter
						style={{
							overflow: "hidden",
							display: "flex",
							flexDirection: "row",
							justifyContent: "center"
						}}
					>
						{newSave ?
							<MotiView
								{...maybeAnimate(
									storedCustomIDs.length > 0,
									flipFlop,
									{
										translateX: width / 3,
									},
									{
										opacity: 1
									},
									100
								)}
								key="makingANewSave"
								style={{
									overflow: "hidden",
									height
								}}
							>
								<TextSetting
									text="Give this save a title"
									placeholder=""
									onChangeText={(v) => setSaveName(v)}
									defaultValue=""
									inputProps={{ref: labelTextRef}}
									boxProps={{pt: 4}}
								/>
							</MotiView>
						:
							<MotiView
								{...flipFlop(
									{
										translateX: 0 - width / 3,
									},
									{
										opacity: 1
									},
									100
								)}
								style={{
									overflow: "hidden",
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									height
								}}
								key="overwritingAnOldSave"
							>
								<DropDown
									buttonProps={{
										ml: 0,
										mr: 0,
										mt: 4,
										mb: 2,
										flexShrink: 2
									}}
									fontSize={textSize}
									labelFunc={() => overwriteSaveLabel}
									onChange={(id) => {
										setOverwriteSaveID(id);
										setOverwriteSaveLabel(storedCustomInfo[id]);
									}}
									defaultValue={overwriteSaveID}
									title="Display:"
									options={storedCustomIDs.map((id) => {
										return {
											key: `${id}-Sorting`,
											value: id,
											label: storedCustomInfo[id]
										};
									})}
									bg="tertiary.500"
									color="tertiary.50"
								/>
							</MotiView>
						}
					</AnimatePresence>
				</Modal.Body>
				<Modal.Footer borderTopWidth={0}>
					<HStack justifyContent="space-between" w="full" flexWrap="wrap" px={2} py={1}>
						<Button
							bg="darker"
							onPress={closeModal}
							_text={{color: primaryContrast, fontSize: textSize}}
							py={1}
							px={2}
						>Cancel</Button>
						<Button
							onPress={maybeExportInfo}
							_text={{fontSize: textSize}}
							startIcon={<ExportIcon size={textSize} color="tertiary.50" />}
							bg="tertiary.500"
							py={1}
							px={2}
						>Export</Button>
						<Button
							onPress={newSave ? maybeSaveNewInfo : maybeOverwriteSave}
							_text={{fontSize: textSize}}
							startIcon={<SaveIcon size={textSize} />}
							py={1}
							px={2}
						>Save</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	</>);
};

export default SaveCustomInfoModal;
