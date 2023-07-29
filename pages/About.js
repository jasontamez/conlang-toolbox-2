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
import { useDispatch } from 'react-redux';
import packageJson from '../package.json';

import {
	ExtraCharactersIcon,
	LexiconIcon,
	MorphoSyntaxIcon,
	WordEvolveIcon,
	WordGenIcon,
	WordListsIcon
} from '../components/icons';
import { setBaseTextSize } from '../store/appStateSlice';
import getSizes from '../helpers/getSizes';

const About = () => {
	const dispatch = useDispatch();
	const [navigate] = useOutletContext();
	const [headerSize, textSize] = getSizes("xl", "md");
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
		const Inner = ({isPressed}) => {
			const color = isPressed ? "primary.100" : "primary.500";
			return (
				<>
					<HStack
						p={4}
						alignItems="center"
						justifyContent="center"
						space={3}
						flexWrap="wrap"
					>
						<SectionIcon color={color} size={textSize} />
						<Text bold
							color={color}
							fontSize={headerSize}
							textAlign="center"
						>
							{title}
						</Text>
					</HStack>
					<VStack p={4} pt={0}>{children}</VStack>
				</>
			);
		};
		return (
			<Press
				bg="main.800"
				shadow={3}
				onPress={otherFunc || onPress}
				mt={firstElement ? 4 : 6}
				children={(props) => <Inner {...props} />}
			/>
		)
	});

	const Highlight = memo(({children}) => (
		<Box
			alignSelf="center"
			w="full"
			bg="lighter"
			p={2}
			mb={3}
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

	const SectionHeader = memo(({SectionIcon, text}) => {
		return (
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
					{text}
				</Text>
			</HStack>
		)
	});

	return (
		<ScrollView
			p={3}
			bg="darker"
		>
			{ /*
			<Pressable otherFunc={() => dispatch(setBaseTextSize("2xl"))} firstElement p={4}><Text fontSize="xl">Embiggen</Text></Pressable>
			<Pressable otherFunc={() => dispatch(setBaseTextSize("xs"))} firstElement p={6}><Text fontSize="xs">Ensmallen</Text></Pressable>
			<Pressable otherFunc={() => dispatch(setBaseTextSize("sm"))} firstElement p={6}><Text fontSize="sm">Endefaulten</Text></Pressable>
			*/ }
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
				mt={20}
				shadow={3}
				bg="main.800"
				p={4}
				pt={0}
				alignItems="center"
			>
				<Heading color="primary.500" p={4} fontSize={headerSize}>App Info</Heading>
				<HStack mx={4}>
					<Text fontSize={textSize}>v.{packageJson.version}</Text>
				</HStack>
				<HStack my={3} mx={4} space={2} alignItems="center" justifyContent="center" flexWrap="wrap">
					<Text fontSize={textSize} textAlign="center">Contact:</Text>
					<Link
						href="mailto:jasontankapps@gmail.com"
						_text={{fontSize: textSize, textAlign: "center"}}
					>jasontankapps@gmail.com</Link>
				</HStack>
			</VStack>
		</ScrollView>
	);
};

export default About;
