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
import ExportImportModal, { ExportHowModal, ImportHowModal } from "../components/ExportImportModal";
import doExport from "../helpers/exportTools";
import doToast from "../helpers/toast";
import { doImports, getInfoFromFile, parseImportInfo } from "../helpers/importTools";
import packageJson from '../package.json';


const AppSettings = () => {
	const dispatch = useDispatch();
	const wordEvolve = useSelector(state => state.we);
	const wordGen = useSelector(state => state.wg);
	const morphoSyntax = useSelector(state => state.morphoSyntax);
	const lexicon = useSelector(state => state.lexicon);
	const wordLists = useSelector(state => state.wordLists);
	const extraCharacters = useSelector(state => state.extraCharacters);
	const appState = useSelector(state => state.appState);
	const {
		disableConfirms,
		theme,
		sizeName
	} = appState;
	const toast = useToast();
	const [modalOpen, setModalOpen] = useState(false);
	const [importing, setImporting] = useState(false);
	const [exportMethodOpen, setExportMethodOpen] = useState(false);
	const [exportedInfo, setExportedInfo] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [importMethodOpen, setImportMethodOpen] = useState(false);
	const [importedInfo, setImportedInfo] = useState(null);
	const [titleSize, toastSize, descSize] = getSizes("md", "sm", "xs");
	const pressableProps = {
		px: 2,
		py: 1,
		_pressed: {
			bg: "lighter"
		}
	};

	// Export Info
	const getStoredInfoForExport = async ({
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
		const toExport = {
			currentVersion: packageJson.version
		};
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
				sizeName
			};
		}
		const checkStorage = async (storage) => {
			const all = await storage.getAllKeys();
			const length = all.length;
			const output = {};
			for(let x = 0; x < length; x++) {
				const key = all[x];
				const result = await storage.getItem(key).then(result => result);
				try {
					const parsed = JSON.parse(result);
					output[key] = parsed;
				} catch(error) {
					console.log(`Unable to parse result from ${storage.name} storage under key [${key}].`);
					console.log(result);
					//console.log(error);
				}
			}
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
	const importOrExportInfo = async (format) => {
		if(importing) {
			// Handle import
			return doImports(dispatch, importedInfo, format).then((result) => {
				let englishResult;
				let scheme = "success";
				let msg;
				const length = result.length || 0;
				const duration = 2500 + (500 * length);
				if(!result || length === 0) {
					// no import
					scheme = "error";
					msg = "Nothing imported.";
				} else if (length === 1) {
					englishResult = result[0];
				} else if (length === 2) {
					englishResult = result.join(" and ");
				} else {
					const final = result.pop();
					englishResult = result.join(", ") + ", and " + final;
				}
				doToast({
					toast,
					placement: "top",
					duration,
					msg: msg || `Imported ${englishResult}.`,
					scheme
				});
			});
		}
		// Handle export
		getStoredInfoForExport(format).then((result) => {
			setExportedInfo(JSON.stringify(result));
			setIsLoading(false);
		});
		setExportMethodOpen(true);
		setIsLoading(true);
	};
	const exportToFile = () => {
		// Create filename
		const now = new Date(Date.now());
		const num = (number) => {
			if(number < 10) {
				return `0${number}`;
			}
			return number;
		};
		const filename = `Conlang Toolbox Backup ${now.getFullYear()}y-${num(now.getMonth() + 1)}m-${num(now.getDate())}d--${num(now.getHours())}h-${num(now.getMinutes())}m-${num(now.getSeconds())}s.json`;
		doExport(exportedInfo, filename).then((result) => {
			const {
				fail,
				filename
			} = result;
			// Display result to user
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

	// TO-DO: Import info
	const importFromFile = async (info) => {
		const [success, output] = await getInfoFromFile();
		if(success) {
			return importFromText(output);
		}
		doToast({
			toast,
			scheme: "error",
			msg: output,
			center: true,
			position: "top",
			duration: 4000,
			fontSize: toastSize
		});
	};
	const importFromText = (info) => {
		// Attempt to convert info
		let errorMsg = false;
		let parsed;
		try {
			parsed = JSON.parse(info.replace(/[\r\n]/g, '').trim());
		} catch (error) {
			errorMsg = error;
		}
		if(!errorMsg) {
			// do some checks on the info, see what it has
			const [flag, reParsed] = parseImportInfo(parsed);
			if(!flag) {
				errorMsg = reParsed;
			} else {
				parsed = reParsed;
			}
		}
		if(errorMsg) {
			// handle error message
			doToast({
				toast,
				scheme: "error",
				msg: errorMsg,
				center: true,
				position: "top",
				duration: 4000,
				fontSize: toastSize
			});
			return;
		}
		// close modal
		setImportMethodOpen(false);
		// save info
		setImportedInfo(parsed);
		// info is ready to go
		setImporting(true);
		setModalOpen(true);
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
				descProps={{ opacity: 50 }}
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
						title="Text size:"
						_title={{ fontSize: descSize, color: "primary.500" }}
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
						title="Theme:"
						_title={{ fontSize: descSize, color: "primary.500" }}
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
				returnChoices={importOrExportInfo}
				modalOpen={modalOpen}
				closeModal={() => setModalOpen(false)}
				importedInfo={importing}
			/>
			<ExportHowModal
				modalOpen={exportMethodOpen}
				closeModal={() => {
					setExportMethodOpen(false);
					setExportedInfo("loading...");
				}}
				info={exportedInfo}
				exportToFile={exportToFile}
				isLoading={isLoading}
			/>
			<ImportHowModal
				modalOpen={importMethodOpen}
				closeModal={() => setImportMethodOpen(false)}
				importFromFile={importFromFile}
				importFromText={importFromText}
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
					<Text fontSize={descSize} opacity={50}>Save a copy to your device for backup or transfer to a different device.</Text>
				</VStack>
			</Pressable>
			<Pressable _pressed={{bg: "lighter"}} onPress={() => {
				setImportMethodOpen(true);
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
					<Text fontSize={descSize} opacity={50}>Import a copy of a previous backup, or from a different device.</Text>
				</VStack>
			</Pressable>
		</ScrollView>
	);
};

export default AppSettings;
