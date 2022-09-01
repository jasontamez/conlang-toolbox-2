import { createSlice } from '@reduxjs/toolkit'
import blankAppState from './blankAppState';

const initialState = blankAppState.wg;

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
	const { label } = old;
	state.characterGroups = state.characterGroups.map(group => group.label === label ? edited : group);
	return state;
};

// SYLLABLES
const setMultipleSyllableTypesFunc = (state, action) => {
	state.multipleSyllableTypes = action.payload;
	return state;
};
const setSingleWordFunc = (state, action) => {
	state.singleWord = action.payload.replace(/(?:\r?\n)+/g, "\n");
	return state;
};
const setWordInitialFunc = (state, action) => {
	state.wordInitial = action.payload.replace(/(?:\r?\n)+/g, "\n");
	return state;
};
const setWordMiddleFunc = (state, action) => {
	state.wordMiddle = action.payload.replace(/(?:\r?\n)+/g, "\n");
	return state;
};
const setWordFinalFunc = (state, action) => {
	state.wordFinal = action.payload.replace(/(?:\r?\n)+/g, "\n");
	return state;
};
const setSyllableOverrideFunc = (state, action) => {
	const { override, value } = action.payload;
	state.syllableDropoffOverrides[override] = value;
	return state;
};

// TRANSFORMS
const addTransformFunc = (state, action) => {
	// { id, search, replace, ?description }
	state.transforms.push(action.payload);
	return state;
};
const deleteTransformFunc = (state, action) => {
	const id = action.payload;
	state.transforms = state.transforms.filter(t => t.id !== id);
	return state;
};
const editTransformFunc = (state, action) => {
	const item = action.payload;
	const { id } = item;
	state.transforms = state.transforms.map(t => t.id === id ? item : t);
	return state;
};
const rearrangeTransformsFunc = (state, action) => {
	state.transforms = action.payload;
	return state;
};

// CLEAR ALL
const clearWGFunc = (state, action) => {
	state.characterGroups = [];
	state.multipleSyllableTypes = false;
	state.singleWord = "";
	state.wordInitial = "";
	state.wordMiddle = "";
	state.wordFinal = "";
	state.transforms = [];
	state.syllableDropoffOverrides = {
		singleWord: null,
		wordInitial: null,
		wordMiddle: null,
		wordFinal: null
	};
	return state;
};

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
		setMultipleSyllableTypes: setMultipleSyllableTypesFunc,
		setSingleWord: setSingleWordFunc,
		setWordInitial: setWordInitialFunc,
		setWordMiddle: setWordMiddleFunc,
		setWordFinal: setWordFinalFunc,
		setSyllableOverride: setSyllableOverrideFunc,
		addTransform: addTransformFunc,
		deleteTransform: deleteTransformFunc,
		editTransform: editTransformFunc,
		rearrangeTransforms: rearrangeTransformsFunc,
		clearWG: clearWGFunc,
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
	setMultipleSyllableTypes,
	setSingleWord,
	setWordInitial,
	setWordMiddle,
	setWordFinal,
	setSyllableOverride,
	addTransform,
	deleteTransform,
	editTransform,
	rearrangeTransforms,
	clearWG,
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
	const multipleSyllableTypesA = stateA.multipleSyllableTypes;
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
	const multipleSyllableTypesB = stateB.multipleSyllableTypes;
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
		multipleSyllableTypesA !== multipleSyllableTypesB
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
	// Test character groups
	if(testIfArrayOfObjectsAreUnequal(
		characterGroupsA,
		characterGroupsB,
		["description", "label", "run", "dropoff"]
	)) {
		// At least one group was unequal
		return false;
	}
	// Test transforms
	if(testIfArrayOfObjectsAreUnequal(
		transformsA,
		transformsB,
		["id", "search", "replace", "description"])
	) {
		// At least one transform was unequal
		return false;
	}
	// Test syllableDropoffOverrides
	return !testIfArrayOfObjectsAreUnequal(
		[syllableDropoffOverridesA],
		[syllableDropoffOverridesB],
		["singleWord", "wordInitial", "wordMiddle", "wordFinal"]
	);
};

const testIfArrayOfObjectsAreUnequal = (A, B, props) => {
	return A.length !== B.length
		|| A.some((a, i) => {
			const b = B[i];
			return (a !== b) && props.some(p => a[p] !== b[p]);
		});
};
