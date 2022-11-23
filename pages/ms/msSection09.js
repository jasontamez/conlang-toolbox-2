import {
	VStack
} from 'native-base';
import { useSelector } from 'react-redux';

import { Header, Modal, Tabular, T, B, I,  P, TextArea } from './msTags';

const Section = () => {
	const {
		TEXT_pragFocusEtc,
		TEXT_negation,
		TEXT_declaratives,
		TEXT_YNQs,
		TEXT_QWQs,
		TEXT_imperatives
	} = useSelector(state => state.morphoSyntax);
	return (
		<VStack>
			<Header level={1}>9. Pragmatically Marked Structures</Header>
			<Modal label="What are Pragmatics?" title="Pragmatics">
				<P><T>Pragmatics is the interpretation of utterances, and Pragmatic Statuses relate the <I>content</I> of an utterance to its <I>context</I>. They cover the following concepts:</T></P>
				<P indent={1}><T><B>Identifiability</B>: can an argument be identified by the listener?</T></P>
				<P indent={2}><T>English uses proper names and "the" to indicate identifiability.</T></P>
				<P indent={1}><T><B>Objective Referentiality</B>: is an argument a bounded, individual entity?</T></P>
				<P indent={2}><T>English can be ambiguous: Does "I'm looking for a housekeeper" mean anyone who is housekeeper, or a specific housekeeper the speaker is not naming?</T></P>
				<P indent={2}><T>Spanish has a particle <I>a</I> for human arguments that indicates a specific individual is being talked about.</T></P>
				<P indent={3}><T>"Buscando una empleada" - I'm looking for a (any) housekeeper</T></P>
				<P indent={3}><T>"Buscando a una empleada" - I'm looking for a (specific) housekeeper</T></P>
				<P indent={1}><T><B>Discourse Referentiality</B>: is an argument relevant to the discourse or just adjacent?</T></P>
				<P indent={2}><T>Panago: putting a new argument before a verb "foreshadows" that the argument will be important later. Putting it after the verb means it's just transitory.</T></P>
				<P indent={2}><T>English often uses <I>this</I> to indicate importance. If you hear someone say, "Take a look at <I>this</I> guy," you can be sure they're going to continue talking about the guy!</T></P>
				<P indent={1}><T><B>Focus</B> covers multiple concepts:</T></P>
				<P indent={2}><T><B>Marked Focus</B>:</T></P>
				<P indent={3}><T>"Mom <I>did</I> give me permission!" - English uses "do" to focus on the truth of a statement, often in opposition to the listener's beliefs.</T></P>
				<P indent={2}><T><B>Assertive Focus</B>:</T></P>
				<P indent={3}><T>"Mary was wearing <I>this hideous bridesmaid's dress</I>." - the speaker believes the listener has no knowledge of the information.</T></P>
				<P indent={2}><T><B>Counter-Presuppositional Focus</B>:</T></P>
				<P indent={3}><T>"The nerd and the cheerleader came to the party, but <I>the nerd</I> won everyone's hearts." - the speaker believes the listener believes the opposite.</T></P>
				<P indent={2}><T><B>Exhaustive Focus</B>:</T></P>
				<P indent={3}><T>"I <I>only</I> spoke to Ned." - the speaker excludes all other possible options.</T></P>
				<P indent={2}><T><B>Contrastive Focus</B>:</T></P>
				<P indent={3}><T>"<I>Mary</I> chose the dresses." - the listener may believe one participant had a specific role, but the speaker is saying someone else held that role.</T></P>
				<P indent={1}><T><B>Topic</B>:</T></P>
				<P indent={2}><T>"<I>Beans</I>, how I hate them." - a new argument is declared as a topic of further discourse.</T></P>
			</Modal>
			<Header level={2}>9.1 Focus, Contrast and Topicalization</Header>
			<Modal label="Focus is What This is About" title="Focus, Contrast, etc.">
				<P><T><B>Intonation and Vocalization</B>, such as tempo changes ("Do. Not. Do. That."), volume changes (screaming, whispering), and pitch changes ("Do <I>not</I> do that"), are nearly universal.</T></P>
				<P top={2}><T><B>Constituent Order</B>:</T></P>
				<P indent={1}><T>Practically all language use <B>Preposing</B>, moving an argument by itself to a position before a clause that it's relative to. The opposite is <B>Postposing</B>.</T></P>
				<P indent={2}><T>"<I>Potatoes</I>, I like them."</T></P>
				<P indent={1}><T><B>Fronting</B> is similar, but rearranges arguments so that Pragmatic Status is given to the moved argument.</T></P>
				<P indent={2}><T>"<I>Potatoes</I> I like."</T></P>
				<P indent={1}><T><B>Apposition</B> is adding a free noun phrase to a clause.</T></P>
				<P indent={2}><T>"<I>Termites</I>. Why does the universe hate me?"</T></P>
				<P indent={1}><T><B>Clefting</B> is a type of predicate nominal where a noun phrase is joined to a relative clause that references that original noun phrase. (See below.)</T></P>
				<P indent={2}><T>"<I>You</I> are <I>the one that I want</I>."</T></P>
				<P top={2}><T><B>Formatives</B> move along a continuum between morphological case markers (4.4) and pragmatic status markers:</T></P>
				<P indent={1}><T>The continuum:</T></P>
				<P indent={2}><T><B>Pragmatic Status Markers</B>: English articles, Aghem focus particles (see below), etc.</T></P>
				<P indent={2}><T><B>Overlay systems</B>: Japanese and Korean "topic marking"</T></P>
				<P indent={2}><T><B>Case Markers</B>: Latin, Eskimo, Russian, Quechua, etc.</T></P>
				<P indent={1}><T>Remember that these can partially correlate with grammatical roles: e.g. English <I>subjects</I> are often also <I>identifiable</I>.</T></P>
				<P top={2} indent={2}><T>Aghem uses verb morphology and focus particles to express various pragmatic nuances.</T></P>
				<P indent={3}><T>"énáʔ <I>mɔ̀</I> fúo kí-bɛ́ â fín-ghɔ́" - Inah gave fufu to his friends.</T></P>
				<P indent={3}><T>"énáʔ <I>má՚á</I> fúo kí-bɛ́ â fín-ghɔ́" - Inah <I>DID</I> give fufu to his friends. (truth focus)</T></P>
				<P top={2} indent={3}><T>"fú kí mɔ̀ ñiŋ <I>nò</I> á kí-՚bé" - The rat <I>ran</I> (did not walk, scurry, etc) in the compound.</T></P>
				<P indent={3}><T>"fú kí mɔ̀ ñiŋ á kí-՚bé <I>nò</I>" - The rat ran in <I>the compound</I> (not in the house, church, etc.).</T></P>
				<P top={2} indent={2}><T>Akam has a focus particle <I>na</I> and a contrastive particle <I>de</I>.</T></P>
				<P indent={3}><T>"Kwame <I>na</I> ɔbɛyɛ adwuma no." - It's Kwame (not anyone else) who will do the work.</T></P>
				<P indent={3}><T>"Kwame <I>de</I> ɔbɛkɔ, na Kofi <I>de</I> ɔbɛtena ha." - Kwame will go, but Kofi will stay here.</T></P>
				<P top={2} indent={2}><T><B>Overlay</B> systems are a combination of case-marking systems and pragmatic status-marking systems: one or more basic case markers are replaced (overlaid) by the status marker when a nominal is singled out for pragmatic treatment.</T></P>
				<P indent={3}><T>The Japanese topic marker <I>wa</I> can overlay the subject marker <I>ga</I> or the object marker <I>o</I>.</T></P>
				<P indent={4}><T>"taroo <I>ga</I> hon <I>o</I> katta." - Taro bought a book.</T></P>
				<P indent={4}><T>"taroo <I>wa</I> hon o katta." - As for Taro, he bought a book.</T></P>
				<P indent={4}><T>"hon <I>wa</I> taroo ga katta." - As for the book, Taro bought it.</T></P>
			</Modal>
			<TextArea rows={8} prop="pragFocusEtc" value={TEXT_pragFocusEtc || ""}>Are there special devices for indicating Pragmatic Statuses in basic clauses? Describe cleft constructions, if there are any.</TextArea>
			<Header level={2}>9.2 Negation</Header>
			<Modal label="Don't not read this." title="Negation">
				<P><T>Common negation strategies:</T></P>
				<P indent={1}><T><B>Clausal negation</B> - negates an entire proposition</T></P>
				<P indent={2}><T>"I didn't do it."</T></P>
				<P indent={1}><T><B>Constituent negation</B> - negates a particular constituent of a proposition</T></P>
				<P indent={2}><T>"I have no motive."</T></P>
				<P top={2}><T><B>Clausal Negation</B></T></P>
				<P top={2} indent={1}><T><B>Lexical Negation</B></T></P>
				<P indent={2}><T>Some verbs just function as the opposite of other verbs, such as "have" vs "lack".</T></P>
				<P top={2} indent={1}><T><B>Morphological Negation</B></T></P>
				<P indent={2}><T>Clausal negations are usually associated with the verb.</T></P>
				<P indent={2}><T>Often tied to other verbal inflections, such as expressing aspect or tense.</T></P>
				<P top={2} indent={1}><T><B>Analytical Negation</B></T></P>
				<P indent={2}><T>This includes negative particles and negative finite verbs.</T></P>
				<P top={2} indent={2}><T><B>Multiple Expressions of Negation</B></T></P>
				<P indent={3}><T>It's common for negative constructions to have multiple operators, e.g:</T></P>
				<P indent={4}><T>two particles</T></P>
				<P indent={4}><T>a particle and an affix</T></P>
				<P indent={4}><T>a particle, an affix, and a word order change</T></P>
				<P top={2} indent={2}><T><B>Different Kinds of Negation</B></T></P>
				<P indent={3}><T>In many languages, the negative affix or particle varies according to tense, aspect, mode, or other factors.</T></P>
				<P indent={4}><T>It's fairly common for negative imperatives to differ from negative assertions (e.g. Mandarin, Hebrew, Tennet).</T></P>
				<P indent={4}><T>Tagalog and many Austronesian languages use different particles for plain negatives and negation of existence.</T></P>
				<P indent={5}><T>"Mayroon ka ang pera?" "Wala." - Do you have any money? None.</T></P>
				<P indent={5}><T>"Pupunta ka ba sa sayawan?" "Hindi." - Are you going to the dance? No.</T></P>
				<P indent={4}><T>Mandarin has <I>méi</I> for existential negatives, <I>bié</I> for negative imperatives, and <I>bu</I> for everything else.</T></P>
				<P indent={4}><T>Iraqi Arabic has one particle (mɑː) for verbal predicates and another (muː) for verbless predicates (predicate nominals, locationals, existentials, etc.).</T></P>
				<P top={2} indent={3}><T>Another method is a finite negative verb and a complement clause (10, 10.2)</T></P>
				<P indent={4}><T>The negative verb will take finite inflectional morphology and occur in the normal position for a verb. The affirmative verb will be treated like a complement verb.</T></P>
				<P indent={4}><T>This occurs primarily in verb-initial and verb-final languages.</T></P>
				<P indent={5}><T>Tungan, a verb-initial language:</T></P>
				<P indent={6}><T>"Na'e-<I>alu</I> 'a Siale" - Charlie went.</T></P>
				<P indent={6}><T>"Na'e-<I>'ikai</I> ke <I>'alu</I> 'a Siele" - Charlie didn't go.</T></P>
				<P top={2} indent={1}><T><B>Secondary Methods of Negation</B></T></P>
				<P indent={2}><T>Alternate word order:</T></P>
				<P indent={3}><T>Many VP languages change their order for negative clauses. For example, Kru uses AVP for affirmative clauses and APV in negative clauses.</T></P>
				<P indent={2}><T>Change in tone:</T></P>
				<P indent={3}><T>Igbo carries a low tone in affirmative clauses and a high tone in negative clauses.</T></P>
				<P indent={2}><T>Neutralization of tense-aspect distinctions:</T></P>
				<P indent={3}><T>Komi has a present-future distinction in affirmative, but no such distinction in the negative.</T></P>
				<P indent={3}><T>Bembe allows two future tense markers in affirmative, but only one of them in the negative.</T></P>
				<P indent={2}><T>Special inflections:</T></P>
				<P indent={3}><T>A few languages have special person/number ot TAM markers on verbs in negative clauses. (Negative verbs tend to hold onto older patterns that have been lost in affirmative clauses!)</T></P>
				<P indent={2}><T>Alternative case-marking patterns:</T></P>
				<P indent={3}><T>Special case-marking patterns may occur in negative clauses. For example, with certain Russian verbs, the object will be in accusative for affirmative clauses and in genitive case in negative clauses.</T></P>
				<P top={2} indent={1}><T><B>Constituent Negation</B></T></P>
				<P top={2} indent={2}><T><B>Derivational Negation</B>:</T></P>
				<P indent={3}><T>Some languages allow a derivation of a stem to transform it into its opposite.</T></P>
				<P indent={3}><T>English has the not-fully-productive <I>non-</I> and <I>un-</I> prefixes that only work on adjectives and nominals.</T></P>
				<P indent={3}><T>Panare has a verbal suffix <I>-(i)ka</I> that forms something akin to the opposite of the root verb.</T></P>
				<P top={2} indent={2}><T><B>Negative Quantifiers</B>:</T></P>
				<P indent={3}><T>Many languages have inherently negative quantifiers ("none", "nothing") or can be negated independent of clause ("not many").</T></P>
				<P indent={3}><T>Most languages allow or require such quantifiers to be accompanied by clausal negation.</T></P>
				<P indent={4}><T>Standard English is rare in disallowing such use of "double negatives".</T></P>
				<P top={2} indent={1}><T><B>Negative Scope</B>:</T></P>
				<P indent={2}><T>Sometimes the two types of negation interact to cause variations in the scope of what can be negated.</T></P>
				<Tabular
					rows={[
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
					]}
					indent={2}
				/>
			</Modal>
			<TextArea rows={8} prop="negation" value={TEXT_negation || ""}>Describe the standard way of creating a negative clause, plus any secondary strategies that may exist. Is there constituent or derivational negation?</TextArea>
			<Header level={2}>9.3 Non-Declarative Speech</Header>
			<Modal label="Minor Note on Declaratives" title="Declarative Statements">
				<P><T>A declarative statement is an assertion. Most speech is declarative.</T></P>
				<P><T>Other types of statements are usually handled as "modes" in a language, such as interrogative (questions) and imperatives (commands).</T></P>
				<P top={2}><T>Most often, a language will leave declarative statements unmarked and only mark the others. But some (e.g. Tibetan) will mark declaratives, too.</T></P>
			</Modal>
			<TextArea rows={3} prop="declaratives" value={TEXT_declaratives || ""}>If declaratives are marked, describe how.</TextArea>
			<Header level={3}>9.3.1 Interrogatives</Header>
			<Header level={4}>9.3.1.1. Yes/No Questions</Header>
			<Modal label="Yes? No?" title="Yes/NoQuestions">
				<P><T><B>Yes/No Questions</B>, hereafter referred to as <I>YNQs</I>, are interrogative clauses where the expected answer is either "yes" or "no". They can employ any or all of the strategies below.</T></P>
				<P top={2}><T><I>Intonation</I>:</T></P>
				<P indent={1}><T>There tends to be distinct intonation patterns in YNQs.</T></P>
				<P indent={1}><T>The pattern is usually rising, as in English, but can be falling, as in Russian.</T></P>
				<P top={2} indent={1}><T>Some languages <I>only</I> employ intonation!</T></P>
				<P top={2}><T><I>Word Order</I>:</T></P>
				<P indent={1}><T>Many languages, especially VP languages, use distinctive constituent orders for YNQs.</T></P>
				<P indent={1}><T>Usually, this is an inversion of the Agent and Verb, as in many European and Austronesian languages.</T></P>
				<P indent={2}><T>"bapak datangkah nanti" - Father will come later (Malay)</T></P>
				<P indent={2}><T>"datangkah bapak nanti" - Will father come later?</T></P>
				<P indent={1}><T>English has a strange system where it reverses the Agent and the auxiliary verb. If no auxiliary is present, the verb "do" is inserted.</T></P>
				<P indent={2}><T>"He will arrive on time" → "Will he arrive on time?"</T></P>
				<P indent={2}><T>"They can eat cake" → "Can they eat cake?"</T></P>
				<P indent={2}><T>"You want to join me" (no auxiliary) → "Do you want to join me?"</T></P>
				<P indent={1}><T>American English uses simple Agent/Verb inversion in predicate nominals, existential and locational clauses. British English extends this to possessive constructions.</T></P>
				<P indent={2}><T>"He is a cat" → "Is he a cat?"</T></P>
				<P indent={2}><T>"Cats are under the bed" → "Are cats under the bed?"</T></P>
				<P indent={2}><T>"You were in the garden" → "Were you in the garden?"</T></P>
				<P indent={2}><T>"You have a match" → "Have you a match?" (British)</T></P>
				<P top={2}><T><I>Interrogative Particle</I>:</T></P>
				<P indent={1}><T>Question Particles (QPs) are very common, especially among PV languages, but they do appear in VP languages, too.</T></P>
				<P indent={1}><T>The QP can be cliticized to the first constituent in the clause, either before or after it.</T></P>
				<P indent={2}><T>Latin:</T></P>
				<Tabular
					rows={[
						[
							"erat-ne",
							"te-cum"
						],
						[
							"he:was-QP",
							"you-with"
						]
					]}
					top={0}
					indent={2}
					final="Was he with you?"
				/>
				<P indent={2}><T>Mandarin:</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={2}
					final="Does she like to eat apples?"
				/>
				<P indent={2}><T>Tagalog:</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={2}
					final="Is Pilar kind?"
				/>
				<P indent={1}><T>Often, the QP can be omitted, letting context and intonation do the job instead.</T></P>
				<P top={2} indent={1}><T>Some varieties of English have developed a QP as an alternative to word order inversion</T></P>
				<P indent={2}><T>"You want to go for a ride, <I>eh</I>?"</T></P>
				<P top={2}><T><I>Tag Question</I>:</T></P>
				<P indent={1}><T>This involves a simple declarative statement, followed by a Tag that requests confirmation or disconfirmation of the statement.</T></P>
				<P indent={1}><T>These are universally a secondary way of forming YNQs, though they are often the historical source of the currently-used QPs.</T></P>
				<P top={2} indent={1}><T>English has Tags for certain times the speaker is assuming they'll get a Yes response:</T></P>
				<P indent={2}><T>"Nice day, <I>isn't it</I>?"</T></P>
				<P indent={2}><T>"You're going to the club with us tonight, <I>right</I>?"</T></P>
				<P top={2}><T><B>Functions</B>:</T></P>
				<P indent={1}><T>YNQs are used for additional purposes other than simply asking questions in most languages.</T></P>
				<P top={2} indent={1}><T><I>To request action</I>: "Could you close the door?"</T></P>
				<P indent={1}><T><I>Rhetorical effect</I>: "Are you always so messy?"</T></P>
				<P indent={1}><T><I>Confirmation</I>: "Aren't you going?"</T></P>
				<P indent={1}><T><I>Intensification</I>: "Did he ever yell!"</T></P>
			</Modal>
			<TextArea rows={4} prop="YNQs" value={TEXT_YNQs || ""}>How are yes/no questions formed? Do they serve other discourse functions other than the obvious?</TextArea>
			<Header level={4}>9.3.1.2. Questions-Word Questions</Header>
			<Modal label="Who? What? Why?" title="Question-Word Questions">
				<P><T>Also known as <B>Content Questions</B> or <B>Information Questions</B>, Question-Word Questions (QWs) are best exemplified by the English words who, whom, what, where, when, why, which, and how.</T></P>
				<P><T>All languages have a set of special QWQs. Often, they're similar or identical to a set of pronouns used elsewhere in the language. (e.g. English's who, where, when.)</T></P>
				<P><T>QWs accomplish two things:</T></P>
				<P indent={1} noDot><T>1. Mark the clause as a question.</T></P>
				<P indent={1} noDot><T>2. Indicate what information is being requested.</T></P>
				<P top={2}><T>In VP languages (like English) it is typical for the QW to appear at the start of the clause, possibly leaving a gap in the normal position.</T></P>
				<P indent={1}><T>"Mark gave the cakes to Jimmy." → "Who gave the cakes to Jimmy?" → "Who did Mark give the cakes to?"</T></P>
				<P><T>Many PV languages leave the QW in the "normal" position, such as Japanese and Tibetan.</T></P>
				<P><T>Most PV languages can either leave the QW in position, or it can move to the front.</T></P>
				<P><T>Some VP languages allow or require leaving the QW in position, such as Mandarin and many eastern African languages.</T></P>
				<P top={2}><T>QWs can usually take case markers and/or adpositions.</T></P>
				<P indent={1}><T>When the QW from an oblique clause is fronted, the adposition may or may not come with it.</T></P>
				<P indent={2}><T><I>What</I> did you travel <I>with</I>?</T></P>
				<P indent={2}><T><I>With what</I> did you travel?</T></P>
			</Modal>
			<TextArea rows={4} prop="QWQs" value={TEXT_QWQs || ""}>How are information questions formed?</TextArea>
			<Header level={4}>9.3.2. Imperatives</Header>
			<Modal label="Command Sentences" title="Imperatives">
				<P><T>Imperatives are direct commands to an addressee.</T></P>
				<P><T>It is often not necessary to indicate the Agent (addressee), since the actor is obvious.</T></P>
				<P><T>Fewer TAM constructs are typically allowed, since it is pragmatically impossible to perform certain actions (past tense, present progressive, etc).</T></P>
				<P><T>Sometimes imperatives take special verb forms or affixes, as in Greenlandic Iñupiat, and/or special negation strategies.</T></P>
				<P top={2}><T>Imperatives are often associated with Irrealis modes (8.3.3)</T></P>
				<P top={2}><T>Sometimes imperatives affect case marking.</T></P>
				<P indent={1}><T>Finnish puts the Patients of imperatives in nominative case instead of accusative case.</T></P>
				<P top={2}><T>Different types of imperatives may exist.</T></P>
				<P indent={1}><T>In Panare, the suffix <I>-kë</I> is for plain imperatives, while <I>-ta'</I> is used for imperatives involving motion.</T></P>
				<P top={2}><T>First-person imperatives are rare. (e.g. "Let's eat." vs "Come eat with me.")</T></P>
			</Modal>
			<TextArea rows={4} prop="imperatives" value={TEXT_imperatives || ""}>How are imperatives formed? Are there "polite" imperatives that contrast with more direct imperatives?</TextArea>
		</VStack>
	);
};

export default Section;
