import PresetsModal from '../../components/PresetsModal';

const WEPresetsModal = ({
	modalOpen,
	setModalOpen,
	triggerResets,
	loadState
}) => <PresetsModal
	modalOpen={modalOpen}
	setModalOpen={setModalOpen}
	triggerResets={triggerResets}
	presetsInfo={wePresets}
	loadState={loadState}
	overwriteText="all character groups, transforms, and sound changes"
/>;

export default WEPresetsModal;

const wePresets = [
	["Grassmann's Law", {
		characterGroups: [],
		soundChanges: [
			{
				id: "1",
				beginning: "([ptk])ʰ",
				ending: "$1",
				context: "_[aeiou]+[ptk]ʰ"
			}
		],
		transforms: []
	}],
	["Ruki Rule", {
		characterGroups: [],
		soundChanges: [
			{
				id: "1",
				beginning: "s+",
				ending: "š",
				context: "(?:gʰ|i̯|u̯|[rkgwyiu])_"
			}
		],
		transforms: []
	}],
	["Dahl's Law", {
		characterGroups: [
			{
				label: "U",
				run: "ptk",
				description: "Unvoiced Consonants"
			},
			{
				label: "C",
				run: "bdg",
				description: "Voiced Consonants"
			},
			{
				label: "V",
				run: "aeiou",
				description: "Vowels"
			}
		],
		soundChanges: [
			{
				id: "1",
				beginning: "%U",
				ending: "%C",
				context: "_%V+%U",
				exception: "%C%V+_"
			}
		],
		transforms: []
	}],
	["Ingvaeonic Nasal Spirant Law", {
		characterGroups: [
			{
				label: "V",
				run: "aeiou",
				description: "Vowels"
			},
			{
				label: "N",
				run: "oeiou",
				description: "New Vowels"
			}
		],
		soundChanges: [
			{
				id: "1",
				beginning: "%Vn",
				ending: "%N",
				context: "_(th|s)"
			},
			{
				id: "1.1",
				beginning: "%Vmf",
				ending: "%Nf",
				context: "_"
			}
		],
		transforms: []
	}],
	["Grim's Law", {
		characterGroups: [],
		soundChanges: [
			{
				id: "1",
				beginning: "b",
				ending: "f",
				context: "_"
			},
			{
				id: "2",
				beginning: "d",
				ending: "th",
				context: "_"
			},
			{
				id: "3",
				beginning: "g",
				ending: "h",
				context: "_"
			},
			{
				id: "4",
				beginning: "gw",
				ending: "wh",
				context: "_"
			}
		],
		transforms: []
	}],
	["Great English Vowel Shift", {
		characterGroups: [
			{
				label: "V",
				run: "aeɛiouɔ",
				description: "Vowels"
			},
			{
				label: "N",
				run: "EiiAuUO",
				description: "New Vowels"
			}
		],
		soundChanges: [
			{
				id: "1",
				beginning: "%V",
				ending: "%N",
				context: "_"
			}
		],
		transforms: [
			{
				id: "1",
				search: "E",
				replace: "eɪ",
				direction: "output"
			},
			{
				id: "2",
				search: "A",
				replace: "aɪ",
				direction: "output"
			},
			{
				id: "3",
				search: "U",
				replace: "aʊ",
				direction: "output"
			},
			{
				id: "4",
				search: "O",
				replace: "oʊ",
				direction: "output"
			}
		]
	}],
	["High German Consonant Shift", {
		characterGroups: [
			{
				label: "V",
				run: "aeiouäöü",
				description: "Vowels"
			}
		],
		soundChanges: [
			{
				id: "1",
				beginning: "p",
				ending: "f",
				context: "_#"
			},
			{
				id: "1.1",
				beginning: "p",
				ending: "ff",
				context: "%V_%V"
			},
			{
				id: "1.2",
				beginning: "pp",
				ending: "pf",
				context: "_"
			},
			{
				id: "1.3",
				beginning: "p",
				ending: "pf",
				context: "[lrnm]_"
			},
			{
				id: "1.4",
				beginning: "p",
				ending: "pf",
				context: "#_",
				exception: "_f"
			},
			{
				id: "2",
				beginning: "t",
				ending: "z",
				context: "_#"
			},
			{
				id: "2.1",
				beginning: "t",
				ending: "zz",
				context: "%V_%V"
			},
			{
				id: "2.2",
				beginning: "tt",
				ending: "ts",
				context: "_"
			},
			{
				id: "2.3",
				beginning: "t",
				ending: "ts",
				context: "[lrnm]_"
			},
			{
				id: "2.4",
				beginning: "t",
				ending: "ts",
				context: "#_",
				exception: "_s"
			},
			{
				id: "3",
				beginning: "k",
				ending: "x",
				context: "_#"
			},
			{
				id: "3.1",
				beginning: "k",
				ending: "xx",
				context: "%V_%V"
			},
			{
				id: "3.2",
				beginning: "kk",
				ending: "kx",
				context: "_"
			},
			{
				id: "3.3",
				beginning: "k",
				ending: "kx",
				context: "[lrnm]_"
			},
			{
				id: "3.4",
				beginning: "k",
				ending: "kx",
				context: "#_",
				exception: "_x"
			},
			{
				id: "4",
				beginning: "d",
				ending: "t",
				context: "_"
			},
			{
				id: "5",
				beginning: "th",
				ending: "t",
				context: "_#"
			},
			{
				id: "5.1",
				beginning: "th",
				ending: "d",
				context: "_"
			},
			{
				id: "6",
				beginning: "sk",
				ending: "sh",
				context: "_"
			},
			{
				id: "6.1",
				beginning: "s",
				ending: "sh",
				context: "#_",
				exception: "_%V"
			}
		],
		transforms: []
	}]
];
