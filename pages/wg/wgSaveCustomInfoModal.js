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
import { v4 as uuidv4 } from 'uuid';

import { wgCustomStorage } from '../../helpers/persistentInfo';
import { equalityCheck, setStoredCustomInfo } from '../../store/wgSlice';
import ExtraChars from '../../components/ExtraCharsButton';
import { CloseCircleIcon, SaveIcon } from '../../components/icons';
import StandardAlert from '../../components/StandardAlert';
import { DropDown, TextSetting, ToggleSwitch } from '../../components/inputTags';
import doToast from '../../helpers/toast';
import { LoadingOverlay } from '../../components/FullBodyModal';
import getSizes from '../../helpers/getSizes';
//import doExport from '../../components/ExportServices';

const SaveCustomInfoModal = ({
	modalOpen,
	closeModal
}) => {
	const dispatch = useDispatch();
	const {
		characterGroups,
		multipleSyllableTypes,
		syllableDropoffOverrides,
		singleWord,
		wordInitial,
		wordMiddle,
		wordFinal,
		transforms,
		monosyllablesRate,
		maxSyllablesPerWord,
		characterGroupDropoff,
		syllableBoxDropoff,
		capitalizeSentences,
		declarativeSentencePre,
		declarativeSentencePost,
		interrogativeSentencePre,
		interrogativeSentencePost,
		exclamatorySentencePre,
		exclamatorySentencePost,
		storedCustomInfo,
		storedCustomIDs
	} = useSelector((state) => state.wg, equalityCheck);
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
			info: {
				characterGroups,
				multipleSyllableTypes,
				syllableDropoffOverrides,
				singleWord,
				wordInitial,
				wordMiddle,
				wordFinal,
				transforms,
				monosyllablesRate,
				maxSyllablesPerWord,
				characterGroupDropoff,
				syllableBoxDropoff,
				capitalizeSentences,
				declarativeSentencePre,
				declarativeSentencePost,
				interrogativeSentencePre,
				interrogativeSentencePost,
				exclamatorySentencePre,
				exclamatorySentencePost	
			}
		};
		setIsSaving(true);
		wgCustomStorage.setItem(id, JSON.stringify(save)).then(() => {
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
	return (
		<>
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
						>Save Preset</Text>
						<HStack justifyContent="flex-end" space={2}>
							<ExtraChars
								color={primaryContrast}
								size={textSize}
								buttonProps={{p: 1, m: 0}}
							/>
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								p={1}
								m={0}
								variant="ghost"
								onPress={closeModal}
							/>
						</HStack>
					</HStack>
				</Modal.Header>
				<Modal.Body m={0} p={4}>
					<Box pb={4}>
						<Text textAlign="center">This will save all current Character Groups, Syllables, Transformations, and the settings on this page.</Text>
					</Box>
					<ToggleSwitch
						label={newSave ? "Make New Save" : "Overwrite Previous Save"}
						labelSize={textSize}
						switchState={newSave}
						switchToggle={() => setNewSave(!newSave)}
						switchProps={{
							disabled: storedCustomIDs.length === 0
						}}
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
					{newSave ?
						<TextSetting
							text="Give this save a title"
							placeholder=""
							onChangeText={(v) => setSaveName(v)}
							defaultValue=""
							inputProps={{ref: labelTextRef}}
							boxProps={{pt: 4}}
						/>
					:
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
					}
				</Modal.Body>
				<Modal.Footer borderTopWidth={0}>
					<HStack justifyContent="space-between" w="full" flexWrap="wrap">
						<Button
							bg="darker"
							onPress={closeModal}
							_text={{color: primaryContrast, fontSize: textSize}}
							p={1}
							m={2}
						>Cancel</Button>
						<Button
							onPress={() => {
								newSave ? maybeSaveNewInfo() : maybeOverwriteSave()
							}}
							_text={{fontSize: textSize}}
							startIcon={<SaveIcon size={textSize} />}
							p={1}
							m={2}
						>Save</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
		</>
	);
};

export default SaveCustomInfoModal;
