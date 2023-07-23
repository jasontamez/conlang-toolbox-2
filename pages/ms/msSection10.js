import {
	VStack
} from 'native-base';
import { useSelector } from 'react-redux';

import { Header, Modal, Tabular, T, B, I, S, P, CheckBoxes, TextArea } from './msTags';

const Section = () => {
	const {
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

		TEXT_serialVerbs,
		TEXT_complClauses,
		TEXT_advClauses,
		TEXT_clauseChainEtc,
		TEXT_relClauses,
		TEXT_coords
	} = useSelector(state => state.morphoSyntax);
	return (
		<VStack>
			<Header level={1}>10. Clause Combinations</Header>
			<Modal label="Quick Primer on Clauses" title="Terms">
				<P><T>An <B>Independant Clause</B> is one that is fully inflected and can stand on its own.</T></P>
				<P><T>A <B>Dependant Clause</B> depends on some other clause for at least a part of its inflectional information.</T></P>
				<P top={2}><T>"The gull beat its wings, achieving liftoff easily."</T></P>
				<P indent={1}><T><I>The gull beat its wings</I> is Independant.</T></P>
				<P indent={1}><T><I>Achieving liftoff easily</I> is Dependant.</T></P>
				<P top={2}><T>"Breathing heavily, the runner crossed the finish line."</T></P>
				<P indent={1}><T><I>The runner crossed the finish line</I> is Independant.</T></P>
				<P indent={1}><T><I>Breathing heavily</I> is Dependant.</T></P>
			</Modal>
			<Header level={2}>10.1. Serial Verbs</Header>
			<Modal label="Go Tap on This" title="Serial Verbs">
				<P><T><B>Serial Verbs</B> are two or more verb roots that aren't compounded (8.2) or members of different clauses.</T></P>
				<P><T>These occur in all sorts of languages, but may be more common in isolating languages (1.1).</T></P>
				<P><T>English marginally employs serial verbs, e.g. "Run go get me a coffee" having three in a row.</T></P>
				<P top={2}><T>Typically, verbs in a series will each express a facet of one complex event.</T></P>
				<P indent={1}><T>For example, the English word "bring" has a facet "get something" and another that's "move towards place". In a language like Yoruba, this is expressed with serial verbs:</T></P>
				<P indent={2}><T>"mo mú ìwé wá ilé" / I take book come house - "I brought a book home"</T></P>
				<P top={2}><T>In general, serial verbs tend to follow these patterns:</T></P>
				<P indent={1}><T>TAM information is carried by the first verb.</T></P>
				<P indent={2}><T>However, some languages mandate that at least some inflectional information gets carried by the second verb.</T></P>
				<P indent={1}><T>If a constituent of the second verb is clefted, it moves to the front of the entire construction.</T></P>
				<P indent={2}><T>Youruba: "ilé ni mo mú ìwé wá" / house is I take book come - "It was to the house that I brought a book"</T></P>
				<P indent={1}><T>They can get ambiguous out of context.</T></P>
				<P indent={2}><T>Thai: "John khàp rót chon kwaay taay" / John drive car collide buffalo die</T></P>
				<P indent={2}><T>The above means "John drove the car into the buffalo and [any one of those three] died." Only context can make it clear that John, the buffalo or the car died.</T></P>
				<P top={2}><T>Verbs of motion are often used in serial constructions to express TAM information.</T></P>
				<P indent={1}><T>"Go" is used in this way so much that it often becomes a marker for future tense, as in English and Spanish.</T></P>
				<P indent={2}><T>"I'm going to finish this sandwich."</T></P>
				<P indent={1}><T>Tibetan uses motion verbs in serial to provide directional information for the other verb.</T></P>
				<P top={2}><T>Verbs in serial will sometimes turn into other role markers.</T></P>
				<P indent={1}><T>Yoruba: "give" can mark a Recipient role.</T></P>
				<P indent={1}><T>Efik: "give" has become a benefactive preposition.</T></P>
				<P indent={1}><T>Sùpyìré: "use" has become a postpositional marker for an Instrumental role.</T></P>
			</Modal>
			<TextArea rows={4} prop="serialVerbs" value={TEXT_serialVerbs || ""}>Does the language have serial verbs? What verbs are more likely to appear in serial constructions? Are any on the way to becoming auxiliaries or adpositions?</TextArea>
			<Header level={2}>10.2. Complement Clauses</Header>
			<Modal label="Enter The Matrix" title="Complement Clauses">
				<P><T>A <B>Complement Clause</B> (or Embedded Clause) functions as an argument to another clause.</T></P>
				<P><T>A <B>Matrix Clause</B> (or Main Clause) has a Complement Clause as an argument.</T></P>
				<P top={2}><T>Complements can be in the Agent or Patient role. They are marked with [brackets] below:</T></P>
				<P indent={1}><T><I>Agent</I>: [That he survived] was unexpected.</T></P>
				<P indent={2}><T>English typically postposes an Agent Complement Clause and uses a dummy "It": <I>[It] was unexpected [that he survived].</I></T></P>
				<P indent={1}><T><I>Patient</I>: He wants [to have a drink].</T></P>
				<P><T>A Matrix Clause can be a Complement Clause to another Matrix Clause:</T></P>
				<P indent={1}><T>Mulder wants [to believe [that aliens are real]].</T></P>
				<P top={2}><T>Complement Clauses run in a continuum from <B>finite clauses</B> to <B>non-finite clauses</B>.</T></P>
				<P indent={1}><T><I>Finite</I>: [That he would be handsome] could not have been anticipated.</T></P>
				<P indent={2}><T>The complement can stand alone as a complete sentence (minus the marker "That").</T></P>
				<P indent={2}><T>It can have completely different TAM markers than the maxtrix clause.</T></P>
				<P indent={2}><T>The matrix verb will likely be an utterance verb or a verb of cognition.</T></P>
				<P indent={1}><T><I>Non-finite</I>: It's very easy [to make a sandwich].</T></P>
				<P indent={2}><T>The subject of the clause will almost always be the subject of the matrix clause.</T></P>
				<P indent={2}><T>TAM markers are absent or highly constrained.</T></P>
				<P indent={2}><T>The verb in the clause will likely be non-finite.</T></P>
				<P top={2}><T><B>Indirect Questions</B> are a subset of Complement Clauses.</T></P>
				<P indent={1}><T>Example: [Whether Mr. Wayne lied] is not relavant here.</T></P>
				<P indent={1}><T>They may share formal properties with interrogative clauses and relative clauses.</T></P>
			</Modal>
			<TextArea rows={6} prop="complClauses" value={TEXT_complClauses || ""}>What kinds of complement clauses does the language have? Are certain complement types more common for certain classes of verbs? Does the language allow Agent complements, or just Patient complements?</TextArea>
			<Header level={2}>10.3. Adverbial Clauses</Header>
			<Modal label="Tap This When You're Ready" title="Adverbial Clauses">
				<P><T>Also called <I>Adjuncts</I>, <B>Adverbial Clauses</B> behave as adverbs.</T></P>
				<P><T>They can convey certain kinds of information:</T></P>
				<P indent={1}><T><I>Time</I>:</T></P>
				<P indent={2}><T>"We will go [when he gets here]."</T></P>
				<P indent={1}><T><I>Location</I>:</T></P>
				<P indent={2}><T>"I will meet you [where the old oak tree used to stand]."</T></P>
				<P indent={1}><T><I>Manner</I>:</T></P>
				<P indent={2}><T>"He talks [like a 3-year-old]."</T></P>
				<P indent={2}><T>"He walks [as a mummy would shamble]."</T></P>
				<P indent={1}><T><I>Purpose</I>:</T></P>
				<P indent={2}><T>"He stands on tiptoes [in order to see better]."</T></P>
				<P indent={1}><T><I>Reason</I>:</T></P>
				<P indent={2}><T>"He arrived early [because he wanted a good seat]."</T></P>
				<P indent={1}><T><I>Circumstantial</I> adverbial clauses are rare:</T></P>
				<P indent={2}><T>"He got into the army [by lying about his age]."</T></P>
				<P indent={1}><T><I>Simultaneous</I>:</T></P>
				<P indent={2}><T>"He woke up [crying]."</T></P>
				<P indent={2}><T>"She woke up [in a cold sweat]".</T></P>
				<P indent={1}><T><I>Conditional</I>:</T></P>
				<P indent={2}><T>"[If it's raining outside], then my car is getting wet."</T></P>
				<P indent={1}><T><I>Negative Conditional</I>:</T></P>
				<P indent={2}><T>"[Unless it rains], we will be having a picnic."</T></P>
				<P indent={1}><T><I>Concessive Clause</I>:</T></P>
				<P indent={2}><T>"[Even though the band sucks], she agreed to go to the concert."</T></P>
				<P indent={1}><T><I>Substitutive</I>:</T></P>
				<P indent={2}><T>"[Instead of barbecuing chicken], we went out to eat."</T></P>
				<P indent={1}><T><I>Additive</I>:</T></P>
				<P indent={2}><T>"You must have your hand stamped [in addition to having your ticket]."</T></P>
				<P indent={1}><T><I>Absolutive</I>:</T></P>
				<P indent={2}><T>"[Seeing a bully], Billy hid behind a curtain."</T></P>
			</Modal>
			<TextArea rows={6} prop="advClauses" value={TEXT_advClauses || ""}>How are adverbial clauses formed? What kinds are there? Can they occur in more than one place in a clause?</TextArea>
			<Header level={2}>10.4. Clause Chaining, Medial Clauses, and Switch References</Header>
			<Modal label="Chain Chain Chain..." title="Clause Chaining, Medial Clauses, and Switch References">
				<P><T><B>Clause Chains</B> are clauses presented in series. They can form a large part of discourse in many languages, such as the ones of New Guinea, Australia, and the Americas.</T></P>
				<P indent={1}><T>Typially, the last clause in the chain will have inflections for Tense and Aspect.</T></P>
				<P indent={1}><T>Panare and a minority of languages switch this up, giving the inflections to the first clause.</T></P>
				<P indent={1}><T><B>Medial clauses</B> occur before the <B>Final clause</B>.</T></P>
				<P indent={2}><T>They tend to have a reduce range of Tense/Aspect possibilities.</T></P>
				<P indent={2}><T>Their subject is referenced in terms of subject of the final clause.</T></P>
				<P indent={2}><T>Their placement represents temporal relations such as overlapping or in succession.</T></P>
				<P top={2}><T><B>Switch References</B> are verbal inflections that indicate the subject of a verb is the same as the subject of another verb.</T></P>
				<P indent={1}><T>Yuman uses <I>-k</I> to indicate the next verb uses the same subject (SS) as this one, and <I>-m</I> to indicate the next verb will have a different subject (DS).</T></P>
				<P indent={2}><T>"I sang and danced"</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={2}
				/>
				<P indent={2}><T>"Bonnie sang and I danced"</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={2}
				/>
				<P top={2} indent={1}><T>Ergative languages often have complex Switch Reference systems that indicate the temporal relations of the clauses, whether or not the verbs' subjects agree, and strongly indicate a reason why the clauses are linked.</T></P>
				<P indent={2}><T>Panare: Suffix / Temporal / Agreement / Linkage</T></P>
				<P indent={3}><T>-séjpe / succession / Actor = Actor / purpose</T></P>
				<P indent={3}><T>-séñape / succession / Absolutive = Patient / result</T></P>
				<P indent={3}><T>-ñére / succession / Actors are different / movement or purpose</T></P>
				<P indent={3}><T>-npan / overlap / Actor = Actor / none</T></P>
				<P indent={3}><T>-tááñe / overlap / Actor = Actor / none</T></P>
				<P indent={3}><T>-jpómën / anteriority / Actor = Actor / reason</T></P>
			</Modal>
			<CheckBoxes
				boxes={[
					BOOL_chainFirst,
					BOOL_chainLast
				]}
				properties={[
					"BOOL_chainFirst",
					"BOOL_chainLast"
				]}
				display={{
					header: "Which Clause is Inflected?",
					labels: [
						"First",
						"Last"
					],
					export: {title: "Inflected Clause:"}}}
			/>
			<CheckBoxes
				boxes={[
					BOOL_chainN,
					BOOL_chainV,
					BOOL_chainCj
				]}
				properties={[
					"BOOL_chainN",
					"BOOL_chainV",
					"BOOL_chainCj"
				]}
				display={{
					header: "Which Element is Marked?",
					labels: [
						"Noun",
						"Verb",
						"Conjunction"
					],
					export: {title: "Element Marked:"}
				}}
			/>
			<CheckBoxes
				boxes={[
					BOOL_chainT,
					BOOL_chainA,
					BOOL_chainPer,
					BOOL_chainNum,
					BOOL_chainOther
				]}
				properties={[
					"BOOL_chainT",
					"BOOL_chainA",
					"BOOL_chainPer",
					"BOOL_chainNum",
					"BOOL_chainOther"
				]}
				display={{
					header: "What Other Information Does the Marker Encode?",
					labels: [
						"Tense",
						"Aspect",
						"Person",
						"Number",
						"Other"
					],
					export: {title: "Marker Encodes:"}
				}}
			/>
			<TextArea rows={6} prop="clauseChainEtc" value={TEXT_clauseChainEtc || ""}>Is the coreference always the Subject, or can the Agent, Patient, or other nominals be referred to? Do the markers convey other information, like person, number, tense, aspect, and/or semantics? Can a clause be inflected for the person/number of another clause?</TextArea>
			<Header level={2}>10.5. Relative Clauses</Header>
			<Modal label="Clauses as Adjectives" title="Relative Clauses">
				<P><T>A <B>Relative Clause</B> is a clause that functions as a nominal modifier. They can be identified by four points.</T></P>
				<P indent={1}><T>Example: "The fumes that made Chris faint."</T></P>
				<P indent={2} noDot><T>1. <I>Head</I>: The noun phrase modified by the clause (fumes)</T></P>
				<P indent={2} noDot><T>2. <I>Restricting Clause</I>: The relative clause itself (made Chris faint)</T></P>
				<P indent={2} noDot><T>3. <I>Relativized Noun Phrase</I>: The part of the Restricting Clause that refers to the Head (English uses a Gap Strategy, explained below)</T></P>
				<P indent={2} noDot><T>4. <I>Relativizer</I>: Morpheme or particle that sets off the relative clause (that)</T></P>
				<P top={2}><T>Relative Clauses (RCs) are usually positioned in the same place as other nominal modifiers, but there is a strong tendency towards placing them postnomial, even if other modifiers fall before the noun phrase.</T></P>
				<P indent={1}><T><I>Prenomial</I>: before the Head</T></P>
				<P indent={1}><T><I>Postnomial</I>: after the Head (most common, especially in VP languages)</T></P>
				<P indent={1}><T><I>Internally headed</I>: the Head is placed within the relative clause</T></P>
				<P indent={2}><T>This is common in PV languages, such as Bambara:</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={2}
					final={"\"I saw a horse\""}
				/>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={2}
					final={"\"The man bought the horse that I saw\""}
				/>
				<P indent={1}><T><I>Headless</I>: the clause itself refers to the Head</T></P>
				<P indent={2}><T>This is common in languages that use nouns to modify other nouns, such as Ndjuká:</T></P>
				<P indent={3}><T>Non-specific subject:</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={3}
					final={"\"Whoever arrives first will win\""}
				/>
				<P indent={3}><T>Specific subject:</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={3}
					final={"\"The eel is what (the one that) lives in the sea\""}
				/>
				<P indent={2}><T>But it can happen in other languages, such as English:</T></P>
				<P indent={3}><T>Headless RC: [That which John said] annoyed her. (Something specific he said annoyed her)</T></P>
				<P indent={3}><T>Complementary Clause: [That John said anything] annoyed her. (The action itself annoyed her)</T></P>
				<P indent={2}><T>In many languages, headless construction is allowed when the head noun is nonspecific.</T></P>
				<P indent={3}><T>[Whenever I'm afraid] I call her. (Refers to a time that is not specified otherwise)</T></P>
				<P top={2}><T>The Relativized Noun Phrase (RNP) can be expressed in different ways.</T></P>
				<P indent={1}><T><B>Gap Strategy</B>: the RNP is represented by a "gap" in the phrase, a missing space (0) where logically some argument would normally go.</T></P>
				<P indent={2}><T>English uses this:</T></P>
				<P indent={3}><T>Example: The man [that I loved 0] died.</T></P>
				<P indent={3}><T>Full noun phrase: [I loved the man]</T></P>
				<P indent={2}><T>This is a useful strategy when the semantic role of the Head is different in the RC:</T></P>
				<P indent={3}><T>The alligator [that 0 saw me] ate Alice.</T></P>
				<P indent={3}><T>The alligator [that I saw 0] ate Alice.</T></P>
				<P indent={2}><T>However, this can become ambiguous if the constituent order changes often, or when the A and P are next to each other in normal discourse:</T></P>
				<P indent={3}><T>Ithsmus Zapotee is a VAP language.</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={3}
					final={"This could be either \"A woman that loves John\" (top) or \"A woman that Jon loves\"."}
				/>
				<P indent={1}><T><B>Pronoun Retention</B>: a pronoun is retained to indicate grammatical role.</T></P>
				<P indent={2}><T>Typically, the pronoun is similar to other pronouns, either question words or pronouns used for non-specific, indefinite things.</T></P>
				<P indent={3}><T>Example: That's the guy who [I can never remember <I>his</I> name]</T></P>
				<P top={2} indent={1}><T>The Relativizer may be marked to show the NPR's role.</T></P>
				<P indent={2}><T>Chickasaw:</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={2}
					final={"\"The woman that saw the dog died\""}
				/>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={2}
					final={"\"The woman that the dog saw died\""}
				/>
				<P top={2}><T>Relativization Hierarchy:</T></P>
				<P indent={1}><T>Subject</T></P>
				<P indent={1}><T>Direct Object</T></P>
				<P indent={1}><T>Indirect Object</T></P>
				<P indent={1}><T>Oblique</T></P>
				<P indent={1}><T>Possessor</T></P>
				<P><T>No language (that uses the above grammatical roles) allows relativization of an element, using a single strategy, without also allowing relativizing of the elements above it in the hierarchy. Other elements may have other relativization strategies. For example, English uses the Gap Strategy down through the Obliques, but it doesn't apply to the Possessors:</T></P>
				<P indent={1}><T><I>Subject</I>: I hate the guy that [0 dumped her].</T></P>
				<P indent={1}><T><I>Direct Object</I>: I hate the guy that [she dated 0].</T></P>
				<P indent={1}><T><I>Indirect Object</I>: I hate the guy that [she gave her heart to 0].</T></P>
				<P indent={1}><T><I>Oblique</I>: I hate the guy that [she lived with 0].</T></P>
				<P indent={1}><T><I>Oblique</I>: I hate the guy that [she is older than 0].</T></P>
				<P indent={1}><T><I>Possessor</I>: <S>I hate the guy that [0 head is bald].</S></T></P>
				<P indent={2}><T>This is not valid English. Another strategy has to be used: "I hate the guy [whose head is bald]."</T></P>
			</Modal>
			<CheckBoxes
				boxes={[
					BOOL_relPre,
					BOOL_relPost,
					BOOL_relInternal,
					BOOL_relHeadless
				]}
				properties={[
					"BOOL_relPre",
					"BOOL_relPost",
					"BOOL_relInternal",
					"BOOL_relHeadless"
				]}
				display={{
					header: "Types of Relative Clauses",
					labels: [
						"Prenomial",
						"Postnomial",
						"Internally Headed",
						"Headless"
					],
					export: {title: "Type of Relative Clauses:"}
				}}
			/>
			<TextArea rows={6} prop="relClauses" value={TEXT_relClauses || ""}>Note what strategies are used in Relativizing Clauses, and where they fit on the hierarchy (if it applies).</TextArea>
			<Header level={2}>10.6. Coordinating Clauses</Header>
			<Modal label="This And That" title="Coordinating Clauses">
				<P><T><B>Coordinating Clauses</B> are linked together, equal in grammatical status. They may be difficult to distinguish from juxtaposition.</T></P>
				<P><T>They often use methods identical to those used to join noun phrases:</T></P>
				<P indent={1}><T>John <I>and</I> Mary</T></P>
				<P indent={1}><T>John cried <I>and</I> Mary laughed.</T></P>
				<P><T>It's also common for special strategies to exist that do not work for noun phrases:</T></P>
				<P indent={1}><T>John cried <I>but</I> Mary laughed.</T></P>
				<P top={2}><T>CCs often express <B>Coordination</B> (x and y, neither x nor y), <B>Disjunction</B> (either x or y), and <B>Exclusion</B> (x and not y).</T></P>
				<P top={2}><T>The <B>Zero Strategy</B> looks just like juxtaposition. Vietnamese:</T></P>
				<P indent={1}><T><I>Noun Phrases</I>:</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={1}
					final="We prepared the basket, the spear and the knife."
				/>
				<P indent={1}><T><I>Prepositional Phrases</I>:</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={1}
					final="She returned to her husband and to her grandmother."
				/>
				<P indent={1}><T><I>Verb Phrases</I>:</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={1}
					final="She returned to her husband and returned to her grandmother."
				/>
				<P top={2}><T><B>Coordinating Conjunctions</B> (CCs) are a common strategy.</T></P>
				<P indent={1}><T>The conjunction is often the same as "with". English uses "and" and "but", among others.</T></P>
				<P indent={1}><T>In VP languages:</T></P>
				<P indent={2}><T>The CC is usually between the two clauses:</T></P>
				<P indent={3}><T>The dog growled <I>and</I> the cat hissed.</T></P>
				<P indent={2}><T>But sometimes, the CC comes after the first element of the second clause.</T></P>
				<P indent={3}><T>Yoruba:</T></P>
				<Tabular
					rows={[
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
					]}
					top={0}
					indent={3}
					final="I took a book and I came home."
				/>
				<P indent={1}><T>In PV languages, the CC either comes between the two clauses (Farsi) or after the last element (Walapai).</T></P>
			</Modal>
			<CheckBoxes
				boxes={[
					BOOL_coordMid,
					BOOL_coordTwo,
					BOOL_coordLast
				]}
				properties={[
					"BOOL_coordMid",
					"BOOL_coordTwo",
					"BOOL_coordLast"
				]}
				display={{
					header: "Coordinating Conjunction Positions",
					labels: [
						"Between the clauses",
						"After the first element of the second clause",
						"After the last element"
					],
					export: {title: "Coordinating Conjunction Positions:"}
				}}
			/>
			<TextArea rows={6} prop="coords" value={TEXT_coords || ""}>Describe how Conjunction, Disjunction and Exclusion are expressed in the language.</TextArea>
		</VStack>
	);
};

export default Section;
