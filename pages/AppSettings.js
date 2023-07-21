import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HStack, Menu, Pressable, ScrollView, Text, VStack, useToast } from 'native-base';

import { setTheme, setDisableConfirms, setBaseTextSize } from '../store/appStateSlice';
import { ToggleSwitch } from "../components/inputTags";
import getSizes from "../helpers/getSizes";
import {
	wgCustomStorage,
	weCustomStorage,
	lexCustomStorage,
	msCustomStorage
} from "../helpers/persistentInfo";
import ExportImportModal from "../components/ExportImportModal";
import doExport from "../helpers/exportTools";
import doToast from "../helpers/toast";


const AppSettings = () => {
	const dispatch = useDispatch();
	const {
		we: wordEvolve,
		wg: wordGen,
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
	const toast = useToast();
	const [modalOpen, setModalOpen] = useState(false);
	const [importing, setImporting] = useState(false);
	const [titleSize, toastSize, descSize] = getSizes("md", "sm", "xs");
	const pressableProps = {
		px: 2,
		py: 1,
		_pressed: {
			bg: "lighter"
		}
	};
	// TO-DO: Figure out why text size setting is wrong

	// Export Info
	const getStoredInfo = async ({
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
	}) => {
		const toExport = {};
		if(wg) {
			const _wg = {...wordGen};
			delete _wg.storedCustomInfo;
			delete _wg.storedCustomIDs;
			toExport.wg = _wg;	
		}
		if(we) {
			const _we = {...wordEvolve};
			delete _we.storedCustomInfo;
			delete _we.storedCustomIDs;
			toExport.we = _we;	
		}
		if(ms) {
			const _ms = {...morphoSyntax};
			delete _ms.storedCustomInfo;
			delete _ms.storedCustomIDs;
			toExport.morphoSyntax = _ms;
		}
		if(lex) {
			const _lex = {...lexicon};
			delete _lex.storedCustomInfo;
			delete _lex.storedCustomIDs;
			toExport.lexicon = _lex;
		}
		if(wl) {
			const {
				centerTheDisplayedWords,
				listsDisplayed
			} = wordLists;
			toExport.wordLists = {
				centerTheDisplayedWords,
				listsDisplayed
			};
		}
		if(ec) {
			const {
				faves,
				copyImmediately,
				showNames
			} = extraCharacters;
			toExport.extraCharacters = {
				faves,
				copyImmediately,
				showNames
			};
		}
		if(app) {
			toExport.appState = {
				disableConfirms,
				theme,
				sizeName,
				hasCheckedForOldCustomInfo
			};
		}
		const checkStorage = async (storage) => {
			const all = await storage.getAllKeys();
			const output = {};
			const saved = all.map(key => storage.getItem(key));
			await Promise.all(saved);
			all.forEach((key, i) => {
				output[key] = saved[i];
			});
			return output;
		};
		if(wgStoredInfo) {
			toExport.wgStoredInfo = await checkStorage(wgCustomStorage);
		}
		if(weStoredInfo) {
			toExport.weStoredInfo = await checkStorage(weCustomStorage);
		}
		if(msStoredInfo) {
			toExport.msStoredInfo = await checkStorage(msCustomStorage);
		}
		if(lexStoredInfo) {
			toExport.lexStoredInfo = await checkStorage(lexCustomStorage);
		}
		return toExport;
	};
	const importExportInfo = async (info) => {
		// TO-DO: Export/Import certain bits of info
		console.log("Returned: " + JSON.stringify(info));
		if(importing) {
			// Handle import
			return; //TO-DO: importing
		}
		// Handle export
		const toExport = await getStoredInfo(info);
		// Create filename
		const now = new Date(Date.now());
		const num = (number) => {
			if(number < 10) {
				return `0${number}`;
			}
			return number;
		};
		const filename = `Conlang Toolbox Backup ${now.getFullYear()}y-${num(now.getMonth() + 1)}m-${num(now.getDate())}d--${num(now.getHours())}h-${num(now.getMinutes())}m-${num(now.getSeconds())}s.json`;
		console.log(JSON.stringify(filename));
		doExport(JSON.stringify(toExport), filename).then((result) => {
			const {
				fail,
				filename
			} = result;
			// Interpret result
			if(fail) {
				// Failure
			}
			else {
				// Success
			}
			doToast({
				toast,
				scheme: fail ? "danger" : "success",
				msg: fail || `Saved file "${filename}"`,
				center: true,
				position: "top",
				duration: fail ? 4000 : 3000,
				fontSize: toastSize
			});
		});
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
				descSize={descSize}
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
					<Text fontSize={descSize} color="main.500">Save a copy to your device for backup or transfer to a different device.</Text>
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
					<Text fontSize={descSize} color="main.500">Import a copy of a previous backup, or from a different device.</Text>
				</VStack>
			</Pressable>
		</ScrollView>
	);
};

export default AppSettings;
