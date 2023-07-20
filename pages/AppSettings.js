import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HStack, Menu, Pressable, ScrollView, Text, VStack } from 'native-base';
import { setTheme, setDisableConfirms, setBaseTextSize } from '../store/appStateSlice';
import { ToggleSwitch } from "../components/inputTags";
import getSizes from "../helpers/getSizes";
import { allStorageObjects } from "../helpers/persistentInfo";
import ExportImportModal from "../components/ExportImportModal";


const AppSettings = () => {
	const dispatch = useDispatch();
	const {
		we,
		wg,
		morphoSyntax,
		lexicon,
		wordLists,
		extraCharacters,
		appState
	} = useSelector((state) => state);
	const {
		disableConfirms,
		theme,
		sizeName,
		hasCheckedForOldCustomInfo
	} = appState;
	const [modalOpen, setModalOpen] = useState(false);
	const [importing, setImporting] = useState(false);
	const [titleSize, textSize] = getSizes("md", "xs");
	const pressableProps = {
		px: 2,
		py: 1,
		_pressed: {
			bg: "lighter"
		}
	};
	// TO-DO: Figure out why text size setting is wrong

	// Export Info
	const assembleStoredInfo = () => {
		const {
			centerTheDisplayedWords,
			listsDisplayed
		} = wordLists;
		const {
			faves,
			copyImmediately,
			showNames
		} = extraCharacters;
		return {
			morphoSyntax: {...morphoSyntax},
			wg: {...wg}, // TO-DO: Fix these to remove the saved ids and such
			we: {...we},
			lexicon: {...lexicon},
			wordLists: {
				centerTheDisplayedWords,
				listsDisplayed
			},
			extraCharacters: {
				faves,
				copyImmediately,
				showNames
			},
			appState: {
				disableConfirms,
				theme,
				sizeName,
				hasCheckedForOldCustomInfo
			}
		};
	};
	const importExportInfo = (info) => {
		// TO-DO: Export/Import certain bits of info
		// WordGen
		//  Saved Info
		// WordEvolve
		//  Saved Info
		// MorphoSyntax
		//  Saved Info
		// Lexicon
		//  Saved Info
		// WordList
		// Extra Characters
		// App Settings
		console.log("Returned: " + JSON.stringify(info));
		const {
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
		} = info;
	};

	// Return JSX
	return (
		<ScrollView>
			<ToggleSwitch
				hProps={{
					p: 2,
					borderBottomWidth: 1,
					borderBottomColor: "main.900"
				}}
				label="Disable Confirmation Prompts"
				labelSize={titleSize}
				desc="Eliminates yes/no prompts when deleting or overwriting data."
				descSize={textSize}
				descProps={{ color: "main.500" }}
				switchState={disableConfirms}
				switchToggle={() => dispatch(setDisableConfirms(!disableConfirms))}
			/>
			<HStack
				w="full"
				justifyContent="space-between"
				alignItems="center"
				p={2}
				borderBottomWidth={1}
				borderBottomColor="main.900"
			>
				<VStack>
					<Text fontSize={titleSize}>Base Text Size</Text>
				</VStack>
				<Menu
					placement="bottom right"
					closeOnSelect={false}
					trigger={(props) => (
						<Pressable accessibilityLabel="Font size choice menu" {...pressableProps} {...props}>
							<Text color="primary.500">{
								{
									"xs": "Extra Small",
									"sm": "Small",
									"md": "Medium",
									"lg": "Large",
									"xl": "Extra Large",
									"2xl": "Huge"
								}[sizeName]
							}</Text>
						</Pressable>
					)}
				>
					<Menu.OptionGroup
						defaultValue={sizeName}
						type="radio"
						onChange={(newSize) => dispatch(setBaseTextSize(newSize))}
					>
						<Menu.ItemOption value="xs">Extra Small</Menu.ItemOption>
						<Menu.ItemOption value="sm">Small</Menu.ItemOption>
						<Menu.ItemOption value="md">Medium</Menu.ItemOption>
						<Menu.ItemOption value="lg">Large</Menu.ItemOption>
						<Menu.ItemOption value="xl">Extra Large</Menu.ItemOption>
						<Menu.ItemOption value="2xl">Huge</Menu.ItemOption>
					</Menu.OptionGroup>
				</Menu>
			</HStack>
			<HStack
				w="full"
				justifyContent="space-between"
				alignItems="center"
				p={2}
				borderBottomWidth={1}
				borderBottomColor="main.900"
			>
				<VStack>
					<Text fontSize={titleSize}>Change Theme</Text>
				</VStack>
				<Menu
					placement="bottom right"
					closeOnSelect={false}
					trigger={(props) => (
						<Pressable accessibilityLabel="Theme choice menu" {...pressableProps} {...props}>
							<Text color="primary.500">{theme}</Text>
						</Pressable>
					)}
				>
					<Menu.OptionGroup
						defaultValue={theme}
						type="radio"
						onChange={(newTheme) => dispatch(setTheme(newTheme))}
					>
						<Menu.ItemOption value="Default">Default</Menu.ItemOption>
						<Menu.ItemOption value="Light">Light</Menu.ItemOption>
						<Menu.ItemOption value="Dark">Dark</Menu.ItemOption>
						<Menu.ItemOption value="Solarized Light">Solarized Light</Menu.ItemOption>
						<Menu.ItemOption value="Solarized Dark">Solarized Dark</Menu.ItemOption>
					</Menu.OptionGroup>
				</Menu>
			</HStack>
			<ExportImportModal
				returnSettings={importExportInfo}
				modalOpen={modalOpen}
				closeModal={() => setModalOpen(false)}
				isImport={importing}
			/>
			<Pressable _pressed={{bg: "lighter"}} onPress={() => {
				setImporting(false);
				setModalOpen(true);
			}}>
				<VStack
					w="full"
					justifyContent="center"
					alignItems="flex-start"
					p={2}
					borderBottomWidth={1}
					borderBottomColor="main.900"
				>
					<Text fontSize={titleSize}>Export App Info</Text>
					<Text fontSize={textSize} color="main.500">Save a copy to your device for backup or transfer to a different device.</Text>
				</VStack>
			</Pressable>
			<Pressable _pressed={{bg: "lighter"}} onPress={() => {
				setImporting(true);
				setModalOpen(true);
			}}>
				<VStack
					w="full"
					justifyContent="center"
					alignItems="flex-start"
					p={2}
					borderBottomWidth={1}
					borderBottomColor="main.900"
				>
					<Text fontSize={titleSize}>Import App Info</Text>
					<Text fontSize={textSize} color="main.500">Import a copy of a previous backup, or from a different device.</Text>
				</VStack>
			</Pressable>
		</ScrollView>
	);
};

export default AppSettings;
