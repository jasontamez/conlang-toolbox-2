import {
	useBreakpointValue,
	ScrollView,
	VStack,
	Text,
	HStack,
	Spinner,
	Button,
	IconButton,
	Pressable,
	useContrastText,
	Modal,
	Box,
	Menu,
	useToast
} from "native-base";
import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ReAnimated, {
	FadeInLeft,
	FadeOutLeft,
	ZoomInEasyDown,
	ZoomInRight,
	ZoomOutEasyDown,
	ZoomOutRight
} from 'react-native-reanimated';
import escapeRegexp from 'escape-string-regexp';
import { FlatGrid } from 'react-native-super-grid';

import {
	CloseCircleIcon,
	CloseIcon,
	CopyIcon,
	GearIcon,
	GenerateIcon,
	OkIcon,
	SaveIcon,
	SortEitherIcon
} from "../../components/icons";
import { sizes, fontSizesInPx } from "../../store/appStateSlice";
import {
	equalityCheck,
	setCapitalizeWords,
	setSentencesPerText,
	setShowSyllableBreaks,
	setSortWordlist,
	setWordlistMultiColumn,
	setWordsPerWordlist
} from "../../store/wgSlice";
import StandardAlert from "../../components/StandardAlert";
import { SliderWithLabels, ToggleSwitch } from "../../components/layoutTags";
import { addMultipleItemsAsColumn } from "../../store/lexiconSlice";
import doToast from "../../helpers/toast";

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
		showSyllableBreaks,
		sentencesPerText,
		capitalizeWords,
		sortWordlist,
		wordlistMultiColumn,
		wordsPerWordlist
	} = useSelector(state => state.wg, equalityCheck);
	const columns = useSelector(state => state.lexicon.columns);
	//const { disableConfirms } = useSelector(state => state.appState);
	const dispatch = useDispatch();
	const [alertCannotGenerate, setAlertCannotGenerate] = useState(false);
	const [alertMsg, setAlertMsg] = useState("");

	const [displayedWords, setDisplayedWords] = useState([]);
	const [longestWordSizeEstimate, setLongestWordSizeEstimate] = useState(undefined);
	const [displayedText, setDisplayedText] = useState(false);
	const [showLoadingScreen, setShowLoadingScreen] = useState(false);
	const [rawWords, setRawWords] = useState([]);
	const [output, setOutput] = useState("text");

	const [savingToLexicon, setSavingToLexicon] = useState(false);
	const [wordsToSave, setWordsToSave] = useState({});
	const [chooseWhereToSaveInLex, setChooseWhereToSaveInLex] = useState(false);
	const [whereToSaveInLex, setWhereToSaveInLex] = useState(columns.length > 0 ? columns[0] : {label: "No columns"});
	const [alertNothingToSave, setAlertNothingToSave] = useState(false);

	const [charGroupMap, setCharGroupMap] = useState({});
	const [transformsWithRegExps, setTransformsWithRegExps] = useState([]);

	const [openSettings, setOpenSettings] = useState(false);
	const textSize = useBreakpointValue(sizes.sm);
	const descSize = useBreakpointValue(sizes.xs);
	const headerSize = useBreakpointValue(sizes.md);
	const largeSize = useBreakpointValue(sizes.lg);
	const emSize = fontSizesInPx[textSize] || fontSizesInPx.xs;
	const getRandomPercentage = (max = 100) => Math.random() * max;
	const { width } = useWindowDimensions();
	const toast = useToast();
	const navigate = useNavigate();
	const primaryContrast = useContrastText("primary.500");


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
	// Display functions
	// // //
	const doCap = (word) => word.charAt(0).toUpperCase() + word.slice(1);
	const toggleWordSavedForLexicon = (rawWord) => {
		let newSave = {...wordsToSave}
		if(wordsToSave[rawWord]) {
			delete newSave[rawWord];
		} else {
			newSave[rawWord] = true;
		}
		setWordsToSave(newSave);
	};
	const OneWordElement = ({rawWord, text}) => {
		// TO-DO: Change this into a Pure component? Or class component?
		return (
			<Pressable
				disabled={!savingToLexicon}
				onPress={() => savingToLexicon && toggleWordSavedForLexicon(rawWord)}
			><Text {...wordStyle(rawWord)}>{text}</Text></Pressable>
		);
	};
	const wordStyle = (word) => {
		if(savingToLexicon) {
			return wordsToSave[word] ?
				{ bg: "primary.500", color: primaryContrast }
			:
				{ bg: "lighter" }
			;
		}
		return {};
	};


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
			setAlertCannotGenerate(true);
			return;
		}
		// Set up loading screen, clear any old info, etc
		setDisplayedText(false);
		setDisplayedWords([]);
		setShowLoadingScreen(true);
		// Determine what we're making.
		if (output === "text") {
			return generatePseudoText();
		} else if (output === "syllables") {
			return generateEverySyllable();
		}
		return generateWordList();
	};


	// // //
	// Generate a psuedo-text
	// // //
	const generatePseudoText = async () => {
		let text = [];
		let rawWords = [];
		let rawWordRecord = {};
		for(
			let sentenceNumber = 1;
			sentenceNumber <= sentencesPerText;
			sentenceNumber++
		) {
			let sentence = [];
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
			const [firstWord, raw] = makeOneWord();
			if(!rawWordRecord[raw]) {
				rawWordRecord[raw] = true;
				rawWords.push(raw);
			}
			for(let n = 2; n <= maxWords; n++) {
				let duo = makeOneWord();
				let raw = duo[1];
				if(!rawWordRecord[raw]) {
					rawWordRecord[raw] = true;
					rawWords.push(raw);
				}
				sentence.push(duo);
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
			text.push(
				<Text
					key={`PsuedoTextSentence-${sentenceNumber}`}
				>{PRE || ""}<OneWordElement
					text={capitalizeSentences ? doCap(firstWord) : firstWord}
					rawWord={raw}
				/>{sentence.map((duo, i) => {
					const [word, raw] = duo;
					return (
						<Text
							key={`PseudoText-${sentenceNumber}.${i+2}`}
						> <OneWordElement rawWord={raw} text={word} /></Text>
					);
				})}{POST || ""} </Text>
			);
		}
		setShowLoadingScreen(false);
		setDisplayedText(text);
		setRawWords(rawWords);
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
	const makeOneWord = () => {
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
		const joined = word.join("");
		if(showSyllableBreaks) {
			result = doTransformation(word.join("\u00b7"));
			return [result, result.replace(/\u00b7/g, "")]
		}
		result = doTransformation(word.join(""));
		return [result, result];
	};


	// // //
	// Apply Transformations
	// // //
	const doTransformation = (word) => {
		transformsWithRegExps.forEach(({replace, regex}) => {
			word = word.replace(regex, replace);
		});
		return word;
	};

	// // //
	// Generate Every Possible Syllable
	// // //
	const generateEverySyllable = async () => {
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
			const res = recurseSyllables(current, toGo);
			let newOutput = [];
			res.then((res) => {
				const {results, next} = res;
				if(next === "") {
					// This one is done - run through transformations
					newOutput.push(...results.map((word) => doTransformation(word)));
				} else {
					// Add to syllables being recursed
					syllables.push(...results.map((word) => [word, next]));
				}
			});
			await res;
			// Check for duplicates
			newOutput.forEach(word => {
				if(!noDupes[word]) {
					noDupes[word] = true;
					// Capitalize if needed
					everySyllable.push(
						capitalizeWords ?
							doCap(word)
						:
							word
					);
				}
			});
		}
		// Sort if needed
		//TO-DO: Find replacement for Intl.Collator?
		if(sortWordlist) {
//			everySyllable.sort(new Intl.Collator("en", { sensitivity: "variant" }).compare);
			everySyllable.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "variant" }));
		}
		setShowLoadingScreen(false);
		determineColumnSize(everySyllable);
		setDisplayedWords(everySyllable.map(syl => [syl, syl]));
		setRawWords(everySyllable);
	};
	const recurseSyllables = async (previous, toGo) => {
		const current = toGo.charAt(0);
		const next = toGo.slice(1);
		const charGroup = charGroupMap[current];
		// Assume we save as written - only one option
		let results = [previous + current];
		if(charGroup !== undefined) {
			// Category found - save as Array of all possibilities
			results = charGroup.run.split("").map(char => previous + char);
		}
		return { results, next };
	};

	// // //
	// Wordlist
	// // //
	const generateWordList = async () => {
		let words = [];
		let raws = [];
		let record = {};
		let maxattempts = 1000;
		for (let n = 0; n < wordsPerWordlist; n++) {
			if(--maxattempts < 0) {
				// We've tried too many times. Give up.
				break;
			}
			const [candidate, raw] = makeOneWord();
			if(record[raw]) {
				// Duplicate. Ignore.
				n--;
				continue;
			}
			record[raw] = true;
			words.push([capitalizeWords ? doCap(candidate) : candidate, raw]);
			raws.push(raw);
		}
		// Sort if needed
		//TO-DO: Find replacement for Intl.Collator?
		if(sortWordlist) {
//			words.sort(new Intl.Collator("en", { sensitivity: "variant" }).compare);
			words.sort((a, b) => a[1].localeCompare(b[1], "en", { sensitivity: "variant" }));
		}
		setShowLoadingScreen(false);
		determineColumnSize(words.map(w => w[0]));
		setDisplayedWords(words);
		setRawWords(raws);
		//return words;
	};

	// // //
	// Determine number of columns from given array of words
	// // //
	const determineColumnSize = (words) => {
		const viewport = width - 32 // Horizontal padding for FlatGrid container
		if (!wordlistMultiColumn) {
			//setDisplayedColumns(viewport);
			setLongestWordSizeEstimate(viewport);
			return;
		}
		// Find length of longest word
		// (this will not be entirely correct if the word has two-character glyphs, but that's ok)
		const longestWord = Math.max(...words.map(w => w.length));
		// Estimate size of the longest word, erring on the larger size
		const longestWordLength = (emSize * longestWord);
		setLongestWordSizeEstimate(longestWordLength);
		//setDisplayedColumns(Math.max(1, Math.floor(viewport / longestWordLength)));
	};


	// // //
	// Save to Lexicon
	// // //
	const toggleSaveSomeToLex = () => {
		let scheme = "success";
		let msg = "Tap on a word to mark it for saving. Click the giant Save button when you're done.";
		let duration = 5000;
		if(savingToLexicon) {
			// set toast options differently
			msg = "No longer saving.";
			scheme = "warning";
			duration = undefined;
		}
		setSavingToLexicon(!savingToLexicon);
		setWordsToSave({});
		doToast({
			toast,
			scheme,
			msg,
			placement: "top-right",
			duration,
			boxProps: {
				maxWidth: (width * 2 / 5)
			}
		});
	};
	const findWordsToSave = () => {
		// use rawWords or saved words
		if(savingToLexicon) {
			return Object.keys(wordsToSave);
		}
		return rawWords;
	};
	const doSaveToLex = () => {
		const words = findWordsToSave();
		// Save to Lexicon
		dispatch(addMultipleItemsAsColumn({
			words,
			column: whereToSaveInLex.id
		}));
		doToast({
			toast,
			override: (
				<VStack
					alignItems="center"
					borderRadius="sm"
					bg="success.500"
					maxW={56}
					p={0}
					m={0}
				>
					<IconButton
						alignSelf="flex-end"
						onPress={() => toast.closeAll()}
						bg="transparent"
						icon={<CloseIcon color="success.50" />}
						p={1}
						m={0}
					/>
					<Box
						mb={2}
						mt={0}
						p={0}
						px={3}
					>
						<Text textAlign="center" color="success.50">Added <Text bold>{words.length}</Text> words to the Lexicon.</Text>
					</Box>
					<Button
						bg="darker"
						px={2}
						py={1}
						mb={1}
						_text={{color: "success.50"}}
						onPress={() => {
							navigate("/lex");
							toast.closeAll();
						}}
					>Go to Lexicon</Button>
				</VStack>
			),
			placement: "top",
			duration: 5000
		});
		setWordsToSave({});
		setChooseWhereToSaveInLex(false);
	};


	// // //
	// JSX
	// // //
	const WordList = () => {
		// TO-DO: Change this into a Pure component?
		const renderItem = ({item}) => {
			const [text, rawWord] = item;
			return (
				<Text
					fontSize={textSize}
				><OneWordElement text={text} rawWord={rawWord} /></Text>
			);
		};
		const keyExtractor = (item, i) => `${item[1]}-Grid-${i}`;
		const spacing = displayedWords.length ? emSize : 0;
		return (
			<ReAnimated.View
				entering={FadeInLeft}
				exiting={FadeOutLeft}
				style={{flex: 1, paddingHorizontal: 16}}
			>
				<FlatGrid
					renderItem={renderItem}
					data={displayedWords}
					itemDimension={longestWordSizeEstimate}
					keyExtractor={keyExtractor}
					style={{
						margin: 0,
						padding: 0,
						flex: 1,
						maxHeight: "100%",
						maxWidth: "100%"
					}}
					spacing={spacing}
				/>
			</ReAnimated.View>
		)
	};
	const LoadingScreen = () => {
		const loadingSize = useBreakpointValue(sizes.x2);
		return (
			<ReAnimated.View
				entering={ZoomInEasyDown}
				exiting={ZoomOutEasyDown}
				style={{flex: 1, width: "100%"}}
			>
				<HStack
					flexWrap="wrap"
					alignItems="center"
					justifyContent="center"
					space={10}
					py={4}
					w="full"
					bg="lighter"
				>
					<Text fontSize={loadingSize}>Generating...</Text>
					<Spinner size="lg" color="primary.500" />
				</HStack>
			</ReAnimated.View>
		);
	}
	const PseudoText = () => {
		return (
			<ReAnimated.View
				entering={ZoomInRight}
				exiting={ZoomOutRight}
				style={{flex: 1, width: "100%", height: "100%"}}
			>
				<ScrollView flex={1} p={4}>
					<Text fontSize={textSize}>{displayedText}</Text>
				</ScrollView>
			</ReAnimated.View>
		)
	};

	return (
		<VStack h="full" alignContent="flex-start" bg="main.900">
			<StandardAlert
				alertOpen={alertCannotGenerate}
				setAlertOpen={setAlertCannotGenerate}
				headerContent="Cannot Generate"
				headerProps={{
					bg: "error.500"
				}}
				bodyContent={alertMsg}
				overrideButtons={[
					({leastDestructiveRef}) => <Button
						onPress={() => setAlertCannotGenerate(false)}
						ref={leastDestructiveRef}
					>Ok</Button>
				]}
			/>
			<StandardAlert
				alertOpen={alertNothingToSave}
				setAlertOpen={setAlertNothingToSave}
				headerContent="Cannot Save to Lexicon"
				headerProps={{
					bg: "error.500"
				}}
				bodyContent="There is nothing to save."
				continueProps={{
					bg: "danger.500",
					_text: {
						color: "danger.50"
					}
				}}
				continueFunc={() => {
					setSavingToLexicon(false);
					setAlertNothingToSave(false);
				}}
				continueText="Stop Saving"
				cancelText="Cancel"
				cancelFunc={() => setAlertNothingToSave(false)}
			/>
			<Modal isOpen={openSettings}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center">
							<Text flex={1} px={3} fontSize={textSize} color={primaryContrast} textAlign="left">Output Settings</Text>
							<IconButton
								flex={0}
								mr={3}
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => setOpenSettings(false)}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<Box
							bg="darker"
							px={2}
							py={1}
						>
							<Text
								opacity={80}
								fontSize={headerSize}
								letterSpacing={largeSize}
								color="main.600"
							>General Controls</Text>
						</Box>
						<ToggleSwitch
							hProps={{ p: 2 }}
							label="Show syllable breaks"
							labelSize={textSize}
							desc="Note: this may cause Transforms to stop working"
							descSize={descSize}
							descProps={{ color: "main.500" }}
							switchState={showSyllableBreaks}
							switchToggle={() => dispatch(setShowSyllableBreaks(!showSyllableBreaks))}
						/>
						<Box
							bg="darker"
							px={2}
							py={1}
							mt={2}
						>
							<Text
								opacity={80}
								fontSize={headerSize}
								letterSpacing={largeSize}
								color="main.600"
							>Pseudo-Text Controls</Text>
						</Box>
						<SliderWithLabels
							min={1}
							max={100}
							value={sentencesPerText}
							beginLabel="1"
							endLabel="100"
							notFilled
							stackProps={{
								p: 2
							}}
							Label={({value}) => (
								<Box mb={1}>
									<Text fontSize={textSize}>Sentences per text: <Text px={2.5} bg="lighter">{value}</Text></Text>
								</Box>
							)}
							sliderProps={{
								accessibilityLabel: "Sentences per pseudo-text",
								onChangeEnd: (v) => dispatch(setSentencesPerText(v))
							}}
						/>
						<Box
							bg="darker"
							px={2}
							py={1}
							mt={2}
						>
							<Text
								opacity={80}
								fontSize={headerSize}
								letterSpacing={largeSize}
								color="main.600"
							>Word List and Syllable List Controls</Text>
						</Box>
						<ToggleSwitch
							hProps={{
								borderBottomWidth: 1,
								borderColor: "main.900",
								p: 2
							}}
							label="Capitalize words"
							labelSize={textSize}
							switchState={capitalizeWords}
							switchToggle={() => dispatch(setCapitalizeWords(!capitalizeWords))}
						/>
						<ToggleSwitch
							hProps={{
								borderBottomWidth: 1,
								borderColor: "main.900",
								p: 2
							}}
							label="Sort word lists"
							labelSize={textSize}
							switchState={sortWordlist}
							switchToggle={() => dispatch(setSortWordlist(!sortWordlist))}
						/>
						<ToggleSwitch
							hProps={{
								borderBottomWidth: 1,
								borderColor: "main.900",
								p: 2
							}}
							label="Use multiple columns"
							labelSize={textSize}
							switchState={wordlistMultiColumn}
							switchToggle={() => dispatch(setWordlistMultiColumn(!wordlistMultiColumn))}
						/>
						<SliderWithLabels
							min={50}
							max={1000}
							value={wordsPerWordlist}
							beginLabel="50"
							endLabel="1000"
							notFilled
							Label={({value}) => (
								<Box mb={1}>
									<Text fontSize={textSize}>Words per wordlist: <Text px={2.5} bg="lighter">{value}</Text></Text>
								</Box>
							)}
							sliderProps={{
								accessibilityLabel: "Words per worlist",
								onChangeEnd: (v) => dispatch(setWordsPerWordlist(v))
							}}
							stackProps={{ p: 2 }}
						/>
					</Modal.Body>
					<Modal.Footer>
						<HStack justifyContent="flex-end" w="full" p={1}>
							<Button
								startIcon={<OkIcon size={textSize} />}
								px={2}
								py={1}
								onPress={() => setOpenSettings(false)}
							>Done</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<Modal isOpen={chooseWhereToSaveInLex}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center">
							<Text flex={1} px={3} fontSize={textSize} color={primaryContrast} textAlign="left">Save to Lexicon</Text>
							<IconButton
								flex={0}
								mr={3}
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => setChooseWhereToSaveInLex(false)}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack alignItems="center" justifyContent="center" space={2}>
							<Text textAlign="center">Choose which Lexicon column to save the words to:</Text>
							<Menu
								placement="bottom left"
								closeOnSelect={true}
								trigger={
									(props) => {
										if(columns.length <= 0) {
											return (
												<Box
													bg="error.800"
													borderColor="error.500"
													borderWidth={2}
													px={4}
													py={2}
												>
													<Text color="error.50" textAlign="center">There are no columns in the Lexicon. You must have at least one column in order to save anything.</Text>
												</Box>
											);
										}
										return (
											<Button
												p={3}
												pl={2}
												bg="secondary.500"
												flex={0}
												_stack={{
													justifyContent: "space-between",
													alignItems: "center",
													style: {
														overflow: "hidden"
													}
												}}
												startIcon={<SortEitherIcon mx={1} color="secondary.50" flexGrow={0} flexShrink={0} />}
												{...props}
											>
												<Text color="secondary.50" isTruncated textAlign="center" noOfLines={1}>{whereToSaveInLex.label}</Text>
											</Button>
										)
									}
								}
							>
								<Menu.OptionGroup
									title="Choose a column:"
									defaultValue={whereToSaveInLex}
									type="radio"
									onChange={(v) => setWhereToSaveInLex(v)}
								>
									{
										columns.map((item) => {
											const {id, label} = item;
											return (
												<Menu.ItemOption
													key={id + "-LexColumn"}
													value={item}
												>
													{label}
												</Menu.ItemOption>
											);
										})
									}
								</Menu.OptionGroup>
							</Menu>
						</VStack>
					</Modal.Body>
					<Modal.Footer>
						<HStack justifyContent="space-between" w="full" p={1}>
							<Button
								startIcon={<CloseCircleIcon size={textSize} color="text.50" />}
								bg="darker"
								_text={{ color: "text.50" }}
								px={2}
								py={1}
								onPress={() => setChooseWhereToSaveInLex(false)}
							>Cancel</Button>
							<Button
								startIcon={<SaveIcon size={textSize} />}
								px={2}
								py={1}
								onPress={() => doSaveToLex()}
							>Save</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<HStack
				justifyContent="space-between"
				alignItems="flex-start"
				maxW="full"
				maxH="full"
				p={6}
				space={2}
				bg="main.800"
			>
				<VStack
					alignItems="flex-start"
					justifyContent="flex-start"
					space={4}
				>
					<Menu
						placement="bottom left"
						closeOnSelect={true}
						trigger={
							(props) => (
								<Button
									py={1}
									pl={2}
									pr={3}
									bg="tertiary.500"
									flexGrow={1}
									flexShrink={2}
									_stack={{
										justifyContent: "space-between",
										alignItems: "center",
										flexGrow: 1,
										flexShrink: 1,
										flexBasis: 0,
										space: 0,
										style: {
											overflow: "hidden"
										}
									}}
									startIcon={<SortEitherIcon mx={1} color="tertiary.50" flexGrow={0} flexShrink={0} />}
									{...props}
								>
									<Box
										overflow="hidden"
										flexGrow={1}
										flexShrink={0}
									>
										<Text color="tertiary.50" isTruncated textAlign="left" noOfLines={1}>{
											output === "text" ?
												"Pseudo-Text"
											: (
												output === "syllables" ?
													"Every possible syllable"
												:
													"List of Words"
											)
										}</Text>
									</Box>
								</Button>
							)
						}
					>
						<Menu.OptionGroup
							title="Display:"
							defaultValue={output}
							type="radio"
							onChange={(v) => setOutput(v)}
						>
							<Menu.ItemOption value="text">
								Pseudo-Text
							</Menu.ItemOption>
							<Menu.ItemOption value="wordlist">
								List of Words
							</Menu.ItemOption>
							<Menu.ItemOption value="syllables">
								Every possible syllable
							</Menu.ItemOption>
						</Menu.OptionGroup>
					</Menu>
					<Button
						_text={{
							fontSize: largeSize,
							letterSpacing: 1.5
						}}
						pl={5}
						pr={4}
						py={1.5}
						endIcon={savingToLexicon ?
							<SaveIcon size={largeSize} ml={1} />
						:	
							<GenerateIcon size={largeSize} ml={1} />
						}
						onPress={() => {
							if(savingToLexicon) {
								const words = findWordsToSave();
								if(words.length > 0) {
									// Open modal to choose where to save.
									setChooseWhereToSaveInLex(true)
								} else {
									// Open an Alert
									setAlertNothingToSave(true)
								}
							} else {
								// Generate!
								generateOutput()
							}
						}}
					>{savingToLexicon ? "SAVE" : "GENERATE"}</Button>
				</VStack>
				<HStack space={2}>
					<IconButton
						colorScheme="secondary"
						variant="solid"
						icon={<GearIcon size={largeSize} />}
						px={3.5}
						py={1}
						onPress={() => setOpenSettings(true)}
					/>
					<IconButton
						colorScheme="secondary"
						variant="solid"
						icon={/* TO-DO: Copy code */ <CopyIcon size={largeSize} />}
						px={3.5}
						py={1}
					/>
					<Menu
						placement="bottom right"
						trigger={(props) => (rawWords.length > 0 ?
							<IconButton
								colorScheme="secondary"
								variant="solid"
								icon={<SaveIcon size={largeSize} />}
								px={3.5}
								py={1}
								{...props}
							/> // TO-DO: Wrap this in a ReAnimated component
						:
							<></> // Only show this button when there are words to save.
						)}
					>
						<Menu.Item
							onPress={() => setChooseWhereToSaveInLex(true)}
						>Save All to Lexicon</Menu.Item>
						<Menu.Item
							onPress={() => toggleSaveSomeToLex()}
						>Choose What to Save</Menu.Item>
					</Menu>
				</HStack>
			</HStack>
			{(showLoadingScreen ?
				[<LoadingScreen key="loadingScreen" />]
			:
				[]
			)}
			{(displayedText ?
				[<PseudoText key="pseudoText" />]
			:
				[]
			)}
			{(displayedWords.length > 0 ?
				[<WordList key="wordList" />]
			:
				[]
			)}
		</VStack>
	);
};

export default WGOutput;

// TO-DO: put this in its own component for WE to use when needed
const calculateCategoryReferenceRegex = (transformer, mapObj) => {
	// Check transformations for %Category references
	// %% condenses to %, so split on those to begin with.
	let broken = transformer.split("%%");
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

