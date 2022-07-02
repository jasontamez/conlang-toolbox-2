import { Box, Heading, ScrollView, HStack, VStack, Link, Pressable, Text } from 'native-base';
import { useNavigate } from "react-router-dom";
import packageJson from '../package.json';

import { DotIcon, ExtraCharactersIcon, LexiconIcon, MorphoSyntaxIcon, WordEvolveIcon, WordGenIcon, WordListsIcon } from '../components/icons';

const Indented = (props) => (
	<HStack pl={2} justifyContent="flex-start" alignItems="flex-start">
		<DotIcon m={1} mr="0.5" />
		<Text>{props.children}</Text>
	</HStack>
);

const Home = () => {
	let navigate = useNavigate();
	return (
		<>
			<ScrollView>
				<VStack space={2}>
					<Pressable onPress={() => {navigate("/ms")}}>
						<VStack>
							<Heading fontSize="xl"><MorphoSyntaxIcon />MorphoSyntax</Heading>
							<Box><Text>This tool is for designing the basic structure of your language.</Text></Box>
							<Indented>Covers large-scale structures and small</Indented>							
							<Indented>Grouped into ten sections</Indented>							
							<Indented>Use as many or as little of the prompts as you like</Indented>							
							<Indented>xxx</Indented>							
						</VStack>
					</Pressable>
					<Pressable>
						<VStack>
							<Heading fontSize="xl"><WordGenIcon />WordGen</Heading>
							<Box><Text>This tool is for creating words according to rules you set up.</Text></Box>
							<Indented>Organize your language's sounds into groups</Indented>							
							<Indented>Construct syllable formations using those groups</Indented>							
							<Indented>Tweak the output through transformations</Indented>							
							<Indented>Jumpstart your process with built-in presets</Indented>							
						</VStack>
					</Pressable>
					<Pressable>
						<VStack>
							<Heading fontSize="xl"><WordEvolveIcon />WordEvolve</Heading>
							<Box><Text>This tool is for modifying words according to rules you set up, mimicking the evolution of natural languages.</Text></Box>
							<Indented>Start with words from a language (natural or otherwise)</Indented>							
							<Indented>Use standard rules to determine how they evolve</Indented>							
							<Indented>Tweak the output through transformations</Indented>							
						</VStack>
					</Pressable>
					<Pressable>
						<VStack>
							<Heading fontSize="xl"><LexiconIcon />Lexicon</Heading>
							<Box><Text>A place to store your conlangs.</Text></Box>
							<Indented>Store bits of information for each word, such as part of speech or definition</Indented>							
							<Indented>Sort your words by any criteria</Indented>							
							<Indented>Easily add words from WordGen and WordEvolve</Indented>							
							<Indented>Store multiple lexicons</Indented>							
							<Indented>Export your data</Indented>							
						</VStack>
					</Pressable>
					<Pressable>
						<VStack>
							<Heading fontSize="xl"><WordListsIcon />Word Lists</Heading>
							<Box><Text>A small storehouse of basic words, useful for starting a lexicon.</Text></Box>
							<Indented>Easily add words to Lexicon</Indented>							
							<Indented>Contains the Swadesh-100, -207 and other variants</Indented>							
							<Indented>Also contains Dogolposky, Leipzig-Jakarta, and ASJP lists</Indented>							
						</VStack>
					</Pressable>
					<Pressable>
						<VStack>
							<Heading fontSize="xl"><ExtraCharactersIcon />Extra Characters</Heading>
							<Box><Text>On many pages, you'll see the Extra Characters icon at the top of the page.</Text></Box>
							<Indented>Contains hundreds of characters that may not appear on your mobile keyboard, organized according to groups such as Latin, Cyrillic, Arabic and Katakana</Indented>							
							<Indented>All IPA (International Phonetic Alphabet) characters grouped together</Indented>							
							<Indented>Tap characters and add them to the clipboard</Indented>							
							<Indented>Save your often-used characters to the Favorites bar for easy access</Indented>							
						</VStack>
					</Pressable>
					<Pressable>
						<VStack>
							<Heading fontSize="xl"><WordListsIcon />Word Lists</Heading>
							<Box><Text>A small storehouse of basic words, useful for starting a lexicon.</Text></Box>
							<Indented>v.{packageJson.current}</Indented>							
							<Indented>Contact: <Link href="mailto:jasontankapps@gmail.com">jasontankapps@gmail.com</Link></Indented>							
						</VStack>
					</Pressable>
				</VStack>
			</ScrollView>
		</>
	);
};

export default Home;
