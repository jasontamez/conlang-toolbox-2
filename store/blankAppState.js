const blankAppState = {/*
	currentVersion: packageJson.version,
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
	we: {
		input: "",
		characterGroups: [],
		transforms: [],
		soundChanges: [],
		settings: {
			outputStyle: "output",
			multicolumn: true,
			inputLower: false,
			inputAlpha: true,
		},
		storedCustomInfo: {},
		storedCustomIDs: []
	},
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
		wordsPerWordlist: 250,
		storedCustomInfo: {},
		storedCustomIDs: []
	},
	morphoSyntax: {
		id: "",
		lastSave: 0,
		title: "",
		description: "",

		BOOL_prefixMost: false,
		BOOL_prefixLess: false,
		BOOL_suffixMost: false,
		BOOL_suffixLess: false,
		BOOL_circumfixMost: false,
		BOOL_circumfixLess: false,
		BOOL_infixMost: false,
		BOOL_infixLess: false,
		BOOL_actions: false,
		BOOL_actionProcesses: false,
		BOOL_weather: false,
		BOOL_states: false,
		BOOL_involuntaryProcesses: false,
		BOOL_bodyFunctions: false,
		BOOL_motion: false,
		BOOL_position: false,
		BOOL_factive: false,
		BOOL_cognition: false,
		BOOL_sensation: false,
		BOOL_emotion: false,
		BOOL_utterance: false,
		BOOL_manipulation: false,
		BOOL_otherVerbClass: false,
		BOOL_lexVerb: false,
		BOOL_lexNoun: false,
		BOOL_lexVN: false,
		BOOL_lexVorN: false,
		BOOL_adjectives: false,
		BOOL_baseFive: false,
		BOOL_baseTen: false,
		BOOL_baseTwenty: false,
		BOOL_baseOther: false,
		BOOL_numGL: false,
		BOOL_numLG: false,
		BOOL_numNone: false,
		BOOL_multiNumSets: false,
		BOOL_inflectNum: false,
		BOOL_APV: false,
		BOOL_AVP: false,
		BOOL_VAP: false,
		BOOL_VPA: false,
		BOOL_PAV: false,
		BOOL_PVA: false,
		BOOL_preP: false,
		BOOL_postP: false,
		BOOL_circumP: false,
		BOOL_numSing: false,
		BOOL_numDual: false,
		BOOL_numTrial: false,
		BOOL_numPaucal: false,
		BOOL_numPlural: false,
		BOOL_classGen: false,
		BOOL_classAnim: false,
		BOOL_classShape: false,
		BOOL_classFunction: false,
		BOOL_classOther: false,
		BOOL_dimAugYes: false,
		BOOL_dimAugObligatory: false,
		BOOL_dimAugProductive: false,
		BOOL_nomAcc: false,
		BOOL_ergAbs: false,
		BOOL_markInv: false,
		BOOL_markDirInv: false,
		BOOL_verbAgreeInv: false,
		BOOL_wordOrderChange: false,
		BOOL_tenseMorph: false,
		BOOL_aspectMorph: false,
		BOOL_modeMorph: false,
		BOOL_otherMorph: false,
		BOOL_chainFirst: false,
		BOOL_chainLast: false,
		BOOL_chainN: false,
		BOOL_chainV: false,
		BOOL_chainCj: false,
		BOOL_chainT: false,
		BOOL_chainA: false,
		BOOL_chainPer: false,
		BOOL_chainNum: false,
		BOOL_chainOther: false,
		BOOL_relPre: false,
		BOOL_relPost: false,
		BOOL_relInternal: false,
		BOOL_relHeadless: false,
		BOOL_coordMid: false,
		BOOL_coordTwo: false,
		BOOL_coordLast: false,

		NUM_synthesis: 0,
		NUM_fusion: 0,
		NUM_stemMod: 0,
		NUM_suppletion: 0,
		NUM_redupe: 0,
		NUM_supraMod: 0,
		NUM_headDepMarked: 0,

		TEXT_tradTypol: "",
		TEXT_morphProcess: "",
		TEXT_headDepMark: "",
		TEXT_propNames: "",
		TEXT_possessable: "",
		TEXT_countMass: "",
		TEXT_pronounAnaphClitic: "",
		TEXT_semanticRole: "",
		TEXT_verbClass: "",
		TEXT_verbStructure: "",
		TEXT_propClass: "",
		TEXT_quantifier: "",
		TEXT_numeral: "",
		TEXT_adverb: "",
		TEXT_mainClause: "",
		TEXT_verbPhrase: "",
		TEXT_nounPhrase: "",
		TEXT_adPhrase: "",
		TEXT_compare: "",
		TEXT_questions: "",
		TEXT_COType: "",
		TEXT_compounding: "",
		TEXT_denoms: "",
		TEXT_nNumberOpt: "",
		TEXT_nNumberObl: "",
		TEXT_nCase: "",
		TEXT_articles: "",
		TEXT_demonstratives: "",
		TEXT_possessors: "",
		TEXT_classGender: "",
		TEXT_dimAug: "",
		TEXT_predNom: "",
		TEXT_predLoc: "",
		TEXT_predEx: "",
		TEXT_ergative: "",
		TEXT_causation: "",
		TEXT_applicatives: "",
		TEXT_dativeShifts: "",
		TEXT_datOfInt: "",
		TEXT_possessRaising: "",
		TEXT_refls: "",
		TEXT_recips: "",
		TEXT_passives: "",
		TEXT_inverses: "",
		TEXT_middleCon: "",
		TEXT_antiP: "",
		TEXT_objDemOmInc: "",
		TEXT_verbNoms: "",
		TEXT_verbComp: "",
		TEXT_tense: "",
		TEXT_aspect: "",
		TEXT_mode: "",
		TEXT_locDirect: "",
		TEXT_evidence: "",
		TEXT_miscVerbFunc: "",
		TEXT_pragFocusEtc: "",
		TEXT_negation: "",
		TEXT_declaratives: "",
		TEXT_YNQs: "",
		TEXT_QWQs: "",
		TEXT_imperatives: "",
		TEXT_serialVerbs: "",
		TEXT_complClauses: "",
		TEXT_advClauses: "",
		TEXT_clauseChainEtc: "",
		TEXT_relClauses: "",
		TEXT_coords: "",

		storedCustomInfo: {},
		storedCustomIDs: []
	},
	lexicon: {
		id: "",
		lastSave: 0,
		title: "",
		description: "",
		truncateColumns: true,
		sortDir: false,
		sortPattern: [0, 1, 2],
		columns: [
			{
				id: "00",
				label: "Word",
				size: "m"
			},
			{
				id: "11",
				label: "Part of Speech",
				size: "s"
			},
			{
				id: "22",
				label: "Definition",
				size: "l"
			}
		],
		lexicon: [],
		disableBlankConfirms: false,
		maxColumns: 10,
		storedCustomInfo: {},
		storedCustomIDs: []
	},
	wordLists: {
		centerTheDisplayedWords: [],
		listsDisplayed: {},
		pickAndSaveForLexicon: false,
		savingForLexicon: {}
	},
	extraCharacters: {
		faves: [],
		copyImmediately: false,
		toCopy: "",
		showNames: false
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
		hasCheckedForOldCustomInfo: false
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
