import { Button, HStack, IconButton, Modal, Radio, Text } from 'native-base';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { wgCustomStorage, OldCustomStorageWG } from '../../helpers/PersistentInfo';
import { equalityCheck } from '../../store/wgSlice';
import ExtraChars from '../../components/ExtraCharsButton';
import { CloseCircleIcon } from '../../components/icons';
import StandardAlert from '../../components/StandardAlert';
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
	const disableConfirms = useSelector(state => state.appState.disableConfirms);
	// state variable for holding saved custom info keys
	const [savedCustomInfo, setSavedCustomInfo] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	// Grab keys when this loads
	useEffect(() => {
		loadKeys();
	}, []);
	const loadKeys = async () => {
		setIsLoading(true);
		const keys = await wgCustomStorage.getAllKeys();
		setSavedCustomInfo(keys || []);
		setIsLoading(false);
	};
	const doCleanClose = () => {
		// close modal
		setModalOpen(false);
	};
	// TO-DO: Finish everything else!!!
	const maybeSaveInfo = () => {
		let title = ($i("currentInfoSaveName").value).trim();
		if(title === "") {
			// toast error - need title
		}
		const doSave = (title, msg = "saved") => {
			const save = [
				//categories,
				//syllables,
				//rules,
				//{...settingsWG}
			];
			OldCustomStorageWG.setItem(title, save).then(() => {
				// toast - msg ("saved" or "overwritten")
			}).finally(() => doCleanClose());
		};
		// Check if overwriting
		OldCustomStorageWG.getItem(title).then((value) => {
			if(!value) {
				doSave(title);
			} else if (disableConfirms) {
				doSave(title, "overwritten");
			} else {
				// Alert - overwrite?
				// doSave(title, "overwritten");
			}
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
	// has ExtraChars
	// Save Current Info
	//   name input
	// Export Current Info to File
	//   name input
	// Load Saved Info
	//   map of saved info, each with Load and Delete buttons
	//   notice message if nothing previously saved
	return (
		<Modal isOpen={modalOpen} size="sm">
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
				<Modal.Body m={0} p={0}>
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
							bg="primary"
							onPress={() => setModalOpen(false)}
							_text={{color: primaryContrast, fontSize: textSize}}
							startIcon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
							p={1}
							m={2}
						>Close</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};

export default CustomInfoModal;
