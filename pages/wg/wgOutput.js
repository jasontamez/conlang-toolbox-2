import {
	useBreakpointValue,
	ScrollView,
	VStack,
	Text,
	HStack,
	Spinner,
	Button,
	Box,
	Factory
} from "native-base";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReAnimated, {
	BounceIn,
	BounceOut,
	FadeInLeft,
	FadeOutLeft,
	ZoomInEasyUp,
	ZoomOutEasyUp
} from 'react-native-reanimated';
import escapeRegexp from 'escape-string-regexp';
import { FlatGrid } from 'react-native-super-grid';

import {
	AddIcon
} from "../../components/icons";
import { sizes, fontSizesInPx } from "../../store/appStateSlice";
import {
	equalityCheck
} from "../../store/wgSlice";
import StandardAlert from "../../components/StandardAlert";
import { useWindowDimensions } from "react-native";

const WGOutput = () => {
	const {
		characterGroups,
		multipleSyllableTypes,
		syllableDropoffOverrides,
		singleWord,
		wordInitial,
		wordMiddle,
		wordFinal,
		transforms,
		monosyllablesRate,
		maxSyllablesPerWord,
		characterGroupDropoff,
		syllableBoxDropoff,
		capitalizeSentences,
		declarativeSentencePre,
		declarativeSentencePost,
		interrogativeSentencePre,
		interrogativeSentencePost,
		exclamatorySentencePre,
		exclamatorySentencePost,
		// TO-DO: add the following settings to this page
		output,				// "text" (..."wordlist", etc?)
		showSyllableBreaks,	// false
		sentencesPerText,	// 30
		capitalizeWords,	// false
		sortWordlist,		// true
		wordlistMultiColumn,// true
		wordsPerWordlist	// 250
	} = useSelector(state => state.wg, equalityCheck);
	const { disableConfirms } = useSelector(state => state.appState);
	const dispatch = useDispatch();
	const [alertOpen, setAlertOpen] = useState(false);
	const [alertMsg, setAlertMsg] = useState("");
	const [displayedWords, setDisplayedWords] = useState([]);
	const [longestWordSizeEstimate, setLongestWordSizeEstimate] = useState(undefined);
	const [displayedText, setDisplayedText] = useState("");
	const [showLoadingScreen, setShowLoadingScreen] = useState(false);
	const [charGroupMap, setCharGroupMap] = useState({});
	const [transformsWithRegExps, setTransformsWithRegExps] = useState([]);
	const textSize = useBreakpointValue(sizes.sm);
	const emSize = fontSizesInPx[textSize] || 12;
	const getRandomPercentage = (max = 100) => Math.random() * max;
	const { width } = useWindowDimensions();
	const FlatGridNB = Factory(FlatGrid);

	// // //
	// Convenience Variables
	// // //
	useEffect(() => {
		// Clear objects
		let newMap = {};
		let newTransforms = [];

		// Set up an easy-to-search map of character groups
		characterGroups.forEach(group => (newMap[group.label] = group));
		setCharGroupMap(newMap);

		// Create a new array of transforms, with RegExps included
		// Check transforms for %Category references and save as RegExp objects
		transforms.forEach((rule) => {
			const search = rule.search;
			let regex;
			if(search.indexOf("%") !== -1) {
				// Found a possibility.
				regex = calculateCategoryReferenceRegex(search, newMap);
			} else {
				regex = new RegExp(search, "g");
			}
			newTransforms.push({
				...rule,
				regex
			})
		});
		setTransformsWithRegExps(newTransforms);
	}, [characterGroups, transforms]);
	// Create new arrays for syllables
	const singleWordArray = singleWord.split(/\n/);
	const wordInitialArray = wordInitial.split(/\n/);
	const wordMiddleArray = wordMiddle.split(/\n/);
	const wordFinalArray = wordFinal.split(/\n/);

	// // //
	// Generate Output!
	// // //
	const generateOutput = async () => {
		// Sanity check
		let errors = [];
		if(characterGroups.length === 0) {
			errors.push("You have no character groups defined.");
		}
		if (!multipleSyllableTypes && singleWord === "") {
			errors.push("You have no syllables defined.");
		}
		if (multipleSyllableTypes &&
			(
				(monosyllablesRate > 0 && singleWord === "")
				|| wordInitial === ""
				|| wordMiddle === ""
				|| wordFinal === ""
			)
		) {
			errors.push("You are missing one or more types of syllables.");
		}
		// Load an alert if needed
		if(errors.length > 0) {
			setAlertMsg(errors.join(" "));
			setAlertOpen(true);
			return;
		}
		// Set up loading screen, clear any old info, etc
		setDisplayedText("");
		setDisplayedWords([]);
		setShowLoadingScreen(true);
		// Determine what we're making.
		if (output === "text") {
			return generatePseudoText();
		} else if (output === "syllables") {
			return generateEverySyllable(capitalizeWords);
		}
		return generateWordList(capitalizeWords);
	};


	// // //
	// Generate a psuedo-text
	// // //
	const generatePseudoText = async () => {
		let text = [];
		for(
			let sentenceNumber = 0;
			sentenceNumber < sentencesPerText;
			sentenceNumber++
		) {
			let sentence = "";
			let maxWords = 3;
			for(
				maxWords = 3;
				true; // it never ends on its own
				maxWords = Math.max((maxWords + 1) % 15, 3
			)) {
				const maxChance = (
					maxWords < 5 ?
						35
					: (maxWords < 9 ? 50 : 25)
				);
				// 35% chance of 3-4 word sentence
				// 50% chance of 5-8 word sentence
				// 25% chance of 9-15 word sentence
				if (getRandomPercentage() < maxChance) {
					break;
				}
			}
			sentence = makeOneWord(capitalizeSentences);
			for(let n = 2; n <= maxWords; n++) {
				sentence = sentence + " " + makeOneWord(false);
			}
			const sentenceType = getRandomPercentage(12);
			let PRE = exclamatorySentencePre;
			let POST = exclamatorySentencePost;
			if(sentenceType < 9) {
				// Declarative three-fourths the time
				PRE = declarativeSentencePre;
				POST = declarativeSentencePost;
			} else if (sentenceType < 11) {
				// Interrogative one-sixth the time
				PRE = interrogativeSentencePre;
				POST = interrogativeSentencePost;
			} else {
				// Exclamatory one-twelfth the time
			}
			text.push(`${PRE || ""}${sentence}${POST || ""}`);
		}
		setShowLoadingScreen(false);
		setDisplayedText(text.join(" "));
	};

	// // //
	// Generate Syllables
	// // //
	const makeSyllable = (syllList, specialOverrideRate) => {
		// Chooses a syllable from the given list
		const max = syllList.length;
		let chosen;
		let rate = specialOverrideRate === null ? syllableBoxDropoff : specialOverrideRate;
		if(rate <= 0) {
			// Equiprobable: Just pick a random syllable.
			chosen = syllList[Math.floor(getRandomPercentage(max))];
			return translateSyllable(chosen);
		}
		for(let toPick = 0, counter = 0; true; toPick = (toPick + 1) % max) {
			// The 'true' in this for loop means it never ends on its own.
			if (getRandomPercentage() < rate) {
				chosen = syllList[toPick];
				break;
			}
			// Every 50 loops, increase the rate, just in case we need it
			if(++counter >= 50) {
				counter = 0;
				rate++;
			}
		}
		return translateSyllable(chosen);
	};
	const translateSyllable = (syll) => {
		// change "CV" to "ka" or "su" or whatever
		const chars = syll.split("");
		let result = "";
		chars.forEach(current => {
			const charGroup = charGroupMap[current];
			if(charGroup === undefined) {
				result += current;
			} else {
				const thisRate = (charGroup.dropoffOverride === undefined ? characterGroupDropoff : charGroup.dropoffOverride) + 5;
				const choices = charGroup.run;
				const max = choices.length;
				if(thisRate === 0) {
					result += choices[Math.floor(getRandomPercentage(max))];
				} else {
					for(let toPick = 0; true; toPick = (toPick + 1) % max) {
						// The 'true' in this for loop means it never ends on its own.
						if (getRandomPercentage() < thisRate) {
							result += choices[toPick];
							break;
						}
					}
				}
			}
		});
		return result;
	};

	// // //
	// Generate One Word
	// // //
	const makeOneWord = (capitalizeThis) => {
		let numberOfSyllables = 1;
		let word = [];
		let result;
		// Determine number of syllables
		if(getRandomPercentage() >= monosyllablesRate) {
			// More than 1. Add syllables, favoring a lower number of syllables.
			let max = maxSyllablesPerWord - 2;
			numberOfSyllables = 2;
			for(let toAdd = 0; true; toAdd = (toAdd + 1) % max) {
				// The 'true' in this for loop means it never ends on its own.
				if (getRandomPercentage() < 50) {
					numberOfSyllables += toAdd;
					break;
				}
			}
		}
		// Check if we're monosyllabic.
		if(numberOfSyllables === 1) {
			// Mono
			word.push( makeSyllable(singleWordArray, syllableDropoffOverrides.singleWord) );
		} else {
			// Polysyllabic
			if(!multipleSyllableTypes) {
				// Just use the one type
				for(let current = 1; current < numberOfSyllables; current++) {
					word.push( makeSyllable(singleWordArray, syllableDropoffOverrides.singleWord) );
				}
			} else {
				// Add word-initial syllable
				word.push( makeSyllable(wordInitialArray, syllableDropoffOverrides.wordInitial) );
				for(let current = 2; current < numberOfSyllables; current++) {
					// Add mid-word syllable
					word.push( makeSyllable(wordMiddleArray, syllableDropoffOverrides.wordMiddle) );
				}
				// Add word-final syllable
				word.push( makeSyllable(wordFinalArray, syllableDropoffOverrides.wordFinal) );
			}
		}
		// Check for syllable break insertion
		if(showSyllableBreaks) {
			result = word.join("\u00b7");
		} else {
			result = word.join("");
		}
		// Apply rewrite rules
		result = doRewrite(result);
		// Capitalize if needed
		if(capitalizeThis) {
			result = result.charAt(0).toUpperCase() + result.slice(1);
		}
		return result;
	};


	// // //
	// Apply Rewrite Rules
	// // //
	const doRewrite = (word) => {
		transformsWithRegExps.forEach(({replace, regex}) => {
			word = word.replace(regex, replace);
		});
		return word;
	};

	// // //
	// Generate Every Possible Syllable
	// // //
	const generateEverySyllable = async (capitalize = false) => {
		let everySyllable = [];
		let noDupes = {};
		let syllables = (
			multipleSyllableTypes ?
				singleWordArray
			:
				singleWordArray.concat(
					wordInitialArray,
					wordMiddleArray,
					wordFinalArray
				)
		).map(syll => ["", syll]);
		while(syllables.length > 0) {
			const [current, toGo] = syllables.shift();
			let res = recurseSyllables(current, toGo);
			let newOutput = [];
			res.then((res) => {
				if(res.next === "") {
					// This one is done - run through rewrite rules
					newOutput.push(...res.results.map((word) => doRewrite(word)));
				} else {
					// Add to syllables
					let next = res.next;
					syllables.push(...res.results.map((word) => [word, next]));
				}
			});
			await res;
			// Check for duplicates
			newOutput.forEach(word => {
				if(!noDupes[word]) {
					noDupes[word] = true;
					// Capitalize if needed
					everySyllable.push(
						capitalize ?
							word.charAt(0).toUpperCase() + word.slice(1)
						:
							word
					);
				}
			});
		}
		// Sort if needed
		if(sortWordlist) {
			everySyllable.sort(new Intl.Collator("en", { sensitivity: "variant" }).compare);
		}
		setShowLoadingScreen(false);
		determineColumnSize(everySyllable);
		setDisplayedWords(everySyllable);
	};
	const recurseSyllables = async (previous, toGo) => {
		const current = toGo.charAt(0);
		const next = toGo.slice(1);
		const charGroup = charGroupMap[current];
		if(charGroup === undefined) {
			// Category not found - save as written
			return {
				results: [previous + current],
				next
			};
		}
		return {
			results: charGroup.run.split("").map(char => previous + char),
			next
		}
	};

	// // //
	// Wordlist
	// // //
	const generateWordList = async (capitalize) => {
		let words = [];
		let record = {};
		let maxattempts = 1000;
		for (let n = 0; n < wordsPerWordlist; n++) {
			if(--maxattempts < 0) {
				// We've tried too many times. Give up.
				break;
			}
			const candidate = makeOneWord(capitalize);
			if(record[candidate]) {
				// Duplicate. Ignore.
				n--;
				continue;
			}
			record[candidate] = true;
			words.push(candidate);
		}
		// Sort if needed
		if(sortWordlist) {
			words.sort(new Intl.Collator("en", { sensitivity: "variant" }).compare);
		}
		setShowLoadingScreen(false);
		determineColumnSize(words);
		setDisplayedWords(words);
		//return words;
	};

	// // //
	// Determine number of columns from given array of words
	// // //
	const determineColumnSize = (words) => {
		const viewport = width - 0 // TO-DO: replace 0 with PADDING
		if (!wordlistMultiColumn) {
			//setDisplayedColumns(viewport);
			setLongestWordSizeEstimate(viewport);
			return;
		}
		// Find length of longest word
		// (this will not be entirely correct if the word has two-character glyphs, but that's ok)
		const longestWord = Math.max(...words.map(w => w.length));
		// Estimate size of the longest word, erring on the larger size
		const longestWordLength = (emSize * longestWord) + 0; // TO-DO: replace 0 with column spacing? If needed?
		setLongestWordSizeEstimate(longestWordLength);
		//setDisplayedColumns(Math.max(1, Math.floor(viewport / longestWordLength)));
	};


	// // //
	// JSX
	// // //
	const WordList = () => (
		<ReAnimated.View
			entering={FadeInLeft}
			exiting={FadeOutLeft}
			style={{flex: 1}}
		>
			<FlatGridNB
				renderItem={({item}) => <Text fontSize={textSize}>{item}</Text>}
				data={displayedWords}
				itemDimension={longestWordSizeEstimate}
				fixed
				keyExtractor={(item, i) => `${item}-Grid-${i}`}
				style={{
					margin: 0,
					padding: 0,
					flex: 1,
				}}
				spacing={displayedWords.length ? emSize : 0}
				m={0}
				p={0}
				maxH="full"
			/>
		</ReAnimated.View>
	);
	const LoadingScreen = () => {
		const loadingSize = useBreakpointValue(sizes.x2);
		return (
			<ReAnimated.View
				entering={BounceIn}
				exiting={BounceOut}
				style={{flex: 1}}
			>
				<HStack
					flexWrap="wrap"
					alignItems="center"
					justifyContent="center"
					space={10}
					py={4}
				>
					<Text fontSize={loadingSize}>Generating...</Text>
					<Spinner size="lg" color="primary.500" />
				</HStack>
			</ReAnimated.View>
		);
	}
	const PseudoText = () => (
		<ReAnimated.View
			entering={ZoomInEasyUp}
			exiting={ZoomOutEasyUp}
			style={{flex: 1}}
		>
			<ScrollView w="full">
				<Text fontSize={textSize}>{displayedText}</Text>
			</ScrollView>
		</ReAnimated.View>
	);

	return (
		<VStack h="full" alignContent="flex-start" bg="main.900">
			<StandardAlert
				alertOpen={alertOpen}
				setAlertOpen={setAlertOpen}
				headerContent="Cannot Generate"
				headerProps={{
					bg: "error.500"
				}}
				bodyContent={alertMsg}
				overrideButtons={[
					({leastDestructiveRef}) => <Button
						onPress={() => setAlertOpen(false)}
						ref={leastDestructiveRef}
					>Ok</Button>
				]}
			/>
			<HStack>
				<Button onPress={() => setShowLoadingScreen(true)}>Loading</Button>
				<Button onPress={() => generateWordList()}>Words</Button>
				<Button onPress={() => generatePseudoText()}>Text</Button>
				<Button onPress={() => generateEverySyllable()}>Syllables</Button>
				<Button onPress={() => {
					setShowLoadingScreen(false);
					setDisplayedText("");
					setDisplayedWords([]);
				}}>Clear</Button>
			</HStack>
			{(showLoadingScreen ?
				[<LoadingScreen key="loadingScreen" />]
			:
				[]
			)}
			{(displayedWords.length > 0 ?
				[<WordList key="wordList" />]
			:
				[]
			)}
			{(displayedText ?
				[<PseudoText key="pseudoText" />]
			:
				[]
			)}
		</VStack>
	);
};

export default WGOutput;

// TO-DO: put this in its own component for WE to use when needed
const calculateCategoryReferenceRegex = (rule, mapObj) => {
	// Check rewrite rules for %Category references
	// %% condenses to %, so split on those to begin with.
	let broken = rule.split("%%");
	// Create a variable to hold the pieces as they are handled
	let final = [];
	while(broken.length > 0) {
		// First, check for charGroup negation
		// Separate along !% instances
		let testing = broken.shift().split("!%");
		// Save first bit, before any !%
		let reformed = testing.shift();
		// Handle each instance
		while(testing.length > 0) {
			let bit = testing.shift();
			// What's the charGroup being negated?
			let charGroup = mapObj[bit.charAt(0)];
			// Does it exist?
			if(charGroup !== undefined) {
				// Category found. Replace with [^a-z] construct, where a-z is the charGroup contents.
				reformed += "[^" + escapeRegexp(charGroup.run) + "]" + bit.slice(1);
			} else {
				// If charGroup is not found, it gets ignored.
				reformed = "!%" + bit;
			}
		}
		// Now check for categories
		// Separate along % instances
		testing = reformed.split("%");
		// Save the first bit, before any %
		reformed = testing.shift();
		// Handle each instance
		while(testing.length > 0) {
			let bit = testing.shift();
			// What's the charGroup?
			let charGroup = mapObj[bit.charAt(0)];
			// Does it exist?
			if(charGroup !== undefined) {
				// Category found. Replace with [a-z] construct, where a-z is the charGroup contents.
				reformed += "[" + escapeRegexp(charGroup.run) + "]" + bit.slice(1);
			} else {
				// If charGroup is not found, it gets ignored.
				reformed = "%" + bit;
			}
		}
		// Save reformed for later!
		final.push(reformed);
	}
	// Reform info with %% reduced back to % and return as regexp
	return new RegExp(final.join("%"), "g");
};

