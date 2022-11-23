import {
	VStack
} from 'native-base';
import { useSelector } from 'react-redux';

import { Header, Modal, Tabular, T, B, I, P, Range, CheckBoxes, TextArea } from './msTags';

const Section = () => {
	const {
		BOOL_prefixMost,
		BOOL_prefixLess,
		BOOL_suffixMost,
		BOOL_suffixLess,
		BOOL_circumfixMost,
		BOOL_circumfixLess,
		BOOL_infixMost,
		BOOL_infixLess,

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
	} = useSelector(state => state.morphoSyntax);
	return (
		<VStack>
			<Header level={1}>1. Morphological Typology</Header>
			<Header level={2}>1.1. Traditional Typology</Header>
			<Modal label="The Basic Building Blocks of Words" title="Synthesis and Fusion">
				<P><T>Languages can be broadly classified on two continuums based on their <B>morphemes</B>.</T></P>
				<P indent={1}><T>A morpheme is the most basic unit of meaning in a language. For example, the word "cats" has two morphemes: "cat" (a feline animal) and "s" (more than one of them are being talked about).</T></P>
				<P top={2}><T><B>Synthesis</B> is a measure of how many morphemes appear in a word.</T></P>
				<P indent={1}><T>Chinese is very <I>isolating</I>, tending towards one morpheme per word.</T></P>
				<P indent={1}><T>Inuit and Quechua are very <I>polysynthetic</I>, with many morphemes per word.</T></P>
				<P top={2}><T><B>Fusion</B> is a measure of how many meanings a single morpheme can encode.</T></P>
				<P indent={1}><T>Completely isolating languages, by definition, always lack fusion.</T></P>
				<P indent={1}><T>Spanish can be very <I>fusional</I>, with a single suffix capable of encoding tense (8.3.1), aspect (8.3.2), mood (8.3.3) and number (4.3).</T></P>
				<P indent={1}><T>Though fusional forms are possible (e.g. swam, was), English is mostly <I>agglutinative</I>, with one meaning per morpheme.</T></P>
				<P indent={2}><T>e.g. "antidisestablishmentarianism"</T></P>
				<Tabular
					rows={[
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
					]}
					indent={2}
				/>
				<P indent={2}><T>(The "establishment" in question is actually contextually fusional, as it refers to the Church of England receiving government patronage, so the full meaning of the word is "the belief system of opposing the people who want to remove the government patronage of the Church of England.")</T></P>
			</Modal>
			<Header level={3}>Synthesis</Header>
			<Range prop="synthesis" value={NUM_synthesis} label="Degree of synthesis, from Isolating to Polysynthetic" start={`I\u00adso\u00adla\u00adting`} end={`Po\u00adly\u00adsyn\u00adthe\u00adtic`} max={10} notFilled uncapped />
			<Header level={3}>Fusion</Header>
			<Range prop="fusion" value={NUM_fusion} label="Degree of fusion, from Agglutinative to Fusional" start={`Ag\u00adglu\u00adtin\u00ada\u00adtive`} end={`Fu\u00adsion\u00adal`} max={10} notFilled uncapped />
			<TextArea prop="tradTypol" value={TEXT_tradTypol || ""}>Give examples of the dominant pattern and any secondary patterns.</TextArea>
			<Header level={2}>1.2 Morphological Processes</Header>
			<Modal label="Read About Them" title="Affixes and Other Modifications">
				<P><T><B>Affixes</B>:</T></P>
				<P indent={1}><T>Completely fusional languages will usually lack affixes.</T></P>
				<P indent={1}><T>Most natural languages use suffixes. Some also have prefixes and/or infixes or circumfixes. Few only use prefixes, and none have only infixes or circumfixes.</T></P>
				<P indent={1}><T>NOTE: this section is not needed if the language is not agglutinative at all.</T></P>
				<P top={2}><T><B>Stem Modification</B>:</T></P>
				<P indent={1}><T>e.g. swim/swam/swum.</T></P>
				<P top={2}><T><B>Suppletion</B>:</T></P>
				<P indent={1}><T>An entirely new stem is substituted for the root, e.g. "be" being replaced by is/am/are/was/were.</T></P>
				<P top={2}><T><B>Reduplication</B>:</T></P>
				<P indent={1}><T>Part or all of a word is duplicated.</T></P>
				<P indent={1}><T>Often used for plurality.</T></P>
				<P top={2}><T><B>Suprasegmental Modification</B>:</T></P>
				<P indent={1}><T>Words can change stress when in different roles.</T></P>
				<P indent={2}><T>e.g. "permit" has different stress when used as a noun or as a verb.</T></P>
				<P indent={1}><T>Tone changes also fall under this category.</T></P>
			</Modal>
			<Header level={3}>Affixes</Header>
			<CheckBoxes
				boxes={[
					BOOL_prefixMost,
					BOOL_prefixLess,
					BOOL_suffixMost,
					BOOL_suffixLess,
					BOOL_circumfixMost,
					BOOL_circumfixLess,
					BOOL_infixMost,
					BOOL_infixLess
				]}
				display={{
					multiBoxes: 2,
					centering: [true,true,false],
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
						"Af\u00adfix"
					],
					rowDescriptions: [
						"Pre\u00adfix",
						"Suf\u00adfix",
						"Cir\u00adcum\u00adfix",
						"In\u00adfix"
					],
					export: {
						title: "Affixes",
						output: [
							[
								"Used Most: ",
								[
									["prefixMost","Prefixes"],
									["suffixMost","Suffixes"],
									["circumfixMost","Circumfixes"],
									["infixMost","Infixes"]
								],
								"."
							],
							[
								"Used Less: ",
								[
									["prefixLess","Prefixes"],
									["suffixLess","Suffixes"],
									["circumfixLess","Circumfixes"],
									["infixLess","Infixes"]
								],
								"."
							]
						]
					}
				}}
			/>
			<Header level={3}>Stem Modification</Header>
			<Range prop="stemMod" value={NUM_stemMod} label="How often stem modification is used" start={`Not Used`} end={`Used Often`}  />
			<Header level={3}>Suppletion</Header>
			<Range prop="suppletion" value={NUM_suppletion} label="How often suppletion is used" start={`Not Used`} end={`Used Often`}  />
			<Header level={3}>Reduplication</Header>
			<Range prop="redupe" value={NUM_redupe} label="How often reduplication is used" start={`Not Used`} end={`Used Often`}  />
			<Header level={3}>Suprasegmental Modification</Header>
			<Range prop="supraMod" value={NUM_supraMod} label="How often suprasegmental modification is used" start={`Not Used`} end={`Used Often`}  />
			<TextArea rows={6} prop="morphProcess" value={TEXT_morphProcess || ""}>What sort of morphological processes are used? Which are primary and which are used less?</TextArea>
			<Header level={2}>1.3. Head/Dependant Marking</Header>
			<Range prop="headDepMarked" value={NUM_headDepMarked} label="Degree of marking, from totally head-marked to totally dependant-marked" start={`Head Marked`} end={`De\u00adpen\u00addant Marked`} max={4} notFilled uncapped />
			<Modal title="Head/Dependant Marking">
				<P><T>The <B>Head</B> of a phrase is the element that determines the syntactic function of the whole phrase.</T></P>
				<P indent={1}><T>Example sentence: <I>"The smallest dog ate a porkchop with Mark's approval."</I></T></P>
				<P indent={2}><T>"dog" is Head of "the smallest dog" (noun phrase)</T></P>
				<P indent={2}><T>"porkchop" is Head of "a porkchop" (noun phrase)</T></P>
				<P indent={2}><T>"with" is Head of "with Mark's approval" (prepositional phrase)</T></P>
				<P indent={2}><T>"approval" is Head of "Mark's approval" (noun phrase)</T></P>
				<P><T>English is predominantly dependant-marked ("the queen's crown").</T></P>
				<P><T>Most languages are head-marked ("the queen crown's").</T></P>
				<P><T>Some are mixed, but use only one pattern for certain types of phrases (e.g. head-marked for noun phrases, but dependant-marked for verb and adpositional phrases).</T></P>
			</Modal>
			<TextArea prop="headDepMark" value={TEXT_headDepMark || ""}>Describe when the head/dependant marking system changes, if needed.</TextArea>
		</VStack>
	);
};

export default Section;
