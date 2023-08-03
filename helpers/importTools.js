

//       0.9.1 => ms property must be converted to morphoSyntax, plus see next
//                extraCharactersState -> extraCharacters
//                settings -> appState
// 0.9.1-0.9.2 => non-present MS props should be 0, false, or ""
//                wordListsState -> wordLists
//       0.9.2 => stored info must be converted


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
				if(final.storages) {
					// convert storages
					convertOldStorages(final);
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

const convertOldStorages = (final) => {
	// Needs to modify 'final' itself. Does not need to return anything.
	// TO-DO: convert storages.lex, .ms, .we, .wg to proper formats
};
