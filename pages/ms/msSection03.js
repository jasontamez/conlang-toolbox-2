import {
	VStack,
	Text
} from 'native-base';
import { useSelector } from 'react-redux';

import { Header, Modal, T, B, I, P, CheckBoxes, TextArea } from './msTags';

const Section = () => {
	const {
		BOOL_APV,
		BOOL_AVP,
		BOOL_VAP,
		BOOL_VPA,
		BOOL_PAV,
		BOOL_PVA,
		BOOL_preP,
		BOOL_postP,
		BOOL_circumP,

		TEXT_mainClause,
		TEXT_verbPhrase,
		TEXT_nounPhrase,
		TEXT_adPhrase,
		TEXT_compare,
		TEXT_questions,
		TEXT_COType,
	} = useSelector(state => state.morphoSyntax);
	return (
		<VStack>
			<Header level={1}>3. Constituent Order Typology</Header>
			<Header level={2}>3.1. In Main Clauses</Header>
			<CheckBoxes
				boxes={[
					BOOL_APV,
					BOOL_AVP,
					BOOL_VAP,
					BOOL_VPA,
					BOOL_PAV,
					BOOL_PVA
				]}
				properties={[
					"BOOL_APV",
					"BOOL_AVP",
					"BOOL_VAP",
					"BOOL_VPA",
					"BOOL_PAV",
					"BOOL_PVA"
				]}
				display={{
					inlineHeaders: ["Primary Order?","Example"],
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
					export: {title: "Constituent Order Typology:"}
				}}
			/>
			<Modal label="What is This?" title="Basic Typology">
				<P><T>Human languages tend towards one of six different basic forms.</T></P>
				<P indent={1}><T><B>S</B> is the Subject of an intransitive clause.</T></P>
				<P indent={2}><T><I>Steve</I> pitches.</T></P>
				<P indent={1}><T><B>V</B> is the verb in a clause.</T></P>
				<P indent={2}><T>Steve <I>pitches</I>.</T></P>
				<P indent={1}><T><B>A</B> is the Agent of a transitive clause.</T></P>
				<P indent={2}><T><I>Steve</I> pitches softballs.</T></P>
				<P indent={1}><T><B>P</B> is the Patient of a transitive clause.</T></P>
				<P indent={2}><T>Steve pitches <I>softballs</I>.</T></P>
				<P top={2}><T>Languages may use one typology most of the time, but switch to another for certain clauses:</T></P>
				<P indent={1}><T>Dependant clauses</T></P>
				<P indent={1}><T>Paragraph-initial clauses</T></P>
				<P indent={1}><T>Clauses that introduce participants</T></P>
				<P indent={1}><T>Questions</T></P>
				<P indent={1}><T>Negative clauses</T></P>
				<P indent={1}><T>Clearly contrastive clauses</T></P>
				<P top={2}><T>"Rigid" systems may put other constituents into the <B>P</B> slot on a regular basis.</T></P>
				<P indent={1}><T>The softball was <I>filthy</I>: predicate adjective.</T></P>
				<P indent={1}><T>Steve was <I>an awful pitcher</I>: predicate nominative.</T></P>
				<P indent={1}><T>Steve went <I>to the dugouts</I>: oblique.</T></P>
				<P top={2}><T>"Flexible" or "free" systems use something other than grammatical relations to determine order:</T></P>
				<P indent={1}><T>Biblical Hebrew puts new, indefinite info pre-verb, definite info post-verb.</T></P>
				<P indent={1}><T>Some will fix PV or AV relations in almost all cases, leaving the other "free".</T></P>
				<P indent={2}><T>Fixed PV → may allow APV and PVA.</T></P>
				<P indent={2}><T>Fixed AV → may allow PAV and AVP.</T></P>
				<P indent={2}><T>Fixed VP → may allow AVP and VPA.</T></P>
				<P indent={2}><T>Fixed VA → may allow VAP and PVA.</T></P>
			</Modal>
			<TextArea prop="mainClause" value={TEXT_mainClause || ""}>Write any more specific notes here.</TextArea>
			<Header level={2}>3.2. Verb Phrases</Header>
			<TextArea rows={4} prop="verbPhrase" value={TEXT_verbPhrase || ""}>Where do auxiliary verbs (semantically empty, e.g. to be/to have) appear in relation to the main verb? Where do adverbs fit in relation to the verb and auxiliaries?</TextArea>
			<Header level={2}>3.3. Noun Phrases</Header>
			<TextArea rows={4} prop="nounPhrase" value={TEXT_nounPhrase || ""}>What is the order of the determiners (4.5), numerals (2.3.3), genitives (possessors), modifiers (2.3.1), relative clauses (10.5), classifiers (4.7), and the head noun?</TextArea>
			<Header level={2}>3.4. Adpositional Phrases</Header>
			<CheckBoxes
				boxes={[
					BOOL_preP,
					BOOL_postP,
					BOOL_circumP
				]}
				properties={[
					"BOOL_preP",
					"BOOL_postP",
					"BOOL_circumP"
				]}
				display={{
					labels: [
						<Text>Preposition (<Text italic>with</Text> an apple)</Text>,
						<Text>Postpostition (an apple <Text italic>with</Text>)</Text>,
						<Text>Circumposition (rare; <Text italic>with</Text> an apple <Text italic>with</Text>)</Text>
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
				}}
			/>
			<Modal label="More Info" title="Adpositions">
				<P><T>Many <B>Adpositions</B> derive from verbs, especially serial verbs (see 10.1).</T></P>
				<P><T>Others derive from nouns, especially body parts (top, back, face, head, etc).</T></P>
				<P><T>Adpositional phrases may appear the same as possessed noun phrases (in front of vs. on his face) or regular nouns (top vs. on top of).</T></P>
			</Modal>
			<TextArea rows={4} prop="adPhrase" value={TEXT_adPhrase || ""}>Which adposition dominates? Do many adpositions come from nouns or verbs?</TextArea>
			<Header level={2}>3.5 Comparatives</Header>
			<Modal label="Comparing Things" title="Comparatives">
				<P><T>Does the language even have a form? Some languages get by with strategies like "X is big, Y is very big."</T></P>
				<P><T>A comparison phrase requires a known standard, a marker that signals this is a comparison, and the quality of comparison.</T></P>
				<P indent={1}><T>For example, in <I>"X is bigger than Y"</I>, (<I>Y</I>) is the known standard, (<I>is __er than</I>) is a comparison marker, and (<I>big</I>) is the quality.</T></P>
				<P><T>PV languages generally use a Standard-Quality-Marker order.</T></P>
				<P><T>VP languages tend towards Quality-Marker-Standard.</T></P>
			</Modal>
			<TextArea prop="compare" value={TEXT_compare || ""}>Does the language have one or more comparative constructions? If so, what is the order of the standard, the marker, and the quality being compared?</TextArea>
			<Header level={2}>3.6 Question Particles and Words</Header>
			<Modal title="Questions">
				<P><T>In many languages, yes/no questions are indicated by a change in intonation. In others, a question particle is used; e.g. <I>do</I> you understand?</T></P>
				<P><T>Informal questions may require a specific question word.</T></P>
				<P top={2}><T>This subject is handled in depth in 9.3.1.</T></P>
			</Modal>
			<TextArea prop="questions" value={TEXT_questions || ""}>How are questions handled in the language? In informational questions, where does the question word occur?</TextArea>
			<Header level={2}>3.7 Summary</Header>
			<TextArea prop="COType" value={TEXT_COType || ""}>When it comes to Agent/Patient/Verb order, is the language very consistent, fairly consistent, or very inconsistent? Note consistency and any deviations not already covered.</TextArea>
		</VStack>
	);
};

export default Section;
