//import AsyncStorage from '@react-native-async-storage/async-storage';
////import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
//import { createStore, applyMiddleware } from "redux";
//import { reducer, blankAppState } from "./ducks";
////import { persistStore, persistReducer } from 'redux-persist';
//import thunk from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import { StateStorage as OldStateStorage } from './persistentInfo';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

//import packageJson from '../package.json';
import morphoSyntaxSlice from './morphoSyntaxSlice';
import wordListsSlice from './wordListsSlice';
import appStateSlice from './appStateSlice';
import lexiconSlice from './lexiconSlice';

//const reconcile = async (incoming, original, reduced) => {
//	// Nothing for now.
//	return autoMergeLevel2(incoming, original, reduced);
//};

export default () => {
	const reducer = {
		// SLICES here
		morphoSyntax: morphoSyntaxSlice,
		appState: appStateSlice,
		wordLists: wordListsSlice,
		lexicon: lexiconSlice
	};
	//const persistConfig = {
	//	key: 'root',
	//	storage: ExpoFileSystemStorage,
	//	version: 0,
	//	stateReconciler: reconcile
	//}
	//const persistedReducer = persistReducer(persistConfig, reducer);
	const store = configureStore({
		reducer: /* persistedReducer  */ reducer,
		preloadedState: initialAppState
	});
	const persistor = /* persistStore(store); */ null;
	return { store, persistor };
};

//export const original = () => {
//	const persistConfig = {
//		key: 'root',
//		storage: ExpoFileSystemStorage,
//		version: 0,
//		stateReconciler: reconcile
//	}
//	//let store = createStore(persistedReducer(reducer), blankAppState, applyMiddleware(thunk));
//	const persistedReducer = persistReducer(persistConfig, reducer);
//	let store = configureStore({
//		reducer: persistedReducer(reducer),
//		preloadedState: blankAppState
//	});
//	let persistor = persistStore(store);
//	return { store, persistor };
//};


export const blankAppState = {/*
	currentVersion: packageJson.version,
	appSettings: {
		theme: "Default",
		disableConfirms: false
	},
	wordgenCharacters: {
		map: [],
		editing: null
	},
	wordgenSyllables: {
		toggle: false,
		objects: {
			singleWord: { components: [] },
			wordInitial: { components: [] },
			wordMiddle: { components: [] },
			wordFinal: { components: [] }
		}
	},
	wordgenTransformations: {
		list: [],
		editing: null
	},
	wordgenSettings: {
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
	},
	wordevolveCharacters: {
		map: [],
		editing: null
	},
	wordevolveTransformations: {
		list: [],
		editing: null
	},
	wordevolveSoundChanges: {
		list: [],
		editing: null
	},
	wordevolveInput: [],
	wordevolveSettings: {
		output: "outputOnly"
	},
	morphoSyntaxModalState: {},*/
	wordgenSettings: {
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
	},
	morphoSyntax: {
		key: "",
		lastSave: 0,
		title: "",
		description: "",
		bool: {},
		num: {},
		text: {}
	},
	lexicon: {
		key: "",
		lastSave: 0,
		title: "",
		description: "Hi, this is a description.",
		truncateColumns: true,
		sortDir: false,
		sortPattern: [0, 1, 2],
		columns: [
			{
				id: "00",
				label: "Word",
				size: "lexMd"
			},
			{
				id: "11",
				label: "Part of Speech",
				size: "lexSm"
			},
			{
				id: "22",
				label: "Definition",
				size: "lexLg"
			}
		],
		lexicon: [
			{
				id: "0",
				columns: [
					"fleeb",
					"n",
					"a thing you know and love"
				]
			},
			{
				id: "1",
				columns: [
					"boof",
					"v",
					"vocalize in a dog way"
				]
			},
			{
				id: "2",
				columns: [
					"akorn",
					"adj",
					"damp and musty"
				]
			},
			{
				id: "10",
				columns: [
					"marr",
					"n",
					"a movie featuring a black dog and a brown cat"
				]
			},
			{
				id: "11",
				columns: [
					"treff",
					"v",
					"mispronounce words on purpose"
				]
			},
			{
				id: "12",
				columns: [
					"plo",
					"adj",
					"scary but heartwarming"
				]
			},
			{
				id: "20",
				columns: [
					"quog",
					"n",
					"a tower of cans"
				]
			},
			{
				id: "21",
				columns: [
					"ickthioraptorimino",
					"v",
					"imitating a potato"
				]
			},
			{
				id: "22",
				columns: [
					"rhyk",
					"adj",
					"juvenile and intelligent"
				]
			},
			{
				id: "30",
				columns: [
					"ulululu",
					"n",
					"a doorbell that doesn't work"
				]
			},
			{
				id: "31",
				columns: [
					"dru",
					"v",
					"mixing with broth"
				]
			},
			{
				id: "32",
				columns: [
					"fargu",
					"adj",
					"toothy"
				]
			},
			{
				id: "40",
				columns: [
					"tirg",
					"n",
					"a staircase to nowhere"
				]
			},
			{
				id: "41",
				columns: [
					"mimm",
					"v",
					"charming a snake or other reptile"
				]
			},
			{
				id: "42",
				columns: [
					"bilo",
					"adj",
					"dead for at least twenty years"
				]
			},
		],
		disableBlankConfirms: false,
		maxColumns: 10
	},
	wordLists: {
		centerTheDisplayedWords: [],
		listsDisplayed: {},
		pickAndSaveForLexicon: false,
		savingForLexicon: {}
	},
	appState: {
		menuToggleName: '',
		theme: 'Default',
		disableConfirms: false
	},
	/* lexicon: {
		key: "",
		lastSave: 0,
		title: "",
		description: "",
		columns: 3,
		columnOrder: [0,1,2],
		columnTitles: ["Word", "Part of Speech", "Definition"],
		columnSizes: ["m", "s", "l"],
		sort: [0, 0],
		sorted : true,
		lexicon: [],
		waitingToAdd: [],
		editing: undefined,
		colEdit: undefined,
		lexiconWrap: false
	},
	modalState: {
		loadingPage: false,
		menuToggle: false,
		AppTheme: false,
		AddCategory: false,
		EditCategory: false,
		AddTransform: false,
		EditTransform: false,
		PresetPopup: false,
		WGOutputOptions: false,
		ManageCustomInfo: false,
		AddCategoryWE: false,
		EditCategoryWE: false,
		AddTransform: false,
		EditTransform: false,
		AddSoundChange: false,
		EditSoundChange: false,
		LexiconEllipsis: undefined,
		EditLexiconItem: false,
		EditLexiconOrder: false,
		LoadLexicon: false,
		DeleteLexicon: false,
		WGSaveToLexicon: undefined,
		PickAndSaveWG: false,
		WEPresetPopup: false,
		WEOutputOptions: false,
		PickAndSaveWE: false,
		ManageCustomInfoWE: false,
		WESaveToLexicon: undefined,
		InfoModal: false,
		ExtraCharacters: false,
		ExtraCharactersEllipsis: undefined,
		ExportLexicon: false,
		WordListsEllipsis: undefined,
		PickAndSaveWL: false,
		LoadMS: false,
		DeleteMS: false,
		ExportMS: false
	},
	viewState: {
		wg: 'characters',
		we: 'characters',
		wl: 'home',
		ms: 'syntax',
		ph: 'home',
		lastSection: ''
	},
	extraCharactersState: {
		display: null,
		saved: [],
		copyImmediately: false,
		copyLater: "",
		adding: false,
		deleting: false,
		showNames: false,
		showHelp: false
	},
	temporaryInfo: undefined*/
};

export const initialAppState = {
	...blankAppState,/*
	wordgenCharacters: {
		map: [
			["C", {
				title: "Consonants",
				run: "ptkbdg"
			}],
			["V", {
				title: "Vowels",
				run: "ieaou"
			}],
			["L", {
				title: "Liquids",
				run: "rl"
			}]
		],
		editing: null
	},
	wordgenSyllables: {
		toggle: false,
		objects: {
			singleWord: { components: ["CV","V","CLV"] },
			wordInitial: { components: [] },
			wordMiddle: { components: [] },
			wordFinal: { components: [] }
		}
	},
	wordgenTransformations: {
		list: [
			{
				key: "0",
				seek: "ki",
				replace: "ci",
				description: ""

			},
			{
				key: "1",
				seek: "(.)\\1+",
				replace: "$1$1",
				description: ""
			}
		],
		editing: null
	}*/
};

const reconcileOld = async (incoming, original, reduced) => {
	if(!incoming || typeof incoming !== 'object') {
		// If we have no incoming state, then there might be previously stored state.
		let storedState = await OldStateStorage.getItem("lastState");
		if(storedState !== null && (typeof storedState) === "object") {
			// Delete stored state
			OldStateStorage.removeItem("lastState");
			// Not going to use a currentVersion prop anymore
			delete storedState.currentVersion;
			//
			//
			// Make any other changes if needed
			//
			//
			//
			return storedState;
			//const VERSION = packageJson.version;
			//if(checkIfState(storedState)) {
			//	return dispatch(overwriteState(storedState));
			//}
		}
	}
	// Previous state given? No state found from old method? Just pass along.
	return autoMergeLevel2(incoming, original, reduced);
};

