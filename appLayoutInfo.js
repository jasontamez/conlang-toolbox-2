const msSettings = {
	title: "Settings",
	url: "/ms",
	isChildOf: "MS",
	id: "MSSettings"
}
const ms01 = {
	title: "1. Morphological Typology",
	url: "/ms/ms01",
	isChildOf: "MS",
	id: "MS1"
};
const ms02 = {
	title: "2. Grammatical Categories",
	url: "/ms/ms02",
	isChildOf: "MS",
	id: "MS2"
};
const ms03 = {
	title: "3. Constituent Order Typology",
	url: "/ms/ms03",
	isChildOf: "MS",
	id: "MS3"
};
const ms04 = {
	title: "4. Noun Operations",
	url: "/ms/ms04",
	isChildOf: "MS",
	id: "MS4"
};
const ms05 = {
	title: "5. Predicate Nominals etc.",
	url: "/ms/ms05",
	isChildOf: "MS",
	id: "MS5"
};
const ms06 = {
	title: "6. Grammatical Relations",
	url: "/ms/ms06",
	isChildOf: "MS",
	id: "MS6"
};
const ms07 = {
	title: "7. Voice/Valence Operations",
	url: "/ms/ms07",
	isChildOf: "MS",
	id: "MS7"
};
const ms08 = {
	title: "8. Other Verb Operations",
	url: "/ms/ms08",
	isChildOf: "MS",
	id: "MS8"
};
const ms09 = {
	title: "9. Pragmatic Marking",
	url: "/ms/ms09",
	isChildOf: "MS",
	id: "MS9"
};
const ms10 = {
	title: "10. Clause Combinations",
	url: "/ms/ms10",
	isChildOf: "MS",
	id: "MS10"
};
const MS = {
	title: "MorphoSyntax",
	url: "/ms",
	icon: "MorphoSyntaxIcon",
	id: "MS",
	sectionId: "apps",
	kids: [msSettings, ms01, ms02, ms03, ms04, ms05, ms06, ms07, ms08, ms09, ms10]
};


const wgCharacters = {
	title: "Character Groups",
	url: "/wg/characters",
	isChildOf: "WG",
	id: "WGcha"
};
const wgSyllables = {
	title: "Syllables",
	url: "/wg/syllables",
	isChildOf: "WG",
	id: "WGsyl"
};
const wgTransformations = {
	title: "Transformations",
	url: "/wg/transformations",
	isChildOf: "WG",
	id: "WGtns"
};
const wgOutput = {
	title: "Output",
	url: "/wg/output",
	isChildOf: "WG",
	id: "WGout"
};
const wgSettings = {
	title: "Settings",
	url: "/wg",
	isChildOf: "WG",
	id: "WGset"
};
const WG = {
	title: "WordGen",
	url: "/wg",
	icon: "WordGenIcon",
	sectionId: "apps",
	id: "WG",
	rightHeader: ["WGContextMenu"],
	kids: [
		wgCharacters,
		wgSyllables,
		wgTransformations,
		wgOutput,
		wgSettings
	]
};


const weInput = {
	title: "Input",
	url: "/we/",
	isChildOf: "WE",
	id: "WEinp"
};
const weCharacters = {
	title: "Character Groups",
	url: "/we/characters",
	isChildOf: "WE",
	id: "WEcha"
};
const weTransformations = {
	title: "Transformations",
	url: "/we/transformations",
	isChildOf: "WE",
	id: "WEtns"
};
const weSoundchanges = {
	title: "Sound Changes",
	url: "/we/soundchanges",
	isChildOf: "WE",
	id: "WEscs"
};
const weOutput = {
	title: "Output",
	url: "/we/output",
	isChildOf: "WE",
	id: "WEout"
};
const WE = {
	title: "WordEvolve",
	url: "/we",
	icon: "WordEvolveIcon",
	id: "WE",
	sectionId: "apps",
	kids: [
		weInput,
		weCharacters,
		weTransformations,
		weSoundchanges,
		weOutput
	]
};


const DC = {
	title: "Declenjugator",
	url: "/dc",
	icon: "DeclenjugatorIcon",
	sectionId: "apps",
	id: "DC"
}; // https://github.com/apache/cordova-plugin-media ??
const PG = {
	title: "PhonoGraph",
	url: "/ph",
	icon: "PhonoGraphIcon",
	sectionId: "apps",
	id: "PG"
};
const LX = {
	title: "Lexicon",
	url: "/lex",
	icon: "LexiconIcon",
	sectionId: "apps",
	id: "LX",
	rightHeader: ["LexiconContextMenu"]
};
const WL = {
	title: "Word Lists",
	url: "/wordlists",
	icon: "WordListsIcon",
	sectionId: "apps",
	id: "WL",
	extraChars: false,
	rightHeader: ["WordListsContextMenu"]
};

const AppSettings = {
	title: "Settings",
	url: "/settings",
	icon: "SettingsIcon",
	sectionId: "settingsEtc",
	id: "AppSettings",
	extraChars: false
};
const About = {
	menuTitle: "About",
	url: "/",
	icon: "AboutIcon",
	sectionId: "settingsEtc",
	id: "About",
	extraChars: false
};
const Credits = {
	title: "Credits",
	url: "/credits",
	sectionId: "settingsEtc",
	id: "Credits",
	extraChars: false,
	fontAdjustment: "-1",
	fontOptions: {
		fontFamily: "mono"
	},
	styleOptions: {
		alignItems: "flex-end",
		justifyContent: "flex-end",
		mt: 8,
		mr: 6
	},
	alignOptions: {
		alignItems: "flex-end"
	}
};

export const appMenuPagesOLD = [
	{
		id: "apps",
		pages: [MS, WG, WE, DC, PG, LX, WL]
	},
	{
		id: "settingsEtc",
		pages: [AppSettings, About, Credits]
	}
];
export const appMenuPages = [
	MS, ...MS.kids,
	WG, ...WG.kids,
	WE, ...WE.kids,
	DC, PG, LX, WL,
	{id: "divider", divider: true},
	AppSettings, About, Credits
];
export const allMainPages = [MS, WG, WE, DC, PG, LX, WL, AppSettings, About, Credits];
