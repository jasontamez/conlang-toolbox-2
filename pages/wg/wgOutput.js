import {
	useBreakpointValue,
	ScrollView,
	VStack
} from "native-base";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReAnimated, {
	CurvedTransition,
	FadeInUp,
	FadeOutUp
} from 'react-native-reanimated';
import escapeRegexp from 'escape-string-regexp';

import {
	AddIcon
} from "../../components/icons";
import { sizes } from "../../store/appStateSlice";
import {
	equalityCheck
} from "../../store/wgSlice";

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
	const textSize = useBreakpointValue(sizes.sm);

	// // //
	// Convenience Variables
	// // //
	// Set up an easy-to-search map of character groups
	let charGroupMap = {};
	// Create a new array of transforms, with RegExps included
	let transformsWithRegExps = [];
	// Create new arrays for syllables
	let singleWordArray = [];
	let wordInitialArray = [];
	let wordMiddleArray = [];
	let wordFinalArray = [];
	useEffect(() => {
		// Clear objects
		charGroupMap = {};
		transformsWithRegExps = [];

		// Save character groups by label
		characterGroups.forEach(group => (charGroupMap[group.label] = group));

		// Check transforms for %Category references and save as RegExp objects
		transforms.forEach((rule) => {
			const search = rule.search;
			let regex;
			if(search.indexOf("%") !== -1) {
				// Found a possibility.
				regex = calculateCategoryReferenceRegex(search, charGroupMap);
			} else {
				regex = new RegExp(search, "g");
			}
			transformsWithRegExps.push({
				...rule,
				regex
			})
		});

		// Change all syllable info into Arrays
		singleWordArray = singleWord.split(/(\r?\n)+/);
		wordInitialArray = wordInitial.split(/(\r?\n)+/);
		wordMiddleArray = wordMiddle.split(/(\r?\n)+/);
		wordFinalArray = wordFinal.split(/(\r?\n)+/);
	}, [characterGroups, transforms, singleWord, wordInitial, wordMiddle, wordFinal]);

	// TO-DO: This function will need to be updated the most
	// $d made a simple <div>
	// $t outputted an element representing a single word,
	//   with events and classes attached
	// // //
	// Generate Output!
	// // //
	const generateOutput = async (OUTPUT = outputPane) => {
		let endEarly = false;
		// Clear any previous output.
		while(OUTPUT.firstChild !== null) {
			OUTPUT.removeChild(OUTPUT.firstChild);
		}
		// Sanity check - TO-DO: change to StandardAlerts
		if(characterGroups.length === 0) {
			OUTPUT.append($d("You have no character groups defined."));
			endEarly = true;
		}
		if (!multipleSyllableTypes && singleWord === "") {
			OUTPUT.append($d("You have no syllables defined."));
			endEarly = true;
		}
		if (multipleSyllableTypes && 
			(
				(monosyllablesRate > 0 && singleWord === "")
				|| wordInitial === ""
				|| wordMiddle === ""
				|| wordFinal === ""
			)
		) {
			OUTPUT.append($d("You are missing one or more types of syllables."));
			endEarly = true;
		}
		if(endEarly) {
			return;
		}
		// Determine what we're making.
		if(output === "text") {
			// pseudotext
			OUTPUT.style.columnWidth = "auto";
			return generatePseudoText(OUTPUT);
		}
		// Every syllable, or a wordlist
		dispatch(setLoadingPage("generatingWords"));
		const resolveFunc = (output === "syllables") ? getEverySyllable : makeWordlist;
		let result = await resolveFunc(capitalizeWords);
		OUTPUT.style.columnWidth = wordlistMultiColumn ? getWidestWord(result) : "auto";
		result.forEach((bit) => OUTPUT.append($t(bit, "div")));
		// columnar stuff takes a bit to process, so delay a bit
		dispatch(setLoadingPage(false));
	};
	
	
	// // //
	// Generate a psuedo-text
	// // //
	const generatePseudoText = async (where) => {
		let text = [];
		let final = $d();
		let sentenceNumber = 0;
		while(sentenceNumber < sentencesPerText) {
			sentenceNumber++;
			let sentence = [];
			let staging = [];
			let wordNumber = 0;
			let maxWords = 3;
			for(maxWords = 3; true; maxWords = Math.max((maxWords + 1) % 15, 3)) {
				// The 'true' in there means this loop never ends on its own.
				if ((Math.random() * 100) < (maxWords < 5 ? 35 : (maxWords < 9 ? 50 : 25))) {
					break;
				}
			}
			while(wordNumber < maxWords) {
				wordNumber++;
				sentence.push($t(makeOneWord(wordNumber < 2 && capitalizeSentences)));
			}
			let full = text.join(" ");
			staging.push(sentence.shift());
			while (sentence.length > 1) {
				staging.push(" ", sentence.shift());
			}
			let type = Math.random() * 12;
			if(type < 9) {
				// Declarative three-fourths the time
				full = declarativeSentencePre + full + declarativeSentencePost;
				declarativeSentencePre && staging.unshift(declarativeSentencePre);
				declarativeSentencePost && staging.push(declarativeSentencePost);
			} else if (type < 11) {
				// Interrogative one-sixth the time
				full = interrogativeSentencePre + full + interrogativeSentencePost;
				interrogativeSentencePre && staging.unshift(interrogativeSentencePre);
				interrogativeSentencePost && staging.push(interrogativeSentencePost);
			} else {
				// Exclamatory one-twelfth the time
				full = exclamatorySentencePre + full + exclamatorySentencePost;
				exclamatorySentencePre && staging.unshift(exclamatorySentencePre);
				exclamatorySentencePost && staging.push(exclamatorySentencePost);
			}
			text.push(staging);
		}
		text.length > 0 && final.append(...text.shift());
		while(text.length > 0) {
			final.append(" ", ...text.shift())
		}
		where.append(final);
	};
	
	// // //
	// Generate Syllables
	// // //
	const makeSyllable = (syllList, overrideRate) => {
		let chosen;
		let max = syllList.length;
		const rate = overrideRate === undefined ? syllableBoxDropoff : overrideRate;
		if(rate <= 0) {
			return translateSyllable(syllList[Math.floor(Math.random() * max)]);
		}
		rate = rate + 5;
		let toPick = 0;
		for(toPick = 0; true; toPick = (toPick + 1) % max) {
			// The 'true' in there means this loop never ends on its own.
			if ((Math.random() * 100) < rate) {
				chosen = syllList[toPick];
				break;
			}
		}
		return translateSyllable(chosen);
	};
	const translateSyllable = (syll) => {
		let chars = syll.split("");
		let OUTPUT = "";
		while(chars.length > 0) {
			let current = chars.shift();
			let charGroup = charGroupMap[current];
			if(charGroup === undefined) {
				OUTPUT += current;
			} else {
				let thisRate = (charGroup.dropoffOverride === undefined ? characterGroupDropoff : charGroup.dropoffOverride) + 5;
				let choices = charGroup.run;
				let max = choices.length;
				if(thisRate === 0) {
					OUTPUT += choices[Math.floor(Math.random() * max)];
				} else {
					let toPick = 0;
					for(toPick = 0; true; toPick = (toPick + 1) % max) {
						// The 'true' in there means this loop never ends on its own.
						if ((Math.random() * 100) < thisRate) {
							OUTPUT += choices[toPick];
							break;
						}
					}
				}
			}
		}
		return OUTPUT;
	};
	
	// // //
	// Generate One Word
	// // //
	const makeOneWord = (capitalize) => {
		let numberOfSyllables = 1;
		let word = [];
		let OUTPUT;
		// Determine number of syllables
		if((Math.random() * 100) >= monosyllablesRate) {
			// More than 1. Add syllables, favoring a lower number of syllables.
			let max = maxSyllablesPerWord - 2;
			let toAdd = 0;
			numberOfSyllables = 2;
			for(toAdd = 0; true; toAdd = (toAdd + 1) % max) {
				// The 'true' in there means this loop never ends on its own.
				if ((Math.random() * 100) < 50) {
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
				for(let current = 1; current < numberOfSyllables; current++) {
					word.push( makeSyllable(singleWordArray, syllableDropoffOverrides.singleWord) );
				}
			} else {
				word.push( makeSyllable(wordInitialArray, syllableDropoffOverrides.wordInitial) );
				for(let current = 2; current < numberOfSyllables; current++) {
					word.push( makeSyllable(wordMiddleArray, syllableDropoffOverrides.wordMiddle) );
				}
				word.push( makeSyllable(wordFinalArray, syllableDropoffOverrides.wordFinal) );
			}
		}
		// Check for syllable break insertion
		if(showSyllableBreaks) {
			OUTPUT = word.join("\u00b7");
		} else {
			OUTPUT = word.join("");
		}
		// Apply rewrite rules
		OUTPUT = doRewrite(OUTPUT);
		// Capitalize if needed
		if(capitalize) {
			OUTPUT = OUTPUT.charAt(0).toUpperCase() + OUTPUT.slice(1);
		}
		return OUTPUT;
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
	const getEverySyllable = async (capitalize = false) => {
		let OUTPUT = [];
		let syllables = singleWordArray;
		if(multipleSyllableTypes) {
			syllables = syllables.concat(
				wordInitialArray,
				wordMiddleArray,
				wordFinalArray
			);
		}
		syllables = syllables.map((syll) => ["", syll]);
		while(syllables.length > 0) {
			let [current, toGo] = syllables.shift();
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
			OUTPUT.push(...newOutput);
		}
		// Capitalize if needed
		if(capitalize) {
			OUTPUT = OUTPUT.map(word => (word.charAt(0).toUpperCase() + word.slice(1)));
		}
		// Remove duplicates
		let noDupes = new Set(OUTPUT);
		OUTPUT = [];
		noDupes.forEach(t => OUTPUT.push(t));
		// Sort if needed
		if(sortWordlist) {
			OUTPUT.sort(new Intl.Collator("en", { sensitivity: "variant" }).compare);
		}
		return OUTPUT;
	};
	const recurseSyllables = async (previous, toGo) => {
		let current = toGo.charAt(0);
		let next = toGo.slice(1);
		let charGroup = charGroupMap[current];
		if(charGroup === undefined) {
			// Category not found - save as written
			return {
				results: [previous + current],
				next: next
			};
		}
		return {
			results: charGroup.run.split("").map(char => previous + char),
			next: next
		}
	};
	
	// // //
	// Wordlist
	// // //
	const makeWordlist = async (capitalize) => {
		let n = 0;
		let words = [];
		for (n = 0;n < wordsPerWordlist; n++) {
			words.push(makeOneWord(capitalize));
		}
		// Sort if needed
		if(sortWordlist) {
			words.sort(new Intl.Collator("en", { sensitivity: "variant" }).compare);
		}
		return words;
	};


	// // //
	// JSX
	// // //
	return (
		<VStack h="full">
			<ScrollView bg="main.900">
			</ScrollView>
		</VStack>
	);
};

export default WGOutput;


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

