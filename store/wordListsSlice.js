import { createSlice } from '@reduxjs/toolkit'
import WL from '../helpers/wordLists';
import blankAppState from './blankAppState';

const initialState = blankAppState.wordLists;

const setCenterTheDisplayedWordsFunc = (state, action) => {
	state.centerTheDisplayedWords = action.payload;
	return state;
};
const toggleDisplayedListFunc = (state, action) => {
	const {payload} = action;
	let {listsDisplayed} = state;
	if(listsDisplayed[payload]) {
		delete listsDisplayed[payload];
		state = cleanSaved(state);
	} else {
		listsDisplayed[payload] = true;
	}
	state.listsDisplayed = listsDisplayed;
	return state;
};
const cleanSaved = (state) => {
	let {listsDisplayed, savingForLexicon} = state;
	WL.words.forEach(w => {
		const {word, lists} = w;
		if(savingForLexicon[word]) {
			if(!lists.some(list => listsDisplayed[list])) {
				// No longer displayed
				delete savingForLexicon[word];
			}
		}
	});
	state.savingForLexicon = savingForLexicon;
	return state;
};
const togglePickAndSaveForLexiconFunc = (state) => {
	state.pickAndSaveForLexicon = !state.pickAndSaveForLexicon;
	return state;
};
const toggleSavedForLexiconFunc = (state, action) => {
	const id = action.payload;
	const saved = state.savingForLexicon;
	if(saved[id]) {
		delete saved[id];
	} else {
		saved[id] = true;
	}
	state.savingForLexicon = saved;
	return state;
};
const setSavingForLexiconFunc = (state, action) => {
	state.savingForLexicon = action.payload;
	return state;
};

const wordListsSlice = createSlice({
	name: 'wordLists',
	initialState,
	reducers: {
		setCenterTheDisplayedWords: setCenterTheDisplayedWordsFunc,
		toggleDisplayedList: toggleDisplayedListFunc,
		togglePickAndSaveForLexicon: togglePickAndSaveForLexiconFunc,
		toggleSavedForLexicon: toggleSavedForLexiconFunc,
		setSavingForLexicon: setSavingForLexiconFunc
	}
});

export const {
	setCenterTheDisplayedWords,
	toggleDisplayedList,
	togglePickAndSaveForLexicon,
	toggleSavedForLexicon,
	setSavingForLexicon
} = wordListsSlice.actions;

export default wordListsSlice.reducer;

export const equalityCheck = (stateA, stateB) => {
	if (stateA === stateB) {
		return true;
	} else if (
		stateA.pickAndSaveForLexicon
			!== stateB.pickAndSaveForLexicon
		|| String(stateA.centerTheDisplayedWords)
			!== String(stateB.centerTheDisplayedWords)
	) {
		// the basics are unequal
		return false;
	}
	try {
		const keytester = (keysA, keysB) => {
			return (
				keysA.length === keysB.length
					&& String(keysA.sort()) === String(keysB.sort())
			);
		};
		const listA = stateA.listsDisplayed;
		const listB = stateB.listsDisplayed;
		if(listA !== listB) {
			if (!keytester(Object.keys(listA), Object.keys(listB))) {
				// the lists displayed are unequal
				return false;
			}
		}
		const saveA = stateA.savingForLexicon;
		const saveB = stateB.savingForLexicon;
		if(saveA !== saveB) {
			if (!keytester(Object.keys(saveA), Object.keys(saveB))) {
				// the items to be saved are unequal
				return false;
			}
		}
		// equality!
		return true;
	} catch (error) {
		console.log(error);
		// Assume false
		return false;
	}
};
