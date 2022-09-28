import {
	Button,
	Center,
	HStack,
	IconButton,
	Modal,
	Radio,
	Spinner,
	Text,
	useBreakpointValue,
	useContrastText,
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

import { wgCustomStorage, OldCustomStorageWG } from '../../helpers/persistentInfo';
import { equalityCheck, loadWGState } from '../../store/wgSlice';
import ExtraChars from '../../components/ExtraCharsButton';
import { CloseCircleIcon, LoadIcon, TrashIcon } from '../../components/icons';
import StandardAlert from '../../components/StandardAlert';
import doToast from '../../helpers/toast';
import { LoadingOverlay } from '../../components/FullBodyModal';

const LoadCustomInfoModal = ({
	modalOpen,
	closeModal,
	triggerResets
}) => {
	const dispatch = useDispatch();
	const {
		storedCustomInfo
	} = useSelector((state) => state.wg, equalityCheck);
	const { sizes, disableConfirms } = useSelector(state => state.appState);
	// state variable for holding saved custom info keys
	const [customInfoChosen, setCustomInfoChosen] = useState(undefined);
	const [customLabelChosen, setCustomLabelChosen] = useState(undefined);
	const [customInfo, setCustomInfo] = useState([]);
	const [overwriteWarningOpen, setOverwriteWarningOpen] = useState(false);
	const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
	const [gettingStoredInfo, setGettingStoredInfo] = useState(false);
	const [retrievedInfo, setRetrievedInfo] = useState(null);
	const [loadingOverlayOpen, setLoadingOverlayOpen] = useState(false);
	const inputSize = useBreakpointValue(sizes.xs);
	const textSize = useBreakpointValue(sizes.sm);
	const largeText = useBreakpointValue(sizes.xl);
	const primaryContrast = useContrastText("primary.500");
	const secondaryContrast = useContrastText("secondary.500");
	const toast = useToast();
	useEffect(() => {
		const keys = Object.keys(storedCustomInfo);
		setCustomInfo(keys);
	}, [storedCustomInfo]);
	// TO-DO: Finish everything else!!!
	//TO-DO: Figure out this Promise hell, why it's fetching info and
	//   then immediately loading instead of waiting for the yes/no
	//   prompt to be answered
	const maybeLoadInfo = () => {
		// Fetch the info
		fetchInfo();
		if(disableConfirms) {
			return waitForInfoToLoad();
		}
		// Show the warning dialog
		setOverwriteWarningOpen(true);
	};
	const waitForInfoToLoad = () => {
		// Display loading overlay or alert
		//    while info is still being fetched - probably a full-size
		//    modal, like MS's modals
		setLoadingOverlayOpen(true);
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
			setLoadingOverlayOpen(false);
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
	const finishLoadInfo = (loaded) => {
		const loadedInfo = JSON.parse(loaded);
		const {label, info} = loadedInfo;
		setRetrievedInfo(null);
		// Dispatch the new info to store
		dispatch(loadWGState(info));
		// Trigger any resets needed on the main page
		triggerResets();
		setLoadingOverlayOpen(false);
		doToast({
			toast,
			msg: label ? `"${label}" loaded` : "Info loaded",
			placement: "top",
			fontSize: textSize
		});
	};
	// TO-DO: Delete stored info
	const maybeDeleteInfo = () => {
		const thenFunc = () => {
			let newCustom = customInfoxxx.filter(ci => ci !== title);
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
		<><LoadingOverlay
			overlayOpen={loadingOverlayOpen}
			colorFamily="secondary"
			contents={<Text fontSize={largeText} color={secondaryContrast} textAlign="center">Loading "{customLabelChosen}"...</Text>}
		/>
		<StandardAlert
			alertOpen={overwriteWarningOpen}
			setAlertOpen={setOverwriteWarningOpen}
			bodyContent={`Are you sure you want to load "${customLabelChosen}"? This will overwrite all current Character Groups, Syllables, Transformations and Settings.`}
			continueText="Yes"
			continueFunc={loadingApproved}
			fontSize={textSize}
		/>
		<StandardAlert
			alertOpen={deleteWarningOpen}
			setAlertOpen={setDeleteWarningOpen}
			bodyContent={`Are you sure you want to delete "${customLabelChosen}"? This cannot be undone.`}
			continueText="Yes"
			continueFunc={doDeleteInfo}
			continueProps={{
				bg: "danger.500",
				_text: {
					color: "danger.50"
				}
			}}
			fontSize={textSize}
		/>
		<Modal isOpen={modalOpen} size="sm">
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
								onPress={closeModal}
							/>
						</HStack>
					</HStack>
				</Modal.Header>
				<Modal.Body m={0} p={0}>
					{customInfo.length > 0 ?
						<ReAnimated.View
							entering={FlipInYRight}
							exiting={FlipOutYRight}
							style={{flex: 1, width: "100%"}}
						>
							<Radio.Group
								value={customInfoChosen}
								onChange={(v) => {
									setCustomInfoChosen(v);
									setCustomLabelChosen(storedCustomInfo[v]);
								}}
								alignItems="flex-start"
								justifyContent="center"
								mx="auto"
								my={4}
								label="List of Custom Info saved"
							>
								{customInfo.map(id => (
									<Radio
										key={`${id}-RadioButton`}
										size={textSize}
										value={id}
										_text={{
											fontSize: inputSize,
											isTruncated: true
										}}
										my={1}
									>{storedCustomInfo[id]}</Radio>
								))}
							</Radio.Group>
						</ReAnimated.View>
					:
						<ReAnimated.View
							entering={FlipInYRight}
							exiting={FlipOutYRight}
							style={{flex: 1, width: "100%"}}
						>
							<Center p={4}>
								<Text fontSize={textSize} bold>No information has been stored.</Text>
							</Center>
						</ReAnimated.View>
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
							onPress={closeModal}
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
		</Modal></>
	);
};

export default LoadCustomInfoModal;
