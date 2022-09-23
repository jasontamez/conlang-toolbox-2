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
import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import { wgCustomStorage } from '../../helpers/persistentInfo';
import { equalityCheck } from '../../store/wgSlice';
import ExtraChars from '../../components/ExtraCharsButton';
import { CloseCircleIcon, SaveIcon } from '../../components/icons';
import StandardAlert from '../../components/StandardAlert';
import { TextSetting } from '../../components/inputTags';
import doToast from '../../helpers/toast';
import { LoadingOverlay } from '../../components/FullBodyModal';
//import doExport from '../../components/ExportServices';

const CustomInfoModal = ({
	modalOpen,
	setModalOpen
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
		exclamatorySentencePost
	} = useSelector((state) => state.wg, equalityCheck);
	const { sizes } = useSelector(state => state.appState);
	// state variable for holding saved custom info keys
	const [saveName, setSaveName] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const textSize = useBreakpointValue(sizes.sm);
	const largeText = useBreakpointValue(sizes.xl);
	const primaryContrast = useContrastText("primary.500");
	const tertiaryContrast = useContrastText("tertiary.500");
	const toast = useToast();
	const doCleanClose = () => {
		// close modal
		setModalOpen(false);
	};
	// TO-DO: Finish everything else!!!
	const maybeSaveInfo = () => {
		let title = saveName.trim();
		setSaveName(title);
		doSave(title);
	};
	const doSave = () => {
		const label = saveName.trim();
		setSaveName(label);
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
		wgCustomStorage.setItem(id, save).then(() => {
			doToast({
				toast,
				msg: "Info Saved",
				position: "top"
			});
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
			<StandardAlert
				alertOpen={alertOpen}
				setAlertOpen={setAlertOpen}
				bodyContent=""
				continueText="Yes"
				continueFunc={doLoadPreset}
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
						>Load Preset</Text>
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
								onPress={() => setModalOpen(false)}
							/>
						</HStack>
					</HStack>
				</Modal.Header>
				<Modal.Body m={0} p={0} size="sm">
					<Box>
						<Text textAlign="center">This will save all current Character Groups, Syllables, Transformations, and the settings on this page.</Text>
					</Box>
					<TextSetting
						text="Give this save a title"
						placeholder="(optional)"
						onChangeText={(v) => setSaveName(v)}
						defaultValue=""
					/>
				</Modal.Body>
				<Modal.Footer borderTopWidth={0}>
					<HStack justifyContent="space-between" w="full" flexWrap="wrap">
						<Button
							bg="darker"
							onPress={() => setModalOpen(false)}
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

export default CustomInfoModal;
