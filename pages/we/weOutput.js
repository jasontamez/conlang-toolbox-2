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
	ZoomInRight,
	ZoomOutEasyDown,
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
import { DropDown, SliderWithValueDisplay, ToggleSwitch } from "../../components/inputTags";
import { addMultipleItemsAsColumn } from "../../store/lexiconSlice";
import doToast from "../../helpers/toast";

const WGOutput = () => {
	const {
		input,
		characterGroups,
		transforms,
		soundChanges,
	} = useSelector(state => state.we);
	const columns = useSelector(state => state.lexicon.columns);
	const sizes = useSelector(state => state.appState.sizes);
	const dispatch = useDispatch();
	const [alertCannotEvolve, setAlertCannotEvolve] = useState(false);
	const [alertMsg, setAlertMsg] = useState("");
	const [showLoadingScreen, setShowLoadingScreen] = useState(false);

	const [longestWordSizeEstimate, setLongestWordSizeEstimate] = useState(undefined);
	const [displayedText, setDisplayedText] = useState(false);
	const [rawWords, setRawWords] = useState([]);
	const [outputStyle, setOutputStyle] = useState("output");
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
	const [originalEvolvedRulesWords, setOriginalEvolvedRulesWords] = useState(false);

	const [savingToLexicon, setSavingToLexicon] = useState(false);
	const [wordsToSave, setWordsToSave] = useState([]);
	const [chooseWhereToSaveInLex, setChooseWhereToSaveInLex] = useState(false);
	const [whereToSaveInLex, setWhereToSaveInLex] = useState(columns.length > 0 ? columns[0] : {label: "No columns"});
	const [alertNothingToSave, setAlertNothingToSave] = useState(false);

	const [charGroupMap, setCharGroupMap] = useState({});
	const [transformsAsRegExps, setTransformsAsRegExps] = useState({});
	const [soundChangesInterpreted, setSoundChangesInterpreted] = useState({});

	const [openSettings, setOpenSettings] = useState(false);
	const textSize = useBreakpointValue(sizes.sm);
	const descSize = useBreakpointValue(sizes.xs);
	const headerSize = useBreakpointValue(sizes.md);
	const largeSize = useBreakpointValue(sizes.lg);
	const giantSize = useBreakpointValue(sizes.x2);
	const emSize = fontSizesInPx[textSize] || fontSizesInPx.xs;
	const getRandomPercentage = (max = 100) => Math.random() * max;
	const { width } = useWindowDimensions();
	const toast = useToast();
	const navigate = useNavigate();
	const primaryContrast = useContrastText("primary.500");
	const secondaryContrast = useContrastText("secondary.500");
	const tertiaryContrast = useContrastText("tertiary.500");
	const saveToLexRef = useRef(null);


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
			const rules = [];
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
			assembly = rules;
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
			temp = (change.anticontext || "").split("_");
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
			const anticontext = temp;
			// SAVE
			newSoundChanges[id] = {
				beginning,
				ending,
				context,
				anticontext,
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
		const rawInput = input.split(/\n/);
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
		setOriginalEvolvedRulesWords(false);
		const changedWords = changeTheWords(rawInput);
		const output = [];
		const arrowLR = "⟶";
		const arrowRL = "⟵";
		const arrow = (outputStyle === "outputinput") ? arrowRL : arrowLR;

		switch(outputStyle) {
			case "output":
				// format will be a simple array of strings
				determineColumnSize(changedWords);
				// but we need to set up keys
				setEvolvedWords(changedWords.map((word, i) => [word, i]));
				break;
			case "inputoutput":
				// format will be an array of two-string arrays
				// [originalWord, evolvedWord]
			case "outputinput":
				// format will be an array of two-string arrays
				// [evolvedWord, originalWord]
				changedWords.forEach((bit, i) => {
					const [one, two] = bit;
					output.push([one, arrow, two, i]);
				});
				setOriginalEvolvedWords(output);
				break;
			case "rules":
				// [original, word, [[rule, new word]...]]  	grid-template-columns: 1fr 2em 1fr;
				changedWords.forEach((unit, i) => {
					const [original, evolved, ...rules] = unit;
					output.push([original, arrow, evolved, i, rules]);
				});
				setOriginalEvolvedRulesWords(output);
				break;
			default:
				console.log("Unknown error occurred.");
		}
		setShowLoadingScreen(false);
	};
	// Take an array of strings and apply each sound change rule
	//  to each string one at a time, then return an array
	//  according to the style requested
	const changeTheWords = (originalWords) => {
		let rulesThatApplied = [];
		let output = [];
		// Loop over every inputted word in order.
		originalWords.forEach((original) => {
			let word = original;
			// Loop over the rewrite rules.
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
				const {id, beginning, ending, context, anticontext} = change;
				const modified = soundChangesInterpreted[id];
				const rule = `${beginning}➜${ending} / ${context}` + (anticontext ? " ! " + anticontext : "");
				let previous = word;
				if(modified.characterGroupsFound) {
					// We have character group matches to deal with.
					const {beginning, ending, context, anticontext} = modified;
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
						// Make sure our match doesn't match the anticontext
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
						// We do NOT want to match the anticontext
						if(anticontext.some(a => a)) {
							const [a, b] = anticontext;
							if(
								(a ? pre.match(a) : true)
								&& (b ? post.match(b) : true)
							) {
								// We matched the anticontext, so forget about this.
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
					const {beginning, ending, context, anticontext} = modified;
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
						// Make sure our match doesn't match the anticontext
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
						// We do NOT want to match the anticontext
						if(anticontext.some(a => a)) {
							const [a, b] = anticontext;
							if(
								(a ? pre.match(a) : true)
								&& (b ? post.match(b) : true)
							) {
								// We matched the anticontext, so forget about this.
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
									rep = rep.replace("$" + c.toString(), m[c]);
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
					&& settingsWE.output === "rulesApplied"
					&& rulesThatApplied.push([rule, word]);
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
				} else if (direction === "out") {
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
					goingOut = [original, word, ...rulesThatApplied];
					rulesThatApplied = [];
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
	// Determine number of columns from given array of words
	// // //
	const determineColumnSize = (words) => {
		// Find length of longest word
		// (this will not be entirely correct if the word has two-character glyphs, but that's ok)
		const longestWord = Math.max(...words.map(w => w.length));
		// Estimate size of the longest word, erring on the larger size
		const longestWordLength = (emSize * longestWord);
		setLongestWordSizeEstimate(longestWordLength);
		//setDisplayedColumns(Math.max(1, Math.floor(viewport / longestWordLength)));
	};



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
		// TO-DO: Make this so it doesn't switch automatically?
		// TO-DO: split into two functions?
		// originalEvolvedWords (flat list, but flex-aligned? centered?)
		const [a, arrow, b, i] = item;
		const one = (outputStyle === "inputoutput") ?
			<Simple fontSize={textSize} lineHeight={headerSize}>{a}</Simple>
		:
			<SaveableElement text={a} index={i} wordsToSave={wordsToSave} />
		;
		const two = (outputStyle === "inputoutput") ?
			<SaveableElement text={b} index={i} wordsToSave={wordsToSave} />
		:
			<Simple fontSize={textSize} lineHeight={headerSize}>{b}</Simple>
		;
		return (
			<HStack
				justifyContent="center"
				alignItems="center"
				space={1.5}
				py={2}
			>
				<Box flex={1}>
					<Text textAlign="right" fontSize={textSize}>{one}</Text>
				</Box>
				<Simple textAlign="center" flexShrink={0} flexGrow={0}>{arrow}</Simple>
				<Box flex={1}>
					<Text textAlign="left" fontSize={textSize}>{two}</Text>
				</Box>
			</HStack>
		);
	}, [savingToLexicon, wordsToSave, headerSize, textSize, outputStyle]);
	const renderOriginalEvolvedRules = useCallback(({item}) => {
		// originalEvolvedRulesWords (flat list)
		const [original, arrow, evolved, i, rules] = item;
		return (
			<VStack
				justifyContent="flex-start"
				alignItems="flex-start"
				py={2}
			>
				<HStack
					justifyContent="flex-start"
					alignItems="center"
					space={1.5}
					pb={1}
				>
					<Box flex={1} w={longestWordSizeEstimate}>
						<Simple textAlign="right" lineHeight={headerSize}>{original}</Simple>
					</Box>
					<Text textAlign="center" fontSize={textSize} flexShrink={0} flexGrow={0}>{arrow}</Text>
					<Box flex={1}>
						<SaveableElement text={evolved} index={i} wordsToSave={wordsToSave} />
					</Box>
				</HStack>
				{rules.map(r => {
					const [rule, newWord] = r;
					return (
						<HStack
							pl={5}
							justifyContent="flex-start"
							alignContent="center"
							space={1.5}
						>
							<Box><Text textAlign="right" fontSize={textSize}>{rule}</Text></Box>
							<Text textAlign="center" fontSize={textSize} flexShrink={0} flexGrow={0}>{arrow}</Text>
							<Box w={longestWordSizeEstimate}><Text fontSize={textSize}>{newWord}</Text></Box>
						</HStack>
					);
				})}
			</VStack>
		);
	}, [savingToLexicon, wordsToSave, headerSize, textSize, outputStyle]);
	const renderEvolved = useCallback(({item}) => {
		// evolvedWords (grid)
		const [word, i] = item;
		if(savingToLexicon) {
			return <SaveableElement text={word} index={i} wordsToSave={wordsToSave} />;
		}
		return <Simple fontSize={textSize} lineHeight={headerSize}>{word}</Simple>;
	}, [savingToLexicon, wordsToSave, headerSize, textSize]);
	//TO-DO: Fix this so it's not always on
	const SaveableElement = memo(({text, index, wordsToSave}) => {
		const saved = wordsToSave[index];
		const onPressWord = useCallback(() => {
			let newSave = [...wordsToSave];
			newSave[index] = !wordsToSave[index];
			setWordsToSave(newSave);
		}, [index, wordsToSave]);
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
						<Text>Empty for now.</Text>
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
						onChange={(v) => setOutputStyle(v)}
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
								// TO-DO: fix this
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
						trigger={(props) => (rawWords.length > 0 ?
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
						keyExtractor={(item) => `${item[0]}-${item[2]}--${item[3]}`}
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
						keyExtractor={(item) => `${item[0]}-${item[2]}--${item[3]}`}
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
						itemDimension={longestWordSizeEstimate}
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
