import {
	VStack
} from 'native-base';
import { useSelector } from 'react-redux';

import { Header, Modal, T, B, I, P, CheckBoxes, TextArea } from './msTags';

const Section = () => {
	const {
		BOOL_nomAcc,
		BOOL_ergAbs,

		TEXT_ergative
	} = useSelector(state => state.morphoSyntax);
	return (
		<VStack>
			<Header level={1}>6. Grammatical Relations</Header>
			<Modal label="Show the Alignments" title="Alignments">
				<P><T><B>Nominative/Accusative Alignment</B>:</T></P>
				<P indent={1}><T>(S)ubjects and (A)gents are treated the same, in the nominative case.</T></P>
				<P indent={2}><T><I>I</I> fell.</T></P>
				<P indent={2}><T><I>I</I> pushed him.</T></P>
				<P indent={1}><T>(P)atients are given the accusative case.</T></P>
				<P indent={2}><T>I pushed <I>him</I>.</T></P>
				<P indent={1}><T>S and A are both viewed as agents, having volition</T></P>
				<P indent={1}><T>A tends to stick with the (V)erb, leaving the P floating:</T></P>
				<P indent={2}><T>AVP; PAV; VAP; PVA</T></P>
				<P top={2}><T><B>Ergative/Absolutive Alignment</B>:</T></P>
				<P indent={1}><T>(S)ubjects and (P)atients are treated the same, in the ergative case.</T></P>
				<P indent={2}><T><I>I</I> fell.</T></P>
				<P indent={2}><T>Me pushed <I>he</I>.</T></P>
				<P indent={1}><T>(A)gents are given the absolutive case.</T></P>
				<P indent={2}><T><I>Me</I> pushed he.</T></P>
				<P indent={1}><T>S and P are both viewed as typically being new information, or undergoing change.</T></P>
				<P indent={1}><T>P tends to stick with the (V)erb, leaving the A floating:</T></P>
				<P indent={2}><T>AVP; VPA; APV; PVA</T></P>
				<P top={2} indent={1}><T><B>Split Ergativity</B>:</T></P>
				<P indent={2}><T>In natural languages, ergativity tends to coexist in a hierarchy, with the nominative/accusative system used for the higher level. Typical hierarchies:</T></P>
				<P indent={3}><T>1st person &gt; 2nd person &gt; 3rd person &gt; humans &gt; animates &gt; inanimates</T></P>
				<P indent={3}><T>agreement &gt; pronouns/case marking</T></P>
				<P indent={3}><T>definite &gt; indefinite</T></P>
				<P indent={3}><T>non-past tense &gt; past tense</T></P>
				<P indent={3}><T>imperfect aspect &gt; perfect aspect</T></P>
				<P indent={2}><T>The split in the hierarchy can happen at any point. e.g.</T></P>
				<P indent={3}><T>Dyirbal uses n/a for 1st/2nd person, e/a for everything else (this is a very common split point)</T></P>
				<P indent={3}><T>Cashinawa uses n/a for 1/2, separate marking for A and P in 3rd person, and e/a for everything else</T></P>
				<P indent={3}><T>Managalasi uses e/a for pronouns, n/a for person marking on verbs</T></P>
			</Modal>
			<CheckBoxes
				boxes={[
					BOOL_nomAcc,
					BOOL_ergAbs
				]}
				display={{
					header: "Primary Alignment System",
					labels: [
						"Nominative / Accusative",
						"Ergative / Absolutive"
					],
					export: {title: "Primary Alignment System:"}
				}}
			/>
			<TextArea rows={8} prop="ergative" value={TEXT_ergative || ""}>Are there any exceptions to the primary alignment? Do they exist in a hierarchy?</TextArea>
		</VStack>
	);
};

export default Section;
