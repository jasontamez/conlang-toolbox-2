import { Box, Heading, ScrollView, HStack, VStack, Link, Pressable as Press, Text } from 'native-base';
import { useNavigate } from "react-router-dom";
import packageJson from '../package.json';

import { DotIcon, ExtraCharactersIcon, LexiconIcon, MorphoSyntaxIcon, WordEvolveIcon, WordGenIcon, WordListsIcon } from '../components/icons';
import Header from '../components/Header';

const Indented = (props) => (
	<HStack m={1} mx={4} justifyContent="flex-start" alignItems="flex-start">
		<DotIcon m={1} mt={2} />
		<Text>{props.children}</Text>
	</HStack>
);

const Highlight = (props) => (
	<Box alignSelf="center" textAlign="center" bg="lighter" p={2} mb={3}><Text>{props.children}</Text></Box>
);

const Pressable = (props) => <Press bg="main.800" p={4} pt={0} {...props} />;

const Home = () => {
	let navigate = useNavigate();
	return (
		<VStack h="full" alignItems="stretch" justifyContent="space-between" w="full" position="fixed" top={0} bottom={0}>
			<Header title="Conlang Toolbox" hideExtraChars />
			<ScrollView flexGrow={1}>
				<VStack space={8} p={4} bg="darker">
					<Pressable onPress={() => {navigate("/ms")}}>
						<VStack>
							<Heading color="primary.500" p={4} fontSize="xl" alignSelf="center"><MorphoSyntaxIcon color="primary.500" mr={3} />MorphoSyntax</Heading>
							<Highlight>This tool is for designing the basic structure of your language.</Highlight>
							<Indented>Covers large-scale structures and small</Indented>							
							<Indented>Grouped into ten sections</Indented>							
							<Indented>Use as many or as few of the prompts as you like</Indented>							
						</VStack>
					</Pressable>
					<Pressable>
						<VStack>
							<Heading color="primary.500" p={4} fontSize="xl" alignSelf="center"><WordGenIcon color="primary.500" mr={3} />WordGen</Heading>
							<Highlight>This tool is for creating words according to rules you set up.</Highlight>
							<Indented>Organize your language's sounds into groups</Indented>							
							<Indented>Construct syllable formations using those groups</Indented>							
							<Indented>Tweak the output through transformations</Indented>							
							<Indented>Jumpstart your process with built-in presets</Indented>							
						</VStack>
					</Pressable>
					<Pressable>
						<VStack>
							<Heading color="primary.500" p={4} fontSize="xl" alignSelf="center"><WordEvolveIcon color="primary.500" mr={3} />WordEvolve</Heading>
							<Highlight>This tool is for modifying words according to rules you set up, mimicking the evolution of natural languages.</Highlight>
							<Indented>Start with words from a language (natural or otherwise)</Indented>							
							<Indented>Use standard rules to determine how they evolve</Indented>							
							<Indented>Tweak the output through transformations</Indented>							
						</VStack>
					</Pressable>
					<Pressable>
						<VStack>
							<Heading color="primary.500" p={4} fontSize="xl" alignSelf="center"><LexiconIcon color="primary.500" mr={3} />Lexicon</Heading>
							<Highlight>A place to store your conlangs.</Highlight>
							<Indented>Store bits of information for each word, such as part of speech or definition</Indented>							
							<Indented>Sort your words by any criteria</Indented>							
							<Indented>Easily add words from WordGen and WordEvolve</Indented>							
							<Indented>Store multiple lexicons</Indented>							
							<Indented>Export your data</Indented>							
						</VStack>
					</Pressable>
					<Pressable>
						<VStack>
							<Heading color="primary.500" p={4} fontSize="xl" alignSelf="center"><WordListsIcon color="primary.500" mr={3} />Word Lists</Heading>
							<Highlight>A small storehouse of basic words, useful for starting a lexicon.</Highlight>
							<Indented>Easily add words to Lexicon</Indented>							
							<Indented>Contains the Swadesh-100, -207 and other variants</Indented>							
							<Indented>Also contains Dogolposky, Leipzig-Jakarta, and ASJP lists</Indented>							
						</VStack>
					</Pressable>
					<Pressable>
						<VStack>
							<Heading color="primary.500" p={4} fontSize="xl" alignSelf="center"><ExtraCharactersIcon color="primary.500" mr={3} />Extra Characters</Heading>
							<Highlight>On many pages, you'll see the Extra Characters icon at the top of the page.</Highlight>
							<Indented>Contains hundreds of characters that may not appear on your mobile keyboard, organized according to groups such as Latin, Cyrillic, Arabic and Katakana</Indented>							
							<Indented>All IPA (International Phonetic Alphabet) characters grouped together</Indented>							
							<Indented>Tap characters and add them to the clipboard</Indented>							
							<Indented>Save your often-used characters to the Favorites bar for easy access</Indented>							
						</VStack>
					</Pressable>
					<Pressable>
						<VStack alignItems="center">
							<Heading color="primary.500" p={4} fontSize="xl">App Info</Heading>
							<Indented>v.{packageJson.version}</Indented>							
							<Indented>Contact: <Link href="mailto:jasontankapps@gmail.com">jasontankapps@gmail.com</Link></Indented>							
						</VStack>
					</Pressable>
				</VStack>
			</ScrollView>
		</VStack>
	);
};

export default Home;
