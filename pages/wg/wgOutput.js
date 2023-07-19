import {
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
import React, {
	useEffect,
	useState,
	Fragment,
	useCallback,
	memo,
	useRef
} from "react";
import { useWindowDimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router";
import { FlatGrid } from 'react-native-super-grid';
import { setStringAsync as setClipboard } from 'expo-clipboard';
import { AnimatePresence, MotiView } from "moti";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
	CancelIcon,
	CloseCircleIcon,
	CloseIcon,
	CopyIcon,
	GearIcon,
	GenerateIcon,
	OkIcon,
	SaveIcon,
	SortEitherIcon
} from "../../components/icons";
import calculateCharacterGroupReferenceRegex from "../../helpers/calculateCharacterGroupReferenceRegex";
import { fontSizesInPx } from "../../store/appStateSlice";
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
import { DropDown, RangeSlider, ToggleSwitch } from "../../components/inputTags";
import { addMultipleItemsAsColumn } from "../../store/lexiconSlice";
import doToast from "../../helpers/toast";
import getSizes from "../../helpers/getSizes";
import { flipFlop, fromToZero } from "../../helpers/motiAnimations";

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
	const dispatch = useDispatch();
	const [alertCannotGenerate, setAlertCannotGenerate] = useState(false);
	const [alertMsg, setAlertMsg] = useState("");

	const [displayedWords, setDisplayedWords] = useState([]);
	const [longestWordSizeEstimate, setLongestWordSizeEstimate] = useState(undefined);
	const [displayedText, setDisplayedText] = useState(false);
	const [showLoadingScreen, setShowLoadingScreen] = useState(false);
	const [rawWords, setRawWords] = useState([]);
	const [output, setOutput] = useState("text");
	const [buttonWidth, setButtonWidth] = useState(0);
	const [showSaveButton, setShowSaveButton] = useState(false);

	const [savingToLexicon, setSavingToLexicon] = useState(false);
	const [wordsToSave, setWordsToSave] = useState({});
	const [chooseWhereToSaveInLex, setChooseWhereToSaveInLex] = useState(false);
	const [whereToSaveInLex, setWhereToSaveInLex] = useState(columns.length > 0 ? columns[0] : {label: "No columns"});
	const [alertNothingToSave, setAlertNothingToSave] = useState(false);

	const [charGroupMap, setCharGroupMap] = useState({});
	const [transformsWithRegExps, setTransformsWithRegExps] = useState([]);

	const [openSettings, setOpenSettings] = useState(false);
	const [
		textSize,
		descSize,
		headerSize,
		largeSize,
		giantSize
	] = getSizes("sm", "xs", "md", "lg", "x2");
	const emSize = fontSizesInPx[textSize] || fontSizesInPx.xs;
	const [appHeaderHeight, viewHeight, tabBarHeight, navigate] = useOutletContext();
	const getRandomPercentage = (max = 100) => Math.random() * max;
	const { width } = useWindowDimensions();
	const toast = useToast();
	const primaryContrast = useContrastText("primary.500");
	const secondaryContrast = useContrastText("secondary.500");
	const tertiaryContrast = useContrastText("tertiary.500");
	const saveToLexRef = useRef(null);


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
				regex = calculateCharacterGroupReferenceRegex(search, newMap);
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
	const Simple = memo((props) => <Text fontSize={textSize} lineHeight={headerSize} {...props} />);
	const makeKey = useCallback((item, i) => `${item.rawWord}/${item.text}/${i}`, []);
	const renderItem = useCallback(({item}) => {
		const {text, rawWord} = item;
		if(savingToLexicon) {
			return <SaveableElement text={text} rawWord={rawWord} wordsToSave={wordsToSave} />;
		}
		return <Simple fontSize={textSize} lineHeight={headerSize}>{text}</Simple>;
	}, [savingToLexicon, wordsToSave, headerSize, textSize]);
	const PseudoText = memo(({text, saving, fontSize, lineHeight}) => {
		const stuff = text.map((word, i) => {
			// Add trailing space to every word.
			const [text, raw] = word;
			if(saving) {
				return (
					<Fragment
						key={`GeneratedWord-Saveable-${i}:[${raw}]`}
					><SaveableElement
						text={text}
						rawWord={raw}
						wordsToSave={wordsToSave}
					/>{" "}</Fragment>
				);
			}
			return (
				<Fragment
					key={`GeneratedWord-Simple-${i}:[${raw}]`}
				><Simple>{text}</Simple>{" "}</Fragment>
			);
		});
		return <Text fontSize={fontSize} lineHeight={lineHeight}>{stuff}</Text>;
	});
	const SaveableElement = memo(({text, rawWord, wordsToSave}) => {
		const saved = wordsToSave[rawWord];
		const onPressWord = useCallback(() => {
			let newSave = {...wordsToSave}
			newSave[rawWord] = !wordsToSave[rawWord];
			setWordsToSave(newSave);
		}, [rawWord, wordsToSave]);
		const Item = memo(({text, raw, saved, onPress}) => {
			let bg = "secondary.500",
				color = secondaryContrast;
			if(saved) {
				bg = "primary.500";
				color = primaryContrast;
			}
			return (
				<Pressable
					onPress={onPress}
					key={`Pressable${raw}/${text}`}
					bg={bg}
				><Simple color={color}>{text}</Simple></Pressable>
			);
		});
		return <Item text={text} raw={rawWord} onPress={onPressWord} saved={saved} />;
	});


	// // //
	// Clipboard
	// // //
	const copyAllToClipboard = () => {
		let final = "";
		if(displayedText) {
			final = displayedText.map(dt => dt[0]).join(" ");
		} else if(displayedWords.length > 0) {
			final = displayedWords.map(dw => dw.text).join("\n");
		} else {
			// Nothing to copy
			return doToast({
				toast,
				msg: "Nothing to copy!",
				position: "top",
				scheme: "error"
			});
		}
		// Add to clipboard
		setClipboard(final).then(() => {
			// success toast
			doToast({
				toast,
				msg: "Output has been copied to the clipboard",
				position: "top",
				scheme: "success"
			});
		}).catch((err) => {
			console.log("Copy to clipboard error");
			console.log(err);
		});
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
		setTimeout(() => {
			if (output === "text") {
				generatePseudoText();
			} else if (output === "syllables") {
				generateEverySyllable();
			} else {
				generateWordList();
			}
		}, 500);
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
			// Determine sentence type
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
			// Determine how many words in this sentence
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
			// Generate the first word
			const [firstWord, raw] = makeOneWord();
			if(!rawWordRecord[raw]) {
				rawWordRecord[raw] = true;
				rawWords.push(raw);
			}
			// Save first word (plus sentence starter, if any)
			text.push([(PRE || "") + (capitalizeSentences ? doCap(firstWord) : firstWord), raw]);
			// Generate remaining words in sentence
			for(let n = 2; n <= maxWords; n++) {
				let duo = makeOneWord();
				let raw = duo[1];
				if(!rawWordRecord[raw]) {
					rawWordRecord[raw] = true;
					rawWords.push(raw);
				}
				text.push(duo);
			}
			// Add sentence ender, if any
			if(POST) {
				let end = text.pop();
				end[0] += POST;
				text.push(end);
			}
		}
		setShowLoadingScreen(false);
		setDisplayedText(text);
		setRawWords(rawWords);
		// mark that we've evolved
		if (!showSaveButton) {
			setShowSaveButton(true);
		}
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
		setDisplayedWords(everySyllable.map(syl => {
			return {
				text: syl,
				rawWord: syl
			};
		}));
		setRawWords(everySyllable);
		// mark that we've evolved
		if (!showSaveButton) {
			setShowSaveButton(true);
		}
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
			words.push({
				text: capitalizeWords ? doCap(candidate) : candidate,
				rawWord: raw
			});
			raws.push(raw);
		}
		// Sort if needed
		//TO-DO: Find replacement for Intl.Collator?
		if(sortWordlist) {
//			words.sort(new Intl.Collator("en", { sensitivity: "variant" }).compare);
			words.sort((a, b) => a.rawWord.localeCompare(b.rawWord, "en", { sensitivity: "variant" }));
		}
		setShowLoadingScreen(false);
		determineColumnSize(words.map(w => w.text));
		setDisplayedWords(words);
		setRawWords(raws);
		// mark that we've evolved
		if (!showSaveButton) {
			setShowSaveButton(true);
		}
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
			setWordsToSave({});
		} else {
			// we're beginning to save, so set up wordsToSave
			let rawObj = {};
			rawWords.forEach(word => rawObj[word] = false);
			setWordsToSave(rawObj);
		}
		setSavingToLexicon(!savingToLexicon);
		doToast({
			toast,
			scheme,
			msg,
			placement: "top-right",
			duration,
			boxProps: {
				maxWidth: (width * 2 / 5)
			},
			center: true
		});
	};
	const findWordsToSave = () => {
		if(savingToLexicon) {
			// Return only chosen values
			return rawWords.filter(word => wordsToSave[word]);
		}
		// Return all values
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
						icon={<CloseIcon color="success.50" size={descSize} />}
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
		setSavingToLexicon(false);
	};


	// // //
	// JSX
	// // //
	const LoadingScreen = memo(({size}) => {
		return (
			<MotiView
				{...fromToZero(
					{
						opacity: 1
					},
					100
				)}
				style={{flex: 1, width}}
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
					<Text fontSize={size}>Generating...</Text>
					<Spinner size="lg" color="primary.500" />
				</HStack>
			</MotiView>
		);
	});

	const outputOptions = [
		{
			key: "text",
			value: "text",
			label: "Pseudo-Text"
		},
		{
			key: "wordlist",
			value: "wordlist",
			label: "List of Words"
		},
		{
			key: "syllables",
			value: "syllables",
			label: "Every possible syllable"
		}
	];

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
					setWordsToSave({});
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
					<Modal.Body><GestureHandlerRootView>
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
						<Box mb={1} pt={2}>
							<Text fontSize={textSize}>Sentences per text:</Text>
						</Box>
						<RangeSlider
							min={1}
							max={100}
							value={sentencesPerText}
							minimumLabel="1"
							maximumLabel="100"
							fontSize={descSize}
							notFilled
							label="Sentences per pseudo-text"
							onChange={(v) => dispatch(setSentencesPerText(v))}
							labelWidth={3}
							showValue={1}
							xPadding={24}
							modalPaddingInfo={{
								maxWidth: 580,
								sizeRatio: 0.9
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
						<Box mb={1} pt={2}>
							<Text fontSize={textSize}>Words per wordlist:</Text>
						</Box>
						<RangeSlider
							min={50}
							max={1000}
							value={wordsPerWordlist}
							minimumLabel="50"
							maximumLabel="1000"
							fontSize={descSize}
							notFilled
							label="Words per worlist"
							onChange={(v) => dispatch(setWordsPerWordlist(v))}
							ValueContainer={
								(props) => <Text noOfLines={1} letterSpacing="sm" isTruncated={false} lineHeight={descSize} sub textAlign="center" fontSize={descSize} color="secondary.50">{props.children}</Text>
							}
							labelWidth={3}
							showValue={1}
							xPadding={24}
							modalPaddingInfo={{
								maxWidth: 580,
								sizeRatio: 0.9
							}}
						/>
					</GestureHandlerRootView></Modal.Body>
					<Modal.Footer>
						<HStack justifyContent="flex-end" w="full" p={1}>
							<Button
								startIcon={<OkIcon size={textSize} />}
								_text={{fontSize: textSize}}
								px={2}
								py={1}
								onPress={() => setOpenSettings(false)}
							>Done</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<Modal isOpen={chooseWhereToSaveInLex} initialFocusRef={saveToLexRef}>
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
							<Text textAlign="center" fontSize={textSize}>Choose which Lexicon column to save the words to:</Text>
							{columns.length <= 0 ?
								<Box
									bg="error.800"
									borderColor="error.500"
									borderWidth={2}
									px={4}
									py={2}
								>
									<Text color="error.50" textAlign="center" fontSize={textSize}>There are no columns in the Lexicon. You must have at least one column in order to save anything.</Text>
								</Box>
							:
								<DropDown
									fontSize={textSize}
									labelFunc={() => whereToSaveInLex.label}
									color={secondaryContrast}
									onChange={(v) => setWhereToSaveInLex(v)}
									defaultValue={whereToSaveInLex}
									title="Choose a Column:"
									options={columns.map((item) => {
										const {id, label} = item;
										return {
											key: `${id}-LexColumn`,
											value: item,
											label
										};
									})}
									startIcon={
										<SortEitherIcon
											mx={1}
											size={descSize}
											color={secondaryContrast}
											flexGrow={0}
											flexShrink={0}
										/>
									}
									buttonProps={{
										px: 2,
										py: 1,
										ml: 0,
										mr: 0
									}}
								/>
							}
						</VStack>
					</Modal.Body>
					<Modal.Footer>
						<HStack
							justifyContent="space-between"
							w="full"
							p={1}
							flexWrap="wrap"
							alignContent="center"
						>
							<Button
								startIcon={<CancelIcon size={textSize} />}
								_text={{fontSize: textSize}}
								px={2}
								py={1}
								colorScheme="danger"
								onPress={() => {
									setChooseWhereToSaveInLex(false);
									setSavingToLexicon(false);
									setChooseWhereToSaveInLex(false);
									setWordsToSave({});
								}}
							>Quit Saving</Button>
							<Button
								startIcon={<CloseCircleIcon color="text.50" size={textSize} />}
								bg="darker"
								_text={{ color: "text.50", fontSize: textSize }}
								px={2}
								py={1}
								onPress={() => setChooseWhereToSaveInLex(false)}
								ref={saveToLexRef}
							>Go Back</Button>
							<Button
								startIcon={<SaveIcon size={textSize} />}
								_text={{fontSize: textSize}}
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
					<DropDown
						fontSize={textSize}
						labelFunc={() => {
							let opt;
							outputOptions.some(o => {
								if(o.value === output) {
									opt = o.label;
									return true;
								}
								return false;
							});
							return opt || "ERROR";
						}}
						buttonProps={{
							py: 1,
							pr: 3,
							pl: 2,
							flexShrink: 2,
							ml: 0,
							mr: 0
						}}
						onChange={(v) => setOutput(v)}
						defaultValue={output}
						title="Display:"
						options={outputOptions}
						bg="tertiary.500"
						color={tertiaryContrast}
					/>
					<Button
						_text={{
							fontSize: largeSize,
							letterSpacing: 1.5
						}}
						pl={5}
						pr={4}
						py={1.5}
						endIcon={savingToLexicon ?
							<SaveIcon ml={1} size={largeSize} />
						:
							<GenerateIcon ml={1} size={largeSize} />
						}
						colorScheme={savingToLexicon ? "success" : "primary"}
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
				<HStack flexWrap="wrap">
					<IconButton
						colorScheme="secondary"
						variant="solid"
						icon={<GearIcon size={textSize} />}
						px={3.5}
						py={1}
						mr={2}
						onPress={() => setOpenSettings(true)}
					/>
					<IconButton
						colorScheme="secondary"
						variant="solid"
						icon={<CopyIcon size={textSize} />}
						px={3.5}
						py={1}
						mr={2}
						onPress={copyAllToClipboard}
						onLayout={(event) => {
							// This sets up the width of the button that appears later
							if(!buttonWidth) {
								const {width} = event.nativeEvent.layout;
								setButtonWidth(width);
							}
						}}
					/>
					<Menu
						placement="bottom right"
						trigger={(props) => (rawWords.length > 0 && // Only show this button when there are words to save.
							<MotiView
								key="saveMenu"
								animate={
									showSaveButton ?
										{
											width: buttonWidth,
											translateX: 0,
											rotateY: "0deg"
										}
									:
										{
											width: 0,
											translateX: buttonWidth,
											rotateY: "90deg"
										}
								}
								transition={{
									type: "timing",
									duration: 300
								}}
								style={{
									overflow: "hidden"
								}}
							>
								<IconButton
									colorScheme="secondary"
									variant="solid"
									icon={<SaveIcon size={textSize} />}
									px={3.5}
									py={1}
									{...props}
								/>
							</MotiView>
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
			<AnimatePresence exitBeforeEnter>
				{(showLoadingScreen &&
					<LoadingScreen key="loadingScreen" size={giantSize} />
				)}
				{(displayedText &&
					<MotiView
						{...flipFlop(
							{
								translateX: width / 2
							},
							{
								scaleY: 1,
								opacity: 1
							},
							250
						)}
						style={{flex: 1}}
					>
						<ScrollView>
							<PseudoText
								text={displayedText}
								saving={savingToLexicon}
								fontSize={textSize}
								lineHeight={headerSize}
							/>
						</ScrollView>
					</MotiView>
				)}
				{(displayedWords.length > 0 &&
					<MotiView
						{...flipFlop(
							{
								translateX: width / -2
							},
							{
								opacity: 1
							},
							250
						)}
						style={{flex: 1}}
					>
						<FlatGrid
							renderItem={renderItem}
							data={displayedWords}
							itemDimension={longestWordSizeEstimate}
							keyExtractor={makeKey}
							style={{
								paddingVertical: 0,
								paddingHorizontal: 16
							}}
							spacing={emSize}
						/>
					</MotiView>
				)}
			</AnimatePresence>
		</VStack>
	);
};

export default WGOutput;

