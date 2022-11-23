import {
	VStack
} from 'native-base';
import { useSelector } from 'react-redux';

import { Header, Modal, T, B, I, P, TextArea } from './msTags';

const Section = () => {
	const {
		TEXT_predNom,
		TEXT_predLoc,
		TEXT_predEx
	} = useSelector(state => state.morphoSyntax);
	return (
		<VStack>
			<Header level={1}>5. Predicate Nominals and Related Constructions</Header>
			<Modal label="General Information to Consider" title="Predicate Nominals">
				<P><T>These forms generally encode the following information:</T></P>
				<P indent={1}><T><B>Equation</B>: X is Y</T></P>
				<P indent={1}><T><B>Proper Inclusion</B>: X is a Y</T></P>
				<P indent={1}><T><B>Location</B>: X is located Y</T></P>
				<P indent={1}><T><B>Attribution</B>: X is made Y</T></P>
				<P indent={1}><T><B>Existence</B>: X exists in Y</T></P>
				<P indent={1}><T><B>Possession</B>: X has Y</T></P>
				<P><T>The forms at the top of the list are much more likely to lack a semantically rich verb, while those at the bottom are less likely to.</T></P>
			</Modal>
			<Header level={2}>5.1. Predicate Nominals and Adjectives</Header>
			<Modal label="What It Is and What It Seems Like" title="Predicate Nominals and Adjectives">
				<P><T>May encode <I>proper inclusion</I> (X is a Y) and <I>equation</I> (X is Y)</T></P>
				<P><T>Predicate adjectives are usually handled the same as predicate nominals, though they will sometimes use a different copula than the nouns.</T></P>
				<P><T>If they use a verb, it will not be a very <I>semantically rich</I> verb (e.g. to be, to do)</T></P>
				<P><T>Will generally use one of the following strategies:</T></P>
				<P indent={1}><T><I>Juxtaposition</I></T></P>
				<P indent={2}><T>Two nouns (or a noun and adjective) are placed next to each other.</T></P>
				<P indent={2}><T>Ex: Steve doctor. Mouse small. (Steve is a doctor. A mouse is small.)</T></P>
				<P><T><I>Joined by copula</I></T></P>
				<P indent={1}><T>A <I>copula</I> is a morpheme that "couples" two elements. Often encodes Tense/Aspect (8.3), and can be restricted to certain situations (e.g. only in non-present tenses).</T></P>
				<P indent={1}><T>The copula can take different forms:</T></P>
				<P indent={2}><T><I>Verb</I></T></P>
				<P indent={3}><T>These tend to be very irregular verbs.</T></P>
				<P indent={3}><T>They tend to belong to the same verb class as stative verbs.</T></P>
				<P indent={3}><T>They tend to function as auxiliaries in other constructions.</T></P>
				<P indent={3}><T>Ex: Steve is a doctor.</T></P>
				<P indent={2}><T><I>Pronoun</I></T></P>
				<P indent={2}><T>The pronoun corresponds to the subject.</T></P>
				<P indent={2}><T>Ex: Steve, he a doctor.</T></P>
				<P indent={1}><T><I>Invariant particle</I></T></P>
				<P indent={2}><T>This particle may derive from a verb or pronoun.</T></P>
				<P indent={2}><T>The particle will not encode tense/aspect/gender/anything.</T></P>
				<P indent={2}><T>Ex: Steve blorp doctor.</T></P>
				<P indent={1}><T><I>Derivational operation</I></T></P>
				<P indent={2}><T>Predicate noun becomes a verb.</T></P>
				<P indent={2}><T>Ex: Steve doctor-being.</T></P>
			</Modal>
			<TextArea rows={6} prop="predNom" value={TEXT_predNom || ""}>Describe the language's strategy for predicate nominals and adjectives.</TextArea>
			<Header level={2}>5.2. Predicate Locatives</Header>
			<Modal label="Where It Is" title="Predicate Locatives">
				<P><T>Many languages use a word that gets translated as "be at".</T></P>
				<P><T>The locative word is often the same as a locative adposition.</T></P>
				<P><T>Word order usually distinguishes possessive clauses from locational clauses.</T></P>
				<P indent={1}><T>Ex: Steve has a cat (possessive); the cat is behind Steve (locational).</T></P>
				<P top={2}><T>English bases locatives on possessive clauses, but with an inanimate possessor.</T></P>
				<P><T>Russian bases possessive clauses on locatives, but with an animate possessor.</T></P>
			</Modal>
			<TextArea rows={6} prop="predLoc" value={TEXT_predLoc || ""}>How does the language handle predicate locatives?</TextArea>
			<Header level={2}>5.3. Existentials</Header>
			<Modal label="These Exist" title="Existentials">
				<P><T>These constructions usually serve a presentative function, introducing new participants.</T></P>
				<P><T>Usually, the nominal is indefinite: Consider "There are lions in Africa" (valid) vs. "There are the lions in Africa" (invalid).</T></P>
				<P><T>There is usually little to no case marking, verb agreement, etc.</T></P>
				<P><T>They often share features of predicate nominals (copula), but some languages prohibit such forms.</T></P>
				<P><T>They often have special negation stategies (e.g. a verb meaning 'to lack': "Under the bed lacks a cat").</T></P>
				<P><T>They often play a role in:</T></P>
				<P indent={1}><T>"Impersonal" or "circumstantial" constructions.</T></P>
				<P indent={2}><T>e.g. There will be dancing in the streets!</T></P>
				<P indent={1}><T>Situations that lack the need for any specific actor, or to downplay the significance of an actor.</T></P>
				<P indent={2}><T>e.g. Someone is crying.</T></P>
			</Modal>
			<TextArea rows={6} prop="predEx" value={TEXT_predEx || ""}>How are existential clauses formed? Does this vary according to tense, aspect or mood? Is there a special negation strategy? Is this form used to impart other information (such as possessives) as well?</TextArea>
			<Header level={2}>5.4. Possessive Clauses</Header>
			<Modal title="Possessive Clauses">
				<P><T>These follow two main strategies:</T></P>
				<P indent={1}><T>Verb strategy: "I have a book."</T></P>
				<P indent={1}><T>Copula strategy: "The book is at me."</T></P>
			</Modal>
			<TextArea rows={3} prop="predEx" value={TEXT_predEx || ""}>Does the language use a verb or copula strategy?</TextArea>
		</VStack>
	);
};

export default Section;
