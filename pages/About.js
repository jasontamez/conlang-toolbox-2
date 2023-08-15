import { memo, useCallback } from 'react';
import {
	Box,
	Heading,
	HStack,
	VStack,
	Link,
	Pressable as Press,
	Text,
	ScrollView,
	useBreakpointValue
} from 'native-base';
import { useOutletContext } from "react-router-dom";
import packageJson from '../package.json';

import {
	ExtraCharactersIcon,
	LexiconIcon,
	MorphoSyntaxIcon,
	WordEvolveIcon,
	WordGenIcon,
	WordListsIcon
} from '../components/icons';
import getSizes from '../helpers/getSizes';

const About = () => {
	const [navigate] = useOutletContext();
	const [headerSize, textSize, contactSize] = getSizes("xl", "sm", "xs");
	const indentMargin = useBreakpointValue({
		base: 4,
		sm: 8,
		md: 12,
		lg: 16,
		xl: 18
	})

	const Pressable = memo(({goto, otherFunc, firstElement, SectionIcon, title, children}) => {
		const onPress = useCallback(() => {
			navigate(goto);
		}, [goto]);
		const Inner = memo(({isPressed, firstElement}) => {
			const opacity = isPressed ? 50 : 100;
			return (
				<Box
					bg="main.800"
					shadow={3}
					mt={firstElement ? 4 : 6}
					opacity={opacity}
					mx={8}
					borderRadius="xl"
				>
					<HStack
						p={4}
						alignItems="center"
						justifyContent="center"
						space={3}
						flexWrap="wrap"
					>
						<SectionIcon color="primary.500" size={textSize} />
						<Text bold
							color="primary.500"
							fontSize={headerSize}
							textAlign="center"
						>
							{title}
						</Text>
					</HStack>
					<VStack p={4} pt={0}>{children}</VStack>
				</Box>
			);
		});
		return (
			<Press onPress={otherFunc || onPress} children={(props) => <Inner firstElement={firstElement} {...props} />} />
		)
	});

	const Highlight = memo(({children}) => (
		<Box
			alignSelf="center"
			w="full"
			bg="lighter"
			p={2}
			mb={3}
			borderRadius="lg"
		>
			<Text fontSize={textSize} textAlign="center">{children}</Text>
		</Box>
	));

	const Indented = memo(({children}) => {
		return (
			<HStack
				m={1}
				mx={indentMargin}
				justifyContent="flex-start"
				alignItems="flex-start"
				space={1}
			>
				<Text fontSize={textSize}>{`\u25CF`}</Text>
				<Text fontSize={textSize}>{children}</Text>
			</HStack>
		)
	});

	return (
		<ScrollView
			p={3}
			bg="darker"
		>
			<Pressable goto="/ms" firstElement SectionIcon={MorphoSyntaxIcon} title={"Morpho\u00ADSyntax"}>
				<Highlight>This tool is for designing the basic structure of your language.</Highlight>
				<Indented>Covers large-scale structures and small</Indented>
				<Indented>Grouped into ten sections</Indented>
				<Indented>Use as many or as few of the prompts as you like</Indented>
			</Pressable>
			<Pressable goto="/wg" SectionIcon={WordGenIcon} title={"Word\u00ADGen"}>
				<Highlight>This tool is for creating words according to rules you set up.</Highlight>
				<Indented>Organize your language's sounds into groups</Indented>
				<Indented>Construct syllable formations using those groups</Indented>
				<Indented>Tweak the output through transformations</Indented>
				<Indented>Jumpstart your process with built-in presets</Indented>
			</Pressable>
			<Pressable goto="/we" SectionIcon={WordEvolveIcon} title={"Word\u00ADEvolve"}>
				<Highlight>
					This tool is for modifying words according to rules you set up, mimicking
					the evolution of natural languages.</Highlight>
				<Indented>Start with words from a language (natural or otherwise)</Indented>
				<Indented>Use standard rules to determine how they evolve</Indented>
				<Indented>Tweak the output through transformations</Indented>
			</Pressable>
			<Pressable goto="/lex" SectionIcon={LexiconIcon} title={"Lexicon"}>
				<Highlight>A place to store your conlangs.</Highlight>
				<Indented>Store bits of information for each word, such as part of speech or definition</Indented>
				<Indented>Sort your words by any criteria</Indented>
				<Indented>Easily add words from WordGen and WordEvolve</Indented>
				<Indented>Store multiple lexicons</Indented>
				<Indented>Export your data</Indented>
			</Pressable>
			<Pressable goto="/wordlists" SectionIcon={WordListsIcon} title={"Word Lists"}>
				<Highlight>A small storehouse of basic words, useful for starting a lexicon.</Highlight>
				<Indented>Easily add words to Lexicon</Indented>
				<Indented>Contains the Swadesh-100, -207 and other variants</Indented>
				<Indented>Also contains Dogolposky, Leipzig-Jakarta, and ASJP lists</Indented>
			</Pressable>
			<Pressable goto="/extrachars" SectionIcon={ExtraCharactersIcon} title={"Extra Cha\u00ADrac\u00ADters"}>
				<Highlight>On many pages, you'll see the Extra Characters icon at the top of the page.</Highlight>
				<Indented>Contains hundreds of characters that may not appear on your mobile keyboard,
					organized according to groups such as Latin, Cyrillic, Arabic and Katakana</Indented>
				<Indented>All IPA (International Phonetic Alphabet) characters grouped together</Indented>
				<Indented>Save your often-used characters as Favorites bar for easy access</Indented>
			</Pressable>
			<VStack
				mx={4}
				mt={20}
				alignItems="center"
				bg="main.800"
				pb={4}
				shadow={3}
				borderTopRadius="full"
			>
				<Heading color="primary.500" p={4} fontSize={textSize}>App Info</Heading>
				<HStack mx={4}>
					<Text fontSize={contactSize}>v.{packageJson.version}</Text>
				</HStack>
				<HStack my={3} mx={4} space={2} alignItems="center" justifyContent="center" flexWrap="wrap">
					<Text fontSize={contactSize} textAlign="center">Contact:</Text>
					<Link
						href="mailto:jasontankapps@gmail.com"
						_text={{fontSize: contactSize, textAlign: "center"}}
					>jasontankapps@gmail.com</Link>
				</HStack>
			</VStack>
		</ScrollView>
	);
};

export default About;
