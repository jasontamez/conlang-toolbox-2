import {
	Box,
	Heading,
	HStack,
	VStack,
	Link,
	Pressable as Press,
	Text,
	ScrollView
 } from 'native-base';
import { useNavigate } from "react-router-dom";
import packageJson from '../package.json';

import {
	DotIcon,
	ExtraCharactersIcon,
	LexiconIcon,
	MorphoSyntaxIcon,
	WordEvolveIcon,
	WordGenIcon,
	WordListsIcon
} from '../components/icons';

const Indented = (props) => (
	<HStack
		m={1}
		mx={4}
		justifyContent="flex-start"
		alignItems="flex-start"
	>
		<DotIcon m={1} mt={1.5} />
		<Text>{props.children}</Text>
	</HStack>
);

const Highlight = (props) => (
	<Box
		alignSelf="center"
		textAlign="center"
		w="full"
		bg="lighter"
		p={2}
		mb={3}
	>
		<Text>{props.children}</Text>
	</Box>
);

const Pressable = (props) => (
	<Press
		bg="main.800"
		shadow={3}
		onPress={props.onPress}
		mt={props.firstElement ? 0 : 8}
	>
		<VStack p={4} pt={0}>{props.children}</VStack>
	</Press>
);

const SectionHeader = ({SectionIcon, text}) => (
	<Heading
		color="primary.500"
		p={4}
		fontSize="xl"
		alignSelf="center"
	>
		<SectionIcon color="primary.500" mr={3} />{text}
	</Heading>
);

const About = () => {
	let navigate = useNavigate();
	const doNav = (where) => {
		navigate(where);
	};
	return (
		<ScrollView
			p={2}
			bg="darker"
		>
			<Pressable onPress={() => {doNav("/ms")}} firstElement>
				<SectionHeader SectionIcon={MorphoSyntaxIcon} text="MorphoSyntax" />
				<Highlight>This tool is for designing the basic structure of your language.</Highlight>
				<Indented>Covers large-scale structures and small</Indented>
				<Indented>Grouped into ten sections</Indented>
				<Indented>Use as many or as few of the prompts as you like</Indented>
			</Pressable>
			<Pressable>
				<SectionHeader SectionIcon={WordGenIcon} text="WordGen" />
				<Highlight>This tool is for creating words according to rules you set up.</Highlight>
				<Indented>Organize your language's sounds into groups</Indented>
				<Indented>Construct syllable formations using those groups</Indented>
				<Indented>Tweak the output through transformations</Indented>
				<Indented>Jumpstart your process with built-in presets</Indented>
			</Pressable>
			<Pressable>
				<SectionHeader SectionIcon={WordEvolveIcon} text="WordEvolve" />
				<Highlight>
					This tool is for modifying words according to rules you set up, mimicking
					the evolution of natural languages.</Highlight>
				<Indented>Start with words from a language (natural or otherwise)</Indented>
				<Indented>Use standard rules to determine how they evolve</Indented>
				<Indented>Tweak the output through transformations</Indented>
			</Pressable>
			<Pressable onPress={() => {doNav("/lex")}}>
				<SectionHeader SectionIcon={LexiconIcon} text="Lexicon" />
				<Highlight>A place to store your conlangs.</Highlight>
				<Indented>Store bits of information for each word, such as part of speech or definition</Indented>
				<Indented>Sort your words by any criteria</Indented>
				<Indented>Easily add words from WordGen and WordEvolve</Indented>
				<Indented>Store multiple lexicons</Indented>
				<Indented>Export your data</Indented>
			</Pressable>
			<Pressable onPress={() => {doNav("/wordlists")}}>
				<SectionHeader SectionIcon={WordListsIcon} text="Word Lists" />
				<Highlight>A small storehouse of basic words, useful for starting a lexicon.</Highlight>
				<Indented>Easily add words to Lexicon</Indented>
				<Indented>Contains the Swadesh-100, -207 and other variants</Indented>
				<Indented>Also contains Dogolposky, Leipzig-Jakarta, and ASJP lists</Indented>
			</Pressable>
			<Pressable>
				<SectionHeader SectionIcon={ExtraCharactersIcon} text="Extra Characters" />
				<Highlight>On many pages, you'll see the Extra Characters icon at the top of the page.</Highlight>
				<Indented>Contains hundreds of characters that may not appear on your mobile keyboard,
					organized according to groups such as Latin, Cyrillic, Arabic and Katakana</Indented>
				<Indented>All IPA (International Phonetic Alphabet) characters grouped together</Indented>
				<Indented>Tap characters and add them to the clipboard</Indented>
				<Indented>Save your often-used characters to the Favorites bar for easy access</Indented>
			</Pressable>
			<VStack
				mt={20}
				shadow={3}
				bg="main.800"
				p={4}
				pt={0}
				alignItems="center"
			>
				<Heading color="primary.500" p={4} fontSize="xl">App Info</Heading>
				<HStack m={1} mx={4}>
					<Text>v.{packageJson.version}</Text>
				</HStack>
				<HStack m={1} mx={4}>
					<Text>Contact: <Link href="mailto:jasontankapps@gmail.com">jasontankapps@gmail.com</Link></Text>
				</HStack>
			</VStack>
		</ScrollView>
	);
};

export default About;
