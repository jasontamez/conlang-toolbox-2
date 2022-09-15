import {
	Button,
	Center,
	HStack,
	IconButton,
	Modal,
	Radio,
	Spinner,
	Text,
	useToast
} from 'native-base';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import ReAnimated, {
	FlipInYRight,
	FlipOutYRight,
	ZoomInEasyDown,
	ZoomOutEasyDown
} from 'react-native-reanimated';

import { wgCustomStorage, OldCustomStorageWG } from '../../helpers/PersistentInfo';
import { equalityCheck } from '../../store/wgSlice';
import { setHasCheckedForOldCustomInfo_WG } from '../../store/appStateSlice';
import ExtraChars from '../../components/ExtraCharsButton';
import { CloseCircleIcon, LoadIcon, TrashIcon } from '../../components/icons';
import StandardAlert from '../../components/StandardAlert';
import doToast from '../../helpers/toast';

const CustomInfoModal = ({
	openModal,
	setOpenModal
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
	const { disableConfirms, hasCheckedForOldCustomInfo_WG } = useSelector(state => state.appState);
	// state variable for holding saved custom info keys
	const [savedCustomInfo, setSavedCustomInfo] = useState([]);
	const [initialLoadingInProgress, setInitialLoadingInProgress] = useState(true);
	const [customInfoChosen, setCustomInfoChosen] = useState(undefined);
	const [overwriteWarningOpen, setOverwriteWarningOpen] = useState(false);
	const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
	const [gettingStoredInfo, setGettingStoredInfo] = useState(false);
	const [retrievedInfo, setRetrievedInfo] = useState(null);
	const toast = useToast();
	// Grab keys when this mounts
	useEffect(() => {
		loadKeys();
	}, []);
	const loadKeys = async () => {
		// Look at storage and find the keys of all saved info
		setInitialLoadingInProgress(true);
		// First, look at the old storage method, if needed.
		hasCheckedForOldCustomInfo_WG ? false : await loadInfoFromOldStorage();
		// Get info from new storage
		const keys = await wgCustomStorage.getAllKeys();
		setSavedCustomInfo(keys || []);
		keys && keys.length > 0 && setCustomInfoChosen(keys[0]);
		setInitialLoadingInProgress(false);
	};
	const loadInfoFromOldStorage = async () => {
		let information = [];
		return OldCustomStorageWG.iterate((value, key) => {
			information.push([key, JSON.stringify(value)]);
			return; // Blank return keeps the loop going
		}).then(async () => {
			// Save to new storage system
			for(let x = 0; x < information.length; x++) {
				const [key, value] = information[x];
				// Save as stringified
				await wgCustomStorage.setItem(key, value);
			}
			// Doublecheck that everything was saved properly.
			let flag = true;
			for(let x = 0; x < information.length; x++) {
				const [key, value] = information[x];
				let test = await wgCustomStorage.getItem(key);
				if(test !== value) {
					flag = false;
					console.log(`${key} not saved`);
					console.log(`Expected [${value}]`);
					console.log(`Received {${test}}`);
				}
			}
			// Mark in the app that we no longer need to check old storage
			flag && dispatch(setHasCheckedForOldCustomInfo_WG(true));
			// Clear the old storage
			flag && OldCustomStorageWG.clear();
		}).catch((err) => {
			console.log(err);
		});
	};
	const doCleanClose = () => {
		// close modal
		setOpenModal(false);
	};
	// TO-DO: Finish everything else!!!
	const maybeLoadInfo = () => {
		// Fetch the info
		fetchInfo();
		if(disableConfirms) {
			return waitForInfoToLoad();
		}
		// TO-DO: Show overwrite warning
		setOverwriteWarningOpen(true);
	};
	const waitForInfoToLoad = () => {
		// TO-DO: display permanent loading toast or overlay or alert
		//    while info is still being fetched - probably a full-size
		//    modal, like MS's modals
	};
	const fetchInfo = async () => {
		// TO-DO: is this state variable really necessary?
		//   Is its purpose fulfilled by retrievedInfo?
		setGettingStoredInfo(true);
		const info = await wgCustomStorage.getItem(customInfoChosen);
		setGettingStoredInfo(false);
		// Check if the user is still deciding whether or not to overwrite
		if(!overwriteWarningOpen) {
			// If warning modal is closed, do the load
			// TO-DO: close the waitForInfoToLoad overlay thingie
			return finishLoadInfo(info);
		}
		// Modal open? Save info.
		setRetrievedInfo(info);
	};
	const loadingApproved = () => {
		// The overwrite warning has given the go-ahead
		setOverwriteWarningOpen(false);
		if(retrievedInfo === null) {
			// We're still waiting for the info.
			return waitForInfoToLoad();
		}
		// We're ok to go.
		finishLoadInfo(retrievedInfo);
	};
	const finishLoadInfo = (info) => {
		const newInfo = JSON.parse(info);
		setRetrievedInfo(null);
		// TO-DO: dispatch the new info to store
		// TO-DO: close the waitForInfoToLoad overlay thingie
		doToast({
			toast,
			// TO-DO: Fix toast message
			msg: `"${preset[0]}" loaded`,
			placement: "top",
			fontSize: inputSize
		});
	};
	const maybeDeleteInfo = () => {
		const thenFunc = () => {
			let newCustom = customInfo.filter(ci => ci !== title);
			//dispatch(setTemporaryInfo({type: "custominfo", data: newCustom}));
			OldCustomStorageWG.removeItem(title).then(() => {
				// toast
			});
		};
		if(disableConfirms) {
			thenFunc();
		} else {
			// Warning alert - deleting
			// thenFunc();
		}
	};
	const doDeleteInfo = () => {};
	// has ExtraChars
	// Save Current Info
	//   name input
	// Export Current Info to File
	//   name input
	// Load Saved Info
	//   map of saved info, each with Load and Delete buttons
	//   notice message if nothing previously saved
	return (
		<Modal isOpen={openModal} size="sm">
			<StandardAlert
				alertOpen={overwriteWarningOpen}
				setAlertOpen={setOverwriteWarningOpen}
				bodyContent=""
				continueText="Yes"
				continueFunc={loadingApproved}
				fontSize={textSize}
			/>
			<StandardAlert
				alertOpen={deleteWarningOpen}
				setAlertOpen={setDeleteWarningOpen}
				bodyContent=""
				continueText="Yes"
				continueFunc={doDeleteInfo}
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
					{initialLoadingInProgress ?
						<ReAnimated.View
							entering={ZoomInEasyDown}
							exiting={ZoomOutEasyDown}
							style={{flex: 1, width: "100%"}}
						>
							<HStack
								flexWrap="wrap"
								alignItems="center"
								justifyContent="center"
								space={10}
								py={4}
								w="full"
								bg="lighter"
							>
								<Text fontSize={size} textAlign="center">Loading...</Text>
								<Spinner size="lg" color="primary.500" />
							</HStack>
						</ReAnimated.View>
					:
						(savedCustomInfo.length > 0 ?
							<ReAnimated.View
								entering={FlipInYRight}
								exiting={FlipOutYRight}
								style={{flex: 1, width: "100%"}}
							>
								<Radio.Group
									value={customInfoChosen}
									onChange={(v) => setCustomInfoChosen(v)}
									alignItems="flex-start"
									justifyContent="center"
									mx="auto"
									my={4}
									label="List of Custom Info saved"
								>
									{savedCustomInfo.map(info => (
										<Radio
											key={`${info}-RadioButton`}
											size={textSize}
											value={info}
											_text={{
												fontSize: inputSize,
												isTruncated: true
											}}
											my={1}
										>{info}</Radio>
									))}
								</Radio.Group>
							</ReAnimated.View>
						:
							<ReAnimated.View
								entering={FlipInYRight}
								exiting={FlipOutYRight}
								style={{flex: 1, width: "100%"}}
							>
								<Center>
									<Text fontSize={textSize} bold>No information has been saved.</Text>
								</Center>
							</ReAnimated.View>
						)
					}
				</Modal.Body>
				<Modal.Footer borderTopWidth={0}>
					<HStack justifyContent="space-between" w="full" flexWrap="wrap">
						<Button
							bg="danger.500"
							onPress={maybeDeleteInfo}
							_text={{color: "danger.50", fontSize: textSize}}
							startIcon={<TrashIcon color="danger.50" size={textSize} />}
							p={1}
							m={2}
						>Delete</Button>
						<Button
							bg="darker"
							onPress={() => setModalOpen(false)}
							_text={{color: "text.50", fontSize: textSize}}
							p={1}
							m={2}
						>Cancel</Button>
						<Button
							bg="tertiary.500"
							onPress={maybeLoadInfo}
							_text={{color: "tertiary.50", fontSize: textSize}}
							startIcon={<LoadIcon color="tertiary.50" size={textSize} />}
							p={1}
							m={2}
						>Load</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};

export default CustomInfoModal;
