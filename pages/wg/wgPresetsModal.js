import PresetsModal from '../../components/PresetsModal';

const WGPresetsModal = ({
	modalOpen,
	setModalOpen,
	triggerResets,
	loadState
}) => <PresetsModal
	modalOpen={modalOpen}
	setModalOpen={setModalOpen}
	triggerResets={triggerResets}
	presetsInfo={wgPresets}
	loadState={loadState}
	overwriteText="all character groups, syllables, transforms, and settings on this page"
/>;

export default WGPresetsModal;

const basicSettings = {
	multipleSyllableTypes: false,
	syllableDropoffOverrides: {
		singleWord: null,
		wordInitial: null,
		wordMiddle: null,
		wordFinal: null
	},
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
};

const wgPresets = [
	["Simple", {
		...basicSettings,
		characterGroups: [
			{
				label: "C",
				description: "Consonants",
				run: "ptkbdg"
			},
			{
				label: "V",
				description: "Vowels",
				run: "ieaou"
			},
			{
				label: "L",
				description: "Liquids",
				run: "rl"
			}
		],
		singleWord: "CV\nV\nCLV",
		wordInitial: "",
		wordMiddle: "",
		wordFinal: "",
		transforms: [
			{
				id: "1",
				search: "(.)\\1+",
				replace: "$1$1",
				description: ""
			}
		]
	}],
	["Medium", {
		...basicSettings,
		characterGroups: [
			{
				label: "C",
				description: "Consonants",
				run: "tpknlrsmʎbdgñfh"
			},
			{
				label: "V",
				description: "Vowels",
				run: "aieuoāīūēō"
			},
			{
				label: "N",
				description: "Nasals",
				run: "nŋ"
			}
		],
		singleWord: "CV\nV\nCVN",
		wordInitial: "",
		wordMiddle: "",
		wordFinal: "",
		transforms: [
			{
				id: "0",
				search: "aa",
				replace: "ā",
				description: ""
			},
			{
				id: "1",
				search: "ii",
				replace: "ī",
				description: ""
			},
			{
				id: "2",
				search: "uu",
				replace: "ū",
				description: ""
			},
			{
				id: "3",
				search: "ee",
				replace: "ē",
				description: ""
			},
			{
				id: "4",
				search: "oo",
				replace: "ō",
				description: ""
			},
			{
				id: "5",
				search: "nb",
				replace: "mb",
				description: ""
			},
			{
				id: "6",
				search: "np",
				replace: "mp",
				description: ""
			}
		]
	}],
	["Pseudo-Latin", {
		...basicSettings,
		characterGroups: [
			{
				label: "C",
				description: "Consonants",
				run: "tkpnslrmfbdghvyh"
			},
			{
				label: "V",
				description: "Vowels 1",
				run: "aiueo"
			},
			{
				label: "U",
				description: "Vowels 2",
				run: "aiuàê"
			},
			{
				label: "P",
				description: "Pre-liquid consonants",
				run: "ptkbdg"
			},
			{
				label: "L",
				description: "Liquids",
				run: "rl"
			},
			{
				label: "F",
				description: "Syllable-final consonants",
				run: "nsrmltc"
			}
		],
		singleWord: "CV\nCUF\nV\nUF\nPLV\nPLUF",
		wordInitial: "",
		wordMiddle: "",
		wordFinal: "",
		transforms: [
			{
				id: "0",
				search: "ka",
				replace: "ca",
				description: ""
			},
			{
				id: "1",
				search: "nko",
				replace: "co",
				description: ""
			},
			{
				id: "2",
				search: "nku",
				replace: "cu",
				description: ""
			},
			{
				id: "3",
				search: "nkr",
				replace: "cr",
				description: ""
			}
		]
	}],
	["Pseudo-Chinese", {
		...basicSettings,
		characterGroups: [
			{
				label: "C",
				description: "Consonants",
				run: "ptknlsmšywčhfŋ"
			},
			{
				label: "V",
				description: "Vowels",
				run: "auieo"
			},
			{
				label: "F",
				description: "Syllable-Final Consonants",
				run: "nnŋmktp"
			},
			{
				label: "D",
				description: "Dipthongs",
				run: "io"
			},
			{
				label: "A",
				description: "Aspirated Consonants",
				run: "ptkč"
			}
		],
		singleWord: "CV\nAʰV\nCVD\nCVF\nVF\nV\nAʰVF",
		wordInitial: "",
		wordMiddle: "",
		wordFinal: "",
		transforms: [
			{
				id: "0",
				search: "uu",
				replace: "wo",
				description: ""
			},
			{
				id: "1",
				search: "oo",
				replace: "ou",
				description: ""
			},
			{
				id: "2",
				search: "ii",
				replace: "iu",
				description: ""
			},
			{
				id: "3",
				search: "aa",
				replace: "ia",
				description: ""
			},
			{
				id: "4",
				search: "ee",
				replace: "ie",
				description: ""
			}
		]
	}],
	["Pseudo-Greek", {
		...basicSettings,
		characterGroups: [
			{
				label: "C",
				description: "Consonants",
				run: "ptknslrmbdgfvwyhšzñxčžŋ"
			},
			{
				label: "V",
				description: "Vowels",
				run: "aiuoeɛɔâôüö"
			},
			{
				label: "L",
				description: "Liquids",
				run: "rly"
			}
		],
		singleWord: "CV\nV\nCVC\nCLV",
		wordInitial: "",
		wordMiddle: "",
		wordFinal: "",
		transforms: [
			{
				id: "0",
				search: "â",
				replace: "ai",
				description: ""
			},
			{
				id: "1",
				search: "ô",
				replace: "au",
				description: ""
			},
			{
				id: "2",
				search: "(%L)%L",
				replace: "$1",
				description: ""
			}
		]
	}],
	["Pseudo-English", {
		...basicSettings,
		characterGroups: [
			{
				label: "C",
				description: "Consonants",
				run: "tnsrdlSmTqwfgWypbCcvhPBkjxqz"
			},
			{
				label: "V",
				description: "Vowels",
				run: "eaoeaoiuOIiEAUuy"
			},
			{
				label: "P",
				description: "Plosives",
				run: "tpkc"
			},
			{
				label: "L",
				description: "Liquids",
				run: "rl"
			},
			{
				label: "N",
				description: "Nasals",
				run: "nmN"
			},
			{
				label: "F",
				description: "Post-nasal or -liquid Final Consonants",
				run: "TS"
			}
		],
		singleWord: "CV\nCVC\nVC\nV\nPLVC\nPLV",
		wordInitial: "CVC\nCV\nVC\nPLV\nsPLV\nV",
		wordMiddle: "CV\nCV\nCV\nVC\nV",
		wordFinal: "CV\nCVC\nCVLF\nCVNF\nCVgh\nVC\nV\nVgh",
		multipleSyllableTypes: true,
		transforms: [
			{
				id: "15",
				search: "([^g])h",
				replace: "$1k",
				description: "change non-initial h to k if not preceeded by a g"
			},
			{
				id: "0",
				search: "s*T+s*",
				replace: "th",
				description: ""
			},
			{
				id: "1",
				search: "s*S+s*",
				replace: "sh",
				description: ""
			},
			{
				id: "2",
				search: "C+",
				replace: "ch",
				description: ""
			},
			{
				id: "5",
				search: "[nm]*N+[nm]*",
				replace: "ng",
				description: ""
			},
			{
				id: "6",
				search: "w*W+(%V)",
				replace: "wh$1",
				description: "W-vowel becomes wh-vowel"
			},
			{
				id: "6.1",
				search: "[wW]+",
				replace: "w",
				description: "remaining Ws become w"
			},
			{
				id: "7",
				search: "(%V)ch",
				replace: "$1tch",
				description: "vowel-ch becomes vowel-tch"
			},
			{
				id: "8",
				search: "P+",
				replace: "ph",
				description: ""
			},
			{
				id: "9",
				search: "(%V)B(\\b|!%V)",
				replace: "$1ble$2",
				description: "vowel-ble-nonvowel"
			},
			{
				id: "9.1",
				search: "(%V)B",
				replace: "$1bl",
				description: "vowel-bl"
			},
			{
				id: "9.2",
				search: "B",
				replace: "",
				description: "eliminate remaining Bs"
			},
			{
				id: "10",
				search: "%V*O+%V*",
				replace: "oo",
				description: ""
			},
			{
				id: "11",
				search: "%V*U+%V*",
				replace: "ou",
				description: ""
			},
			{
				id: "12",
				search: "%V*I+%V*",
				replace: "oi",
				description: ""
			},
			{
				id: "13",
				search: "%V*A+%V*",
				replace: "au",
				description: ""
			},
			{
				id: "13.1",
				search: "%V*E+%V*",
				replace: "ei",
				description: ""
			},
			{
				id: "13.2",
				search: "([^c])ei",
				replace: "$1ie",
				description: "i before e except after c"
			},
			{
				id: "14",
				search: "([^aeiou])(o|au)\\b",
				replace: "$1ow",
				description: "change word-final o or au to ow"
			},
			{
				id: "14.1",
				search: "([^aeiou])(ou|ei)\\b",
				replace: "$1$2gh",
				description: "change word-final ou to ough, ei to eigh"
			},
			{
				id: "16",
				search: "y+",
				replace: "y",
				description: "eliminate duplicate ys"
			},
			{
				id: "17",
				search: "(\\b|[^aeiou])tl",
				replace: "$1t",
				description: "reduce tl cluster to t after non-vowel"
			},
			{
				id: "17.1",
				search: "tl(\\b|%C)",
				replace: "t$1",
				description: "reduce tl cluster to t before consonant or word-end"
			},
			{
				id: "18",
				search: "(.)\\1{2,}",
				replace: "$1$1",
				description: "reduce triple-letter clusters to two"
			},
			{
				id: "18.1",
				search: "[aeiou]*([aeiou])[aeiou]*\\1[aeiou]*",
				replace: "$1$1",
				description: "reduce multiple vowels in a row, where any two vowels match, to the matching vowels"
			},
			{
				id: "3",
				search: "q+",
				replace: "qu",
				description: "q is always followed by u"
			},
			{
				id: "4",
				search: "qu\\b",
				replace: "que",
				description: "qu at word-end becomes que"
			},
			{
				id: "4.1",
				search: "qu([aeiou])[aeiou]+",
				replace: "qu$1",
				description: "eliminate triple+ vowels after q"
			},
			{
				id: "19",
				search: "c\\b",
				replace: "ck",
				description: "word-final c becomes ck"
			},
			{
				id: "20",
				search: "([aiu])\\1",
				replace: "$1",
				description: "change double a/i/u to single"
			},
			{
				id: "21",
				search: "m[kt]\\b",
				replace: "mp",
				description: "word-final mk or mt becomes mp"
			},
			{
				id: "21.1",
				search: "n[kp]\\b",
				replace: "nt",
				description: "word-final nk or np becomes nt"
			},
			{
				id: "21.2",
				search: "ng[kt]",
				replace: "nk",
				description: "ngk and ngt become nk"
			}
		],
		maxSyllablesPerWord: 5
	}],
	["Complex", {
		...basicSettings,
		characterGroups: [
			{
				label: "C",
				description: "Consonants",
				run: "kstSplrLnstmTNfh"
			},
			{
				label: "S",
				description: "Initial consonants",
				run: "tspkThfS"
			},
			{
				label: "V",
				description: "Vowels",
				run: "aoiueAOUE"
			},
			{
				label: "I",
				description: "Mid-word vowels",
				run: "aoueAOUE"
			},
			{
				label: "E",
				description: "Word-ending consonants",
				run: "sfSnmNktpTh"
			},
			{
				label: "J",
				description: "Word-final conjugation",
				run: "1234567890!@#-&=_;:~",
				dropoff: 0
			}
		],
		singleWord: "SV\nSVEJ\nSV\nSV",
		wordInitial: "SV\nV\nSVC",
		wordMiddle: "SV\nI\nCV\nSVC",
		wordFinal: "I\nVEJ\nV\nVEJ\nSVEJ\nV\nCV\nVEJ\nCVEJ",
		multipleSyllableTypes: true,
		transforms: [
			{
				id: "50.1",
				search: "1",
				replace: "e",
				description: "conjugation: 1s"
			},
			{
				id: "50.2.1",
				search: "([mfpkh])2|([hk])3",
				replace: "$1$2a",
				description: "conjugation: 2s/3s.AN"
			},
			{
				id: "50.2.2",
				search: "([nts])2|([mfp])3",
				replace: "$1$2i",
				description: "conjugation: 2s/3s.AN"
			},
			{
				id: "50.2.3",
				search: "([NTS])2",
				replace: "$1u",
				description: "conjugation: 2s"
			},
			{
				id: "50.3",
				search: "([nstNTS])3",
				replace: "$1o",
				description: "conjugation: 3s.AN"
			},
			{
				id: "50.4.1",
				search: "([mfp])4",
				replace: "$1a$1e",
				description: "conjugation: 2s.FORM"
			},
			{
				id: "50.4.2",
				search: "([nst])4",
				replace: "$1i$1eĭ",
				description: "conjugation: 2s.FORM"
			},
			{
				id: "50.4.3",
				search: "([NTS])4",
				replace: "$1u$1eĭ",
				description: "conjugation: 2s.FORM"
			},
			{
				id: "50.4.4",
				search: "([hk])4",
				replace: "$1ate",
				description: "conjugation: 2s.FORM"
			},
			{
				id: "50.5.1",
				search: "([mfp])5",
				replace: "$1o$1o",
				description: "conjugation: 3s.INAN"
			},
			{
				id: "50.5.2",
				search: "([nstNST])5",
				replace: "$1aa",
				description: "conjugation: 3s.INAN"
			},
			{
				id: "50.5.3",
				search: "([hk])5",
				replace: "$1iki",
				description: "conjugation: 3s.INAN"
			},
			{
				id: "50.6.1",
				search: "([mfp])6",
				replace: "$1eo",
				description: "conjugation: 1.DU.IN"
			},
			{
				id: "50.6.2",
				search: "([nst])6",
				replace: "$1io",
				description: "conjugation: 1.DU.IN"
			},
			{
				id: "50.6.3",
				search: "([NTS])6",
				replace: "$1ua",
				description: "conjugation: 1.DU.IN"
			},
			{
				id: "50.6.4",
				search: "([hk])6",
				replace: "$1ee",
				description: "conjugation: 1.DU.IN"
			},
			{
				id: "50.7.1",
				search: "([mfp])7",
				replace: "$1uo",
				description: "conjugation: 1.DU.EX"
			},
			{
				id: "50.7.2",
				search: "([nstNST])7",
				replace: "$1u",
				description: "conjugation: 1.DU.EX"
			},
			{
				id: "50.7.3",
				search: "([kh])7",
				replace: "$1eo",
				description: "conjugation: 1.DU.EX"
			},
			{
				id: "50.8.1",
				search: "([mfp])8|([NST])0",
				replace: "$1$2eĭ",
				description: "conjugation: 1.PAU.IN/1p.IN"
			},
			{
				id: "50.8.2",
				search: "([nst])8",
				replace: "$1u$1u",
				description: "conjugation: 1.PAU.IN"
			},
			{
				id: "50.8.3",
				search: "([NTS])8",
				replace: "$1a$1a",
				description: "conjugation: 1.PAU.IN"
			},
			{
				id: "50.8.4",
				search: "([hk])8|([nst])9|([mfp])0",
				replace: "$1$2$3aĭ",
				description: "conjugation: 1.PAU.IN/1.PAU.EX/1p.IN"
			},
			{
				id: "50.9.1",
				search: "([mfp])9",
				replace: "$1ae",
				description: "conjugation: 1.PAU.EX"
			},
			{
				id: "50.9.2",
				search: "([NTS])9|([nst])0",
				replace: "$1$2oĭ",
				description: "conjugation: 1.PAU.EX/1p.IN"
			},
			{
				id: "50.9.3",
				search: "([hk])[9!]",
				replace: "$1oe",
				description: "conjugation: 1.PAU.EX/1p.EX"
			},
			{
				id: "50.10",
				search: "([hk])0",
				replace: "$1uu",
				description: "conjugation: 1p.IN"
			},
			{
				id: "50.11.1",
				search: "([fmp])!",
				replace: "$1ou",
				description: "conjugation: 1p.EX"
			},
			{
				id: "50.11.2",
				search: "([nst])!",
				replace: "$1uaĭ",
				description: "conjugation: 1p.EX"
			},
			{
				id: "50.11.3",
				search: "([NST])!",
				replace: "$1uoĭ",
				description: "conjugation: 1p.EX"
			},
			{
				id: "50.12.1",
				search: "([fmphk])@",
				replace: "$1ara",
				description: "conjugation: 2.PAU"
			},
			{
				id: "50.12.2",
				search: "([nst])@",
				replace: "$1aro",
				description: "conjugation: 2.PAU"
			},
			{
				id: "50.12.3",
				search: "([NST])@",
				replace: "$1uro",
				description: "conjugation: 2.PAU"
			},
			{
				id: "50.13.1",
				search: "([fmpnsthk])#",
				replace: "$1areĭ",
				description: "conjugation: 2.PAU.FORM"
			},
			{
				id: "50.13.2",
				search: "([NST])#",
				replace: "$1ureĭ",
				description: "conjugation: 2.PAU.FORM"
			},
			{
				id: "50.14.1",
				search: "([fmphk])-",
				replace: "$1ala",
				description: "conjugation: 2p"
			},
			{
				id: "50.14.2",
				search: "([nst])-",
				replace: "$1alo",
				description: "conjugation: 2p"
			},
			{
				id: "50.14.3",
				search: "([NST])-",
				replace: "$1uLo",
				description: "conjugation: 2p"
			},
			{
				id: "50.15.1",
				search: "([fmpnsthk])&",
				replace: "$1aleĭ",
				description: "conjugation: 2p.FORM"
			},
			{
				id: "50.15.2",
				search: "([NST])&",
				replace: "$1uleĭ",
				description: "conjugation: 2p.FORM"
			},
			{
				id: "50.16.1",
				search: "([fmp])=",
				replace: "$1iro",
				description: "conjugation: 3.PAU.AN"
			},
			{
				id: "50.16.2",
				search: "([nstNST])=",
				replace: "$1ore",
				description: "conjugation: 3.PAU.AN"
			},
			{
				id: "50.16.3",
				search: "([hk])=",
				replace: "$1aro",
				description: "conjugation: 3.PAU.AN"
			},
			{
				id: "50.17.1",
				search: "([mfp])_",
				replace: "$1ilo",
				description: "conjugation: 3p.AN"
			},
			{
				id: "50.17.2",
				search: "([nst])_",
				replace: "$1ole",
				description: "conjugation: 3p.AN"
			},
			{
				id: "50.17.3",
				search: "([NTS])_",
				replace: "$1oLe",
				description: "conjugation: 3p.AN"
			},
			{
				id: "50.17.4",
				search: "([hk])_",
				replace: "$1alo",
				description: "conjugation: 3p.AN"
			},
			{
				id: "50.18.1",
				search: "([mfp]);",
				replace: "$1oro",
				description: "conjugation: 3.PAU.INAN"
			},
			{
				id: "50.18.2",
				search: "([nstNST]);",
				replace: "$1ara",
				description: "conjugation: 3.PAU.INAN"
			},
			{
				id: "50.18.3",
				search: "([kh]);",
				replace: "$1iri",
				description: "conjugation: 3.PAU.INAN"
			},
			{
				id: "50.19.1",
				search: "([mfp]):",
				replace: "$1olo",
				description: "conjugation: 3p.INAN"
			},
			{
				id: "50.19.2",
				search: "([nst]):",
				replace: "$1ala",
				description: "conjugation: 3p.INAN"
			},
			{
				id: "50.19.3",
				search: "([NTS]):",
				replace: "$1aLa",
				description: "conjugation: 3p.INAN"
			},
			{
				id: "50.19.4",
				search: "([hk]):",
				replace: "$1ili",
				description: "conjugation: 3p.INAN"
			},
			{
				id: "50.20.1",
				search: "([mfphk])~",
				replace: "$1aĭa",
				description: "conjugation: GER"
			},
			{
				id: "50.20.2",
				search: "([nstNST])~",
				replace: "$1oĭa",
				description: "conjugation: GER"
			},
			{
				id: "0",
				search: "([aeiou])\\1{2,}",
				replace: "$1$1",
				description: "change triple-vowels to double vowels"
			},
			{
				id: "1",
				search: "([AEOU])\\1+",
				replace: "$1",
				description: "change double-dipthongs to single"
			},
			{
				id: "2",
				search: "(%V{2})%V+",
				replace: "$1",
				description: "eliminate third vowel in a row"
			},
			{
				id: "3",
				search: "h+",
				replace: "h",
				description: "reduce multiple h to single"
			},
			{
				id: "4",
				search: "h(?=%V(%E|%C{0,2}%V)\\b)",
				replace: "H",
				description: "save h before stressed syllable"
			},
			{
				id: "5",
				search: "(%V)h(?=%V\\b)",
				replace: "$1H",
				description: "save h before stressed syllable"
			},
			{
				id: "6",
				search: "\\bh",
				replace: "H",
				description: "save word-initial h"
			},
			{
				id: "7",
				search: "h\\b",
				replace: "H",
				description: "save word-final h"
			},
			{
				id: "8",
				search: "h",
				replace: "",
				description: "eliminate all other h"
			},
			{
				id: "9",
				search: "H",
				replace: "h",
				description: "restore saved h"
			},
			{
				id: "9.1",
				search: "kh",
				replace: "k",
				description: "reduce kh to k"
			},
			{
				id: "10",
				search: "A",
				replace: "aĭ",
				description: "dipthong"
			},
			{
				id: "11",
				search: "O",
				replace: "oĭ",
				description: "dipthong"
			},
			{
				id: "12",
				search: "U",
				replace: "uĭ",
				description: "dipthong"
			},
			{
				id: "13",
				search: "E",
				replace: "eĭ",
				description: "dipthong"
			},
			{
				id: "14",
				search: "ĭi",
				replace: "i",
				description: "eliminate dipthong before i"
			},
			{
				id: "15",
				search: "ĭT",
				replace: "ĭt",
				description: "de-retroflex t after a dipthong"
			},
			{
				id: "16",
				search: "ĭS",
				replace: "ĭs",
				description: "de-retroflex s after a dipthong"
			},
			{
				id: "17",
				search: "ĭL",
				replace: "ĭl",
				description: "de-retroflex l after a dipthong"
			},
			{
				id: "18",
				search: "ĭN",
				replace: "ĭn",
				description: "de-retroflex n after a dipthong"
			},
			{
				id: "19",
				search: "(.\\B[aeou])i",
				replace: "$1ĭ",
				description: "change certain non-word-initial vowel-i pairs to dipthongs"
			},
			{
				id: "20",
				search: "(%C)\\1",
				replace: "$1",
				description: "reduce double consonants to one"
			},
			{
				id: "21",
				search: "[tkpT]r",
				replace: "r",
				description: "remove plosive before an r"
			},
			{
				id: "22",
				search: "n[pTk]",
				replace: "nt",
				description: "change n-plosive to nt"
			},
			{
				id: "23",
				search: "m[tTk]",
				replace: "mp",
				description: "change m-plosive to mp"
			},
			{
				id: "24",
				search: "N[ptk]",
				replace: "NT",
				description: "retroflex plosive after retroflex n"
			},
			{
				id: "25",
				search: "k[nmN]",
				replace: "k",
				description: "remove nasal after k"
			},
			{
				id: "26",
				search: "p[nN]",
				replace: "pm",
				description: "change p-nasal to pm"
			},
			{
				id: "27",
				search: "t[mN]",
				replace: "tn",
				description: "change t-nasal to tn"
			},
			{
				id: "28",
				search: "T[nm]",
				replace: "TN",
				description: "make post-retroflex t nasal retroflex n"
			},
			{
				id: "29",
				search: "p[sSh]",
				replace: "pf",
				description: "change p-fricative to pf"
			},
			{
				id: "30",
				search: "t[fSh]",
				replace: "ts",
				description: "change t-fricative to ts"
			},
			{
				id: "31",
				search: "T[fsh]",
				replace: "TS",
				description: "change post-retroflex t fricative to retroflex s"
			},
			{
				id: "32",
				search: "k[fsS]",
				replace: "kh",
				description: "change k-fricative to kh"
			},
			{
				id: "33",
				search: "f[sSh]",
				replace: "fp",
				description: "change f-fricative to fp"
			},
			{
				id: "34",
				search: "s[fSh]",
				replace: "st",
				description: "change s-fricative to st"
			},
			{
				id: "35",
				search: "S[fsh]",
				replace: "ST",
				description: "change post-retroflex s fricative to retroflex t"
			},
			{
				id: "36",
				search: "h[fsS]",
				replace: "hk",
				description: "change h-fricative to hk"
			},
			{
				id: "37",
				search: "ft",
				replace: "fp",
				description: "change ft to fp"
			},
			{
				id: "38",
				search: "sT",
				replace: "st",
				description: "de-retroflex t after s"
			},
			{
				id: "39",
				search: "St",
				replace: "ST",
				description: "make t after retroflex s into retroflex t"
			},
			{
				id: "40",
				search: "([TSLN])[tsln]",
				replace: "$1",
				description: "eliminate non-retroflex consonant after retroflex consonants"
			},
			{
				id: "41",
				search: "([tsln])[TSLN]",
				replace: "$1",
				description: "eliminate retroflex consonant after non-retroflex consonant"
			},
			{
				id: "42",
				search: "NT",
				replace: "nT",
				description: "de-retroflex n before retroflex t"
			},
			{
				id: "43",
				search: "TN",
				replace: "tN",
				description: "de-retroflex t before retroflex n"
			},
			{
				id: "44",
				search: "ST",
				replace: "sT",
				description: "de-retroflex s before retroflex t"
			},
			{
				id: "45",
				search: "TS",
				replace: "tS",
				description: "de-retroflex t before retroflex s"
			},
			{
				id: "46",
				search: "T",
				replace: "ʈ",
				description: "mark retroflex t"
			},
			{
				id: "47",
				search: "L",
				replace: "ɭ",
				description: "mark retroflex l"
			},
			{
				id: "48",
				search: "S",
				replace: "ʂ",
				description: "mark retroflex s"
			},
			{
				id: "49",
				search: "N",
				replace: "ɳ",
				description: "mark retroflex n"
			}
		],
		monosyllablesRate: 12,
		maxSyllablesPerWord: 8,
		capitalizeSentences: false,
		declarativeSentencePre: ".",
		interrogativeSentencePre: "<",
		interrogativeSentencePost: ">",
		exclamatorySentencePre: "[",
		exclamatorySentencePost: "]"
	}]
];
