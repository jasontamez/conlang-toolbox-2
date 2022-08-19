import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';

const initialState = {
	// GROUPS
	characterGroups: [],
	// SYLLABLES
	oneTypeOnly: false,
	singleWord: "",
	wordInitial: "",
	wordMiddle: "",
	wordFinal: "",
	syllableDropoffOverrides: {
		singleWord: null,
		wordInitial: null,
		wordMiddle: null,
		wordFinal: null
	},
	// TRANSFORMS
	transforms: [],
	// SETTINGS
	//...simple.wordgenSettings,
	monosyllablesRate: 20,
	maxSyllablesPerWord: 6,
	characterGroupDropoff: 25,
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
// GROUPS
const addCharacterGroupFunc = (state, action) => {
	// {label, description, run, ?dropoff}
	state.characterGroups.push(action.payload);
	return state;
};
const deleteCharacterGroupFunc = (state, action) => {
	const { label } = action.payload;
	state.characterGroups = state.characterGroups.filter(group => group.label !== label);
	return state;
};
const editCharacterGroupFunc = (state, action) => {
	const {old, edited} = action.payload;
	state.characterGroups = state.characterGroups.map(group => {
		if(group.label !== old.label) {
			return group;
		}
		return edited;
	});
	return state;
};

// SYLLABLES
const setOneTypeOnlyFunc = (state, action) => {
	state.oneTypeOnly = action.payload;
	return state;
};
const setSingleWordFunc = (state, action) => {
	state.singleWord = action.payload;
	return state;
};
const setWordInitialFunc = (state, action) => {
	state.wordInitial = action.payload;
	return state;
};
const setWordMiddleFunc = (state, action) => {
	state.wordMiddle = action.payload;
	return state;
};
const setWordFinalFunc = (state, action) => {
	state.wordFinal = action.payload;
	return state;
};
const setSyllableOverrideFunc = (state, action) => {
	const { override, value } = action.payload;
	state.syllableDropoffOverrides[override] = value;
	return state;
};

//const Func = (state, action) => {};

// SETTINGS
const setMonosyllablesRateFunc = (state, action) => {
	state.monosyllablesRate = action.payload;
	return state;
};
const setMaxSyllablesPerWordFunc = (state, action) => {
	state.maxSyllablesPerWord = action.payload;
	return state;
};
const setCharacterGroupDropoffFunc = (state, action) => {
	state.characterGroupDropoff = action.payload;
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


const wgSlice = createSlice({
	name: 'wg',
	initialState,
	reducers: {
		addCharacterGroup: addCharacterGroupFunc,
		deleteCharacterGroup: deleteCharacterGroupFunc,
		editCharacterGroup: editCharacterGroupFunc,
		setOneTypeOnly: setOneTypeOnlyFunc,
		setSingleWord: setSingleWordFunc,
		setWordInitial: setWordInitialFunc,
		setWordMiddle: setWordMiddleFunc,
		setWordFinal: setWordFinalFunc,
		setSyllableOverride: setSyllableOverrideFunc,
		setMonosyllablesRate: setMonosyllablesRateFunc,
		setMaxSyllablesPerWord: setMaxSyllablesPerWordFunc,
		setCharacterGroupDropoff: setCharacterGroupDropoffFunc,
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
	addCharacterGroup,
	deleteCharacterGroup,
	editCharacterGroup,
	setOneTypeOnly,
	setSingleWord,
	setWordInitial,
	setWordMiddle,
	setWordFinal,
	setSyllableOverride,
	setMonosyllablesRate,
	setMaxSyllablesPerWord,
	setCharacterGroupDropoff,
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

// An equality-check function
export const equalityCheck = (stateA, stateB) => {
	if (stateA === stateB) {
		return true;
	}
	const characterGroupsA = stateA.characterGroups;
	const oneTypeOnlyA = stateA.oneTypeOnly;
	const singleWordA = stateA.singleWord;
	const wordInitialA = stateA.wordInitial;
	const wordMiddleA = stateA.wordMiddle;
	const wordFinalA = stateA.wordFinal;
	const syllableDropoffOverridesA = stateA.syllableDropoffOverrides;
	const transformsA = stateA.transforms;
	const monosyllablesRateA = stateA.monosyllablesRate;
	const maxSyllablesPerWordA = stateA.maxSyllablesPerWord;
	const characterGroupDropoffA = stateA.characterGroupDropoff;
	const syllableBoxDropoffA = stateA.syllableBoxDropoff;
	const capitalizeSentencesA = stateA.capitalizeSentences;
	const declarativeSentencePreA = stateA.declarativeSentencePre;
	const declarativeSentencePostA = stateA.declarativeSentencePost;
	const interrogativeSentencePreA = stateA.interrogativeSentencePre;
	const interrogativeSentencePostA = stateA.interrogativeSentencePost;
	const exclamatorySentencePreA = stateA.exclamatorySentencePre;
	const exclamatorySentencePostA = stateA.exclamatorySentencePost;
	const outputA = stateA.output;
	const showSyllableBreaksA = stateA.showSyllableBreaks;
	const sentencesPerTextA = stateA.sentencesPerText;
	const capitalizeWordsA = stateA.capitalizeWords;
	const sortWordlistA = stateA.sortWordlist;
	const wordlistMultiColumnA = stateA.wordlistMultiColumn;
	const wordsPerWordlistA = stateA.wordsPerWordlist;
	// stateB
	const characterGroupsB = stateB.characterGroups;
	const oneTypeOnlyB = stateB.oneTypeOnly;
	const singleWordB = stateB.singleWord;
	const wordInitialB = stateB.wordInitial;
	const wordMiddleB = stateB.wordMiddle;
	const wordFinalB = stateB.wordFinal;
	const syllableDropoffOverridesB = stateB.syllableDropoffOverrides;
	const transformsB = stateB.transforms;
	const monosyllablesRateB = stateB.monosyllablesRate;
	const maxSyllablesPerWordB = stateB.maxSyllablesPerWord;
	const characterGroupDropoffB = stateB.characterGroupDropoff;
	const syllableBoxDropoffB = stateB.syllableBoxDropoff;
	const capitalizeSentencesB = stateB.capitalizeSentences;
	const declarativeSentencePreB = stateB.declarativeSentencePre;
	const declarativeSentencePostB = stateB.declarativeSentencePost;
	const interrogativeSentencePreB = stateB.interrogativeSentencePre;
	const interrogativeSentencePostB = stateB.interrogativeSentencePost;
	const exclamatorySentencePreB = stateB.exclamatorySentencePre;
	const exclamatorySentencePostB = stateB.exclamatorySentencePost;
	const outputB = stateB.output;
	const showSyllableBreaksB = stateB.showSyllableBreaks;
	const sentencesPerTextB = stateB.sentencesPerText;
	const capitalizeWordsB = stateB.capitalizeWords;
	const sortWordlistB = stateB.sortWordlist;
	const wordlistMultiColumnB = stateB.wordlistMultiColumn;
	const wordsPerWordlistB = stateB.wordsPerWordlist;
	// Test simple values
	if (
		oneTypeOnlyA !== oneTypeOnlyB
		|| singleWordA !== singleWordB
		|| wordInitialA !== wordInitialB
		|| wordMiddleA !== wordMiddleB
		|| wordFinalA !== wordFinalB
		|| monosyllablesRateA !== monosyllablesRateB
		|| maxSyllablesPerWordA !== maxSyllablesPerWordB
		|| characterGroupDropoffA !== characterGroupDropoffB
		|| syllableBoxDropoffA !== syllableBoxDropoffB
		|| capitalizeSentencesA !== capitalizeSentencesB
		|| declarativeSentencePreA !== declarativeSentencePreB
		|| declarativeSentencePostA !== declarativeSentencePostB
		|| interrogativeSentencePreA !== interrogativeSentencePreB
		|| interrogativeSentencePostA !== interrogativeSentencePostB
		|| exclamatorySentencePreA !== exclamatorySentencePreB
		|| exclamatorySentencePostA !== exclamatorySentencePostB
		|| outputA !== outputB
		|| showSyllableBreaksA !== showSyllableBreaksB
		|| sentencesPerTextA !== sentencesPerTextB
		|| capitalizeWordsA !== capitalizeWordsB
		|| sortWordlistA !== sortWordlistB
		|| wordlistMultiColumnA !== wordlistMultiColumnB
		|| wordsPerWordlistA !== wordsPerWordlistB
	) {
		return false;
	}
	// Test arrays
	const A = [
		characterGroupsA,
		transformsA
	];
	const B = [
		characterGroupsB,
		transformsB
	];
	if(A.some((array, i) => {
		return (array !== B[i]) && String(array) !== String(array);
	})) {
		// At least one array was unequal
		return false;
	}
	// Test objects
	// (only one object right now)
	return (
		syllableDropoffOverridesA === syllableDropoffOverridesB
		|| (
			syllableDropoffOverridesA.singleWord === syllableDropoffOverridesB.singleWord
			&& syllableDropoffOverridesA.wordInitial === syllableDropoffOverridesB.wordInitial
			&& syllableDropoffOverridesA.wordMiddle === syllableDropoffOverridesB.wordMiddle
			&& syllableDropoffOverridesA.wordFinal === syllableDropoffOverridesB.wordFinal
		)
	);
};
