import {
	VStack,
	Text,
	HStack,
	Spinner,
	useContrastText,
	Modal,
	Pressable,
	Box,
	Menu,
	FlatList,
	useToast
} from "native-base";
import React, {
	useEffect,
	useState,
	useCallback,
	memo,
	useRef
} from "react";
import { useWindowDimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router";
import { FlatGrid } from 'react-native-super-grid';
import escapeRegexp from "escape-string-regexp";
import { setStringAsync as setClipboard } from 'expo-clipboard';
import { AnimatePresence, MotiView } from "moti";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

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
import Button from "../../components/Button";
import IconButton from "../../components/IconButton";
import uuidv4 from '../../helpers/uuidv4';
import calculateCharacterGroupReferenceRegex from "../../helpers/calculateCharacterGroupReferenceRegex";
import { fontSizesInPx } from "../../store/appStateSlice";
import StandardAlert from "../../components/StandardAlert";
import { DropDown, ToggleSwitch } from "../../components/inputTags";
import { addMultipleItemsAsColumn } from "../../store/lexiconSlice";
import doToast from "../../helpers/toast";
import { setFlag, setOutput } from "../../store/weSlice";
import getSizes from "../../helpers/getSizes";

const WGOutput = () => {
	const {
		input,
		characterGroups,
		transforms,
		soundChanges,
		settings: {
			outputStyle,
			multicolumn,
			inputLower,
			inputAlpha
		}
	} = useSelector(state => state.we);
	const columns = useSelector(state => state.lexicon.columns);
	const dispatch = useDispatch();
	const [alertCannotEvolve, setAlertCannotEvolve] = useState(false);
	const [alertMsg, setAlertMsg] = useState("");

	const [nextAnimations, setNextAnimations] = useState(false);

	const [longestWordSizeEstimate, setLongestWordSizeEstimate] = useState(undefined);
	const [longestEvolvedWordSizeEstimate, setLongestEvolvedWordSizeEstimate] = useState(undefined);
	const outputStyles = [
		{
			key: "output",
			value: "output",
			label: "Output only"
		},
		{
			key: "rules",
			value: "rules",
			label: "Output with Rules"
		},
		{
			key: "inputoutput",
			value: "inputoutput",
			label: "Input ⟶ Output"
		},
		{
			key: "outputinput",
			value: "outputinput",
			label: "Output ⟵ Input"
		}
	];
	const [outputWords, setOutputWords] = useState([]);
	const [inputOutputWords, setInputOutputWords] = useState([]);
	const [outputInputWords, setOutputInputWords] = useState([]);
	const [rulesWords, setRulesWords] = useState([]);
	const [saveableWords, setSaveableWords] = useState([]);
	const [showSaveButton, setShowSaveButton] = useState(false);
	const [buttonWidth, setButtonWidth] = useState(0);

	const [savingToLexicon, setSavingToLexicon] = useState(false);
	const [wordsToSave, setWordsToSave] = useState({});
	const [chooseWhereToSaveInLex, setChooseWhereToSaveInLex] = useState(false);
	const [whereToSaveInLex, setWhereToSaveInLex] = useState(columns.length > 0 ? columns[0] : {label: "No columns"});
	const [alertNothingToSave, setAlertNothingToSave] = useState(false);

	const [charGroupMap, setCharGroupMap] = useState({});
	const [transformsAsRegExps, setTransformsAsRegExps] = useState({});
	const [soundChangesInterpreted, setSoundChangesInterpreted] = useState({});

	const [openSettings, setOpenSettings] = useState(false);

	const [
		textSize,
		descSize,
		headerSize,
		largeSize
	] = getSizes("sm", "xs", "md", "lg");
	const emSize = fontSizesInPx[textSize] || fontSizesInPx.xs;
	const spinnerSize = fontSizesInPx[largeSize] || fontSizesInPx.lg;
	const headerHeight =
		36 // Combination of padding
		+ (fontSizesInPx[textSize] || fontSizesInPx.sm)
		+ (fontSizesInPx[largeSize] || fontSizesInPx.lg)
		+ 64 // Extra padding;
	const [appHeaderHeight, viewHeight, tabBarHeight, navigate] = useOutletContext();
	const lowerHeight = viewHeight - headerHeight;
	const { width } = useWindowDimensions();

	const loadingOpacity = useSharedValue(0);
	const inputOutputTranslateX = useSharedValue(width / 2);
	const inputOutputScale = useSharedValue(0);
	const inputOutputOpacity = useSharedValue(0);
	const outputInputTranslateX = useSharedValue(width / -2);
	const outputInputScale = useSharedValue(0);
	const outputInputOpacity = useSharedValue(0);
	const rulesTranslateX = useSharedValue(width / 2);
	const rulesScale = useSharedValue(0);
	const rulesOpacity = useSharedValue(0);
	const outputTranslateY = useSharedValue(headerHeight);
	const outputOpacity = useSharedValue(0);
	const [inputOutputVisible, setInputOutputVisible] = useState(false);
	const [outputInputVisible, setOutputInputVisible] = useState(false);
	const [rulesVisible, setRulesVisible] = useState(false);
	const [outputVisible, setOutputVisible] = useState(false);

	const toast = useToast();
	const primaryContrast = useContrastText("primary.500");
	const secondaryContrast = useContrastText("secondary.500");
	const saveToLexInitialRef = useRef(null);
	const choosingWhatToSaveInitialRef = useRef(null);
	const arrowLR = "⟶";
	const arrowRL = "⟵";

	const copyAllToClipboard = () => {
		const info = [];
		if(outputWords) {
			info.push(...outputWords.map(ew => ew[0]));
		} else if(rulesWords) {
			rulesWords.forEach(oerw => {
				const [o, e, i, se, r] = oerw;
				info.push(`${o} ${arrowLR} ${e}`);
				r.forEach(rr => {
					const [newWord, search, arrow, replace, ...others] = rr;
					info.push(`\t${search}${arrow}${replace}${others.join("")} ${arrowLR} ${newWord}`);
				});
			});
		} else if(outputInputWords) {
			info.push(...outputInputWords.map(eow => `${eow[0]} ${arrowRL} ${eow[1]}`));
		} else if(inputOutputWords) {
			info.push(...inputOutputWords.map(eow => `${eow[0]} ${arrowLR} ${eow[1]}`));
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
		setClipboard(info.join("\n")).then(() => {
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

	const toggleSaveToLex = (flag = !savingToLexicon) => {
		if(flag) {
			// we're beginning to save, so set up wordsToSave
			const rawObj = {};
			saveableWords.forEach(word => rawObj[word] = false);
			setWordsToSave(rawObj);
		} else {
			// Remove any saved words
			setWordsToSave({});
		}
		setSavingToLexicon(flag);
	};
	const findWordsToSave = () => {
		if(savingToLexicon) {
			// Return only chosen values
			return saveableWords.filter(word => wordsToSave[word]);
		}
		// Return all values
		return saveableWords;
	};
	const maybeSaveToLex = () => {
		const words = findWordsToSave();
		if(words.length > 0) {
			setChooseWhereToSaveInLex(true);
		} else {
			setSavingToLexicon(false);
			doToast({
				toast,
				placement: "top",
				durarion: 350,
				msg: "You didn't choose any words to save.",
				fontSize: textSize,
				scheme: "error",
				center: true
			})
		}
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
						variant="ghost"
						scheme="success"
						icon={<CloseIcon size={descSize} />}
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
						scheme="success"
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
		setSavingToLexicon(false);
		setChooseWhereToSaveInLex(false);
	};
	const renderWordToSave = (word, i) => {
		const flag = wordsToSave[word];
		const toggle = () => {
			const newWords = {...wordsToSave};
			newWords[word] = !flag;
			setWordsToSave(newWords);
		};
		const bg = flag ? "success.500" : "secondary.500";
		const fg = flag ? "success.50" : secondaryContrast;
		const Inner = ({isPressed}) => {
			const color = isPressed ? "main.900" : fg;
			return (
				<Box
					bg={bg}
					px={2}
					py={1}
					mx={2}
					my={1}
				>
					<Text textAlign="center" color={color} fontSize={textSize}>{word}</Text>
				</Box>
			);
		};
		return <Pressable onPress={toggle} key={`saveable/${word}/${i}`} children={(props) => <Inner {...props} />} />;
	};

	// TO-DO: Figure out why text isn't selectable!!!!

	// // //
	// Juggle Animations
	// // //
	useEffect(() => {
		// When nextAnimations changes, trigger the next set of animations
		if(!nextAnimations) {
			return;
		}
		const [callback, ...sequence] = nextAnimations;
		while(sequence.length > 0) {
			const next = sequence.shift();
			const {
				duration,
				delay,
				easing,
				changes
			} = animationFunctions[next]();
			const options = { duration, easing };
			while(changes.length > 0) {
				const [variable, value] = changes.shift();
				let func;
				// Drop callback into last change of last sequence
				if(callback && sequence.length === 0 && changes.length === 0) {
					func = withTiming(value, options, () => runOnJS(animationCallbacks[callback])());
				} else {
					func = withTiming(value, options);
				}
				// Add delay if needed
				if(delay) {
					func = withDelay(delay, func);
				}
				variable.value = func;
			}
		}
		// callback should result in a change of nextAnimations (if needed)
	}, [nextAnimations])
	const doAnimationSequence = (phase, what) => {
		const sequence = [];
		if(phase === "begin") {
			// mark callback
			sequence.push("doTheEvolution");
			// check for anything visible
			if(inputOutputOpacity.value > 0) {
				// Currently showing text
				sequence.push("blankInputOutput");
			} else if(outputInputOpacity.value > 0) {
				// Currently showing words
				sequence.push("blankOutputInput");
			} else if(rulesOpacity.value > 0) {
				// Currently showing words
				sequence.push("blankRules");
			} else if(outputOpacity.value > 0) {
				// Currently showing words
				sequence.push("blankOutput");
			}
			// show loading
			sequence.push("showLoading");
		} else if (phase === "continue") {
			sequence.push(
				"clear",       // callback to remove the stored info
				"hideLoading", // hide loading
				what           // show section
			);
		} else {
			console.log("BAD PHASE: " + phase);
			sequence.push(false);
		}
		// set up state
		setNextAnimations(sequence);
	};
	const animationFunctions = {
		showLoading: () => {
			return {
				duration: 100,
				easing: Easing.inOut(Easing.quad),
				changes: [
					[loadingOpacity, 1]
				]
			};
		},
		hideLoading: () => {
			return {
				duration: 300,
				easing: Easing.inOut(Easing.quad),
				changes: [
					[loadingOpacity, 0]
				]
			};
		},
		blankInputOutput: () => {
			return {
				duration: 250,
				easing: Easing.out(Easing.quad),
				changes: [
					[inputOutputTranslateX, width / 2],
					[inputOutputScale, 0],
					[inputOutputOpacity, 0]
				]
			};
		},
		inputoutput: () => {
			return {
				duration: 250,
				delay: 50,
				easing: Easing.in(Easing.quad),
				changes: [
					[inputOutputTranslateX, 0],
					[inputOutputScale, 1],
					[inputOutputOpacity, 1]
				]
			};
		},
		blankOutputInput: () => {
			return {
				duration: 250,
				easing: Easing.out(Easing.quad),
				changes: [
					[outputInputTranslateX, width / -2],
					[outputInputScale, 0],
					[outputInputOpacity, 0]
				]
			};
		},
		outputinput: () => {
			return {
				duration: 250,
				delay: 50,
				easing: Easing.in(Easing.quad),
				changes: [
					[outputInputTranslateX, 0],
					[outputInputScale, 1],
					[outputInputOpacity, 1]
				]
			};
		},
		blankRules: () => {
			return {
				duration: 250,
				easing: Easing.out(Easing.quad),
				changes: [
					[rulesTranslateX, width / 2],
					[rulesScale, 0],
					[rulesOpacity, 0]
				]
			};
		},
		rules: () => {
			return {
				duration: 250,
				delay: 50,
				easing: Easing.in(Easing.quad),
				changes: [
					[rulesTranslateX, 0],
					[rulesScale, 1],
					[rulesOpacity, 1]
				]
			};
		},
		blankOutput: () => {
			return {
				duration: 250,
				easing: Easing.out(Easing.quad),
				changes: [
					[outputTranslateY, lowerHeight],
					[outputOpacity, 0]
				]
			};
		},
		output: () => {
			return {
				duration: 250,
				delay: 50,
				easing: Easing.in(Easing.quad),
				changes: [
					[outputTranslateY, 0],
					[outputOpacity, 1]
				]
			};
		}
	};
	const animationCallbacks = {
		clear: () => setNextAnimations(false),
		doTheEvolution: () => doTheEvolution()
	};

	const loadingTransforms = useAnimatedStyle(() => ({
		opacity: loadingOpacity.value
	}));
	const inputOutputTransforms = useAnimatedStyle(() => ({
		transform: [
			{ translateX: inputOutputTranslateX.value },
			{ scale: inputOutputScale.value }
		],
		opacity: inputOutputOpacity.value
	}));
	const outputInputTransforms = useAnimatedStyle(() => ({
		transform: [
			{ translateX: outputInputTranslateX.value },
			{ scale: outputInputScale.value }
		],
		opacity: outputInputOpacity.value
	}));
	const rulesTransforms = useAnimatedStyle(() => ({
		transform: [
			{ translateX: rulesTranslateX.value },
			{ scale: rulesScale.value }
		],
		opacity: rulesOpacity.value
	}));
	const outputTransforms = useAnimatedStyle(() => ({
		transform: [
			{ translateY: outputTranslateY.value }
		],
		opacity: outputOpacity.value
	}));


	// // //
	// Convenience Variables
	// // //
	useEffect(() => {
		let newMap = {};
		// Set up an easy-to-search map of character groups
		characterGroups.forEach(group => (newMap[group.label] = group));
		setCharGroupMap(newMap);
	}, [characterGroups]);

	useEffect(() => {
		let newTransforms = {};
		// Create a new array of transforms, with RegExps included
		// Check transforms for %CharacterGroup references and save as RegExp objects
		transforms.forEach((rule) => {
			const { id, search } = rule;
			const regex =
				(search.indexOf("%") !== -1) ?
					// Found a possibility.
					calculateCharacterGroupReferenceRegex(search, charGroupMap)
				:
					new RegExp(search, "g")
			;
			newTransforms[id] = regex;
		});
		setTransformsAsRegExps(newTransforms);
	}, [charGroupMap, transforms]);

	useEffect(() => {
		let newSoundChanges = {};
		// Go through a from/to string and check for character groups and
		//   other regex stuff. Returns an array.
		const interpretFromAndTo = (input) => {
			let rules = [];
			let assembly;
			let fromTo = "",
				backslash = false,
				curly = false,
				square = false;
			input.split("").forEach(function(q) {
				// If we previously had a backslash, add it to this element.
				if (backslash) {
					backslash = false;
					fromTo += "\\" + q;
				// If we discover a backslash, set up for the next loop.
				} else if (q === "\\") {
					backslash = true;
					return;
				// If we previously had a square brace, keep looking for its matching end.
				} else if (square) {
					if (q === "]") {
						// Found it.
						square = false;
					}
					fromTo += q;
				// If we discover a square brace, pause lookups until we find its end.
				} else if (q === "[") {
					square = true;
					fromTo += q;
				// If we previously had a curly brace, keep looking for its matching end.
				} else if (curly) {
					if (q === "}") {
						// Found it.
						curly = false;
					}
					fromTo += q;
				// If we discover a curly brace, pause lookups until we find its end.
				} else if (q === "{") {
					curly = true;
					fromTo += q;
				// Otherwise, treat as plain text (and possibly character group or regex).
				} else {
					fromTo += q;
				}
			});
			// Check for and insert missing end braces.
			if (square) {
				rules.push("]");
			}
			if (curly) {
				rules.push("}");
			}
			// Now look for character groups
			const double = uuidv4().replace(/[%!]/g,"x");
			const negate = uuidv4().replace(/[%!]/g,"x");
			// Hide %%
			fromTo.replace(/%%/g, double);
			// Character group negations
			assembly = fromTo.split("!%");
			fromTo = assembly.shift();
			assembly.forEach(unit => {
				const q = unit[0];
				const cg = charGroupMap[q];
				if(cg !== undefined) {
					// Character group found - negation, so do not make into Array
					fromTo += "[^" + cg.run + "]" + unit.slice(1);
				} else {
					// Hide !%
					fromTo += negate + unit;
				}
			});
			// Character Groups
			assembly = fromTo.split("%");
			rules.push(assembly.shift());
			assembly.forEach(unit => {
				const q = unit[0];
				const cg = charGroupMap[q];
				if(cg !== undefined) {
					// Character group found
					rules.push(cg.run.split(""), unit.slice(1));
				} else {
					rules.push("%" + unit);
				}
			});
			// Split strings, leave Arrays
			assembly = [...rules];
			rules = [];
			assembly.forEach(unit => {
				if(!unit) {
					// Skip!
				} else if(typeof unit === "string") {
					// Restore any hidden %% or !% strings
					// Add as individual characters
					const d = new RegExp(escapeRegexp(double), "g");
					const n = new RegExp(escapeRegexp(negate), "g");
					rules.push(...(unit.replace(d, "%%").replace(n, "!%")).split(""));
				} else {
					// Add as Array
					rules.push(unit);
				}
			});
			return rules;
		};
		// Check sound changes for %CharacterGroup references and
		//   update them if needed
		soundChanges.forEach((change) => {
			let {id, beginning, ending} = change;
			let characterGroupFlag = (change.beginning.indexOf("%") !== -1) && (change.ending.indexOf("%") !== -1)
			// BEGINNING
			let temp = change.beginning;
			if(characterGroupFlag) {
				beginning = interpretFromAndTo(temp);
				if(beginning.every(unit => typeof unit === "string")) {
					// No Arrays? No need for flag
					characterGroupFlag = false;
					beginning = new RegExp(beginning.join(""), "g");
				}
			} else {
				beginning = calculateCharacterGroupReferenceRegex(temp, charGroupMap);
			}
			// ENDING
			temp = change.ending;
			if(characterGroupFlag) {
				ending = interpretFromAndTo(temp);
				if(ending.every(unit => typeof unit === "string")) {
					// No Arrays? No need for flag
					characterGroupFlag = false;
					ending = ending.join("");
					// Need to run through beginning to get a single RegExp
					let temp = beginning.map(unit => typeof unit === "string" ? unit : "[" + unit.join("") + "]");
					beginning = new RegExp(temp.join(""), "g");
				}
			} else {
				ending = temp;
			}
			// CONTEXT
			temp = change.context.split("_");
			if(temp.length !== 2) {
				// Error. Treat as "_"
				temp = [null, null];
			} else {
				let [first, second] = temp;
				if(first) {
					if(first[0] === "#") {
						first = calculateCharacterGroupReferenceRegex("^" + first.slice(1) + "$", charGroupMap);
					} else {
						first = calculateCharacterGroupReferenceRegex(first + "$", charGroupMap);
					}
				} else {
					first = null;
				}
				if(second) {
					let t = "^" + second;
					if(t[t.length - 1] === "#") {
						second = calculateCharacterGroupReferenceRegex(t.slice(0, -1) + "$", charGroupMap);
					} else {
						second = calculateCharacterGroupReferenceRegex(t, charGroupMap);
					}
				} else {
					second = null;
				}
				temp = [first, second];
			}
			const context = temp;
			// ANTICONTEXT
			temp = (change.exception || "").split("_");
			if(temp.length !== 2) {
				// Error. Treat as "_"
				temp = [null, null];
			} else {
				let [first, second] = temp;
				if(first) {
					if(first[0] === "#") {
						first = calculateCharacterGroupReferenceRegex("^" + first.slice(1) + "$", charGroupMap);
					} else {
						first = calculateCharacterGroupReferenceRegex(first + "$", charGroupMap);
					}
				} else {
					first = null;
				}
				if (second) {
					let t = "^" + second;
					if(t[t.length - 1] === "#") {
						second = calculateCharacterGroupReferenceRegex(t.slice(0, -1) + "$", charGroupMap);
					} else {
						second = calculateCharacterGroupReferenceRegex(t, charGroupMap);
					}
				} else {
					second = null;
				}
				temp = [first, second];
			}
			const exception = temp;
			// SAVE
			newSoundChanges[id] = {
				beginning,
				ending,
				context,
				exception,
				characterGroupsFound: characterGroupFlag
			};
		});
		setSoundChangesInterpreted(newSoundChanges);
	}, [charGroupMap, soundChanges]);


	// // //
	// Display functions
	// // //
	const evolveOutput = () => {
		// Sanity check
		const err = [];
		let rawInput = input.split(/\n/);
		if(soundChanges.length < 1) {
			err.push("You have no sound changes defined.");
		} else if (rawInput.length < 1) {
			err.push("You have no input words to evolve.");
		}
		if(err.length > 0) {
			setAlertMsg(err.join(" "));
			setAlertCannotEvolve(true);
			return;
		}
		// Send off to begin the process
		doAnimationSequence("begin");
	};
	const doTheEvolution = () => {
		let rawInput = input.split(/\n/);
		// lowercase option
		if(inputLower) {
			rawInput = rawInput.map(word => word.toLowerCase());
		}
		// alphabetic-only option
		if(inputAlpha) {
			rawInput = rawInput.map(word => word.replace(/[^a-zA-Z]/g, ""));
		}
		const changedWords = changeTheWords(rawInput);
		const output = [];
		const changed = [];
		switch(outputStyle) {
			case "output":
				// format will be a simple array of strings
				// but we need to set up keys
				setOutputWords(changedWords.map((word, i) => [word, i]));
				changed.push(...changedWords);
				setOutputVisible(true);
				setOutputInputVisible(false);
				setInputOutputVisible(false);
				setRulesVisible(false);
				break;
			case "outputinput":
				// format will be an array of two-string arrays
				// [evolvedWord, originalWord]
				changedWords.forEach((bit, i) => {
					const [evolved, original] = bit;
					output.push([evolved, original, i]);
					changed.push(evolved);
				});
				setOutputInputWords(output);
				setOutputVisible(false);
				setOutputInputVisible(true);
				setInputOutputVisible(false);
				setRulesVisible(false);
				break;
			case "inputoutput":
				// format will be an array of two-string arrays
				// [originalWord, evolvedWord]
				changedWords.forEach((bit, i) => {
					const [original, evolved] = bit;
					output.push([original, evolved, i]);
					changed.push(evolved);
				});
				setInputOutputWords(output);
				setOutputVisible(false);
				setOutputInputVisible(false);
				setInputOutputVisible(true);
				setRulesVisible(false);
				break;
			case "rules":
				// [original, word, ...[[rule, new word]...]]
				changedWords.forEach((unit, i) => {
					const [original, evolved, rules] = unit;
					output.push([original, evolved, i, rules]);
					changed.push(evolved);
				});
				setRulesWords(output);
				setOutputVisible(false);
				setOutputInputVisible(false);
				setInputOutputVisible(false);
				setRulesVisible(true);
				break;
			default:
				console.log("Unknown error occurred.");
		}
		const inputLength = determineColumnSize(rawInput);
		const outputLength = determineColumnSize(changed);
		setLongestEvolvedWordSizeEstimate(Math.min(width / 2, outputLength));
		setLongestWordSizeEstimate(Math.min(width / 2, Math.max(inputLength, outputLength)));
		let testing = {};
		// mark that we've evolved
		if (!showSaveButton) {
			setShowSaveButton(true);
		}
		setSaveableWords(changed.filter(word => {
			if(testing[word]) {
				return false;
			}
			testing[word] = true;
			return true;
		}));
		doAnimationSequence("continue", outputStyle)
	};
	// Take an array of strings and apply each sound change rule
	//  to each string one at a time, then return an array
	//  according to the style requested
	const changeTheWords = (originalWords) => {
		let output = [];
		// Loop over every inputted word in order.
		originalWords.forEach((original) => {
			let rulesThatApplied = [];
			let word = original;
			// Loop over the transformations.
			transforms.forEach((tr) => {
				const {id, search, replace, direction} = tr;
				// Check to see if we apply this rule.
				if (direction === "input") {
					// regex possible
					word = word.replace(transformsAsRegExps[id].regex, replace);
				} else if (direction === "both" || direction === "double") {
					// regex not possible
					word = word.replace(search, replace);
				}
			});
			// Loop over every sound change in order.
			soundChanges.forEach((change) => {
				const {id, beginning, ending, context, exception} = change;
				const modified = soundChangesInterpreted[id];
				let previous = word;
				if(modified.characterGroupsFound) {
					// We have character group matches to deal with.
					const {beginning, ending, context, exception} = modified;
					let textBasic = "";
					let textCharacterGroup = "";
					const ids = [];
					beginning.forEach(ss => {
						if(typeof ss === "string") {
							textBasic = textBasic + ss;
							textCharacterGroup = textCharacterGroup + ss;
						} else {
							const id = "N" + uuidv4().replace(/[^a-zA-Z0-9]/g, "");
							const ssj = ss.join("");
							textBasic = textBasic + "[" + ssj + "]";
							textCharacterGroup = textCharacterGroup + "(?<" + id + ">[" + ssj + "])";
							ids.push([id, ssj]);
						}
					});
					// textBasic/CharacterGroup are the bases of RegExps
					let basicRegExp = new RegExp(textBasic, "g");
					let charGroupRegExp = new RegExp(textCharacterGroup, "g");
					basicRegExp.lastIndex = 0;
					charGroupRegExp.lastIndex = 0;
					let basicMatch = basicRegExp.exec(word);
					let charGroupMatch = charGroupRegExp.exec(word);
					let lastIndex = basicRegExp.lastIndex;
					while(basicMatch !== null && charGroupMatch !== null) {
						let okToReplace = true;
						// Hold on to the pre-match length of word.
						let prevLength = word.length;
						// m is an array: [full match, ...other matches]
						// beginning.lastIndex is the point right after the
						//   match
						// Therefore: word.slice(0, beginning.lastIndex) will
						//   be everything up to and including the match
						// Make sure our match doesn't match the exception
						// PLI = previous value of 'lastIndex' (or 0)
						// (a) = pre match
						// (b) = post match
						// m = entire match (a)x(b)
						// LI = current value of rule.lastIndex
						// . = other character(s) that may or may not exist
						// String is this: ...PLI...(a)x(b)LI...
						// temp needs to be matched with everything up to x.
						// temp itself needs to have x appended to it.
						// Make 'pre' into the matchable string: 0 to LI - (b).
						const pre = word.slice(0, basicMatch.index);
						const post = word.slice(basicMatch.index + basicMatch[0].length);
						// We do NOT want to match the exception
						if(exception.some(a => a)) {
							const [a, b] = exception;
							if(
								(a ? pre.match(a) : true)
								&& (b ? post.match(b) : true)
							) {
								// We matched the exception, so forget about this.
								okToReplace = null;
							}
						}
						// We DO want to match the context
						if(okToReplace && context.some(c => c)) {
							const [a, b] = context;
							if(
								!(!a || pre.match(a))
								|| !(!b || post.match(b))
							) {
								// We did not match the context, so forget about this.
								okToReplace = false;
							}
						}
						if(okToReplace) {
							// We can replace
							let replaceText = "";
							let i = 0;
							// replace character group matches
							const g = charGroupMatch.groups || {};
							ending.forEach(rr => {
								if(typeof rr === "string") {
									// ignore for now
									replaceText = replaceText + rr;
								} else {
									// replace one charGroup member with another
									const [id, run] = ids[i];
									i++;
									const ind = Math.max(0, run.indexOf(g[id]));
									replaceText = replaceText + rr[ind % rr.length];
								}
							});
							// run through remaining regexps
							const finalRegExp = new RegExp(escapeRegexp(pre) + textBasic);
							const finalReplace = pre.replace(/\$/g, "\\$") + replaceText;
							word = word.replace(finalRegExp, finalReplace);
							// adjust lastIndex
							basicRegExp.lastIndex = word.length - post.length;
						}
						if(basicMatch[0] === "" && (lastIndex === 0 || lastIndex === prevLength)) {
							// If the match didn't actually match anything, and it's at a position where it's likely
							//   to match the same nothing next time, just up and end the loop.
							basicMatch = null;
						} else {
							// Otherwise, check for more matches!
							basicMatch = basicRegExp.exec(word);
							lastIndex = basicRegExp.lastIndex;
							charGroupMatch = charGroupRegExp.exec(word);
						}
					}
				} else {
					// No special character group match handling
					const {beginning, ending, context, exception} = modified;
					// Reset lastIndex to prevent certain errors.
					beginning.lastIndex = 0;
					let m = beginning.exec(word);
					let lastIndex = beginning.lastIndex;
					while(m !== null) {
						let okToReplace = true;
						// Hold on to the pre-match length of word.
						let prevLength = word.length;
						// m is an array: [full match, ...other matches]
						// beginning.lastIndex is the point right after the
						//   match
						// Therefore: word.slice(0, beginning.lastIndex)
						//   will be everything up to and including the match
						// Make sure our match doesn't match the exception
						// PLI = previous value of 'lastIndex' (or 0)
						// (a) = pre match
						// (b) = post match
						// m = entire match (a)x(b)
						// LI = current value of rule.lastIndex
						// . = other character(s) that may or may not exist
						// String is this: ...PLI...(a)x(b)LI...
						// temp needs to be matched with everything up to x.
						// temp itself needs to have x appended to it.
						// Make 'pre' into the matchable string: 0 to LI - (b).
						const pre = word.slice(0, m.index);
						const post = word.slice(m.index + m[0].length);
						// We do NOT want to match the exception
						if(exception.some(a => a)) {
							const [a, b] = exception;
							if(
								(a ? pre.match(a) : true)
								&& (b ? post.match(b) : true)
							) {
								// We matched the exception, so forget about this.
								okToReplace = null;
							}
						}
						// We DO want to match the context
						if(okToReplace && context.some(c => c)) {
							const [a, b] = context;
							if(
								!(!a || pre.match(a))
								|| !(!b || post.match(b))
							) {
								// We did not match the context, so forget about this.
								okToReplace = false;
							}
						}
						if(okToReplace) {
							// We can replace
							if(m.length > 1) {
								// Handle parenthetical matches
								let rep = ending;
								let c = m.length;
								while(c >= 1) {
									// replaceAll is not a function??
									//rep = rep.replaceAll("$" + c.toString(), m[c]);
									rep = rep.split(`\$${c}`).join(m[c]);
									c--;
								}
								word = pre + rep + post;
								beginning.lastIndex = pre.length + rep.length;
							} else {
								word = pre + ending + post;
								beginning.lastIndex = pre.length + ending.length;
							}
						}
						if(
							m[0] === ""
							&& (
								lastIndex === 0
								|| lastIndex === prevLength
							)
						) {
							// If the match didn't actually match anything,
							//   and it's at a position where it's likely
							//   to match the same nothing next time, just
							//   up and end the loop.
							m = null;
						} else {
							// Otherwise, check for more matches!
							m = beginning.exec(word);
							lastIndex = beginning.lastIndex;
						}
					}
				}
				previous !== word
					&& outputStyle === "rules"
					&& rulesThatApplied.push([word, beginning, '➜', ending, ' / ', context, ...(exception ? [' ! ', exception] : [])]);
			});
			// Loop over the transforms again.
			transforms.forEach((tr) => {
				const {id, search, replace, direction} = tr;
				// Check to see if we apply this rule.
				if (direction === "both") {
					// regex not possible
					word = word.replace(replace, search);
				} else if (direction === "double") {
					// regex not possible
					word = word.replace(search, replace);
				} else if (direction === "output") {
					// regex possible
					word = word.replace(transformsAsRegExps[id].regex, replace);
				}
			});
			// Add the evolved word to the output list.
			let goingOut;
			switch(outputStyle) {
				case "output":
					goingOut = word;
					break;
				case "rules":
					goingOut = [original, word, rulesThatApplied];
					break;
				case "inputoutput":
					goingOut = [original, word];
					break;
				case "outputinput":
					goingOut = [word, original];
					break;
				default:
					goingOut = `ERROR [${outputStyle}] unknown`;
			}
			output.push(goingOut);
		});
		// Return the output.
		return output;
	}



	// // //
	// Estimate largest column width from given array of words
	// // //
	const determineColumnSize = (words) => {
		// Find length of longest word
		// (this will not be entirely correct if the word has two-character glyphs, but that's ok)
		const longestWord = words.length && Math.max(...words.map(w => w.length));
		// Estimate size of the longest word
		// The longer the word, the more likely it is that any particular
		//    character will be shorter than the max size
		let size = 0;
		for(let x = 0; x < longestWord; x++) {
			const percentage = Math.max(0.25, (100 - (x * 3.5)) / 100);
			size += (emSize * percentage);
		}
		//console.log(`${size} vs old size of ${emSize}*${longestWord} = ${emSize * longestWord}`);
		return size;
		//setDisplayedColumns(Math.max(1, Math.floor(viewport / longestWordLength)));
	};



	// // //
	// JSX
	// // //
	const renderInputOutput = useCallback(({item}) => {
		// inputOutputWords (flat list)
		const [original, evolved, i] = item;
		return (
			<HStack
				justifyContent="center"
				alignItems="center"
				flexWrap="wrap"
				p={2}
				w="full"
				bg={i % 2 ? "lighter" : "transparent"}
			>
				<Text selectable fontSize={textSize} lineHeight={headerSize} textAlign="left">{original} {arrowRL} {evolved}</Text>
			</HStack>
		);
	}, [headerSize, textSize]);
	const renderOutputInput = useCallback(({item}) => {
		// outputInputWords (flat list)
		const [evolved, original, i] = item;
		return (
			<HStack
				justifyContent="center"
				alignItems="center"
				flexWrap="wrap"
				p={2}
				w="full"
				bg={i % 2 ? "lighter" : "transparent"}
			>
				<Text selectable fontSize={textSize} lineHeight={headerSize} textAlign="left">{evolved} {arrowRL} {original}</Text>
			</HStack>
		);
	}, [headerSize, textSize]);
	const renderRules = useCallback(({item}) => {
		// rulesWords (flat list)
		const [original, evolved, i, rules] = item;
		return (
			<VStack
				justifyContent="flex-start"
				alignItems="flex-start"
				py={2}
				px={2}
				style={{width}}
				bg={i % 2 ? "lighter" : "transparent"}
			>
				<Text
					selectable
					textAlign="left"
					fontSize={textSize}
					lineHeight={headerSize}
				>{original} {arrowLR} {evolved}</Text>
				{rules.length > 0 &&
					<Box ml={10} flexWrap="wrap">
						<Text
							selectable
							textAlign="left"
							fontSize={textSize}
							lineHeight={headerSize}
						>{rules.map(r => {
							const [newWord, search, arrow, replace, ...others] = r;
							return `${search}${arrow}${replace}${others.join("")} ${arrowLR} ${newWord}`;
						}).join("\n")}</Text>
					</Box>
				}
			</VStack>
		);
	}, [headerSize, textSize]);
	const renderOutput = useCallback(({item}) => {
		// outputWords (grid)
		const [word, i] = item;
		return <Text selectable fontSize={textSize} lineHeight={headerSize}>{word}</Text>;
	}, [headerSize, textSize]);

	return (
		<VStack
			alignContent="flex-start"
			bg="main.900"
			style={{height: viewHeight}}
		>
			<StandardAlert
				alertOpen={alertCannotEvolve}
				setAlertOpen={setAlertCannotEvolve}
				headerContent="Cannot Generate"
				headerProps={{
					bg: "error.500"
				}}
				bodyContent={alertMsg}
				overrideButtons={[
					({leastDestructiveRef}) => <Button
						onPress={() => setAlertCannotEvolve(false)}
						ref={leastDestructiveRef}
						scheme="info"
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
				continueProps={{ scheme: "danger" }}
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
								icon={<CloseCircleIcon size={textSize} />}
								onPress={() => setOpenSettings(false)}
								scheme="primary"
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<ToggleSwitch
							hProps={{
								borderBottomWidth: 1,
								borderColor: "main.900",
								p: 2
							}}
							label="Render output in multiple columns"
							labelSize={textSize}
							desc="Only has an effect in Output-Only mode"
							descSize={descSize}
							descProps={{ color: "main.500" }}
							switchState={multicolumn}
							switchToggle={() => dispatch(setFlag(["multicolumn", !multicolumn]))}
						/>
						<ToggleSwitch
							hProps={{
								borderBottomWidth: 1,
								borderColor: "main.900",
								p: 2
							}}
							label="Convert input to lowercase before evolving"
							labelSize={textSize}
							desc="This is essentially an input-only Transform"
							descSize={descSize}
							descProps={{ color: "main.500" }}
							switchState={inputLower}
							switchToggle={() => dispatch(setFlag(["inputLower", !inputLower]))}
						/>
						<ToggleSwitch
							hProps={{
								borderBottomWidth: 1,
								borderColor: "main.900",
								p: 2
							}}
							label="Strip non-alphabetic characters before evolving"
							labelSize={textSize}
							desc="This is essentially an input-only Transform, and it will not work well with non-Latin scripts"
							descSize={descSize}
							descProps={{ color: "main.500" }}
							switchState={inputAlpha}
							switchToggle={() => dispatch(setFlag(["inputAlpha", !inputAlpha]))}
						/>
					</Modal.Body>
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
			<Modal isOpen={savingToLexicon} initialFocusRef={choosingWhatToSaveInitialRef}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center">
							<Text flex={1} px={3} fontSize={textSize} color={primaryContrast} textAlign="left">Save to Lexicon</Text>
							<IconButton
								flex={0}
								mr={3}
								icon={<CloseCircleIcon size={textSize} />}
								onPress={() => toggleSaveToLex(false)}
								scheme="primary"
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack alignItems="center" justifyContent="center" space={2}>
							<Text textAlign="center" fontSize={textSize}>Tap the words you want to save</Text>
							<HStack flexWrap="wrap" justifyContent="center" alignItems="center" alignContent="center">
								{saveableWords.map((word, i) => renderWordToSave(word, i))}
							</HStack>
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
								bg="darker"
								_text={{ color: "text.50", fontSize: textSize }}
								px={2}
								py={1}
								onPress={() => toggleSaveToLex(false)}
								scheme="primary"
								ref={choosingWhatToSaveInitialRef}
							>Cancel</Button>
							<Button
								startIcon={<SaveIcon size={textSize} />}
								_text={{fontSize: textSize}}
								px={2}
								py={1}
								onPress={maybeSaveToLex}
							>Save</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<Modal isOpen={chooseWhereToSaveInLex} initialFocusRef={saveToLexInitialRef}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center">
							<Text flex={1} px={3} fontSize={textSize} color={primaryContrast} textAlign="left">Save to Lexicon</Text>
							<IconButton
								flex={0}
								mr={3}
								scheme="primary"
								icon={<CloseCircleIcon size={textSize} />}
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
									onChange={(v) => setWhereToSaveInLex(v)}
									defaultValue={whereToSaveInLex}
									title="Output Display:"
									options={columns.map(col => {
										const {id, label} = col;
										return {
											key: id,
											value: col,
											label
										};
									})}
									startIcon={
										<SortEitherIcon
											mx={1}
											size={descSize}
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
								scheme="danger"
								onPress={() => {
									setChooseWhereToSaveInLex(false);
									setSavingToLexicon(false);
									setChooseWhereToSaveInLex(false);
									setWordsToSave({});
								}}
							>Quit Saving</Button>
							<Button
								startIcon={<CloseCircleIcon size={textSize} />}
								bg="darker"
								_text={{ fontSize: textSize }}
								color="text.50"
								scheme="primary"
								px={2}
								py={1}
								onPress={() => setChooseWhereToSaveInLex(false)}
								ref={saveToLexInitialRef}
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
				alignItems="center"
				maxW="full"
				p={6}
				space={2}
				bg="main.800"
				style={{
					height: headerHeight
				}}
			>
				<VStack
					alignItems="flex-start"
					justifyContent="center"
					space={4}
					style={{
						height: headerHeight
					}}
				>
					<DropDown
						fontSize={textSize}
						labelFunc={() => {
							let opt;
							outputStyles.some(o => {
								if(o.value === outputStyle) {
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
							ml: 0,
							mr: 0
						}}
						onChange={(v) => { nextAnimations || dispatch(setOutput(v)) }}
						defaultValue={outputStyle}
						title="Display:"
						options={outputStyles}
						scheme="tertiary"
					/>
					<Button
						_text={{
							fontSize: largeSize,
							letterSpacing: 1.5
						}}
						pl={5}
						pr={4}
						py={1.5}
						endIcon={<GenerateIcon ml={1} size={largeSize} />}
						scheme="primary"
						onPress={() => {
							if(nextAnimations) {
								return;
							} else {
								// Generate!
								evolveOutput();
							}
						}}
					>EVOLVE</Button>
				</VStack>
				<VStack
					alignItems="flex-end"
					justifyContent="center"
					flex={1}
					space={4}
					style={{
						height: headerHeight
					}}
				>
					<HStack flexWrap="wrap">
						<AnimatePresence>
							<IconButton
								scheme="secondary"
								variant="solid"
								icon={<GearIcon size={textSize} />}
								px={3.5}
								py={1}
								mr={2}
								onPress={() => setOpenSettings(true)}
								key="settingsGearIcon"
							/>
							<IconButton
								scheme="secondary"
								variant="solid"
								icon={<CopyIcon size={textSize} />}
								px={3.5}
								py={1}
								mr={2}
								onPress={copyAllToClipboard}
								key="copyButton"
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
								trigger={(props) => (
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
											duration: 600
										}}
										style={{
											overflow: "hidden"
										}}
									>
										<IconButton
											scheme="secondary"
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
									onPress={() => toggleSaveToLex(true)}
								>Choose What to Save</Menu.Item>
							</Menu>
						</AnimatePresence>
					</HStack>
					<Animated.View style={{
						...loadingTransforms
					}}>
						<HStack
							flexWrap="wrap"
							alignItems="center"
							justifyContent="center"
							space={2}
							py={2}
							px={4}
							bg="lighter"
							borderRadius="md"
						>
							<Spinner size={spinnerSize} color="primary.500" />
						</HStack>
					</Animated.View>
				</VStack>
			</HStack>
			<Box flexGrow={1}>
				<Animated.View style={{ flexGrow: 1, ...inputOutputTransforms }}>
					<FlatList
						data={inputOutputWords || []}
						renderItem={renderInputOutput}
						keyExtractor={(item) => item.join("-")}
						style={{
							flexGrow: 1,
							overflow: "hidden",
							height: inputOutputVisible ? lowerHeight : 0
						}}
					/>
				</Animated.View>
				<Animated.View style={{ flexGrow: 1, ...outputInputTransforms }}>
					<FlatList
						data={outputInputWords || []}
						renderItem={renderOutputInput}
						keyExtractor={(item) => item.join("-")}
						style={{
							flexGrow: 1,
							overflow: "hidden",
							height: outputInputVisible ? lowerHeight : 0
						}}
					/>
				</Animated.View>
				<Animated.View style={{ flexGrow: 1, ...rulesTransforms }}>
					<FlatList
						data={rulesWords || []}
						renderItem={renderRules}
						keyExtractor={(item) => item.slice(0, 3).join("-")}
						style={{
							paddingVertical: 0,
							paddingHorizontal: 16,
							flexGrow: 1,
							overflow: "hidden",
							height: rulesVisible ? lowerHeight : 0
						}}
					/>
				</Animated.View>
				<Animated.View style={{ flexGrow: 1, ...outputTransforms }}>
					<FlatGrid
						renderItem={renderOutput}
						data={outputWords || []}
						itemDimension={multicolumn ? longestWordSizeEstimate : width - 32}
						keyExtractor={(item) => item.join("-")}
						style={{
							paddingVertical: 0,
							paddingHorizontal: 16,
							flexGrow: 1,
							height: outputVisible ? lowerHeight : 0
						}}
						spacing={emSize}
					/>
				</Animated.View>
			</Box>
		</VStack>
	);
};

export default WGOutput;

