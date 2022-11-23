import {
	VStack
} from 'native-base';
import { useSelector } from 'react-redux';

import { Header, Modal, T, B, I, P, CheckBoxes, TextArea } from './msTags';

const Section = () => {
	const {
		BOOL_tenseMorph,
		BOOL_aspectMorph,
		BOOL_modeMorph,
		BOOL_otherMorph,

		TEXT_verbNoms,
		TEXT_verbComp,
		TEXT_tense,
		TEXT_aspect,
		TEXT_mode,
		TEXT_locDirect,
		TEXT_evidence,
		TEXT_miscVerbFunc,
	} = useSelector(state => state.morphoSyntax);
	return (
		<VStack>
			<Header level={1}>8. Other Verb and Verb Phrase Operations</Header>
			<Header level={2}>8.1. Nominalization</Header>
			<Modal label="Making Nouns" title="Nominalization">
				<P><T>Every language has strategies of adjusting the grammatical category of a root. Turning a word into a noun is <I>nominalization</I>.</T></P>
				<P top={2}><T>English has multiple methods, with differing levels of productivity.</T></P>
				<P><T>Typically, a language will use differing methods to create nominalizations according to the result.</T></P>
				<P top={2}><T>Some methods:</T></P>
				<P indent={1}><T><B>Zero Operator</B>: walk → a walk, look → a look</T></P>
				<P indent={1}><T><B>Affix</B>: walk → walking, employ → employment, grow → growth, construct → construction</T></P>
				<P indent={1}><T><B>Merge with Adposition</B>: hang + up → hangup, make + over → makeover, talk + to → talking to</T></P>
				<P indent={1}><T><B>Analytical</B>: Mandarin uses a particle <I>de</I> to indicate some nominalizations</T></P>
				<P indent={2}><T><I>hézuò</I> (cooperate) + <I>de</I> → cooperation</T></P>
				<P top={2}><T>Types of nominalization:</T></P>
				<P indent={1}><T><B>Action</B>:</T></P>
				<P indent={2}><T>Usually refers to the action in the abstract.</T></P>
				<P indent={3}><T>walk → walking</T></P>
				<P indent={3}><T>think → thinking</T></P>
				<P indent={1}><T><B>Agent</B>:</T></P>
				<P indent={2}><T>Typically refers to an Agent who is characteristic of the root verb (teach → a teacher), but some languages instead refer to someone engaged in the activity at the moment (teach → one who is presently teaching).</T></P>
				<P indent={1}><T><B>Patient</B>:</T></P>
				<P indent={2}><T>In English, this mostly happens with the modifiers "good" and "bad".</T></P>
				<P indent={3}><T>buy → a good buy</T></P>
				<P indent={3}><T>fall → a bad fall</T></P>
				<P indent={2}><T>This can also form the "past participle" in a language.</T></P>
				<P indent={3}><T>employ → employee : this form comes from the French past participle!</T></P>
				<P indent={1}><T><B>Instrument</B>:</T></P>
				<P indent={2}><T>Refers to the object used in the action.</T></P>
				<P indent={2}><T>In English, this usually follows the same format as an Agent nominalization.</T></P>
				<P indent={2}><T>In Spanish, compounding a verb with a plural object makes an instrument.</T></P>
				<P indent={3}><T>e.g. <I>abre</I> (open) + <I>latas</I> (cans) → <I>el abrelatas</I> (can-opener)</T></P>
				<P indent={1}><T><B>Location</B>:</T></P>
				<P indent={2}><T>Many languages use this to refer generally to a place where the action tends to occur, e.g. work → workshop, burn → fireplace.</T></P>
				<P indent={1}><T><B>Product</B>:</T></P>
				<P indent={2}><T>This refers to something that exists because of an action.</T></P>
				<P indent={2}><T>English tends to do this with zero operators (scratch → a scratch) or by changing the stress pattern (permit → a permit, reject → a reject, convert → a convert).</T></P>
				<P indent={1}><T><B>Manner</B>:</T></P>
				<P indent={2}><T>This is uncommon among languages, but English has a couple, generally confined to sports terminology.</T></P>
				<P indent={3}><T>curve → a curve (That pitcher's curve is unhittable.)</T></P>
				<P indent={3}><T>serve → a serve (Serena's serve is imposing.)</T></P>
			</Modal>
			<TextArea rows={8} prop="verbNoms" value={TEXT_verbNoms || ""}>Describe the nominalizations that exist in the language, and explain how productive they are.</TextArea>
			<Header level={2}>8.2. Compounding</Header>
			<Modal label="Word-Making" title="Compounding">
				<P><T><B>Noun Incorporation</B>: noun becomes attached to a verb (see 7.2.7).</T></P>
				<P indent={1}><T>The most common form is Patient incorporation (sell pigs → to pig-sell).</T></P>
				<P top={2}><T><B>Verb Incorporation</B>: two verbs merge, one modifying the other.</T></P>
				<P indent={1}><T>Often, verbs of motion enter into these pairings (shout-rise → he shouts rising).</T></P>
				<P indent={1}><T>Verbs that freely compound like this typically lose their verbal character and become derivational affixes.</T></P>
			</Modal>
			<TextArea rows={6} prop="verbComp" value={TEXT_verbComp || ""}>Describe any compounding strategies that exist in the language.</TextArea>
			<Header level={2}>8.3. Tense/Aspect/Mode</Header>
			<Modal label="What Are They?" title="Tense, Aspect and Mode">
				<P><T><B>TAM</B> (Tense, Aspect, Mode) are sometimes hard to tease apart, and may only be considered separate because of how they are in western language.</T></P>
				<P><T>Some languages pay more attention to tense (English), aspect (Austronesian languages), or mode (Eskimo).</T></P>
				<P indent={1}><T>Furthermore, some verb stems may not allow certain operations while favoring others.</T></P>
				<P><T>Many languages don't morphologically indicate one or more of these divisions. (When not indicated morphologically, the language will use lexical or analytical methods.)</T></P>
				<P indent={1}><T>Aspect: only 74% of languages use morphology</T></P>
				<P indent={1}><T>Mode: only 68% of languages do</T></P>
				<P indent={1}><T>Tense: barely 50% of languages do!</T></P>
				<P top={2}><T>TAM morphemes often interact significantly with case or number marking (nom/acc in one aspect, erg/abs in another; merging aspect with number).</T></P>
			</Modal>
			<CheckBoxes
				boxes={[
					BOOL_tenseMorph,
					BOOL_aspectMorph,
					BOOL_modeMorph,
					BOOL_otherMorph
				]}
				display={{
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
				}}
			/>
			<Header level={3}>8.3.1 Tense</Header>
			<Modal label="Info on Tense" title="Tense">
				<P><T><B>Tense</B> sets an action in time in relation to "now".</T></P>
				<P><T>Languages can divide time up into different sets of tenses:</T></P>
				<P indent={1}><T>Past/Present/Future</T></P>
				<P indent={1}><T>Past/Nonpast</T></P>
				<P indent={1}><T>Nonfuture/Future</T></P>
				<P indent={1}><T>Not-Now/Now/Not-Now (two tenses!)</T></P>
				<P indent={1}><T>Distant Past/A Year Ago/A Month Ago/A Week Ago/Today or Yesterday/Now/Soon/Future</T></P>
				<P indent={2}><T>When human languages have divided past or future into multiple segments, there are never more future segments than past segments!</T></P>
				<P top={2}><T>Future tense markers often derive from "want", "come", or "go".</T></P>
				<P indent={1}><T>These verbs may still function separately!</T></P>
				<P indent={2}><T>He come (present)</T></P>
				<P indent={2}><T>He come go (will go)</T></P>
				<P indent={2}><T>He come come (will come)</T></P>
			</Modal>
			<TextArea rows={6} prop="tense" value={TEXT_tense || ""}>Is there a Tense system? How does it operate? How does it divide time?</TextArea>
			<Header level={3}>8.3.2 Aspect</Header>
			<Modal label="Info on Aspect" title="Aspect">
				<P><T><B>Aspect</B> describes the internal structure of an event or state. Here are some typical aspects:</T></P>
				<P indent={1}><T><B>Perfective</B>: The situation is viewed as a single event.</T></P>
				<P indent={2}><T>"She wrote a letter."</T></P>
				<P indent={2}><T>"He walked around the block."</T></P>
				<P indent={1}><T><B>Imperfective</B>: The situation is viewed from "inside" as an ongoing process.</T></P>
				<P indent={2}><T>"She writes a letter."</T></P>
				<P indent={2}><T>"He walks around the block."</T></P>
				<P indent={1}><T><B>Perfect</B>: A currently relevant state brought about by the verb.</T></P>
				<P indent={2}><T>"She has written a letter."</T></P>
				<P indent={2}><T>"He has walked around the block."</T></P>
				<P indent={1}><T><B>Pluperfect</B>: A combination of Perfect aspect and Past tense; the currently relevant state was brought about in the past.</T></P>
				<P indent={2}><T>"She had written a letter."</T></P>
				<P indent={2}><T>"He had walked around the block."</T></P>
				<P indent={1}><T><B>Completive</B>: Refers to the end of a situation.</T></P>
				<P indent={2}><T>"She finished writing a letter."</T></P>
				<P indent={2}><T>"He finished walking around the block."</T></P>
				<P indent={1}><T><B>Inceptive</B>: Refers to the beginning of a situation.</T></P>
				<P indent={2}><T>"She started writing a letter."</T></P>
				<P indent={2}><T>"He began walking around the block."</T></P>
				<P indent={1}><T><B>Continuative/Progressive</B>: This implies an ongoing, dynamic situation.</T></P>
				<P indent={2}><T>"She is writing a letter."</T></P>
				<P indent={2}><T>"He is walking around the block."</T></P>
				<P indent={1}><T><B>Habitual</B>: This implies an event or state happens regularly.</T></P>
				<P indent={2}><T>"She often writes a letter."</T></P>
				<P indent={2}><T>"He usually walks around the block."</T></P>
				<P indent={1}><T><B>Punctual</B>: The state or event is too short to have an internal structure.</T></P>
				<P indent={2}><T>"She coughed."</T></P>
				<P indent={1}><T><B>Iterative</B>: A Punctual state or event takes place several times in succession.</T></P>
				<P indent={2}><T>"He is coughing."</T></P>
				<P indent={1}><T><B>Atelic</B>: An event that has no clearly defined end-point.</T></P>
				<P indent={2}><T>"He is coughing and coughing and coughing."</T></P>
				<P indent={1}><T><B>Telic</B>: Has a clearly defined end-point.</T></P>
				<P indent={2}><T>"She is near the end of her walk."</T></P>
				<P indent={1}><T><B>Static</B>: A changeless state.</T></P>
				<P indent={2}><T>"He is just plain boring."</T></P>
				<P top={2}><T>Languages may handle certain aspects in different ways.</T></P>
				<P indent={1}><T>English uses context for most aspects.</T></P>
				<P indent={1}><T>Spanish uses morphology for Perfective and Imperfective aspects, and uses a morphological/analytical combination for Perfect.</T></P>
				<P indent={1}><T>Mandarin has a Perfective particle.</T></P>
				<P indent={1}><T>Finnish uses an accusative case for Perfective and a "partitive" case for Progressive.</T></P>
				<P indent={2}><T>In human languages, case markers like this can be mistaken for TAM markers!</T></P>
				<P top={2}><T>Progressive aspect constructions often derive from locational structures.</T></P>
				<P indent={1}><T>English has gone from "He is at walking" to "He is a-walking" (still used in some places) to "He is walking".</T></P>
				<P top={2}><T>There is often a link between aspect marking and location/direction marking. English has some examples:</T></P>
				<P indent={1}><T>I <I>came</I> to see it as an abberation (inceptive)</T></P>
				<P indent={1}><T>I cut <I>away</I> at the handcuffs (imperfective)</T></P>
				<P indent={1}><T>I drank your milkshake <I>up</I> (perfective)</T></P>
			</Modal>
			<TextArea rows={8} prop="aspect" value={TEXT_aspect || ""}>Describe the way the language handles Aspect.</TextArea>
			<Header level={3}>8.3.3 Mode</Header>
			<Modal label="Info on Mode" title="Mode">
				<P><T><B>Mode</B> describes a speaker's attitude toward a situation, including how likely or truthful it is, or how relevant the situation is to them.</T></P>
				<P><T>Mode, Mood and Modality are often used interchangeably, though some linguists make distinctions between them.</T></P>
				<P top={2}><T>The highest-level Mode distinction is the Realis-Irrealis Continuum.</T></P>
				<P indent={1}><T><B>Realis</B>: the speaker insists the situation is real, or holds true.</T></P>
				<P indent={1}><T><B>Irrealis</B>: the speaker makes no claim as to the situation's reality or truthfulness.</T></P>
				<P indent={2}><T>Conditional statements (if X...) are inherently Irrealis.</T></P>
				<P indent={2}><T>Interrogative statements (questions) and imperative statements (commands) tend to be treated as Irrealis.</T></P>
				<P indent={2}><T>Other statements that tend to be treated as Irrealis:</T></P>
				<P indent={3}><T>Subjunctive (possibility, what if)</T></P>
				<P indent={3}><T>Optative (wishes)</T></P>
				<P indent={3}><T>Hypothetical/Imaginary</T></P>
				<P indent={3}><T>Probability</T></P>
				<P indent={3}><T>Deontic (obligations: should, must, have to)</T></P>
				<P indent={3}><T>Potential (might, ability to; sometimes considered very weak Deontic)</T></P>
				<P top={2} indent={1}><T>Evidentiality and Validationality are sometimes part of the Mode system. They can also stand alone (8.5).</T></P>
				<P top={2}><T>Negative assertions (see 9.2) can be Realis or Irrealis depending on how strongly the assertion is, but some languages still treat all negative statements as Irrealis.</T></P>
				<P top={2}><T>Mode interacts strongly with Tense and Aspect.</T></P>
				<P indent={1}><T>Habitual aspect is inherently less Realis than Perfective aspect.</T></P>
				<P indent={1}><T>Statements that are more Realis are more likely to be definite and referential.</T></P>
				<P indent={2}><T>Steve ate the candy. (Perfective)</T></P>
				<P indent={2}><T>Steve always eats candy. (Habitual)</T></P>
				<P indent={2}><T>Steve always eats the candy. (Technically grammatical, but sounds "wrong")</T></P>
			</Modal>
			<TextArea rows={6} prop="mode" value={TEXT_mode || ""}>Describe how the language deals with Mode.</TextArea>
			<Header level={2}>8.4. Location/Direction</Header>
			<Modal label="Where?" title="Location and Direction">
				<P><T>While Tense grounds statements in time, some languages grammaticize location and/or direction markers to ground statements in space. It may be even more central to discourse than tense in some languages.</T></P>
				<P top={2}><T>Directional formatives are often related to basic verbs of motion (go, come, arrive, depart, return, go up, go down).</T></P>
				<P top={2}><T>Some languages (Lahu, Tibeto-Burman languages) have one motion verb and use directional formatives to indicate progression towards (hither) or away from (thither) a point of reference.</T></P>
				<P top={2}><T>Locational marking is often culturally or geographically relevant to the culture that speaks it.</T></P>
				<P indent={1}><T>Quechua, spoken in the Andes mountains, has suffixes that indicate uphill, downhill, and "at the same altitude".</T></P>
				<P indent={1}><T>Yagua, spoken in Peruvian lowland rivers, has suffixes that indicate an action was performed upriver, downriver, or moving horizontally across land or water.</T></P>
				<P indent={2}><T>There are also suffixes that express if an action happened on arrival at a new scene, or on arrival at the current scene.</T></P>
				<P top={2}><T>Papuan languages have extensive markers that can be used in combination, i.e. "She moved it down and away from her."</T></P>
				<P><T>Otomí has auxiliaries than indicate an action is towards (centric) or away from (exocentric) a designated center (usually where the speaker is).</T></P>
			</Modal>
			<TextArea rows={8} prop="locDirect" value={TEXT_locDirect || ""}>Does the language have affixes or other functions that represent spatial grounding?</TextArea>
			<Header level={2}>8.5. Evidentiality, Validationality and Mirativity</Header>
			<Modal label="Truth and Certainty" title="Evidentiality">
				<P><T><B>Evidentiality</B> expresses how much evidence the speaker has to make this assertion. For instance, first-hand knowledge is more evidential than third-hand suspect information.</T></P>
				<P><T><B>Validationality</B> is sometimes separate from Evidentiality. It is how languages express relative certainty of truth. We are more likely to be certain of:</T></P>
				<P indent={1}><T>Past events vs future events</T></P>
				<P indent={1}><T>The completion of Perfective events vs still-in-progress events</T></P>
				<P indent={1}><T>Realis assertions vs Irrealis assertions</T></P>
				<P><T><B>Mirativity</B> expresses how well this information fits into the speaker's worldview.</T></P>
				<P indent={1}><T>"The cat was found on the roof" has high mirativity.</T></P>
				<P indent={1}><T>"The elephant was found on the roof" would be surprising, and therefore has very low mirativity.</T></P>
				<P top={2}><T>These markers often operate on the clause level rather than the verb-phrase level. They tend to be tightly tied to TAM.</T></P>
				<P top={2}><T>The most common type of evidential marker is the Hearsay particle.</T></P>
				<P top={2}><T>Tuyuca has a complex, five-level system:</T></P>
				<P indent={1}><T>Witnessed by the speaker</T></P>
				<P indent={1}><T>Not witnessed by the speaker</T></P>
				<P indent={1}><T>General knowledge</T></P>
				<P indent={1}><T>Inferred from evidence</T></P>
				<P indent={1}><T>Hearsay</T></P>
			</Modal>
			<TextArea rows={6} prop="evidence" value={TEXT_evidence || ""}>Are there any grammaticized indicators of Evidentiality, Validationality, or Mirativity?</TextArea>
			<Header level={2}>8.6. Miscellaneous</Header>
			<Modal label="Leftovers" title="Miscelaneous">
				<P><T>There are miscellaneous verb-phrase operations that might or might not exist.</T></P>
				<P indent={1}><T>Lexical time reference (as opposed to tense)</T></P>
				<P indent={2}><T>English: "Yesterday", "today"</T></P>
				<P indent={2}><T>Koyukon: "ee-" means "once only"</T></P>
				<P indent={2}><T>Yagua: "-jásiy" means "earlier today"</T></P>
				<P indent={1}><T>Distributive, i.e. "back and forth" or "all over the place"</T></P>
				<P indent={1}><T>Environmental modification of motion verbs, i.e. "at night", "over water"</T></P>
				<P indent={1}><T>Speaker attitude, i.e. "disgusted" or "complaining"</T></P>
			</Modal>
			<TextArea rows={4} prop="miscVerbFunc" value={TEXT_miscVerbFunc || ""}>Does the language have any other notable verb phrase operations?</TextArea>
		</VStack>
	);
};

export default Section;
