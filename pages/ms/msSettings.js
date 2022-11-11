import { Box, Button, IconButton, Text, VStack, Pressable, HStack, Modal, useContrastText, useToast } from "native-base";
//import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

import debounce from '../../helpers/debounce';
import { ResettableTextAreaSetting, ResettableTextSetting } from '../../components/inputTags';
import {
	setTitle,
	setDescription,
	setLastSave,
	setID,
	setStoredCustomInfo,
	loadState
} from "../../store/morphoSyntaxSlice";
import {
	AddCircleIcon,
	CloseCircleIcon,
	ExportIcon,
	LoadIcon,
	RemoveCircleIcon,
	SaveIcon,
	TrashIcon
} from "../../components/icons";
import getSizes from "../../helpers/getSizes";
import { MultiAlert } from "../../components/StandardAlert";
import doToast from "../../helpers/toast";
import { msCustomStorage } from "../../helpers/persistentInfo";
import { LoadingOverlay } from "../../components/FullBodyModal";

const Settings = () => {
	//const { msPage } = useParams();
	//const pageName = "s" + msPage.slice(-2);
	const {
		id,
		lastSave,
		title,
		description,
		bool,
		num,
		text,
		storedCustomInfo,
		storedCustomIDs
	} = useSelector((state) => state.morphoSyntax);
	const { disableConfirms } = useSelector((state) => state.appState);
	const dispatch = useDispatch();
	const [textSize, inputSize, largerSize] = getSizes("md", "sm", "lg");
	const primaryContrast = useContrastText("primary.500");
	const [alertOpen, setAlertOpen] = useState(false);
	const toast = useToast();
	const [chosenSave, setChosenSave] = useState(storedCustomIDs && storedCustomIDs.length > 0 && storedCustomIDs[0]);
	const [operation, setOperation] = useState(0);
	const [loadingOverlayOpen, setLoadingOverlayOpen] = useState(false);

	const [destroyingMS, setDestroyingMS] = useState({});

	const [reloadTrigger, setReloadTrigger] = useState(0);

	// Clear MS
	const doClearMS = () => {
		dispatch(loadState(null));
		setReloadTrigger(reloadTrigger + 1);
		doToast({
			toast,
			msg: "MorphoSyntax cleared",
			scheme: "warning",
			placement: "top"
		});
		setChosenSave(false);
	};

	// Load MS
	const maybeLoadMS = () => {
		if(disableConfirms) {
			return doLoadMS();
		}
		setAlertOpen("loadMS");
	};
	const doLoadMS = () => {
		setLoadingOverlayOpen(true);
		msCustomStorage.getItem(chosenSave).then(savedInfo => {
			const newMS = JSON.parse(savedInfo);
			dispatch(loadState(newMS));
			debounce(() => {
				setReloadTrigger(reloadTrigger + 1);
				setLoadingOverlayOpen(false);
				doToast({
					toast,
					msg: "MorphoSyntax Loaded",
					scheme: "success",
					fontSize: textSize
				});
				setChosenSave(false);
			}, {
				namespace: "loadingMS",
				amount: 500
			});
		});
	};

	// Delete MS
	const maybeDeleteMS = (id, title, time) => {
		if(disableConfirms) {
			return doDeleteMS(id, title);
		}
		setDestroyingMS({
			id,
			title,
			time,
			msg: "delete",
			func: () => doDeleteMS(id, title)
		});
		setAlertOpen('willDestroyMS');
	};
	const doDeleteMS = (id, title) => {
		const newInfo = {...storedCustomInfo};
		delete newInfo[id];
		doToast({
			toast,
			msg: `Deleting "${title}"...`,
			scheme: "danger",
			fontSize: textSize
		});
		setChosenSave(false);
		msCustomStorage.removeItem(id).then(() => {
			dispatch(setStoredCustomInfo(newInfo));
			doToast({
				toast,
				msg: `"${title}" deleted`,
				scheme: "danger",
				fontSize: textSize
			});
		}).catch((err) => {
			console.log(err);
			console.log(`${id} - "${title}"`);
			doToast({
				toast,
				msg: `Unable to delete "${title}"`,
				scheme: "danger",
				fontSize: textSize
			});
		});
	};

	// Save MS
	const maybeSaveMS = () => {
		// if there's a previous save loaded, default to overwriting that
		if(!title) {
			return doToast({
				toast,
				msg: "Please create a title for your MorphoSyntax before saving.",
				scheme: "error",
				placement: "top",
				fontSize: textSize
			});
		} else if(id) {
			// Previous save found.
			return doSaveMS();
		}
		// Otherwise, make an id and save
		doSaveNewMS();
	};
	const doSaveNewMS = () => doSaveMS(uuidv4());
	const doSaveMS = (saveID = id) => {
		const time = Date.now();
		doToast({
			toast,
			msg: "Saving MorphoSyntax...",
			scheme: "info",
			placement: "bottom",
			fontSize: textSize
		});
		msCustomStorage.setItem(saveID, JSON.stringify({
			id: saveID,
			lastSave: time,
			title,
			description,
			bool,
			num,
			text
		})).then(() => {
			// return val is undefined?
			id !== saveID && dispatch(setID(saveID));
			dispatch(setLastSave(time));
			let info = {...storedCustomInfo};
			info[saveID] = [ title, time ];
			dispatch(setStoredCustomInfo(info));
			doToast({
				toast,
				msg: "MorphoSyntax saved",
				scheme: "success",
				placement: "bottom",
				fontSize: textSize
			});
		});
	};
	const maybeOverwriteSaveMS = () => {
		const [title, lastSave] = storedCustomInfo[chosenSave];
		if(disableConfirms) {
			return doSaveMS(chosenSave);
		}
		const time = (new Date(lastSave)).toLocaleString();
		setDestroyingMS({
			id,
			title,
			time,
			msg: "overwrite",
			func: () => doSaveMS(chosenSave)
		});
		setAlertOpen('willDestroyMS');
	};

	// Export MS
	//const maybeExport

	// JSX
	const StoredInfoButton = ({onPress, bg, icon, text}) => {
		return (
			<Pressable
				onPress={onPress}
				mx={4}
			>
				<HStack
					bg={bg}
					space={3}
					p={2}
					alignItems="center"
				>
					{icon}
					<Text fontSize={textSize}>{text}</Text>
				</HStack>
			</Pressable>
		);
	};
	return (
		<VStack space={4} mt={3}>
			<ResettableTextSetting
				placeholder="Usually the language name."
				defaultValue={title}
				onChangeText={(v) => debounce(
					() => dispatch(setTitle(v)),
					{ namespace: "msName" }
				)}
				text="MorphoSyntax Title:"
				labelProps={{fontSize: textSize}}
				inputProps={{fontSize: inputSize}}
				reloadTrigger={reloadTrigger}
			/>
			<ResettableTextAreaSetting
				placeholder="A short description of this document."
				defaultValue={description}
				onChangeText={(v) => debounce(
					() => dispatch(setDescription(v)),
					{ namespace: "msDesc" }
				)}
				text="Description:"
				labelProps={{fontSize: textSize}}
				inputProps={{fontSize: inputSize}}
				reloadTrigger={reloadTrigger}
			/>
			<VStack alignSelf="flex-end">
				<LoadingOverlay
					overlayOpen={loadingOverlayOpen}
					colorFamily="secondary"
					contents={<Text fontSize={largerSize} color={useContrastText("secondary.500")} textAlign="center">Loading MorphoSyntax...</Text>}
				/>
				<MultiAlert
					alertOpen={alertOpen}
					setAlertOpen={setAlertOpen}
					sharedProps={{
						headerProps: {
							_text: {
								fontSize: largerSize,
								color: useContrastText("warning.500")
							}
						},
						fontSize: textSize
					}}
					passedProps={[
						{
							id: "clearMS",
							properties: {
								continueText: "Yes",
								continueFunc: doClearMS,
								continueProps: {
									bg: "danger.500"
								},
								bodyContent: "This will erase the Title, Description, every text box in the MorphoSyntax, and reset everything else to its default value. This cannot be undone. Are you sure you want to continue?"
							}
						},
						{
							id: "loadMS",
							properties: {
								continueText: "Yes",
								continueFunc: doLoadMS,
								continueProps: {
									bg: "danger.500"
								},
								bodyContent: "This will overwrite the current Title, Description, and everything else in the MorphoSyntax. It cannot be undone. Are you sure you want to continue?"
							}
						},
						{
							id: "willDestroyMS",
							properties: {
								continueText: "Yes",
								continueFunc: destroyingMS.func,
								continueProps: {
									bg: "danger.500"
								},
								bodyContent: (
									<VStack
										alignItems="center"
										justifyContent="center"
										py={2}
										px={4}
										space={2}
									>
										<Text fontSize={textSize} textAlign="center">You are about to {destroyingMS.msg}:</Text>
										<Box bg="darker" px={2} py={1}>
											<Text textAlign="center" fontSize={inputSize} bold>{destroyingMS.title}</Text>
											<Text textAlign="center" fontSize={inputSize}>Last save: <Text italic>{destroyingMS.time}</Text></Text>
										</Box>
										<Text fontSize={textSize} textAlign="center">Are you sure you want to {destroyingMS.msg} this? It cannot be undone.</Text>
									</VStack>
								)
							}
						},
						{
							id: "howToSaveMS",
							properties: {
								fontSize: textSize,
								detatchButtons: true,
								headerProps: {
									bg: "primary.500",
									_text: {
										color: primaryContrast
									}
								},
								headerContent: "Where to Save?",
								bodyContent: (
									<VStack
										justifyContent="center"
										alignItems="center"
										w="full"
									>
										<HStack
											flexWrap="wrap"
											justifyContent="space-between"
											flex={1}
											my={2}
											mx={2}
											space={2}
										> 
											<Button
												onPress={() => {
													setAlertOpen(false);
													doSaveNewMS();
												}}
												bg="primary.500"
												_text={{
													color: primaryContrast,
													fontSize: largerSize
												}}
												px={2.5}
												py={1.5}
											>New Save</Button>
											{
												storedCustomIDs.length > 0 ?
													<Button
														onPress={() => {
															setAlertOpen(false);
															setOperation(1);
														}}
														bg="secondary.500"
														_text={{
															color: primaryContrast,
															fontSize: largerSize
														}}
														px={2.5}
														py={1.5}
													>Overwrite Previous Save</Button>
												:
													<></>
											}
										</HStack>
									</VStack>
								),
								overrideButtons: [
									({leastDestructiveRef}) => <Button
										onPress={() => {
											setAlertOpen(false);
										}}
										bg="darker"
										ref={leastDestructiveRef}
										_text={{fontSize: textSize}}
										px={2}
										py={1}
									>Cancel</Button>
								]
							}
						}
					]}
				/>
				<Modal isOpen={operation !== 0}>
					<Modal.Content>
						<Modal.Header
							bg="primary.500"
							borderBottomWidth={0}
							px={3}
						>
							<HStack w="full" justifyContent="space-between" alignItems="center" pl={1.5}>
								<Text color={primaryContrast} fontSize={textSize}>{operation < 0 ? "Load" : "Save"} MorphoSyntax</Text>
								<IconButton
									icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
									onPress={() => setOperation(0)}
									variant="ghost"
									px={0}
								/>
							</HStack>
						</Modal.Header>
						<Modal.Body>
							{storedCustomIDs.map(info => {
								const [title, lastSave] = storedCustomInfo[info];
								const time = new Date(lastSave);
								const color = chosenSave === info ? primaryContrast : "text.50"
								const timeString = time.toLocaleString();
								// TO-DO: Determine if time.toLocaleString() is going to work
								//    or if we need to use Moment.js or something else
								return (
									<HStack
										key={info}
										alignItems="center"
										justifyContent="space-between"
										space={3}
									>
										<Pressable
											onPress={() => setChosenSave(info)}
											flex={1}
										>
											<HStack
												justifyContent="space-between"
												alignItems="center"
												borderWidth={1}
												borderColor={chosenSave === info ? "primary.500" : "darker"}
												borderRadius="xs"
												bg={chosenSave === info ? "primary.800" : "main.800"}
												px={1.5}
												py={1}
											>
												<VStack
													alignItems="flex-start"
													justifyContent="center"
												>
													<Text color={color} fontSize={textSize}>{title}</Text>
												</VStack>
												<Text color={color} italic fontSize={inputSize}>Saved: {timeString}</Text>
											</HStack>
										</Pressable>
										<IconButton
											icon={<TrashIcon color="danger.500" size={inputSize} />}
											variant="ghost"
											onPress={() => maybeDeleteMS(info, title)}
										/>
									</HStack>
								);
							})}
						</Modal.Body>
						<Modal.Footer
							borderTopWidth={0}
						>
							<HStack
								justifyContent="space-between"
								w="full"
								flexWrap="wrap"
							>
								<Button
									bg="lighter"
									_text={{color: "text.50", fontSize: textSize}}
									p={1}
									m={2}
									onPress={() => setOperation(0)}
								>Cancel</Button>
								{ operation < 0 ? [
									<Button
										key="load1"
										startIcon={<LoadIcon color="success.50" m={0} size={textSize} />}
										bg={chosenSave ? "success.500" : "muted.800"}
										_text={{color: "success.50", fontSize: textSize}}
										p={1}
										m={2}
										disabled={!chosenSave}
										onPress={() => {
											setOperation(0);
											maybeLoadMS();
										}}
									>Load</Button>
								] : [
									<Button
										key="save1"
										startIcon={<SaveIcon color={primaryContrast} m={0} size={textSize} />}
										bg="primary.500"
										_text={{color: primaryContrast, fontSize: textSize}}
										p={1}
										m={2}
										onPress={() => {
											setOperation(0);
											doSaveNewMS();
										}}
									>New Save</Button>,
									<Button
										key="save2"
										startIcon={<SaveIcon color="success.50" m={0} size={textSize} />}
										bg="success.500"
										_text={{color: "success.50", fontSize: textSize}}
										p={1}
										m={2}
										disabled={!chosenSave || storedCustomIDs.length === 0}
										onPress={() => {
											setOperation(0);
											maybeOverwriteSaveMS();
										}}
									>Overwrite Save</Button>
								]}
							</HStack>
						</Modal.Footer>
					</Modal.Content>
				</Modal>
				<StoredInfoButton
					bg="lighter"
					icon={<RemoveCircleIcon size={textSize} />}
					onPress={() => setAlertOpen("clearMS")}
					text="Clear MorphoSyntax Info"
				/>
				<StoredInfoButton
					bg="darker"
					icon={<AddCircleIcon size={textSize} />}
					onPress={() => {
						if(storedCustomIDs.length < 1) {
							return doToast({
								toast,
								msg: "There are no previous saves to load.",
								scheme: "error",
								placement: "bottom"
							});
						}
						setOperation(-1)
					}}
					text="Load MorphoSyntax Info"
				/>
				<StoredInfoButton
					bg="lighter"
					icon={<SaveIcon size={textSize} />}
					onPress={maybeSaveMS}
					text="Save MorphoSyntax Info"
				/>
				<StoredInfoButton
					bg="darker"
					icon={<SaveIcon size={textSize} />}
					onPress={() => {
						if(!title) {
							return doToast({
								toast,
								msg: "Please create a title for your MorphoSyntax before saving.",
								scheme: "error",
								placement: "top",
								fontSize: textSize
							});
						}
						setAlertOpen("howToSaveMS");
					}}
					text="Save as..."
				/>
				<StoredInfoButton
					bg="lighter"
					icon={<ExportIcon size={textSize} />}
					onPress={() => 2222}
					text="Export MorphoSyntax Info"
				/>
			</VStack>
		</VStack>
	);
};

export default Settings;
