import { v4 as uuidv4 } from 'uuid';

import { setHasCheckedForOldCustomInfo } from '../store/appStateSlice';
import { setStoredCustomInfo as setStoredCustomInfoWG } from '../store/wgSlice';
import { setStoredCustomInfo as setStoredCustomInfoWE } from '../store/weSlice';
import { setStoredCustomInfo as setStoredCustomInfoLex } from '../store/lexiconSlice';
import {
	OldCustomStorageWE,
	OldCustomStorageWG,
	OldLexiconStorage,
	lexCustomStorage,
	weCustomStorage,
	wgCustomStorage
} from './persistentInfo';


const doConvert = async (dispatch) => {
	// Convert WG info
	// TO-DO: chain in other converters as needed
	return Promise.allSettled([
		convertWG(dispatch),
		convertWE(dispatch),
		convertLexicon(dispatch)
	]).then((values) => {
		return values.every(v => v.status === "fulfilled") && dispatch(setHasCheckedForOldCustomInfo(true));
	}).catch((err) => {
		console.log(err);
	});
};
const convertWG = async (dispatch) => {
	let information = [];
	let ids = {};
	// Get all info
	return OldCustomStorageWG.iterate((value, key) => {
		information.push([key, value]);
		return; // Blank return keeps the loop going
	}).then(() => {
		// Convert info from old format into new format
		for(let x = 0; x < information.length; x++) {
			const [ infoLabel, { categories, syllables, rules, settings } ] = information[x];
			//const { categories, syllables, rules, settings } = value;
			const { map } = categories;
			let characterGroups = [],
				transformations = [];
			// character groups
			map.forEach(cat => {
				const [ label, { title, run, dropoffOverride } ] = cat;
				//const { title, run, dropoffOverride } = catInfo;
				characterGroups.push({
					label,
					run,
					description: title,
					dropoff: dropoffOverride
				});
			});
			// transformations
			const { list } = rules;
			list.forEach(rule => {
				const { key, seek, replace, description } = rule;
				transformations.push({
					id: key,
					search: seek,
					replace,
					description
				});
			});
			// settings
			const {
				monosyllablesRate,
				maxSyllablesPerWord,
				categoryRunDropoff,
				syllableBoxDropoff,
				capitalizeSentences,
				declarativeSentencePre,
				declarativeSentencePost,
				interrogativeSentencePre,
				interrogativeSentencePost,
				exclamatorySentencePre,
				exclamatorySentencePost
			} = settings;
			// syllables
			const {
				toggle,
				objects
			} = syllables;
			const {
				singleWord,
				wordInitial,
				wordMiddle,
				wordFinal
			} = objects;
			// overwrite info with new format
			information[x] = {
				label: infoLabel,
				info: {
					characterGroups,
					transformations,
					multipleSyllableTypes: toggle,
					singleWord: singleWord.components.join("\n"),
					wordInitial: wordInitial.components.join("\n"),
					wordMiddle: wordMiddle.components.join("\n"),
					wordFinal: wordFinal.components.join("\n"),
					syllableDropoffOverrides: {
						singleWord: singleWord.dropoffOverride === undefined ? null : singleWord.dropoffOverride,
						wordInitial: wordInitial.dropoffOverride === undefined ? null : wordInitial.dropoffOverride,
						wordMiddle: wordMiddle.dropoffOverride === undefined ? null : wordMiddle.dropoffOverride,
						wordFinal: wordFinal.dropoffOverride === undefined ? null : wordFinal.dropoffOverride
					},
					monosyllablesRate,
					maxSyllablesPerWord,
					characterGroupDropoff: categoryRunDropoff,
					syllableBoxDropoff,
					capitalizeSentences,
					declarativeSentencePre,
					declarativeSentencePost,
					interrogativeSentencePre,
					interrogativeSentencePost,
					exclamatorySentencePre,
					exclamatorySentencePost
				}
			};
		}
		// All information converted.
		// Save all info
		return Promise.all(information.map(info => {
			const id = uuidv4();
			ids[id] = info.label;
			return wgCustomStorage.setItem(id, JSON.stringify(info));
		}));
	}).then(() => {
		dispatch(setStoredCustomInfoWG(ids));
	}).catch(() => {
		console.log("WG Error");
	});
};
const convertWE = async (dispatch) => {
	let information = [];
	let ids = {};
	// Get all info
	return OldCustomStorageWE.iterate((value, key) => {
		information.push([key, value]);
		return; // Blank return keeps the loop going
	}).then(() => {
		// Convert info from old format into new format
		for(let x = 0; x < information.length; x++) {
			const [ infoLabel, { categories, transforms, soundchanges } ] = information[x];
			const { map } = categories;
			let characterGroups = [],
				soundChanges = [],
				transformations = [];
			// character groups
			map.forEach(cat => {
				const [ label, { title, run } ] = cat;
				characterGroups.push({
					label,
					run,
					description: title
				});
			});
			// transformations
			transforms.forEach(rule => {
				let { key, seek, replace, description, direction } = rule;
				switch(direction) {
					case "in":
						direction = "input";
						break;
					case "out":
						direction = "output";
				}
				transformations.push({
					id: key,
					search: seek,
					replace,
					direction,
					description
				});
			});
			// sound changes
			soundchanges.list.forEach(sc => {
				const { key, seek, replace, context, anticontext, description } = sc;
				let newSC = {
					id: key,
					beginning: seek,
					ending: replace,
					context
				}
				if(anticontext) {
					newSC.exception = anticontext;
				}
				if(description) {
					newSC.description = description;
				}
				soundChanges.push(newSC);
			});
			// overwrite info with new format
			information[x] = {
				label: infoLabel,
				info: {
					characterGroups,
					transformations,
					soundChanges
				}
			};
		}
		// All information converted.
		// Save all info
		return Promise.all(information.map(info => {
			const id = uuidv4();
			ids[id] = info.label;
			return weCustomStorage.setItem(id, JSON.stringify(info));
		}));
	}).then(() => {
		dispatch(setStoredCustomInfoWE(ids));
	}).catch(() => {
		console.log("WE Error");
	});
};
const convertLexicon = async (dispatch) => {
	let information = [];
	let ids = {};
	// Get all info
	return OldLexiconStorage.iterate((value, key) => {
		information.push([key, value]);
		return; // Blank return keeps the loop going
	}).then(() => {
		// Convert info from old format into new format
		const infoLen = information.length;
		for(let x = 0; x < infoLen; x++) {
			const [
				id,
				{
					lastSave,
					title,
					description,
					columns,
					columnOrder,
					columnTitles,
					columnSizes,
					sort,
					lexicon,
					lexiconWrap
				}
			] = information[x];
			const [colNum, direction] = sort;
			let newLex = {
				id,
				title,
				description,
				lastSave,
				columns: [],
				sortPattern: [colNum],
				sortDir: !!direction,
				lexicon: [],
				maxColumns: Math.min(Math.max(columns, 10), 30),
				truncateColumns: !lexiconWrap
			};
			//columnOrder: [0,1,2],
			//columnTitles: ["Word", "Part of Speech", "Definition"],
			//columnSizes: ["m", "s", "l"],
			//sort: [0, 0],
			columnOrder.forEach((col, i) => {
				if(col >= 30) {
					// Why would you do this?
					return;
				}
				const ids = {};
				let id;
				do {
					id = uuidv4();
				} while (!ids[id]);
				ids[id] = true;
				newLex.columns.push({
					id,
					label: columnTitles[col],
					size: columnSizes[col]
				});
				if(col !== newCol) {
					newLex.sortPattern.push(i);
				} else {
					newLex.sortPattern[0] = i;
				}
			});
			//lexicon: [],
			//{
			//	key: string,
			//	columns: string[]
			//}
			lexicon.forEach((lex) => {
				const {key, columns} = lex;
				let item = {
					id: key,
					columns: []
				};
				columnOrder.forEach(col => {
					if(col >= 30) {
						// Why would you do this?
						return;
					}
					item.columns.push(columns[col]);
				});
				newLex.lexicon.push(item);
			});
		}
		// All information converted.
		// Save all info
		return Promise.all(information.map(info => {
			const { id, title, lastSave, lexicon, columns } = info;
			ids[id] = [
				title,
				lastSave,
				lexicon.length,
				columns
			];
			return lexCustomStorage.setItem(id, JSON.stringify(info));
		}));
	}).then(() => {
		dispatch(setStoredCustomInfoLex(ids));
	}).catch(() => {
		console.log("Lex Error");
	});
};


export default doConvert;
