import {
	VStack
} from 'native-base';
import { useSelector } from 'react-redux';

import { Header, Modal, Tabular, T, B, I, P, CheckBoxes, TextArea } from './msTags';

const Section = () => {
	const {
		BOOL_markInv,
		BOOL_markDirInv,
		BOOL_verbAgreeInv,
		BOOL_wordOrderChange,

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
		TEXT_objDemOmInc
	} = useSelector(state => state.morphoSyntax);
	return (
		<VStack>
			<Header level={1}>7. Voice and Valence Adjusting Operations</Header>
			<Modal label="What is Valence?" title="Valence">
				<P><T><B>Valence</B> refers to the amount of arguments in a clause.</T></P>
				<P indent={1}><T>"I fell" has a valence of 1.</T></P>
				<P indent={1}><T>"I pushed Steve" has a valence of 2.</T></P>
				<P indent={1}><T>"I gave Steve a coconut" has a valence of 3.</T></P>
				<P indent={1}><T>"I gave a coconut to Steve" has a valence of 2.</T></P>
				<P indent={2}><T>"To Steve" is in an oblique case, forming a verb modifier instead of being an argument of the verb.</T></P>
			</Modal>
			<Header level={2}>7.1. Valence-Increasing Operations</Header>
			<Header level={3}>7.1.1. Causatives</Header>
			<Modal label="Forcing You to Read This" title="Causatives">
				<P><T><B>Lexical</B>:</T></P>
				<P indent={1}><T>Most languages have at least some form of this. There are three major methods employed:</T></P>
				<P indent={2}><T>No change in the verb:</T></P>
				<P indent={3}><T>"The vase broke" becomes "Steve broke the vase".</T></P>
				<P indent={2}><T>Some idiosyncratic change in the verb:</T></P>
				<P indent={3}><T>"The tree fell" becomes "Steve felled the tree".</T></P>
				<P indent={2}><T>Different verb:</T></P>
				<P indent={3}><T>"The tree died" becomes "Steve killed the tree".</T></P>
				<P><T><B>Morphological</B>:</T></P>
				<P indent={1}><T>The verb change applies to all verbs (not just one, like <I>fell</I> vs <I>felled</I>).</T></P>
				<P indent={1}><T>Often expresses causation and permission.</T></P>
				<P indent={1}><T>May be restricted to only intransitive verbs.</T></P>
				<P indent={1}><T>In transitive verbs, the causee often goes into a different case.</T></P>
				<P><T><B>Analytical</B>:</T></P>
				<P indent={1}><T>A separate causative verb is used. This usually isn't valence-increasing!</T></P>
				<P indent={2}><T>"Steve caused the tree to die".</T></P>
				<P indent={2}><T>"Steve forced the stick into the ground."</T></P>
				<P top={2}><T><B>Coding Principles</B>:</T></P>
				<P indent={1}><T><B>Structural Distance</B></T></P>
				<P indent={2}><T>If the language has more than one formal type of causative, the "smaller" one will be used for more direct causation, while the "larger" one will be used for less direct causation. Longer linguistic distance correlates to greater conceptual distance.</T></P>
				<P indent={3}><T>"George killed Joe" is more direct than "George caused Joe to die".</T></P>
				<P indent={3}><T>Amharic has an <I>a-</I> prefix for direct causation, <I>as-</I> for indirect.</T></P>
				<P indent={2}><T>Analytic causatives often "require" an animate causee.</T></P>
				<P indent={3}><T>Japanese has a morphological causative when the causee has some control over the event, but requires a lexical causative for inanimate causees.</T></P>
				<P indent={3}><T>Consider "Joe made George come down" vs "Joe brought the golf clubs down".</T></P>
				<P><T><B>Finite vs. Non-Finite Verbs</B></T></P>
				<P indent={1}><T>The more distant the cause from the effect in space or time, the more finite the verb will be.</T></P>
				<P indent={2}><T>Ex: <I>"Jorge </I><B>hizo comer</B> pan a Josef"<I> indicates Jorge forced Josef to eat bread directly, while </I>"Jorge <B>hizo</B> que Josef <B>comiera</B> pan"<I> indicates he forced Josef indirectly, maybe by removing all other food.</I></T></P>
				<P><T><B>Case</B></T></P>
				<P indent={1}><T>If the causee retains a high degree of control, it will appear in a case associated with Agents, but with little control, will appear in a Patient case.</T></P>
				<P indent={2}><T>Ex: "Steve asked that <I>he</I> leave" gives Steve less control over the situation than "Steve asked <I>him</I> to leave".</T></P>
			</Modal>
			<TextArea rows={4} prop="causation" value={TEXT_causation || ""}>Describe which method(s) the language uses to create causatives.</TextArea>
			<Header level={3}>7.1.2. Applicatives</Header>
			<Modal label="Adding a Third Participant" title="Applicatives">
				<P><T>The verb is marked for the role of a direct object, bringing a peripheral participant (the applied object) on stage in a more central role.</T></P>
				<P indent={1}><T>This may turn a transitive verb ditransitive, or it may replace the direct object entirely (which technically isn't valence-increasing!)</T></P>
				<P top={0} indent={1}><T>"I arrived at Shionti's" in Nomatsiguenga.</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={1}
				/>
			</Modal>
			<TextArea rows={4} prop="applicatives" value={TEXT_applicatives || ""}>Describe which method(s) the language uses for applicatives, if any.</TextArea>
			<Header level={3}>7.1.3. Dative Shift</Header>
			<Modal label="Looking Shifty" title="Dative Shift">
				<P><T>This only applies to verbs that take an Agent, a Patient and a Recipient or Experiencer. This latter argument is usually put in the <I>dative</I> case.</T></P>
				<P><T>Applicatives mark the verb, while a Dative Shift does not.</T></P>
				<P><T>Applicatives usually promote Instrumentals, while Dative Shifts usually promote Recipients and Benefactives.</T></P>
				<P><T>Example:</T></P>
				<P indent={1}><T>"Steve gave the ball to Linda." Valence: 2</T></P>
				<P indent={1}><T>"Steve gave Linda the ball." Valence: 3, recipient promoted.</T></P>
			</Modal>
			<TextArea rows={4} prop="dativeShifts" value={TEXT_dativeShifts || ""}>Is there a dative shift construction in the language? What is it? What semantic roles can be shifted? Is it obligatory?</TextArea>
			<Header level={3}>7.1.4. Dative of Interest</Header>
			<Modal label="Pique Your Interest" title="Dative of Interest">
				<P><T>This is adding a participant that is associated in some way.</T></P>
				<P indent={1}><T>"Dinner is burned [for me]" in Spanish</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={1}
				/>
				<P indent={1}><T>"She cut the hair [on him]" in Spanish.</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={1}
				/>
			</Modal>
			<TextArea rows={4} prop="datOfInt" value={TEXT_datOfInt || ""}>Is there a dative-of-interest operation?</TextArea>
			<Header level={3}>7.1.5. Possessor Raising (a.k.a. External Possession)</Header>
			<Modal label="What is This?" title="Possessor Raising">
				<P><T>In many languages, this exists separate from a dative of interest.</T></P>
				<P indent={1}><T>"I fixed the railroad track" in Choctaw.</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={1}
				/>
			</Modal>
			<TextArea rows={4} prop="possessRaising" value={TEXT_possessRaising || ""}>Does possessor raising occur?</TextArea>
			<Header level={2}>7.2. Valence-Decreasing Operations</Header>
			<Header level={3}>7.2.1. Reflexives</Header>
			<Modal label="You Are Me?" title="Reflexives">
				<P><T>The Agent and Patient are the same, so one is omitted.</T></P>
				<P top={2}><T>Lexical reflexives:</T></P>
				<P indent={1}><T>The verb itself implies reflexivity.</T></P>
				<P indent={2}><T>e.g.: Steve washed and shaved every morning.</T></P>
				<P><T>Morpholigical reflexives:</T></P>
				<P indent={1}><T>A word (or words) is modified to indicate the reflexive.</T></P>
				<P indent={2}><T>e.g.: Spanish: Jorge se lavo. (George washed himself, "se lavo" being a morphing of the root verb "lavarse".)</T></P>
				<P><T>Analytic reflexives:</T></P>
				<P indent={1}><T>Inserting a lexical word, making a semantic valence-lowering (but not a lexical one).</T></P>
				<P indent={2}><T>e.g.: Steve washed himself.</T></P>
				<P indent={1}><T>These are often based on body parts.</T></P>
				<P indent={2}><T>e.g.: Another face in the crowd; Move your butt!</T></P>
			</Modal>
			<TextArea rows={4} prop="refls" value={TEXT_refls || ""}>How are reflexives handled?</TextArea>
			<Header level={3}>7.2.2. Reciprocals</Header>
			<Modal label="Working Together" title="Reciprocals">
				<P><T>The Agent and Patient are performing the same action, or performing an action together. These are often expressed the same way as reflexives.</T></P>
				<P top={2}><T>Lexical reciprocals:</T></P>
				<P indent={1}><T>The verb itself implies reciprocity.</T></P>
				<P indent={2}><T>e.g.: Steve and Jane shook hands [with each other].</T></P>
				<P><T>Morpholigical and lexical reciprocals follow the same patterns as those for reflexives.</T></P>
			</Modal>
			<TextArea rows={3} prop="recips" value={TEXT_recips || ""}>How are reciprocals handled?</TextArea>
			<Header level={3}>7.2.3. Passives</Header>
			<Modal label="Moving Focus From the Agent" title="Passives">
				<P><T>A semantically transitive verb with omitted Agent, the Patient treated as Subject, and the verb behaves as if it is intransitive. (The Agent is made less topical than the Patient.)</T></P>
				<P top={2}><T>Personal passive: Agent is implied, or expressed obliquely.</T></P>
				<P indent={1}><T>Lexical passives are rare.</T></P>
				<P indent={1}><T>Morphological passives are more common, often the same morphology as perfect aspect. May be derived from copulas or nominalizations.</T></P>
				<P indent={1}><T>English has analytic passives, with a copula and a "past participle" (Patient nominalization).</T></P>
				<P indent={2}><T>e.g.: The tree has been killed.</T></P>
				<P top={2}><T>Impersonal passive: no Agent directly indicated; can be used for intransitive verbs as well as transitive.</T></P>
				<P indent={1}><T>No known languages uses a specific morphology for this!</T></P>
				<P top={2}><T>Other kinds of passives may exist.</T></P>
				<P indent={1}><T>English has the basic "Steve was eaten by a bear" but can also express it with other verbs, as in "Steve got eaten by a bear."</T></P>
				<P indent={1}><T>Yup'ik has an adversative passive (to the detriment of the subject), abilitative passive (X can be Y [by Z]), and a negative abilitiative (X cannot be Y [by Z]).</T></P>
				<P top={2}><T>Passive construction may be obligatory in a particular environment, e.g. when the Patient outranks the Agent.</T></P>
			</Modal>
			<TextArea rows={4} prop="passives" value={TEXT_passives || ""}>How are passives handled?</TextArea>
			<Header level={3}>7.2.4. Inverses</Header>
			<Modal label="Playing The Reverse Card" title="Inverses">
				<P><T>This is a valence "rearranging" device, e.g. "Steve taught him" becomes "Him, Steve taught."</T></P>
				<P><T>Often follows a hierarchy where a "higher" Agent requires direct and a "lower" Agent requires the inverse.</T></P>
			</Modal>
			<CheckBoxes
				boxes={[
					BOOL_markInv,
					BOOL_markDirInv,
					BOOL_verbAgreeInv,
					BOOL_wordOrderChange
				]}
				display={{
					labels: [
						"Marked inverse only",
						"Both direct and inverse explicitly marked",
						"Special verb agreement markers for inverse",
						"Functional inverse: word order changes, e.g. VAP becomes VPA"
					],
					export: {title: "Inverse Constructions:"}
				}}
			/>
			<TextArea rows={4} prop="inverses" value={TEXT_inverses || ""}>Describe any peculiarities of inverse constructions.</TextArea>
			<Header level={3}>7.2.5. Middle Constructions</Header>
			<Modal label="What Are These?" title="Middle Constructions">
				<P><T>Also known as anticausatives or detransitivation: a semantically transitive situation expressed as a process undergone by a Patient (rather than carried out by an Agent).</T></P>
				<P><T>Many languages express this the same way as they express passives.</T></P>
				<P><T>This often express the notion that the subject is both controller and affected.</T></P>
				<P indent={1}><T>e.g. "Steve broke the car" becomes "The car broke" (and it was no fault of Steve's).</T></P>
			</Modal>
			<TextArea rows={3} prop="middleCon" value={TEXT_middleCon || ""}>How are middle constructions handled?</TextArea>
			<Header level={3}>7.2.6. Antipassives</Header>
			<Modal label="What Are These?" title="Antipassives">
				<P><T>Similar to passives, but the Patient is downgraded instead of the Agent.</T></P>
				<P><T>Generally, this only happens in ergative languages or in languages without verbal agreement, but many exceptions exist.</T></P>
				<P><T>Often, the Patient is omitted or oblique, the verb is marked intrasitive, and the Agent is placed in absolutive case.</T></P>
			</Modal>
			<TextArea rows={3} prop="antiP" value={TEXT_antiP || ""}>Describe antipassive strategies in the language, if they exist.</TextArea>
			<Header level={3}>7.2.7. Object Demotion/Omission/Incorporation</Header>
			<Modal label="What Are These?" title="Object Demotion and Related Functions">
				<P><T><B>Demotion</B>: "Steve shot Bob" becomes "Steve shot at Bob".</T></P>
				<P top={2}><T><B>Omission</B>: "Steve shot Bob" becomes "Steve shot".</T></P>
				<P top={2}><T><B>Incorporation</B>: "Steve shot Bob" becomes "Steve Bob-shot".</T></P>
				<P indent={1}><T>The incorporated object is usually the Patient, rarely the Agent.</T></P>
				<P indent={1}><T>May have other semantic functions.</T></P>
				<P indent={2}><T>In Panare, incorporating a body part noun into a cutting verb means the part was cut completely off ("Darth Vader hand-cut"), whereas leaving it unincorporated means it was merely injured ("Darth Vader cut hand").</T></P>
			</Modal>
			<TextArea rows={5} prop="objDemOmInc" value={TEXT_objDemOmInc || ""}>Is object demotion/omission allowed? How about incorporation?</TextArea>
		</VStack>
	);
};

export default Section;
