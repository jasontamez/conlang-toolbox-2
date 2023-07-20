import { useState } from 'react';
import {
	Text,
	VStack,
	HStack,
	IconButton,
	Button,
	Modal,
	Center,
	useContrastText
} from 'native-base';

import {
	CloseCircleIcon,
	ExportIcon
} from './icons';
import getSizes from '../helpers/getSizes';
import { ToggleSwitch } from './inputTags';

const ExportImportModal = ({
	returnSettings, // give the info back to the main page
	modalOpen,
	closeModal,
	isImport = false // Import or Export
}) => {
	const [wg, setWG] = useState(true);
	const [we, setWE] = useState(true);
	const [ms, setMS] = useState(true);
	const [lex, setLex] = useState(true);
	const [wl, setWL] = useState(true);
	const [ec, setEC] = useState(true);
	const [app, setApp] = useState(true);
	const [wgStoredInfo, setWGStoredInfo] = useState(true);
	const [weStoredInfo, setWEStoredInfo] = useState(true);
	const [msStoredInfo, setMSStoredInfo] = useState(true);
	const [lexStoredInfo, setLexStoredInfo] = useState(true);

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
		doReturn && returnSettings(info);
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
						<Text flex={1} px={3} fontSize={headerSize} color={primaryContrast} textAlign="left" isTruncated>{isImport ? "Im" : "Ex"}port Options</Text>
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
							<Text italic textAlign="center" fontSize={headerSize}>Choose which elements you wish to {isImport ? "im" : "ex"}port.</Text>
						</Center>
						<ToggleSwitch
							label="MorphoSyntax"
							desc="Currently loaded data"
							switchState={ms}
							switchToggle={() => setMS(!ms)}
							{...masterToggleProps}
						/>
						<ToggleSwitch
							label="MorphoSyntax Storage"
							desc="Any/all stored morphosyntax documents"
							switchState={msStoredInfo}
							switchToggle={() => setMSStoredInfo(!msStoredInfo)}
							{...toggleProps}
						/>
						<ToggleSwitch
							label="WordGen"
							desc="Currently loaded data"
							switchState={wg}
							switchToggle={() => setWG(!wg)}
							{...masterToggleProps}
							{...alternateProps}
						/>
						<ToggleSwitch
							label="WordGen Storage"
							desc="Any/all stored settings"
							switchState={wgStoredInfo}
							switchToggle={() => setWGStoredInfo(!wgStoredInfo)}
							{...toggleProps}
							{...alternateProps}
						/>
						<ToggleSwitch
							label="WordEvolve"
							desc="Currently loaded data"
							switchState={we}
							switchToggle={() => setWE(!we)}
							{...masterToggleProps}
						/>
						<ToggleSwitch
							label="WordEvolve Storage"
							desc="Any/all stored settings"
							switchState={weStoredInfo}
							switchToggle={() => setWEStoredInfo(!weStoredInfo)}
							{...toggleProps}
						/>
						<ToggleSwitch
							label="Lexicon"
							desc="Currently loaded data"
							switchState={lex}
							switchToggle={() => setLex(!lex)}
							{...masterToggleProps}
							{...alternateProps}
						/>
						<ToggleSwitch
							label="Lexicon Storage"
							desc="Any/all stored lexicons"
							switchState={lexStoredInfo}
							switchToggle={() => setLexStoredInfo(!lexStoredInfo)}
							{...toggleProps}
							{...alternateProps}
						/>
						<ToggleSwitch
							label="WordList Settings"
							desc="Current options"
							switchState={wl}
							switchToggle={() => setWL(!wl)}
							{...toggleProps}
						/>
						<ToggleSwitch
							label="ExtraCharacters Settings"
							desc="Current faves and other options"
							switchState={ec}
							switchToggle={() => setEC(!ec)}
							{...toggleProps}
							{...alternateProps}
						/>
						<ToggleSwitch
							label="App Settings"
							desc="All current settings"
							switchState={app}
							switchToggle={() => setApp(!app)}
							{...toggleProps}
						/>
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
