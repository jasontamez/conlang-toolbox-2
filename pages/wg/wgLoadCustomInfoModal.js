import {
	Button,
	Center,
	HStack,
	IconButton,
	Modal,
	Radio,
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

import { wgCustomStorage } from '../../helpers/persistentInfo';
import { equalityCheck, loadWGState, setStoredCustomInfo } from '../../store/wgSlice';
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
		storedCustomInfo,
		storedCustomIDs
	} = useSelector((state) => state.wg, equalityCheck);
	const { sizes, disableConfirms } = useSelector(state => state.appState);
	// state variable for holding saved custom info keys
	const [customInfoChosen, setCustomInfoChosen] = useState(null);
	const [customLabelChosen, setCustomLabelChosen] = useState(null);
	const [overwriteWarningOpen, setOverwriteWarningOpen] = useState(false);
	const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
	const [loadingOverlayOpen, setLoadingOverlayOpen] = useState(false);
	const inputSize = useBreakpointValue(sizes.xs);
	const textSize = useBreakpointValue(sizes.sm);
	const largeText = useBreakpointValue(sizes.xl);
	const primaryContrast = useContrastText("primary.500");
	const secondaryContrast = useContrastText("secondary.500");
	const toast = useToast();
	useEffect(() => {
		if(storedCustomIDs.length > 0) {
			const [first, ...etc] = storedCustomIDs;
			setCustomInfoChosen(first);
			setCustomLabelChosen(storedCustomInfo[first])
		} else {
			setCustomInfoChosen(null);
			setCustomLabelChosen(null);
		}
	}, [storedCustomIDs, storedCustomInfo]);
	const maybeLoadInfo = () => {
		if(disableConfirms) {
			// close modal
			closeModal();
			// Skip the warning dialog
			return fetchInfo();
		}
		// Show the warning dialog
		setOverwriteWarningOpen(true);
	};
	const fetchInfo = async () => {
		// open overlay
		setLoadingOverlayOpen(true);
		return await wgCustomStorage.getItem(customInfoChosen).then((result) => {
			// close overlay
			setLoadingOverlayOpen(false);
			// convert info
			const loadedInfo = JSON.parse(result);
			const { label, info } = loadedInfo;
			// Dispatch the new info to store
			dispatch(loadWGState(info));
			// Trigger any resets needed on the main page
			triggerResets();
			// Announce success
			doToast({
				toast,
				msg: `"${label}" loaded`,
				placement: "top",
				fontSize: textSize
			});
		}).catch((err) => {
			console.log("ERROR in getting custom info");
			console.log(err);
			setLoadingOverlayOpen(false);
		});
	};
	const maybeDeleteInfo = () => {
		if(disableConfirms) {
			// Skip the warning dialog
			return doDeleteInfo();
		}
		// Show the warning dialog
		setDeleteWarningOpen(true);
	};
	const doDeleteInfo = async () => {
		return await wgCustomStorage.removeItem(customInfoChosen).then(() => {
			let deleted = {...storedCustomInfo};
			// Announce success
			doToast({
				toast,
				msg: `"${customLabelChosen}" deleted`,
				scheme: "secondary",
				placement: "bottom",
				fontSize: textSize
			});
			// Dispatch the new info to store
			delete deleted[customInfoChosen];
			dispatch(setStoredCustomInfo(deleted));
		}).catch((err) => {
			console.log("ERROR in getting custom info");
			console.log(err);
		});
	};
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
			continueFunc={() => {
				setOverwriteWarningOpen(false);
				closeModal();
				fetchInfo();
			}}
			fontSize={textSize}
		/>
		<StandardAlert
			alertOpen={deleteWarningOpen}
			setAlertOpen={setDeleteWarningOpen}
			bodyContent={`Are you sure you want to delete "${customLabelChosen}"? This cannot be undone.`}
			continueText="Yes"
			continueFunc={() => {
				setDeleteWarningOpen(false);
				doDeleteInfo();
			}}
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
					{storedCustomIDs.length > 0 ?
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
								{storedCustomIDs.map(id => (
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
