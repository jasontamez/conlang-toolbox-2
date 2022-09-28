import {
	Box,
	Button,
	HStack,
	IconButton,
	Modal,
	Text,
	useBreakpointValue,
	useContrastText,
	useToast
} from 'native-base';
import { useRef, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import { wgCustomStorage } from '../../helpers/persistentInfo';
import { equalityCheck, setStoredCustomInfo } from '../../store/wgSlice';
import ExtraChars from '../../components/ExtraCharsButton';
import { CloseCircleIcon, SaveIcon } from '../../components/icons';
import StandardAlert from '../../components/StandardAlert';
import { TextSetting } from '../../components/inputTags';
import doToast from '../../helpers/toast';
import { LoadingOverlay } from '../../components/FullBodyModal';
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
		storedCustomInfo
	} = useSelector((state) => state.wg, equalityCheck);
	const { sizes } = useSelector(state => state.appState);
	// state variable for holding saved custom info keys
	const [saveName, setSaveName] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [missingLabelAlert, setMissingLabelAlert] = useState(false);
	const textSize = useBreakpointValue(sizes.sm);
	const largeText = useBreakpointValue(sizes.xl);
	const primaryContrast = useContrastText("primary.500");
	const tertiaryContrast = useContrastText("tertiary.500");
	const toast = useToast();
	const labelTextRef = useRef(null);
	// TO-DO: Double-check if this needs anything else
	const maybeSaveInfo = () => {
		let label = saveName.trim();
		setSaveName(label);
		// Warning if blank title
		if(label === "") {
			return setMissingLabelAlert(true);
		}
		// Go ahead and save
		const id = uuidv4();
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
			closeModal();
		}).finally(() => setIsSaving(false));
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
	// TO-DO: Overwrite Last Save
	//   name input
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
			{/*
			<StandardAlert
				alertOpen={alertOpen}
				setAlertOpen={setAlertOpen}
				bodyContent=""
				continueText="Yes"
				continueFunc={doLoadPreset}
				fontSize={textSize}
			/>
			*/}
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
					<TextSetting
						text="Give this save a title"
						placeholder=""
						onChangeText={(v) => setSaveName(v)}
						defaultValue=""
						inputProps={{ref: labelTextRef}}
					/>
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
							onPress={maybeSaveInfo}
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
