import {
	VStack,
	Text
} from 'native-base';
import { useSelector } from 'react-redux';

import { Header, Modal, Tabular, T, B, I, P, CheckBoxes, TextArea } from './msTags';

const Section = () => {
	const {
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
	} = useSelector(state => state.morphoSyntax);
	return (
		<VStack>
			<Header level={1}>2. Grammatical Categories</Header>
			<Header level={2}>2.1. Nouns (the most time-stable concepts)</Header>
			<Header level={3}>2.1.1. Types of Nouns</Header>
			<Header level={4}>2.1.1.1. Proper Names</Header>
			<Modal label="Read About Them" title="Proper Names">
				<P><T>In English, they do not easily take articles, quantifiers and other modifiers.</T></P>
				<P><T>Other languages may have special case markers (4.4) for them.</T></P>
			</Modal>
			<TextArea prop="propNames" value={TEXT_propNames || ""}>Are there any special rules involving proper names?</TextArea>
			<Header level={4}>2.1.1.2. Possessability</Header>
			<Modal label="Systems of Possession" title="Possessability">
				<P><T>Languages may have one of the following systems to differentiate nouns.</T></P>
				<P top={2} indent={1}><T><B>Possessable vs Unpossessable</B>:</T></P>
				<P indent={2}><T>Some nouns cannot be possessed (e.g. land, stars).</T></P>
				<P top={2} indent={1}><T><B>Inherent vs Optional</B>:</T></P>
				<P indent={2}><T>Some nouns <I>must</I> be possessed (e.g. body parts, kinship terms).</T></P>
				<P top={2} indent={1}><T><B>Alienable vs Inalienable</B>:</T></P>
				<P indent={2}><T>Alienable possession can be ended (my car becomes your car).</T></P>
				<P indent={2}><T>Inalienable possession cannot be ended (my brother is always my brother).</T></P>
			</Modal>
			<TextArea rows={4} prop="possessable" value={TEXT_possessable || ""}>Describe how the language handles possession.</TextArea>
			<Header level={4}>2.1.1.3. Count vs Mass</Header>
			<Modal label="A Piece of Information" title="Count Nouns and Mass Nouns">
				<P><T>Typically, most nouns are countable, while fewer are considered as a mass.</T></P>
				<P><T>e.g. "sand" requires "a grain of sand" to be countable, and "confetti" requires "a piece of confetti".</T></P>
			</Modal>
			<TextArea prop="countMass" value={TEXT_countMass || ""}>Write any specific notes about count/mass noun distinctions here.</TextArea>
			<Header level={3}>2.1.2. Pronouns and Anaphoric Clitics</Header>
			<Modal label="What Are They?" title="Pronouns and Anaphoric Clitics">
				<P><T><B>Pronouns</B>:</T></P>
				<P indent={1}><T>Free forms that are used to refer to or replace a word used earlier in a sentence, to avoid repetition.</T></P>
				<P indent={1}><T>Also known as <I>anaphoric references</I>.</T></P>
				<P top={2}><T><B>Anaphoric Clitics</B>:</T></P>
				<P indent={1}><T>A <I>clitic</I> is a bound morpheme that functions on the phrase or clause level, but is bound phonologically to another word.</T></P>
				<P indent={1}><T>An Anaphoric Clitic functions as a full noun phrase.</T></P>
				<P indent={2}><T>Spanish:</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={2}
					final={<Text>"I wash the car" :: <Text bold>-o</Text> functions as the noun phrase "I"</Text>}
				/>
				<P top={2}><T>Both types often differ according to person (3rd/2nd/1st including inclusive/exclusive), number (singular/plural), noun class (gender/animacy), grammatical role (subject/object/ergative/etc), semantic role (Agent/Patient), definiteness and/or specificness (a/the), and honorifics.</T></P>
				<P><T>English has frequent pronouns that agree with the verb, and may be stressed for emphasis or contrast: "<B>He</B> died" (not her, as expected).</T></P>
				<P><T>Spanish has anaphoric forms attached to the verb, but will use pronouns for emphasis or contrast.</T></P>
			</Modal>
			<TextArea rows={4} prop="pronounAnaphClitic" value={TEXT_pronounAnaphClitic || ""}>Which system(s) are used by the language?</TextArea>
			<Header level={2}>2.2. Verbs (the least time-stable concepts)</Header>
			<Header level={3}>2.2.1. Semantic Roles</Header>
			<Modal label="A Quick Primer" title="Semantic Roles">
				<P><T>Verbs can be divided into groups depending on which roles they require.</T></P>
				<P top={2} indent={1}><T><B>Agent</B>: active, physical, has volition</T></P>
				<P indent={1}><T><B>Patient</B>: undergoes a change, no volition (direct object in English)</T></P>
				<P indent={1}><T><B>Recipient</B>: moving object (indirect object in English), or often a destination</T></P>
				<P indent={1}><T><B>Force</B>: directly instigates, not necessarily conscious or voluntary</T></P>
				<P indent={1}><T><B>Instrument</B>: indirectly instigates (usually by an Agent)</T></P>
				<P indent={1}><T><B>Experiencer</B>: does not participate, merely observes</T></P>
				<P top={2}><T>In English, all verbs require an Agent, and many also require a Patient, but no other roles are encoded into the verb.</T></P>
				<P top={2}><T>NOTE: Roles can change according to the perspective of the speaker:</T></P>
				<P indent={1}><T>I hit Steve with the hammer.</T></P>
				<P indent={1}><T>The hammer hit Steve.</T></P>
				<P indent={1}><T>Steve was hit.</T></P>
			</Modal>
			<TextArea rows={6} prop="semanticRole" value={TEXT_semanticRole || ""}>Describe which semantic roles are important.</TextArea>
			<Header level={3}>2.2.2. Verb Classes</Header>
			<CheckBoxes
				boxes={[
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
				]}
				properties={[
					"BOOL_actions",
					"BOOL_actionProcesses",
					"BOOL_weather",
					"BOOL_states",
					"BOOL_involuntaryProcesses",
					"BOOL_bodyFunctions",
					"BOOL_motion",
					"BOOL_position",
					"BOOL_factive",
					"BOOL_cognition",
					"BOOL_sensation",
					"BOOL_emotion",
					"BOOL_utterance",
					"BOOL_manipulation",
					"BOOL_otherVerbClass"
				]}
				display={{
					striped: true,
					inlineHeaders: ["Special?","Description"],
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
						<Text>In English, these require a dummy Agent ("<Text italic>It</Text> is raining"); this is not the case in many other languages!</Text>,
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
				}}
			/>
			<TextArea rows={8} prop="verbClass" value={TEXT_verbClass || ""}>If you've marked a verb class as "Special", describe how the language treats it differently than the "regular" verbs.</TextArea>
			<Header level={3}>2.2.3. Verb Structure</Header>
			<Modal label="Structure and Operations Info" title="Verb Structure">
				<P><T>In polysynthetic languages, verbs tend to be the most complex.</T></P>
				<P indent={1}><T>English is very simple:</T></P>
				<P indent={2} noDot><T>root verb</T></P>
				<P top={0} indent={2} noDot><T>+ (optional tense marker OR agreement marker)</T></P>
				<P indent={1}><T>Panare is much more complex:</T></P>
				<P indent={2} noDot><T>person/neutral marker</T></P>
				<P top={0} indent={2} noDot><T>+ (optional valence marker)</T></P>
				<P top={0} indent={2} noDot><T>+ (optional detransification marker)</T></P>
				<P top={0} indent={2} noDot><T>+ (optional incorporation marker)</T></P>
				<P top={0} indent={2} noDot><T>+ root verb</T></P>
				<P top={0} indent={2} noDot><T>+ (optional derivation marker)</T></P>
				<P top={0} indent={2} noDot><T>+ tense/aspect/mode marker</T></P>
				<P top={2}><T>Polysynthetic languages may have any/all of these operations</T></P>
				<P indent={1}><T>Verb agreement (6)</T></P>
				<P indent={1}><T>Semantic role markers (applicatives) (7.1.2)</T></P>
				<P indent={1}><T>Valence increasing/decreasing (7.1, 7.2)</T></P>
				<P indent={1}><T>Tense/Apect/Mode (8.3)</T></P>
				<P indent={1}><T>Evidentials (8.5)</T></P>
				<P indent={1}><T>Location and direction (8.4)</T></P>
				<P indent={1}><T>Speech act markers (9.3)</T></P>
				<P indent={1}><T>Verb and verb-phrase negation (9.2)</T></P>
				<P indent={1}><T>Subordination/Nominalization (8.1, 10)</T></P>
				<P indent={1}><T>Switch-Reference (10.4)</T></P>
				<P><T>In more isolating languages, those operations are more likely to be expressed through particles or adverbs.</T></P>
				<P top={2}><T>Things to consider:</T></P>
				<P indent={1}><T>Where does the stem lie in relation to any affixes/particles/etc?</T></P>
				<P indent={1}><T>Are directional and/or locational notions expressed in the verb/phrase at all?</T></P>
				<P indent={1}><T>Are particular operations obligatory? Productive (for all/most roots)?</T></P>
			</Modal>
			<TextArea rows={6} prop="verbStructure" value={TEXT_verbStructure || ""}>Describe the verb structure here.</TextArea>
			<Header level={2}>2.3. Modifiers</Header>
			<Header level={3}>2.3.1. Property Concepts (Descriptive Adjectives)</Header>
			<CheckBoxes
				boxes={[
					BOOL_lexVerb,
					BOOL_lexNoun,
					BOOL_lexVN,
					BOOL_lexVorN,
					BOOL_adjectives
				]}
				properties={[
					"BOOL_lexVerb",
					"BOOL_lexNoun",
					"BOOL_lexVN",
					"BOOL_lexVorN",
					"BOOL_adjectives"
				]}
				display={{
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
				}}
			/>
			<Modal label="More Info" title="Property Concepts">
				<P><T>If Property Concepts (adjectives) exist as a separate category, they will express:</T></P>
				<P indent={1}><T>age</T></P>
				<P indent={1}><T>dimension (big, short, long, tall, wide)</T></P>
				<P indent={1}><T>value (good, bad)</T></P>
				<P indent={1}><T>color</T></P>
				<P><T>Other properties may be expressed:</T></P>
				<P indent={1}><T>physical properties (hard, smooth, heavy)</T></P>
				<P indent={1}><T>shape</T></P>
				<P indent={1}><T>speed</T></P>
				<P indent={1}><T>human propensity (happy, jealous, smart, wary)</T></P>
				<P top={2}><T>In Acehnese, property concepts can take the same sort of morphology as verbs, thus they are lexicalized as verbs.</T></P>
				<P top={2} indent={1}><T>In Finnish, property concepts are required to take the same sort of morphology as the noun they modify, thus they are lexicalized as nouns.</T></P>
				<P top={2} indent={1}><T>In Dutch, property concepts are treated as verbs when used as a predicator ("That car is <I>pink</I>!") and as nouns when used as a modifier ("I love <I>pink</I> cars!").</T></P>
				<P top={2} indent={1}><T>In Yoruba, some property concepts are always treated as nouns, while others are always treated as verbs.</T></P>
				<P top={2} indent={1}><T>In English, they are labeled as a separate class because they don't follow the same patterns as nouns or verbs:</T></P>
				<P indent={2} noDot><T>1. They cannot take past tense like a verb, nor do they "agree" with their head noun in the same way.</T></P>
				<P indent={2} noDot><T>2. They do not take plural markers like a noun, nor can they take articles, modifiers or quantifiers.</T></P>
				<P indent={2} noDot><T>3. Rarely, an adjective can be treated as a noun (e.g. "<I>The wealthy</I> are obnoxious", "Which car do you prefer, <I>the gray</I> or <I>the red</I>?"), but these are actually <I>zero derivations</I> (8.1).</T></P>
			</Modal>
			<TextArea prop="propClass" value={TEXT_propClass || ""}>How does the language handle PCs? If they're not all treated the same way (as in Dutch or Yoruba), explain the differences.</TextArea>
			<Header level={3}>2.3.2. Non-Numeral Quantifiers (e.g. few, many, some)</Header>
			<TextArea prop="quantifier" value={TEXT_quantifier || ""}>Which quantifiers exist?</TextArea>
			<Header level={3}>2.3.3. Numerals</Header>
			<Modal label="Things to Consider" title="Numerals">
				<P><T><B>Extent</B>:</T></P>
				<P indent={1}><T>Some languages have restricted numerals: e.g. 1, 2, 3, many.</T></P>
				<P indent={1}><T>Only very advanced societies will have a need for numbers beyond a thousand.</T></P>
				<P indent={1}><T>Many societies will end up borrowing larger number words from nearby languages that invent them first.</T></P>
				<P top={2}><T><B>Base</B>:</T></P>
				<P indent={1}><T>Usually base 5 or 10. Sometimes 20. (English is base 10.)</T></P>
				<P indent={1}><T>Words for "five" usually come from the word for "hand". Words for "twenty" can come from the word for an entire human being.</T></P>
				<P indent={1}><T>More advanced cultures with merchants or bureaucracies tend to create systems based around 12 as well, due to its greater number of factors, but this system almost never replaces the original base system.</T></P>
				<P indent={1}><T>Numerals can be described from greatest to least ("twenty-two"), from least to greatest ("two-twenty"), or not give base multiples a special name ("two-two").</T></P>
				<P top={2}><T><B>Agreement</B>:</T></P>
				<P indent={1}><T>Languages may inflect their numerals to agree with their head.</T></P>
				<P indent={1}><T>Some languages use entirely different sets of numerals for different situations.</T></P>
				<P indent={2}><T>English has separate numerals for counting (one, two, three, etc.) and ordering things (first, second, third, etc.)</T></P>
				<P indent={2}><T>Irish has a set of numbers that represent the numbers themselves, a second set for counting or ordering things (one goat, two goats, three goats, etc.), and third set of numerals used only for counting people.</T></P>
			</Modal>
			<CheckBoxes
				boxes={[
					BOOL_baseFive,
					BOOL_baseTen,
					BOOL_baseTwenty,
					BOOL_baseOther
				]}
				properties={[
					"BOOL_baseFive",
					"BOOL_baseTen",
					"BOOL_baseTwenty",
					"BOOL_baseOther"
				]}
				display={{
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
				}}
			/>
			<CheckBoxes
				boxes={[
					BOOL_numGL,
					BOOL_numLG,
					BOOL_numNone
				]}
				properties={[
					"BOOL_numGL",
					"BOOL_numLG",
					"BOOL_numNone"
				]}
				display={{
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
				}}
			/>
			<CheckBoxes
				boxes={[
					BOOL_multiNumSets,
					BOOL_inflectNum
				]}
				properties={[
					"BOOL_multiNumSets",
					"BOOL_inflectNum"
				]}
				display={{
					header: "Other Properties",
					labels: [
						"Multiple Sets of Numerals",
						"Numerals Agree With Head"
					],
					export: {title:"Other Number Properties:"}
				}}
			/>
			<TextArea rows={6} prop="numeral" value={TEXT_numeral || ""}>Describe the language's numeral system.</TextArea>
			<Header level={2}>2.4. Adverbs</Header>
			<Modal label={"A \"Catch-All\" Category"} title="Adverbs">
				<P><T>These may or may not exist as a separate category of words.</T></P>
				<P><T>Languages may use adjectives in special phrases to fulfill this role.</T></P>
				<P><T>Adverbs can describe the following:</T></P>
				<P indent={1}><T><B>Manner</B>: e.g. quickly, slowly, patiently.</T></P>
				<P indent={1}><T><B>Time</B>: e.g. yesterday, today, early, next year.</T></P>
				<P indent={1}><T><B>Direction/Location</B>: e.g. up/downriver, north(ward), left(ward), hither.</T></P>
				<P indent={1}><T><B>Evidential/Epistemic</B>: e.g. possibly, definitely, from conjecture, from direct observation, from second-hand information.</T></P>
			</Modal>
			<TextArea rows={4} prop="adverb" value={TEXT_adverb || ""}>How are adverbs (or adverb-like phrases) handled?</TextArea>
		</VStack>
	);
};

export default Section;
