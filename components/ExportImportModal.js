import { useState } from 'react';
import {
	Text,
	VStack,
	HStack,
	IconButton,
	Button,
	Modal,
	Center,
	useContrastText,
	TextArea
} from 'native-base';

import {
	CloseCircleIcon,
	ExportIcon,
	ImportIcon
} from './icons';
import getSizes from '../helpers/getSizes';
import { ToggleSwitch } from './inputTags';

const ExportImportModal = ({
	returnChoices, // give the info back to the main page
	modalOpen,
	closeModal,
	importedInfo = false // false if Export, an object if Import
}) => {
	const getStartingValue = (prop) => {
		if(!importedInfo) {
			// export
			return true;
		}
		return importedInfo[prop] === undefined ? null : true;
	};
	const [wg, setWG] = useState(getStartingValue("wg"));
	const [we, setWE] = useState(getStartingValue("we"));
	const [ms, setMS] = useState(getStartingValue("morphoSyntax"));
	const [lex, setLex] = useState(getStartingValue("lexicon"));
	const [wl, setWL] = useState(getStartingValue("wordLists"));
	const [ec, setEC] = useState(getStartingValue("extraCharacters"));
	const [app, setApp] = useState(getStartingValue("appState"));
	// TO-DO: Finish the below
	const [wgStoredInfo, setWGStoredInfo] = useState(getStartingValue(""));
	const [weStoredInfo, setWEStoredInfo] = useState(getStartingValue(""));
	const [msStoredInfo, setMSStoredInfo] = useState(getStartingValue(""));
	const [lexStoredInfo, setLexStoredInfo] = useState(getStartingValue(""));

	const [textSize, headerSize] = getSizes("sm", "md");
	const primaryContrast = useContrastText('primary.500');
	const exitModal = (doReturn = false) => {
		// Save info
		const info = {
			wg,
			we,
			ms,
			lex,
			wl,
			ec,
			app,
			wgStoredInfo,
			weStoredInfo,
			msStoredInfo,
			lexStoredInfo
		};
		// Close this modal
		closeModal();
		// Reset all settings
		setWG(true);
		setWE(true);
		setMS(true);
		setLex(true);
		setWL(true);
		setEC(true);
		setApp(true);
		setWGStoredInfo(true);
		setWEStoredInfo(true);
		setMSStoredInfo(true);
		setLexStoredInfo(true);
		// Send everything back to page
		doReturn && returnChoices(info);
	};
	const toggleProps = {
		hProps: {
			p: 2,
			borderBottomWidth: 1,
			borderBottomColor: "main.900"
		},
		labelSize: headerSize,
		descSize: textSize,
		descProps: { color: "main.500" }
	};
	const masterToggleProps = {
		...toggleProps,
		hProps: {
			p: 2,
			pb: 0
		}
	};
	const alternateProps = {
		switchProps: {
			onThumbColor: "tertiary.500",
			offThumbColor: "tertiary.900"
		}
	};
	return (
		<Modal isOpen={!!modalOpen}>
			<Modal.Content>
				<Modal.Header bg="primary.500">
					<HStack justifyContent="flex-end" alignItems="center">
						<Text flex={1} px={3} fontSize={headerSize} color={primaryContrast} textAlign="left" isTruncated>{importedInfo ? "Im" : "Ex"}port Options</Text>
						<IconButton
							icon={<CloseCircleIcon color={primaryContrast} size={headerSize} />}
							onPress={() => exitModal()}
							flexGrow={0}
							flexShrink={0}
						/>
					</HStack>
				</Modal.Header>
				<Modal.Body>
					<VStack>
						<Center borderBottomWidth={1.5} borderBottomColor="main.900" pb={3}>
							<Text italic textAlign="center" fontSize={headerSize}>Choose which elements you wish to {importedInfo ? "im" : "ex"}port.</Text>
						</Center>
						{ms !== null && <ToggleSwitch
							label="MorphoSyntax"
							desc="Currently loaded data"
							switchState={ms}
							switchToggle={() => setMS(!ms)}
							{...masterToggleProps}
						/>}
						{msStoredInfo !== null && <ToggleSwitch
							label="MorphoSyntax Storage"
							desc="Any/all stored morphosyntax documents"
							switchState={msStoredInfo}
							switchToggle={() => setMSStoredInfo(!msStoredInfo)}
							{...toggleProps}
						/>}
						{wg !== null && <ToggleSwitch
							label="WordGen"
							desc="Currently loaded data"
							switchState={wg}
							switchToggle={() => setWG(!wg)}
							{...masterToggleProps}
							{...alternateProps}
						/>}
						{wgStoredInfo !== null && <ToggleSwitch
							label="WordGen Storage"
							desc="Any/all stored settings"
							switchState={wgStoredInfo}
							switchToggle={() => setWGStoredInfo(!wgStoredInfo)}
							{...toggleProps}
							{...alternateProps}
						/>}
						{we !== null && <ToggleSwitch
							label="WordEvolve"
							desc="Currently loaded data"
							switchState={we}
							switchToggle={() => setWE(!we)}
							{...masterToggleProps}
						/>}
						{weStoredInfo !== null && <ToggleSwitch
							label="WordEvolve Storage"
							desc="Any/all stored settings"
							switchState={weStoredInfo}
							switchToggle={() => setWEStoredInfo(!weStoredInfo)}
							{...toggleProps}
						/>}
						{lex !== null && <ToggleSwitch
							label="Lexicon"
							desc="Currently loaded data"
							switchState={lex}
							switchToggle={() => setLex(!lex)}
							{...masterToggleProps}
							{...alternateProps}
						/>}
						{lexStoredInfo !== null && <ToggleSwitch
							label="Lexicon Storage"
							desc="Any/all stored lexicons"
							switchState={lexStoredInfo}
							switchToggle={() => setLexStoredInfo(!lexStoredInfo)}
							{...toggleProps}
							{...alternateProps}
						/>}
						{wl !== null && <ToggleSwitch
							label="WordList Settings"
							desc="Current options"
							switchState={wl}
							switchToggle={() => setWL(!wl)}
							{...toggleProps}
						/>}
						{ec !== null && <ToggleSwitch
							label="ExtraCharacters Settings"
							desc="Current faves and other options"
							switchState={ec}
							switchToggle={() => setEC(!ec)}
							{...toggleProps}
							{...alternateProps}
						/>}
						{app !== null && <ToggleSwitch
							label="App Settings"
							desc="All current settings"
							switchState={app}
							switchToggle={() => setApp(!app)}
							{...toggleProps}
						/>}
					</VStack>
				</Modal.Body>
				<Modal.Footer>
					<HStack justifyContent="space-between" p={1} flexWrap="wrap">
						<Button
							bg="darker"
							px={2}
							py={1}
							mx={1}
							onPress={() => exitModal()}
							_text={{ fontSize: textSize }}
						>Cancel</Button>
						<Button
							startIcon={<ExportIcon size={textSize} />}
							px={2}
							py={1}
							onPress={() => exitModal(true)}
							_text={{ fontSize: textSize }}
						>Continue</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};

export default ExportImportModal;

export const ExportHowModal = ({
	modalOpen,
	closeModal,
	exportToFile,
	info,
	isLoading
}) => {
	const [textSize, headerSize] = getSizes("sm", "md");
	const primaryContrast = useContrastText('primary.500');
	const closeAndExport = () => {
		closeModal();
		exportToFile();
	};
	return (
		<Modal isOpen={!!modalOpen}>
			<Modal.Content>
				<Modal.Header bg="primary.500">
					<HStack justifyContent="flex-end" alignItems="center">
						<Text flex={1} px={3} fontSize={headerSize} color={primaryContrast} textAlign="left" isTruncated>Export</Text>
						<IconButton
							icon={<CloseCircleIcon color={primaryContrast} size={headerSize} />}
							onPress={closeModal}
							flexGrow={0}
							flexShrink={0}
						/>
					</HStack>
				</Modal.Header>
				<Modal.Body>
					<VStack>
						<Center pb={3}>
							<Text textAlign="center" fontSize={headerSize}>You can copy this info to a note or file.</Text>
							<Text italic textAlign="center" fontSize={textSize}>Or you can save it to a file on your device with the button below.</Text>
						</Center>
						<TextArea
							mt={2}
							value={isLoading ? "loading..." : info}
							totalLines={12}
							h={64}
							w="full"
						/>
					</VStack>
				</Modal.Body>
				<Modal.Footer>
					<HStack justifyContent="flex-end" p={1} space={4} flexWrap="wrap">
						<Button
							startIcon={<ExportIcon size={textSize} />}
							px={2}
							py={1}
							onPress={closeAndExport}
							_text={{ fontSize: textSize }}
							disabled={isLoading}
						>Export to File</Button>
						<Button
							bg="darker"
							px={2}
							py={1}
							mx={1}
							onPress={closeModal}
							_text={{ fontSize: textSize, color: "success.50" }}
						>Done</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};


export const ImportHowModal = ({
	modalOpen,
	closeModal,
	importFromFile,
	importFromText
}) => {
	const [toImport, setToImport] = useState("");
	const [textSize, headerSize] = getSizes("sm", "md");
	const primaryContrast = useContrastText('primary.500');
	return (
		<Modal isOpen={!!modalOpen}>
			<Modal.Content>
				<Modal.Header bg="primary.500">
					<HStack justifyContent="flex-end" alignItems="center">
						<Text flex={1} px={3} fontSize={headerSize} color={primaryContrast} textAlign="left" isTruncated>Import</Text>
						<IconButton
							icon={<CloseCircleIcon color={primaryContrast} size={headerSize} />}
							onPress={closeModal}
							flexGrow={0}
							flexShrink={0}
						/>
					</HStack>
				</Modal.Header>
				<Modal.Body>
					<VStack>
						<Center pb={3}>
							<Text textAlign="center" fontSize={headerSize}>Paste your stored information here.</Text>
							<Text italic textAlign="center" fontSize={textSize}>Or you can import it from a file on your device with the button below.</Text>
						</Center>
						<TextArea
							mt={2}
							value={toImport}
							totalLines={12}
							h={64}
							w="full"
							onChangeText={(text) => setToImport(text)}
						/>
					</VStack>
				</Modal.Body>
				<Modal.Footer>
					<HStack justifyContent="flex-end" p={1} space={4} flexWrap="wrap">
						<Button
							startIcon={<ImportIcon size={textSize} />}
							px={2}
							py={1}
							onPress={() => {
								closeModal();
								importFromFile();
							}}
							_text={{ fontSize: textSize }}
						>Import From File</Button>
						<Button
							bg="darker"
							px={2}
							py={1}
							mx={1}
							onPress={() => {
								closeModal();
								importFromText(toImport);
							}}
							_text={{ fontSize: textSize, color: "success.50" }}
						>Import</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};
