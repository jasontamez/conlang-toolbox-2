import {
	VStack
} from 'native-base';
import { useSelector } from 'react-redux';

import { Header, Modal, Tabular, T, B, I, P, CheckBoxes, TextArea } from './msTags';

const Section = () => {
	const {
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

		TEXT_compounding,
		TEXT_denoms,
		TEXT_nNumberOpt,
		TEXT_nNumberObl,
		TEXT_nCase,
		TEXT_articles,
		TEXT_demonstratives,
		TEXT_possessors,
		TEXT_classGender,
		TEXT_dimAug
	} = useSelector(state => state.morphoSyntax);
	return (
		<VStack>
			<Header level={1}>4. Noun and Noun Phrase Operations</Header>
			<Header level={2}>4.1. Compounding</Header>
			<Modal label="Noun-Piles" title="Compounding">
				<P><T>When two nouns are combined into one, several changes may occur.</T></P>
				<P indent={1}><T>Stress pattern change, e.g. "<I>black</I>bird" vs "black <I>bird</I>".</T></P>
				<P indent={1}><T>Unusual word order, e.g. "housekeeper" vs "keeper of the house".</T></P>
				<P indent={1}><T>Morphology specific to compounds, e.g. "can-opener" does not imply the existence of a verb "to can-open".</T></P>
				<P indent={1}><T>A resulting meaning that is either more specific than its components (e.g. "windshield" vs. "wind" or "shield") or altogether different (e.g. "heaven-breath" means "weather" in Mandarin).</T></P>
			</Modal>
			<TextArea rows={4} prop="compounding" value={TEXT_compounding || ""}>Describe the sorts of compounding that happen in the language (if any).</TextArea>
			<Header level={2}>4.2. Denominalization</Header>
			<Modal label="Verbing a Noun" title="Denominalization">
				<P><T>Some languages have many ways of changing a noun into a non-noun.</T></P>
				<P indent={1}><T>English can append <I>-like</I> to make an adjective.</T></P>
				<P indent={1}><T>Eskimo has many verbalizing forms, e.g. to be X, to go towards X, to play with X, to hunt X.</T></P>
			</Modal>
			<TextArea rows={4} prop="denoms" value={TEXT_denoms || ""}>Are there any processes to make a verb from a noun? An adjective? An adverb?</TextArea>
			<Header level={2}>4.3. Number Marking</Header>
			<Modal label="Plurality, etc." title="Number Marking">
				<P><T>Some languages only mark number occassionally or optionally depending on the type of noun.</T></P>
				<P><T>This is often intertwined with other markers, such as case marking in Romance languages.</T></P>
				<P><T>Most languages leave the singular unmarked, but not all!</T></P>
				<P><T>Number marking may have many distinctions:</T></P>
				<P indent={1}><T>singular (one)</T></P>
				<P indent={1}><T>dual (two)</T></P>
				<P indent={1}><T>trial (three)</T></P>
				<P indent={1}><T>paucal (small amount)</T></P>
				<P indent={1}><T>plural (any amount larger than the others used)</T></P>
			</Modal>
			<CheckBoxes
				boxes={[
					BOOL_numSing,
					BOOL_numDual,
					BOOL_numTrial,
					BOOL_numPaucal,
					BOOL_numPlural
				]}
				display={{
					header: "Which Distinctions Are Marked in the Noun Phrase?",
					labels: [
						"Singular",
						"Dual",
						"Trial",
						"Paucal",
						"Plural"
					],
					export: {title: "Number Marking:"}
				}}
			/>
			<TextArea rows={3} prop="nNumberOpt" value={TEXT_nNumberOpt || ""}>Is the distinction between singular and non-singular obligatory, optional or absent? If number-marking is optional, when does it tend to occur? When does it not tend to occur?</TextArea>
			<TextArea rows={6} prop="nNumberObl" value={TEXT_nNumberObl || ""}>If number-marking is obligatory, is number marking overtly expressed for all noun phrases, or only some subclasses (e.g. animates)?</TextArea>
			<Header level={2}>4.4. Case Marking</Header>
			<Modal label="How it works" title="Case Marking">
				<P><T>Case markings can describe the role a noun plays in a sentence.</T></P>
				<P><T>In English, most case markings only survive in the pronouns, with word order doing the job for regular nouns. The major exception is the genitive case (possessive), which is marked with <I>'s</I>.</T></P>
				<P><T>Some cases, and the semantic role (2.2.1) they usually indicate, include:</T></P>
				<P indent={1}><T>nominative/ergative (Agent, see section 6)</T></P>
				<P indent={1}><T>accusative/absolutive (Patient, see section 6)</T></P>
				<P indent={1}><T>dative (Recipient)</T></P>
				<P indent={1}><T>genitive (Possessor)</T></P>
				<P><T>In Latin, if a Patient occurs in some other case, either the sentence is ungrammatical or another sense of the verb results.</T></P>
				<P><T>In some languages, verbs and/or adpositions <I>govern</I> their arguments, requiring a specific case marker on their nouns. This allows similar-sounding verbs to be discerned by these case markers. For example, in Yagua, the verb <I>dííy</I> can mean either "kill" or "see" depending on which case the Patient is in:</T></P>
				<P indent={1}><T>He killed the alligator:</T></P>
				<Tabular
					rows={[
						[
							"sa-dííy",
							"nurutú-0"
						],
						[
							"he-kill",
							"alligator-ACC"
						]
					]}
					top={0}
					indent={1}
				/>
				<P indent={1}><T>He saw the alligator:</T></P>
				<Tabular
					rows={[
						[
							"sa-dííy",
							"nurutí-íva"
						],
						[
							"he-see",
							"alligator-DAT"
						]
					]}
					top={0}
					indent={1}
				/>
			</Modal>
			<TextArea rows={4} prop="nCase" value={TEXT_nCase || ""}>Do nouns exhibit morphological case? If so, what cases exist?</TextArea>
			<Header level={2}>4.5. Articles and Demonstratives</Header>
			<Modal label="What Are They?" title="Articles">
				<P><T>English is relatively rare in having <B>Articles</B>: a, an, the. More often, languages have a broader class of demonstratives.</T></P>
				<P top={2}><T><B>Demonstratives</B> are words that distinguish or identify a noun without modifying it, such as this, that, these and those.</T></P>
				<P><T>They tend to encode distance ("this" is closer to you than "that"; Spanish has a third level of distance, too).</T></P>
			</Modal>
			<TextArea rows={6} prop="articles" value={TEXT_articles || ""}>If articles exist, are they obligatory or optional? When do they occur? Are they separate words or bound morphemes?</TextArea>
			<TextArea rows={6} prop="demonstratives" value={TEXT_demonstratives || ""}>How many levels of distance do demonstratives encode? Are there other distinctions besides distance?</TextArea>
			<Header level={2}>4.6. Possessors</Header>
			<Modal label="Possessor Expressions" title="Possessors">
				<P><T>Refer back to 2.1.1.2 to note your system of possession. This does <B>not</B> refer to possessive clauses! (5.4)</T></P>
				<P top={2}><T>How are possessors expressed in the noun phrase?</T></P>
				<P><T>Do nouns agree with their possessors? Vice versa?</T></P>
			</Modal>
			<TextArea rows={3} prop="possessors" value={TEXT_possessors || ""}>Describe how possession works in a noun phrase.</TextArea>
			<Header level={2}>4.7. Class (Gender)</Header>
			<Modal label="What They Are" title="Class and Gender">
				<P><T>Class system often require classifiers (special operators) to declare class.</T></P>
				<P><T>Pure gender systems use "agreement" instead of classifiers. At the very least, numerical expressions will "agree" with their head noun.</T></P>
				<P><T>Classes generally care about one dimension of reality, such as biological gender, animacy, shape, or function. (Other dimensions may be relevant, too.) There are almost always exceptions to the rule, however (e.g. Yagua treats rocks and pineapples as animates).</T></P>
				<P><T>Classifiers may occur with verbs, numerals and adjectives, though they may serve a different function in those cases.</T></P>
			</Modal>
			<CheckBoxes
				boxes={[
					BOOL_classGen,
					BOOL_classAnim,
					BOOL_classShape,
					BOOL_classFunction,
					BOOL_classOther
				]}
				display={{
					header: "Which Class Distinctions Exist?",
					labels: [
						"Gender",
						"Animacy",
						"Shape",
						"Function",
						"Other"
					],
					export: {title: "Class Distinctions:"}
				}}
			/>
			<TextArea rows={8} prop="classGender" value={TEXT_classGender || ""}>Describe the language's class/gender system, if it has one. What classes/genders exist and how do they manifest? What dimension(s) of reality is central to the class system? How do they interact with numerals, verbs and adjectives?</TextArea>
			<Header level={2}>4.8. Diminution/Augmentation</Header>
			<Modal label="Bigger and Smaller" title="Diminution and Augmentation">
				<P><T>If diminution (making smaller) and/or augmentation (making bigger) is used in the language, answer the following questions:</T></P>
				<P indent={1}><T>Is it obligatory? Does one member have to occur in every full noun phrase?</T></P>
				<P indent={1}><T>Is it productive? Does it work with all full noun phrases and does it have the same meaning for each?</T></P>
				<P indent={1}><T>Is it expressed lexically, morphologically, or analytically?</T></P>
				<P indent={1}><T>Where in the NP is this operation likely to be located? Can it occur in more than one place?</T></P>
			</Modal>
			<CheckBoxes
				boxes={[
					BOOL_dimAugYes,
					BOOL_dimAugObligatory,
					BOOL_dimAugProductive
				]}
				display={{
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
				}}
			/>
			<TextArea rows={8} prop="dimAug" value={TEXT_dimAug || ""}>Describe the language's relation to diminution and augmentation.</TextArea>
		</VStack>
	);
};

export default Section;
