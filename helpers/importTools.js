import DocumentPicker from "expo-document-picker";

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
			default:
				// Bad info
				return [false, `Invalid version "${obj.currentVersion}"`];
		}
		success = true;
		output = final;
	}
	return [success, output];
};

export const filePicker = () => {
	// TO-DO: Finish file picker
	DocumentPicker.getDocumentAsync({
		copyToCacheDirectory: true,
		type: [
			"text/json",
			"text/plain"
		]
	})
};

export const doImports = (dispatch, importedInfo, mapOfDesiredInfo) => {
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
	if(wg) {
		dispatch(loadStateWG(importedInfo.wg));
	}
	if(we) {
		dispatch(loadStateWE(importedInfo.we));
	}
	if(ms) {
		dispatch(loadStateMS(importedInfo.morphoSyntax));
	}
	if(lex) {
		dispatch(loadStateLex({
			method: "overwrite",
			columnConversion: null,
			lexicon: importedInfo.lex
		}));
	}
	if(wl) {
		dispatch(loadStateWL(importedInfo.wordLists));
	}
	if(ec) {
		dispatch(loadStateEC(importedInfo.extraCharacters));
	}
	if(app) {
		dispatch(loadStateAppSettings(importedInfo.appState));
	}
	if(wgStoredInfo) {
		// TO-DO
	}
	if(weStoredInfo) {
		// TO-DO
	}
	if(msStoredInfo) {
		// TO-DO
	}
	if(lexStoredInfo) {
		// TO-DO
	}
};
