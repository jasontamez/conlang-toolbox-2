const msSettings = {
	title: 'Settings',
	url: '/ms',
	id: 'MSSettings',
}
const ms01 = {
	title: '1. Morphological Typology',
	url: '/ms/ms01',
	id: 'MS1'
};
const ms02 = {
	title: '2. Grammatical Categories',
	url: '/ms/ms02',
	id: 'MS2'
};
const ms03 = {
	title: '3. Constituent Order Typology',
	url: '/ms/ms03',
	id: 'MS3'
};
const ms04 = {
	title: '4. Noun Operations',
	url: '/ms/ms04',
	id: 'MS4'
};
const ms05 = {
	title: '5. Predicate Nominals etc.',
	url: '/ms/ms05',
	id: 'MS5'
};
const ms06 = {
	title: '6. Grammatical Relations',
	url: '/ms/ms06',
	id: 'MS6'
};
const ms07 = {
	title: '7. Voice/Valence Operations',
	url: '/ms/ms07',
	id: 'MS7'
};
const ms08 = {
	title: '8. Other Verb Operations',
	url: '/ms/ms08',
	id: 'MS8'
};
const ms09 = {
	title: '9. Pragmatic Marking',
	url: '/ms/ms09',
	id: 'MS9'
};
const ms10 = {
	title: '10. Clause Combinations',
	url: '/ms/ms10',
	id: 'MS10'
};
const MS = {
	title: 'MorphoSyntax',
	url: '/ms',
	icon: 'MorphoSyntaxIcon',
	id: 'MS',
	children: [msSettings, ms01, ms02, ms03, ms04, ms05, ms06, ms07, ms08, ms09, ms10]
};


const wgCategories = {
	title: 'Character Groups',
	url: '/wg/categories',
	id: 'WGcat'
};
const wgSyllables = {
	title: 'Syllables',
	url: '/wg/syllables',
	id: 'WGsyl'
};
const wgRewriterules = {
	title: 'Transformations',
	url: '/wg/rewriterules',
	id: 'WGrew'
};
const wgOutput = {
	title: 'Output',
	url: '/wg/output',
	id: 'WGout'
};
const wgSettings = {
	title: 'Settings',
	url: '/wg/settings',
	id: 'WGset'
};
const WG = {
	title: 'WordGen',
	url: '/wg',
	icon: 'WordGenIcon',
	id: 'WG',
	children: [
		wgCategories,
		wgSyllables,
		wgRewriterules,
		wgOutput,
		wgSettings
	]
};


const weInput = {
	title: 'Input',
	url: '/we/input',
	id: 'WEinp'
};
const weCategories = {
	title: 'Character Groups',
	url: '/we/categories',
	id: 'WEcat'
};
const weTransformations = {
	title: 'Transformations',
	url: '/we/transformations',
	id: 'WEtns'
};
const weSoundchanges = {
	title: 'Sound Changes',
	url: '/we/soundchanges',
	id: 'WEscs'
};
const weOutput = {
	title: 'Output',
	url: '/we/output',
	id: 'WEout'
};
const WE = {
	title: 'WordEvolve',
	url: '/we',
	icon: 'WordEvolveIcon',
	id: 'WE',
	children: [
		weInput,
		weCategories,
		weTransformations,
		weSoundchanges,
		weOutput
	]
};


const DC = {
	title: 'Declenjugator',
	url: '/dc',
	icon: 'DeclenjugatorIcon',
	id: 'DC'
}; // https://github.com/apache/cordova-plugin-media ??
const PG = {
	title: 'PhonoGraph',
	url: '/ph',
	icon: 'PhonoGraphIcon',
	id: 'PG'
};
const LX = {
	title: 'Lexicon',
	url: '/lex',
	icon: 'LexiconIcon',
	id: 'LX'
};
const WL = {
	title: 'Word Lists',
	url: '/wordlists',
	icon: 'WordListsIcon',
	id: 'WL',
	extraChars: false,
	rightHeader: ["WordListsContextMenu"]
};

const AppSettings = {
	title: 'Settings',
	url: '/settings',
	icon: 'SettingsIcon',
	id: 'AppSettings',
	extraChars: false
};
const About = {
	menuTitle: 'About',
	url: '/',
	icon: 'AboutIcon',
	id: 'About',
	extraChars: false
};
const Credits = {
	title: 'Credits',
	url: '/credits',
	id: 'Credits',
	extraChars: false,
	fontOptions: {
		fontFamily: 'mono',
		fontSize: 'xs'
	},
	styleOptions: {
		alignItems: 'end',
		justifyContent: 'end',
		mt: 8,
		mr: 6
	},
	alignOptions: {
		alignItems: 'end'
	}
};

export const appMenuPages = [
	{
		id: 'apps',
		pages: [MS, WG, WE, DC, PG, LX, WL]
	},
	{
		id: 'settingsEtc',
		pages: [AppSettings, About, Credits]
	}
];
export const allMainPages = [MS, WG, WE, DC, PG, LX, WL, AppSettings, About, Credits];
