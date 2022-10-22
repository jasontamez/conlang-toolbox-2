import {
	useBreakpointValue,
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
import { useNavigate } from "react-router";
import ReAnimated, {
	CurvedTransition,
	FadeInLeft,
	FadeOutLeft,
	FlipInYRight,
	FlipOutYRight,
	ZoomInEasyDown,
	ZoomInLeft,
	ZoomInRight,
	ZoomOutEasyDown,
	ZoomOutLeft,
	ZoomOutRight
} from 'react-native-reanimated';
import calculateCharacterGroupReferenceRegex from "../../helpers/calculateCharacterGroupReferenceRegex";
import { FlatGrid } from 'react-native-super-grid';
import escapeRegexp from "escape-string-regexp";
import { v4 as uuidv4 } from 'uuid';

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
import { fontSizesInPx } from "../../store/appStateSlice";
import StandardAlert from "../../components/StandardAlert";
import { DropDown, ToggleSwitch } from "../../components/inputTags";
import { addMultipleItemsAsColumn } from "../../store/lexiconSlice";
import doToast from "../../helpers/toast";
import { loadState, setFlag, setOutput, setStoredCustomInfo } from "../../store/weSlice";
import WEPresetsModal from "./wePresetsModal";
import LoadCustomInfoModal from "../../components/LoadCustomInfoModal";
import SaveCustomInfoModal from "../../components/SaveCustomInfoModal";
import { weCustomStorage } from "../../helpers/persistentInfo";

const WGOutput = () => {
	const {
		input,
		characterGroups,
		transforms,
		soundChanges,
		storedCustomInfo,
		storedCustomIDs,
		settings: {
			outputStyle,
			multicolumn,
			inputLower,
			inputAlpha
		}
	} = useSelector(state => state.we);
	const columns = useSelector(state => state.lexicon.columns);
	const sizes = useSelector(state => state.appState.sizes);
	const dispatch = useDispatch();
	const [alertCannotEvolve, setAlertCannotEvolve] = useState(false);
	const [alertMsg, setAlertMsg] = useState("");
	const [showLoadingScreen, setShowLoadingScreen] = useState(false);

	const [longestWordSizeEstimate, setLongestWordSizeEstimate] = useState(undefined);
	const [longestOriginalWordSizeEstimate, setLongestOriginalWordSizeEstimate] = useState(undefined);
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
	const [evolvedWords, setEvolvedWords] = useState(false);
	const [originalEvolvedWords, setOriginalEvolvedWords] = useState(false);
	const [evolvedOriginalWords, setEvolvedOriginalWords] = useState(false);
	const [originalEvolvedRulesWords, setOriginalEvolvedRulesWords] = useState(false);
	const [saveableWords, setSaveableWords] = useState([]);

	const [savingToLexicon, setSavingToLexicon] = useState(false);
	const [wordsToSave, setWordsToSave] = useState({});
	const [chooseWhereToSaveInLex, setChooseWhereToSaveInLex] = useState(false);
	const [whereToSaveInLex, setWhereToSaveInLex] = useState(columns.length > 0 ? columns[0] : {label: "No columns"});
	const [alertNothingToSave, setAlertNothingToSave] = useState(false);

	const [charGroupMap, setCharGroupMap] = useState({});
	const [transformsAsRegExps, setTransformsAsRegExps] = useState({});
	const [soundChangesInterpreted, setSoundChangesInterpreted] = useState({});

	const [openSettings, setOpenSettings] = useState(false);

	const [clearAlertOpen, setClearAlertOpen] = useState(false);
	const [openPresetModal, setOpenPresetModal] = useState(false);
	const [openLoadCustomInfoModal, setOpenLoadCustomInfoModal] = useState(false);
	const [openSaveCustomInfoModal, setOpenSaveCustomInfoModal] = useState(false);

	const textSize = useBreakpointValue(sizes.sm);
	const descSize = useBreakpointValue(sizes.xs);
	const headerSize = useBreakpointValue(sizes.md);
	const largeSize = useBreakpointValue(sizes.lg);
	const giantSize = useBreakpointValue(sizes.x2);
	const emSize = fontSizesInPx[textSize] || fontSizesInPx.xs;
	const toast = useToast();
	const navigate = useNavigate();
	const primaryContrast = useContrastText("primary.500");
	const secondaryContrast = useContrastText("secondary.500");
	const tertiaryContrast = useContrastText("tertiary.500");
	const saveToLexInitialRef = useRef(null);
	const arrowLR = "⟶";
	const arrowRL = "⟵";
	const { width } = useWindowDimensions();

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
			saveableWords.forEach(word => rawObj[word] = false);
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
			return saveableWords.filter(word => wordsToSave[word]);
		}
		// Return all values
		return saveableWords;
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

		setShowLoadingScreen(true);
		setEvolvedWords(false);
		setOriginalEvolvedWords(false);
		setEvolvedOriginalWords(false);
		setOriginalEvolvedRulesWords(false);
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
				setEvolvedWords(changedWords.map((word, i) => [word, i]));
				changed.push(...changedWords);
				break;
			case "outputinput":
				// format will be an array of two-string arrays
				// [evolvedWord, originalWord]
				changedWords.forEach((bit, i) => {
					const [evolved, original] = bit;
					output.push([evolved, original, i]);
					changed.push(evolved);
				});
				setEvolvedOriginalWords(output);
				break;
			case "inputoutput":
				// format will be an array of two-string arrays
				// [originalWord, evolvedWord]
				changedWords.forEach((bit, i) => {
					const [original, evolved] = bit;
					output.push([original, evolved, i]);
					changed.push(evolved);
				});
				setOriginalEvolvedWords(output);
				break;
			case "rules":
				// [original, word, ...[[rule, new word]...]]
				changedWords.forEach((unit, i) => {
					const [original, evolved, rules] = unit;
					output.push([original, evolved, i, rules]);
					changed.push(evolved);
				});
				setOriginalEvolvedRulesWords(output);
				break;
			default:
				console.log("Unknown error occurred.");
		}
		const inputLength = determineColumnSize(rawInput);
		const outputLength = determineColumnSize(changed);
		setLongestOriginalWordSizeEstimate(inputLength);
		setLongestEvolvedWordSizeEstimate(outputLength);
		setLongestWordSizeEstimate(Math.max(inputLength, outputLength));
		let testing = {};
		setSaveableWords(changed.filter(word => {
			if(testing[word]) {
				return false;
			}
			testing[word] = true;
			return true;
		}));
		setShowLoadingScreen(false);
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
									rep = rep.replaceAll("$" + c.toString(), m[c]);
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
					&& rulesThatApplied.push([`${beginning}➜${ending} / ${context}` + (exception ? " ! " + exception : ""), word]);
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
		const longestWord = Math.max(...words.map(w => w.length));
		// Estimate size of the longest word, erring on the larger size
		return emSize * longestWord;
		//setDisplayedColumns(Math.max(1, Math.floor(viewport / longestWordLength)));
	};



	// // //
	// Buttons
	// // //
	const maybeClearEverything = () => {
		if(disableConfirms) {
			doClearEveything();
		}
		setClearAlertOpen(true);
	};
	const doClearEveything = () => {
		dispatch(loadState(null));
		doToast({
			toast,
			msg: "Info has been cleared.",
			scheme: "danger",
			placement: "bottom"
		})
	};
	const maybeSaveInfo = () => setOpenSaveCustomInfoModal(true);
	const maybeLoadPreset = () => setOpenPresetModal(true);




	// // //
	// JSX
	// // //
	const LoadingScreen = memo(({size}) => {
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
					<Text fontSize={size}>Generating...</Text>
					<Spinner size="lg" color="primary.500" />
				</HStack>
			</ReAnimated.View>
		);
	});
	const Simple = memo((props) => <Text fontSize={textSize} lineHeight={headerSize} {...props} />);
	const renderOriginalEvolved = useCallback(({item}) => {
		// originalEvolvedWords (flat list)
		const [a, b, i] = item;
		const original = <Simple fontSize={textSize} lineHeight={headerSize}>{a}</Simple>;
		const evolved = savingToLexicon ?
			<SaveableElement text={b} index={i} wordsToSave={wordsToSave} />
		:
			<Simple fontSize={textSize} lineHeight={headerSize}>{b}</Simple>
		;
		return (
			<HStack
				justifyContent="center"
				alignItems="center"
				space={1.5}
				flexWrap="wrap"
				py={2}
			>
				<Box style={{
					flexGrow: 0,
					flexShrink: 0,
					flexBasis: longestEvolvedWordSizeEstimate
				}}>
					<Text textAlign="right" fontSize={textSize}>{original}</Text>
				</Box>
				<Simple textAlign="center" flexShrink={0} flexGrow={0}>{arrowLR}</Simple>
				<Box flex={1}>
					<Text textAlign="left" fontSize={textSize}>{evolved}</Text>
				</Box>
			</HStack>
		);
	}, [savingToLexicon, wordsToSave, headerSize, textSize, longestEvolvedWordSizeEstimate]);
	const renderEvolvedOriginal = useCallback(({item}) => {
		// evolvedOriginalWords (flat list)
		const [a, b, i] = item;
		const evolved = savingToLexicon ?
			<SaveableElement text={a} index={i} wordsToSave={wordsToSave} />
		:
			<Simple fontSize={textSize} lineHeight={headerSize}>{a}</Simple>
		;
		const original = <Simple fontSize={textSize} lineHeight={headerSize}>{b}</Simple>;
		return (
			<HStack
				justifyContent="center"
				alignItems="center"
				space={1.5}
				flexWrap="wrap"
				py={2}
			>
				<Box style={{
					flexGrow: 0,
					flexShrink: 0,
					flexBasis: longestEvolvedWordSizeEstimate
				}} flexShrink={0} flexGrow={0}>
					<Text textAlign="right" fontSize={textSize}>{evolved}</Text>
				</Box>
				<Simple textAlign="center" flexShrink={0} flexGrow={0}>{arrowRL}</Simple>
				<Box flex={1}>
					<Text textAlign="left" fontSize={textSize}>{original}</Text>
				</Box>
			</HStack>
		);
	}, [savingToLexicon, wordsToSave, headerSize, textSize, longestEvolvedWordSizeEstimate]);
	const renderOriginalEvolvedRules = useCallback(({item}) => {
		// originalEvolvedRulesWords (flat list)
		const [original, evolved, i, rules] = item;
		const evolvedOutput = savingToLexicon ?
			<SaveableElement text={evolved} index={i} wordsToSave={wordsToSave} />
		:
			<Simple textAlign="left" lineHeight={headerSize}>{evolved}</Simple>
		;
		return (
			<VStack
				justifyContent="flex-start"
				alignItems="flex-start"
				py={2}
				w="full"
			>
				<HStack
					justifyContent="flex-start"
					alignItems="center"
					space={1.5}
					pb={1}
					w="full"
					flexWrap="wrap"
				>
					<Box style={{
						flexGrow: 0,
						flexShrink: 0,
						flexBasis: longestOriginalWordSizeEstimate
					}}>
						<Simple textAlign="right" lineHeight={headerSize}>{original}</Simple>
					</Box>
					<Simple textAlign="center" flexShrink={0} flexGrow={0}>{arrowLR}</Simple>
					<Box flex={1}>{evolvedOutput}</Box>
				</HStack>
				{rules.map(r => {
					const [rule, newWord] = r;
					return (
						<HStack
							style={{
								paddingLeft: longestOriginalWordSizeEstimate
							}}
							justifyContent="flex-start"
							alignContent="center"
							space={1.5}
							w="full"
							flexWrap="wrap"
							key={`${original}->${evolved}:${i}:${rule}/${newWord}`}
						>
							<Box flexShrink={0} flexGrow={0} pl={1.5}>
								<Text textAlign="right" fontSize={textSize}>{rule}</Text>
							</Box>
							<Simple textAlign="center" flexShrink={0} flexGrow={0}>{arrowLR}</Simple>
							<Box flex={1}>
								<Text fontSize={textSize}>{newWord}</Text>
							</Box>
						</HStack>
					);
				})}
			</VStack>
		);
	}, [savingToLexicon, wordsToSave, headerSize, textSize, longestOriginalWordSizeEstimate]);
	const renderEvolved = useCallback(({item}) => {
		// evolvedWords (grid)
		const [word, i] = item;
		if(savingToLexicon) {
			return <SaveableElement text={word} index={i} wordsToSave={wordsToSave} />;
		}
		return <Simple fontSize={textSize} lineHeight={headerSize}>{word}</Simple>;
	}, [savingToLexicon, wordsToSave, headerSize, textSize]);
	const SaveableElement = memo(({text, index, wordsToSave}) => {
		const saved = wordsToSave[text];
		const onPressWord = useCallback(() => {
			let newSave = {...wordsToSave};
			newSave[text] = !wordsToSave[text];
			setWordsToSave(newSave);
		}, [text, wordsToSave]);
		const Item = memo(({text, index, saved, onPress}) => {
			let bg = "secondary.500",
				color = secondaryContrast;
			if(saved) {
				bg = "primary.500";
				color = primaryContrast;
			}
			return (
				<Pressable
					onPress={onPress}
					key={`Pressable${index}/${text}`}
					bg={bg}
				><Simple color={color}>{text}</Simple></Pressable>
			);
		});
		return <Item text={text} index={index} onPress={onPressWord} saved={saved} />;
	});

	const InfoButton = (props) => {
		return (
			<Button
				borderRadius="full"
				_text={{
					fontSize: textSize
				}}
				py={0.5}
				px={3}
				m={1}
				{...props}
			/>
		);
	};

	return (
		<VStack h="full" alignContent="flex-start" bg="main.900" mb={16}>
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
			<Modal isOpen={chooseWhereToSaveInLex} initialFocusRef={saveToLexInitialRef}>
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
			<StandardAlert
				alertOpen={clearAlertOpen}
				setAlertOpen={setClearAlertOpen}
				bodyContent="This will erase every Character Group, Syllable and Transform currently loaded in the app, and reset the settings on this page to their initial values. Are you sure you want to do this?"
				continueText="Yes, Do It"
				continueFunc={() => doClearEveything()}
				fontSize={textSize}
			/>
			<WEPresetsModal
				modalOpen={openPresetModal}
				setModalOpen={setOpenPresetModal}
				loadState={loadState}
			/>
			<LoadCustomInfoModal
				modalOpen={openLoadCustomInfoModal}
				closeModal={() => setOpenLoadCustomInfoModal(false)}
				customStorage={weCustomStorage}
				loadState={loadState}
				setStoredCustomInfo={setStoredCustomInfo}
				storedCustomIDs={storedCustomIDs}
				storedCustomInfo={storedCustomInfo}
			/>
			<SaveCustomInfoModal
				modalOpen={openSaveCustomInfoModal}
				closeModal={() => setOpenSaveCustomInfoModal(false)}
				customStorage={weCustomStorage}
				saveableObject={{
					characterGroups,
					transforms,
					soundChanges
				}}
				setStoredCustomInfo={setStoredCustomInfo}
				storedCustomInfo={storedCustomInfo}
				storedCustomIDs={storedCustomIDs}
				savedInfoString="all current Character Groups, Transformations, and Sound Changes"
			/>
			<HStack
				py={1.5}
				px={2}
				alignItems="center"
				justifyContent="center"
				alignContent="space-between"
				flexWrap="wrap"
				borderBottomWidth={0.5}
				borderColor="main.700"
			>
				<InfoButton
					colorScheme="primary"
					onPress={() => maybeLoadPreset()}
				>Load a Preset</InfoButton>
				<InfoButton
					colorScheme="danger"
					onPress={() => maybeClearEverything()}
				>Reset All Fields</InfoButton>
				<InfoButton
					colorScheme="secondary"
					onPress={() => setOpenLoadCustomInfoModal(true)}
				>Load Saved Info</InfoButton>
				<InfoButton
					colorScheme="tertiary"
					onPress={() => maybeSaveInfo()}
				>Save Current Info</InfoButton>
			</HStack>
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
							flexShrink: 2,
							ml: 0,
							mr: 0
						}}
						onChange={(v) => dispatch(setOutput(v))}
						defaultValue={outputStyle}
						title="Display:"
						options={outputStyles}
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
								evolveOutput();
							}
						}}
					>{savingToLexicon ? "SAVE" : "EVOLVE"}</Button>
				</VStack>
				<ReAnimated.View
					layout={CurvedTransition}
					style={{
						flexDirection: "row",
						flexWrap: "wrap"
					}}
				>
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
						icon={/* TO-DO: Copy code */ <CopyIcon size={textSize} />}
						px={3.5}
						py={1}
						mr={2}
					/>
					<Menu
						placement="bottom right"
						trigger={(props) => (saveableWords.length > 0 ?
							<ReAnimated.View
								entering={FlipInYRight}
								exiting={FlipOutYRight}
							>
								<IconButton
									colorScheme="secondary"
									variant="solid"
									icon={<SaveIcon size={textSize} />}
									px={3.5}
									py={1}
									{...props}
								/>
							</ReAnimated.View>
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
				</ReAnimated.View>
			</HStack>
			{(showLoadingScreen ?
				<LoadingScreen key="loadingScreen" size={giantSize} />
			:
				<></>
			)}
			{((originalEvolvedWords) ?
				<ReAnimated.View
					entering={ZoomInRight}
					exiting={ZoomOutRight}
					style={{flex: 1, paddingHorizontal: 16, paddingVertical: 8}}
				>
					<FlatList
						data={originalEvolvedWords}
						renderItem={renderOriginalEvolved}
						keyExtractor={(item) => item.join("-")}
					/>
				</ReAnimated.View>
			:
				<></>
			)}
			{((evolvedOriginalWords) ?
				<ReAnimated.View
					entering={ZoomInLeft}
					exiting={ZoomOutLeft}
					style={{flex: 1, paddingHorizontal: 16, paddingVertical: 8}}
				>
					<FlatList
						data={evolvedOriginalWords}
						renderItem={renderEvolvedOriginal}
						keyExtractor={(item) => item.join("-")}
					/>
				</ReAnimated.View>
			:
				<></>
			)}
			{((originalEvolvedRulesWords) ?
				<ReAnimated.View
					entering={ZoomInRight}
					exiting={ZoomOutRight}
					style={{flex: 1, paddingHorizontal: 16, paddingVertical: 8}}
				>
					<FlatList
						data={originalEvolvedRulesWords}
						renderItem={renderOriginalEvolvedRules}
						keyExtractor={(item) => item.slice(0, 3).join("-")}
					/>
				</ReAnimated.View>
			:
				<></>
			)}
			{evolvedWords ?
				<ReAnimated.View
					entering={FadeInLeft}
					exiting={FadeOutLeft}
					style={{flex: 1}}
				>
					<FlatGrid
						renderItem={renderEvolved}
						data={evolvedWords}
						itemDimension={multicolumn ? longestWordSizeEstimate : width - 32}
						keyExtractor={(item) => item.join("-")}
						style={{
							paddingVertical: 0,
							paddingHorizontal: 16
						}}
						spacing={emSize}
					/>
				</ReAnimated.View>
			:
				<></>
			}
		</VStack>
	);
};

export default WGOutput;

