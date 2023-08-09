import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

import { lexCustomStorage, msCustomStorage, weCustomStorage, wgCustomStorage } from "./persistentInfo";
import { lexConversion, msConversion, weConversion, wgConversion } from "./convertOldStorageToNew";
import { loadStateWG } from "../store/wgSlice";
import { loadStateWE } from "../store/weSlice";
import { loadStateMS } from "../store/morphoSyntaxSlice";
import { loadStateLex } from "../store/lexiconSlice";
import { loadStateWL } from "../store/wordListsSlice";
import { loadStateEC } from "../store/extraCharactersSlice";
import { loadStateAppSettings } from "../store/appStateSlice";

//       0.9.1 => ms property must be converted to morphoSyntax, plus see next
//                extraCharactersState -> extraCharacters
//                settings -> appState
// 0.9.1-0.9.2 => non-present MS props should be 0, false, or ""
//                wordListsState -> wordLists
// 0.9.2-0.9.3 => stored info must be converted


export const parseImportInfo = (obj) => {
	// return [success: BOOLEAN, parsedOrError: OBJECT or STRING]
	let success = false;
	let output;
	if(typeof obj !== "object" || Array.isArray(obj)) {
		output = "Invalid format";
	} else if (!obj.currentVersion) {
		output = "Missing import version.";
	} else {
		const final = {...obj};
		switch(obj.currentVersion) {
			case "0.9.1":
				final.morphoSyntax = final.ms;
				final.extraCharacters = final.extraCharactersState;
				final.appState = final.settings;
				delete final.ms;
				delete final.extraCharactersState;
				delete final.settings;
			case "0.9.2":
				final.wordLists = final.wordListsState;
				delete final.wordListsState;
			case "0.9.3":
				if(final.storages) {
					const {
						lex,
						we,
						wg,
						ms
					} = final.storages;
					// convert storages
					if(lex) {
						final.lexStoredInfo = lexConversion(lex);
					}
					if(we) {
						final.weStoredInfo = weConversion(we);
					}
					if(we) {
						final.wgStoredInfo = wgConversion(wg);
					}
					if(ms) {
						final.msStoredInfo = msConversion(ms);
					}
					delete final.storages;
				}
				break;
			case "1.0.0":
				// No conversion needed
				break;
			default:
				// Bad info
				return [false, `Invalid version "${obj.currentVersion}"`];
		}
		success = true;
		output = final;
	}
	return [success, output];
};

export const getInfoFromFile = async () => {
	let success = false;
	let output;
	await DocumentPicker.getDocumentAsync({
		copyToCacheDirectory: true,
		type: [
			"text/json",
			"application/json",
			"text/plain"
		]
	}).then(result => {
		const { type, assets, uri } = result;
		if(type === "cancel" || assets === null) {
			// Nothing to do.
			output = "Action cancelled.";
			return;
		}
		let fileLocation = uri;
		if(!uri) {
			// Assume there is only one asset, if any were returned.
			if(assets && Array.isArray(assets) && assets.length > 0) {
				fileLocation = assets[0].uri;
			} else {
				output = "Unknown error: no URI or assets returned."
				return;
			}
		}
		return FileSystem.readAsStringAsync(fileLocation, {}).then((result) => {
			output = result;
			success = true;
		});
	});
	return [success, output];
};

export const doImports = async (dispatch, importedInfo, mapOfDesiredInfo) => {
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
	} = mapOfDesiredInfo;
	const loaded = [];
	if(wg && importedInfo.wg) {
		loaded.push("WordGen");
		dispatch(loadStateWG(importedInfo.wg));
	}
	if(we && importedInfo.we) {
		loaded.push("WordEvolve");
		dispatch(loadStateWE(importedInfo.we));
	}
	if(ms && importedInfo.morphoSyntax) {
		loaded.push("MorphoSyntax");
		dispatch(loadStateMS(importedInfo.morphoSyntax));
	}
	if(lex && importedInfo.lexicon) {
		loaded.push("Lexicon");
		dispatch(loadStateLex({
			method: "overwrite",
			columnConversion: null,
			lexicon: importedInfo.lexicon
		}));
	}
	if(wl && importedInfo.wordLists) {
		loaded.push("WordLists");
		dispatch(loadStateWL(importedInfo.wordLists));
	}
	if(ec && importedInfo.extraCharacters) {
		loaded.push("ExtraCharacters");
		dispatch(loadStateEC(importedInfo.extraCharacters));
	}
	if(wgStoredInfo && importedInfo.wgStoredInfo) {
		loaded.push("WordGen saves");
		await doMultiSet(wgCustomStorage, importedInfo.wgStoredInfo);
	}
	if(weStoredInfo && importedInfo.weStoredInfo) {
		loaded.push("WordEvolve saves");
		await doMultiSet(weCustomStorage, importedInfo.weStoredInfo);
	}
	if(msStoredInfo && importedInfo.msStoredInfo) {
		loaded.push("MorphoSyntax saves");
		await doMultiSet(msCustomStorage, importedInfo.msStoredInfo);
	}
	if(lexStoredInfo && importedInfo.lexStoredInfo) {
		loaded.push("Lexicon saves");
		await doMultiSet(lexCustomStorage, importedInfo.lexStoredInfo);
	}
	if(app && importedInfo.appState) {
		loaded.push("app settings");
		dispatch(loadStateAppSettings(importedInfo.appState));
	}
	return loaded;
};

const doMultiSet = async (storage, info) => {
	const map = Object.keys(info).map(key => [key, JSON.stringify(info[key])]);
	return map.length && storage.multiSet(map);
};
