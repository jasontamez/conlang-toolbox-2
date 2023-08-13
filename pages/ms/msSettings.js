import { Box, Text, VStack, Pressable, HStack, Modal, useToast } from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import debounce from '../../helpers/debounce';
import uuidv4 from '../../helpers/uuidv4';
import Button from "../../components/Button";
import IconButton from "../../components/IconButton";
import { ResettableTextAreaSetting, ResettableTextSetting } from '../../components/inputTags';
import {
	setTitle,
	setDescription,
	setLastSave,
	setID,
	setStoredCustomInfo,
	loadStateMS as loadState
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
import { doText, doJSON, doDocx } from "./exportFuncs";
import doExport from "../../helpers/exportTools";

const Settings = () => {
	const msInfo = useSelector(state => state.morphoSyntax);
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
	} = msInfo;
	const { disableConfirms } = useSelector((state) => state.appState);
	const dispatch = useDispatch();
	const [textSize, inputSize, largerSize] = getSizes("md", "sm", "lg");
	const [alertOpen, setAlertOpen] = useState(false);
	const toast = useToast();
	const [chosenSave, setChosenSave] = useState(storedCustomIDs && storedCustomIDs.length > 0 && storedCustomIDs[0]);
	const [operation, setOperation] = useState(0);
	const [loadingOverlayOpen, setLoadingOverlayOpen] = useState(false);
	const [loadingMsg, setLoadingMsg] = useState("Loading MorphoSyntax...");

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
		setLoadingMsg("Loading MorphoSyntax...");
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
	const exportButtons = [
		{
			text: "Plain Text",
			info: async () => doText(msInfo),
			extension: "txt",
			encoding: "text/plain",
			scheme: "secondary"
		},
		{
			text: "MarkDown Text",
			info: async () => doText(msInfo, true),
			extension: "md",
			encoding: "text/markdown",
			scheme: "tertiary"
		},
		{
			text: "JSON file",
			info: async () => doJSON(msInfo),
			extension: "json",
			encoding: "text/json",
			scheme: "secondary"
		},
		{
			text: "Docx Document",
			info: async () => doDocx(msInfo),
			extension: "docx",
			encoding: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			scheme: "tertiary",
			isBase64: true
		}
	];

	// JSX
	const StoredInfoButton = ({onPress, bg, icon, text}) => {
		return (
			<Pressable
				onPress={onPress}
				mx={4}
				_pressed={{ opacity: 50, bg: "primary.400" }}
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
				labelSize={textSize}
				inputSize={inputSize}
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
				labelSize={textSize}
				inputSize={inputSize}
				reloadTrigger={reloadTrigger}
			/>
			<VStack alignSelf="flex-end">
				<LoadingOverlay
					overlayOpen={loadingOverlayOpen}
					colorFamily="secondary"
					contents={<Text fontSize={largerSize} color="secondary.50" textAlign="center">{loadingMsg}</Text>}
				/>
				<MultiAlert
					alertOpen={alertOpen}
					setAlertOpen={setAlertOpen}
					sharedProps={{
						headerProps: {
							_text: {
								fontSize: largerSize,
								color: "warning.50"
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
								continueProps: { scheme: "danger" },
								bodyContent: "This will erase the Title, Description, every text box in the MorphoSyntax, and reset everything else to its default value. This cannot be undone. Are you sure you want to continue?"
							}
						},
						{
							id: "loadMS",
							properties: {
								continueText: "Yes",
								continueFunc: doLoadMS,
								continueProps: { scheme: "danger" },
								bodyContent: "This will overwrite the current Title, Description, and everything else in the MorphoSyntax. It cannot be undone. Are you sure you want to continue?"
							}
						},
						{
							id: "willDestroyMS",
							properties: {
								continueText: "Yes",
								continueFunc: destroyingMS.func,
								continueProps: { scheme: "danger" },
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
										color: "primary.50"
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
												scheme="primary"
												_text={{ fontSize: largerSize }}
												px={2.5}
												py={1.5}
											>New Save</Button>
											{storedCustomIDs.length > 0 &&
												<Button
													onPress={() => {
														setAlertOpen(false);
														setOperation(1);
													}}
													scheme="secondary"
													_text={{ fontSize: largerSize }}
													px={2.5}
													py={1.5}
												>Overwrite Previous Save</Button>
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
										pressedBg="lighter"
										color="text.50"
										ref={leastDestructiveRef}
										_text={{fontSize: textSize}}
										px={2}
										py={1}
									>Cancel</Button>
								]
							}
						},
						{
							id: "exportMS",
							properties: {
								fontSize: textSize,
								detatchButtons: true,
								headerProps: {
									bg: "primary.500",
									_text: {
										color: "primary.50"
									}
								},
								headerContent: "Choose an Export Format",
								bodyContent: (
									<VStack
										justifyContent="center"
										alignItems="center"
										w="full"
										space={3}
									>
										{exportButtons.map(({text, info, extension, encoding, scheme, isBase64 = false}) => (
											<Button
												key={`button - ${text}`}
												onPress={async () => {
													setAlertOpen(false);
													setLoadingMsg("Exporting MorphoSyntax...");
													setLoadingOverlayOpen(true);
													info().then(async (result) => {
														return doExport(result, `MorphoSyntax - ${title}.${extension}`, encoding, isBase64).then((result) => {
															const {
																fail,
																filename
															} = result || { fail: true };
															doToast({
																toast,
																msg: fail || `Exported as "${filename}"`,
																scheme: fail ? "error" : "success",
																placement: "bottom",
																fontSize: textSize
															});
														}).finally(() => {
															setLoadingOverlayOpen(false);
														});
													});
												}}
												scheme={scheme}
												_text={{
													fontSize: inputSize,
													textAlign: "center"
												}}
												px={2.5}
												py={1.5}
											>Save as {text}</Button>
										))}
									</VStack>
								),
								overrideButtons: [
									({leastDestructiveRef}) => <Button
										onPress={() => {
											setAlertOpen(false);
										}}
										bg="darker"
										color="text.50"
										pressedBg="lighter"
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
								<Text color="primary.50" fontSize={textSize}>{operation < 0 ? "Load" : "Save"} MorphoSyntax</Text>
								<IconButton
									icon={<CloseCircleIcon size={textSize} />}
									onPress={() => setOperation(0)}
									variant="ghost"
									scheme="primary"
									px={0}
								/>
							</HStack>
						</Modal.Header>
						<Modal.Body>
							{storedCustomIDs.map(info => {
								const [title, lastSave] = storedCustomInfo[info];
								const time = new Date(lastSave);
								const color = chosenSave === info ? "primary.50" : "text.50"
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
											icon={<TrashIcon size={inputSize} />}
											variant="ghost"
											onPress={() => maybeDeleteMS(info, title)}
											scheme="danger"
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
									color="text.50"
									pressedBg="darker"
									_text={{fontSize: textSize}}
									p={1}
									m={2}
									onPress={() => setOperation(0)}
								>Cancel</Button>
								{ operation < 0 ? [
									<Button
										key="load1"
										startIcon={<LoadIcon m={0} size={textSize} />}
										bg={chosenSave ? "success.500" : "muted.800"}
										_text={{fontSize: textSize}}
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
										startIcon={<SaveIcon m={0} size={textSize} />}
										scheme="primary"
										_text={{fontSize: textSize}}
										p={1}
										m={2}
										onPress={() => {
											setOperation(0);
											doSaveNewMS();
										}}
									>New Save</Button>,
									<Button
										key="save2"
										startIcon={<SaveIcon m={0} size={textSize} />}
										_text={{fontSize: textSize}}
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
					onPress={() => {
						if(!title) {
							return doToast({
								toast,
								msg: "Please create a title for your MorphoSyntax before exporting.",
								scheme: "error",
								placement: "top",
								fontSize: textSize
							});
						}
						setAlertOpen("exportMS");
					}}
					text="Export MorphoSyntax Info"
				/>
			</VStack>
		</VStack>
	);
};

export default Settings;
