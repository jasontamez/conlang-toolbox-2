import { useSelector } from "react-redux";
import { useCallback } from "react";

import {
	setBool,
	setNum,
	setText
} from '../../store/morphoSyntaxSlice';

const getSection = (id) => {
	const {
		BOOL_prefixMost,
		BOOL_prefixLess,
		BOOL_suffixMost,
		BOOL_suffixLess,
		BOOL_circumfixMost,
		BOOL_circumfixLess,
		BOOL_infixMost,
		BOOL_infixLess,
		BOOL_actions,
		BOOL_actionProcesses,
		BOOL_weather,
		BOOL_states,
		BOOL_involuntaryProcesses,
		BOOL_bodyFunctions,
		BOOL_motion,
		BOOL_position,
		BOOL_factive,
		BOOL_cognition,
		BOOL_sensation,
		BOOL_emotion,
		BOOL_utterance,
		BOOL_manipulation,
		BOOL_otherVerbClass,
		BOOL_lexVerb,
		BOOL_lexNoun,
		BOOL_lexVN,
		BOOL_lexVorN,
		BOOL_adjectives,
		BOOL_baseFive,
		BOOL_baseTen,
		BOOL_baseTwenty,
		BOOL_baseOther,
		BOOL_numGL,
		BOOL_numLG,
		BOOL_numNone,
		BOOL_multiNumSets,
		BOOL_inflectNum,
		BOOL_APV,
		BOOL_AVP,
		BOOL_VAP,
		BOOL_VPA,
		BOOL_PAV,
		BOOL_PVA,
		BOOL_preP,
		BOOL_postP,
		BOOL_circumP,
		BOOL_numSing,
		BOOL_numDual,
		BOOL_numTrial,
		BOOL_numPaucal,
		BOOL_numPlural,
		BOOL_classGen,
		BOOL_classAnim,
		BOOL_classShape,
		BOOL_classFunction,
		BOOL_classOther,
		BOOL_dimAugYes,
		BOOL_dimAugObligatory,
		BOOL_dimAugProductive,
		BOOL_nomAcc,
		BOOL_ergAbs,
		BOOL_markInv,
		BOOL_markDirInv,
		BOOL_verbAgreeInv,
		BOOL_wordOrderChange,
		BOOL_tenseMorph,
		BOOL_aspectMorph,
		BOOL_modeMorph,
		BOOL_otherMorph,
		BOOL_chainFirst,
		BOOL_chainLast,
		BOOL_chainN,
		BOOL_chainV,
		BOOL_chainCj,
		BOOL_chainT,
		BOOL_chainA,
		BOOL_chainPer,
		BOOL_chainNum,
		BOOL_chainOther,
		BOOL_relPre,
		BOOL_relPost,
		BOOL_relInternal,
		BOOL_relHeadless,
		BOOL_coordMid,
		BOOL_coordTwo,
		BOOL_coordLast,

		NUM_synthesis,
		NUM_fusion,
		NUM_stemMod,
		NUM_suppletion,
		NUM_redupe,
		NUM_supraMod,
		NUM_headDepMarked,

		TEXT_tradTypol,
		TEXT_morphProcess,
		TEXT_headDepMark,
		TEXT_propNames,
		TEXT_possessable,
		TEXT_countMass,
		TEXT_pronounAnaphClitic,
		TEXT_semanticRole,
		TEXT_verbClass,
		TEXT_verbStructure,
		TEXT_propClass,
		TEXT_quantifier,
		TEXT_numeral,
		TEXT_adverb,
		TEXT_mainClause,
		TEXT_verbPhrase,
		TEXT_nounPhrase,
		TEXT_adPhrase,
		TEXT_compare,
		TEXT_questions,
		TEXT_COType,
		TEXT_compounding,
		TEXT_denoms,
		TEXT_nNumberOpt,
		TEXT_nNumberObl,
		TEXT_nCase,
		TEXT_articles,
		TEXT_demonstratives,
		TEXT_possessors,
		TEXT_classGender,
		TEXT_dimAug,
		TEXT_predNom,
		TEXT_predLoc,
		TEXT_predEx,
		TEXT_ergative,
		TEXT_causation,
		TEXT_applicatives,
		TEXT_dativeShifts,
		TEXT_datOfInt,
		TEXT_possessRaising,
		TEXT_refls,
		TEXT_recips,
		TEXT_passives,
		TEXT_inverses,
		TEXT_middleCon,
		TEXT_antiP,
		TEXT_objDemOmInc,
		TEXT_verbNoms,
		TEXT_verbComp,
		TEXT_tense,
		TEXT_aspect,
		TEXT_mode,
		TEXT_locDirect,
		TEXT_evidence,
		TEXT_miscVerbFunc,
		TEXT_pragFocusEtc,
		TEXT_negation,
		TEXT_declaratives,
		TEXT_YNQs,
		TEXT_QWQs,
		TEXT_imperatives,
		TEXT_serialVerbs,
		TEXT_complClauses,
		TEXT_advClauses,
		TEXT_clauseChainEtc,
		TEXT_relClauses,
		TEXT_coords
	} = useSelector(state => state.morphoSyntax);
	const sections = {
		"s01": [
			{
				tag: "Header",
				level: 1,
				content: "1. Morphological Typology"
			},
			{
				tag: "Header",
				level: 2,
				content: "1.1. Traditional Typology"
			},
			{
				tag: "Modal",
				id: "SynthesisandFusion",
				title: "Synthesis and Fusion",
				label: "The Basic Building Blocks of Words",
				content: [
					"Languages can be broadly classified on two continuums based on their **morphemes**.",
					[
						"A morpheme is the most basic unit of meaning in a language. For example, the word \"cats\" has two morphemes: \"cat\" (a feline animal) and \"s\" (more than one of them are being talked about)."
					],
					true,
					"**Synthesis** is a measure of how many morphemes appear in a word.",
					[
						"Chinese is very //isolating//, tending towards one morpheme per word.",
						"Inuit and Quechua are very //polysynthetic//, with many morphemes per word."
					],
					true,
					"**Fusion** is a measure of how many meanings a single morpheme can encode.",
					[
						"Completely isolating languages, by definition, always lack fusion.",
						"Spanish can be very //fusional//, with a single suffix capable of encoding tense (8.3.1), aspect (8.3.2), mood (8.3.3) and number (4.3).",
						"Though fusional forms are possible (e.g. swam, was), English is mostly //agglutinative//, with one meaning per morpheme.",
						[
							"e.g. \"antidisestablishmentarianism\"",
							{
								tabular: true,
								rows: [
									[
										"anti",
										"dis",
										"establish",
										"ment",
										"ary",
										"an",
										"ism"
									],
									[
										"against",
										"undo",
										"establish",
										"instance of verb",
										"of or like the noun",
										"person",
										"belief system"
									]
								]
							},
							"(The \"establishment\" in question is actually contextually fusional, as it refers to the Church of England receiving government patronage, so the full meaning of the word is \"the belief system of opposing the people who want to remove the government patronage of the Church of England.\")"
						]
					]
				]
			},
			{
				tag: "Header",
				level: 3,
				content: "Synthesis"
			},
			{
				tag: "Range",
				prop: NUM_synthesis,
				setProp: useCallback((value) => setNum({prop: "synthesis", value}), [setNum]),
				start: "I\u00ADso\u00ADla\u00ADting",
				end: "Po\u00ADly\u00ADsyn\u00ADthe\u00ADtic",
				label: "Degree of synthesis, from Isolating to Polysynthetic",
				notFilled: true,
				uncapped: true,
				max: 10
			},
			{
				tag: "Header",
				level: 3,
				content: "Fusion"
			},
			{
				tag: "Range",
				prop: NUM_fusion,
				setProp: useCallback((value) => setNum({prop: "fusion", value}), [setNum]),
				start: "Ag\u00ADglu\u00ADtin\u00ADa\u00ADtive",
				end: "Fu\u00ADsion\u00ADal",
				label: "Degree of fusion, from Agglutinative to Fusional",
				notFilled: true,
				uncapped: true,
				max: 10
			},
			{
				tag: "Text",
				prop: TEXT_tradTypol,
				setProp: useCallback((value) => setText({prop: "tradTypol", value}), [setText]),
				content: "Give examples of the dominant pattern and any secondary patterns."
			},
			{
				tag: "Header",
				level: 2,
				content: "1.2 Morphological Processes"
			},
			{
				tag: "Modal",
				id: "AffixesandOtherModifications",
				title: "Affixes and Other Modifications",
				label: "Read About Them",
				content: [
					"**Affixes**:",
					[
						"Completely fusional languages will usually lack affixes.",
						"Most natural languages use suffixes. Some also have prefixes and/or infixes or circumfixes. Few only use prefixes, and none have only infixes or circumfixes.",
						"NOTE: this section is not needed if the language is not agglutinative at all."
					],
					true,
					"**Stem Modification**:",
					[
						"e.g. swim/swam/swum."
					],
					true,
					"**Suppletion**:",
					[
						"An entirely new stem is substituted for the root, e.g. \"be\" being replaced by is/am/are/was/were."
					],
					true,
					"**Reduplication**:",
					[
						"Part or all of a word is duplicated.",
						"Often used for plurality."
					],
					true,
					"**Suprasegmental Modification**:",
					[
						"Words can change stress when in different roles.",
						[
							"e.g. \"permit\" has different stress when used as a noun or as a verb."
						],
						"Tone changes also fall under this category."
					]
				]
			},
			{
				tag: "Header",
				level: 3,
				content: "Affixes"
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_prefixMost,
					BOOL_prefixLess,
					BOOL_suffixMost,
					BOOL_suffixLess,
					BOOL_circumfixMost,
					BOOL_circumfixLess,
					BOOL_infixMost,
					BOOL_infixLess
				],
				setters: [
					useCallback((value) => setBool({prop: "prefixMost", value}), [setBool]),
					useCallback((value) => setBool({prop: "prefixLess", value}), [setBool]),
					useCallback((value) => setBool({prop: "suffixMost", value}), [setBool]),
					useCallback((value) => setBool({prop: "suffixLess", value}), [setBool]),
					useCallback((value) => setBool({prop: "circumfixMost", value}), [setBool]),
					useCallback((value) => setBool({prop: "circumfixLess", value}), [setBool]),
					useCallback((value) => setBool({prop: "infixMost", value}), [setBool]),
					useCallback((value) => setBool({prop: "infixLess", value}), [setBool])
				],
				display: {
					multiBoxes: 2,
					centering: [true, true, false],
					accessibilityLabels: [
						"The prefix is used Most",
						"The prefix is used Less",
						"The suffix is used Most",
						"The suffix is used Less",
						"The circumfix is used Most",
						"The circumfix is used Less",
						"The infix is used Most",
						"The infix is used Less"
					],
					inlineHeaders: [
						"Used Most",
						"Used Less",
						"Af\u00ADfix"
					],
					rowDescriptions: [
						"Pre\u00ADfix",
						"Suf\u00ADfix",
						"Cir\u00ADcum\u00ADfix",
						"In\u00ADfix"
					],
					export: {
						title: "Affixes",
						output: [
							["Used Most: ", [
								["prefixMost", "Prefixes"],
								["suffixMost", "Suffixes"],
								["circumfixMost", "Circumfixes"],
								["infixMost", "Infixes"]
							], "."],
							["Used Less: ", [
								["prefixLess", "Prefixes"],
								["suffixLess", "Suffixes"],
								["circumfixLess", "Circumfixes"],
								["infixLess", "Infixes"]
							], "."]
						]
					}
				}
			},
			{
				tag: "Header",
				level: 3,
				content: "Stem Modification"
			},
			{
				tag: "Range",
				prop: NUM_stemMod,
				setProp: useCallback((value) => setNum({prop: "stemMod", value}), [setNum]),
				label: "How often stem modification is used",
				start: "Not Used",
				end: "Used Often"
			},
			{
				tag: "Header",
				level: 3,
				content: "Suppletion"
			},
			{
				tag: "Range",
				prop: NUM_suppletion,
				setProp: useCallback((value) => setNum({prop: "suppletion", value}), [setNum]),
				label: "How often suppletion is used",
				start: "Not Used",
				end: "Used Often"
			},
			{
				tag: "Header",
				level: 3,
				content: "Reduplication"
			},
			{
				tag: "Range",
				prop: NUM_redupe,
				setProp: useCallback((value) => setNum({prop: "redupe", value}), [setNum]),
				label: "How often reduplication is used",
				start: "Not Used",
				end: "Used Often"
			},
			{
				tag: "Header",
				level: 3,
				content: "Suprasegmental Modification"
			},
			{
				tag: "Range",
				prop: NUM_supraMod,
				setProp: useCallback((value) => setNum({prop: "supraMod", value}), [setNum]),
				label: "How often suprasegmental modification is used",
				start: "Not Used",
				end: "Used Often"
			},
			{
				tag: "Text",
				prop: TEXT_morphProcess,
				setProp: useCallback((value) => setText({prop: "morphProcess", value}), [setText]),
				rows: 6,
				content: "What sort of morphological processes are used? Which are primary and which are used less?"
			},
			{
				tag: "Header",
				level: 2,
				content: "1.3. Head/Dependant Marking"
			},
				{
				tag: "Range",
				prop: NUM_headDepMarked,
				setProp: useCallback((value) => setNum({prop: "headDepMarked", value}), [setNum]),
				start: "Head Marked",
				end: "De\u00ADpen\u00ADdant Marked",
				label: "Degree of marking, from totally head-marked to totally dependant-marked",
				notFilled: true,
				max: 4,
				uncapped: true
			},
			{
				tag: "Modal",
				id: "HeadDependantMarking",
				title: "Head/Dependant Marking",
				content: [
					"The **Head** of a phrase is the element that determines the syntactic function of the whole phrase.",
					[
						"Example sentence: //\"The smallest dog ate a porkchop with Mark's approval.\"//",
						[
							"\"dog\" is Head of \"the smallest dog\" (noun phrase)",
							"\"porkchop\" is Head of \"a porkchop\" (noun phrase)",
							"\"with\" is Head of \"with Mark's approval\" (prepositional phrase)",
							"\"approval\" is Head of \"Mark's approval\" (noun phrase)"
						]
					],
					"English is predominantly dependant-marked (\"the queen's crown\").",
					"Most languages are head-marked (\"the queen crown's\").",
					"Some are mixed, but use only one pattern for certain types of phrases (e.g. head-marked for noun phrases, but dependant-marked for verb and adpositional phrases)."
				]
			},
			{
				tag: "Text",
				prop: TEXT_headDepMark,
				setProp: useCallback((value) => setText({prop: "headDepMark", value}), [setText]),
				content: "Describe when the head/dependant marking system changes, if needed."
			}
		],
		"s02": [
			{
				tag: "Header",
				level: 1,
				content: "2. Grammatical Categories"
			},
			{
				tag: "Header",
				level: 2,
				content: "2.1. Nouns (the most time-stable concepts)"
			},
			{
				tag: "Header",
				level: 3,
				content: "2.1.1. Types of Nouns"
			},
			{
				tag: "Header",
				level: 4,
				content: "2.1.1.1. Proper Names"
			},
			{
				tag: "Modal",
				id: "ProperNames",
				title: "Proper Names",
				label: "Read About Them",
				content: [
					"In English, they do not easily take articles, quantifiers and other modifiers.",
					"Other languages may have special case markers (4.4) for them."
				]
			},
			{
				tag: "Text",
				prop: TEXT_propNames,
				setProp: useCallback((value) => setText({prop: "propNames", value}), [setText]),
				content: "Are there any special rules involving proper names?"
			},
			{
				tag: "Header",
				level: 4,
				content: "2.1.1.2. Possessability"
			},
			{
				tag: "Modal",
				id: "Possessability",
				title: "Possessability",
				label: "Systems of Possession",
				content: [
					"Languages may have one of the following systems to differentiate nouns.",
					[
						true,
						"**Possessable vs Unpossessable**:",
						[
							"Some nouns cannot be possessed (e.g. land, stars)."
						],
						true,
						"**Inherent vs Optional**:",
						[
							"Some nouns //must// be possessed (e.g. body parts, kinship terms)."
						],
						true,
						"**Alienable vs Inalienable**:",
						[
							"Alienable possession can be ended (my car becomes your car).",
							"Inalienable possession cannot be ended (my brother is always my brother)."
						]
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_possessable,
				setProp: useCallback((value) => setText({prop: "possessable", value}), [setText]),
				rows: 4,
				content: "Describe how the language handles possession."
			},
			{
				tag: "Header",
				level: 4,
				content: "2.1.1.3. Count vs Mass"
			},
			{
				tag: "Modal",
				id: "CountNounsandMassNouns",
				title: "Count Nouns and Mass Nouns",
				label: "A Piece of Information",
				content: [
					"Typically, most nouns are countable, while fewer are considered as a mass.",
					"e.g. \"sand\" requires \"a grain of sand\" to be countable, and \"confetti\" requires \"a piece of confetti\"."
				]
			},
			{
				tag: "Text",
				prop: TEXT_countMass,
				setProp: useCallback((value) => setText({prop: "countMass", value}), [setText]),
				content: "Write any specific notes about count/mass noun distinctions here."
			},
			{
				tag: "Header",
				level: 3,
				content: "2.1.2. Pronouns and Anaphoric Clitics"
			},
			{
				tag: "Modal",
				id: "PronounsandAnaphoricClitics",
				title: "Pronouns and Anaphoric Clitics",
				label: "What Are They?",
				content: [
					"**Pronouns**:",
					[
						"Free forms that are used to refer to or replace a word used earlier in a sentence, to avoid repetition.",
						"Also known as //anaphoric references//."
					],
					true,
					"**Anaphoric Clitics**:",
					[
						"A //clitic// is a bound morpheme that functions on the phrase or clause level, but is bound phonologically to another word.",
						"An Anaphoric Clitic functions as a full noun phrase.",
						[
							"Spanish:",
							false,
							{
								tabular: true,
								rows: [
									[
										"lav-o",
										"el",
										"auto"
									],
									[
										"wash-1s",
										"the",
										"car"
									]
								],
								final: "\\\"I wash the car\\\" :: **-o** functions as the noun phrase \\\"I\\\""
							}
						]
					],
					true,
					"Both types often differ according to person (3rd/2nd/1st including inclusive/exclusive), number (singular/plural), noun class (gender/animacy), grammatical role (subject/object/ergative/etc), semantic role (Agent/Patient), definiteness and/or specificness (a/the), and honorifics.",
					"English has frequent pronouns that agree with the verb, and may be stressed for emphasis or contrast: \"**He** died\" (not her, as expected).",
					"Spanish has anaphoric forms attached to the verb, but will use pronouns for emphasis or contrast."
				]
			},
			{
				tag: "Text",
				prop: TEXT_pronounAnaphClitic,
				setProp: useCallback((value) => setText({prop: "pronounAnaphClitic", value}), [setText]),
				rows: 4,
				content: "Which system(s) are used by the language?"
			},
			{
				tag: "Header",
				level: 2,
				content: "2.2. Verbs (the least time-stable concepts)"
			},
			{
				tag: "Header",
				level: 3,
				content: "2.2.1. Semantic Roles"
			},
			{
				tag: "Modal",
				id: "SemanticRoles",
				title: "Semantic Roles",
				label: "A Quick Primer",
				content: [
					"Verbs can be divided into groups depending on which roles they require.",
					[
						true,
						"**Agent**: active, physical, has volition",
						"**Patient**: undergoes a change, no volition (direct object in English)",
						"**Recipient**: moving object (indirect object in English), or often a destination",
						"**Force**: directly instigates, not necessarily conscious or voluntary",
						"**Instrument**: indirectly instigates (usually by an Agent)",
						"**Experiencer**: does not participate, merely observes"
					],
					true,
					"In English, all verbs require an Agent, and many also require a Patient, but no other roles are encoded into the verb.",
					true,
					"NOTE: Roles can change according to the perspective of the speaker:",
					[
						"I hit Steve with the hammer.",
						"The hammer hit Steve.",
						"Steve was hit."
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_semanticRole,
				setProp: useCallback((value) => setText({prop: "semanticRole", value}), [setText]),
				rows: 6,
				content: "Describe which semantic roles are important."
			},
			{
				tag: "Header",
				level: 3,
				content: "2.2.2. Verb Classes"
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_actions,
					BOOL_actionProcesses,
					BOOL_weather,
					BOOL_states,
					BOOL_involuntaryProcesses,
					BOOL_bodyFunctions,
					BOOL_motion,
					BOOL_position,
					BOOL_factive,
					BOOL_cognition,
					BOOL_sensation,
					BOOL_emotion,
					BOOL_utterance,
					BOOL_manipulation,
					BOOL_otherVerbClass
				],
				setters: [
					useCallback((value) => setBool({prop: "actions", value}), [setBool]),
					useCallback((value) => setBool({prop: "actionProcesses", value}), [setBool]),
					useCallback((value) => setBool({prop: "weather", value}), [setBool]),
					useCallback((value) => setBool({prop: "states", value}), [setBool]),
					useCallback((value) => setBool({prop: "involuntaryProcesses", value}), [setBool]),
					useCallback((value) => setBool({prop: "bodyFunctions", value}), [setBool]),
					useCallback((value) => setBool({prop: "motion", value}), [setBool]),
					useCallback((value) => setBool({prop: "position", value}), [setBool]),
					useCallback((value) => setBool({prop: "factive", value}), [setBool]),
					useCallback((value) => setBool({prop: "cognition", value}), [setBool]),
					useCallback((value) => setBool({prop: "sensation", value}), [setBool]),
					useCallback((value) => setBool({prop: "emotion", value}), [setBool]),
					useCallback((value) => setBool({prop: "utterance", value}), [setBool]),
					useCallback((value) => setBool({prop: "manipulation", value}), [setBool]),
					useCallback((value) => setBool({prop: "otherVerbClass", value}), [setBool])
				],
				display: {
					striped: true,
					inlineHeaders: [
						"Special?",
						"Description"
					],
					labels: [
						"Actions",
						"Action-Processes",
						"Weather Verbs",
						"States",
						"Involuntary Processes",
						"Bodily Functions",
						"Motion",
						"Position",
						"Factive",
						"Cognition",
						"Sensation",
						"Emotion",
						"Utterance",
						"Manipulation",
						"Other Verb Class(es)"
					],
					rowDescriptions: [
						"Agent affects Patient.",
						"Agent only.",
						"In English, these require a dummy Agent (\"//It// is raining\"); this is not the case in many other languages!",
						"be hot, be broken, be frozen, etc; may be predicate-bound",
						"He grew; It broke; They died; etc.",
						"cough, sweat, bleed, cry, etc.",
						"go, float, proceed, etc.",
						"sit, stand, hang, etc.",
						"Something comes into being: e.g. build, form, ignite, create; rarely treated differently than Actions",
						"know, suspect, forget etc.",
						"hear, see, taste, etc.",
						"be happy, be afraid, be mellow, etc.",
						"say, yell, murmur, declare, chat, etc.",
						"force, urge, cause, let, permit, allow, compel, etc.",
						"(you might have a distinction different from those already listed)"
					],
					export: {
						title: "Verb Types that are handled in a special way:",
						labelOverrideDocx: true,
						labels: [
							"Agent affects Patient.",
							"Agent only.",
							"In English, these require a dummy Agent (\"_It_ is raining\"); this is not the case in many other languages!",
							"be hot, be broken, be frozen, etc; may be predicate-bound",
							"He grew; It broke; They died; etc.",
							"cough, sweat, bleed, cry, etc.",
							"go, float, proceed, etc.",
							"sit, stand, hang, etc.",
							"Something comes into being: e.g. build, form, ignite, create; rarely treated differently than Actions",
							"know, suspect, forget etc.",
							"hear, see, taste, etc.",
							"be happy, be afraid, be mellow, etc.",
							"say, yell, murmur, declare, chat, etc.",
							"force, urge, cause, let, permit, allow, compel, etc.",
							"(you might have a distinction different from those already listed)"
						]
					}
				}
			},
			{
				tag: "Text",
				prop: TEXT_verbClass,
				setProp: useCallback((value) => setText({prop: "verbClass", value}), [setText]),
				rows: 8,
				content: "If you've marked a verb class as \"Special\", describe how the language treats it differently than the \"regular\" verbs."
			},
			{
				tag: "Header",
				level: 3,
				content: "2.2.3. Verb Structure"
			},
			{
				tag: "Modal",
				id: "VerbStructure",
				title: "Verb Structure",
				label: "Structure and Operations Info",
				content: [
					"In polysynthetic languages, verbs tend to be the most complex.",
					[
						"English is very simple:",
						null,
						[
							"root verb",
							false,
							"+ (optional tense marker OR agreement marker)"
						],
						null,
						"Panare is much more complex:",
						null,
						[
							"person/neutral marker",
							false,
							"+ (optional valence marker)",
							false,
							"+ (optional detransification marker)",
							false,
							"+ (optional incorporation marker)",
							false,
							"+ root verb",
							false,
							"+ (optional derivation marker)",
							false,
							"+ tense/aspect/mode marker"
						]
					],
					null,
					true,
					"Polysynthetic languages may have any/all of these operations",
					[
						"Verb agreement (6)",
						"Semantic role markers (applicatives) (7.1.2)",
						"Valence increasing/decreasing (7.1, 7.2)",
						"Tense/Apect/Mode (8.3)",
						"Evidentials (8.5)",
						"Location and direction (8.4)",
						"Speech act markers (9.3)",
						"Verb and verb-phrase negation (9.2)",
						"Subordination/Nominalization (8.1, 10)",
						"Switch-Reference (10.4)"
					],
					"In more isolating languages, those operations are more likely to be expressed through particles or adverbs.",
					true,
					"Things to consider:",
					[
						"Where does the stem lie in relation to any affixes/particles/etc?",
						"Are directional and/or locational notions expressed in the verb/phrase at all?",
						"Are particular operations obligatory? Productive (for all/most roots)?"
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_verbStructure,
				setProp: useCallback((value) => setText({prop: "verbStructure", value}), [setText]),
				rows: 6,
				content: "Describe the verb structure here."
			},
			{
				tag: "Header",
				level: 2,
				content: "2.3. Modifiers"
			},
			{
				tag: "Header",
				level: 3,
				content: "2.3.1. Property Concepts (Descriptive Adjectives)"
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_lexVerb,
					BOOL_lexNoun,
					BOOL_lexVN,
					BOOL_lexVorN,
					BOOL_adjectives
				],
				setters: [
					useCallback((value) => setBool({prop: "lexVerb", value}), [setBool]),
					useCallback((value) => setBool({prop: "lexNoun", value}), [setBool]),
					useCallback((value) => setBool({prop: "lexVN", value}), [setBool]),
					useCallback((value) => setBool({prop: "lexVorN", value}), [setBool]),
					useCallback((value) => setBool({prop: "adjectives", value}), [setBool])
				],
				display: {
					header: "Different Ways Property Concepts Are Handled in Human Language",
					labels: [
						"Lexicalized as verbs (Acehnese)",
						"Lexicalized as nouns (Finnish)",
						"Lexicalized as nouns or verbs depending on the demands of discourse (Dutch)",
						"Some are lexicalized as nouns, others are lexicalized as verbs (Yoruba)",
						"Distinct class of \"adjectives\" (English)"
					],
					export: {
						title: "Property Concepts:",
						labels: [
							"Lexicalized as verbs",
							"Lexicalized as nouns",
							"Lexicalized as nouns or verbs depending on the demands of discourse",
							"Some are lexicalized as nouns, others are lexicalized as verbs",
							"Distinct class of \"adjectives\""
						]
					}
				}
			},
			{
				tag: "Modal",
				id: "PropertyConcepts",
				title: "Property Concepts",
				label: "More Info",
				content: [
					"If Property Concepts (adjectives) exist as a separate category, they will express:",
					[
						"age",
						"dimension (big, short, long, tall, wide)",
						"value (good, bad)",
						"color"
					],
					"Other properties may be expressed:",
					[
						"physical properties (hard, smooth, heavy)",
						"shape",
						"speed",
						"human propensity (happy, jealous, smart, wary)"
					],
					true,
					"In Acehnese, property concepts can take the same sort of morphology as verbs, thus they are lexicalized as verbs.",
					[
						true,
						"In Finnish, property concepts are required to take the same sort of morphology as the noun they modify, thus they are lexicalized as nouns.",
						true,
						"In Dutch, property concepts are treated as verbs when used as a predicator (\"That car is //pink//!\") and as nouns when used as a modifier (\"I love //pink// cars!\").",
						true,
						"In Yoruba, some property concepts are always treated as nouns, while others are always treated as verbs.",
						true,
						"In English, they are labeled as a separate class because they don't follow the same patterns as nouns or verbs:",
						[
							null,
							"1. They cannot take past tense like a verb, nor do they \"agree\" with their head noun in the same way.",
							"2. They do not take plural markers like a noun, nor can they take articles, modifiers or quantifiers.",
							"3. Rarely, an adjective can be treated as a noun (e.g. \"//The wealthy// are obnoxious\", \"Which car do you prefer, //the gray// or //the red//?\"), but these are actually //zero derivations// (8.1).",
							null
						]
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_propClass,
				setProp: useCallback((value) => setText({prop: "propClass", value}), [setText]),
				content: "How does the language handle PCs? If they're not all treated the same way (as in Dutch or Yoruba), explain the differences."
			},
			{
				tag: "Header",
				level: 3,
				content: "2.3.2. Non-Numeral Quantifiers (e.g. few, many, some)"
			},
			{
				tag: "Text",
				prop: TEXT_quantifier,
				setProp: useCallback((value) => setText({prop: "quantifier", value}), [setText]),
				content: "Which quantifiers exist?"
			},
			{
				tag: "Header",
				level: 3,
				content: "2.3.3. Numerals"
			},
			{
				tag: "Modal",
				id: "Numerals",
				title: "Numerals",
				label: "Things to Consider",
				content: [
					"**Extent**:",
					[
						"Some languages have restricted numerals: e.g. 1, 2, 3, many.",
						"Only very advanced societies will have a need for numbers beyond a thousand.",
						"Many societies will end up borrowing larger number words from nearby languages that invent them first."
					],
					true,
					"**Base**:",
					[
						"Usually base 5 or 10. Sometimes 20. (English is base 10.)",
						"Words for \"five\" usually come from the word for \"hand\". Words for \"twenty\" can come from the word for an entire human being.",
						"More advanced cultures with merchants or bureaucracies tend to create systems based around 12 as well, due to its greater number of factors, but this system almost never replaces the original base system.",
						"Numerals can be described from greatest to least (\"twenty-two\"), from least to greatest (\"two-twenty\"), or not give base multiples a special name (\"two-two\")."
					],
					true,
					"**Agreement**:",
					[
						"Languages may inflect their numerals to agree with their head.",
						"Some languages use entirely different sets of numerals for different situations.",
						[
							"English has separate numerals for counting (one, two, three, etc.) and ordering things (first, second, third, etc.)",
							"Irish has a set of numbers that represent the numbers themselves, a second set for counting or ordering things (one goat, two goats, three goats, etc.), and third set of numerals used only for counting people."
						]
					]
				]
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_baseFive,
					BOOL_baseTen,
					BOOL_baseTwenty,
					BOOL_baseOther
				],
				setters: [
					useCallback((value) => setBool({prop: "baseFive", value}), [setBool]),
					useCallback((value) => setBool({prop: "baseTen", value}), [setBool]),
					useCallback((value) => setBool({prop: "baseTwenty", value}), [setBool]),
					useCallback((value) => setBool({prop: "baseOther", value}), [setBool])
				],
				display: {
					header: "Number Base",
					labels: [
						"Base Five",
						"Base Ten",
						"Base Twenty",
						"Other"
					],
					export: {
						title: "Number Base:",
						labels: [
							"Base Five",
							"Base Ten",
							"Base Twenty",
							"Not Base Five, Ten or Twenty"
						]
					}
				}
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_numGL,
					BOOL_numLG,
					BOOL_numNone
				],
				setters: [
					useCallback((value) => setBool({prop: "numGL", value}), [setBool]),
					useCallback((value) => setBool({prop: "numLG", value}), [setBool]),
					useCallback((value) => setBool({prop: "numNone", value}), [setBool])
				],
				display: {
					header: "Number Format",
					labels: [
						"Greatest-to-Least (twenty-two)",
						"Least-to-Greatest (two-twenty)",
						"Single Digits Only (two-two)"
					],
					export: {
						title: "Number Format:",
						labels: [
							"Greatest-to-Least",
							"Least-to-Greatest",
							"Single Digits Only"
						]
					}
				}
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_multiNumSets,
					BOOL_inflectNum
				],
				setters: [
					useCallback((value) => setBool({prop: "multiNumSets", value}), [setBool]),
					useCallback((value) => setBool({prop: "inflectNum", value}), [setBool])
				],
				display: {
					header: "Other Properties",
					labels: [
						"Multiple Sets of Numerals",
						"Numerals Agree With Head"
					],
					export: {
						title: "Other Number Properties:"
					}
				}
			},
			{
				tag: "Text",
				prop: TEXT_numeral,
				setProp: useCallback((value) => setText({prop: "numeral", value}), [setText]),
				rows: 6,
				content: "Describe the language's numeral system."
			},
			{
				tag: "Header",
				level: 2,
				content: "2.4. Adverbs"
			},
			{
				tag: "Modal",
				id: "Adverbs",
				title: "Adverbs",
				label: "A \"Catch-All\" Category",
				content: [
					"These may or may not exist as a separate category of words.",
					"Languages may use adjectives in special phrases to fulfill this role.",
					"Adverbs can describe the following:",
					[
						"**Manner**: e.g. quickly, slowly, patiently.",
						"**Time**: e.g. yesterday, today, early, next year.",
						"**Direction/Location**: e.g. up/downriver, north(ward), left(ward), hither.",
						"**Evidential/Epistemic**: e.g. possibly, definitely, from conjecture, from direct observation, from second-hand information."
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_adverb,
				setProp: useCallback((value) => setText({prop: "adverb", value}), [setText]),
				rows: 4,
				content: "How are adverbs (or adverb-like phrases) handled?"
			}
		],
		"s03": [
			{
				tag: "Header",
				level: 1,
				content: "3. Constituent Order Typology"
			},
			{
				tag: "Header",
				level: 2,
				content: "3.1. In Main Clauses"
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_APV,
					BOOL_AVP,
					BOOL_VAP,
					BOOL_VPA,
					BOOL_PAV,
					BOOL_PVA
				],
				setters: [
					useCallback((value) => setBool({prop: "APV", value}), [setBool]),
					useCallback((value) => setBool({prop: "AVP", value}), [setBool]),
					useCallback((value) => setBool({prop: "VAP", value}), [setBool]),
					useCallback((value) => setBool({prop: "VPA", value}), [setBool]),
					useCallback((value) => setBool({prop: "PAV", value}), [setBool]),
					useCallback((value) => setBool({prop: "PVA", value}), [setBool])
				],
				display: {
					inlineHeaders: [
						"Primary Order?",
						"Example"
					],
					labels: [
						"APV/SV",
						"AVP/SV",
						"VAP/VS",
						"VPA/VS",
						"PAV/SV",
						"PVA/VS"
					],
					rowDescriptions: [
						"\"Steve softballs pitches; Steve pitches.\"",
						"\"Steve pitches softballs; Steve pitches.\"",
						"\"Pitches Steve softballs; Pitches Steve.\"",
						"\"Pitches softballs Steve; Pitches Steve.\"",
						"\"Softballs Steve pitches; Steve pitches.\"",
						"\"Softballs pitches Steve; Pitches Steve.\""
					],
					export: {
						title: "Constituent Order Typology:"
					}
				}
			},
			{
				tag: "Modal",
				id: "BasicTypology",
				title: "Basic Typology",
				label: "What is This?",
				content: [
					"Human languages tend towards one of six different basic forms.",
					[
						"**S** is the Subject of an intransitive clause.",
						[
							"//Steve// pitches."
						],
						"**V** is the verb in a clause.",
						[
							"Steve //pitches//."
						],
						"**A** is the Agent of a transitive clause.",
						[
							"//Steve// pitches softballs."
						],
						"**P** is the Patient of a transitive clause.",
						[
							"Steve pitches //softballs//."
						]
					],
					true,
					"Languages may use one typology most of the time, but switch to another for certain clauses:",
					[
						"Dependant clauses",
						"Paragraph-initial clauses",
						"Clauses that introduce participants",
						"Questions",
						"Negative clauses",
						"Clearly contrastive clauses"
					],
					true,
					"\"Rigid\" systems may put other constituents into the **P** slot on a regular basis.",
					[
						"The softball was //filthy//: predicate adjective.",
						"Steve was //an awful pitcher//: predicate nominative.",
						"Steve went //to the dugouts//: oblique."
					],
					true,
					"\"Flexible\" or \"free\" systems use something other than grammatical relations to determine order:",
					[
						"Biblical Hebrew puts new, indefinite info pre-verb, definite info post-verb.",
						"Some will fix PV or AV relations in almost all cases, leaving the other \"free\".",
						[
							"Fixed PV → may allow APV and PVA.",
							"Fixed AV → may allow PAV and AVP.",
							"Fixed VP → may allow AVP and VPA.",
							"Fixed VA → may allow VAP and PVA."
						]
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_mainClause,
				setProp: useCallback((value) => setText({prop: "mainClause", value}), [setText]),
				content: "Write any more specific notes here."
			},
			{
				tag: "Header",
				level: 2,
				content: "3.2. Verb Phrases"
			},
			{
				tag: "Text",
				prop: TEXT_verbPhrase,
				setProp: useCallback((value) => setText({prop: "verbPhrase", value}), [setText]),
				rows: 4,
				content: "Where do auxiliary verbs (semantically empty, e.g. to be/to have) appear in relation to the main verb? Where do adverbs fit in relation to the verb and auxiliaries?"
			},
			{
				tag: "Header",
				level: 2,
				content: "3.3. Noun Phrases"
			},
			{
				tag: "Text",
				prop: TEXT_nounPhrase,
				setProp: useCallback((value) => setText({prop: "nounPhrase", value}), [setText]),
				rows: 4,
				content: "What is the order of the determiners (4.5), numerals (2.3.3), genitives (possessors), modifiers (2.3.1), relative clauses (10.5), classifiers (4.7), and the head noun?"
			},
			{
				tag: "Header",
				level: 2,
				content: "3.4. Adpositional Phrases"
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_preP,
					BOOL_postP,
					BOOL_circumP
				],
				setters: [
					useCallback((value) => setBool({prop: "preP", value}), [setBool]),
					useCallback((value) => setBool({prop: "postP", value}), [setBool]),
					useCallback((value) => setBool({prop: "circumP", value}), [setBool])
				],
				display: {
					labels: [
						"Preposition (//with// an apple)",
						"Postpostition (an apple //with//)",
						"Circumposition (rare; //with// an apple //with//)"
					],
					export: {
						title: "Adpositions Used:",
						labels: [
							"Preposition",
							"Postposition",
							"Circumposition"
						],
						labelOverrideDocx: true
					}
				}
			},
			{
				tag: "Modal",
				id: "Adpositions",
				title: "Adpositions",
				label: "More Info",
				content: [
					"Many **Adpositions** derive from verbs, especially serial verbs (see 10.1).",
					"Others derive from nouns, especially body parts (top, back, face, head, etc).",
					"Adpositional phrases may appear the same as possessed noun phrases (in front of vs. on his face) or regular nouns (top vs. on top of)."
				]
			},
			{
				tag: "Text",
				prop: TEXT_adPhrase,
				setProp: useCallback((value) => setText({prop: "adPhrase", value}), [setText]),
				rows: 4,
				content: "Which adposition dominates? Do many adpositions come from nouns or verbs?"
			},
			{
				tag: "Header",
				level: 2,
				content: "3.5 Comparatives"
			},
			{
				tag: "Modal",
				id: "Comparatives",
				title: "Comparatives",
				label: "Comparing Things",
				content: [
					"Does the language even have a form? Some languages get by with strategies like \"X is big, Y is very big.\"",
					"A comparison phrase requires a known standard, a marker that signals this is a comparison, and the quality of comparison.",
					[
						"For example, in //\"X is bigger than Y\"//, (//Y//) is the known standard, (//is __er than//) is a comparison marker, and (//big//) is the quality."
					],
					"PV languages generally use a Standard-Quality-Marker order.",
					"VP languages tend towards Quality-Marker-Standard."
				]
			},
			{
				tag: "Text",
				prop: TEXT_compare,
				setProp: useCallback((value) => setText({prop: "compare", value}), [setText]),
				content: "Does the language have one or more comparative constructions? If so, what is the order of the standard, the marker, and the quality being compared?"
			},
			{
				tag: "Header",
				level: 2,
				content: "3.6 Question Particles and Words"
			},
			{
				tag: "Modal",
				id: "Questions",
				title: "Questions",
				content: [
					"In many languages, yes/no questions are indicated by a change in intonation. In others, a question particle is used; e.g. //do// you understand?",
					"Informal questions may require a specific question word.",
					true,
					"This subject is handled in depth in 9.3.1."
				]
			},
			{
				tag: "Text",
				prop: TEXT_questions,
				setProp: useCallback((value) => setText({prop: "questions", value}), [setText]),
				content: "How are questions handled in the language? In informational questions, where does the question word occur?"
			},
			{
				tag: "Header",
				level: 2,
				content: "3.7 Summary"
			},
			{
				tag: "Text",
				prop: TEXT_COType,
				setProp: useCallback((value) => setText({prop: "COType", value}), [setText]),
				content: "When it comes to Agent/Patient/Verb order, is the language very consistent, fairly consistent, or very inconsistent? Note consistency and any deviations not already covered."
			}
		],
		"s04": [
			{
				tag: "Header",
				level: 1,
				content: "4. Noun and Noun Phrase Operations"
			},
			{
				tag: "Header",
				level: 2,
				content: "4.1. Compounding"
			},
			{
				tag: "Modal",
				id: "Compounding",
				title: "Compounding",
				label: "Noun-Piles",
				content: [
					"When two nouns are combined into one, several changes may occur.",
					[
						"Stress pattern change, e.g. \"//black//bird\" vs \"black //bird//\".",
						"Unusual word order, e.g. \"housekeeper\" vs \"keeper of the house\".",
						"Morphology specific to compounds, e.g. \"can-opener\" does not imply the existence of a verb \"to can-open\".",
						"A resulting meaning that is either more specific than its components (e.g. \"windshield\" vs. \"wind\" or \"shield\") or altogether different (e.g. \"heaven-breath\" means \"weather\" in Mandarin)."
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_compounding,
				setProp: useCallback((value) => setText({prop: "compounding", value}), [setText]),
				rows: 4,
				content: "Describe the sorts of compounding that happen in the language (if any)."
			},
			{
				tag: "Header",
				level: 2,
				content: "4.2. Denominalization"
			},
			{
				tag: "Modal",
				id: "Denominalization",
				title: "Denominalization",
				label: "Verbing a Noun",
				content: [
					"Some languages have many ways of changing a noun into a non-noun.",
					[
						"English can append //-like// to make an adjective.",
						"Eskimo has many verbalizing forms, e.g. to be X, to go towards X, to play with X, to hunt X."
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_denoms,
				setProp: useCallback((value) => setText({prop: "denoms", value}), [setText]),
				rows: 4,
				content: "Are there any processes to make a verb from a noun? An adjective? An adverb?"
			},
			{
				tag: "Header",
				level: 2,
				content: "4.3. Number Marking"
			},
			{
				tag: "Modal",
				id: "NumberMarking",
				title: "Number Marking",
				label: "Plurality, etc.",
				content: [
					"Some languages only mark number occassionally or optionally depending on the type of noun.",
					"This is often intertwined with other markers, such as case marking in Romance languages.",
					"Most languages leave the singular unmarked, but not all!",
					"Number marking may have many distinctions:",
					[
						"singular (one)",
						"dual (two)",
						"trial (three)",
						"paucal (small amount)",
						"plural (any amount larger than the others used)"
					]
				]
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_numSing,
					BOOL_numDual,
					BOOL_numTrial,
					BOOL_numPaucal,
					BOOL_numPlural
				],
				setters: [
					useCallback((value) => setBool({prop: "numSing", value}), [setBool]),
					useCallback((value) => setBool({prop: "numDual", value}), [setBool]),
					useCallback((value) => setBool({prop: "numTrial", value}), [setBool]),
					useCallback((value) => setBool({prop: "numPaucal", value}), [setBool]),
					useCallback((value) => setBool({prop: "numPlural", value}), [setBool])
				],
				display: {
					header: "Which Distinctions Are Marked in the Noun Phrase?",
					labels: [
						"Singular",
						"Dual",
						"Trial",
						"Paucal",
						"Plural"
					],
					export: {
						title: "Number Marking:"
					}
				}
			},
			{
				tag: "Text",
				prop: TEXT_nNumberOpt,
				setProp: useCallback((value) => setText({prop: "nNumberOpt", value}), [setText]),
				rows: 3,
				content: "Is the distinction between singular and non-singular obligatory, optional or absent? If number-marking is optional, when does it tend to occur? When does it not tend to occur?"
			},
			{
				tag: "Text",
				prop: TEXT_nNumberObl,
				setProp: useCallback((value) => setText({prop: "nNumberObl", value}), [setText]),
				rows: 6,
				content: "If number-marking is obligatory, is number marking overtly expressed for all noun phrases, or only some subclasses (e.g. animates)?"
			},
			{
				tag: "Header",
				level: 2,
				content: "4.4. Case Marking"
			},
			{
				tag: "Modal",
				id: "CaseMarking",
				title: "Case Marking",
				label: "How it works",
				content: [
					"Case markings can describe the role a noun plays in a sentence.",
					"In English, most case markings only survive in the pronouns, with word order doing the job for regular nouns. The major exception is the genitive case (possessive), which is marked with //'s//.",
					"Some cases, and the semantic role (2.2.1) they usually indicate, include:",
					[
						"nominative/ergative (Agent, see section 6)",
						"accusative/absolutive (Patient, see section 6)",
						"dative (Recipient)",
						"genitive (Possessor)"
					],
					"In Latin, if a Patient occurs in some other case, either the sentence is ungrammatical or another sense of the verb results.",
					"In some languages, verbs and/or adpositions //govern// their arguments, requiring a specific case marker on their nouns. This allows similar-sounding verbs to be discerned by these case markers. For example, in Yagua, the verb //dííy// can mean either \"kill\" or \"see\" depending on which case the Patient is in:",
					[
						"He killed the alligator:",
						false,
						{
							tabular: true,
							rows: [
								[
									"sa-dííy",
									"nurutú-0"
								],
								[
									"he-kill",
									"alligator-ACC"
								]
							]
						},
						"He saw the alligator:",
						false,
						{
							tabular: true,
							rows: [
								[
									"sa-dííy",
									"nurutí-íva"
								],
								[
									"he-see",
									"alligator-DAT"
								]
							]
						}
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_nCase,
				setProp: useCallback((value) => setText({prop: "case", value}), [setText]),
				rows: 4,
				content: "Do nouns exhibit morphological case? If so, what cases exist?"
			},
			{
				tag: "Header",
				level: 2,
				content: "4.5. Articles and Demonstratives"
			},
			{
				tag: "Modal",
				id: "Articles",
				title: "Articles",
				label: "What Are They?",
				content: [
					"English is relatively rare in having **Articles**: a, an, the. More often, languages have a broader class of demonstratives.",
					true,
					"**Demonstratives** are words that distinguish or identify a noun without modifying it, such as this, that, these and those.",
					"They tend to encode distance (\"this\" is closer to you than \"that\"; Spanish has a third level of distance, too)."
				]
			},
			{
				tag: "Text",
				prop: TEXT_articles,
				setProp: useCallback((value) => setText({prop: "articles", value}), [setText]),
				rows: 6,
				content: "If articles exist, are they obligatory or optional? When do they occur? Are they separate words or bound morphemes?"
			},
			{
				tag: "Text",
				prop: TEXT_demonstratives,
				setProp: useCallback((value) => setText({prop: "demonstratives", value}), [setText]),
				rows: 6,
				content: "How many levels of distance do demonstratives encode? Are there other distinctions besides distance?"
			},
			{
				tag: "Header",
				level: 2,
				content: "4.6. Possessors"
			},
			{
				tag: "Modal",
				id: "Possessors",
				title: "Possessors",
				label: "Possessor Expressions",
				content: [
					"Refer back to 2.1.1.2 to note your system of possession. This does **not** refer to possessive clauses! (5.4)",
					true,
					"How are possessors expressed in the noun phrase?",
					"Do nouns agree with their possessors? Vice versa?"
				]
			},
			{
				tag: "Text",
				prop: TEXT_possessors,
				setProp: useCallback((value) => setText({prop: "possessors", value}), [setText]),
				rows: 3,
				content: "Describe how possession works in a noun phrase."
			},
			{
				tag: "Header",
				level: 2,
				content: "4.7. Class (Gender)"
			},
			{
				tag: "Modal",
				id: "ClassandGender",
				title: "Class and Gender",
				label: "What They Are",
				content: [
					"Class system often require classifiers (special operators) to declare class.",
					"Pure gender systems use \"agreement\" instead of classifiers. At the very least, numerical expressions will \"agree\" with their head noun.",
					"Classes generally care about one dimension of reality, such as biological gender, animacy, shape, or function. (Other dimensions may be relevant, too.) There are almost always exceptions to the rule, however (e.g. Yagua treats rocks and pineapples as animates).",
					"Classifiers may occur with verbs, numerals and adjectives, though they may serve a different function in those cases."
				]
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_classGen,
					BOOL_classAnim,
					BOOL_classShape,
					BOOL_classFunction,
					BOOL_classOther
				],
				setters: [
					useCallback((value) => setBool({prop: "classGen", value}), [setBool]),
					useCallback((value) => setBool({prop: "classAnim", value}), [setBool]),
					useCallback((value) => setBool({prop: "classShape", value}), [setBool]),
					useCallback((value) => setBool({prop: "classFunction", value}), [setBool]),
					useCallback((value) => setBool({prop: "classOther", value}), [setBool])
				],
				display: {
					header: "Which Class Distinctions Exist?",
					labels: [
						"Gender",
						"Animacy",
						"Shape",
						"Function",
						"Other"
					],
					export: {
						title: "Class Distinctions:"
					}
				}
			},
			{
				tag: "Text",
				prop: TEXT_classGender,
				setProp: useCallback((value) => setText({prop: "classGender", value}), [setText]),
				rows: 8,
				content: "Describe the language's class/gender system, if it has one. What classes/genders exist and how do they manifest? What dimension(s) of reality is central to the class system? How do they interact with numerals, verbs and adjectives?"
			},
			{
				tag: "Header",
				level: 2,
				content: "4.8. Diminution/Augmentation"
			},
			{
				tag: "Modal",
				id: "DiminutionandAugmentation",
				title: "Diminution and Augmentation",
				label: "Bigger and Smaller",
				content: [
					"If diminution (making smaller) and/or augmentation (making bigger) is used in the language, answer the following questions:",
					[
						"Is it obligatory? Does one member have to occur in every full noun phrase?",
						"Is it productive? Does it work with all full noun phrases and does it have the same meaning for each?",
						"Is it expressed lexically, morphologically, or analytically?",
						"Where in the NP is this operation likely to be located? Can it occur in more than one place?"
					]
				]
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_dimAugYes,
					BOOL_dimAugObligatory,
					BOOL_dimAugProductive
				],
				setters: [
					useCallback((value) => setBool({prop: "dimAugYes", value}), [setBool]),
					useCallback((value) => setBool({prop: "dimAugObligatory", value}), [setBool]),
					useCallback((value) => setBool({prop: "dimAugProductive", value}), [setBool])
				],
				display: {
					labels: [
						"Dim/Aug System Exists",
						"...and is Obligatory",
						"...and is Productive"
					],
					export: {
						title: "Diminution/Augmentation System:",
						labels: [
							"Exists",
							"Is Obligatory",
							"Is Productive"
						]
					}
				}
			},
			{
				tag: "Text",
				prop: TEXT_dimAug,
				setProp: useCallback((value) => setText({prop: "dimAug", value}), [setText]),
				rows: 8,
				content: "Describe the language's relation to diminution and augmentation."
			}
		],
		"s05": [
			{
				tag: "Header",
				level: 1,
				content: "5. Predicate Nominals and Related Constructions"
			},
			{
				tag: "Modal",
				id: "PredicateNominals",
				title: "Predicate Nominals",
				label: "General Information to Consider",
				content: [
					"These forms generally encode the following information:",
					[
						"**Equation**: X is Y",
						"**Proper Inclusion**: X is a Y",
						"**Location**: X is located Y",
						"**Attribution**: X is made Y",
						"**Existence**: X exists in Y",
						"**Possession**: X has Y"
					],
					"The forms at the top of the list are much more likely to lack a semantically rich verb, while those at the bottom are less likely to."
				]
			},
			{
				tag: "Header",
				level: 2,
				content: "5.1. Predicate Nominals and Adjectives"
			},
			{
				tag: "Modal",
				id: "PredicateNominalsandAdjectives",
				title: "Predicate Nominals and Adjectives",
				label: "What It Is and What It Seems Like",
				content: [
					"May encode //proper inclusion// (X is a Y) and //equation// (X is Y)",
					"Predicate adjectives are usually handled the same as predicate nominals, though they will sometimes use a different copula than the nouns.",
					"If they use a verb, it will not be a very //semantically rich// verb (e.g. to be, to do)",
					"Will generally use one of the following strategies:",
					[
						"//Juxtaposition//",
						[
							"Two nouns (or a noun and adjective) are placed next to each other.",
							"Ex: Steve doctor. Mouse small. (Steve is a doctor. A mouse is small.)"
						]
					],
					"//Joined by copula//",
					[
						"A //copula// is a morpheme that \"couples\" two elements. Often encodes Tense/Aspect (8.3), and can be restricted to certain situations (e.g. only in non-present tenses).",
						"The copula can take different forms:",
						[
							"//Verb//",
							[
								"These tend to be very irregular verbs.",
								"They tend to belong to the same verb class as stative verbs.",
								"They tend to function as auxiliaries in other constructions.",
								"Ex: Steve is a doctor."
							],
							"//Pronoun//",
							"The pronoun corresponds to the subject.",
							"Ex: Steve, he a doctor."
						],
						"//Invariant particle//",
						[
							"This particle may derive from a verb or pronoun.",
							"The particle will not encode tense/aspect/gender/anything.",
							"Ex: Steve blorp doctor."
						],
						"//Derivational operation//",
						[
							"Predicate noun becomes a verb.",
							"Ex: Steve doctor-being."
						]
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_predNom,
				setProp: useCallback((value) => setText({prop: "predNom", value}), [setText]),
				rows: 6,
				content: "Describe the language's strategy for predicate nominals and adjectives."
			},
			{
				tag: "Header",
				level: 2,
				content: "5.2. Predicate Locatives"
			},
			{
				tag: "Modal",
				id: "PredicateLocatives",
				title: "Predicate Locatives",
				label: "Where It Is",
				content: [
					"Many languages use a word that gets translated as \"be at\".",
					"The locative word is often the same as a locative adposition.",
					"Word order usually distinguishes possessive clauses from locational clauses.",
					[
						"Ex: Steve has a cat (possessive); the cat is behind Steve (locational)."
					],
					true,
					"English bases locatives on possessive clauses, but with an inanimate possessor.",
					"Russian bases possessive clauses on locatives, but with an animate possessor."
				]
			},
			{
				tag: "Text",
				prop: TEXT_predLoc,
				setProp: useCallback((value) => setText({prop: "predLoc", value}), [setText]),
				rows: 6,
				content: "How does the language handle predicate locatives?"
			},
			{
				tag: "Header",
				level: 2,
				content: "5.3. Existentials"
			},
			{
				tag: "Modal",
				id: "Existentials",
				title: "Existentials",
				label: "These Exist",
				content: [
					"These constructions usually serve a presentative function, introducing new participants.",
					"Usually, the nominal is indefinite: Consider \"There are lions in Africa\" (valid) vs. \"There are the lions in Africa\" (invalid).",
					"There is usually little to no case marking, verb agreement, etc.",
					"They often share features of predicate nominals (copula), but some languages prohibit such forms.",
					"They often have special negation stategies (e.g. a verb meaning 'to lack': \"Under the bed lacks a cat\").",
					"They often play a role in:",
					[
						"\"Impersonal\" or \"circumstantial\" constructions.",
						[
							"e.g. There will be dancing in the streets!"
						],
						"Situations that lack the need for any specific actor, or to downplay the significance of an actor.",
						[
							"e.g. Someone is crying."
						]
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_predEx,
				setProp: useCallback((value) => setText({prop: "predEx", value}), [setText]),
				rows: 6,
				content: "How are existential clauses formed? Does this vary according to tense, aspect or mood? Is there a special negation strategy? Is this form used to impart other information (such as possessives) as well?"
			},
			{
				tag: "Header",
				level: 2,
				content: "5.4. Possessive Clauses"
			},
			{
				tag: "Modal",
				id: "PossessiveClauses",
				title: "Possessive Clauses",
				content: [
					"These follow two main strategies:",
					[
						"Verb strategy: \"I have a book.\"",
						"Copula strategy: \"The book is at me.\""
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_predEx,
				setProp: useCallback((value) => setText({prop: "predEx", value}), [setText]),
				rows: 3,
				content: "Does the language use a verb or copula strategy?"
			}
		],
		"s06": [
			{
				tag: "Header",
				level: 1,
				content: "6. Grammatical Relations"
			},
			{
				tag: "Modal",
				id: "Alignments",
				title: "Alignments",
				label: "Show the Alignments",
				content: [
					"**Nominative/Accusative Alignment**:",
					[
						"(S)ubjects and (A)gents are treated the same, in the nominative case.",
						[
							"//I// fell.",
							"//I// pushed him."
						],
						"(P)atients are given the accusative case.",
						[
							"I pushed //him//."
						],
						"S and A are both viewed as agents, having volition",
						"A tends to stick with the (V)erb, leaving the P floating:",
						[
							"AVP; PAV; VAP; PVA"
						]
					],
					true,
					"**Ergative/Absolutive Alignment**:",
					[
						"(S)ubjects and (P)atients are treated the same, in the ergative case.",
						[
							"//I// fell.",
							"Me pushed //he//."
						],
						"(A)gents are given the absolutive case.",
						[
							"//Me// pushed he."
						],
						"S and P are both viewed as typically being new information, or undergoing change.",
						"P tends to stick with the (V)erb, leaving the A floating:",
						[
							"AVP; VPA; APV; PVA"
						],
						true,
						"**Split Ergativity**:",
						[
							"In natural languages, ergativity tends to coexist in a hierarchy, with the nominative/accusative system used for the higher level. Typical hierarchies:",
							[
								"1st person &gt; 2nd person &gt; 3rd person &gt; humans &gt; animates &gt; inanimates",
								"agreement &gt; pronouns/case marking",
								"definite &gt; indefinite",
								"non-past tense &gt; past tense",
								"imperfect aspect &gt; perfect aspect"
							],
							"The split in the hierarchy can happen at any point. e.g.",
							[
								"Dyirbal uses n/a for 1st/2nd person, e/a for everything else (this is a very common split point)",
								"Cashinawa uses n/a for 1/2, separate marking for A and P in 3rd person, and e/a for everything else",
								"Managalasi uses e/a for pronouns, n/a for person marking on verbs"
							]
						]
					]
				]
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_nomAcc,
					BOOL_ergAbs
				],
				setters: [
					useCallback((value) => setBool({prop: "nomAcc", value}), [setBool]),
					useCallback((value) => setBool({prop: "ergAbs", value}), [setBool])
				],
				display: {
					header: "Primary Alignment System",
					labels: [
						"Nominative / Accusative",
						"Ergative / Absolutive"
					],
					export: {
						title: "Primary Alignment System:"
					}
				}
			},
			{
				tag: "Text",
				prop: TEXT_ergative,
				setProp: useCallback((value) => setText({prop: "ergative", value}), [setText]),
				rows: 8,
				content: "Are there any exceptions to the primary alignment? Do they exist in a hierarchy?"
			}
		],
		"s07": [
			{
				tag: "Header",
				level: 1,
				content: "7. Voice and Valence Adjusting Operations"
			},
			{
				tag: "Modal",
				id: "Valence",
				title: "Valence",
				label: "What is Valence?",
				content: [
					"**Valence** refers to the amount of arguments in a clause.",
					[
						"\"I fell\" has a valence of 1.",
						"\"I pushed Steve\" has a valence of 2.",
						"\"I gave Steve a coconut\" has a valence of 3.",
						"\"I gave a coconut to Steve\" has a valence of 2.",
						[
							"\"To Steve\" is in an oblique case, forming a verb modifier instead of being an argument of the verb."
						]
					]
				]
			},
			{
				tag: "Header",
				level: 2,
				content: "7.1. Valence-Increasing Operations"
			},
			{
				tag: "Header",
				level: 3,
				content: "7.1.1. Causatives"
			},
			{
				tag: "Modal",
				id: "Causatives",
				title: "Causatives",
				label: "Forcing You to Read This",
				content: [
					"**Lexical**:",
					[
						"Most languages have at least some form of this. There are three major methods employed:",
						[
							"No change in the verb:",
							[
								"\"The vase broke\" becomes \"Steve broke the vase\"."
							],
							"Some idiosyncratic change in the verb:",
							[
								"\"The tree fell\" becomes \"Steve felled the tree\"."
							],
							"Different verb:",
							[
								"\"The tree died\" becomes \"Steve killed the tree\"."
							]
						]
					],
					"**Morphological**:",
					[
						"The verb change applies to all verbs (not just one, like //fell// vs //felled//).",
						"Often expresses causation and permission.",
						"May be restricted to only intransitive verbs.",
						"In transitive verbs, the causee often goes into a different case."
					],
					"**Analytical**:",
					[
						"A separate causative verb is used. This usually isn't valence-increasing!",
						[
							"\"Steve caused the tree to die\".",
							"\"Steve forced the stick into the ground.\""
						]
					],
					true,
					"**Coding Principles**:",
					[
						"**Structural Distance**",
						[
							"If the language has more than one formal type of causative, the \"smaller\" one will be used for more direct causation, while the \"larger\" one will be used for less direct causation. Longer linguistic distance correlates to greater conceptual distance.",
							[
								"\"George killed Joe\" is more direct than \"George caused Joe to die\".",
								"Amharic has an //a-// prefix for direct causation, //as-// for indirect."
							],
							"Analytic causatives often \"require\" an animate causee.",
							[
								"Japanese has a morphological causative when the causee has some control over the event, but requires a lexical causative for inanimate causees.",
								"Consider \"Joe made George come down\" vs \"Joe brought the golf clubs down\"."
							]
						]
					],
					"**Finite vs. Non-Finite Verbs**",
					[
						"The more distant the cause from the effect in space or time, the more finite the verb will be.",
						[
							"Ex: //\"Jorge **hizo comer** pan a Josef\"// indicates Jorge forced Josef to eat bread directly, while //\"Jorge **hizo** que Josef **comiera** pan\"// indicates he forced Josef indirectly, maybe by removing all other food."
						]
					],
					"**Case**",
					[
						"If the causee retains a high degree of control, it will appear in a case associated with Agents, but with little control, will appear in a Patient case.",
						[
							"Ex: \"Steve asked that //he// leave\" gives Steve less control over the situation than \"Steve asked //him// to leave\"."
						]
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_causation,
				setProp: useCallback((value) => setText({prop: "causation", value}), [setText]),
				rows: 4,
				content: "Describe which method(s) the language uses to create causatives."
			},
			{
				tag: "Header",
				level: 3,
				content: "7.1.2. Applicatives"
			},
			{
				tag: "Modal",
				id: "Applicatives",
				title: "Applicatives",
				label: "Adding a Third Participant",
				content: [
					"The verb is marked for the role of a direct object, bringing a peripheral participant (the applied object) on stage in a more central role.",
					[
						"This may turn a transitive verb ditransitive, or it may replace the direct object entirely (which technically isn't valence-increasing!)",
						false,
						"\"I arrived at Shionti's\" in Nomatsiguenga.",
						false,
						{
							tabular: true,
							rows: [
								[
									"n-areeka",
									"Sionti-ke"
								],
								[
									"I-arrive",
									"Shionti-LOC (valence: 1)"
								],
								[
									"n-areeka-re",
									"Sionti"
								],
								[
									"I-arrive-him",
									"Shionti (valence: 2)"
								]
							]
						}
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_applicatives,
				setProp: useCallback((value) => setText({prop: "applicatives", value}), [setText]),
				rows: 4,
				content: "Describe which method(s) the language uses for applicatives, if any."
			},
			{
				tag: "Header",
				level: 3,
				content: "7.1.3. Dative Shift"
			},
			{
				tag: "Modal",
				id: "DativeShift",
				title: "Dative Shift",
				label: "Looking Shifty",
				content: [
					"This only applies to verbs that take an Agent, a Patient and a Recipient or Experiencer. This latter argument is usually put in the //dative// case.",
					"Applicatives mark the verb, while a Dative Shift does not.",
					"Applicatives usually promote Instrumentals, while Dative Shifts usually promote Recipients and Benefactives.",
					"Example:",
					[
						"\"Steve gave the ball to Linda.\" Valence: 2",
						"\"Steve gave Linda the ball.\" Valence: 3, recipient promoted."
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_dativeShifts,
				setProp: useCallback((value) => setText({prop: "dativeShifts", value}), [setText]),
				rows: 4,
				content: "Is there a dative shift construction in the language? What is it? What semantic roles can be shifted? Is it obligatory?"
			},
			{
				tag: "Header",
				level: 3,
				content: "7.1.4. Dative of Interest"
			},
			{
				tag: "Modal",
				id: "DativeofInterest",
				title: "Dative of Interest",
				label: "Pique Your Interest",
				content: [
					"This is adding a participant that is associated in some way.",
					[
						"\"Dinner is burned [for me]\" in Spanish",
						false,
						{
							tabular: true,
							rows: [
								[
									"Se",
									"me",
									"quemó",
									"la",
									"cena."
								],
								[
									"REFL",
									"1s",
									"burn.3s.PST",
									"DEF.f.s",
									"dinner"
								]
							]
						},
						"\"She cut the hair [on him]\" in Spanish.",
						false,
						{
							tabular: true,
							rows: [
								[
									"Le",
									"cortó",
									"el",
									"pelo."
								],
								[
									"3.DAT",
									"cut.3s.PST",
									"DEF.M.s",
									"hair"
								]
							]
						}
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_datOfInt,
				setProp: useCallback((value) => setText({prop: "datOfInt", value}), [setText]),
				rows: 4,
				content: "Is there a dative-of-interest operation?"
			},
			{
				tag: "Header",
				level: 3,
				content: "7.1.5. Possessor Raising (a.k.a. External Possession)"
			},
			{
				tag: "Modal",
				id: "PossessorRaising",
				title: "Possessor Raising",
				label: "What is This?",
				content: [
					"In many languages, this exists separate from a dative of interest.",
					[
						"\"I fixed the railroad track\" in Choctaw.",
						false,
						{
							tabular: true,
							rows: [
								[
									"Tali",
									"i-hina-ya",
									"ayska-li-tok"
								],
								[
									"rock",
									"AGR(III)-road-NS",
									"fix-1s-PST (normal construction"
								],
								[
									"Tali-ya",
									"hina",
									"im-ayska-li-to"
								],
								[
									"rock-NS",
									"road",
									"AGR(III)-fix-1s-PST (possessor raised)"
								]
							]
						}
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_possessRaising,
				setProp: useCallback((value) => setText({prop: "possessRaising", value}), [setText]),
				rows: 4,
				content: "Does possessor raising occur?"
			},
			{
				tag: "Header",
				level: 2,
				content: "7.2. Valence-Decreasing Operations"
			},
			{
				tag: "Header",
				level: 3,
				content: "7.2.1. Reflexives"
			},
			{
				tag: "Modal",
				id: "Reflexives",
				title: "Reflexives",
				label: "You Are Me?",
				content: [
					"The Agent and Patient are the same, so one is omitted.",
					true,
					"Lexical reflexives:",
					[
						"The verb itself implies reflexivity.",
						[
							"e.g.: Steve washed and shaved every morning."
						]
					],
					"Morpholigical reflexives:",
					[
						"A word (or words) is modified to indicate the reflexive.",
						[
							"e.g.: Spanish: Jorge se lavo. (George washed himself, \"se lavo\" being a morphing of the root verb \"lavarse\".)"
						]
					],
					"Analytic reflexives:",
					[
						"Inserting a lexical word, making a semantic valence-lowering (but not a lexical one).",
						[
							"e.g.: Steve washed himself."
						],
						"These are often based on body parts.",
						[
							"e.g.: Another face in the crowd; Move your butt!"
						]
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_refls,
				setProp: useCallback((value) => setText({prop: "refls", value}), [setText]),
				rows: 4,
				content: "How are reflexives handled?"
			},
			{
				tag: "Header",
				level: 3,
				content: "7.2.2. Reciprocals"
			},
			{
				tag: "Modal",
				id: "Reciprocals",
				title: "Reciprocals",
				label: "Working Together",
				content: [
					"The Agent and Patient are performing the same action, or performing an action together. These are often expressed the same way as reflexives.",
					true,
					"Lexical reciprocals:",
					[
						"The verb itself implies reciprocity.",
						[
							"e.g.: Steve and Jane shook hands [with each other]."
						]
					],
					"Morpholigical and lexical reciprocals follow the same patterns as those for reflexives."
				]
			},
			{
				tag: "Text",
				prop: TEXT_recips,
				setProp: useCallback((value) => setText({prop: "recips", value}), [setText]),
				rows: 3,
				content: "How are reciprocals handled?"
			},
			{
				tag: "Header",
				level: 3,
				content: "7.2.3. Passives"
			},
			{
				tag: "Modal",
				id: "Passives",
				title: "Passives",
				label: "Moving Focus From the Agent",
				content: [
					"A semantically transitive verb with omitted Agent, the Patient treated as Subject, and the verb behaves as if it is intransitive. (The Agent is made less topical than the Patient.)",
					true,
					"Personal passive: Agent is implied, or expressed obliquely.",
					[
						"Lexical passives are rare.",
						"Morphological passives are more common, often the same morphology as perfect aspect. May be derived from copulas or nominalizations.",
						"English has analytic passives, with a copula and a \"past participle\" (Patient nominalization).",
						[
							"e.g.: The tree has been killed."
						]
					],
					true,
					"Impersonal passive: no Agent directly indicated; can be used for intransitive verbs as well as transitive.",
					[
						"No known languages uses a specific morphology for this!"
					],
					true,
					"Other kinds of passives may exist.",
					[
						"English has the basic \"Steve was eaten by a bear\" but can also express it with other verbs, as in \"Steve got eaten by a bear.\"",
						"Yup'ik has an adversative passive (to the detriment of the subject), abilitative passive (X can be Y [by Z]), and a negative abilitiative (X cannot be Y [by Z])."
					],
					true,
					"Passive construction may be obligatory in a particular environment, e.g. when the Patient outranks the Agent."
				]
			},
			{
				tag: "Text",
				prop: TEXT_passives,
				setProp: useCallback((value) => setText({prop: "passives", value}), [setText]),
				rows: 4,
				content: "How are passives handled?"
			},
			{
				tag: "Header",
				level: 3,
				content: "7.2.4. Inverses"
			},
			{
				tag: "Modal",
				id: "Inverses",
				title: "Inverses",
				label: "Playing The Reverse Card",
				content: [
					"This is a valence \"rearranging\" device, e.g. \"Steve taught him\" becomes \"Him, Steve taught.\"",
					"Often follows a hierarchy where a \"higher\" Agent requires direct and a \"lower\" Agent requires the inverse."
				]
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_markInv,
					BOOL_markDirInv,
					BOOL_verbAgreeInv,
					BOOL_wordOrderChange
				],
				setters: [
					useCallback((value) => setBool({prop: "markInv", value}), [setBool]),
					useCallback((value) => setBool({prop: "markDirInv", value}), [setBool]),
					useCallback((value) => setBool({prop: "verbAgreeInv", value}), [setBool]),
					useCallback((value) => setBool({prop: "wordOrderChange", value}), [setBool])
				],
				display: {
					labels: [
						"Marked inverse only",
						"Both direct and inverse explicitly marked",
						"Special verb agreement markers for inverse",
						"Functional inverse: word order changes, e.g. VAP becomes VPA"
					],
					export: {
						title: "Inverse Constructions:"
					}
				}
			},
			{
				tag: "Text",
				prop: TEXT_inverses,
				setProp: useCallback((value) => setText({prop: "inverses", value}), [setText]),
				rows: 4,
				content: "Describe any peculiarities of inverse constructions."
			},
			{
				tag: "Header",
				level: 3,
				content: "7.2.5. Middle Constructions"
			},
			{
				tag: "Modal",
				id: "MiddleConstructions",
				title: "Middle Constructions",
				label: "What Are These?",
				content: [
					"Also known as anticausatives or detransitivation: a semantically transitive situation expressed as a process undergone by a Patient (rather than carried out by an Agent).",
					"Many languages express this the same way as they express passives.",
					"This often express the notion that the subject is both controller and affected.",
					[
						"e.g. \"Steve broke the car\" becomes \"The car broke\" (and it was no fault of Steve's)."
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_middleCon,
				setProp: useCallback((value) => setText({prop: "middleCon", value}), [setText]),
				rows: 3,
				content: "How are middle constructions handled?"
			},
			{
				tag: "Header",
				level: 3,
				content: "7.2.6. Antipassives"
			},
			{
				tag: "Modal",
				id: "Antipassives",
				title: "Antipassives",
				label: "What Are These?",
				content: [
					"Similar to passives, but the Patient is downgraded instead of the Agent.",
					"Generally, this only happens in ergative languages or in languages without verbal agreement, but many exceptions exist.",
					"Often, the Patient is omitted or oblique, the verb is marked intrasitive, and the Agent is placed in absolutive case."
				]
			},
			{
				tag: "Text",
				prop: TEXT_antiP,
				setProp: useCallback((value) => setText({prop: "antiP", value}), [setText]),
				rows: 3,
				content: "Describe antipassive strategies in the language, if they exist."
			},
			{
				tag: "Header",
				level: 3,
				content: "7.2.7. Object Demotion/Omission/Incorporation"
			},
			{
				tag: "Modal",
				id: "ObjectDemotionandRelatedFunctions",
				title: "Object Demotion and Related Functions",
				label: "What Are These?",
				content: [
					"**Demotion**: \"Steve shot Bob\" becomes \"Steve shot at Bob\".",
					true,
					"**Omission**: \"Steve shot Bob\" becomes \"Steve shot\".",
					true,
					"**Incorporation**: \"Steve shot Bob\" becomes \"Steve Bob-shot\".",
					[
						"The incorporated object is usually the Patient, rarely the Agent.",
						"May have other semantic functions.",
						[
							"In Panare, incorporating a body part noun into a cutting verb means the part was cut completely off (\"Darth Vader hand-cut\"), whereas leaving it unincorporated means it was merely injured (\"Darth Vader cut hand\")."
						]
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_objDemOmInc,
				setProp: useCallback((value) => setText({prop: "objDemOmInc", value}), [setText]),
				rows: 5,
				content: "Is object demotion/omission allowed? How about incorporation?"
			}
		],
		"s08": [
			{
				tag: "Header",
				level: 1,
				content: "8. Other Verb and Verb Phrase Operations"
			},
			{
				tag: "Header",
				level: 2,
				content: "8.1. Nominalization"
			},
			{
				tag: "Modal",
				id: "Nominalization",
				title: "Nominalization",
				label: "Making Nouns",
				content: [
					"Every language has strategies of adjusting the grammatical category of a root. Turning a word into a noun is //nominalization//.",
					true,
					"English has multiple methods, with differing levels of productivity.",
					"Typically, a language will use differing methods to create nominalizations according to the result.",
					true,
					"Some methods:",
					[
						"**Zero Operator**: walk → a walk, look → a look",
						"**Affix**: walk → walking, employ → employment, grow → growth, construct → construction",
						"**Merge with Adposition**: hang + up → hangup, make + over → makeover, talk + to → talking to",
						"**Analytical**: Mandarin uses a particle //de// to indicate some nominalizations",
						[
							"//hézuò// (cooperate) + //de// → cooperation"
						]
					],
					true,
					"Types of nominalization:",
					[
						"**Action**:",
						[
							"Usually refers to the action in the abstract.",
							[
								"walk → walking",
								"think → thinking"
							]
						],
						"**Agent**:",
						[
							"Typically refers to an Agent who is characteristic of the root verb (teach → a teacher), but some languages instead refer to someone engaged in the activity at the moment (teach → one who is presently teaching)."
						],
						"**Patient**:",
						[
							"In English, this mostly happens with the modifiers \"good\" and \"bad\".",
							[
								"buy → a good buy",
								"fall → a bad fall"
							],
							"This can also form the \"past participle\" in a language.",
							[
								"employ → employee : this form comes from the French past participle!"
							]
						],
						"**Instrument**:",
						[
							"Refers to the object used in the action.",
							"In English, this usually follows the same format as an Agent nominalization.",
							"In Spanish, compounding a verb with a plural object makes an instrument.",
							[
								"e.g. //abre// (open) + //latas// (cans) → //el abrelatas// (can-opener)"
							]
						],
						"**Location**:",
						[
							"Many languages use this to refer generally to a place where the action tends to occur, e.g. work → workshop, burn → fireplace."
						],
						"**Product**:",
						[
							"This refers to something that exists because of an action.",
							"English tends to do this with zero operators (scratch → a scratch) or by changing the stress pattern (permit → a permit, reject → a reject, convert → a convert)."
						],
						"**Manner**:",
						[
							"This is uncommon among languages, but English has a couple, generally confined to sports terminology.",
							[
								"curve → a curve (That pitcher's curve is unhittable.)",
								"serve → a serve (Serena's serve is imposing.)"
							]
						]
					]
				]
			},
	
			{
				tag: "Text",
				prop: TEXT_verbNoms,
				setProp: useCallback((value) => setText({prop: "verbNoms", value}), [setText]),
				rows: 8,
				content: "Describe the nominalizations that exist in the language, and explain how productive they are."
			},
			{
				tag: "Header",
				level: 2,
				content: "8.2. Compounding"
			},
			{
				tag: "Modal",
				id: "Compounding",
				title: "Compounding",
				label: "Word-Making",
				content: [
					"**Noun Incorporation**: noun becomes attached to a verb (see 7.2.7).",
					[
						"The most common form is Patient incorporation (sell pigs → to pig-sell)."
					],
					true,
					"**Verb Incorporation**: two verbs merge, one modifying the other.",
					[
						"Often, verbs of motion enter into these pairings (shout-rise → he shouts rising).",
						"Verbs that freely compound like this typically lose their verbal character and become derivational affixes."
					]
				]
			},
	
			{
				tag: "Text",
				prop: TEXT_verbComp,
				setProp: useCallback((value) => setText({prop: "verbComp", value}), [setText]),
				rows: 6,
				content: "Describe any compounding strategies that exist in the language."
			},
			{
				tag: "Header",
				level: 2,
				content: "8.3. Tense/Aspect/Mode"
			},
			{
				tag: "Modal",
				id: "TenseAspectandMode",
				title: "Tense, Aspect and Mode",
				label: "What Are They?",
				content: [
					"**TAM** (Tense, Aspect, Mode) are sometimes hard to tease apart, and may only be considered separate because of how they are in western language.",
					"Some languages pay more attention to tense (English), aspect (Austronesian languages), or mode (Eskimo).",
					[
						"Furthermore, some verb stems may not allow certain operations while favoring others."
					],
					"Many languages don't morphologically indicate one or more of these divisions. (When not indicated morphologically, the language will use lexical or analytical methods.)",
					[
						"Aspect: only 74% of languages use morphology",
						"Mode: only 68% of languages do",
						"Tense: barely 50% of languages do!"
					],
					true,
					"TAM morphemes often interact significantly with case or number marking (nom/acc in one aspect, erg/abs in another; merging aspect with number)."
				]
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_tenseMorph,
					BOOL_aspectMorph,
					BOOL_modeMorph,
					BOOL_otherMorph
				],
				setters: [
					useCallback((value) => setBool({prop: "tenseMorph", value}), [setBool]),
					useCallback((value) => setBool({prop: "aspectMorph", value}), [setBool]),
					useCallback((value) => setBool({prop: "modeMorph", value}), [setBool]),
					useCallback((value) => setBool({prop: "otherMorph", value}), [setBool])
				],
				display: {
					header: "Morphology Exists For:",
					labels: [
						"Tense",
						"Aspect",
						"Mode",
						"Other (see below)"
					],
					export: {
						title: "Morphology Exists For:",
						labels: [
							"Tense",
							"Aspect",
							"Mode",
							"Other"
						]
					}
				}
			},
			{
				tag: "Header",
				level: 3,
				content: "8.3.1 Tense"
			},
			{
				tag: "Modal",
				id: "Tense",
				title: "Tense",
				label: "Info on Tense",
				content: [
					"**Tense** sets an action in time in relation to \"now\".",
					"Languages can divide time up into different sets of tenses:",
					[
						"Past/Present/Future",
						"Past/Nonpast",
						"Nonfuture/Future",
						"Not-Now/Now/Not-Now (two tenses!)",
						"Distant Past/A Year Ago/A Month Ago/A Week Ago/Today or Yesterday/Now/Soon/Future",
						[
							"When human languages have divided past or future into multiple segments, there are never more future segments than past segments!"
						]
					],
					true,
					"Future tense markers often derive from \"want\", \"come\", or \"go\".",
					[
						"These verbs may still function separately!",
						[
							"He come (present)",
							"He come go (will go)",
							"He come come (will come)"
						]
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_tense,
				setProp: useCallback((value) => setText({prop: "tense", value}), [setText]),
				rows: 6,
				content: "Is there a Tense system? How does it operate? How does it divide time?"
			},
			{
				tag: "Header",
				level: 3,
				content: "8.3.2 Aspect"
			},
			{
				tag: "Modal",
				id: "Aspect",
				title: "Aspect",
				label: "Info on Aspect",
				content: [
					"**Aspect** describes the internal structure of an event or state. Here are some typical aspects:",
					[
						"**Perfective**: The situation is viewed as a single event.",
						[
							"\"She wrote a letter.\"",
							"\"He walked around the block.\""
						],
						"**Imperfective**: The situation is viewed from \"inside\" as an ongoing process.",
						[
							"\"She writes a letter.\"",
							"\"He walks around the block.\""
						],
						"**Perfect**: A currently relevant state brought about by the verb.",
						[
							"\"She has written a letter.\"",
							"\"He has walked around the block.\""
						],
						"**Pluperfect**: A combination of Perfect aspect and Past tense; the currently relevant state was brought about in the past.",
						[
							"\"She had written a letter.\"",
							"\"He had walked around the block.\""
						],
						"**Completive**: Refers to the end of a situation.",
						[
							"\"She finished writing a letter.\"",
							"\"He finished walking around the block.\""
						],
						"**Inceptive**: Refers to the beginning of a situation.",
						[
							"\"She started writing a letter.\"",
							"\"He began walking around the block.\""
						],
						"**Continuative/Progressive**: This implies an ongoing, dynamic situation.",
						[
							"\"She is writing a letter.\"",
							"\"He is walking around the block.\""
						],
						"**Habitual**: This implies an event or state happens regularly.",
						[
							"\"She often writes a letter.\"",
							"\"He usually walks around the block.\""
						],
						"**Punctual**: The state or event is too short to have an internal structure.",
						[
							"\"She coughed.\""
						],
						"**Iterative**: A Punctual state or event takes place several times in succession.",
						[
							"\"He is coughing.\""
						],
						"**Atelic**: An event that has no clearly defined end-point.",
						[
							"\"He is coughing and coughing and coughing.\""
						],
						"**Telic**: Has a clearly defined end-point.",
						[
							"\"She is near the end of her walk.\""
						],
						"**Static**: A changeless state.",
						[
							"\"He is just plain boring.\""
						]
					],
					true,
					"Languages may handle certain aspects in different ways.",
					[
						"English uses context for most aspects.",
						"Spanish uses morphology for Perfective and Imperfective aspects, and uses a morphological/analytical combination for Perfect.",
						"Mandarin has a Perfective particle.",
						"Finnish uses an accusative case for Perfective and a \"partitive\" case for Progressive.",
						[
							"In human languages, case markers like this can be mistaken for TAM markers!"
						]
					],
					true,
					"Progressive aspect constructions often derive from locational structures.",
					[
						"English has gone from \"He is at walking\" to \"He is a-walking\" (still used in some places) to \"He is walking\"."
					],
					true,
					"There is often a link between aspect marking and location/direction marking. English has some examples:",
					[
						"I //came// to see it as an abberation (inceptive)",
						"I cut //away// at the handcuffs (imperfective)",
						"I drank your milkshake //up// (perfective)"
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_aspect,
				setProp: useCallback((value) => setText({prop: "aspect", value}), [setText]),
				rows: 8,
				content: "Describe the way the language handles Aspect."
			},
			{
				tag: "Header",
				level: 3,
				content: "8.3.3 Mode"
			},
			{
				tag: "Modal",
				id: "Mode",
				title: "Mode",
				label: "Info on Mode",
				content: [
					"**Mode** describes a speaker's attitude toward a situation, including how likely or truthful it is, or how relevant the situation is to them.",
					"Mode, Mood and Modality are often used interchangeably, though some linguists make distinctions between them.",
					true,
					"The highest-level Mode distinction is the Realis-Irrealis Continuum.",
					[
						"**Realis**: the speaker insists the situation is real, or holds true.",
						"**Irrealis**: the speaker makes no claim as to the situation's reality or truthfulness.",
						[
							"Conditional statements (if X...) are inherently Irrealis.",
							"Interrogative statements (questions) and imperative statements (commands) tend to be treated as Irrealis.",
							"Other statements that tend to be treated as Irrealis:",
							[
								"Subjunctive (possibility, what if)",
								"Optative (wishes)",
								"Hypothetical/Imaginary",
								"Probability",
								"Deontic (obligations: should, must, have to)",
								"Potential (might, ability to; sometimes considered very weak Deontic)"
							]
						],
						true,
						"Evidentiality and Validationality are sometimes part of the Mode system. They can also stand alone (8.5)."
					],
					true,
					"Negative assertions (see 9.2) can be Realis or Irrealis depending on how strongly the assertion is, but some languages still treat all negative statements as Irrealis.",
					true,
					"Mode interacts strongly with Tense and Aspect.",
					[
						"Habitual aspect is inherently less Realis than Perfective aspect.",
						"Statements that are more Realis are more likely to be definite and referential.",
						[
							"Steve ate the candy. (Perfective)",
							"Steve always eats candy. (Habitual)",
							"Steve always eats the candy. (Technically grammatical, but sounds \"wrong\")"
						]
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_mode,
				setProp: useCallback((value) => setText({prop: "mode", value}), [setText]),
				rows: 6,
				content: "Describe how the language deals with Mode."
			},
			{
				tag: "Header",
				level: 2,
				content: "8.4. Location/Direction"
			},
			{
				tag: "Modal",
				id: "LocationandDirection",
				title: "Location and Direction",
				label: "Where?",
				content: [
					"While Tense grounds statements in time, some languages grammaticize location and/or direction markers to ground statements in space. It may be even more central to discourse than tense in some languages.",
					true,
					"Directional formatives are often related to basic verbs of motion (go, come, arrive, depart, return, go up, go down).",
					true,
					"Some languages (Lahu, Tibeto-Burman languages) have one motion verb and use directional formatives to indicate progression towards (hither) or away from (thither) a point of reference.",
					true,
					"Locational marking is often culturally or geographically relevant to the culture that speaks it.",
					[
						"Quechua, spoken in the Andes mountains, has suffixes that indicate uphill, downhill, and \"at the same altitude\".",
						"Yagua, spoken in Peruvian lowland rivers, has suffixes that indicate an action was performed upriver, downriver, or moving horizontally across land or water.",
						[
							"There are also suffixes that express if an action happened on arrival at a new scene, or on arrival at the current scene."
						]
					],
					true,
					"Papuan languages have extensive markers that can be used in combination, i.e. \"She moved it down and away from her.\"",
					"Otomí has auxiliaries than indicate an action is towards (centric) or away from (exocentric) a designated center (usually where the speaker is)."
				]
			},
			{
				tag: "Text",
				prop: TEXT_locDirect,
				setProp: useCallback((value) => setText({prop: "locDirect", value}), [setText]),
				rows: 8,
				content: "Does the language have affixes or other functions that represent spatial grounding?"
			},
			{
				tag: "Header",
				level: 2,
				content: "8.5. Evidentiality, Validationality and Mirativity"
			},
			{
				tag: "Modal",
				id: "Evidentiality",
				title: "Evidentiality",
				label: "Truth and Certainty",
				content: [
					"**Evidentiality** expresses how much evidence the speaker has to make this assertion. For instance, first-hand knowledge is more evidential than third-hand suspect information.",
					"**Validationality** is sometimes separate from Evidentiality. It is how languages express relative certainty of truth. We are more likely to be certain of:",
					[
						"Past events vs future events",
						"The completion of Perfective events vs still-in-progress events",
						"Realis assertions vs Irrealis assertions"
					],
					"**Mirativity** expresses how well this information fits into the speaker's worldview.",
					[
						"\"The cat was found on the roof\" has high mirativity.",
						"\"The elephant was found on the roof\" would be surprising, and therefore has very low mirativity."
					],
					true,
					"These markers often operate on the clause level rather than the verb-phrase level. They tend to be tightly tied to TAM.",
					true,
					"The most common type of evidential marker is the Hearsay particle.",
					true,
					"Tuyuca has a complex, five-level system:",
					[
						"Witnessed by the speaker",
						"Not witnessed by the speaker",
						"General knowledge",
						"Inferred from evidence",
						"Hearsay"
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_evidence,
				setProp: useCallback((value) => setText({prop: "evidence", value}), [setText]),
				rows: 6,
				content: "Are there any grammaticized indicators of Evidentiality, Validationality, or Mirativity?"
			},
			{
				tag: "Header",
				level: 2,
				content: "8.6. Miscellaneous"
			},
			{
				tag: "Modal",
				id: "Miscelaneous",
				title: "Miscelaneous",
				label: "Leftovers",
				content: [
					"There are miscellaneous verb-phrase operations that might or might not exist.",
					[
						"Lexical time reference (as opposed to tense)",
						[
							"English: \"Yesterday\", \"today\"",
							"Koyukon: \"ee-\" means \"once only\"",
							"Yagua: \"-jásiy\" means \"earlier today\""
						],
						"Distributive, i.e. \"back and forth\" or \"all over the place\"",
						"Environmental modification of motion verbs, i.e. \"at night\", \"over water\"",
						"Speaker attitude, i.e. \"disgusted\" or \"complaining\""
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_miscVerbFunc,
				setProp: useCallback((value) => setText({prop: "miscVerbFunc", value}), [setText]),
				rows: 4,
				content: "Does the language have any other notable verb phrase operations?"
			}
		],
		"s09": [
			{
				tag: "Header",
				level: 1,
				content: "9. Pragmatically Marked Structures"
			},
			{
				tag: "Modal",
				id: "Pragmatics",
				title: "Pragmatics",
				label: "What are Pragmatics?",
				content: [
					"Pragmatics is the interpretation of utterances, and Pragmatic Statuses relate the //content// of an utterance to its //context//. They cover the following concepts:",
					[
						"**Identifiability**: can an argument be identified by the listener?",
						[
							"English uses proper names and \"the\" to indicate identifiability."
						],
						"**Objective Referentiality**: is an argument a bounded, individual entity?",
						[
							"English can be ambiguous: Does \"I'm looking for a housekeeper\" mean anyone who is housekeeper, or a specific housekeeper the speaker is not naming?",
							"Spanish has a particle //a// for human arguments that indicates a specific individual is being talked about.",
							[
								"\"Buscando una empleada\" - I'm looking for a (any) housekeeper",
								"\"Buscando a una empleada\" - I'm looking for a (specific) housekeeper"
							]
						],
						"**Discourse Referentiality**: is an argument relevant to the discourse or just adjacent?",
						[
							"Panago: putting a new argument before a verb \"foreshadows\" that the argument will be important later. Putting it after the verb means it's just transitory.",
							"English often uses //this// to indicate importance. If you hear someone say, \"Take a look at //this// guy,\" you can be sure they're going to continue talking about the guy!"
						],
						"**Focus** covers multiple concepts:",
						[
							"**Marked Focus**:",
							[
								"\"Mom //did// give me permission!\" - English uses \"do\" to focus on the truth of a statement, often in opposition to the listener's beliefs."
							],
							"**Assertive Focus**:",
							[
								"\"Mary was wearing //this hideous bridesmaid's dress//.\" - the speaker believes the listener has no knowledge of the information."
							],
							"**Counter-Presuppositional Focus**:",
							[
								"\"The nerd and the cheerleader came to the party, but //the nerd// won everyone's hearts.\" - the speaker believes the listener believes the opposite."
							],
							"**Exhaustive Focus**:",
							[
								"\"I //only// spoke to Ned.\" - the speaker excludes all other possible options."
							],
							"**Contrastive Focus**:",
							[
								"\"//Mary// chose the dresses.\" - the listener may believe one participant had a specific role, but the speaker is saying someone else held that role."
							]
						],
						"**Topic**:",
						[
							"\"//Beans//, how I hate them.\" - a new argument is declared as a topic of further discourse."
						]
					]
				]
			},
			{
				tag: "Header",
				level: 2,
				content: "9.1 Focus, Contrast and Topicalization"
			},
			{
				tag: "Modal",
				id: "FocusContrastetc",
				title: "Focus, Contrast, etc.",
				label: "Focus is What This is About",
				content: [
					"**Intonation and Vocalization**, such as tempo changes (\"Do. Not. Do. That.\"), volume changes (screaming, whispering), and pitch changes (\"Do //not// do that\"), are nearly universal.",
					true,
					"**Constituent Order**:",
					[
						"Practically all language use **Preposing**, moving an argument by itself to a position before a clause that it's relative to. The opposite is **Postposing**.",
						[
							"\"//Potatoes//, I like them.\""
						],
						"**Fronting** is similar, but rearranges arguments so that Pragmatic Status is given to the moved argument.",
						[
							"\"//Potatoes// I like.\""
						],
						"**Apposition** is adding a free noun phrase to a clause.",
						[
							"\"//Termites//. Why does the universe hate me?\""
						],
						"**Clefting** is a type of predicate nominal where a noun phrase is joined to a relative clause that references that original noun phrase. (See below.)",
						[
							"\"//You// are //the one that I want//.\""
						]
					],
					true,
					"**Formatives** move along a continuum between morphological case markers (4.4) and pragmatic status markers:",
					[
						"The continuum:",
						[
							"**Pragmatic Status Markers**: English articles, Aghem focus particles (see below), etc.",
							"**Overlay systems**: Japanese and Korean \"topic marking\"",
							"**Case Markers**: Latin, Eskimo, Russian, Quechua, etc."
						],
						"Remember that these can partially correlate with grammatical roles: e.g. English //subjects// are often also //identifiable//.",
						[
							true,
							"Aghem uses verb morphology and focus particles to express various pragmatic nuances.",
							[
								"\"énáʔ //mɔ̀// fúo kí-bɛ́ â fín-ghɔ́\" - Inah gave fufu to his friends.",
								"\"énáʔ //má՚á// fúo kí-bɛ́ â fín-ghɔ́\" - Inah //DID// give fufu to his friends. (truth focus)",
								true,
								"\"fú kí mɔ̀ ñiŋ //nò// á kí-՚bé\" - The rat //ran// (did not walk, scurry, etc) in the compound.",
								"\"fú kí mɔ̀ ñiŋ á kí-՚bé //nò//\" - The rat ran in //the compound// (not in the house, church, etc.)."
							],
							true,
							"Akam has a focus particle //na// and a contrastive particle //de//.",
							[
								"\"Kwame //na// ɔbɛyɛ adwuma no.\" - It's Kwame (not anyone else) who will do the work.",
								"\"Kwame //de// ɔbɛkɔ, na Kofi //de// ɔbɛtena ha.\" - Kwame will go, but Kofi will stay here."
							],
							true,
							"**Overlay** systems are a combination of case-marking systems and pragmatic status-marking systems: one or more basic case markers are replaced (overlaid) by the status marker when a nominal is singled out for pragmatic treatment.",
							[
								"The Japanese topic marker //wa// can overlay the subject marker //ga// or the object marker //o//.",
								[
									"\"taroo //ga// hon //o// katta.\" - Taro bought a book.",
									"\"taroo //wa// hon o katta.\" - As for Taro, he bought a book.",
									"\"hon //wa// taroo ga katta.\" - As for the book, Taro bought it."
								]
							]
						]
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_pragFocusEtc,
				setProp: useCallback((value) => setText({prop: "pragFocusEtc", value}), [setText]),
				rows: 8,
				content: "Are there special devices for indicating Pragmatic Statuses in basic clauses? Describe cleft constructions, if there are any."
			},
			{
				tag: "Header",
				level: 2,
				content: "9.2 Negation"
			},
			{
				tag: "Modal",
				id: "Negation",
				title: "Negation",
				label: "Don't not read this.",
				content: [
					"Common negation strategies:",
					[
						"**Clausal negation** - negates an entire proposition",
						[
							"\"I didn't do it.\""
						],
						"**Constituent negation** - negates a particular constituent of a proposition",
						[
							"\"I have no motive.\""
						]
					],
					true,
					"**Clausal Negation**",
					[
						true,
						"**Lexical Negation**",
						[
							"Some verbs just function as the opposite of other verbs, such as \"have\" vs \"lack\"."
						],
						true,
						"**Morphological Negation**",
						[
							"Clausal negations are usually associated with the verb.",
							"Often tied to other verbal inflections, such as expressing aspect or tense."
						],
						true,
						"**Analytical Negation**",
						[
							"This includes negative particles and negative finite verbs.",
							true,
							"**Multiple Expressions of Negation**",
							[
								"It's common for negative constructions to have multiple operators, e.g:",
								[
									"two particles",
									"a particle and an affix",
									"a particle, an affix, and a word order change"
								]
							],
							true,
							"**Different Kinds of Negation**",
							[
								"In many languages, the negative affix or particle varies according to tense, aspect, mode, or other factors.",
								[
									"It's fairly common for negative imperatives to differ from negative assertions (e.g. Mandarin, Hebrew, Tennet).",
									"Tagalog and many Austronesian languages use different particles for plain negatives and negation of existence.",
									[
										"\"Mayroon ka ang pera?\" \"Wala.\" - Do you have any money? None.",
										"\"Pupunta ka ba sa sayawan?\" \"Hindi.\" - Are you going to the dance? No."
									],
									"Mandarin has //méi// for existential negatives, //bié// for negative imperatives, and //bu// for everything else.",
									"Iraqi Arabic has one particle (mɑː) for verbal predicates and another (muː) for verbless predicates (predicate nominals, locationals, existentials, etc.)."
								],
								true,
								"Another method is a finite negative verb and a complement clause (10, 10.2)",
								[
									"The negative verb will take finite inflectional morphology and occur in the normal position for a verb. The affirmative verb will be treated like a complement verb.",
									"This occurs primarily in verb-initial and verb-final languages.",
									[
										"Tungan, a verb-initial language:",
										[
											"\"Na'e-//alu// 'a Siale\" - Charlie went.",
											"\"Na'e-//'ikai// ke //'alu// 'a Siele\" - Charlie didn't go."
										]
									]
								]
							]
						],
						true,
						"**Secondary Methods of Negation**",
						[
							"Alternate word order:",
							[
								"Many VP languages change their order for negative clauses. For example, Kru uses AVP for affirmative clauses and APV in negative clauses."
							],
							"Change in tone:",
							[
								"Igbo carries a low tone in affirmative clauses and a high tone in negative clauses."
							],
							"Neutralization of tense-aspect distinctions:",
							[
								"Komi has a present-future distinction in affirmative, but no such distinction in the negative.",
								"Bembe allows two future tense markers in affirmative, but only one of them in the negative."
							],
							"Special inflections:",
							[
								"A few languages have special person/number ot TAM markers on verbs in negative clauses. (Negative verbs tend to hold onto older patterns that have been lost in affirmative clauses!)"
							],
							"Alternative case-marking patterns:",
							[
								"Special case-marking patterns may occur in negative clauses. For example, with certain Russian verbs, the object will be in accusative for affirmative clauses and in genitive case in negative clauses."
							]
						],
						true,
						"**Constituent Negation**",
						[
							true,
							"**Derivational Negation**:",
							[
								"Some languages allow a derivation of a stem to transform it into its opposite.",
								"English has the not-fully-productive //non-// and //un-// prefixes that only work on adjectives and nominals.",
								"Panare has a verbal suffix //-(i)ka// that forms something akin to the opposite of the root verb."
							],
							true,
							"**Negative Quantifiers**:",
							[
								"Many languages have inherently negative quantifiers (\"none\", \"nothing\") or can be negated independent of clause (\"not many\").",
								"Most languages allow or require such quantifiers to be accompanied by clausal negation.",
								[
									"Standard English is rare in disallowing such use of \"double negatives\"."
								]
							]
						],
						true,
						"**Negative Scope**:",
						[
							"Sometimes the two types of negation interact to cause variations in the scope of what can be negated.",
							{
								tabular: true,
								rows: [
									[
										"**Statement**",
										"**Scope**"
									],
									[
										"\"Not many rats survive to adulthood.\"",
										"Quantifier only"
									],
									[
										"\"Many rats do not survive to adulthood.\"",
										"Entire clause"
									],
									[
										"\"I deliberately didn't eat the cheese.\"",
										"Entire clause"
									],
									[
										"\"I didn't deliberately eat the cheese.\"",
										"Adverb only"
									],
									[
										"\"He won't force you to volunteer.\"",
										"Entire clause"
									],
									[
										"\"He will force you not to volunteer.\"",
										"Complement clause"
									]
								]
							}
						]
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_negation,
				setProp: useCallback((value) => setText({prop: "negation", value}), [setText]),
				rows: 8,
				content: "Describe the standard way of creating a negative clause, plus any secondary strategies that may exist. Is there constituent or derivational negation?"
			},
			{
				tag: "Header",
				level: 2,
				content: "9.3 Non-Declarative Speech"
			},
			{
				tag: "Modal",
				id: "DeclarativeStatements",
				title: "Declarative Statements",
				label: "Minor Note on Declaratives",
				content: [
					"A declarative statement is an assertion. Most speech is declarative.",
					"Other types of statements are usually handled as \"modes\" in a language, such as interrogative (questions) and imperatives (commands).",
					true,
					"Most often, a language will leave declarative statements unmarked and only mark the others. But some (e.g. Tibetan) will mark declaratives, too."
				]
			},
			{
				tag: "Text",
				prop: TEXT_declaratives,
				setProp: useCallback((value) => setText({prop: "declaratives", value}), [setText]),
				rows: 3,
				content: "If declaratives are marked, describe how."
			},
			{
				tag: "Header",
				level: 3,
				content: "9.3.1 Interrogatives"
			},
			{
				tag: "Header",
				level: 4,
				content: "9.3.1.1. Yes/No Questions"
			},
			{
				tag: "Modal",
				id: "YesNoQuestions",
				title: "Yes/NoQuestions",
				label: "Yes? No?",
				content: [
					"**Yes/No Questions**, hereafter referred to as //YNQs//, are interrogative clauses where the expected answer is either \"yes\" or \"no\". They can employ any or all of the strategies below.",
					true,
					"//Intonation//:",
					[
						"There tends to be distinct intonation patterns in YNQs.",
						"The pattern is usually rising, as in English, but can be falling, as in Russian.",
						true,
						"Some languages //only// employ intonation!"
					],
					true,
					"//Word Order//:",
					[
						"Many languages, especially VP languages, use distinctive constituent orders for YNQs.",
						"Usually, this is an inversion of the Agent and Verb, as in many European and Austronesian languages.",
						[
							"\"bapak datangkah nanti\" - Father will come later (Malay)",
							"\"datangkah bapak nanti\" - Will father come later?"
						],
						"English has a strange system where it reverses the Agent and the auxiliary verb. If no auxiliary is present, the verb \"do\" is inserted.",
						[
							"\"He will arrive on time\" → \"Will he arrive on time?\"",
							"\"They can eat cake\" → \"Can they eat cake?\"",
							"\"You want to join me\" (no auxiliary) → \"Do you want to join me?\""
						],
						"American English uses simple Agent/Verb inversion in predicate nominals, existential and locational clauses. British English extends this to possessive constructions.",
						[
							"\"He is a cat\" → \"Is he a cat?\"",
							"\"Cats are under the bed\" → \"Are cats under the bed?\"",
							"\"You were in the garden\" → \"Were you in the garden?\"",
							"\"You have a match\" → \"Have you a match?\" (British)"
						]
					],
					true,
					"//Interrogative Particle//:",
					[
						"Question Particles (QPs) are very common, especially among PV languages, but they do appear in VP languages, too.",
						"The QP can be cliticized to the first constituent in the clause, either before or after it.",
						[
							"Latin:",
							false,
							{
								tabular: true,
								rows: [
									[
										"erat-ne",
										"te-cum"
									],
									[
										"he:was-QP",
										"you-with"
									]
								],
								final: "Was he with you?"
							},
							"Mandarin:",
							false,
							{
								tabular: true,
								rows: [
									[
										"tā",
										"xihuan",
										"chī",
										"pǐngguǒ",
										"ma"
									],
									[
										"she",
										"like",
										"eat",
										"apple",
										"QP"
									]
								],
								final: "Does she like to eat apples?"
							},
							"Tagalog:",
							false,
							{
								tabular: true,
								rows: [
									[
										"mabait",
										"ba",
										"si",
										"Pilar?"
									],
									[
										"kind",
										"QP",
										"is",
										"Pilar"
									]
								],
								final: "Is Pilar kind?"
							}
						],
						"Often, the QP can be omitted, letting context and intonation do the job instead.",
						true,
						"Some varieties of English have developed a QP as an alternative to word order inversion",
						[
							"\"You want to go for a ride, //eh//?\""
						]
					],
					true,
					"//Tag Question//:",
					[
						"This involves a simple declarative statement, followed by a Tag that requests confirmation or disconfirmation of the statement.",
						"These are universally a secondary way of forming YNQs, though they are often the historical source of the currently-used QPs.",
						true,
						"English has Tags for certain times the speaker is assuming they'll get a Yes response:",
						[
							"\"Nice day, //isn't it//?\"",
							"\"You're going to the club with us tonight, //right//?\""
						]
					],
					true,
					"**Functions**:",
					[
						"YNQs are used for additional purposes other than simply asking questions in most languages.",
						true,
						"//To request action//: \"Could you close the door?\"",
						"//Rhetorical effect//: \"Are you always so messy?\"",
						"//Confirmation//: \"Aren't you going?\"",
						"//Intensification//: \"Did he ever yell!\""
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_YNQs,
				setProp: useCallback((value) => setText({prop: "YNQs", value}), [setText]),
				rows: 4,
				content: "How are yes/no questions formed? Do they serve other discourse functions other than the obvious?"
			},
			{
				tag: "Header",
				level: 4,
				content: "9.3.1.2. Questions-Word Questions"
			},
			{
				tag: "Modal",
				id: "QuestionWordQuestions",
				title: "Question-Word Questions",
				label: "Who? What? Why?",
				content: [
					"Also known as **Content Questions** or **Information Questions**, Question-Word Questions (QWs) are best exemplified by the English words who, whom, what, where, when, why, which, and how.",
					"All languages have a set of special QWQs. Often, they're similar or identical to a set of pronouns used elsewhere in the language. (e.g. English's who, where, when.)",
					"QWs accomplish two things:",
					null,
					[
						"1. Mark the clause as a question.",
						"2. Indicate what information is being requested."
					],
					null,
					true,
					"In VP languages (like English) it is typical for the QW to appear at the start of the clause, possibly leaving a gap in the normal position.",
					[
						"\"Mark gave the cakes to Jimmy.\" → \"Who gave the cakes to Jimmy?\" → \"Who did Mark give the cakes to?\""
					],
					"Many PV languages leave the QW in the \"normal\" position, such as Japanese and Tibetan.",
					"Most PV languages can either leave the QW in position, or it can move to the front.",
					"Some VP languages allow or require leaving the QW in position, such as Mandarin and many eastern African languages.",
					true,
					"QWs can usually take case markers and/or adpositions.",
					[
						"When the QW from an oblique clause is fronted, the adposition may or may not come with it.",
						[
							"//What// did you travel //with//?",
							"//With what// did you travel?"
						]
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_QWQs,
				setProp: useCallback((value) => setText({prop: "QWQs", value}), [setText]),
				rows: 4,
				content: "How are information questions formed?"
			},
			{
				tag: "Header",
				level: 4,
				content: "9.3.2. Imperatives"
			},
			{
				tag: "Modal",
				id: "Imperatives",
				title: "Imperatives",
				label: "Command Sentences",
				content: [
					"Imperatives are direct commands to an addressee.",
					"It is often not necessary to indicate the Agent (addressee), since the actor is obvious.",
					"Fewer TAM constructs are typically allowed, since it is pragmatically impossible to perform certain actions (past tense, present progressive, etc).",
					"Sometimes imperatives take special verb forms or affixes, as in Greenlandic Iñupiat, and/or special negation strategies.",
					true,
					"Imperatives are often associated with Irrealis modes (8.3.3)",
					true,
					"Sometimes imperatives affect case marking.",
					[
						"Finnish puts the Patients of imperatives in nominative case instead of accusative case."
					],
					true,
					"Different types of imperatives may exist.",
					[
						"In Panare, the suffix //-kë// is for plain imperatives, while //-ta'// is used for imperatives involving motion."
					],
					true,
					"First-person imperatives are rare. (e.g. \"Let's eat.\" vs \"Come eat with me.\")"
				]
			},
			{
				tag: "Text",
				prop: TEXT_imperatives,
				setProp: useCallback((value) => setText({prop: "imperatives", value}), [setText]),
				rows: 4,
				content: "How are imperatives formed? Are there \"polite\" imperatives that contrast with more direct imperatives?"
			}
		],
		"s10": [
			{
				tag: "Header",
				level: 1,
				content: "10. Clause Combinations"
			},
			{
				tag: "Modal",
				id: "Terms",
				title: "Terms",
				label: "Quick Primer on Clauses",
				content: [
					"An **Independant Clause** is one that is fully inflected and can stand on its own.",
					"A **Dependant Clause** depends on some other clause for at least a part of its inflectional information.",
					true,
					"\"The gull beat its wings, achieving liftoff easily.\"",
					[
						"//The gull beat its wings// is Independant.",
						"//Achieving liftoff easily// is Dependant."
					],
					true,
					"\"Breathing heavily, the runner crossed the finish line.\"",
					[
						"//The runner crossed the finish line// is Independant.",
						"//Breathing heavily// is Dependant."
					]
				]
			},
			{
				tag: "Header",
				level: 1,
				content: "10.1. Serial Verbs"
			},
			{
				tag: "Modal",
				id: "SerialVerbs",
				title: "Serial Verbs",
				label: "Go Tap on This",
				content: [
					"**Serial Verbs** are two or more verb roots that aren't compounded (8.2) or members of different clauses.",
					"These occur in all sorts of languages, but may be more common in isolating languages (1.1).",
					"English marginally employs serial verbs, e.g. \"Run go get me a coffee\" having three in a row.",
					true,
					"Typically, verbs in a series will each express a facet of one complex event.",
					[
						"For example, the English word \"bring\" has a facet \"get something\" and another that's \"move towards place\". In a language like Yoruba, this is expressed with serial verbs:",
						[
							"\"mo mú ìwé wá ilé\" / I take book come house - \"I brought a book home\""
						]
					],
					true,
					"In general, serial verbs tend to follow these patterns:",
					[
						"TAM information is carried by the first verb.",
						[
							"However, some languages mandate that at least some inflectional information gets carried by the second verb."
						],
						"If a constituent of the second verb is clefted, it moves to the front of the entire construction.",
						[
							"Youruba: \"ilé ni mo mú ìwé wá\" / house is I take book come - \"It was to the house that I brought a book\""
						],
						"They can get ambiguous out of context.",
						[
							"Thai: \"John khàp rót chon kwaay taay\" / John drive car collide buffalo die",
							"The above means \"John drove the car into the buffalo and [any one of those three] died.\" Only context can make it clear that John, the buffalo or the car died."
						]
					],
					true,
					"Verbs of motion are often used in serial constructions to express TAM information.",
					[
						"\"Go\" is used in this way so much that it often becomes a marker for future tense, as in English and Spanish.",
						[
							"\"I'm going to finish this sandwich.\""
						],
						"Tibetan uses motion verbs in serial to provide directional information for the other verb."
					],
					true,
					"Verbs in serial will sometimes turn into other role markers.",
					[
						"Yoruba: \"give\" can mark a Recipient role.",
						"Efik: \"give\" has become a benefactive preposition.",
						"Sùpyìré: \"use\" has become a postpositional marker for an Instrumental role."
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_serialVerbs,
				setProp: useCallback((value) => setText({prop: "serialVerbs", value}), [setText]),
				rows: 4,
				content: "Does the language have serial verbs? What verbs are more likely to appear in serial constructions? Are any on the way to becoming auxiliaries or adpositions?"
			},
			{
				tag: "Header",
				level: 1,
				content: "10.2. Complement Clauses"
			},
			{
				tag: "Modal",
				id: "ComplementClauses",
				title: "Complement Clauses",
				label: "Enter The Matrix",
				content: [
					"A **Complement Clause** (or Embedded Clause) functions as an argument to another clause.",
					"A **Matrix Clause** (or Main Clause) has a Complement Clause as an argument.",
					true,
					"Complements can be in the Agent or Patient role. They are marked with [brackets] below:",
					[
						"//Agent//: [That he survived] was unexpected.",
						[
							"English typically postposes an Agent Complement Clause and uses a dummy \"It\": //[It] was unexpected [that he survived].//"
						],
						"//Patient//: He wants [to have a drink]."
					],
					"A Matrix Clause can be a Complement Clause to another Matrix Clause:",
					[
						"Mulder wants [to believe [that aliens are real]]."
					],
					true,
					"Complement Clauses run in a continuum from **finite clauses** to **non-finite clauses**.",
					[
						"//Finite//: [That he would be handsome] could not have been anticipated.",
						[
							"The complement can stand alone as a complete sentence (minus the marker \"That\").",
							"It can have completely different TAM markers than the maxtrix clause.",
							"The matrix verb will likely be an utterance verb or a verb of cognition."
						],
						"//Non-finite//: It's very easy [to make a sandwich].",
						[
							"The subject of the clause will almost always be the subject of the matrix clause.",
							"TAM markers are absent or highly constrained.",
							"The verb in the clause will likely be non-finite."
						]
					],
					true,
					"**Indirect Questions** are a subset of Complement Clauses.",
					[
						"Example: [Whether Mr. Wayne lied] is not relavant here.",
						"They may share formal properties with interrogative clauses and relative clauses."
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_complClauses,
				setProp: useCallback((value) => setText({prop: "complClauses", value}), [setText]),
				rows: 6,
				content: "What kinds of complement clauses does the language have? Are certain complement types more common for certain classes of verbs? Does the language allow Agent complements, or just Patient complements?"
			},
			{
				tag: "Header",
				level: 1,
				content: "10.3. Adverbial Clauses"
			},
			{
				tag: "Modal",
				id: "AdverbialClauses",
				title: "Adverbial Clauses",
				label: "Tap This When You're Ready",
				content: [
					"Also called //Adjuncts//, **Adverbial Clauses** behave as adverbs.",
					"They can convey certain kinds of information:",
					[
						"//Time//:",
						[
							"\"We will go [when he gets here].\""
						],
						"//Location//:",
						[
							"\"I will meet you [where the old oak tree used to stand].\""
						],
						"//Manner//:",
						[
							"\"He talks [like a 3-year-old].\"",
							"\"He walks [as a mummy would shamble].\""
						],
						"//Purpose//:",
						[
							"\"He stands on tiptoes [in order to see better].\""
						],
						"//Reason//:",
						[
							"\"He arrived early [because he wanted a good seat].\""
						],
						"//Circumstantial// adverbial clauses are rare:",
						[
							"\"He got into the army [by lying about his age].\""
						],
						"//Simultaneous//:",
						[
							"\"He woke up [crying].\"",
							"\"She woke up [in a cold sweat]\"."
						],
						"//Conditional//:",
						[
							"\"[If it's raining outside], then my car is getting wet.\""
						],
						"//Negative Conditional//:",
						[
							"\"[Unless it rains], we will be having a picnic.\""
						],
						"//Concessive Clause//:",
						[
							"\"[Even though the band sucks], she agreed to go to the concert.\""
						],
						"//Substitutive//:",
						[
							"\"[Instead of barbecuing chicken], we went out to eat.\""
						],
						"//Additive//:",
						[
							"\"You must have your hand stamped [in addition to having your ticket].\""
						],
						"//Absolutive//:",
						[
							"\"[Seeing a bully], Billy hid behind a curtain.\""
						]
					]
				]
			},
			{
				tag: "Text",
				prop: TEXT_advClauses,
				setProp: useCallback((value) => setText({prop: "advClauses", value}), [setText]),
				rows: 6,
				content: "How are adverbial clauses formed? What kinds are there? Can they occur in more than one place in a clause?"
			},
			{
				tag: "Header",
				level: 1,
				content: "10.4. Clause Chaining, Medial Clauses, and Switch References"
			},
			{
				tag: "Modal",
				id: "ClauseChainingMedialClausesandSwitchReferences",
				title: "Clause Chaining, Medial Clauses, and Switch References",
				label: "Chain Chain Chain...",
				content: [
					"**Clause Chains** are clauses presented in series. They can form a large part of discourse in many languages, such as the ones of New Guinea, Australia, and the Americas.",
					[
						"Typially, the last clause in the chain will have inflections for Tense and Aspect.",
						"Panare and a minority of languages switch this up, giving the inflections to the first clause.",
						"**Medial clauses** occur before the **Final clause**.",
						[
							"They tend to have a reduce range of Tense/Aspect possibilities.",
							"Their subject is referenced in terms of subject of the final clause.",
							"Their placement represents temporal relations such as overlapping or in succession."
						]
					],
					true,
					"**Switch References** are verbal inflections that indicate the subject of a verb is the same as the subject of another verb.",
					[
						"Yuman uses //-k// to indicate the next verb uses the same subject (SS) as this one, and //-m// to indicate the next verb will have a different subject (DS).",
						[
							"\"I sang and danced\"",
							false,
							{
								tabular: true,
								rows: [
									[
										"Nyaa",
										"'-ashvar-k",
										"'-iima-k"
									],
									[
										"I",
										"1-sing-SS",
										"1-dance-ASPECT"
									]
								]
							},
							"\"Bonnie sang and I danced\"",
							false,
							{
								tabular: true,
								rows: [
									[
										"Bonnie-sh",
										"0-ashvar-m",
										"'-iima-k"
									],
									[
										"Bonnie-SUBJ",
										"3-sing-DS",
										"1-dance-ASPECT"
									]
								]
							}
						],
						true,
						"Ergative languages often have complex Switch Reference systems that indicate the temporal relations of the clauses, whether or not the verbs' subjects agree, and strongly indicate a reason why the clauses are linked.",
						[
							"Panare: Suffix / Temporal / Agreement / Linkage",
							[
								"-séjpe / succession / Actor = Actor / purpose",
								"-séñape / succession / Absolutive = Patient / result",
								"-ñére / succession / Actors are different / movement or purpose",
								"-npan / overlap / Actor = Actor / none",
								"-tááñe / overlap / Actor = Actor / none",
								"-jpómën / anteriority / Actor = Actor / reason"
							]
						]
					]
				]
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_chainFirst,
					BOOL_chainLast
				],
				setters: [
					useCallback((value) => setBool({prop: "chainFirst", value}), [setBool]),
					useCallback((value) => setBool({prop: "chainLast", value}), [setBool])
				],
				display: {
					header: "Which Clause is Inflected?",
					labels: [
						"First",
						"Last"
					],
					export: {
						title: "Inflected Clause:"
					}
				}
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_chainN,
					BOOL_chainV,
					BOOL_chainCj
				],
				setters: [
					useCallback((value) => setBool({prop: "chainN", value}), [setBool]),
					useCallback((value) => setBool({prop: "chainV", value}), [setBool]),
					useCallback((value) => setBool({prop: "chainCj", value}), [setBool])
				],
				display: {
					header: "Which Element is Marked?",
					labels: [
						"Noun",
						"Verb",
						"Conjunction"
					],
					export: {
						title: "Element Marked:"
					}
				}
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_chainT,
					BOOL_chainA,
					BOOL_chainPer,
					BOOL_chainNum,
					BOOL_chainOther
				],
				setters: [
					useCallback((value) => setBool({prop: "chainT", value}), [setBool]),
					useCallback((value) => setBool({prop: "chainA", value}), [setBool]),
					useCallback((value) => setBool({prop: "chainPer", value}), [setBool]),
					useCallback((value) => setBool({prop: "chainNum", value}), [setBool]),
					useCallback((value) => setBool({prop: "chainOther", value}), [setBool])
				],
				display: {
					header: "What Other Information Does the Marker Encode?",
					labels: [
						"Tense",
						"Aspect",
						"Person",
						"Number",
						"Other"
					],
					export: {
						title: "Marker Encodes:"
					}
				}
			},
			{
				tag: "Text",
				prop: TEXT_clauseChainEtc,
				setProp: useCallback((value) => setText({prop: "clauseChainEtc", value}), [setText]),
				rows: 6,
				content: "Is the coreference always the Subject, or can the Agent, Patient, or other nominals be referred to? Do the markers convey other information, like person, number, tense, aspect, and/or semantics? Can a clause be inflected for the person/number of another clause?"
			},
			{
				tag: "Header",
				level: 1,
				content: "10.5. Relative Clauses"
			},
			{
				tag: "Modal",
				id: "RelativeClauses",
				title: "Relative Clauses",
				label: "Clauses as Adjectives",
				content: [
					"A **Relative Clause** is a clause that functions as a nominal modifier. They can be identified by four points.",
					[
						"Example: \"The fumes that made Chris faint.\"",
						null,
						[
							"1. //Head//: The noun phrase modified by the clause (fumes)",
							"2. //Restricting Clause//: The relative clause itself (made Chris faint)",
							"3. //Relativized Noun Phrase//: The part of the Restricting Clause that refers to the Head (English uses a Gap Strategy, explained below)",
							"4. //Relativizer//: Morpheme or particle that sets off the relative clause (that)"
						],
						null
					],
					true,
					"Relative Clauses (RCs) are usually positioned in the same place as other nominal modifiers, but there is a strong tendency towards placing them postnomial, even if other modifiers fall before the noun phrase.",
					[
						"//Prenomial//: before the Head",
						"//Postnomial//: after the Head (most common, especially in VP languages)",
						"//Internally headed//: the Head is placed within the relative clause",
						[
							"This is common in PV languages, such as Bambara:",
							false,
							{
								tabular: true,
								rows: [
									[
										"ne",
										"ye",
										"so",
										"ye"
									],
									[
										"1s",
										"PST",
										"horse",
										"see"
									]
								],
								final: "\"I saw a horse\""
							},
							false,
							{
								tabular: true,
								rows: [
									[
										"ce",
										"ye",
										"[ne",
										"ye",
										"so",
										"min",
										"ye]",
										"san"
									],
									[
										"man",
										"PST",
										"1s",
										"PST",
										"horse",
										"REL",
										"see",
										"buy"
									]
								],
								final: "\"The man bought the horse that I saw\""
							}
						],
						"//Headless//: the clause itself refers to the Head",
						[
							"This is common in languages that use nouns to modify other nouns, such as Ndjuká:",
							[
								"Non-specific subject:",
								false,
								{
									tabular: true,
									rows: [
										[
											"[Di",
											"o",
											"doo",
											"fosi]",
											"o",
											"wini"
										],
										[
											"REL",
											"FUT",
											"arrive",
											"first",
											"FUT",
											"win"
										]
									],
									final: "\"Whoever arrives first will win\""
								},
								"Specific subject:",
								false,
								{
									tabular: true,
									rows: [
										[
											"A",
											"mainsí",
											"ya",
											"a",
											"[di",
											"e",
											"tan",
											"a",
											"ini",
											"se]"
										],
										[
											"the",
											"eel",
											"here",
											"COP",
											"REL",
											"CONT",
											"stay",
											"LOC",
											"inside",
											"sea"
										]
									],
									final: "\"The eel is what (the one that) lives in the sea\""
								}
							],
							"But it can happen in other languages, such as English:",
							[
								"Headless RC: [That which John said] annoyed her. (Something specific he said annoyed her)",
								"Complementary Clause: [That John said anything] annoyed her. (The action itself annoyed her)"
							],
							"In many languages, headless construction is allowed when the head noun is nonspecific.",
							[
								"[Whenever I'm afraid] I call her. (Refers to a time that is not specified otherwise)"
							]
						]
					],
					true,
					"The Relativized Noun Phrase (RNP) can be expressed in different ways.",
					[
						"**Gap Strategy**: the RNP is represented by a \"gap\" in the phrase, a missing space (0) where logically some argument would normally go.",
						[
							"English uses this:",
							[
								"Example: The man [that I loved 0] died.",
								"Full noun phrase: [I loved the man]"
							],
							"This is a useful strategy when the semantic role of the Head is different in the RC:",
							[
								"The alligator [that 0 saw me] ate Alice.",
								"The alligator [that I saw 0] ate Alice."
							],
							"However, this can become ambiguous if the constituent order changes often, or when the A and P are next to each other in normal discourse:",
							[
								"Ithsmus Zapotee is a VAP language.",
								false,
								{
									tabular: true,
									rows: [
										[
											"junaa",
											"ni",
											"[najii",
											"0 Juan]"
										],
										[
											"junaa",
											"ni",
											"[najii",
											"Juan 0]"
										],
										[
											"woman",
											"REL",
											"loves",
											"John"
										]
									],
									final: "This could be either \"A woman that loves John\" (top) or \"A woman that Jon loves\"."
								}
							]
						],
						"**Pronoun Retention**: a pronoun is retained to indicate grammatical role.",
						[
							"Typically, the pronoun is similar to other pronouns, either question words or pronouns used for non-specific, indefinite things.",
							[
								"Example: That's the guy who [I can never remember //his// name]"
							]
						],
						true,
						"The Relativizer may be marked to show the NPR's role.",
						[
							"Chickasaw:",
							false,
							{
								tabular: true,
								rows: [
									[
										"ihoo",
										"yamma-ay",
										"ofi'",
										"pĩs-tokat",
										"illi-tok"
									],
									[
										"woman",
										"that-SUB",
										"dog",
										"see-PST:DEP:SS",
										"die-PST"
									]
								],
								final: "\"The woman that saw the dog died\""
							},
							false,
							{
								tabular: true,
								rows: [
									[
										"ihoo-at",
										"ofi'",
										"yamma",
										"pĩs-tokã",
										"illi-tok"
									],
									[
										"woman-SUB",
										"dog",
										"that",
										"see-PST:DEP:DS",
										"die-PST"
									]
								],
								final: "\"The woman that the dog saw died\""
							}
						]
					],
					true,
					"Relativization Hierarchy:",
					[
						"Subject",
						"Direct Object",
						"Indirect Object",
						"Oblique",
						"Possessor"
					],
					"No language (that uses the above grammatical roles) allows relativization of an element, using a single strategy, without also allowing relativizing of the elements above it in the hierarchy. Other elements may have other relativization strategies. For example, English uses the Gap Strategy down through the Obliques, but it doesn't apply to the Possessors:",
					[
						"//Subject//: I hate the guy that [0 dumped her].",
						"//Direct Object//: I hate the guy that [she dated 0].",
						"//Indirect Object//: I hate the guy that [she gave her heart to 0].",
						"//Oblique//: I hate the guy that [she lived with 0].",
						"//Oblique//: I hate the guy that [she is older than 0].",
						"//Possessor//: --I hate the guy that [0 head is bald].--",
						[
							"This is not valid English. Another strategy has to be used: \"I hate the guy [whose head is bald].\""
						]
					]
				]
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_relPre,
					BOOL_relPost,
					BOOL_relInternal,
					BOOL_relHeadless
				],
				setters: [
					useCallback((value) => setBool({prop: "relPre", value}), [setBool]),
					useCallback((value) => setBool({prop: "relPost", value}), [setBool]),
					useCallback((value) => setBool({prop: "relInternal", value}), [setBool]),
					useCallback((value) => setBool({prop: "relHeadless", value}), [setBool])
				],
				display: {
					header: "Types of Relative Clauses",
					labels: [
						"Prenomial",
						"Postnomial",
						"Internally Headed",
						"Headless"
					],
					export: {
						title: "Type of Relative Clauses:"
					}
				}
			},
			{
				tag: "Text",
				prop: TEXT_relClauses,
				setProp: useCallback((value) => setText({prop: "relClauses", value}), [setText]),
				rows: 6,
				content: "Note what strategies are used in Relativizing Clauses, and where they fit on the hierarchy (if it applies)."
			},
			{
				tag: "Header",
				level: 1,
				content: "10.6. Coordinating Clauses"
			},
			{
				tag: "Modal",
				id: "CoordinatingClauses",
				title: "Coordinating Clauses",
				label: "This And That",
				content: [
					"**Coordinating Clauses** are linked together, equal in grammatical status. They may be difficult to distinguish from juxtaposition.",
					"They often use methods identical to those used to join noun phrases:",
					[
						"John //and// Mary",
						"John cried //and// Mary laughed."
					],
					"It's also common for special strategies to exist that do not work for noun phrases:",
					[
						"John cried //but// Mary laughed."
					],
					true,
					"CCs often express **Coordination** (x and y, neither x nor y), **Disjunction** (either x or y), and **Exclusion** (x and not y).",
					true,
					"The **Zero Strategy** looks just like juxtaposition. Vietnamese:",
					[
						"//Noun Phrases//:",
						false,
						{
							tabular: true,
							rows: [
								[
									"Nháng",
									"tiráp",
									"[tilêt,",
									"callóh,",
									"acóq]"
								],
								[
									"we",
									"prepare",
									"basket",
									"spear",
									"knife"
								]
							],
							final: "We prepared the basket, the spear and the knife."
						},
						"//Prepositional Phrases//:",
						false,
						{
							tabular: true,
							rows: [
								[
									"Do",
									"chô",
									"[tôq",
									"cyâq,",
									"tôq",
									"apây]"
								],
								[
									"she",
									"return",
									"to",
									"husband",
									"to",
									"grandmother"
								]
							],
							final: "She returned to her husband and to her grandmother."
						},
						"//Verb Phrases//:",
						false,
						{
							tabular: true,
							rows: [
								[
									"Do",
									"[chô",
									"tôq",
									"cayâq,",
									"chô",
									"tôq",
									"apây]"
								],
								[
									"she",
									"return",
									"to",
									"husband",
									"return",
									"to",
									"grandmother"
								]
							],
							final: "She returned to her husband and returned to her grandmother."
						}
					],
					true,
					"**Coordinating Conjunctions** (CCs) are a common strategy.",
					[
						"The conjunction is often the same as \"with\". English uses \"and\" and \"but\", among others.",
						"In VP languages:",
						[
							"The CC is usually between the two clauses:",
							[
								"The dog growled //and// the cat hissed."
							],
							"But sometimes, the CC comes after the first element of the second clause.",
							[
								"Yoruba:",
								false,
								{
									tabular: true,
									rows: [
										[
											"mo",
											"mú",
											"ìwé;",
											"mo",
											"sì",
											"w's",
											"ilé"
										],
										[
											"I",
											"take",
											"book",
											"I",
											"and",
											"come",
											"house"
										]
									],
									final: "I took a book and I came home."
								}
							]
						],
						"In PV languages, the CC either comes between the two clauses (Farsi) or after the last element (Walapai)."
					]
				]
			},
			{
				tag: "Checkboxes",
				boxes: [
					BOOL_coordMid,
					BOOL_coordTwo,
					BOOL_coordLast
				],
				setters: [
					useCallback((value) => setBool({prop: "coordMid", value}), [setBool]),
					useCallback((value) => setBool({prop: "coordTwo", value}), [setBool]),
					useCallback((value) => setBool({prop: "coordLast", value}), [setBool])
				],
				display: {
					header: "Coordinating Conjunction Positions",
					labels: [
						"Between the clauses",
						"After the first element of the second clause",
						"After the last element"
					],
					export: {
						title: "Coordinating Conjunction Positions:"				}
				}
			},
			{
				tag: "Text",
				prop: TEXT_coords,
				setProp: useCallback((value) => setText({prop: "coords", value}), [setText]),
				rows: 6,
				content: "Describe how Conjunction, Disjunction and Exclusion are expressed in the language."
			}
		]
	};
	return sections[id];
};

export default getSection;
