import { v4 as uuidv4 } from 'uuid';

import { setHasCheckedForOldCustomInfo } from '../store/appStateSlice';
import { setStoredCustomInfo as setStoredCustomInfoWG } from '../store/wgSlice';
import { OldCustomStorageWG, wgCustomStorage } from './persistentInfo';


const doConvert = async (dispatch) => {
	// Convert WG info
	// TO-DO: chain in other converters as needed, like Lex and WE
	return convertWG(dispatch).then(() => {
		return dispatch(setHasCheckedForOldCustomInfo(true));
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


export default doConvert;
