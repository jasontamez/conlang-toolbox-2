const blankAppState = {/*
	currentVersion: packageJson.version,
	wordgenTransformations: {
		list: [],
		editing: null
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
	}*/
	wg: {
		// GROUPS
		characterGroups: [],
		// SYLLABLES
		multipleSyllableTypes: false,
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
		description: "",
		truncateColumns: true,
		sortDir: false,
		sortPattern: [],
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
		lexicon: [],
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
		disableConfirms: false,
		sizeName: "md",
		sizes: {
			xs: {
				base: "sm",
				lg: "md",
				xl: "lg"
			},
			sm: {
				base: "md",
				lg: "lg",
				xl: "xl"
			},
			md: {
				base: "lg",
				lg: "xl",
				xl: "2xl"
			},
			lg: {
				base: "xl",
				lg: "2xl",
				xl: "3xl"
			},
			xl: {
				base: "2xl",
				lg: "3xl",
				xl: "4xl"
			},
			x2: {
				base: "3xl",
				lg: "4xl",
				xl: "5xl"
			}
		},
		hasCheckedForOldCustomInfo_WG: false
	},
	/*
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

export default blankAppState;
