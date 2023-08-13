import {
	Center,
	HStack,
	Modal,
	Text,
	useToast
} from 'native-base';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";

import Button from './Button';
import IconButton from './IconButton';
import { CloseCircleIcon, LoadIcon, TrashIcon } from './icons';
import StandardAlert from './StandardAlert';
import doToast from '../helpers/toast';
import { LoadingOverlay } from './FullBodyModal';
import { DropDown } from './inputTags';
import getSizes from '../helpers/getSizes';

const LoadCustomInfoModal = ({
	modalOpen,
	closeModal,
	triggerResets,
	customStorage,
	loadState,
	setStoredCustomInfo,
	storedCustomIDs,
	storedCustomInfo,
	overwriteMessage
}) => {
	const dispatch = useDispatch();
	const { disableConfirms } = useSelector(state => state.appState);
	// Info chosen
	const [customInfoChosen, setCustomInfoChosen] = useState(null);
	const [customLabelChosen, setCustomLabelChosen] = useState(null);
	// Controlling alerts
	const [overwriteWarningOpen, setOverwriteWarningOpen] = useState(false);
	const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
	// Controlling loading/deleting overlay
	const [loadingOverlayOpen, setLoadingOverlayOpen] = useState(false);
	const [textOnLoadingScreen, setTextOnLoadingScreen] = useState(false);

	const [textSize, largeText] = getSizes("sm", "xl");
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
		setTextOnLoadingScreen(`Loading "${customLabelChosen}"...`);
		setLoadingOverlayOpen(true);
		return await customStorage.getItem(customInfoChosen).then((result) => {
			// close overlay
			setLoadingOverlayOpen(false);
			// convert info
			const loadedInfo = JSON.parse(result);
			const { label, info } = loadedInfo;
			// Dispatch the new info to store
			dispatch(loadState(info));
			// Trigger any resets needed on the main page
			triggerResets && triggerResets();
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
		setTextOnLoadingScreen(`Deleting "${customLabelChosen}"...`);
		setLoadingOverlayOpen(true);
		return await customStorage.removeItem(customInfoChosen).then(() => {
			let deleted = {...storedCustomInfo};
			// Dispatch the new info to store
			delete deleted[customInfoChosen];
			dispatch(setStoredCustomInfo(deleted));
			// Announce success
			doToast({
				toast,
				msg: `"${customLabelChosen}" deleted`,
				scheme: "secondary",
				placement: "bottom",
				fontSize: textSize
			});
		}).catch((err) => {
			console.log("ERROR in getting custom info");
			console.log(err);
		}).finally(() => {
			setLoadingOverlayOpen(false);
		});
	};
	return (
		<><LoadingOverlay
			overlayOpen={loadingOverlayOpen}
			colorFamily="secondary"
			contents={<Text fontSize={largeText} color="secondary.50" textAlign="center">{textOnLoadingScreen}</Text>}
		/>
		<StandardAlert
			alertOpen={overwriteWarningOpen}
			setAlertOpen={setOverwriteWarningOpen}
			bodyContent={`Are you sure you want to load "${customLabelChosen}"? This will overwrite ${overwriteMessage}.`}
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
			continueProps={{ scheme: "danger" }}
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
							color="primary.50"
							fontSize={textSize}
							bold
						>Load Saved Info</Text>
						<IconButton
							icon={<CloseCircleIcon size={textSize} />}
							p={1}
							m={0}
							variant="ghost"
							scheme="primary"
							onPress={closeModal}
						/>
					</HStack>
				</Modal.Header>
				<Modal.Body m={0} p={0}>
					{storedCustomIDs.length > 0 ?
						<DropDown
							placement="top right"
							fontSize={textSize}
							defaultValue={customInfoChosen}
							labelFunc={() => customLabelChosen}
							title="Choose a Save:"
							onChange={(v) => {
								setCustomInfoChosen(v);
								setCustomLabelChosen(storedCustomInfo[v]);
							}}
							options={storedCustomIDs.map(id => {
								return {
									key: `${id}-CustomInfo`,
									value: id,
									label: storedCustomInfo[id]
								};
							})}
							buttonProps={{
								flex: 1,
								px: 2,
								my: 3,
								mr: 2,
								_stack: {
									justifyContent: "flex-start",
									alignItems: "center",
									flex: 1,
									space: 0,
									style: {
										overflow: "hidden"
									}
								}
							}}
						/>
					:
						<Center p={4}>
							<Text fontSize={textSize} bold>No information has been stored.</Text>
						</Center>
					}
				</Modal.Body>
				<Modal.Footer borderTopWidth={0}>
					<HStack justifyContent="space-between" w="full" flexWrap="wrap">
						<Button
							onPress={maybeDeleteInfo}
							_text={{fontSize: textSize}}
							startIcon={<TrashIcon size={textSize} />}
							p={1}
							m={2}
							scheme="danger"
						>Delete</Button>
						<Button
							bg="darker"
							pressedBg="lighter"
							color="text.50"
							onPress={closeModal}
							_text={{fontSize: textSize}}
							p={1}
							m={2}
						>Cancel</Button>
						<Button
							scheme="tertiary"
							onPress={maybeLoadInfo}
							_text={{fontSize: textSize}}
							startIcon={<LoadIcon size={textSize} />}
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
