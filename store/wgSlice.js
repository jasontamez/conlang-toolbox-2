import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';

const initialState = {
	//...simple.wordgenSettings,
	monosyllablesRate: 20,
	maxSyllablesPerWord: 6,
	categoryRunDropoff: 25,
	syllableBoxDropoff: 20,
	capitalizeSentences: true,
	declarativeSentencePre: "",
	declarativeSentencePost: ".",
	interrogativeSentencePre: "",
	interrogativeSentencePost: "?",
	exclamatorySentencePre: "",
	exclamatorySentencePost: "!",
	//...end simple.wordgenSettings
	output: "text",
	showSyllableBreaks: false,
	sentencesPerText: 30,
	capitalizeWords: false,
	sortWordlist: true,
	wordlistMultiColumn: true,
	wordsPerWordlist: 250
};
const setMonosyllablesRateFunc = (state, action) => {
	state.monosyllablesRate = action.payload;
	return state;
};
const setMaxSyllablesPerWordFunc = (state, action) => {
	state.maxSyllablesPerWord = action.payload;
	return state;
};
const setCategoryRunDropoffFunc = (state, action) => {
	state.categoryRunDropoff = action.payload;
	return state;
};
const setSyllableBoxDropoffFunc = (state, action) => {
	state.syllableBoxDropoff = action.payload;
	return state;
};
const setCapitalizeSentencesFunc = (state, action) => {
	state.capitalizeSentences = action.payload;
	return state;
};
const setDeclarativeSentencePreFunc = (state, action) => {
	state.declarativeSentencePre = action.payload;
	return state;
};
const setDeclarativeSentencePostFunc = (state, action) => {
	state.declarativeSentencePost = action.payload;
	return state;
};
const setInterrogativeSentencePreFunc = (state, action) => {
	state.interrogativeSentencePre = action.payload;
	return state;
};
const setInterrogativeSentencePostFunc = (state, action) => {
	state.interrogativeSentencePost = action.payload;
	return state;
};
const setExclamatorySentencePreFunc = (state, action) => {
	state.exclamatorySentencePre = action.payload;
	return state;
};
const setExclamatorySentencePostFunc = (state, action) => {
	state.exclamatorySentencePost = action.payload;
	return state;
};
const setOutputFunc = (state, action) => {
	state.output = action.payload;
	return state;
};
const setShowSyllableBreaksFunc = (state, action) => {
	state.showSyllableBreaks = action.payload;
	return state;
};
const setSentencesPerTextFunc = (state, action) => {
	state.sentencesPerText = action.payload;
	return state;
};
const setCapitalizeWordsFunc = (state, action) => {
	state.capitalizeWords = action.payload;
	return state;
};
const setSortWordlistFunc = (state, action) => {
	state.sortWordlist = action.payload;
	return state;
};
const setWordlistMultiColumnFunc = (state, action) => {
	state.wordlistMultiColumn = action.payload;
	return state;
};
const setWordsPerWordlistFunc = (state, action) => {
	state.wordsPerWordlist = action.payload;
	return state;
};
//const Func = (state, action) => {};


const wgSlice = createSlice({
	name: 'lexicon',
	initialState,
	reducers: {
		setMonosyllablesRate: setMonosyllablesRateFunc,
		setMaxSyllablesPerWord: setMaxSyllablesPerWordFunc,
		setCategoryRunDropoff: setCategoryRunDropoffFunc,
		setSyllableBoxDropoff: setSyllableBoxDropoffFunc,
		setCapitalizeSentences: setCapitalizeSentencesFunc,
		setDeclarativeSentencePre: setDeclarativeSentencePreFunc,
		setDeclarativeSentencePost: setDeclarativeSentencePostFunc,
		setInterrogativeSentencePre: setInterrogativeSentencePreFunc,
		setInterrogativeSentencePost: setInterrogativeSentencePostFunc,
		setExclamatorySentencePre: setExclamatorySentencePreFunc,
		setExclamatorySentencePost: setExclamatorySentencePostFunc,
		setOutput: setOutputFunc,
		setShowSyllableBreaks: setShowSyllableBreaksFunc,
		setSentencesPerText: setSentencesPerTextFunc,
		setCapitalizeWords: setCapitalizeWordsFunc,
		setSortWordlist: setSortWordlistFunc,
		setWordlistMultiColumn: setWordlistMultiColumnFunc,
		setWordsPerWordlist: setWordsPerWordlistFunc
	}
});

export const {
	setMonosyllablesRate,
	setMaxSyllablesPerWord,
	setCategoryRunDropoff,
	setSyllableBoxDropoff,
	setCapitalizeSentences,
	setDeclarativeSentencePre,
	setDeclarativeSentencePost,
	setInterrogativeSentencePre,
	setInterrogativeSentencePost,
	setExclamatorySentencePre,
	setExclamatorySentencePost,
	setOutput,
	setShowSyllableBreaks,
	setSentencesPerText,
	setCapitalizeWords,
	setSortWordlist,
	setWordlistMultiColumn,
	setWordsPerWordlist
} = wgSlice.actions;

export default wgSlice.reducer;

// Constants are not changeable.
export const consts = {
	absoluteMaxColumns: 30
};

// An equality-check function
export const equalityCheck = (stateA, stateB) => {
	if (stateA === stateB) {
		return true;
	}
	// stateA
	const titleA = stateA.title;
	const descriptionA = stateA.description;
	const lexiconA = stateA.lexicon;
	const truncateColumnsA = stateA.truncateColumns;
	const columnsA = stateA.columns;
	const sortDirA = stateA.sortDir;
	const sortPatternA = stateA.sortPattern;
	const disableBlankConfirmsA = stateA.disableBlankConfirms;
	const maxColumnsA = stateA.maxColumns;
	// stateB
	const titleB = stateB.title;
	const descriptionB = stateB.description;
	const lexiconB = stateB.lexicon;
	const truncateColumnsB = stateB.truncateColumns;
	const columnsB = stateB.columns;
	const sortDirB = stateB.sortDir;
	const sortPatternB = stateB.sortPattern;
	const disableBlankConfirmsB = stateB.disableBlankConfirms;
	const maxColumnsB = stateB.maxColumns;
	// flags
	let lex = false;
	let col = false;
	if (
		titleA !== titleB
		|| descriptionA !== descriptionB
		|| truncateColumnsA !== truncateColumnsB
		|| sortDirA !== sortDirB
		|| disableBlankConfirmsA !== disableBlankConfirmsB
		|| maxColumnsA !== maxColumnsB
		|| String(sortPatternA) !== String(sortPatternB)
	) {
		return false;
	} else if(lexiconA === lexiconB) {
		if(columnsA === columnsB) {
			return true;
		}
		lex = true;
	}
	if(columnsA === columnsB) {
		col = true;
	} else {
		// Cols bad?
		col = columnsA.every((col, i) => {
			const otherCol = columnsB[i];
			return col === otherCol ||
				(
					col.label === otherCol.label
					&& col.size === otherCol.size
				);
		});
		if(!col) {
			// if still bad, we're unequal
			return false;
		}
	}
	// Cols are good.
	// Lex bad?
	return lex || lexiconA.every((lex, i) => {
		const otherLex = lexiconB[i];
		return lex === otherLex ||
			(
				lex.id === otherLex.id
				&& String(lex.columns) === String(otherLex.columns)
			);
	});
};

