import {
	Text,
	ScrollView,
	Input,
	Button,
	IconButton,
	VStack,
	HStack,
	Pressable,
	useToast,
	Stack,
	Box
} from 'native-base';
import React, { memo, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useWindowDimensions } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import getSizes from '../helpers/getSizes';
import debounce from '../helpers/debounce';
import { NamesIcon, CopyIcon, FaveIcon, OkIcon } from '../components/icons';
import {
	toggleCopyImmediately,
	toggleShowNames,
	setFaves,
	setNowShowing
} from '../store/extraCharactersSlice';
import { fontSizesInPx, removeLastPageFromHistory } from '../store/appStateSlice';
import doToast from "../helpers/toast";

const ExtraChars = ({
	/*isOpen,
	setOpen*/
}) => {
	const {
		faves,
		toCopy,
		copyImmediately,
		showNames,
		nowShowing
	} = useSelector(state => state.extraCharacters)
	const { history } = useSelector(state => state.appState);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { width, height } = useWindowDimensions();
	const [settingFaves, setSettingFaves] = useState(false);
	const [inputText, setInputText] = useState(toCopy);
	const [buttonTextSize, textSize, titleSize, boxSize] = getSizes("xs", "sm", "md", "lg");
	// Height calculations
	const appHeaderHeight = fontSizesInPx[boxSize] * 2.5;
	const mainHeight = height - appHeaderHeight;
	const bottomBarHeight = (fontSizesInPx[textSize] + fontSizesInPx[buttonTextSize]) * 2 - 2;
	const scrollHeight = mainHeight - bottomBarHeight;
	// Width calculations
	const characterBoxWidth = fontSizesInPx[boxSize] * 2;
	const scrollWidth = width - 8;
	const innerWidth = scrollWidth - 16;
	const nameWidth = innerWidth - characterBoxWidth - 16;
	// Toast props
	const toastProps = {
		toast: useToast(),
		placement: "bottom",
		fontSize: textSize,
		wrapProps: {
			zIndex: 6000
		}
	};

	// TO-DO:
	//   remove consoles
	//   Add "header" buttons to main body, or make menu
	//   SET UP NAVIGATION

	// Character Info
	const allGroups = {
		Favorites: {
			title: "Favorites",
			content: faves
		},
		...charData
	};
	const faveString = faves.map(f => f.character).join('');
	const groupNames = Object.keys(allGroups);
	const textProps = {
		textAlign: "center",
		fontFamily: "Noto Sans",
		fontSize: textSize
	};

	// When we tap on a character...
	const characterTapped = useCallback(async (info) => {
		// Add character to Input or Clipboard
		//
		// useSelector to get/set longnames and clipboard
		if(settingFaves) {
			// Do stuff to faves
			const {description, character} = info;
			let found = false;
			const newFaves = faves.filter(f => {
				if(!found && f.description === description && f.character === character) {
					// Found it
					found = true;
					return false;
				}
				return true;
			});
			console.log((found ? "Removing " : "Adding ") + character)
			if(!found) {
				// Add to faves
				newFaves.push(info);
			}
			// Save
			debounce(
				() => dispatch(setFaves(newFaves)),
				{ namespace: "extra characters faves" }
			);
		} else if (copyImmediately) {
			// Copy now
			console.log("Copying " + info.character);
			await Clipboard.setStringAsync(info.character);
			doToast({
				...toastProps,
				placement: "top",
				msg: "Copied to Clipboard"
			});
		} else {
			// Add to Input
			setInputText(inputText + info.character);
			console.log(`ADDING ${info.description}`)
		}
	}, [inputText]);

	// Toggle buttons
	const toggleFavorites = useCallback(() => {
		const msg = settingFaves ? "No longer saving favorites." : "Now saving to favorites."; 
		setSettingFaves(!settingFaves);
		doToast({
			...toastProps,
			msg
		});
	}, [setSettingFaves, doToast, toastProps]);
	const toggleCopying = useCallback(() => {
		const msg = copyImmediately ? "Stopped copying directly to clipboard." : "Now copying directly to clipboard.";
		dispatch(toggleCopyImmediately());
		doToast({
			...toastProps,
			msg
		});
	}, [dispatch, toggleCopyImmediately, doToast, toastProps]);
	const toggleShowingNames = useCallback(() => {
		dispatch(toggleShowNames());
	}, [dispatch, toggleShowNames]);

	// Memoized elements
	const MakeName = memo(({keyName, description, nameWidth, textProps}) => {
		return (
			<Box
				key={keyName}
				px={2}
				flexShrink={1}
				style={{maxWidth: nameWidth}}
			>
				<Text color="text.50" flexShrink={1} {...textProps}>{description}</Text>
			</Box>
		);
	});
	const CharBox = memo(({isFavorite, characterBoxWidth, character, textProps}) => {
		const color = isFavorite ? "secondary.50" : "text.50";
		return (
			<Box
				borderWidth={1}
				borderColor={color}
				mx={1}
				style={{width: characterBoxWidth}}
			>
				<Text
					color={color}
					flexShrink={1}
					{...textProps}
				>{character}</Text>
			</Box>
		);
	});
	const Item = memo(({
		innerWidth,
		faveString,
		showNames,
		characterBoxWidth,
		textProps,
		nameWidth,
		c
	}) => {
		const isFavorite = faveString.indexOf(c) >= 0;
		const bg = isFavorite ? "secondary.800" : "lighter";
		const {description, character} = c;
		const charBoxProps = {
			isFavorite,
			characterBoxWidth,
			character,
			textProps
		};
		const nameProps = {
			description,
			nameWidth,
			textProps
		};
		function tappingNow () {
			characterTapped(c);
		};
		return (
			<Pressable
				onPress={tappingNow}
			>
				<HStack
					alignItems="center"
					justifyContent="center"
					m={1}
					px={1.5}
					py={1}
					bg={bg}
					style={{maxWidth: innerWidth}}
					space={0}
				>
					{showNames && <MakeName {...nameProps} />}
					<CharBox {...charBoxProps} />
				</HStack>
			</Pressable>
		);
	});
	const DisplayGroup = memo(({ group, showNames }) => {
		console.log("Displaying " + group);
		const { title, content } = allGroups[group];
		const stackProps = showNames ? {
			direction: "column",
			flexWrap: "nowrap"
		} : {
			direction: "row",
			flexWrap: "wrap"
		};
		const itemProps = {
			innerWidth,
			faveString,
			showNames,
			characterBoxWidth,
			textProps,
			nameWidth
		};
		return (
			<VStack key={`${title}-Group`} justifyContent="center" alignItems="center" style={{maxWidth: innerWidth}}>
				<Stack justifyContent="center" alignItems="center" {...stackProps}>
					{content.map((c, i) => <Item
						key={`character-${title}-${i}`}
						c={c}
						{...itemProps}
					/>)}
				</Stack>
			</VStack>
		);
	});
	
	const getGroupButton = useCallback((g) => {
		const doSetNowShowing = useCallback(() => dispatch(setNowShowing(g)));
		const displayProps = nowShowing === g ? {
			variant: "solid",
			borderWidth: 1,
			borderColor: "primary.500"
		} : {
			opacity: 75,
			variant: "outline"
		};
		return (
			<Button
				colorScheme="primary"
				key={`Button-${g}`}
				size="xs"
				borderRadius="full"
				pt={0}
				pb={0.5}
				m={1}
				onPress={doSetNowShowing}
				{...displayProps}
			>
				<Text color="text.50" fontSize={buttonTextSize} fontFamily="Noto Sans">{g}</Text>
			</Button>
		);
	});

	// Main JSX
	return (
		<VStack style={{height: mainHeight}}>
			<HStack flexGrow={0}>
				<IconButton
					variant="solid"
					size={textSize}
					colorScheme="secondary"
					icon={<FaveIcon size={textSize} color={"secondary." + (settingFaves ? "50" : "900")} />}
					flexGrow={0}
					flexShrink={0}
					onPress={toggleFavorites}
					m={0.5}
				/>
				<IconButton
					variant="solid"
					size={textSize}
					colorScheme="secondary"
					icon={<CopyIcon size={textSize} color={"secondary." + (copyImmediately ? "50" : "900")} />}
					flexGrow={0}
					flexShrink={0}
					onPress={toggleCopying}
					m={0.5}
				/>
				<Input
					value={inputText}
					placeholder="Tap characters to add them here"
					onChangeText={(text) => setInputText(text)}
					fontSize={textSize}
					disabled={settingFaves}
					flexShrink={0}
					flexGrow={1}
					m={0.5}
				/>
				<IconButton
					variant="solid"
					size={textSize}
					colorScheme="secondary"
					icon={<NamesIcon size={textSize} color={"secondary." + (showNames ? "50" : "900")} />}
					flexGrow={0}
					flexShrink={0}
					onPress={toggleShowingNames}
					m={0.5}
				/>
			</HStack>
			<ScrollView flexGrow={1} px={4} style={{height: scrollHeight, width: scrollWidth}}>
				<HStack bg="main.900" borderRadius="lg" m={2} flexWrap="wrap" justifyContent="center">
					{groupNames.map(g => getGroupButton(g))}
				</HStack>
				<DisplayGroup group={nowShowing} showNames={showNames} />
			</ScrollView>
			<HStack
				w="full"
				justifyContent="flex-end"
				alignItems="center"
				px={1.5}
				bg="main.700"
				flexGrow={0}
				style={{height:bottomBarHeight}}
			>
				<Button
					m={0}
					startIcon={<OkIcon size={textSize} />}
					onPress={() => {
						navigate(history[0]);
						dispatch(removeLastPageFromHistory());
					}}
					_text={{fontSize: textSize}}
					bg="primary.500"
					color="primary.50"
				>Done</Button>
			</HStack>
		</VStack>
	);
};

export default ExtraChars;

const Latin = {
	title: "Latin",
	content: [
		{
			"description": "Inverted Exclamation Mark",
			"character": "¡"
		},
		{
			"description": "Inverted Question Mark",
			"character": "¿"
		},
		{
			"description": "Latin Capital Letter A with Acute",
			"character": "Á"
		},
		{
			"description": "Latin Small Letter A with Acute",
			"character": "á"
		},
		{
			"description": "Latin Capital Letter A with Breve",
			"character": "Ă"
		},
		{
			"description": "Latin Small Letter A with Breve",
			"character": "ă"
		},
		{
			"description": "Latin Capital Letter A with Caron",
			"character": "Ǎ"
		},
		{
			"description": "Latin Small Letter A with Caron",
			"character": "ǎ"
		},
		{
			"description": "Latin Capital Letter A with Circumflex",
			"character": "Â"
		},
		{
			"description": "Latin Small Letter A with Circumflex",
			"character": "â"
		},
		{
			"description": "Latin Capital Letter A with Diaeresis",
			"character": "Ä"
		},
		{
			"description": "Latin Small Letter A with Diaeresis",
			"character": "ä"
		},
		{
			"description": "Latin Capital Letter A with Diaeresis and Macron",
			"character": "Ǟ"
		},
		{
			"description": "Latin Small Letter A with Diaeresis and Macron",
			"character": "ǟ"
		},
		{
			"description": "Latin Capital Letter A with Dot Above",
			"character": "Ȧ"
		},
		{
			"description": "Latin Small Letter A with Dot Above",
			"character": "ȧ"
		},
		{
			"description": "Latin Capital Letter A with Dot Above and Macron",
			"character": "Ǡ"
		},
		{
			"description": "Latin Small Letter A with Dot Above and Macron",
			"character": "ǡ"
		},
		{
			"description": "Latin Capital Letter A with Double Grave",
			"character": "Ȁ"
		},
		{
			"description": "Latin Small Letter A with Double Grave",
			"character": "ȁ"
		},
		{
			"description": "Latin Capital Letter A with Grave",
			"character": "À"
		},
		{
			"description": "Latin Small Letter A with Grave",
			"character": "à"
		},
		{
			"description": "Latin Capital Letter A with Inverted Breve",
			"character": "Ȃ"
		},
		{
			"description": "Latin Small Letter A with Inverted Breve",
			"character": "ȃ"
		},
		{
			"description": "Latin Capital Letter A with Macron",
			"character": "Ā"
		},
		{
			"description": "Latin Small Letter A with Macron",
			"character": "ā"
		},
		{
			"description": "Latin Capital Letter A with Ogonek",
			"character": "Ą"
		},
		{
			"description": "Latin Small Letter A with Ogonek",
			"character": "ą"
		},
		{
			"description": "Latin Capital Letter A with Ring Above",
			"character": "Å"
		},
		{
			"description": "Latin Small Letter A with Ring Above",
			"character": "å"
		},
		{
			"description": "Latin Capital Letter A with Ring Above and Acute",
			"character": "Ǻ"
		},
		{
			"description": "Latin Small Letter A with Ring Above and Acute",
			"character": "ǻ"
		},
		{
			"description": "Latin Capital Letter A with Stroke",
			"character": "Ⱥ"
		},
		{
			"description": "Latin Small Letter A with Stroke",
			"character": "ⱥ"
		},
		{
			"description": "Latin Capital Letter A with Tilde",
			"character": "Ã"
		},
		{
			"description": "Latin Small Letter A with Tilde",
			"character": "ã"
		},
		{
			"description": "Latin Capital Letter Turned A",
			"character": "Ɐ"
		},
		{
			"description": "Latin Capital Letter A with Ring Below",
			"character": "Ḁ"
		},
		{
			"description": "Latin Small Letter A with Ring Below",
			"character": "ḁ"
		},
		{
			"description": "Latin Small Letter A with Right Half Ring",
			"character": "ẚ"
		},
		{
			"description": "Latin Capital Letter A with Dot Below",
			"character": "Ạ"
		},
		{
			"description": "Latin Small Letter A with Dot Below",
			"character": "ạ"
		},
		{
			"description": "Latin Capital Letter A with Hook Above",
			"character": "Ả"
		},
		{
			"description": "Latin Small Letter A with Hook Above",
			"character": "ả"
		},
		{
			"description": "Latin Capital Letter A with Circumflex and Acute",
			"character": "Ấ"
		},
		{
			"description": "Latin Small Letter A with Circumflex and Acute",
			"character": "ấ"
		},
		{
			"description": "Latin Capital Letter A with Circumflex and Grave",
			"character": "Ầ"
		},
		{
			"description": "Latin Small Letter A with Circumflex and Grave",
			"character": "ầ"
		},
		{
			"description": "Latin Capital Letter A with Circumflex and Hook Above",
			"character": "Ẩ"
		},
		{
			"description": "Latin Small Letter A with Circumflex and Hook Above",
			"character": "ẩ"
		},
		{
			"description": "Latin Capital Letter A with Circumflex and Tilde",
			"character": "Ẫ"
		},
		{
			"description": "Latin Small Letter A with Circumflex and Tilde",
			"character": "ẫ"
		},
		{
			"description": "Latin Capital Letter A with Circumflex and Dot Below",
			"character": "Ậ"
		},
		{
			"description": "Latin Small Letter A with Circumflex and Dot Below",
			"character": "ậ"
		},
		{
			"description": "Latin Capital Letter A with Breve and Acute",
			"character": "Ắ"
		},
		{
			"description": "Latin Small Letter A with Breve and Acute",
			"character": "ắ"
		},
		{
			"description": "Latin Capital Letter A with Breve and Grave",
			"character": "Ằ"
		},
		{
			"description": "Latin Small Letter A with Breve and Grave",
			"character": "ằ"
		},
		{
			"description": "Latin Capital Letter A with Breve and Hook Above",
			"character": "Ẳ"
		},
		{
			"description": "Latin Small Letter A with Breve and Hook Above",
			"character": "ẳ"
		},
		{
			"description": "Latin Capital Letter A with Breve and Tilde",
			"character": "Ẵ"
		},
		{
			"description": "Latin Small Letter A with Breve and Tilde",
			"character": "ẵ"
		},
		{
			"description": "Latin Capital Letter A with Breve and Dot Below",
			"character": "Ặ"
		},
		{
			"description": "Latin Small Letter A with Breve and Dot Below",
			"character": "ặ"
		},
		{
			"description": "Latin Capital Letter Aa",
			"character": "Ꜳ"
		},
		{
			"description": "Latin Small Letter Aa",
			"character": "ꜳ"
		},
		{
			"description": "Latin Capital Letter Ae",
			"character": "Æ"
		},
		{
			"description": "Latin Small Letter Ae",
			"character": "æ"
		},
		{
			"description": "Latin Capital Letter Ae with Acute",
			"character": "Ǽ"
		},
		{
			"description": "Latin Small Letter Ae with Acute",
			"character": "ǽ"
		},
		{
			"description": "Latin Capital Letter Ae with Macron",
			"character": "Ǣ"
		},
		{
			"description": "Latin Small Letter Ae with Macron",
			"character": "ǣ"
		},
		{
			"description": "Latin Small Letter A Reversed-Schwa",
			"character": "ꬱ"
		},
		{
			"description": "Latin Capital Letter Volapuk Ae",
			"character": "Ꞛ"
		},
		{
			"description": "Latin Small Letter Volapuk Ae",
			"character": "ꞛ"
		},
		{
			"description": "Latin Capital Letter Ao",
			"character": "Ꜵ"
		},
		{
			"description": "Latin Small Letter Ao",
			"character": "ꜵ"
		},
		{
			"description": "Latin Capital Letter Au",
			"character": "Ꜷ"
		},
		{
			"description": "Latin Small Letter Au",
			"character": "ꜷ"
		},
		{
			"description": "Latin Capital Letter Av",
			"character": "Ꜹ"
		},
		{
			"description": "Latin Small Letter Av",
			"character": "ꜹ"
		},
		{
			"description": "Latin Capital Letter Av with Horizontal Bar",
			"character": "Ꜻ"
		},
		{
			"description": "Latin Small Letter Av with Horizontal Bar",
			"character": "ꜻ"
		},
		{
			"description": "Latin Capital Letter Ay",
			"character": "Ꜽ"
		},
		{
			"description": "Latin Small Letter Ay",
			"character": "ꜽ"
		},
		{
			"description": "Latin Capital Letter B with Flourish",
			"character": "Ꞗ"
		},
		{
			"description": "Latin Small Letter B with Flourish",
			"character": "ꞗ"
		},
		{
			"description": "Latin Capital Letter B with Hook",
			"character": "Ɓ"
		},
		{
			"description": "Latin Capital Letter B with Stroke",
			"character": "Ƀ"
		},
		{
			"description": "Latin Small Letter B with Stroke",
			"character": "ƀ"
		},
		{
			"description": "Latin Capital Letter B with Topbar",
			"character": "Ƃ"
		},
		{
			"description": "Latin Small Letter B with Topbar",
			"character": "ƃ"
		},
		{
			"description": "Latin Capital Letter B with Dot Above",
			"character": "Ḃ"
		},
		{
			"description": "Latin Small Letter B with Dot Above",
			"character": "ḃ"
		},
		{
			"description": "Latin Capital Letter B with Dot Below",
			"character": "Ḅ"
		},
		{
			"description": "Latin Small Letter B with Dot Below",
			"character": "ḅ"
		},
		{
			"description": "Latin Capital Letter B with Line Below",
			"character": "Ḇ"
		},
		{
			"description": "Latin Small Letter B with Line Below",
			"character": "ḇ"
		},
		{
			"description": "Latin Capital Letter C with Acute",
			"character": "Ć"
		},
		{
			"description": "Latin Small Letter C with Acute",
			"character": "ć"
		},
		{
			"description": "Latin Capital Letter C with Bar",
			"character": "Ꞓ"
		},
		{
			"description": "Latin Small Letter C with Bar",
			"character": "ꞓ"
		},
		{
			"description": "Latin Capital Letter C with Caron",
			"character": "Č"
		},
		{
			"description": "Latin Small Letter C with Caron",
			"character": "č"
		},
		{
			"description": "Latin Capital Letter C with Cedilla",
			"character": "Ç"
		},
		{
			"description": "Latin Small Letter C with Cedilla",
			"character": "ç"
		},
		{
			"description": "Latin Capital Letter C with Circumflex",
			"character": "Ĉ"
		},
		{
			"description": "Latin Small Letter C with Circumflex",
			"character": "ĉ"
		},
		{
			"description": "Latin Capital Letter C with Dot Above",
			"character": "Ċ"
		},
		{
			"description": "Latin Small Letter C with Dot Above",
			"character": "ċ"
		},
		{
			"description": "Latin Capital Letter C with Hook",
			"character": "Ƈ"
		},
		{
			"description": "Latin Small Letter C with Hook",
			"character": "ƈ"
		},
		{
			"description": "Latin Small Letter C with Palatal Hook",
			"character": "ꞔ"
		},
		{
			"description": "Latin Capital Letter C with Stroke",
			"character": "Ȼ"
		},
		{
			"description": "Latin Small Letter C with Stroke",
			"character": "ȼ"
		},
		{
			"description": "Latin Capital Letter C with Cedilla and Acute",
			"character": "Ḉ"
		},
		{
			"description": "Latin Small Letter C with Cedilla and Acute",
			"character": "ḉ"
		},
		{
			"description": "Latin Capital Letter Reversed C with Dot",
			"character": "Ꜿ"
		},
		{
			"description": "Latin Small Letter Reversed C with Dot",
			"character": "ꜿ"
		},
		{
			"description": "Latin Capital Letter D with Caron",
			"character": "Ď"
		},
		{
			"description": "Latin Small Letter D with Caron",
			"character": "ď"
		},
		{
			"description": "Latin Small Letter D with Curl",
			"character": "ȡ"
		},
		{
			"description": "Latin Capital Letter D with Hook",
			"character": "Ɗ"
		},
		{
			"description": "Latin Capital Letter D with Stroke",
			"character": "Đ"
		},
		{
			"description": "Latin Small Letter D with Stroke",
			"character": "đ"
		},
		{
			"description": "Latin Capital Letter D with Topbar",
			"character": "Ƌ"
		},
		{
			"description": "Latin Small Letter D with Topbar",
			"character": "ƌ"
		},
		{
			"description": "Latin Capital Letter D with Small Letter Z",
			"character": "ǲ"
		},
		{
			"description": "Latin Capital Letter D with Small Letter Z with Caron",
			"character": "ǅ"
		},
		{
			"description": "Latin Capital Letter African D",
			"character": "Ɖ"
		},
		{
			"description": "Latin Small Letter Dum",
			"character": "ꝱ"
		},
		{
			"description": "Latin Capital Letter D with Dot Above",
			"character": "Ḋ"
		},
		{
			"description": "Latin Small Letter D with Dot Above",
			"character": "ḋ"
		},
		{
			"description": "Latin Capital Letter D with Dot Below",
			"character": "Ḍ"
		},
		{
			"description": "Latin Small Letter D with Dot Below",
			"character": "ḍ"
		},
		{
			"description": "Latin Capital Letter D with Line Below",
			"character": "Ḏ"
		},
		{
			"description": "Latin Small Letter D with Line Below",
			"character": "ḏ"
		},
		{
			"description": "Latin Capital Letter D with Cedilla",
			"character": "Ḑ"
		},
		{
			"description": "Latin Small Letter D with Cedilla",
			"character": "ḑ"
		},
		{
			"description": "Latin Capital Letter D with Circumflex Below",
			"character": "Ḓ"
		},
		{
			"description": "Latin Small Letter D with Circumflex Below",
			"character": "ḓ"
		},
		{
			"description": "Latin Capital Letter Insular D",
			"character": "Ꝺ"
		},
		{
			"description": "Latin Small Letter Insular D",
			"character": "ꝺ"
		},
		{
			"description": "Latin Small Letter Db Digraph",
			"character": "ȸ"
		},
		{
			"description": "Latin Capital Letter Dz",
			"character": "Ǳ"
		},
		{
			"description": "Latin Small Letter Dz",
			"character": "ǳ"
		},
		{
			"description": "Latin Capital Letter Dz with Caron",
			"character": "Ǆ"
		},
		{
			"description": "Latin Small Letter Dz with Caron",
			"character": "ǆ"
		},
		{
			"description": "Latin Capital Letter E with Acute",
			"character": "É"
		},
		{
			"description": "Latin Small Letter E with Acute",
			"character": "é"
		},
		{
			"description": "Latin Capital Letter E with Breve",
			"character": "Ĕ"
		},
		{
			"description": "Latin Small Letter E with Breve",
			"character": "ĕ"
		},
		{
			"description": "Latin Capital Letter E with Caron",
			"character": "Ě"
		},
		{
			"description": "Latin Small Letter E with Caron",
			"character": "ě"
		},
		{
			"description": "Latin Capital Letter E with Cedilla",
			"character": "Ȩ"
		},
		{
			"description": "Latin Small Letter E with Cedilla",
			"character": "ȩ"
		},
		{
			"description": "Latin Capital Letter E with Circumflex",
			"character": "Ê"
		},
		{
			"description": "Latin Small Letter E with Circumflex",
			"character": "ê"
		},
		{
			"description": "Latin Capital Letter E with Diaeresis",
			"character": "Ë"
		},
		{
			"description": "Latin Small Letter E with Diaeresis",
			"character": "ë"
		},
		{
			"description": "Latin Capital Letter E with Dot Above",
			"character": "Ė"
		},
		{
			"description": "Latin Small Letter E with Dot Above",
			"character": "ė"
		},
		{
			"description": "Latin Capital Letter E with Double Grave",
			"character": "Ȅ"
		},
		{
			"description": "Latin Small Letter E with Double Grave",
			"character": "ȅ"
		},
		{
			"description": "Latin Small Letter E with Flourish",
			"character": "ꬴ"
		},
		{
			"description": "Latin Capital Letter E with Grave",
			"character": "È"
		},
		{
			"description": "Latin Small Letter E with Grave",
			"character": "è"
		},
		{
			"description": "Latin Capital Letter E with Inverted Breve",
			"character": "Ȇ"
		},
		{
			"description": "Latin Small Letter E with Inverted Breve",
			"character": "ȇ"
		},
		{
			"description": "Latin Capital Letter E with Macron",
			"character": "Ē"
		},
		{
			"description": "Latin Small Letter E with Macron",
			"character": "ē"
		},
		{
			"description": "Latin Small Letter E with Notch",
			"character": "ⱸ"
		},
		{
			"description": "Latin Capital Letter E with Ogonek",
			"character": "Ę"
		},
		{
			"description": "Latin Small Letter E with Ogonek",
			"character": "ę"
		},
		{
			"description": "Latin Capital Letter E with Stroke",
			"character": "Ɇ"
		},
		{
			"description": "Latin Small Letter E with Stroke",
			"character": "ɇ"
		},
		{
			"description": "Latin Small Letter Barred E",
			"character": "ꬳ"
		},
		{
			"description": "Latin Small Letter Blackletter E",
			"character": "ꬲ"
		},
		{
			"description": "Latin Letter Small Capital Turned E",
			"character": "ⱻ"
		},
		{
			"description": "Latin Capital Letter Open E",
			"character": "Ɛ"
		},
		{
			"description": "Latin Capital Letter Reversed E",
			"character": "Ǝ"
		},
		{
			"description": "Latin Capital Letter Reversed Open E",
			"character": "Ɜ"
		},
		{
			"description": "Latin Capital Letter E with Macron and Grave",
			"character": "Ḕ"
		},
		{
			"description": "Latin Small Letter E with Macron and Grave",
			"character": "ḕ"
		},
		{
			"description": "Latin Capital Letter E with Macron and Acute",
			"character": "Ḗ"
		},
		{
			"description": "Latin Small Letter E with Macron and Acute",
			"character": "ḗ"
		},
		{
			"description": "Latin Capital Letter E with Circumflex Below",
			"character": "Ḙ"
		},
		{
			"description": "Latin Small Letter E with Circumflex Below",
			"character": "ḙ"
		},
		{
			"description": "Latin Capital Letter E with Tilde Below",
			"character": "Ḛ"
		},
		{
			"description": "Latin Small Letter E with Tilde Below",
			"character": "ḛ"
		},
		{
			"description": "Latin Capital Letter E with Cedilla and Breve",
			"character": "Ḝ"
		},
		{
			"description": "Latin Small Letter E with Cedilla and Breve",
			"character": "ḝ"
		},
		{
			"description": "Latin Capital Letter E with Dot Below",
			"character": "Ẹ"
		},
		{
			"description": "Latin Small Letter E with Dot Below",
			"character": "ẹ"
		},
		{
			"description": "Latin Capital Letter E with Hook Above",
			"character": "Ẻ"
		},
		{
			"description": "Latin Small Letter E with Hook Above",
			"character": "ẻ"
		},
		{
			"description": "Latin Capital Letter E with Tilde",
			"character": "Ẽ"
		},
		{
			"description": "Latin Small Letter E with Tilde",
			"character": "ẽ"
		},
		{
			"description": "Latin Capital Letter E with Circumflex and Acute",
			"character": "Ế"
		},
		{
			"description": "Latin Small Letter E with Circumflex and Acute",
			"character": "ế"
		},
		{
			"description": "Latin Capital Letter E with Circumflex and Grave",
			"character": "Ề"
		},
		{
			"description": "Latin Small Letter E with Circumflex and Grave",
			"character": "ề"
		},
		{
			"description": "Latin Capital Letter E with Circumflex and Hook Above",
			"character": "Ể"
		},
		{
			"description": "Latin Small Letter E with Circumflex and Hook Above",
			"character": "ể"
		},
		{
			"description": "Latin Capital Letter E with Circumflex and Tilde",
			"character": "Ễ"
		},
		{
			"description": "Latin Small Letter E with Circumflex and Tilde",
			"character": "ễ"
		},
		{
			"description": "Latin Capital Letter E with Circumflex and Dot Below",
			"character": "Ệ"
		},
		{
			"description": "Latin Small Letter E with Circumflex and Dot Below",
			"character": "ệ"
		},
		{
			"description": "Latin Capital Letter Tresillo",
			"character": "Ꜫ"
		},
		{
			"description": "Latin Small Letter Tresillo",
			"character": "ꜫ"
		},
		{
			"description": "Latin Small Letter Turned E",
			"character": "ǝ"
		},
		{
			"description": "Latin Capital Letter Schwa",
			"character": "Ə"
		},
		{
			"description": "Latin Capital Letter F with Hook",
			"character": "Ƒ"
		},
		{
			"description": "Latin Small Letter F with Hook",
			"character": "ƒ"
		},
		{
			"description": "Latin Capital Letter F with Stroke",
			"character": "Ꞙ"
		},
		{
			"description": "Latin Small Letter F with Stroke",
			"character": "ꞙ"
		},
		{
			"description": "Latin Letter Small Capital F",
			"character": "ꜰ"
		},
		{
			"description": "Latin Small Letter Lenis F",
			"character": "ꬵ"
		},
		{
			"description": "Latin Capital Letter Insular F",
			"character": "Ꝼ"
		},
		{
			"description": "Latin Small Letter Insular F",
			"character": "ꝼ"
		},
		{
			"description": "Latin Capital Letter F with Dot Above",
			"character": "Ḟ"
		},
		{
			"description": "Latin Small Letter F with Dot Above",
			"character": "ḟ"
		},
		{
			"description": "Latin Capital Letter G with Acute",
			"character": "Ǵ"
		},
		{
			"description": "Latin Small Letter G with Acute",
			"character": "ǵ"
		},
		{
			"description": "Latin Capital Letter G with Breve",
			"character": "Ğ"
		},
		{
			"description": "Latin Small Letter G with Breve",
			"character": "ğ"
		},
		{
			"description": "Latin Capital Letter G with Caron",
			"character": "Ǧ"
		},
		{
			"description": "Latin Small Letter G with Caron",
			"character": "ǧ"
		},
		{
			"description": "Latin Capital Letter G with Cedilla",
			"character": "Ģ"
		},
		{
			"description": "Latin Small Letter G with Cedilla",
			"character": "ģ"
		},
		{
			"description": "Latin Capital Letter G with Circumflex",
			"character": "Ĝ"
		},
		{
			"description": "Latin Small Letter G with Circumflex",
			"character": "ĝ"
		},
		{
			"description": "Latin Capital Letter G with Dot Above",
			"character": "Ġ"
		},
		{
			"description": "Latin Small Letter G with Dot Above",
			"character": "ġ"
		},
		{
			"description": "Latin Capital Letter G with Hook",
			"character": "Ɠ"
		},
		{
			"description": "Latin Capital Letter G with Oblique Stroke",
			"character": "Ꞡ"
		},
		{
			"description": "Latin Small Letter G with Oblique Stroke",
			"character": "ꞡ"
		},
		{
			"description": "Latin Capital Letter G with Stroke",
			"character": "Ǥ"
		},
		{
			"description": "Latin Small Letter G with Stroke",
			"character": "ǥ"
		},
		{
			"description": "Latin Capital Letter Insular G",
			"character": "Ᵹ"
		},
		{
			"description": "Latin Capital Letter Script G",
			"character": "Ɡ"
		},
		{
			"description": "Latin Small Letter Script G with Crossed-Tail",
			"character": "ꬶ"
		},
		{
			"description": "Latin Capital Letter Turned Insular G",
			"character": "Ꝿ"
		},
		{
			"description": "Latin Small Letter Turned Insular G",
			"character": "ꝿ"
		},
		{
			"description": "Latin Capital Letter G with Macron",
			"character": "Ḡ"
		},
		{
			"description": "Latin Small Letter G with Macron",
			"character": "ḡ"
		},
		{
			"description": "Latin Capital Letter H with Caron",
			"character": "Ȟ"
		},
		{
			"description": "Latin Small Letter H with Caron",
			"character": "ȟ"
		},
		{
			"description": "Latin Capital Letter H with Circumflex",
			"character": "Ĥ"
		},
		{
			"description": "Latin Small Letter H with Circumflex",
			"character": "ĥ"
		},
		{
			"description": "Latin Capital Letter H with Descender",
			"character": "Ⱨ"
		},
		{
			"description": "Latin Small Letter H with Descender",
			"character": "ⱨ"
		},
		{
			"description": "Latin Capital Letter H with Hook",
			"character": "Ɦ"
		},
		{
			"description": "Latin Small Letter H with Palatal Hook",
			"character": "ꞕ"
		},
		{
			"description": "Latin Capital Letter H with Stroke",
			"character": "Ħ"
		},
		{
			"description": "Latin Small Letter H with Stroke",
			"character": "ħ"
		},
		{
			"description": "Latin Capital Letter Half H",
			"character": "Ⱶ"
		},
		{
			"description": "Latin Small Letter Half H",
			"character": "ⱶ"
		},
		{
			"description": "Latin Capital Letter Turned H",
			"character": "Ɥ"
		},
		{
			"description": "Latin Capital Letter H with Dot Above",
			"character": "Ḣ"
		},
		{
			"description": "Latin Small Letter H with Dot Above",
			"character": "ḣ"
		},
		{
			"description": "Latin Capital Letter H with Dot Below",
			"character": "Ḥ"
		},
		{
			"description": "Latin Small Letter H with Dot Below",
			"character": "ḥ"
		},
		{
			"description": "Latin Capital Letter H with Diaeresis",
			"character": "Ḧ"
		},
		{
			"description": "Latin Small Letter H with Diaeresis",
			"character": "ḧ"
		},
		{
			"description": "Latin Capital Letter H with Cedilla",
			"character": "Ḩ"
		},
		{
			"description": "Latin Small Letter H with Cedilla",
			"character": "ḩ"
		},
		{
			"description": "Latin Capital Letter H with Breve Below",
			"character": "Ḫ"
		},
		{
			"description": "Latin Small Letter H with Breve Below",
			"character": "ḫ"
		},
		{
			"description": "Latin Small Letter H with Line Below",
			"character": "ẖ"
		},
		{
			"description": "Latin Capital Letter Heng",
			"character": "Ꜧ"
		},
		{
			"description": "Latin Small Letter Heng",
			"character": "ꜧ"
		},
		{
			"description": "Latin Small Letter Hv",
			"character": "ƕ"
		},
		{
			"description": "Latin Capital Letter Hwair",
			"character": "Ƕ"
		},
		{
			"description": "Latin Capital Letter I with Acute",
			"character": "Í"
		},
		{
			"description": "Latin Small Letter I with Acute",
			"character": "í"
		},
		{
			"description": "Latin Capital Letter I with Breve",
			"character": "Ĭ"
		},
		{
			"description": "Latin Small Letter I with Breve",
			"character": "ĭ"
		},
		{
			"description": "Latin Capital Letter I with Caron",
			"character": "Ǐ"
		},
		{
			"description": "Latin Small Letter I with Caron",
			"character": "ǐ"
		},
		{
			"description": "Latin Capital Letter I with Circumflex",
			"character": "Î"
		},
		{
			"description": "Latin Small Letter I with Circumflex",
			"character": "î"
		},
		{
			"description": "Latin Capital Letter I with Diaeresis",
			"character": "Ï"
		},
		{
			"description": "Latin Small Letter I with Diaeresis",
			"character": "ï"
		},
		{
			"description": "Latin Capital Letter I with Dot Above",
			"character": "İ"
		},
		{
			"description": "Latin Capital Letter I with Double Grave",
			"character": "Ȉ"
		},
		{
			"description": "Latin Small Letter I with Double Grave",
			"character": "ȉ"
		},
		{
			"description": "Latin Capital Letter I with Grave",
			"character": "Ì"
		},
		{
			"description": "Latin Small Letter I with Grave",
			"character": "ì"
		},
		{
			"description": "Latin Capital Letter I with Inverted Breve",
			"character": "Ȋ"
		},
		{
			"description": "Latin Small Letter I with Inverted Breve",
			"character": "ȋ"
		},
		{
			"description": "Latin Capital Letter I with Macron",
			"character": "Ī"
		},
		{
			"description": "Latin Small Letter I with Macron",
			"character": "ī"
		},
		{
			"description": "Latin Capital Letter I with Ogonek",
			"character": "Į"
		},
		{
			"description": "Latin Small Letter I with Ogonek",
			"character": "į"
		},
		{
			"description": "Latin Capital Letter I with Stroke",
			"character": "Ɨ"
		},
		{
			"description": "Latin Capital Letter I with Tilde",
			"character": "Ĩ"
		},
		{
			"description": "Latin Small Letter I with Tilde",
			"character": "ĩ"
		},
		{
			"description": "Latin Small Letter Dotless I",
			"character": "ı"
		},
		{
			"description": "Latin Capital Letter I with Tilde Below",
			"character": "Ḭ"
		},
		{
			"description": "Latin Small Letter I with Tilde Below",
			"character": "ḭ"
		},
		{
			"description": "Latin Capital Letter I with Diaeresis and Acute",
			"character": "Ḯ"
		},
		{
			"description": "Latin Small Letter I with Diaeresis and Acute",
			"character": "ḯ"
		},
		{
			"description": "Latin Capital Letter I with Hook Above",
			"character": "Ỉ"
		},
		{
			"description": "Latin Small Letter I with Hook Above",
			"character": "ỉ"
		},
		{
			"description": "Latin Capital Letter I with Dot Below",
			"character": "Ị"
		},
		{
			"description": "Latin Small Letter I with Dot Below",
			"character": "ị"
		},
		{
			"description": "Latin Capital Letter Is",
			"character": "Ꝭ"
		},
		{
			"description": "Latin Small Letter Is",
			"character": "ꝭ"
		},
		{
			"description": "Latin Small Letter Iotified E",
			"character": "ꭡ",
			"unsupported": true
		},
		{
			"description": "Latin Capital Ligature Ij",
			"character": "Ĳ"
		},
		{
			"description": "Latin Small Ligature Ij",
			"character": "ĳ"
		},
		{
			"description": "Latin Small Letter J with Caron",
			"character": "ǰ"
		},
		{
			"description": "Latin Capital Letter J with Circumflex",
			"character": "Ĵ"
		},
		{
			"description": "Latin Small Letter J with Circumflex",
			"character": "ĵ"
		},
		{
			"description": "Latin Capital Letter J with Crossed-Tail",
			"character": "Ʝ",
			"unsupported": true
		},
		{
			"description": "Latin Capital Letter J with Stroke",
			"character": "Ɉ"
		},
		{
			"description": "Latin Small Letter J with Stroke",
			"character": "ɉ"
		},
		{
			"description": "Latin Small Letter Dotless J",
			"character": "ȷ"
		},
		{
			"description": "Latin Subscript Small Letter J",
			"character": "ⱼ"
		},
		{
			"description": "Latin Capital Letter K with Caron",
			"character": "Ǩ"
		},
		{
			"description": "Latin Small Letter K with Caron",
			"character": "ǩ"
		},
		{
			"description": "Latin Capital Letter K with Cedilla",
			"character": "Ķ"
		},
		{
			"description": "Latin Small Letter K with Cedilla",
			"character": "ķ"
		},
		{
			"description": "Latin Capital Letter K with Descender",
			"character": "Ⱪ"
		},
		{
			"description": "Latin Small Letter K with Descender",
			"character": "ⱪ"
		},
		{
			"description": "Latin Capital Letter K with Diagonal Stroke",
			"character": "Ꝃ"
		},
		{
			"description": "Latin Small Letter K with Diagonal Stroke",
			"character": "ꝃ"
		},
		{
			"description": "Latin Capital Letter K with Hook",
			"character": "Ƙ"
		},
		{
			"description": "Latin Small Letter K with Hook",
			"character": "ƙ"
		},
		{
			"description": "Latin Capital Letter K with Oblique Stroke",
			"character": "Ꞣ"
		},
		{
			"description": "Latin Small Letter K with Oblique Stroke",
			"character": "ꞣ"
		},
		{
			"description": "Latin Capital Letter K with Stroke",
			"character": "Ꝁ"
		},
		{
			"description": "Latin Small Letter K with Stroke",
			"character": "ꝁ"
		},
		{
			"description": "Latin Capital Letter K with Stroke and Diagonal Stroke",
			"character": "Ꝅ"
		},
		{
			"description": "Latin Small Letter K with Stroke and Diagonal Stroke",
			"character": "ꝅ"
		},
		{
			"description": "Latin Capital Letter K with Acute",
			"character": "Ḱ"
		},
		{
			"description": "Latin Small Letter K with Acute",
			"character": "ḱ"
		},
		{
			"description": "Latin Capital Letter K with Dot Below",
			"character": "Ḳ"
		},
		{
			"description": "Latin Small Letter K with Dot Below",
			"character": "ḳ"
		},
		{
			"description": "Latin Capital Letter K with Line Below",
			"character": "Ḵ"
		},
		{
			"description": "Latin Small Letter K with Line Below",
			"character": "ḵ"
		},
		{
			"description": "Latin Small Letter Kra",
			"character": "ĸ"
		},
		{
			"description": "Latin Capital Letter Turned K",
			"character": "Ʞ"
		},
		{
			"description": "Latin Capital Letter L with Acute",
			"character": "Ĺ"
		},
		{
			"description": "Latin Small Letter L with Acute",
			"character": "ĺ"
		},
		{
			"description": "Latin Capital Letter L with Bar",
			"character": "Ƚ"
		},
		{
			"description": "Latin Small Letter L with Bar",
			"character": "ƚ"
		},
		{
			"description": "Latin Capital Letter L with Belt",
			"character": "Ɬ"
		},
		{
			"description": "Latin Capital Letter L with Caron",
			"character": "Ľ"
		},
		{
			"description": "Latin Small Letter L with Caron",
			"character": "ľ"
		},
		{
			"description": "Latin Capital Letter L with Cedilla",
			"character": "Ļ"
		},
		{
			"description": "Latin Small Letter L with Cedilla",
			"character": "ļ"
		},
		{
			"description": "Latin Small Letter L with Curl",
			"character": "ȴ"
		},
		{
			"description": "Latin Capital Letter L with Double Bar",
			"character": "Ⱡ"
		},
		{
			"description": "Latin Small Letter L with Double Bar",
			"character": "ⱡ"
		},
		{
			"description": "Latin Small Letter L with Double Middle Tilde",
			"character": "ꬸ"
		},
		{
			"description": "Latin Capital Letter L with High Stroke",
			"character": "Ꝉ"
		},
		{
			"description": "Latin Small Letter L with High Stroke",
			"character": "ꝉ"
		},
		{
			"description": "Latin Small Letter L with Inverted Lazy S",
			"character": "ꬷ"
		},
		{
			"description": "Latin Capital Letter L with Small Letter J",
			"character": "ǈ"
		},
		{
			"description": "Latin Capital Letter L with Middle Dot",
			"character": "Ŀ"
		},
		{
			"description": "Latin Small Letter L with Middle Dot",
			"character": "ŀ"
		},
		{
			"description": "Latin Small Letter L with Middle Ring",
			"character": "ꬹ"
		},
		{
			"description": "Latin Capital Letter L with Middle Tilde",
			"character": "Ɫ"
		},
		{
			"description": "Latin Small Letter L with Retroflex Hook and Belt",
			"character": "ꞎ"
		},
		{
			"description": "Latin Capital Letter L with Stroke",
			"character": "Ł"
		},
		{
			"description": "Latin Small Letter L with Stroke",
			"character": "ł"
		},
		{
			"description": "Latin Capital Letter Broken L",
			"character": "Ꝇ"
		},
		{
			"description": "Latin Small Letter Broken L",
			"character": "ꝇ"
		},
		{
			"description": "Latin Capital Letter Turned L",
			"character": "Ꞁ"
		},
		{
			"description": "Latin Small Letter Turned L",
			"character": "ꞁ"
		},
		{
			"description": "Latin Capital Letter L with Dot Below",
			"character": "Ḷ"
		},
		{
			"description": "Latin Small Letter L with Dot Below",
			"character": "ḷ"
		},
		{
			"description": "Latin Capital Letter L with Dot Below and Macron",
			"character": "Ḹ"
		},
		{
			"description": "Latin Small Letter L with Dot Below and Macron",
			"character": "ḹ"
		},
		{
			"description": "Latin Capital Letter L with Line Below",
			"character": "Ḻ"
		},
		{
			"description": "Latin Small Letter L with Line Below",
			"character": "ḻ"
		},
		{
			"description": "Latin Capital Letter L with Circumflex Below",
			"character": "Ḽ"
		},
		{
			"description": "Latin Small Letter L with Circumflex Below",
			"character": "ḽ"
		},
		{
			"description": "Latin Small Letter Lum",
			"character": "ꝲ"
		},
		{
			"description": "Latin Capital Letter Lj",
			"character": "Ǉ"
		},
		{
			"description": "Latin Small Letter Lj",
			"character": "ǉ"
		},
		{
			"description": "Latin Capital Letter M with Hook",
			"character": "Ɱ"
		},
		{
			"description": "Latin Small Letter M with Crossed-Tail",
			"character": "ꬺ"
		},
		{
			"description": "Latin Capital Letter Turned M",
			"character": "Ɯ"
		},
		{
			"description": "Latin Capital Letter M with Acute",
			"character": "Ḿ"
		},
		{
			"description": "Latin Small Letter M with Acute",
			"character": "ḿ"
		},
		{
			"description": "Latin Capital Letter M with Dot Above",
			"character": "Ṁ"
		},
		{
			"description": "Latin Small Letter M with Dot Above",
			"character": "ṁ"
		},
		{
			"description": "Latin Capital Letter M with Dot Below",
			"character": "Ṃ"
		},
		{
			"description": "Latin Small Letter M with Dot Below",
			"character": "ṃ"
		},
		{
			"description": "Latin Small Letter Mum",
			"character": "ꝳ"
		},
		{
			"description": "Latin Small Letter N Preceded By Apostrophe",
			"character": "ŉ"
		},
		{
			"description": "Latin Capital Letter N with Acute",
			"character": "Ń"
		},
		{
			"description": "Latin Small Letter N with Acute",
			"character": "ń"
		},
		{
			"description": "Latin Capital Letter N with Caron",
			"character": "Ň"
		},
		{
			"description": "Latin Small Letter N with Caron",
			"character": "ň"
		},
		{
			"description": "Latin Capital Letter N with Cedilla",
			"character": "Ņ"
		},
		{
			"description": "Latin Small Letter N with Cedilla",
			"character": "ņ"
		},
		{
			"description": "Latin Small Letter N with Crossed-Tail",
			"character": "ꬻ"
		},
		{
			"description": "Latin Small Letter N with Curl",
			"character": "ȵ"
		},
		{
			"description": "Latin Capital Letter N with Descender",
			"character": "Ꞑ"
		},
		{
			"description": "Latin Small Letter N with Descender",
			"character": "ꞑ"
		},
		{
			"description": "Latin Capital Letter N with Grave",
			"character": "Ǹ"
		},
		{
			"description": "Latin Small Letter N with Grave",
			"character": "ǹ"
		},
		{
			"description": "Latin Capital Letter N with Small Letter J",
			"character": "ǋ"
		},
		{
			"description": "Latin Capital Letter N with Left Hook",
			"character": "Ɲ"
		},
		{
			"description": "Latin Capital Letter N with Long Right Leg",
			"character": "Ƞ"
		},
		{
			"description": "Latin Small Letter N with Long Right Leg",
			"character": "ƞ"
		},
		{
			"description": "Latin Capital Letter N with Oblique Stroke",
			"character": "Ꞥ"
		},
		{
			"description": "Latin Small Letter N with Oblique Stroke",
			"character": "ꞥ"
		},
		{
			"description": "Latin Capital Letter N with Tilde",
			"character": "Ñ"
		},
		{
			"description": "Latin Small Letter N with Tilde",
			"character": "ñ"
		},
		{
			"description": "Latin Capital Letter N with Dot Above",
			"character": "Ṅ"
		},
		{
			"description": "Latin Small Letter N with Dot Above",
			"character": "ṅ"
		},
		{
			"description": "Latin Capital Letter N with Dot Below",
			"character": "Ṇ"
		},
		{
			"description": "Latin Small Letter N with Dot Below",
			"character": "ṇ"
		},
		{
			"description": "Latin Capital Letter N with Line Below",
			"character": "Ṉ"
		},
		{
			"description": "Latin Small Letter N with Line Below",
			"character": "ṉ"
		},
		{
			"description": "Latin Capital Letter N with Circumflex Below",
			"character": "Ṋ"
		},
		{
			"description": "Latin Small Letter N with Circumflex Below",
			"character": "ṋ"
		},
		{
			"description": "Latin Small Letter Num",
			"character": "ꝴ"
		},
		{
			"description": "Latin Capital Letter Nj",
			"character": "Ǌ"
		},
		{
			"description": "Latin Small Letter Nj",
			"character": "ǌ"
		},
		{
			"description": "Latin Capital Letter Eng",
			"character": "Ŋ"
		},
		{
			"description": "Latin Small Letter Eng",
			"character": "ŋ"
		},
		{
			"description": "Latin Small Letter Eng with Crossed-Tail",
			"character": "ꬼ"
		},
		{
			"description": "Latin Capital Letter O with Acute",
			"character": "Ó"
		},
		{
			"description": "Latin Small Letter O with Acute",
			"character": "ó"
		},
		{
			"description": "Latin Capital Letter O with Breve",
			"character": "Ŏ"
		},
		{
			"description": "Latin Small Letter O with Breve",
			"character": "ŏ"
		},
		{
			"description": "Latin Capital Letter O with Caron",
			"character": "Ǒ"
		},
		{
			"description": "Latin Small Letter O with Caron",
			"character": "ǒ"
		},
		{
			"description": "Latin Capital Letter O with Circumflex",
			"character": "Ô"
		},
		{
			"description": "Latin Small Letter O with Circumflex",
			"character": "ô"
		},
		{
			"description": "Latin Capital Letter O with Diaeresis",
			"character": "Ö"
		},
		{
			"description": "Latin Small Letter O with Diaeresis",
			"character": "ö"
		},
		{
			"description": "Latin Capital Letter O with Diaeresis and Macron",
			"character": "Ȫ"
		},
		{
			"description": "Latin Small Letter O with Diaeresis and Macron",
			"character": "ȫ"
		},
		{
			"description": "Latin Capital Letter O with Dot Above",
			"character": "Ȯ"
		},
		{
			"description": "Latin Small Letter O with Dot Above",
			"character": "ȯ"
		},
		{
			"description": "Latin Capital Letter O with Dot Above and Macron",
			"character": "Ȱ"
		},
		{
			"description": "Latin Small Letter O with Dot Above and Macron",
			"character": "ȱ"
		},
		{
			"description": "Latin Capital Letter O with Double Acute",
			"character": "Ő"
		},
		{
			"description": "Latin Small Letter O with Double Acute",
			"character": "ő"
		},
		{
			"description": "Latin Capital Letter O with Double Grave",
			"character": "Ȍ"
		},
		{
			"description": "Latin Small Letter O with Double Grave",
			"character": "ȍ"
		},
		{
			"description": "Latin Capital Letter O with Grave",
			"character": "Ò"
		},
		{
			"description": "Latin Small Letter O with Grave",
			"character": "ò"
		},
		{
			"description": "Latin Capital Letter O with Horn",
			"character": "Ơ"
		},
		{
			"description": "Latin Small Letter O with Horn",
			"character": "ơ"
		},
		{
			"description": "Latin Capital Letter O with Inverted Breve",
			"character": "Ȏ"
		},
		{
			"description": "Latin Small Letter O with Inverted Breve",
			"character": "ȏ"
		},
		{
			"description": "Latin Capital Letter O with Long Stroke Overlay",
			"character": "Ꝋ"
		},
		{
			"description": "Latin Small Letter O with Long Stroke Overlay",
			"character": "ꝋ"
		},
		{
			"description": "Latin Capital Letter O with Loop",
			"character": "Ꝍ"
		},
		{
			"description": "Latin Small Letter O with Loop",
			"character": "ꝍ"
		},
		{
			"description": "Latin Small Letter O with Low Ring Inside",
			"character": "ⱺ"
		},
		{
			"description": "Latin Capital Letter O with Macron",
			"character": "Ō"
		},
		{
			"description": "Latin Small Letter O with Macron",
			"character": "ō"
		},
		{
			"description": "Latin Capital Letter O with Middle Tilde",
			"character": "Ɵ"
		},
		{
			"description": "Latin Capital Letter O with Ogonek",
			"character": "Ǫ"
		},
		{
			"description": "Latin Small Letter O with Ogonek",
			"character": "ǫ"
		},
		{
			"description": "Latin Capital Letter O with Ogonek and Macron",
			"character": "Ǭ"
		},
		{
			"description": "Latin Small Letter O with Ogonek and Macron",
			"character": "ǭ"
		},
		{
			"description": "Latin Capital Letter O with Stroke",
			"character": "Ø"
		},
		{
			"description": "Latin Small Letter O with Stroke",
			"character": "ø"
		},
		{
			"description": "Latin Capital Letter O with Stroke and Acute",
			"character": "Ǿ"
		},
		{
			"description": "Latin Small Letter O with Stroke and Acute",
			"character": "ǿ"
		},
		{
			"description": "Latin Capital Letter O with Tilde",
			"character": "Õ"
		},
		{
			"description": "Latin Small Letter O with Tilde",
			"character": "õ"
		},
		{
			"description": "Latin Capital Letter O with Tilde and Macron",
			"character": "Ȭ"
		},
		{
			"description": "Latin Small Letter O with Tilde and Macron",
			"character": "ȭ"
		},
		{
			"description": "Latin Small Letter Blackletter O",
			"character": "ꬽ"
		},
		{
			"description": "Latin Small Letter Blackletter O with Stroke",
			"character": "ꬾ"
		},
		{
			"description": "Latin Capital Letter Open O",
			"character": "Ɔ"
		},
		{
			"description": "Latin Small Letter Open O with Stroke",
			"character": "ꬿ"
		},
		{
			"description": "Latin Capital Letter O with Tilde and Acute",
			"character": "Ṍ"
		},
		{
			"description": "Latin Small Letter O with Tilde and Acute",
			"character": "ṍ"
		},
		{
			"description": "Latin Capital Letter O with Tilde and Diaeresis",
			"character": "Ṏ"
		},
		{
			"description": "Latin Small Letter O with Tilde and Diaeresis",
			"character": "ṏ"
		},
		{
			"description": "Latin Capital Letter O with Macron and Grave",
			"character": "Ṑ"
		},
		{
			"description": "Latin Small Letter O with Macron and Grave",
			"character": "ṑ"
		},
		{
			"description": "Latin Capital Letter O with Macron and Acute",
			"character": "Ṓ"
		},
		{
			"description": "Latin Small Letter O with Macron and Acute",
			"character": "ṓ"
		},
		{
			"description": "Latin Capital Letter O with Dot Below",
			"character": "Ọ"
		},
		{
			"description": "Latin Small Letter O with Dot Below",
			"character": "ọ"
		},
		{
			"description": "Latin Capital Letter O with Hook Above",
			"character": "Ỏ"
		},
		{
			"description": "Latin Small Letter O with Hook Above",
			"character": "ỏ"
		},
		{
			"description": "Latin Capital Letter O with Circumflex and Acute",
			"character": "Ố"
		},
		{
			"description": "Latin Small Letter O with Circumflex and Acute",
			"character": "ố"
		},
		{
			"description": "Latin Capital Letter O with Circumflex and Grave",
			"character": "Ồ"
		},
		{
			"description": "Latin Small Letter O with Circumflex and Grave",
			"character": "ồ"
		},
		{
			"description": "Latin Capital Letter O with Circumflex and Hook Above",
			"character": "Ổ"
		},
		{
			"description": "Latin Small Letter O with Circumflex and Hook Above",
			"character": "ổ"
		},
		{
			"description": "Latin Capital Letter O with Circumflex and Tilde",
			"character": "Ỗ"
		},
		{
			"description": "Latin Small Letter O with Circumflex and Tilde",
			"character": "ỗ"
		},
		{
			"description": "Latin Capital Letter O with Circumflex and Dot Below",
			"character": "Ộ"
		},
		{
			"description": "Latin Small Letter O with Circumflex and Dot Below",
			"character": "ộ"
		},
		{
			"description": "Latin Capital Letter O with Horn and Acute",
			"character": "Ớ"
		},
		{
			"description": "Latin Small Letter O with Horn and Acute",
			"character": "ớ"
		},
		{
			"description": "Latin Capital Letter O with Horn and Grave",
			"character": "Ờ"
		},
		{
			"description": "Latin Small Letter O with Horn and Grave",
			"character": "ờ"
		},
		{
			"description": "Latin Capital Letter O with Horn and Hook Above",
			"character": "Ở"
		},
		{
			"description": "Latin Small Letter O with Horn and Hook Above",
			"character": "ở"
		},
		{
			"description": "Latin Capital Letter O with Horn and Tilde",
			"character": "Ỡ"
		},
		{
			"description": "Latin Small Letter O with Horn and Tilde",
			"character": "ỡ"
		},
		{
			"description": "Latin Capital Letter O with Horn and Dot Below",
			"character": "Ợ"
		},
		{
			"description": "Latin Small Letter O with Horn and Dot Below",
			"character": "ợ"
		},
		{
			"description": "Latin Capital Ligature Oe",
			"character": "Œ"
		},
		{
			"description": "Latin Small Ligature Oe",
			"character": "œ"
		},
		{
			"description": "Latin Small Letter Inverted Oe",
			"character": "ꭀ"
		},
		{
			"description": "Latin Small Letter Open Oe",
			"character": "ꭢ",
			"unsupported": true
		},
		{
			"description": "Latin Small Letter Turned Oe with Horizontal Stroke",
			"character": "ꭂ"
		},
		{
			"description": "Latin Small Letter Turned Oe with Stroke",
			"character": "ꭁ"
		},
		{
			"description": "Latin Capital Letter Volapuk Oe",
			"character": "Ꞝ"
		},
		{
			"description": "Latin Small Letter Volapuk Oe",
			"character": "ꞝ"
		},
		{
			"description": "Latin Capital Letter Oi",
			"character": "Ƣ"
		},
		{
			"description": "Latin Small Letter Oi",
			"character": "ƣ"
		},
		{
			"description": "Latin Capital Letter Oo",
			"character": "Ꝏ"
		},
		{
			"description": "Latin Small Letter Oo",
			"character": "ꝏ"
		},
		{
			"description": "Latin Small Letter Turned O Open-O",
			"character": "ꭃ"
		},
		{
			"description": "Latin Small Letter Turned O Open-O with Stroke",
			"character": "ꭄ"
		},
		{
			"description": "Latin Capital Letter Ou",
			"character": "Ȣ"
		},
		{
			"description": "Latin Small Letter Ou",
			"character": "ȣ"
		},
		{
			"description": "Latin Capital Letter P with Flourish",
			"character": "Ꝓ"
		},
		{
			"description": "Latin Small Letter P with Flourish",
			"character": "ꝓ"
		},
		{
			"description": "Latin Capital Letter P with Hook",
			"character": "Ƥ"
		},
		{
			"description": "Latin Small Letter P with Hook",
			"character": "ƥ"
		},
		{
			"description": "Latin Capital Letter P with Squirrel Tail",
			"character": "Ꝕ"
		},
		{
			"description": "Latin Small Letter P with Squirrel Tail",
			"character": "ꝕ"
		},
		{
			"description": "Latin Capital Letter P with Stroke",
			"character": "Ᵽ"
		},
		{
			"description": "Latin Capital Letter P with Stroke Through Descender",
			"character": "Ꝑ"
		},
		{
			"description": "Latin Small Letter P with Stroke Through Descender",
			"character": "ꝑ"
		},
		{
			"description": "Latin Capital Letter P with Acute",
			"character": "Ṕ"
		},
		{
			"description": "Latin Small Letter P with Acute",
			"character": "ṕ"
		},
		{
			"description": "Latin Capital Letter P with Dot Above",
			"character": "Ṗ"
		},
		{
			"description": "Latin Small Letter P with Dot Above",
			"character": "ṗ"
		},
		{
			"description": "Latin Letter Wynn",
			"character": "ƿ"
		},
		{
			"description": "Latin Capital Letter Q with Diagonal Stroke",
			"character": "Ꝙ"
		},
		{
			"description": "Latin Small Letter Q with Diagonal Stroke",
			"character": "ꝙ"
		},
		{
			"description": "Latin Small Letter Q with Hook Tail",
			"character": "ɋ"
		},
		{
			"description": "Latin Capital Letter Q with Stroke Through Descender",
			"character": "Ꝗ"
		},
		{
			"description": "Latin Small Letter Q with Stroke Through Descender",
			"character": "ꝗ"
		},
		{
			"description": "Latin Capital Letter Small Q with Hook Tail",
			"character": "Ɋ"
		},
		{
			"description": "Latin Small Letter Qp Digraph",
			"character": "ȹ"
		},
		{
			"description": "Latin Capital Letter R Rotunda",
			"character": "Ꝛ"
		},
		{
			"description": "Latin Small Letter R Rotunda",
			"character": "ꝛ"
		},
		{
			"description": "Latin Capital Letter R with Acute",
			"character": "Ŕ"
		},
		{
			"description": "Latin Small Letter R with Acute",
			"character": "ŕ"
		},
		{
			"description": "Latin Capital Letter R with Caron",
			"character": "Ř"
		},
		{
			"description": "Latin Small Letter R with Caron",
			"character": "ř"
		},
		{
			"description": "Latin Capital Letter R with Cedilla",
			"character": "Ŗ"
		},
		{
			"description": "Latin Small Letter R with Cedilla",
			"character": "ŗ"
		},
		{
			"description": "Latin Small Letter R with Crossed-Tail",
			"character": "ꭉ"
		},
		{
			"description": "Latin Capital Letter R with Double Grave",
			"character": "Ȑ"
		},
		{
			"description": "Latin Small Letter R with Double Grave",
			"character": "ȑ"
		},
		{
			"description": "Latin Capital Letter R with Inverted Breve",
			"character": "Ȓ"
		},
		{
			"description": "Latin Small Letter R with Inverted Breve",
			"character": "ȓ"
		},
		{
			"description": "Latin Capital Letter R with Oblique Stroke",
			"character": "Ꞧ"
		},
		{
			"description": "Latin Small Letter R with Oblique Stroke",
			"character": "ꞧ"
		},
		{
			"description": "Latin Capital Letter R with Stroke",
			"character": "Ɍ"
		},
		{
			"description": "Latin Small Letter R with Stroke",
			"character": "ɍ"
		},
		{
			"description": "Latin Capital Letter R with Tail",
			"character": "Ɽ"
		},
		{
			"description": "Latin Small Letter R Without Handle",
			"character": "ꭇ"
		},
		{
			"description": "Latin Capital Letter R with Dot Above",
			"character": "Ṙ"
		},
		{
			"description": "Latin Small Letter R with Dot Above",
			"character": "ṙ"
		},
		{
			"description": "Latin Capital Letter R with Dot Below",
			"character": "Ṛ"
		},
		{
			"description": "Latin Small Letter R with Dot Below",
			"character": "ṛ"
		},
		{
			"description": "Latin Capital Letter R with Dot Below and Macron",
			"character": "Ṝ"
		},
		{
			"description": "Latin Small Letter R with Dot Below and Macron",
			"character": "ṝ"
		},
		{
			"description": "Latin Capital Letter R with Line Below",
			"character": "Ṟ"
		},
		{
			"description": "Latin Small Letter R with Line Below",
			"character": "ṟ"
		},
		{
			"description": "Latin Small Letter Turned R with Tail",
			"character": "ⱹ"
		},
		{
			"description": "Latin Small Letter Double R",
			"character": "ꭈ"
		},
		{
			"description": "Latin Small Letter Double R with Crossed-Tail",
			"character": "ꭊ"
		},
		{
			"description": "Latin Capital Letter Insular R",
			"character": "Ꞃ"
		},
		{
			"description": "Latin Small Letter Insular R",
			"character": "ꞃ"
		},
		{
			"description": "Latin Letter Small Capital R with Right Leg",
			"character": "ꭆ"
		},
		{
			"description": "Latin Small Letter Rum",
			"character": "ꝵ"
		},
		{
			"description": "Latin Letter Small Capital Rum",
			"character": "ꝶ"
		},
		{
			"description": "Latin Capital Letter Rum Rotunda",
			"character": "Ꝝ"
		},
		{
			"description": "Latin Small Letter Rum Rotunda",
			"character": "ꝝ"
		},
		{
			"description": "Latin Letter Yr",
			"character": "Ʀ"
		},
		{
			"description": "Latin Small Letter Script R",
			"character": "ꭋ"
		},
		{
			"description": "Latin Small Letter Script R with Ring",
			"character": "ꭌ"
		},
		{
			"description": "Latin Small Letter Stirrup R",
			"character": "ꭅ"
		},
		{
			"description": "Latin Capital Letter S with Acute",
			"character": "Ś"
		},
		{
			"description": "Latin Small Letter S with Acute",
			"character": "ś"
		},
		{
			"description": "Latin Capital Letter S with Caron",
			"character": "Š"
		},
		{
			"description": "Latin Small Letter S with Caron",
			"character": "š"
		},
		{
			"description": "Latin Capital Letter S with Cedilla",
			"character": "Ş"
		},
		{
			"description": "Latin Small Letter S with Cedilla",
			"character": "ş"
		},
		{
			"description": "Latin Capital Letter S with Circumflex",
			"character": "Ŝ"
		},
		{
			"description": "Latin Small Letter S with Circumflex",
			"character": "ŝ"
		},
		{
			"description": "Latin Capital Letter S with Comma Below",
			"character": "Ș"
		},
		{
			"description": "Latin Small Letter S with Comma Below",
			"character": "ș"
		},
		{
			"description": "Latin Capital Letter S with Oblique Stroke",
			"character": "Ꞩ"
		},
		{
			"description": "Latin Small Letter S with Oblique Stroke",
			"character": "ꞩ"
		},
		{
			"description": "Latin Capital Letter S with Swash Tail",
			"character": "Ȿ"
		},
		{
			"description": "Latin Small Letter S with Swash Tail",
			"character": "ȿ"
		},
		{
			"description": "Latin Small Letter Sharp S",
			"character": "ß"
		},
		{
			"description": "Latin Letter Small Capital S",
			"character": "ꜱ"
		},
		{
			"description": "Latin Capital Letter Insular S",
			"character": "Ꞅ"
		},
		{
			"description": "Latin Small Letter Insular S",
			"character": "ꞅ"
		},
		{
			"description": "Latin Small Letter Long S",
			"character": "ſ"
		},
		{
			"description": "Latin Small Letter Long S with Dot Above",
			"character": "ẛ"
		},
		{
			"description": "Latin Capital Letter S with Dot Above",
			"character": "Ṡ"
		},
		{
			"description": "Latin Small Letter S with Dot Above",
			"character": "ṡ"
		},
		{
			"description": "Latin Capital Letter S with Dot Below",
			"character": "Ṣ"
		},
		{
			"description": "Latin Small Letter S with Dot Below",
			"character": "ṣ"
		},
		{
			"description": "Latin Capital Letter S with Acute and Dot Above",
			"character": "Ṥ"
		},
		{
			"description": "Latin Small Letter S with Acute and Dot Above",
			"character": "ṥ"
		},
		{
			"description": "Latin Capital Letter S with Caron and Dot Above",
			"character": "Ṧ"
		},
		{
			"description": "Latin Small Letter S with Caron and Dot Above",
			"character": "ṧ"
		},
		{
			"description": "Latin Capital Letter S with Dot Below and Dot Above",
			"character": "Ṩ"
		},
		{
			"description": "Latin Small Letter S with Dot Below and Dot Above",
			"character": "ṩ"
		},
		{
			"description": "Latin Capital Letter Esh",
			"character": "Ʃ"
		},
		{
			"description": "Latin Small Letter Baseline Esh",
			"character": "ꭍ"
		},
		{
			"description": "Latin Letter Reversed Esh Loop",
			"character": "ƪ"
		},
		{
			"description": "Latin Capital Letter T with Caron",
			"character": "Ť"
		},
		{
			"description": "Latin Small Letter T with Caron",
			"character": "ť"
		},
		{
			"description": "Latin Capital Letter T with Cedilla",
			"character": "Ţ"
		},
		{
			"description": "Latin Small Letter T with Cedilla",
			"character": "ţ"
		},
		{
			"description": "Latin Capital Letter T with Comma Below",
			"character": "Ț"
		},
		{
			"description": "Latin Small Letter T with Comma Below",
			"character": "ț"
		},
		{
			"description": "Latin Small Letter T with Curl",
			"character": "ȶ"
		},
		{
			"description": "Latin Capital Letter T with Diagonal Stroke",
			"character": "Ⱦ"
		},
		{
			"description": "Latin Small Letter T with Diagonal Stroke",
			"character": "ⱦ"
		},
		{
			"description": "Latin Capital Letter T with Hook",
			"character": "Ƭ"
		},
		{
			"description": "Latin Small Letter T with Hook",
			"character": "ƭ"
		},
		{
			"description": "Latin Small Letter T with Palatal Hook",
			"character": "ƫ"
		},
		{
			"description": "Latin Capital Letter T with Retroflex Hook",
			"character": "Ʈ"
		},
		{
			"description": "Latin Capital Letter T with Stroke",
			"character": "Ŧ"
		},
		{
			"description": "Latin Small Letter T with Stroke",
			"character": "ŧ"
		},
		{
			"description": "Latin Small Letter Tum",
			"character": "ꝷ"
		},
		{
			"description": "Latin Capital Letter Insular T",
			"character": "Ꞇ"
		},
		{
			"description": "Latin Small Letter Insular T",
			"character": "ꞇ"
		},
		{
			"description": "Latin Capital Letter Turned T",
			"character": "Ʇ"
		},
		{
			"description": "Latin Capital Letter T with Dot Above",
			"character": "Ṫ"
		},
		{
			"description": "Latin Small Letter T with Dot Above",
			"character": "ṫ"
		},
		{
			"description": "Latin Capital Letter T with Dot Below",
			"character": "Ṭ"
		},
		{
			"description": "Latin Small Letter T with Dot Below",
			"character": "ṭ"
		},
		{
			"description": "Latin Capital Letter T with Line Below",
			"character": "Ṯ"
		},
		{
			"description": "Latin Small Letter T with Line Below",
			"character": "ṯ"
		},
		{
			"description": "Latin Capital Letter T with Circumflex Below",
			"character": "Ṱ"
		},
		{
			"description": "Latin Small Letter T with Circumflex Below",
			"character": "ṱ"
		},
		{
			"description": "Latin Small Letter T with Diaeresis",
			"character": "ẗ"
		},
		{
			"description": "Latin Capital Letter Tz",
			"character": "Ꜩ"
		},
		{
			"description": "Latin Small Letter Tz",
			"character": "ꜩ"
		},
		{
			"description": "Latin Capital Letter Thorn",
			"character": "Þ"
		},
		{
			"description": "Latin Small Letter Thorn",
			"character": "þ"
		},
		{
			"description": "Latin Capital Letter Thorn with Stroke",
			"character": "Ꝥ"
		},
		{
			"description": "Latin Small Letter Thorn with Stroke",
			"character": "ꝥ"
		},
		{
			"description": "Latin Capital Letter Thorn with Stroke Through Descender",
			"character": "Ꝧ"
		},
		{
			"description": "Latin Small Letter Thorn with Stroke Through Descender",
			"character": "ꝧ"
		},
		{
			"description": "Latin Capital Letter Et",
			"character": "Ꝫ"
		},
		{
			"description": "Latin Small Letter Et",
			"character": "ꝫ"
		},
		{
			"description": "Latin Capital Letter Eth",
			"character": "Ð"
		},
		{
			"description": "Latin Small Letter Eth",
			"character": "ð"
		},
		{
			"description": "Latin Capital Letter U Bar",
			"character": "Ʉ"
		},
		{
			"description": "Latin Small Letter U Bar with Short Right Leg",
			"character": "ꭏ"
		},
		{
			"description": "Latin Capital Letter U with Acute",
			"character": "Ú"
		},
		{
			"description": "Latin Small Letter U with Acute",
			"character": "ú"
		},
		{
			"description": "Latin Capital Letter U with Breve",
			"character": "Ŭ"
		},
		{
			"description": "Latin Small Letter U with Breve",
			"character": "ŭ"
		},
		{
			"description": "Latin Capital Letter U with Caron",
			"character": "Ǔ"
		},
		{
			"description": "Latin Small Letter U with Caron",
			"character": "ǔ"
		},
		{
			"description": "Latin Capital Letter U with Circumflex",
			"character": "Û"
		},
		{
			"description": "Latin Small Letter U with Circumflex",
			"character": "û"
		},
		{
			"description": "Latin Capital Letter U with Diaeresis",
			"character": "Ü"
		},
		{
			"description": "Latin Small Letter U with Diaeresis",
			"character": "ü"
		},
		{
			"description": "Latin Capital Letter U with Diaeresis and Acute",
			"character": "Ǘ"
		},
		{
			"description": "Latin Small Letter U with Diaeresis and Acute",
			"character": "ǘ"
		},
		{
			"description": "Latin Capital Letter U with Diaeresis and Caron",
			"character": "Ǚ"
		},
		{
			"description": "Latin Small Letter U with Diaeresis and Caron",
			"character": "ǚ"
		},
		{
			"description": "Latin Capital Letter U with Diaeresis and Grave",
			"character": "Ǜ"
		},
		{
			"description": "Latin Small Letter U with Diaeresis and Grave",
			"character": "ǜ"
		},
		{
			"description": "Latin Capital Letter U with Diaeresis and Macron",
			"character": "Ǖ"
		},
		{
			"description": "Latin Small Letter U with Diaeresis and Macron",
			"character": "ǖ"
		},
		{
			"description": "Latin Capital Letter U with Double Acute",
			"character": "Ű"
		},
		{
			"description": "Latin Small Letter U with Double Acute",
			"character": "ű"
		},
		{
			"description": "Latin Capital Letter U with Double Grave",
			"character": "Ȕ"
		},
		{
			"description": "Latin Small Letter U with Double Grave",
			"character": "ȕ"
		},
		{
			"description": "Latin Capital Letter U with Grave",
			"character": "Ù"
		},
		{
			"description": "Latin Small Letter U with Grave",
			"character": "ù"
		},
		{
			"description": "Latin Capital Letter U with Horn",
			"character": "Ư"
		},
		{
			"description": "Latin Small Letter U with Horn",
			"character": "ư"
		},
		{
			"description": "Latin Capital Letter U with Inverted Breve",
			"character": "Ȗ"
		},
		{
			"description": "Latin Small Letter U with Inverted Breve",
			"character": "ȗ"
		},
		{
			"description": "Latin Small Letter U with Left Hook",
			"character": "ꭒ"
		},
		{
			"description": "Latin Capital Letter U with Macron",
			"character": "Ū"
		},
		{
			"description": "Latin Small Letter U with Macron",
			"character": "ū"
		},
		{
			"description": "Latin Capital Letter U with Ogonek",
			"character": "Ų"
		},
		{
			"description": "Latin Small Letter U with Ogonek",
			"character": "ų"
		},
		{
			"description": "Latin Capital Letter U with Ring Above",
			"character": "Ů"
		},
		{
			"description": "Latin Small Letter U with Ring Above",
			"character": "ů"
		},
		{
			"description": "Latin Small Letter U with Short Right Leg",
			"character": "ꭎ"
		},
		{
			"description": "Latin Capital Letter U with Tilde",
			"character": "Ũ"
		},
		{
			"description": "Latin Small Letter U with Tilde",
			"character": "ũ"
		},
		{
			"description": "Latin Capital Letter U with Diaeresis Below",
			"character": "Ṳ"
		},
		{
			"description": "Latin Small Letter U with Diaeresis Below",
			"character": "ṳ"
		},
		{
			"description": "Latin Capital Letter U with Tilde Below",
			"character": "Ṵ"
		},
		{
			"description": "Latin Small Letter U with Tilde Below",
			"character": "ṵ"
		},
		{
			"description": "Latin Capital Letter U with Circumflex Below",
			"character": "Ṷ"
		},
		{
			"description": "Latin Small Letter U with Circumflex Below",
			"character": "ṷ"
		},
		{
			"description": "Latin Capital Letter U with Tilde and Acute",
			"character": "Ṹ"
		},
		{
			"description": "Latin Small Letter U with Tilde and Acute",
			"character": "ṹ"
		},
		{
			"description": "Latin Capital Letter U with Macron and Diaeresis",
			"character": "Ṻ"
		},
		{
			"description": "Latin Small Letter U with Macron and Diaeresis",
			"character": "ṻ"
		},
		{
			"description": "Latin Capital Letter U with Dot Below",
			"character": "Ụ"
		},
		{
			"description": "Latin Small Letter U with Dot Below",
			"character": "ụ"
		},
		{
			"description": "Latin Capital Letter U with Hook Above",
			"character": "Ủ"
		},
		{
			"description": "Latin Small Letter U with Hook Above",
			"character": "ủ"
		},
		{
			"description": "Latin Capital Letter U with Horn and Acute",
			"character": "Ứ"
		},
		{
			"description": "Latin Small Letter U with Horn and Acute",
			"character": "ứ"
		},
		{
			"description": "Latin Capital Letter U with Horn and Grave",
			"character": "Ừ"
		},
		{
			"description": "Latin Small Letter U with Horn and Grave",
			"character": "ừ"
		},
		{
			"description": "Latin Capital Letter U with Horn and Hook Above",
			"character": "Ử"
		},
		{
			"description": "Latin Small Letter U with Horn and Hook Above",
			"character": "ử"
		},
		{
			"description": "Latin Capital Letter U with Horn and Tilde",
			"character": "Ữ"
		},
		{
			"description": "Latin Small Letter U with Horn and Tilde",
			"character": "ữ"
		},
		{
			"description": "Latin Capital Letter U with Horn and Dot Below",
			"character": "Ự"
		},
		{
			"description": "Latin Small Letter U with Horn and Dot Below",
			"character": "ự"
		},
		{
			"description": "Latin Capital Letter Volapuk Ue",
			"character": "Ꞟ"
		},
		{
			"description": "Latin Small Letter Volapuk Ue",
			"character": "ꞟ"
		},
		{
			"description": "Latin Small Letter Ui",
			"character": "ꭐ"
		},
		{
			"description": "Latin Small Letter Turned Ui",
			"character": "ꭑ"
		},
		{
			"description": "Latin Small Letter Um",
			"character": "ꝸ"
		},
		{
			"description": "Latin Small Letter Uo",
			"character": "ꭣ",
			"unsupported": true
		},
		{
			"description": "Latin Small Letter V with Curl",
			"character": "ⱴ"
		},
		{
			"description": "Latin Capital Letter V with Diagonal Stroke",
			"character": "Ꝟ"
		},
		{
			"description": "Latin Small Letter V with Diagonal Stroke",
			"character": "ꝟ"
		},
		{
			"description": "Latin Capital Letter V with Hook",
			"character": "Ʋ"
		},
		{
			"description": "Latin Small Letter V with Right Hook",
			"character": "ⱱ"
		},
		{
			"description": "Latin Capital Letter Turned V",
			"character": "Ʌ"
		},
		{
			"description": "Latin Capital Letter V with Tilde",
			"character": "Ṽ"
		},
		{
			"description": "Latin Small Letter V with Tilde",
			"character": "ṽ"
		},
		{
			"description": "Latin Capital Letter V with Dot Below",
			"character": "Ṿ"
		},
		{
			"description": "Latin Small Letter V with Dot Below",
			"character": "ṿ"
		},
		{
			"description": "Latin Capital Letter Vend",
			"character": "Ꝩ"
		},
		{
			"description": "Latin Small Letter Vend",
			"character": "ꝩ"
		},
		{
			"description": "Latin Capital Letter Vy",
			"character": "Ꝡ"
		},
		{
			"description": "Latin Small Letter Vy",
			"character": "ꝡ"
		},
		{
			"description": "Latin Capital Letter W with Circumflex",
			"character": "Ŵ"
		},
		{
			"description": "Latin Small Letter W with Circumflex",
			"character": "ŵ"
		},
		{
			"description": "Latin Capital Letter W with Hook",
			"character": "Ⱳ"
		},
		{
			"description": "Latin Small Letter W with Hook",
			"character": "ⱳ"
		},
		{
			"description": "Latin Capital Letter W with Grave",
			"character": "Ẁ"
		},
		{
			"description": "Latin Small Letter W with Grave",
			"character": "ẁ"
		},
		{
			"description": "Latin Capital Letter W with Acute",
			"character": "Ẃ"
		},
		{
			"description": "Latin Small Letter W with Acute",
			"character": "ẃ"
		},
		{
			"description": "Latin Capital Letter W with Diaeresis",
			"character": "Ẅ"
		},
		{
			"description": "Latin Small Letter W with Diaeresis",
			"character": "ẅ"
		},
		{
			"description": "Latin Capital Letter W with Dot Above",
			"character": "Ẇ"
		},
		{
			"description": "Latin Small Letter W with Dot Above",
			"character": "ẇ"
		},
		{
			"description": "Latin Capital Letter W with Dot Below",
			"character": "Ẉ"
		},
		{
			"description": "Latin Small Letter W with Dot Below",
			"character": "ẉ"
		},
		{
			"description": "Latin Small Letter W with Ring Above",
			"character": "ẘ"
		},
		{
			"description": "Latin Capital Letter Wynn",
			"character": "Ƿ"
		},
		{
			"description": "Latin Small Letter X with Long Left Leg",
			"character": "ꭗ"
		},
		{
			"description": "Latin Small Letter X with Long Left Leg and Low Right Ring",
			"character": "ꭘ"
		},
		{
			"description": "Latin Small Letter X with Long Left Leg with Serif",
			"character": "ꭙ"
		},
		{
			"description": "Latin Small Letter X with Low Right Ring",
			"character": "ꭖ"
		},
		{
			"description": "Latin Capital Letter X with Dot Above",
			"character": "Ẋ"
		},
		{
			"description": "Latin Small Letter X with Dot Above",
			"character": "ẋ"
		},
		{
			"description": "Latin Capital Letter X with Diaeresis",
			"character": "Ẍ"
		},
		{
			"description": "Latin Small Letter X with Diaeresis",
			"character": "ẍ"
		},
		{
			"description": "Latin Capital Letter Y with Acute",
			"character": "Ý"
		},
		{
			"description": "Latin Small Letter Y with Acute",
			"character": "ý"
		},
		{
			"description": "Latin Capital Letter Y with Circumflex",
			"character": "Ŷ"
		},
		{
			"description": "Latin Small Letter Y with Circumflex",
			"character": "ŷ"
		},
		{
			"description": "Latin Capital Letter Y with Diaeresis",
			"character": "Ÿ"
		},
		{
			"description": "Latin Small Letter Y with Diaeresis",
			"character": "ÿ"
		},
		{
			"description": "Latin Capital Letter Y with Hook",
			"character": "Ƴ"
		},
		{
			"description": "Latin Small Letter Y with Hook",
			"character": "ƴ"
		},
		{
			"description": "Latin Capital Letter Y with Macron",
			"character": "Ȳ"
		},
		{
			"description": "Latin Small Letter Y with Macron",
			"character": "ȳ"
		},
		{
			"description": "Latin Small Letter Y with Short Right Leg",
			"character": "ꭚ"
		},
		{
			"description": "Latin Capital Letter Y with Stroke",
			"character": "Ɏ"
		},
		{
			"description": "Latin Small Letter Y with Stroke",
			"character": "ɏ"
		},
		{
			"description": "Latin Capital Letter Y with Dot Above",
			"character": "Ẏ"
		},
		{
			"description": "Latin Small Letter Y with Dot Above",
			"character": "ẏ"
		},
		{
			"description": "Latin Small Letter Y with Ring Above",
			"character": "ẙ"
		},
		{
			"description": "Latin Capital Letter Y with Grave",
			"character": "Ỳ"
		},
		{
			"description": "Latin Small Letter Y with Grave",
			"character": "ỳ"
		},
		{
			"description": "Latin Capital Letter Y with Dot Below",
			"character": "Ỵ"
		},
		{
			"description": "Latin Small Letter Y with Dot Below",
			"character": "ỵ"
		},
		{
			"description": "Latin Capital Letter Y with Hook Above",
			"character": "Ỷ"
		},
		{
			"description": "Latin Small Letter Y with Hook Above",
			"character": "ỷ"
		},
		{
			"description": "Latin Capital Letter Y with Tilde",
			"character": "Ỹ"
		},
		{
			"description": "Latin Small Letter Y with Tilde",
			"character": "ỹ"
		},
		{
			"description": "Latin Capital Letter Z with Acute",
			"character": "Ź"
		},
		{
			"description": "Latin Small Letter Z with Acute",
			"character": "ź"
		},
		{
			"description": "Latin Capital Letter Z with Caron",
			"character": "Ž"
		},
		{
			"description": "Latin Small Letter Z with Caron",
			"character": "ž"
		},
		{
			"description": "Latin Capital Letter Z with Descender",
			"character": "Ⱬ"
		},
		{
			"description": "Latin Small Letter Z with Descender",
			"character": "ⱬ"
		},
		{
			"description": "Latin Capital Letter Z with Dot Above",
			"character": "Ż"
		},
		{
			"description": "Latin Small Letter Z with Dot Above",
			"character": "ż"
		},
		{
			"description": "Latin Capital Letter Z with Hook",
			"character": "Ȥ"
		},
		{
			"description": "Latin Small Letter Z with Hook",
			"character": "ȥ"
		},
		{
			"description": "Latin Capital Letter Z with Stroke",
			"character": "Ƶ"
		},
		{
			"description": "Latin Small Letter Z with Stroke",
			"character": "ƶ"
		},
		{
			"description": "Latin Capital Letter Z with Swash Tail",
			"character": "Ɀ"
		},
		{
			"description": "Latin Small Letter Z with Swash Tail",
			"character": "ɀ"
		},
		{
			"description": "Latin Capital Letter Z with Circumflex",
			"character": "Ẑ"
		},
		{
			"description": "Latin Small Letter Z with Circumflex",
			"character": "ẑ"
		},
		{
			"description": "Latin Capital Letter Z with Dot Below",
			"character": "Ẓ"
		},
		{
			"description": "Latin Small Letter Z with Dot Below",
			"character": "ẓ"
		},
		{
			"description": "Latin Capital Letter Z with Line Below",
			"character": "Ẕ"
		},
		{
			"description": "Latin Small Letter Z with Line Below",
			"character": "ẕ"
		},
		{
			"description": "Latin Capital Letter Visigothic Z",
			"character": "Ꝣ"
		},
		{
			"description": "Latin Small Letter Visigothic Z",
			"character": "ꝣ"
		},
		{
			"description": "Latin Capital Letter Yogh",
			"character": "Ȝ"
		},
		{
			"description": "Latin Small Letter Yogh",
			"character": "ȝ"
		},
		{
			"description": "Latin Capital Letter Ezh",
			"character": "Ʒ"
		},
		{
			"description": "Latin Capital Letter Ezh Reversed",
			"character": "Ƹ"
		},
		{
			"description": "Latin Small Letter Ezh Reversed",
			"character": "ƹ"
		},
		{
			"description": "Latin Capital Letter Ezh with Caron",
			"character": "Ǯ"
		},
		{
			"description": "Latin Small Letter Ezh with Caron",
			"character": "ǯ"
		},
		{
			"description": "Latin Small Letter Ezh with Tail",
			"character": "ƺ"
		},
		{
			"description": "Latin Capital Letter Alpha",
			"character": "Ɑ"
		},
		{
			"description": "Latin Small Letter Barred Alpha",
			"character": "ꬰ"
		},
		{
			"description": "Latin Small Letter Inverted Alpha",
			"character": "ꭤ"
		},
		{
			"description": "Latin Capital Letter Turned Alpha",
			"character": "Ɒ"
		},
		{
			"description": "Latin Capital Letter Beta",
			"character": "Ꞵ",
			"unsupported": true
		},
		{
			"description": "Latin Small Letter Beta",
			"character": "ꞵ",
			"unsupported": true
		},
		{
			"description": "Latin Capital Letter Gamma",
			"character": "Ɣ"
		},
		{
			"description": "Latin Small Letter Turned Delta",
			"character": "ƍ"
		},
		{
			"description": "Latin Capital Letter Iota",
			"character": "Ɩ"
		},
		{
			"description": "Latin Small Letter Lambda with Stroke",
			"character": "ƛ"
		},
		{
			"description": "Latin Capital Letter Upsilon",
			"character": "Ʊ"
		},
		{
			"description": "Latin Small Letter Tailless Phi",
			"character": "ⱷ"
		},
		{
			"description": "Latin Capital Letter Chi",
			"character": "Ꭓ",
			"unsupported": true
		},
		{
			"description": "Latin Small Letter Chi",
			"character": "ꭓ"
		},
		{
			"description": "Latin Small Letter Chi with Low Left Serif",
			"character": "ꭕ"
		},
		{
			"description": "Latin Small Letter Chi with Low Right Ring",
			"character": "ꭔ"
		},
		{
			"description": "Latin Capital Letter Omega",
			"character": "Ꞷ",
			"unsupported": true
		},
		{
			"description": "Latin Small Letter Omega",
			"character": "ꞷ",
			"unsupported": true
		},
		{
			"description": "Latin Capital Letter Egyptological Ain",
			"character": "Ꜥ"
		},
		{
			"description": "Latin Small Letter Egyptological Ain",
			"character": "ꜥ"
		},
		{
			"description": "Latin Capital Letter Egyptological Alef",
			"character": "Ꜣ"
		},
		{
			"description": "Latin Small Letter Egyptological Alef",
			"character": "ꜣ"
		},
		{
			"description": "Latin Capital Letter Glottal Stop",
			"character": "Ɂ"
		},
		{
			"description": "Latin Small Letter Glottal Stop",
			"character": "ɂ"
		},
		{
			"description": "Latin Letter Alveolar Click",
			"character": "ǂ"
		},
		{
			"description": "Latin Letter Dental Click",
			"character": "ǀ"
		},
		{
			"description": "Latin Letter Lateral Click",
			"character": "ǁ"
		},
		{
			"description": "Latin Letter Retroflex Click",
			"character": "ǃ"
		},
		{
			"description": "Latin Letter Inverted Glottal Stop with Stroke",
			"character": "ƾ"
		},
		{
			"description": "Latin Letter Sinological Dot",
			"character": "ꞏ"
		},
		{
			"description": "Latin Small Letter Sakha Yat",
			"character": "ꭠ",
			"unsupported": true
		},
		{
			"description": "Latin Capital Letter Saltillo",
			"character": "Ꞌ"
		},
		{
			"description": "Latin Small Letter Saltillo",
			"character": "ꞌ"
		},
		{
			"description": "Latin Letter Two with Stroke",
			"character": "ƻ"
		},
		{
			"description": "Latin Capital Letter Tone Two",
			"character": "Ƨ"
		},
		{
			"description": "Latin Small Letter Tone Two",
			"character": "ƨ"
		},
		{
			"description": "Latin Capital Letter Cuatrillo",
			"character": "Ꜭ"
		},
		{
			"description": "Latin Small Letter Cuatrillo",
			"character": "ꜭ"
		},
		{
			"description": "Latin Capital Letter Cuatrillo with Comma",
			"character": "Ꜯ"
		},
		{
			"description": "Latin Small Letter Cuatrillo with Comma",
			"character": "ꜯ"
		},
		{
			"description": "Latin Capital Letter Tone Five",
			"character": "Ƽ"
		},
		{
			"description": "Latin Small Letter Tone Five",
			"character": "ƽ"
		},
		{
			"description": "Latin Capital Letter Tone Six",
			"character": "Ƅ"
		},
		{
			"description": "Latin Small Letter Tone Six",
			"character": "ƅ"
		},
		{
			"description": "Latin Capital Letter Con",
			"character": "Ꝯ"
		},
		{
			"description": "Latin Small Letter Con",
			"character": "ꝯ"
		}
	],
};
const IPA = {
	title: "IPA",
	content: [
		{
			"description": "Latin Small Letter P",
			"character": "p"
		},
		{
			"description": "Latin Small Letter B",
			"character": "b"
		},
		{
			"description": "Latin Small Letter T",
			"character": "t"
		},
		{
			"description": "Latin Small Letter D",
			"character": "d"
		},
		{
			"description": "Latin Small Letter T with Retroflex Hook",
			"character": "ʈ"
		},
		{
			"description": "Latin Small Letter D with Tail",
			"character": "ɖ"
		},
		{
			"description": "Latin Small Letter C",
			"character": "c"
		},
		{
			"description": "Latin Small Letter Dotless J with Stroke",
			"character": "ɟ"
		},
		{
			"description": "Latin Small Letter K",
			"character": "k"
		},
		{
			"description": "Latin Small Letter Script G",
			"character": "ɡ"
		},
		{
			"description": "Latin Small Letter G",
			"character": "g"
		},
		{
			"description": "Latin Small Letter Q",
			"character": "q"
		},
		{
			"description": "Latin Letter Small Capital G",
			"character": "ɢ"
		},
		{
			"description": "Latin Letter Glottal Stop",
			"character": "ʔ"
		},

		{
			"description": "Latin Small Letter M",
			"character": "m"
		},
		{
			"description": "Latin Small Letter M with Hook",
			"character": "ɱ"
		},
		{
			"description": "Latin Small Letter N",
			"character": "n"
		},
		{
			"description": "Latin Small Letter N with Retroflex Hook",
			"character": "ɳ"
		},
		{
			"description": "Latin Small Letter N with Left Hook",
			"character": "ɲ"
		},
		{
			"description": "Latin Small Letter Eng",
			"character": "ŋ"
		},
		{
			"description": "Latin Letter Small Capital N",
			"character": "ɴ"
		},

		{
			"description": "Latin Letter Small Capital B",
			"character": "ʙ"
		},
		{
			"description": "Latin Small Letter R",
			"character": "r"
		},
		{
			"description": "Latin Letter Small Capital R",
			"character": "ʀ"
		},

		{
			"description": "Latin Small Letter V with Right Hook",
			"character": "ⱱ"
		},
		{
			"description": "Latin Small Letter R with Fishhook",
			"character": "ɾ"
		},
		{
			"description": "Latin Small Letter R with Tail",
			"character": "ɽ"
		},

		{
			"description": "Latin Small Letter Phi",
			"character": "ɸ"
		},
		{
			"description": "Greek Small Letter Beta",
			"character": "β"
		},
		{
			"description": "Latin Small Letter F",
			"character": "f"
		},
		{
			"description": "Latin Small Letter V",
			"character": "v"
		},
		{
			"description": "Greek Small Letter Theta",
			"character": "θ"
		},
		{
			"description": "Latin Small Letter Eth",
			"character": "ð"
		},
		{
			"description": "Latin Small Letter S",
			"character": "s"
		},
		{
			"description": "Latin Small Letter Z",
			"character": "z"
		},
		{
			"description": "Latin Small Letter Esh",
			"character": "ʃ"
		},
		{
			"description": "Latin Small Letter Ezh",
			"character": "ʒ"
		},
		{
			"description": "Latin Small Letter S with Hook",
			"character": "ʂ"
		},
		{
			"description": "Latin Small Letter Z with Retroflex Hook",
			"character": "ʐ"
		},
		{
			"description": "Latin Small Letter C with Cedilla",
			"character": "ç"
		},
		{
			"description": "Latin Small Letter J with Crossed-Tail",
			"character": "ʝ"
		},
		{
			"description": "Latin Small Letter X",
			"character": "x"
		},
		{
			"description": "Latin Small Letter Gamma",
			"character": "ɣ"
		},
		{
			"description": "Greek Small Letter Chi",
			"character": "χ"
		},
		{
			"description": "Latin Letter Small Capital Inverted R",
			"character": "ʁ"
		},
		{
			"description": "Latin Small Letter H with Stroke",
			"character": "ħ"
		},
		{
			"description": "Latin Letter Pharyngeal Voiced Fricative",
			"character": "ʕ"
		},
		{
			"description": "Latin Small Letter H",
			"character": "h"
		},
		{
			"description": "Latin Small Letter H with Hook",
			"character": "ɦ"
		},

		{
			"description": "Latin Small Letter L with Belt",
			"character": "ɬ"
		},
		{
			"description": "Latin Small Letter Lezh",
			"character": "ɮ"
		},

		{
			"description": "Latin Small Letter V with Hook",
			"character": "ʋ"
		},
		{
			"description": "Latin Small Letter Turned R",
			"character": "ɹ"
		},
		{
			"description": "Latin Small Letter Turned R with Hook",
			"character": "ɻ"
		},
		{
			"description": "Latin Small Letter J",
			"character": "j"
		},
		{
			"description": "Latin Small Letter Turned M with Long Leg",
			"character": "ɰ"
		},

		{
			"description": "Latin Small Letter L",
			"character": "l"
		},
		{
			"description": "Latin Small Letter L with Retroflex Hook",
			"character": "ɭ"
		},
		{
			"description": "Latin Small Letter Turned Y",
			"character": "ʎ"
		},
		{
			"description": "Latin Letter Small Capital L",
			"character": "ʟ"
		},

		{
			"description": "Latin Letter Bilabial Click",
			"character": "ʘ"
		},
		{
			"description": "Latin Letter Dental Click",
			"character": "ǀ"
		},
		{
			"description": "Latin Letter Retroflex Click",
			"character": "ǃ"
		},
		{
			"description": "Latin Letter Alveolar Click",
			"character": "ǂ"
		},
		{
			"description": "Latin Letter Lateral Click",
			"character": "ǁ"
		},

		{
			"description": "Latin Small Letter B with Hook",
			"character": "ɓ"
		},
		{
			"description": "Latin Small Letter D with Hook",
			"character": "ɗ"
		},
		{
			"description": "Latin Small Letter Dotless J with Stroke and Hook",
			"character": "ʄ"
		},
		{
			"description": "Latin Small Letter G with Hook",
			"character": "ɠ"
		},
		{
			"description": "Latin Letter Small Capital G with Hook",
			"character": "ʛ"
		},

		{
			"description": "Modifier Letter Apostrophe",
			"character": "ʼ"
		},

		{
			"description": "Latin Small Letter Turned W",
			"character": "ʍ"
		},
		{
			"description": "Latin Small Letter W",
			"character": "w"
		},
		{
			"description": "Latin Small Letter Turned H",
			"character": "ɥ"
		},
		{
			"description": "Latin Letter Small Capital H",
			"character": "ʜ"
		},
		{
			"description": "Latin Letter Reversed Glottal Stop with Stroke",
			"character": "ʢ"
		},
		{
			"description": "Latin Letter Glottal Stop with Stroke",
			"character": "ʡ"
		},

		{
			"description": "Latin Small Letter C with Curl",
			"character": "ɕ"
		},
		{
			"description": "Latin Small Letter Z with Curl",
			"character": "ʑ"
		},
		{
			"description": "Latin Small Letter Turned R with Long Leg",
			"character": "ɺ"
		},
		{
			"description": "Latin Small Letter Heng with Hook",
			"character": "ɧ"
		},

		{
			"description": "Latin Small Letter Ts Digraph",
			"character": "ʦ"
		},
		{
			"description": "Latin Small Letter Tesh Digraph",
			"character": "ʧ"
		},
		{
			"description": "Latin Small Letter Tc Digraph with Curl",
			"character": "ʨ"
		},
		{
			"description": "Latin Small Letter Dz Digraph",
			"character": "ʣ"
		},
		{
			"description": "Latin Small Letter Dezh Digraph",
			"character": "ʤ"
		},
		{
			"description": "Latin Small Letter Dz Digraph with Curl",
			"character": "ʥ"
		},

		{
			"description": "Latin Small Letter I",
			"character": "i"
		},
		{
			"description": "Latin Small Letter Y",
			"character": "y"
		},
		{
			"description": "Latin Small Letter I with Stroke",
			"character": "ɨ"
		},
		{
			"description": "Latin Small Letter U Bar",
			"character": "ʉ"
		},
		{
			"description": "Latin Small Letter Turned M",
			"character": "ɯ"
		},
		{
			"description": "Latin Small Letter U",
			"character": "u"
		},

		{
			"description": "Latin Letter Small Capital I",
			"character": "ɪ"
		},
		{
			"description": "Latin Letter Small Capital Y",
			"character": "ʏ"
		},
		{
			"description": "Latin Small Letter Upsilon",
			"character": "ʊ"
		},

		{
			"description": "Latin Small Letter E",
			"character": "e"
		},
		{
			"description": "Latin Small Letter O with Stroke",
			"character": "ø"
		},
		{
			"description": "Latin Small Letter Reversed E",
			"character": "ɘ"
		},
		{
			"description": "Latin Small Letter Barred O",
			"character": "ɵ"
		},
		{
			"description": "Latin Small Letter Rams Horn",
			"character": "ɤ"
		},
		{
			"description": "Latin Small Letter O",
			"character": "o"
		},

		{
			"description": "Latin Small Letter Schwa",
			"character": "ə"
		},

		{
			"description": "Latin Small Letter Open E",
			"character": "ɛ"
		},
		{
			"description": "Latin Small Ligature Oe",
			"character": "œ"
		},
		{
			"description": "Latin Small Letter Reversed Open E",
			"character": "ɜ"
		},
		{
			"description": "Latin Small Letter Closed Reversed Open E",
			"character": "ɞ"
		},
		{
			"description": "Latin Small Letter Turned V",
			"character": "ʌ"
		},
		{
			"description": "Latin Small Letter Open O",
			"character": "ɔ"
		},

		{
			"description": "Latin Small Letter Turned A",
			"character": "ɐ"
		},

		{
			"description": "Latin Small Letter Ae",
			"character": "æ"
		},

		{
			"description": "Latin Small Letter A",
			"character": "a"
		},
		{
			"description": "Latin Letter Small Capital Oe",
			"character": "ɶ"
		},
		{
			"description": "Latin Small Letter Alpha",
			"character": "ɑ"
		},
		{
			"description": "Latin Small Letter Turned Alpha",
			"character": "ɒ"
		},

		{
			"description": "Latin Small Letter Schwa with Hook",
			"character": "ɚ"
		},
		{
			"description": "Latin Small Letter Reversed Open E with Hook",
			"character": "ɝ"
		},

		{
			"description": "Latin Small Letter L with Middle Tilde",
			"character": "ɫ"
		},

		{
			"description": "Modifier Letter Vertical Line",
			"character": "ˈ"
		},
		{
			"description": "Modifier Letter Low Vertical Line",
			"character": "ˌ"
		},
		{
			"description": "Modifier Letter Triangular Colon",
			"character": "ː"
		},
		{
			"description": "Modifier Letter Half Triangular Colon",
			"character": "ˑ"
		},
		{
			"description": "Vertical Line",
			"character": "|"
		},
		{
			"description": "Double Vertical Line",
			"character": "‖"
		},
		{
			"description": "Full Stop",
			"character": "."
		},
		{
			"description": "Undertie",
			"character": "‿"
		},

		{
			"description": "Modifier Letter Extra-High Tone Bar",
			"character": "˥"
		},
		{
			"description": "Modifier Letter High Tone Bar",
			"character": "˦"
		},
		{
			"description": "Modifier Letter Mid Tone Bar",
			"character": "˧"
		},
		{
			"description": "Modifier Letter Low Tone Bar",
			"character": "˨"
		},
		{
			"description": "Modifier Letter Extra-Low Tone Bar",
			"character": "˩"
		},

		{
			"description": "Downwards Arrow",
			"character": "↓"
		},
		{
			"description": "Upwards Arrow",
			"character": "↑"
		},
		{
			"description": "North East Arrow",
			"character": "↗"
		},
		{
			"description": "South East Arrow",
			"character": "↘"
		},

		{
			"description": "Modifier Letter Capital V",
			"character": "ⱽ"
		},
		{
			"description": "Modifier Letter Us",
			"character": "ꝰ"
		},
		{
			"description": "Modifier Letter Small H",
			"character": "ʰ"
		},
		{
			"description": "Modifier Letter Small H with Hook",
			"character": "ʱ"
		},
		{
			"description": "Modifier Letter Small J",
			"character": "ʲ"
		},
		{
			"description": "Modifier Letter Small R",
			"character": "ʳ"
		},
		{
			"description": "Modifier Letter Small Turned R",
			"character": "ʴ"
		},
		{
			"description": "Modifier Letter Small Turned R with Hook",
			"character": "ʵ"
		},
		{
			"description": "Modifier Letter Small Capital Inverted R",
			"character": "ʶ"
		},
		{
			"description": "Modifier Letter Small W",
			"character": "ʷ"
		},
		{
			"description": "Modifier Letter Small Y",
			"character": "ʸ"
		},
		{
			"description": "Modifier Letter Prime",
			"character": "ʹ"
		},
		{
			"description": "Modifier Letter Double Prime",
			"character": "ʺ"
		},
		{
			"description": "Modifier Letter Turned Comma",
			"character": "ʻ"
		},
		{
			"description": "Modifier Letter Reversed Comma",
			"character": "ʽ"
		},
		{
			"description": "Modifier Letter Right Half Ring",
			"character": "ʾ"
		},
		{
			"description": "Modifier Letter Left Half Ring",
			"character": "ʿ"
		},
		{
			"description": "Modifier Letter Glottal Stop",
			"character": "ˀ"
		},
		{
			"description": "Modifier Letter Reversed Glottal Stop",
			"character": "ˁ"
		},
		{
			"description": "Modifier Letter Left Arrowhead",
			"character": "˂"
		},
		{
			"description": "Modifier Letter Right Arrowhead",
			"character": "˃"
		},
		{
			"description": "Modifier Letter Up Arrowhead",
			"character": "˄"
		},
		{
			"description": "Modifier Letter Down Arrowhead",
			"character": "˅"
		},
		{
			"description": "Modifier Letter Circumflex Accent",
			"character": "ˆ"
		},
		{
			"description": "Caron",
			"character": "ˇ"
		},
		{
			"description": "Modifier Letter Macron",
			"character": "ˉ"
		},
		{
			"description": "Modifier Letter Acute Accent",
			"character": "ˊ"
		},
		{
			"description": "Modifier Letter Grave Accent",
			"character": "ˋ"
		},
		{
			"description": "Modifier Letter Low Macron",
			"character": "ˍ"
		},
		{
			"description": "Modifier Letter Low Grave Accent",
			"character": "ˎ"
		},
		{
			"description": "Modifier Letter Low Acute Accent",
			"character": "ˏ"
		},
		{
			"description": "Modifier Letter Centred Right Half Ring",
			"character": "˒"
		},
		{
			"description": "Modifier Letter Centred Left Half Ring",
			"character": "˓"
		},
		{
			"description": "Modifier Letter Up Tack",
			"character": "˔"
		},
		{
			"description": "Modifier Letter Down Tack",
			"character": "˕"
		},
		{
			"description": "Modifier Letter Plus Sign",
			"character": "˖"
		},
		{
			"description": "Modifier Letter Minus Sign",
			"character": "˗"
		},
		{
			"description": "Breve",
			"character": "˘"
		},
		{
			"description": "Dot Above",
			"character": "˙"
		},
		{
			"description": "Ring Above",
			"character": "˚"
		},
		{
			"description": "Ogonek",
			"character": "˛"
		},
		{
			"description": "Small Tilde",
			"character": "˜"
		},
		{
			"description": "Double Acute Accent",
			"character": "˝"
		},
		{
			"description": "Modifier Letter Rhotic Hook",
			"character": "˞"
		},
		{
			"description": "Modifier Letter Cross Accent",
			"character": "˟"
		},
		{
			"description": "Modifier Letter Small Gamma",
			"character": "ˠ"
		},
		{
			"description": "Modifier Letter Small L",
			"character": "ˡ"
		},
		{
			"description": "Modifier Letter Small S",
			"character": "ˢ"
		},
		{
			"description": "Modifier Letter Small X",
			"character": "ˣ"
		},
		{
			"description": "Modifier Letter Small Reversed Glottal Stop",
			"character": "ˤ"
		},
		{
			"description": "Modifier Letter Yin Departing Tone Mark",
			"character": "˪"
		},
		{
			"description": "Modifier Letter Yang Departing Tone Mark",
			"character": "˫"
		},
		{
			"description": "Modifier Letter Voicing",
			"character": "ˬ"
		},
		{
			"description": "Modifier Letter Unaspirated",
			"character": "˭"
		},
		{
			"description": "Modifier Letter Double Apostrophe",
			"character": "ˮ"
		},
		{
			"description": "Modifier Letter Low Down Arrowhead",
			"character": "˯"
		},
		{
			"description": "Modifier Letter Low Up Arrowhead",
			"character": "˰"
		},
		{
			"description": "Modifier Letter Low Left Arrowhead",
			"character": "˱"
		},
		{
			"description": "Modifier Letter Low Right Arrowhead",
			"character": "˲"
		},
		{
			"description": "Modifier Letter Low Ring",
			"character": "˳"
		},
		{
			"description": "Modifier Letter Middle Grave Accent",
			"character": "˴"
		},
		{
			"description": "Modifier Letter Middle Double Grave Accent",
			"character": "˵"
		},
		{
			"description": "Modifier Letter Middle Double Acute Accent",
			"character": "˶"
		},
		{
			"description": "Modifier Letter Low Tilde",
			"character": "˷"
		},
		{
			"description": "Modifier Letter Raised Colon",
			"character": "˸"
		},
		{
			"description": "Modifier Letter Begin High Tone",
			"character": "˹"
		},
		{
			"description": "Modifier Letter End High Tone",
			"character": "˺"
		},
		{
			"description": "Modifier Letter Begin Low Tone",
			"character": "˻"
		},
		{
			"description": "Modifier Letter End Low Tone",
			"character": "˼"
		},
		{
			"description": "Modifier Letter Shelf",
			"character": "˽"
		},
		{
			"description": "Modifier Letter Open Shelf",
			"character": "˾"
		},
		{
			"description": "Modifier Letter Low Left Arrow",
			"character": "˿"
		},

		{
			"description": "Latin Small Letter Iota",
			"character": "ɩ"
		},
		{
			"description": "Latin Small Letter Closed Omega",
			"character": "ɷ"
		},
		{
			"description": "Latin Small Letter R with Long Leg",
			"character": "ɼ"
		},
		{
			"description": "Latin Small Letter Reversed R with Fishhook",
			"character": "ɿ"
		},
		{
			"description": "Latin Small Letter Squat Reversed Esh",
			"character": "ʅ"
		},
		{
			"description": "Latin Small Letter Esh with Curl",
			"character": "ʆ"
		},
		{
			"description": "Latin Small Letter Turned T",
			"character": "ʇ"
		},
		{
			"description": "Latin Small Letter Ezh with Curl",
			"character": "ʓ"
		},
		{
			"description": "Latin Letter Inverted Glottal Stop",
			"character": "ʖ"
		},
		{
			"description": "Latin Letter Stretched C",
			"character": "ʗ"
		},
		{
			"description": "Latin Small Letter Closed Open E",
			"character": "ʚ"
		},
		{
			"description": "Latin Small Letter Turned K",
			"character": "ʞ"
		},
		{
			"description": "Latin Small Letter Q with Hook",
			"character": "ʠ"
		},
		{
			"description": "Latin Small Letter Feng Digraph",
			"character": "ʩ"
		},
		{
			"description": "Latin Small Letter Ls Digraph",
			"character": "ʪ"
		},
		{
			"description": "Latin Small Letter Lz Digraph",
			"character": "ʫ"
		},
		{
			"description": "Latin Letter Bilabial Percussive",
			"character": "ʬ"
		},
		{
			"description": "Latin Letter Bidental Percussive",
			"character": "ʭ"
		},
		{
			"description": "Latin Small Letter Turned H with Fishhook",
			"character": "ʮ"
		},
		{
			"description": "Latin Small Letter Turned H with Fishhook and Tail",
			"character": "ʯ"
		}
	],
};
const Greek = {
	title: "Greek",
	content: [
		{
			"description": "Greek Capital Letter Alpha",
			"character": "Α"
		},
		{
			"description": "Greek Small Letter Alpha",
			"character": "α"
		},
		{
			"description": "Greek Capital Letter Alpha with Tonos",
			"character": "Ά"
		},
		{
			"description": "Greek Small Letter Alpha with Tonos",
			"character": "ά"
		},
		{
			"description": "Greek Capital Letter Alpha with Psili",
			"character": "Ἀ"
		},
		{
			"description": "Greek Small Letter Alpha with Psili",
			"character": "ἀ"
		},
		{
			"description": "Greek Capital Letter Alpha with Dasia",
			"character": "Ἁ"
		},
		{
			"description": "Greek Small Letter Alpha with Dasia",
			"character": "ἁ"
		},
		{
			"description": "Greek Capital Letter Alpha with Psili and Varia",
			"character": "Ἂ"
		},
		{
			"description": "Greek Small Letter Alpha with Psili and Varia",
			"character": "ἂ"
		},
		{
			"description": "Greek Capital Letter Alpha with Dasia and Varia",
			"character": "Ἃ"
		},
		{
			"description": "Greek Small Letter Alpha with Dasia and Varia",
			"character": "ἃ"
		},
		{
			"description": "Greek Capital Letter Alpha with Psili and Oxia",
			"character": "Ἄ"
		},
		{
			"description": "Greek Small Letter Alpha with Psili and Oxia",
			"character": "ἄ"
		},
		{
			"description": "Greek Capital Letter Alpha with Dasia and Oxia",
			"character": "Ἅ"
		},
		{
			"description": "Greek Small Letter Alpha with Dasia and Oxia",
			"character": "ἅ"
		},
		{
			"description": "Greek Capital Letter Alpha with Psili and Perispomeni",
			"character": "Ἆ"
		},
		{
			"description": "Greek Small Letter Alpha with Psili and Perispomeni",
			"character": "ἆ"
		},
		{
			"description": "Greek Capital Letter Alpha with Dasia and Perispomeni",
			"character": "Ἇ"
		},
		{
			"description": "Greek Small Letter Alpha with Dasia and Perispomeni",
			"character": "ἇ"
		},
		{
			"description": "Greek Capital Letter Alpha with Varia",
			"character": "Ὰ"
		},
		{
			"description": "Greek Small Letter Alpha with Varia",
			"character": "ὰ"
		},
		{
			"description": "Greek Capital Letter Alpha with Oxia",
			"character": "Ά"
		},
		{
			"description": "Greek Small Letter Alpha with Oxia",
			"character": "ά"
		},
		{
			"description": "Greek Capital Letter Alpha with Vrachy",
			"character": "Ᾰ"
		},
		{
			"description": "Greek Small Letter Alpha with Vrachy",
			"character": "ᾰ"
		},
		{
			"description": "Greek Capital Letter Alpha with Macron",
			"character": "Ᾱ"
		},
		{
			"description": "Greek Small Letter Alpha with Macron",
			"character": "ᾱ"
		},
		{
			"description": "Greek Capital Letter Alpha with Prosgegrammeni",
			"character": "ᾼ"
		},
		{
			"description": "Greek Small Letter Alpha with Ypogegrammeni",
			"character": "ᾳ"
		},
		{
			"description": "Greek Capital Letter Alpha with Psili and Prosgegrammeni",
			"character": "ᾈ"
		},
		{
			"description": "Greek Small Letter Alpha with Psili and Ypogegrammeni",
			"character": "ᾀ"
		},
		{
			"description": "Greek Capital Letter Alpha with Dasia and Prosgegrammeni",
			"character": "ᾉ"
		},
		{
			"description": "Greek Small Letter Alpha with Dasia and Ypogegrammeni",
			"character": "ᾁ"
		},
		{
			"description": "Greek Capital Letter Alpha with Psili And Varia and Prosgegrammeni",
			"character": "ᾊ"
		},
		{
			"description": "Greek Small Letter Alpha with Psili And Varia and Ypogegrammeni",
			"character": "ᾂ"
		},
		{
			"description": "Greek Capital Letter Alpha with Dasia And Varia and Prosgegrammeni",
			"character": "ᾋ"
		},
		{
			"description": "Greek Small Letter Alpha with Dasia And Varia and Ypogegrammeni",
			"character": "ᾃ"
		},
		{
			"description": "Greek Capital Letter Alpha with Psili And Oxia and Prosgegrammeni",
			"character": "ᾌ"
		},
		{
			"description": "Greek Small Letter Alpha with Psili And Oxia and Ypogegrammeni",
			"character": "ᾄ"
		},
		{
			"description": "Greek Capital Letter Alpha with Dasia And Oxia and Prosgegrammeni",
			"character": "ᾍ"
		},
		{
			"description": "Greek Small Letter Alpha with Dasia And Oxia and Ypogegrammeni",
			"character": "ᾅ"
		},
		{
			"description": "Greek Capital Letter Alpha with Psili And Perispomeni and Prosgegrammeni",
			"character": "ᾎ"
		},
		{
			"description": "Greek Small Letter Alpha with Psili And Perispomeni and Ypogegrammeni",
			"character": "ᾆ"
		},
		{
			"description": "Greek Capital Letter Alpha with Dasia And Perispomeni and Prosgegrammeni",
			"character": "ᾏ"
		},
		{
			"description": "Greek Small Letter Alpha with Dasia And Perispomeni and Ypogegrammeni",
			"character": "ᾇ"
		},
		{
			"description": "Greek Small Letter Alpha with Varia and Ypogegrammeni",
			"character": "ᾲ"
		},
		{
			"description": "Greek Small Letter Alpha with Oxia and Ypogegrammeni",
			"character": "ᾴ"
		},
		{
			"description": "Greek Small Letter Alpha with Perispomeni",
			"character": "ᾶ"
		},
		{
			"description": "Greek Small Letter Alpha with Perispomeni and Ypogegrammeni",
			"character": "ᾷ"
		},
		{
			"description": "Greek Capital Letter Beta",
			"character": "Β"
		},
		{
			"description": "Greek Small Letter Beta",
			"character": "β"
		},
		{
			"description": "Greek Beta Symbol",
			"character": "ϐ"
		},
		{
			"description": "Greek Capital Letter Gamma",
			"character": "Γ"
		},
		{
			"description": "Greek Small Letter Gamma",
			"character": "γ"
		},
		{
			"description": "Greek Capital Letter Delta",
			"character": "Δ"
		},
		{
			"description": "Greek Small Letter Delta",
			"character": "δ"
		},
		{
			"description": "Greek Capital Letter Epsilon",
			"character": "Ε"
		},
		{
			"description": "Greek Small Letter Epsilon",
			"character": "ε"
		},
		{
			"description": "Greek Capital Letter Epsilon with Tonos",
			"character": "Έ"
		},
		{
			"description": "Greek Small Letter Epsilon with Tonos",
			"character": "έ"
		},
		{
			"description": "Greek Lunate Epsilon Symbol",
			"character": "ϵ"
		},
		{
			"description": "Greek Reversed Lunate Epsilon Symbol",
			"character": "϶"
		},
		{
			"description": "Greek Capital Letter Epsilon with Psili",
			"character": "Ἐ"
		},
		{
			"description": "Greek Small Letter Epsilon with Psili",
			"character": "ἐ"
		},
		{
			"description": "Greek Capital Letter Epsilon with Dasia",
			"character": "Ἑ"
		},
		{
			"description": "Greek Small Letter Epsilon with Dasia",
			"character": "ἑ"
		},
		{
			"description": "Greek Capital Letter Epsilon with Psili and Varia",
			"character": "Ἒ"
		},
		{
			"description": "Greek Small Letter Epsilon with Psili and Varia",
			"character": "ἒ"
		},
		{
			"description": "Greek Capital Letter Epsilon with Dasia and Varia",
			"character": "Ἓ"
		},
		{
			"description": "Greek Small Letter Epsilon with Dasia and Varia",
			"character": "ἓ"
		},
		{
			"description": "Greek Capital Letter Epsilon with Psili and Oxia",
			"character": "Ἔ"
		},
		{
			"description": "Greek Small Letter Epsilon with Psili and Oxia",
			"character": "ἔ"
		},
		{
			"description": "Greek Capital Letter Epsilon with Dasia and Oxia",
			"character": "Ἕ"
		},
		{
			"description": "Greek Small Letter Epsilon with Dasia and Oxia",
			"character": "ἕ"
		},
		{
			"description": "Greek Capital Letter Epsilon with Varia",
			"character": "Ὲ"
		},
		{
			"description": "Greek Small Letter Epsilon with Varia",
			"character": "ὲ"
		},
		{
			"description": "Greek Capital Letter Epsilon with Oxia",
			"character": "Έ"
		},
		{
			"description": "Greek Small Letter Epsilon with Oxia",
			"character": "έ"
		},
		{
			"description": "Greek Capital Letter Zeta",
			"character": "Ζ"
		},
		{
			"description": "Greek Small Letter Zeta",
			"character": "ζ"
		},
		{
			"description": "Greek Capital Letter Eta",
			"character": "Η"
		},
		{
			"description": "Greek Capital Letter Eta with Tonos",
			"character": "Ή"
		},
		{
			"description": "Greek Small Letter Eta",
			"character": "η"
		},
		{
			"description": "Greek Small Letter Eta with Tonos",
			"character": "ή"
		},
		{
			"description": "Greek Capital Letter Eta with Psili",
			"character": "Ἠ"
		},
		{
			"description": "Greek Small Letter Eta with Psili",
			"character": "ἠ"
		},
		{
			"description": "Greek Capital Letter Eta with Dasia",
			"character": "Ἡ"
		},
		{
			"description": "Greek Small Letter Eta with Dasia",
			"character": "ἡ"
		},
		{
			"description": "Greek Capital Letter Eta with Psili and Varia",
			"character": "Ἢ"
		},
		{
			"description": "Greek Small Letter Eta with Psili and Varia",
			"character": "ἢ"
		},
		{
			"description": "Greek Capital Letter Eta with Dasia and Varia",
			"character": "Ἣ"
		},
		{
			"description": "Greek Small Letter Eta with Dasia and Varia",
			"character": "ἣ"
		},
		{
			"description": "Greek Capital Letter Eta with Psili and Oxia",
			"character": "Ἤ"
		},
		{
			"description": "Greek Small Letter Eta with Psili and Oxia",
			"character": "ἤ"
		},
		{
			"description": "Greek Capital Letter Eta with Dasia and Oxia",
			"character": "Ἥ"
		},
		{
			"description": "Greek Small Letter Eta with Dasia and Oxia",
			"character": "ἥ"
		},
		{
			"description": "Greek Capital Letter Eta with Psili and Perispomeni",
			"character": "Ἦ"
		},
		{
			"description": "Greek Small Letter Eta with Psili and Perispomeni",
			"character": "ἦ"
		},
		{
			"description": "Greek Capital Letter Eta with Dasia and Perispomeni",
			"character": "Ἧ"
		},
		{
			"description": "Greek Small Letter Eta with Dasia and Perispomeni",
			"character": "ἧ"
		},
		{
			"description": "Greek Capital Letter Eta with Varia",
			"character": "Ὴ"
		},
		{
			"description": "Greek Small Letter Eta with Varia",
			"character": "ὴ"
		},
		{
			"description": "Greek Capital Letter Eta with Oxia",
			"character": "Ή"
		},
		{
			"description": "Greek Small Letter Eta with Oxia",
			"character": "ή"
		},
		{
			"description": "Greek Capital Letter Eta with Psili and Prosgegrammeni",
			"character": "ᾘ"
		},
		{
			"description": "Greek Small Letter Eta with Psili and Ypogegrammeni",
			"character": "ᾐ"
		},
		{
			"description": "Greek Capital Letter Eta with Dasia and Prosgegrammeni",
			"character": "ᾙ"
		},
		{
			"description": "Greek Small Letter Eta with Dasia and Ypogegrammeni",
			"character": "ᾑ"
		},
		{
			"description": "Greek Capital Letter Eta with Psili And Varia and Prosgegrammeni",
			"character": "ᾚ"
		},
		{
			"description": "Greek Small Letter Eta with Psili And Varia and Ypogegrammeni",
			"character": "ᾒ"
		},
		{
			"description": "Greek Capital Letter Eta with Dasia And Varia and Prosgegrammeni",
			"character": "ᾛ"
		},
		{
			"description": "Greek Small Letter Eta with Dasia And Varia and Ypogegrammeni",
			"character": "ᾓ"
		},
		{
			"description": "Greek Capital Letter Eta with Psili And Oxia and Prosgegrammeni",
			"character": "ᾜ"
		},
		{
			"description": "Greek Small Letter Eta with Psili And Oxia and Ypogegrammeni",
			"character": "ᾔ"
		},
		{
			"description": "Greek Capital Letter Eta with Dasia And Oxia and Prosgegrammeni",
			"character": "ᾝ"
		},
		{
			"description": "Greek Small Letter Eta with Dasia And Oxia and Ypogegrammeni",
			"character": "ᾕ"
		},
		{
			"description": "Greek Capital Letter Eta with Psili And Perispomeni and Prosgegrammeni",
			"character": "ᾞ"
		},
		{
			"description": "Greek Small Letter Eta with Psili And Perispomeni and Ypogegrammeni",
			"character": "ᾖ"
		},
		{
			"description": "Greek Capital Letter Eta with Dasia And Perispomeni and Prosgegrammeni",
			"character": "ᾟ"
		},
		{
			"description": "Greek Small Letter Eta with Dasia And Perispomeni and Ypogegrammeni",
			"character": "ᾗ"
		},
		{
			"description": "Greek Small Letter Eta with Varia and Ypogegrammeni",
			"character": "ῂ"
		},
		{
			"description": "Greek Capital Letter Eta with Prosgegrammeni",
			"character": "ῌ"
		},
		{
			"description": "Greek Small Letter Eta with Ypogegrammeni",
			"character": "ῃ"
		},
		{
			"description": "Greek Small Letter Eta with Oxia and Ypogegrammeni",
			"character": "ῄ"
		},
		{
			"description": "Greek Small Letter Eta with Perispomeni",
			"character": "ῆ"
		},
		{
			"description": "Greek Small Letter Eta with Perispomeni and Ypogegrammeni",
			"character": "ῇ"
		},
		{
			"description": "Greek Capital Letter Heta",
			"character": "Ͱ"
		},
		{
			"description": "Greek Small Letter Heta",
			"character": "ͱ"
		},
		{
			"description": "Greek Capital Letter Theta",
			"character": "Θ"
		},
		{
			"description": "Greek Small Letter Theta",
			"character": "θ"
		},
		{
			"description": "Greek Capital Theta Symbol",
			"character": "ϴ"
		},
		{
			"description": "Greek Theta Symbol",
			"character": "ϑ"
		},
		{
			"description": "Greek Capital Letter Iota",
			"character": "Ι"
		},
		{
			"description": "Greek Small Letter Iota",
			"character": "ι"
		},
		{
			"description": "Greek Capital Letter Iota with Dialytika",
			"character": "Ϊ"
		},
		{
			"description": "Greek Small Letter Iota with Dialytika",
			"character": "ϊ"
		},
		{
			"description": "Greek Capital Letter Iota with Tonos",
			"character": "Ί"
		},
		{
			"description": "Greek Small Letter Iota with Tonos",
			"character": "ί"
		},
		{
			"description": "Greek Small Letter Iota with Dialytika and Tonos",
			"character": "ΐ"
		},
		{
			"description": "Greek Capital Letter Iota with Psili",
			"character": "Ἰ"
		},
		{
			"description": "Greek Small Letter Iota with Psili",
			"character": "ἰ"
		},
		{
			"description": "Greek Capital Letter Iota with Dasia",
			"character": "Ἱ"
		},
		{
			"description": "Greek Small Letter Iota with Dasia",
			"character": "ἱ"
		},
		{
			"description": "Greek Capital Letter Iota with Psili and Varia",
			"character": "Ἲ"
		},
		{
			"description": "Greek Small Letter Iota with Psili and Varia",
			"character": "ἲ"
		},
		{
			"description": "Greek Capital Letter Iota with Dasia and Varia",
			"character": "Ἳ"
		},
		{
			"description": "Greek Small Letter Iota with Dasia and Varia",
			"character": "ἳ"
		},
		{
			"description": "Greek Capital Letter Iota with Psili and Oxia",
			"character": "Ἴ"
		},
		{
			"description": "Greek Small Letter Iota with Psili and Oxia",
			"character": "ἴ"
		},
		{
			"description": "Greek Capital Letter Iota with Dasia and Oxia",
			"character": "Ἵ"
		},
		{
			"description": "Greek Small Letter Iota with Dasia and Oxia",
			"character": "ἵ"
		},
		{
			"description": "Greek Capital Letter Iota with Psili and Perispomeni",
			"character": "Ἶ"
		},
		{
			"description": "Greek Small Letter Iota with Psili and Perispomeni",
			"character": "ἶ"
		},
		{
			"description": "Greek Capital Letter Iota with Dasia and Perispomeni",
			"character": "Ἷ"
		},
		{
			"description": "Greek Small Letter Iota with Dasia and Perispomeni",
			"character": "ἷ"
		},
		{
			"description": "Greek Capital Letter Iota with Varia",
			"character": "Ὶ"
		},
		{
			"description": "Greek Small Letter Iota with Varia",
			"character": "ὶ"
		},
		{
			"description": "Greek Capital Letter Iota with Oxia",
			"character": "Ί"
		},
		{
			"description": "Greek Small Letter Iota with Oxia",
			"character": "ί"
		},
		{
			"description": "Greek Capital Letter Iota with Vrachy",
			"character": "Ῐ"
		},
		{
			"description": "Greek Small Letter Iota with Vrachy",
			"character": "ῐ"
		},
		{
			"description": "Greek Capital Letter Iota with Macron",
			"character": "Ῑ"
		},
		{
			"description": "Greek Small Letter Iota with Macron",
			"character": "ῑ"
		},
		{
			"description": "Greek Small Letter Iota with Dialytika and Varia",
			"character": "ῒ"
		},
		{
			"description": "Greek Small Letter Iota with Dialytika and Oxia",
			"character": "ΐ"
		},
		{
			"description": "Greek Small Letter Iota with Perispomeni",
			"character": "ῖ"
		},
		{
			"description": "Greek Small Letter Iota with Dialytika and Perispomeni",
			"character": "ῗ"
		},
		{
			"description": "Greek Capital Letter Kappa",
			"character": "Κ"
		},
		{
			"description": "Greek Small Letter Kappa",
			"character": "κ"
		},
		{
			"description": "Greek Kappa Symbol",
			"character": "ϰ"
		},
		{
			"description": "Greek Letter Koppa",
			"character": "Ϟ"
		},
		{
			"description": "Greek Small Letter Koppa",
			"character": "ϟ"
		},
		{
			"description": "Greek Letter Archaic Koppa",
			"character": "Ϙ"
		},
		{
			"description": "Greek Small Letter Archaic Koppa",
			"character": "ϙ"
		},
		{
			"description": "Greek Capital Letter Lamda",
			"character": "Λ"
		},
		{
			"description": "Greek Small Letter Lamda",
			"character": "λ"
		},
		{
			"description": "Greek Capital Letter Mu",
			"character": "Μ"
		},
		{
			"description": "Greek Small Letter Mu",
			"character": "μ"
		},
		{
			"description": "Greek Capital Letter Nu",
			"character": "Ν"
		},
		{
			"description": "Greek Small Letter Nu",
			"character": "ν"
		},
		{
			"description": "Greek Capital Letter Xi",
			"character": "Ξ"
		},
		{
			"description": "Greek Small Letter Xi",
			"character": "ξ"
		},
		{
			"description": "Greek Capital Letter Omicron",
			"character": "Ο"
		},
		{
			"description": "Greek Small Letter Omicron",
			"character": "ο"
		},
		{
			"description": "Greek Capital Letter Omicron with Tonos",
			"character": "Ό"
		},
		{
			"description": "Greek Small Letter Omicron with Tonos",
			"character": "ό"
		},
		{
			"description": "Greek Capital Letter Omicron with Psili",
			"character": "Ὀ"
		},
		{
			"description": "Greek Small Letter Omicron with Psili",
			"character": "ὀ"
		},
		{
			"description": "Greek Capital Letter Omicron with Dasia",
			"character": "Ὁ"
		},
		{
			"description": "Greek Small Letter Omicron with Dasia",
			"character": "ὁ"
		},
		{
			"description": "Greek Capital Letter Omicron with Psili and Varia",
			"character": "Ὂ"
		},
		{
			"description": "Greek Small Letter Omicron with Psili and Varia",
			"character": "ὂ"
		},
		{
			"description": "Greek Capital Letter Omicron with Dasia and Varia",
			"character": "Ὃ"
		},
		{
			"description": "Greek Small Letter Omicron with Dasia and Varia",
			"character": "ὃ"
		},
		{
			"description": "Greek Capital Letter Omicron with Psili and Oxia",
			"character": "Ὄ"
		},
		{
			"description": "Greek Small Letter Omicron with Psili and Oxia",
			"character": "ὄ"
		},
		{
			"description": "Greek Capital Letter Omicron with Dasia and Oxia",
			"character": "Ὅ"
		},
		{
			"description": "Greek Small Letter Omicron with Dasia and Oxia",
			"character": "ὅ"
		},
		{
			"description": "Greek Capital Letter Omicron with Varia",
			"character": "Ὸ"
		},
		{
			"description": "Greek Small Letter Omicron with Varia",
			"character": "ὸ"
		},
		{
			"description": "Greek Capital Letter Omicron with Oxia",
			"character": "Ό"
		},
		{
			"description": "Greek Small Letter Omicron with Oxia",
			"character": "ό"
		},
		{
			"description": "Greek Capital Letter Pi",
			"character": "Π"
		},
		{
			"description": "Greek Small Letter Pi",
			"character": "π"
		},
		{
			"description": "Greek Pi Symbol",
			"character": "ϖ"
		},
		{
			"description": "Greek Capital Letter San",
			"character": "Ϻ"
		},
		{
			"description": "Greek Small Letter San",
			"character": "ϻ"
		},
		{
			"description": "Greek Capital Letter Rho",
			"character": "Ρ"
		},
		{
			"description": "Greek Small Letter Rho",
			"character": "ρ"
		},
		{
			"description": "Greek Rho Symbol",
			"character": "ϱ"
		},
		{
			"description": "Greek Rho with Stroke Symbol",
			"character": "ϼ"
		},
		{
			"description": "Greek Small Letter Rho with Psili",
			"character": "ῤ"
		},
		{
			"description": "Greek Capital Letter Rho with Dasia",
			"character": "Ῥ"
		},
		{
			"description": "Greek Small Letter Rho with Dasia",
			"character": "ῥ"
		},
		{
			"description": "Greek Capital Letter Sigma",
			"character": "Σ"
		},
		{
			"description": "Greek Capital Lunate Sigma Symbol",
			"character": "Ϲ"
		},
		{
			"description": "Greek Capital Reversed Lunate Sigma Symbol",
			"character": "Ͻ"
		},
		{
			"description": "Greek Capital Dotted Lunate Sigma Symbol",
			"character": "Ͼ"
		},
		{
			"description": "Greek Capital Reversed Dotted Lunate Sigma Symbol",
			"character": "Ͽ"
		},
		{
			"description": "Greek Small Letter Sigma",
			"character": "σ"
		},
		{
			"description": "Greek Small Letter Final Sigma",
			"character": "ς"
		},
		{
			"description": "Greek Small Reversed Lunate Sigma Symbol",
			"character": "ͻ"
		},
		{
			"description": "Greek Small Dotted Lunate Sigma Symbol",
			"character": "ͼ"
		},
		{
			"description": "Greek Small Reversed Dotted Lunate Sigma Symbol",
			"character": "ͽ"
		},
		{
			"description": "Greek Lunate Sigma Symbol",
			"character": "ϲ"
		},
		{
			"description": "Greek Letter Stigma",
			"character": "Ϛ"
		},
		{
			"description": "Greek Small Letter Stigma",
			"character": "ϛ"
		},
		{
			"description": "Greek Capital Letter Tau",
			"character": "Τ"
		},
		{
			"description": "Greek Small Letter Tau",
			"character": "τ"
		},
		{
			"description": "Greek Capital Letter Upsilon",
			"character": "Υ"
		},
		{
			"description": "Greek Small Letter Upsilon",
			"character": "υ"
		},
		{
			"description": "Greek Capital Letter Upsilon with Dialytika",
			"character": "Ϋ"
		},
		{
			"description": "Greek Small Letter Upsilon with Dialytika",
			"character": "ϋ"
		},
		{
			"description": "Greek Capital Letter Upsilon with Tonos",
			"character": "Ύ"
		},
		{
			"description": "Greek Small Letter Upsilon with Tonos",
			"character": "ύ"
		},
		{
			"description": "Greek Upsilon with Hook Symbol",
			"character": "ϒ"
		},
		{
			"description": "Greek Upsilon with Acute and Hook Symbol",
			"character": "ϓ"
		},
		{
			"description": "Greek Upsilon with Diaeresis and Hook Symbol",
			"character": "ϔ"
		},
		{
			"description": "Greek Small Letter Upsilon with Dialytika and Tonos",
			"character": "ΰ"
		},
		{
			"description": "Greek Small Letter Upsilon with Psili",
			"character": "ὐ"
		},
		{
			"description": "Greek Capital Letter Upsilon with Dasia",
			"character": "Ὑ"
		},
		{
			"description": "Greek Small Letter Upsilon with Dasia",
			"character": "ὑ"
		},
		{
			"description": "Greek Small Letter Upsilon with Psili and Varia",
			"character": "ὒ"
		},
		{
			"description": "Greek Capital Letter Upsilon with Dasia and Varia",
			"character": "Ὓ"
		},
		{
			"description": "Greek Small Letter Upsilon with Dasia and Varia",
			"character": "ὓ"
		},
		{
			"description": "Greek Small Letter Upsilon with Psili and Oxia",
			"character": "ὔ"
		},
		{
			"description": "Greek Capital Letter Upsilon with Dasia and Oxia",
			"character": "Ὕ"
		},
		{
			"description": "Greek Small Letter Upsilon with Dasia and Oxia",
			"character": "ὕ"
		},
		{
			"description": "Greek Small Letter Upsilon with Psili and Perispomeni",
			"character": "ὖ"
		},
		{
			"description": "Greek Capital Letter Upsilon with Dasia and Perispomeni",
			"character": "Ὗ"
		},
		{
			"description": "Greek Small Letter Upsilon with Dasia and Perispomeni",
			"character": "ὗ"
		},
		{
			"description": "Greek Capital Letter Upsilon with Varia",
			"character": "Ὺ"
		},
		{
			"description": "Greek Small Letter Upsilon with Varia",
			"character": "ὺ"
		},
		{
			"description": "Greek Capital Letter Upsilon with Oxia",
			"character": "Ύ"
		},
		{
			"description": "Greek Small Letter Upsilon with Oxia",
			"character": "ύ"
		},
		{
			"description": "Greek Capital Letter Upsilon with Vrachy",
			"character": "Ῠ"
		},
		{
			"description": "Greek Small Letter Upsilon with Vrachy",
			"character": "ῠ"
		},
		{
			"description": "Greek Capital Letter Upsilon with Macron",
			"character": "Ῡ"
		},
		{
			"description": "Greek Small Letter Upsilon with Macron",
			"character": "ῡ"
		},
		{
			"description": "Greek Small Letter Upsilon with Dialytika and Varia",
			"character": "ῢ"
		},
		{
			"description": "Greek Small Letter Upsilon with Dialytika and Oxia",
			"character": "ΰ"
		},
		{
			"description": "Greek Small Letter Upsilon with Perispomeni",
			"character": "ῦ"
		},
		{
			"description": "Greek Small Letter Upsilon with Dialytika and Perispomeni",
			"character": "ῧ"
		},
		{
			"description": "Greek Capital Letter Phi",
			"character": "Φ"
		},
		{
			"description": "Greek Small Letter Phi",
			"character": "φ"
		},
		{
			"description": "Greek Phi Symbol",
			"character": "ϕ"
		},
		{
			"description": "Greek Capital Letter Chi",
			"character": "Χ"
		},
		{
			"description": "Greek Small Letter Chi",
			"character": "χ"
		},
		{
			"description": "Greek Capital Letter Psi",
			"character": "Ψ"
		},
		{
			"description": "Greek Small Letter Psi",
			"character": "ψ"
		},
		{
			"description": "Greek Capital Letter Omega",
			"character": "Ω"
		},
		{
			"description": "Greek Letter Small Capital Omega",
			"character": "ꭥ"
		},
		{
			"description": "Greek Small Letter Omega",
			"character": "ω"
		},
		{
			"description": "Greek Capital Letter Omega with Tonos",
			"character": "Ώ"
		},
		{
			"description": "Greek Small Letter Omega with Tonos",
			"character": "ώ"
		},
		{
			"description": "Greek Capital Letter Omega with Psili",
			"character": "Ὠ"
		},
		{
			"description": "Greek Small Letter Omega with Psili",
			"character": "ὠ"
		},
		{
			"description": "Greek Capital Letter Omega with Dasia",
			"character": "Ὡ"
		},
		{
			"description": "Greek Small Letter Omega with Dasia",
			"character": "ὡ"
		},
		{
			"description": "Greek Capital Letter Omega with Psili and Varia",
			"character": "Ὢ"
		},
		{
			"description": "Greek Small Letter Omega with Psili and Varia",
			"character": "ὢ"
		},
		{
			"description": "Greek Capital Letter Omega with Dasia and Varia",
			"character": "Ὣ"
		},
		{
			"description": "Greek Small Letter Omega with Dasia and Varia",
			"character": "ὣ"
		},
		{
			"description": "Greek Capital Letter Omega with Psili and Oxia",
			"character": "Ὤ"
		},
		{
			"description": "Greek Small Letter Omega with Psili and Oxia",
			"character": "ὤ"
		},
		{
			"description": "Greek Capital Letter Omega with Dasia and Oxia",
			"character": "Ὥ"
		},
		{
			"description": "Greek Small Letter Omega with Dasia and Oxia",
			"character": "ὥ"
		},
		{
			"description": "Greek Capital Letter Omega with Psili and Perispomeni",
			"character": "Ὦ"
		},
		{
			"description": "Greek Small Letter Omega with Psili and Perispomeni",
			"character": "ὦ"
		},
		{
			"description": "Greek Capital Letter Omega with Dasia and Perispomeni",
			"character": "Ὧ"
		},
		{
			"description": "Greek Small Letter Omega with Dasia and Perispomeni",
			"character": "ὧ"
		},
		{
			"description": "Greek Capital Letter Omega with Varia",
			"character": "Ὼ"
		},
		{
			"description": "Greek Small Letter Omega with Varia",
			"character": "ὼ"
		},
		{
			"description": "Greek Capital Letter Omega with Oxia",
			"character": "Ώ"
		},
		{
			"description": "Greek Small Letter Omega with Oxia",
			"character": "ώ"
		},
		{
			"description": "Greek Capital Letter Omega with Prosgegrammeni",
			"character": "ῼ"
		},
		{
			"description": "Greek Capital Letter Omega with Psili and Prosgegrammeni",
			"character": "ᾨ"
		},
		{
			"description": "Greek Small Letter Omega with Psili and Ypogegrammeni",
			"character": "ᾠ"
		},
		{
			"description": "Greek Capital Letter Omega with Dasia and Prosgegrammeni",
			"character": "ᾩ"
		},
		{
			"description": "Greek Small Letter Omega with Dasia and Ypogegrammeni",
			"character": "ᾡ"
		},
		{
			"description": "Greek Capital Letter Omega with Psili And Varia and Prosgegrammeni",
			"character": "ᾪ"
		},
		{
			"description": "Greek Small Letter Omega with Psili And Varia and Ypogegrammeni",
			"character": "ᾢ"
		},
		{
			"description": "Greek Capital Letter Omega with Dasia And Varia and Prosgegrammeni",
			"character": "ᾫ"
		},
		{
			"description": "Greek Small Letter Omega with Dasia And Varia and Ypogegrammeni",
			"character": "ᾣ"
		},
		{
			"description": "Greek Capital Letter Omega with Psili And Oxia and Prosgegrammeni",
			"character": "ᾬ"
		},
		{
			"description": "Greek Small Letter Omega with Psili And Oxia and Ypogegrammeni",
			"character": "ᾤ"
		},
		{
			"description": "Greek Capital Letter Omega with Dasia And Oxia and Prosgegrammeni",
			"character": "ᾭ"
		},
		{
			"description": "Greek Small Letter Omega with Dasia And Oxia and Ypogegrammeni",
			"character": "ᾥ"
		},
		{
			"description": "Greek Capital Letter Omega with Psili And Perispomeni and Prosgegrammeni",
			"character": "ᾮ"
		},
		{
			"description": "Greek Small Letter Omega with Psili And Perispomeni and Ypogegrammeni",
			"character": "ᾦ"
		},
		{
			"description": "Greek Capital Letter Omega with Dasia And Perispomeni and Prosgegrammeni",
			"character": "ᾯ"
		},
		{
			"description": "Greek Small Letter Omega with Dasia And Perispomeni and Ypogegrammeni",
			"character": "ᾧ"
		},
		{
			"description": "Greek Small Letter Omega with Varia and Ypogegrammeni",
			"character": "ῲ"
		},
		{
			"description": "Greek Small Letter Omega with Ypogegrammeni",
			"character": "ῳ"
		},
		{
			"description": "Greek Small Letter Omega with Oxia and Ypogegrammeni",
			"character": "ῴ"
		},
		{
			"description": "Greek Small Letter Omega with Perispomeni",
			"character": "ῶ"
		},
		{
			"description": "Greek Small Letter Omega with Perispomeni and Ypogegrammeni",
			"character": "ῷ"
		},
		{
			"description": "Greek Capital Kai Symbol",
			"character": "Ϗ"
		},
		{
			"description": "Greek Kai Symbol",
			"character": "ϗ"
		},
		{
			"description": "Greek Capital Letter Yot",
			"character": "Ϳ"
		},
		{
			"description": "Greek Letter Yot",
			"character": "ϳ"
		},
		{
			"description": "Greek Letter Digamma",
			"character": "Ϝ"
		},
		{
			"description": "Greek Small Letter Digamma",
			"character": "ϝ"
		},
		{
			"description": "Greek Capital Letter Pamphylian Digamma",
			"character": "Ͷ"
		},
		{
			"description": "Greek Small Letter Pamphylian Digamma",
			"character": "ͷ"
		},
		{
			"description": "Greek Letter Sampi",
			"character": "Ϡ"
		},
		{
			"description": "Greek Small Letter Sampi",
			"character": "ϡ"
		},
		{
			"description": "Greek Capital Letter Archaic Sampi",
			"character": "Ͳ"
		},
		{
			"description": "Greek Small Letter Archaic Sampi",
			"character": "ͳ"
		},
		{
			"description": "Greek Capital Letter Sho",
			"character": "Ϸ"
		},
		{
			"description": "Greek Small Letter Sho",
			"character": "ϸ"
		},
		{
			"description": "Greek Ypogegrammeni",
			"character": "ͺ"
		},
		{
			"description": "Greek Question Mark",
			"character": ";"
		},
		{
			"description": "Greek Koronis",
			"character": "᾽"
		},
		{
			"description": "Greek Prosgegrammeni",
			"character": "ι"
		},
		{
			"description": "Greek Psili",
			"character": "᾿"
		},
		{
			"description": "Greek Dasia",
			"character": "῾"
		},
		{
			"description": "Greek Varia",
			"character": "`"
		},
		{
			"description": "Greek Oxia",
			"character": "´"
		},
		{
			"description": "Greek Perispomeni",
			"character": "῀"
		},
		{
			"description": "Greek Psili and Varia",
			"character": "῍"
		},
		{
			"description": "Greek Psili and Oxia",
			"character": "῎"
		},
		{
			"description": "Greek Psili and Perispomeni",
			"character": "῏"
		},
		{
			"description": "Greek Dasia and Varia",
			"character": "῝"
		},
		{
			"description": "Greek Dasia and Oxia",
			"character": "῞"
		},
		{
			"description": "Greek Dasia and Perispomeni",
			"character": "῟"
		},
		{
			"description": "Greek Dialytika and Varia",
			"character": "῭"
		},
		{
			"description": "Greek Dialytika and Oxia",
			"character": "΅"
		},
		{
			"description": "Greek Dialytika and Perispomeni",
			"character": "῁"
		}
	],
};
const Coptic = {
	title: "Coptic",
	content: [
		{
			"description": "Coptic Capital Letter Shei",
			"character": "Ϣ"
		},
		{
			"description": "Coptic Small Letter Shei",
			"character": "ϣ"
		},
		{
			"description": "Coptic Capital Letter Fei",
			"character": "Ϥ"
		},
		{
			"description": "Coptic Small Letter Fei",
			"character": "ϥ"
		},
		{
			"description": "Coptic Capital Letter Khei",
			"character": "Ϧ"
		},
		{
			"description": "Coptic Small Letter Khei",
			"character": "ϧ"
		},
		{
			"description": "Coptic Capital Letter Hori",
			"character": "Ϩ"
		},
		{
			"description": "Coptic Small Letter Hori",
			"character": "ϩ"
		},
		{
			"description": "Coptic Capital Letter Gangia",
			"character": "Ϫ"
		},
		{
			"description": "Coptic Small Letter Gangia",
			"character": "ϫ"
		},
		{
			"description": "Coptic Capital Letter Shima",
			"character": "Ϭ"
		},
		{
			"description": "Coptic Small Letter Shima",
			"character": "ϭ"
		},
		{
			"description": "Coptic Capital Letter Dei",
			"character": "Ϯ"
		},
		{
			"description": "Coptic Small Letter Dei",
			"character": "ϯ"
		}
	],
};
const Cyrillic = {
	title: "Cyrillic",
	content: [
		{
			"description": "Cyrillic Capital Letter Dje",
			"character": "Ђ"
		},
		{
			"description": "Cyrillic Small Letter Dje",
			"character": "ђ"
		},
		{
			"description": "Cyrillic Capital Letter Komi Dje",
			"character": "Ԃ"
		},
		{
			"description": "Cyrillic Small Letter Komi Dje",
			"character": "ԃ"
		},
		{
			"description": "Cyrillic Capital Letter Komi Zje",
			"character": "Ԅ"
		},
		{
			"description": "Cyrillic Small Letter Komi Zje",
			"character": "ԅ"
		},
		{
			"description": "Cyrillic Capital Letter Gje",
			"character": "Ѓ"
		},
		{
			"description": "Cyrillic Small Letter Gje",
			"character": "ѓ"
		},
		{
			"description": "Cyrillic Capital Letter Dze",
			"character": "Ѕ"
		},
		{
			"description": "Cyrillic Small Letter Dze",
			"character": "ѕ"
		},
		{
			"description": "Cyrillic Capital Letter Reversed Dze",
			"character": "Ꙅ"
		},
		{
			"description": "Cyrillic Small Letter Reversed Dze",
			"character": "ꙅ"
		},
		{
			"description": "Cyrillic Capital Letter Abkhasian Dze",
			"character": "Ӡ"
		},
		{
			"description": "Cyrillic Small Letter Abkhasian Dze",
			"character": "ӡ"
		},
		{
			"description": "Cyrillic Capital Letter Yi",
			"character": "Ї"
		},
		{
			"description": "Cyrillic Small Letter Yi",
			"character": "ї"
		},
		{
			"description": "Cyrillic Capital Letter Je",
			"character": "Ј"
		},
		{
			"description": "Cyrillic Small Letter Je",
			"character": "ј"
		},
		{
			"description": "Cyrillic Capital Letter Lje",
			"character": "Љ"
		},
		{
			"description": "Cyrillic Small Letter Lje",
			"character": "љ"
		},
		{
			"description": "Cyrillic Capital Letter Komi Lje",
			"character": "Ԉ"
		},
		{
			"description": "Cyrillic Small Letter Komi Lje",
			"character": "ԉ"
		},
		{
			"description": "Cyrillic Capital Letter Nje",
			"character": "Њ"
		},
		{
			"description": "Cyrillic Small Letter Nje",
			"character": "њ"
		},
		{
			"description": "Cyrillic Capital Letter Komi Nje",
			"character": "Ԋ"
		},
		{
			"description": "Cyrillic Small Letter Komi Nje",
			"character": "ԋ"
		},
		{
			"description": "Cyrillic Capital Letter Tshe",
			"character": "Ћ"
		},
		{
			"description": "Cyrillic Small Letter Tshe",
			"character": "ћ"
		},
		{
			"description": "Cyrillic Capital Letter Kje",
			"character": "Ќ"
		},
		{
			"description": "Cyrillic Small Letter Kje",
			"character": "ќ"
		},
		{
			"description": "Cyrillic Capital Letter Short U",
			"character": "Ў"
		},
		{
			"description": "Cyrillic Small Letter Short U",
			"character": "ў"
		},
		{
			"description": "Cyrillic Capital Letter Dzhe",
			"character": "Џ"
		},
		{
			"description": "Cyrillic Small Letter Dzhe",
			"character": "џ"
		},
		{
			"description": "Cyrillic Capital Letter A",
			"character": "А"
		},
		{
			"description": "Cyrillic Small Letter A",
			"character": "а"
		},
		{
			"description": "Cyrillic Capital Letter A with Breve",
			"character": "Ӑ"
		},
		{
			"description": "Cyrillic Small Letter A with Breve",
			"character": "ӑ"
		},
		{
			"description": "Cyrillic Capital Letter A with Diaeresis",
			"character": "Ӓ"
		},
		{
			"description": "Cyrillic Small Letter A with Diaeresis",
			"character": "ӓ"
		},
		{
			"description": "Cyrillic Capital Letter Iotified A",
			"character": "Ꙗ"
		},
		{
			"description": "Cyrillic Small Letter Iotified A",
			"character": "ꙗ"
		},
		{
			"description": "Cyrillic Capital Ligature A Ie",
			"character": "Ӕ"
		},
		{
			"description": "Cyrillic Small Ligature A Ie",
			"character": "ӕ"
		},
		{
			"description": "Cyrillic Capital Letter Be",
			"character": "Б"
		},
		{
			"description": "Cyrillic Small Letter Be",
			"character": "б"
		},
		{
			"description": "Cyrillic Capital Letter Ve",
			"character": "В"
		},
		{
			"description": "Cyrillic Small Letter Ve",
			"character": "в"
		},
		{
			"description": "Cyrillic Capital Letter Ghe",
			"character": "Г"
		},
		{
			"description": "Cyrillic Small Letter Ghe",
			"character": "г"
		},
		{
			"description": "Cyrillic Capital Letter Ghe with Upturn",
			"character": "Ґ"
		},
		{
			"description": "Cyrillic Small Letter Ghe with Upturn",
			"character": "ґ"
		},
		{
			"description": "Cyrillic Capital Letter Ghe with Stroke",
			"character": "Ғ"
		},
		{
			"description": "Cyrillic Small Letter Ghe with Stroke",
			"character": "ғ"
		},
		{
			"description": "Cyrillic Capital Letter Ghe with Middle Hook",
			"character": "Ҕ"
		},
		{
			"description": "Cyrillic Small Letter Ghe with Middle Hook",
			"character": "ҕ"
		},
		{
			"description": "Cyrillic Capital Letter Ghe with Descender",
			"character": "Ӷ"
		},
		{
			"description": "Cyrillic Small Letter Ghe with Descender",
			"character": "ӷ"
		},
		{
			"description": "Cyrillic Capital Letter Ghe with Stroke and Hook",
			"character": "Ӻ"
		},
		{
			"description": "Cyrillic Small Letter Ghe with Stroke and Hook",
			"character": "ӻ"
		},
		{
			"description": "Cyrillic Capital Letter De",
			"character": "Д"
		},
		{
			"description": "Cyrillic Small Letter De",
			"character": "д"
		},
		{
			"description": "Cyrillic Capital Letter Komi De",
			"character": "Ԁ"
		},
		{
			"description": "Cyrillic Small Letter Komi De",
			"character": "ԁ"
		},
		{
			"description": "Cyrillic Capital Letter Soft De",
			"character": "Ꙣ"
		},
		{
			"description": "Cyrillic Small Letter Soft De",
			"character": "ꙣ"
		},
		{
			"description": "Cyrillic Capital Letter Ie",
			"character": "Е"
		},
		{
			"description": "Cyrillic Small Letter Ie",
			"character": "е"
		},
		{
			"description": "Cyrillic Capital Letter Ie with Grave",
			"character": "Ѐ"
		},
		{
			"description": "Cyrillic Small Letter Ie with Grave",
			"character": "ѐ"
		},
		{
			"description": "Cyrillic Capital Letter Ukrainian Ie",
			"character": "Є"
		},
		{
			"description": "Cyrillic Small Letter Ukrainian Ie",
			"character": "є"
		},
		{
			"description": "Cyrillic Capital Letter Ie with Breve",
			"character": "Ӗ"
		},
		{
			"description": "Cyrillic Small Letter Ie with Breve",
			"character": "ӗ"
		},
		{
			"description": "Cyrillic Small Letter Io",
			"character": "ё"
		},
		{
			"description": "Cyrillic Capital Letter Io",
			"character": "Ё"
		},
		{
			"description": "Cyrillic Capital Letter Schwa",
			"character": "Ә"
		},
		{
			"description": "Cyrillic Small Letter Schwa",
			"character": "ә"
		},
		{
			"description": "Cyrillic Capital Letter Schwa with Diaeresis",
			"character": "Ӛ"
		},
		{
			"description": "Cyrillic Small Letter Schwa with Diaeresis",
			"character": "ӛ"
		},
		{
			"description": "Cyrillic Capital Letter Zhe",
			"character": "Ж"
		},
		{
			"description": "Cyrillic Small Letter Zhe",
			"character": "ж"
		},
		{
			"description": "Cyrillic Capital Letter Zhe with Descender",
			"character": "Җ"
		},
		{
			"description": "Cyrillic Small Letter Zhe with Descender",
			"character": "җ"
		},
		{
			"description": "Cyrillic Capital Letter Zhe with Breve",
			"character": "Ӂ"
		},
		{
			"description": "Cyrillic Small Letter Zhe with Breve",
			"character": "ӂ"
		},
		{
			"description": "Cyrillic Capital Letter Zhe with Diaeresis",
			"character": "Ӝ"
		},
		{
			"description": "Cyrillic Small Letter Zhe with Diaeresis",
			"character": "ӝ"
		},
		{
			"description": "Cyrillic Capital Letter Ze",
			"character": "З"
		},
		{
			"description": "Cyrillic Small Letter Ze",
			"character": "з"
		},
		{
			"description": "Cyrillic Capital Letter Ze with Descender",
			"character": "Ҙ"
		},
		{
			"description": "Cyrillic Small Letter Ze with Descender",
			"character": "ҙ"
		},
		{
			"description": "Cyrillic Capital Letter Ze with Diaeresis",
			"character": "Ӟ"
		},
		{
			"description": "Cyrillic Small Letter Ze with Diaeresis",
			"character": "ӟ"
		},
		{
			"description": "Cyrillic Capital Letter Reversed Ze",
			"character": "Ԑ"
		},
		{
			"description": "Cyrillic Small Letter Reversed Ze",
			"character": "ԑ"
		},
		{
			"description": "Cyrillic Capital Letter I",
			"character": "И"
		},
		{
			"description": "Cyrillic Small Letter I",
			"character": "и"
		},
		{
			"description": "Cyrillic Capital Letter I with Grave",
			"character": "Ѝ"
		},
		{
			"description": "Cyrillic Small Letter I with Grave",
			"character": "ѝ"
		},
		{
			"description": "Cyrillic Capital Letter Short I",
			"character": "Й"
		},
		{
			"description": "Cyrillic Small Letter Short I",
			"character": "й"
		},
		{
			"description": "Cyrillic Capital Letter Short I with Tail",
			"character": "Ҋ"
		},
		{
			"description": "Cyrillic Small Letter Short I with Tail",
			"character": "ҋ"
		},
		{
			"description": "Cyrillic Capital Letter Byelorussian-Ukrainian I",
			"character": "І"
		},
		{
			"description": "Cyrillic Small Letter Byelorussian-Ukrainian I",
			"character": "і"
		},
		{
			"description": "Cyrillic Capital Letter I with Macron",
			"character": "Ӣ"
		},
		{
			"description": "Cyrillic Small Letter I with Macron",
			"character": "ӣ"
		},
		{
			"description": "Cyrillic Capital Letter I with Diaeresis",
			"character": "Ӥ"
		},
		{
			"description": "Cyrillic Small Letter I with Diaeresis",
			"character": "ӥ"
		},
		{
			"description": "Cyrillic Capital Letter Ka",
			"character": "К"
		},
		{
			"description": "Cyrillic Small Letter Ka",
			"character": "к"
		},
		{
			"description": "Cyrillic Capital Letter Ka with Descender",
			"character": "Қ"
		},
		{
			"description": "Cyrillic Small Letter Ka with Descender",
			"character": "қ"
		},
		{
			"description": "Cyrillic Capital Letter Ka with Vertical Stroke",
			"character": "Ҝ"
		},
		{
			"description": "Cyrillic Small Letter Ka with Vertical Stroke",
			"character": "ҝ"
		},
		{
			"description": "Cyrillic Capital Letter Ka with Stroke",
			"character": "Ҟ"
		},
		{
			"description": "Cyrillic Small Letter Ka with Stroke",
			"character": "ҟ"
		},
		{
			"description": "Cyrillic Capital Letter Ka with Hook",
			"character": "Ӄ"
		},
		{
			"description": "Cyrillic Small Letter Ka with Hook",
			"character": "ӄ"
		},
		{
			"description": "Cyrillic Capital Letter Bashkir Ka",
			"character": "Ҡ"
		},
		{
			"description": "Cyrillic Small Letter Bashkir Ka",
			"character": "ҡ"
		},
		{
			"description": "Cyrillic Capital Letter Aleut Ka",
			"character": "Ԟ"
		},
		{
			"description": "Cyrillic Small Letter Aleut Ka",
			"character": "ԟ"
		},
		{
			"description": "Cyrillic Capital Letter El",
			"character": "Л"
		},
		{
			"description": "Cyrillic Small Letter El",
			"character": "л"
		},
		{
			"description": "Cyrillic Capital Letter El with Tail",
			"character": "Ӆ"
		},
		{
			"description": "Cyrillic Small Letter El with Tail",
			"character": "ӆ"
		},
		{
			"description": "Cyrillic Capital Letter El with Hook",
			"character": "Ԓ"
		},
		{
			"description": "Cyrillic Small Letter El with Hook",
			"character": "ԓ"
		},
		{
			"description": "Cyrillic Capital Letter El with Middle Hook",
			"character": "Ԡ"
		},
		{
			"description": "Cyrillic Small Letter El with Middle Hook",
			"character": "ԡ"
		},
		{
			"description": "Cyrillic Capital Letter El with Descender",
			"character": "Ԯ"
		},
		{
			"description": "Cyrillic Small Letter El with Descender",
			"character": "ԯ"
		},
		{
			"description": "Cyrillic Capital Letter Soft El",
			"character": "Ꙥ"
		},
		{
			"description": "Cyrillic Small Letter Soft El",
			"character": "ꙥ"
		},
		{
			"description": "Cyrillic Capital Letter Em",
			"character": "М"
		},
		{
			"description": "Cyrillic Small Letter Em",
			"character": "м"
		},
		{
			"description": "Cyrillic Capital Letter Em with Tail",
			"character": "Ӎ"
		},
		{
			"description": "Cyrillic Small Letter Em with Tail",
			"character": "ӎ"
		},
		{
			"description": "Cyrillic Capital Letter Soft Em",
			"character": "Ꙧ"
		},
		{
			"description": "Cyrillic Small Letter Soft Em",
			"character": "ꙧ"
		},
		{
			"description": "Cyrillic Capital Letter En",
			"character": "Н"
		},
		{
			"description": "Cyrillic Small Letter En",
			"character": "н"
		},
		{
			"description": "Cyrillic Capital Letter En with Hook",
			"character": "Ӈ"
		},
		{
			"description": "Cyrillic Small Letter En with Hook",
			"character": "ӈ"
		},
		{
			"description": "Cyrillic Capital Letter En with Middle Hook",
			"character": "Ԣ"
		},
		{
			"description": "Cyrillic Small Letter En with Middle Hook",
			"character": "ԣ"
		},
		{
			"description": "Cyrillic Capital Letter En with Tail",
			"character": "Ӊ"
		},
		{
			"description": "Cyrillic Small Letter En with Tail",
			"character": "ӊ"
		},
		{
			"description": "Cyrillic Capital Letter En with Descender",
			"character": "Ң"
		},
		{
			"description": "Cyrillic Small Letter En with Descender",
			"character": "ң"
		},
		{
			"description": "Cyrillic Capital Letter En with Left Hook",
			"character": "Ԩ"
		},
		{
			"description": "Cyrillic Small Letter En with Left Hook",
			"character": "ԩ"
		},
		{
			"description": "Cyrillic Capital Ligature En Ghe",
			"character": "Ҥ"
		},
		{
			"description": "Cyrillic Small Ligature En Ghe",
			"character": "ҥ"
		},
		{
			"description": "Cyrillic Capital Letter O",
			"character": "О"
		},
		{
			"description": "Cyrillic Small Letter O",
			"character": "о"
		},
		{
			"description": "Cyrillic Capital Letter O with Diaeresis",
			"character": "Ӧ"
		},
		{
			"description": "Cyrillic Small Letter O with Diaeresis",
			"character": "ӧ"
		},
		{
			"description": "Cyrillic Capital Letter Barred O",
			"character": "Ө"
		},
		{
			"description": "Cyrillic Small Letter Barred O",
			"character": "ө"
		},
		{
			"description": "Cyrillic Capital Letter Barred O with Diaeresis",
			"character": "Ӫ"
		},
		{
			"description": "Cyrillic Small Letter Barred O with Diaeresis",
			"character": "ӫ"
		},
		{
			"description": "Cyrillic Capital Letter Pe",
			"character": "П"
		},
		{
			"description": "Cyrillic Small Letter Pe",
			"character": "п"
		},
		{
			"description": "Cyrillic Capital Letter Pe with Middle Hook",
			"character": "Ҧ"
		},
		{
			"description": "Cyrillic Small Letter Pe with Middle Hook",
			"character": "ҧ"
		},
		{
			"description": "Cyrillic Capital Letter Pe with Descender",
			"character": "Ԥ"
		},
		{
			"description": "Cyrillic Small Letter Pe with Descender",
			"character": "ԥ"
		},
		{
			"description": "Cyrillic Capital Letter Er",
			"character": "Р"
		},
		{
			"description": "Cyrillic Small Letter Er",
			"character": "р"
		},
		{
			"description": "Cyrillic Capital Letter Er with Tick",
			"character": "Ҏ"
		},
		{
			"description": "Cyrillic Small Letter Er with Tick",
			"character": "ҏ"
		},
		{
			"description": "Cyrillic Capital Letter Es",
			"character": "С"
		},
		{
			"description": "Cyrillic Small Letter Es",
			"character": "с"
		},
		{
			"description": "Cyrillic Capital Letter Es with Descender",
			"character": "Ҫ"
		},
		{
			"description": "Cyrillic Small Letter Es with Descender",
			"character": "ҫ"
		},
		{
			"description": "Cyrillic Capital Letter Te",
			"character": "Т"
		},
		{
			"description": "Cyrillic Small Letter Te",
			"character": "т"
		},
		{
			"description": "Cyrillic Capital Letter Te with Descender",
			"character": "Ҭ"
		},
		{
			"description": "Cyrillic Small Letter Te with Descender",
			"character": "ҭ"
		},
		{
			"description": "Cyrillic Capital Letter Te with Middle Hook",
			"character": "Ꚋ"
		},
		{
			"description": "Cyrillic Small Letter Te with Middle Hook",
			"character": "ꚋ"
		},
		{
			"description": "Cyrillic Capital Ligature Te Tse",
			"character": "Ҵ"
		},
		{
			"description": "Cyrillic Small Ligature Te Tse",
			"character": "ҵ"
		},
		{
			"description": "Cyrillic Capital Letter U",
			"character": "У"
		},
		{
			"description": "Cyrillic Small Letter U",
			"character": "у"
		},
		{
			"description": "Cyrillic Capital Letter U with Macron",
			"character": "Ӯ"
		},
		{
			"description": "Cyrillic Small Letter U with Macron",
			"character": "ӯ"
		},
		{
			"description": "Cyrillic Capital Letter U with Diaeresis",
			"character": "Ӱ"
		},
		{
			"description": "Cyrillic Small Letter U with Diaeresis",
			"character": "ӱ"
		},
		{
			"description": "Cyrillic Capital Letter U with Double Acute",
			"character": "Ӳ"
		},
		{
			"description": "Cyrillic Small Letter U with Double Acute",
			"character": "ӳ"
		},
		{
			"description": "Cyrillic Capital Letter Straight U",
			"character": "Ү"
		},
		{
			"description": "Cyrillic Small Letter Straight U",
			"character": "ү"
		},
		{
			"description": "Cyrillic Capital Letter Straight U with Stroke",
			"character": "Ұ"
		},
		{
			"description": "Cyrillic Small Letter Straight U with Stroke",
			"character": "ұ"
		},
		{
			"description": "Cyrillic Capital Letter Ef",
			"character": "Ф"
		},
		{
			"description": "Cyrillic Small Letter Ef",
			"character": "ф"
		},
		{
			"description": "Cyrillic Capital Letter Ha",
			"character": "Х"
		},
		{
			"description": "Cyrillic Small Letter Ha",
			"character": "х"
		},
		{
			"description": "Cyrillic Capital Letter Abkhasian Ha",
			"character": "Ҩ"
		},
		{
			"description": "Cyrillic Small Letter Abkhasian Ha",
			"character": "ҩ"
		},
		{
			"description": "Cyrillic Capital Letter Ha with Descender",
			"character": "Ҳ"
		},
		{
			"description": "Cyrillic Small Letter Ha with Descender",
			"character": "ҳ"
		},
		{
			"description": "Cyrillic Capital Letter Ha with Hook",
			"character": "Ӽ"
		},
		{
			"description": "Cyrillic Small Letter Ha with Hook",
			"character": "ӽ"
		},
		{
			"description": "Cyrillic Capital Letter Ha with Stroke",
			"character": "Ӿ"
		},
		{
			"description": "Cyrillic Small Letter Ha with Stroke",
			"character": "ӿ"
		},
		{
			"description": "Cyrillic Capital Letter Tse",
			"character": "Ц"
		},
		{
			"description": "Cyrillic Small Letter Tse",
			"character": "ц"
		},
		{
			"description": "Cyrillic Capital Letter Reversed Tse",
			"character": "Ꙡ"
		},
		{
			"description": "Cyrillic Small Letter Reversed Tse",
			"character": "ꙡ"
		},
		{
			"description": "Cyrillic Capital Letter Che",
			"character": "Ч"
		},
		{
			"description": "Cyrillic Small Letter Che",
			"character": "ч"
		},
		{
			"description": "Cyrillic Capital Letter Che with Descender",
			"character": "Ҷ"
		},
		{
			"description": "Cyrillic Small Letter Che with Descender",
			"character": "ҷ"
		},
		{
			"description": "Cyrillic Capital Letter Che with Vertical Stroke",
			"character": "Ҹ"
		},
		{
			"description": "Cyrillic Small Letter Che with Vertical Stroke",
			"character": "ҹ"
		},
		{
			"description": "Cyrillic Capital Letter Che with Diaeresis",
			"character": "Ӵ"
		},
		{
			"description": "Cyrillic Small Letter Che with Diaeresis",
			"character": "ӵ"
		},
		{
			"description": "Cyrillic Capital Letter Abkhasian Che",
			"character": "Ҽ"
		},
		{
			"description": "Cyrillic Small Letter Abkhasian Che",
			"character": "ҽ"
		},
		{
			"description": "Cyrillic Capital Letter Abkhasian Che with Descender",
			"character": "Ҿ"
		},
		{
			"description": "Cyrillic Small Letter Abkhasian Che with Descender",
			"character": "ҿ"
		},
		{
			"description": "Cyrillic Capital Letter Khakassian Che",
			"character": "Ӌ"
		},
		{
			"description": "Cyrillic Small Letter Khakassian Che",
			"character": "ӌ"
		},
		{
			"description": "Cyrillic Capital Letter Sha",
			"character": "Ш"
		},
		{
			"description": "Cyrillic Small Letter Sha",
			"character": "ш"
		},
		{
			"description": "Cyrillic Capital Letter Shcha",
			"character": "Щ"
		},
		{
			"description": "Cyrillic Small Letter Shcha",
			"character": "щ"
		},
		{
			"description": "Cyrillic Capital Letter Hard Sign",
			"character": "Ъ"
		},
		{
			"description": "Cyrillic Small Letter Hard Sign",
			"character": "ъ"
		},
		{
			"description": "Cyrillic Capital Letter Yeru",
			"character": "Ы"
		},
		{
			"description": "Cyrillic Small Letter Yeru",
			"character": "ы"
		},
		{
			"description": "Cyrillic Capital Letter Yeru with Diaeresis",
			"character": "Ӹ"
		},
		{
			"description": "Cyrillic Small Letter Yeru with Diaeresis",
			"character": "ӹ"
		},
		{
			"description": "Cyrillic Capital Letter Soft Sign",
			"character": "Ь"
		},
		{
			"description": "Cyrillic Small Letter Soft Sign",
			"character": "ь"
		},
		{
			"description": "Cyrillic Capital Letter E",
			"character": "Э"
		},
		{
			"description": "Cyrillic Small Letter E",
			"character": "э"
		},
		{
			"description": "Cyrillic Capital Letter E with Diaeresis",
			"character": "Ӭ"
		},
		{
			"description": "Cyrillic Small Letter E with Diaeresis",
			"character": "ӭ"
		},
		{
			"description": "Cyrillic Capital Letter Yu",
			"character": "Ю"
		},
		{
			"description": "Cyrillic Small Letter Yu",
			"character": "ю"
		},
		{
			"description": "Cyrillic Capital Letter Reversed Yu",
			"character": "Ꙕ"
		},
		{
			"description": "Cyrillic Small Letter Reversed Yu",
			"character": "ꙕ"
		},
		{
			"description": "Cyrillic Capital Letter Ya",
			"character": "Я"
		},
		{
			"description": "Cyrillic Small Letter Ya",
			"character": "я"
		},
		{
			"description": "Cyrillic Capital Letter Omega",
			"character": "Ѡ"
		},
		{
			"description": "Cyrillic Small Letter Omega",
			"character": "ѡ"
		},
		{
			"description": "Cyrillic Capital Letter Round Omega",
			"character": "Ѻ"
		},
		{
			"description": "Cyrillic Small Letter Round Omega",
			"character": "ѻ"
		},
		{
			"description": "Cyrillic Capital Letter Omega with Titlo",
			"character": "Ѽ"
		},
		{
			"description": "Cyrillic Small Letter Omega with Titlo",
			"character": "ѽ"
		},
		{
			"description": "Cyrillic Capital Letter Broad Omega",
			"character": "Ꙍ"
		},
		{
			"description": "Cyrillic Small Letter Broad Omega",
			"character": "ꙍ"
		},
		{
			"description": "Cyrillic Capital Letter Yat",
			"character": "Ѣ"
		},
		{
			"description": "Cyrillic Small Letter Yat",
			"character": "ѣ"
		},
		{
			"description": "Cyrillic Capital Letter Iotified Yat",
			"character": "Ꙓ"
		},
		{
			"description": "Cyrillic Small Letter Iotified Yat",
			"character": "ꙓ"
		},
		{
			"description": "Cyrillic Capital Letter Iotified E",
			"character": "Ѥ"
		},
		{
			"description": "Cyrillic Small Letter Iotified E",
			"character": "ѥ"
		},
		{
			"description": "Cyrillic Capital Letter Little Yus",
			"character": "Ѧ"
		},
		{
			"description": "Cyrillic Small Letter Little Yus",
			"character": "ѧ"
		},
		{
			"description": "Cyrillic Capital Letter Closed Little Yus",
			"character": "Ꙙ"
		},
		{
			"description": "Cyrillic Small Letter Closed Little Yus",
			"character": "ꙙ"
		},
		{
			"description": "Cyrillic Capital Letter Blended Yus",
			"character": "Ꙛ"
		},
		{
			"description": "Cyrillic Small Letter Blended Yus",
			"character": "ꙛ"
		},
		{
			"description": "Cyrillic Capital Letter Iotified Little Yus",
			"character": "Ѩ"
		},
		{
			"description": "Cyrillic Small Letter Iotified Little Yus",
			"character": "ѩ"
		},
		{
			"description": "Cyrillic Capital Letter Iotified Closed Little Yus",
			"character": "Ꙝ"
		},
		{
			"description": "Cyrillic Small Letter Iotified Closed Little Yus",
			"character": "ꙝ"
		},
		{
			"description": "Cyrillic Capital Letter Big Yus",
			"character": "Ѫ"
		},
		{
			"description": "Cyrillic Small Letter Big Yus",
			"character": "ѫ"
		},
		{
			"description": "Cyrillic Capital Letter Iotified Big Yus",
			"character": "Ѭ"
		},
		{
			"description": "Cyrillic Small Letter Iotified Big Yus",
			"character": "ѭ"
		},
		{
			"description": "Cyrillic Capital Letter Ksi",
			"character": "Ѯ"
		},
		{
			"description": "Cyrillic Small Letter Ksi",
			"character": "ѯ"
		},
		{
			"description": "Cyrillic Capital Letter Psi",
			"character": "Ѱ"
		},
		{
			"description": "Cyrillic Small Letter Psi",
			"character": "ѱ"
		},
		{
			"description": "Cyrillic Capital Letter Fita",
			"character": "Ѳ"
		},
		{
			"description": "Cyrillic Small Letter Fita",
			"character": "ѳ"
		},
		{
			"description": "Cyrillic Capital Letter Izhitsa",
			"character": "Ѵ"
		},
		{
			"description": "Cyrillic Small Letter Izhitsa",
			"character": "ѵ"
		},
		{
			"description": "Cyrillic Capital Letter Izhitsa with Double Grave Accent",
			"character": "Ѷ"
		},
		{
			"description": "Cyrillic Small Letter Izhitsa with Double Grave Accent",
			"character": "ѷ"
		},
		{
			"description": "Cyrillic Capital Letter Uk",
			"character": "Ѹ"
		},
		{
			"description": "Cyrillic Small Letter Uk",
			"character": "ѹ"
		},
		{
			"description": "Cyrillic Capital Letter Monograph Uk",
			"character": "Ꙋ"
		},
		{
			"description": "Cyrillic Small Letter Monograph Uk",
			"character": "ꙋ"
		},
		{
			"description": "Cyrillic Capital Letter Ot",
			"character": "Ѿ"
		},
		{
			"description": "Cyrillic Small Letter Ot",
			"character": "ѿ"
		},
		{
			"description": "Cyrillic Capital Letter Koppa",
			"character": "Ҁ"
		},
		{
			"description": "Cyrillic Small Letter Koppa",
			"character": "ҁ"
		},
		{
			"description": "Cyrillic Thousands Sign",
			"character": "҂"
		},
		{
			"description": "Cyrillic Capital Letter Semisoft Sign",
			"character": "Ҍ"
		},
		{
			"description": "Cyrillic Small Letter Semisoft Sign",
			"character": "ҍ"
		},
		{
			"description": "Cyrillic Capital Letter Shha",
			"character": "Һ"
		},
		{
			"description": "Cyrillic Small Letter Shha",
			"character": "һ"
		},
		{
			"description": "Cyrillic Capital Letter Shha with Descender",
			"character": "Ԧ"
		},
		{
			"description": "Cyrillic Small Letter Shha with Descender",
			"character": "ԧ"
		},
		{
			"description": "Cyrillic Letter Palochka",
			"character": "Ӏ"
		},
		{
			"description": "Cyrillic Small Letter Palochka",
			"character": "ӏ"
		},
		{
			"description": "Cyrillic Capital Letter Komi Dzje",
			"character": "Ԇ"
		},
		{
			"description": "Cyrillic Small Letter Komi Dzje",
			"character": "ԇ"
		},
		{
			"description": "Cyrillic Capital Letter Komi Sje",
			"character": "Ԍ"
		},
		{
			"description": "Cyrillic Small Letter Komi Sje",
			"character": "ԍ"
		},
		{
			"description": "Cyrillic Capital Letter Komi Tje",
			"character": "Ԏ"
		},
		{
			"description": "Cyrillic Small Letter Komi Tje",
			"character": "ԏ"
		},
		{
			"description": "Cyrillic Capital Letter Lha",
			"character": "Ԕ"
		},
		{
			"description": "Cyrillic Small Letter Lha",
			"character": "ԕ"
		},
		{
			"description": "Cyrillic Capital Letter Rha",
			"character": "Ԗ"
		},
		{
			"description": "Cyrillic Small Letter Rha",
			"character": "ԗ"
		},
		{
			"description": "Cyrillic Capital Letter Yae",
			"character": "Ԙ"
		},
		{
			"description": "Cyrillic Small Letter Yae",
			"character": "ԙ"
		},
		{
			"description": "Cyrillic Capital Letter Qa",
			"character": "Ԛ"
		},
		{
			"description": "Cyrillic Small Letter Qa",
			"character": "ԛ"
		},
		{
			"description": "Cyrillic Capital Letter We",
			"character": "Ԝ"
		},
		{
			"description": "Cyrillic Small Letter We",
			"character": "ԝ"
		},
		{
			"description": "Cyrillic Capital Letter Dzzhe",
			"character": "Ԫ"
		},
		{
			"description": "Cyrillic Small Letter Dzzhe",
			"character": "ԫ"
		},
		{
			"description": "Cyrillic Capital Letter Dche",
			"character": "Ԭ"
		},
		{
			"description": "Cyrillic Small Letter Dche",
			"character": "ԭ"
		},
		{
			"description": "Cyrillic Capital Letter Zemlya",
			"character": "Ꙁ"
		},
		{
			"description": "Cyrillic Small Letter Zemlya",
			"character": "ꙁ"
		},
		{
			"description": "Cyrillic Capital Letter Dzelo",
			"character": "Ꙃ"
		},
		{
			"description": "Cyrillic Small Letter Dzelo",
			"character": "ꙃ"
		},
		{
			"description": "Cyrillic Capital Letter Iota",
			"character": "Ꙇ"
		},
		{
			"description": "Cyrillic Small Letter Iota",
			"character": "ꙇ"
		},
		{
			"description": "Cyrillic Capital Letter Djerv",
			"character": "Ꙉ"
		},
		{
			"description": "Cyrillic Small Letter Djerv",
			"character": "ꙉ"
		},
		{
			"description": "Cyrillic Capital Letter Neutral Yer",
			"character": "Ꙏ"
		},
		{
			"description": "Cyrillic Small Letter Neutral Yer",
			"character": "ꙏ"
		},
		{
			"description": "Cyrillic Capital Letter Yeru with Back Yer",
			"character": "Ꙑ"
		},
		{
			"description": "Cyrillic Small Letter Yeru with Back Yer",
			"character": "ꙑ"
		},
		{
			"description": "Cyrillic Capital Letter Yn",
			"character": "Ꙟ"
		},
		{
			"description": "Cyrillic Small Letter Yn",
			"character": "ꙟ"
		},
		{
			"description": "Cyrillic Capital Letter Dwe",
			"character": "Ꚁ"
		},
		{
			"description": "Cyrillic Small Letter Dwe",
			"character": "ꚁ"
		},
		{
			"description": "Cyrillic Capital Letter Dzwe",
			"character": "Ꚃ"
		},
		{
			"description": "Cyrillic Small Letter Dzwe",
			"character": "ꚃ"
		},
		{
			"description": "Cyrillic Capital Letter Zhwe",
			"character": "Ꚅ"
		},
		{
			"description": "Cyrillic Small Letter Zhwe",
			"character": "ꚅ"
		},
		{
			"description": "Cyrillic Capital Letter Cche",
			"character": "Ꚇ"
		},
		{
			"description": "Cyrillic Small Letter Cche",
			"character": "ꚇ"
		},
		{
			"description": "Cyrillic Capital Letter Dzze",
			"character": "Ꚉ"
		},
		{
			"description": "Cyrillic Small Letter Dzze",
			"character": "ꚉ"
		},
		{
			"description": "Cyrillic Capital Letter Twe",
			"character": "Ꚍ"
		},
		{
			"description": "Cyrillic Small Letter Twe",
			"character": "ꚍ"
		},
		{
			"description": "Cyrillic Capital Letter Tswe",
			"character": "Ꚏ"
		},
		{
			"description": "Cyrillic Small Letter Tswe",
			"character": "ꚏ"
		},
		{
			"description": "Cyrillic Capital Letter Tsse",
			"character": "Ꚑ"
		},
		{
			"description": "Cyrillic Small Letter Tsse",
			"character": "ꚑ"
		},
		{
			"description": "Cyrillic Capital Letter Tche",
			"character": "Ꚓ"
		},
		{
			"description": "Cyrillic Small Letter Tche",
			"character": "ꚓ"
		},
		{
			"description": "Cyrillic Capital Letter Hwe",
			"character": "Ꚕ"
		},
		{
			"description": "Cyrillic Small Letter Hwe",
			"character": "ꚕ"
		},
		{
			"description": "Cyrillic Capital Letter Shwe",
			"character": "Ꚗ"
		},
		{
			"description": "Cyrillic Small Letter Shwe",
			"character": "ꚗ"
		},
		{
			"description": "Cyrillic Capital Letter Double O",
			"character": "Ꚙ"
		},
		{
			"description": "Cyrillic Small Letter Double O",
			"character": "ꚙ"
		},
		{
			"description": "Cyrillic Capital Letter Crossed O",
			"character": "Ꚛ"
		},
		{
			"description": "Cyrillic Small Letter Crossed O",
			"character": "ꚛ"
		},
		{
			"description": "Cyrillic Capital Letter Monocular O",
			"character": "Ꙩ"
		},
		{
			"description": "Cyrillic Small Letter Monocular O",
			"character": "ꙩ"
		},
		{
			"description": "Cyrillic Capital Letter Binocular O",
			"character": "Ꙫ"
		},
		{
			"description": "Cyrillic Small Letter Binocular O",
			"character": "ꙫ"
		},
		{
			"description": "Cyrillic Capital Letter Double Monocular O",
			"character": "Ꙭ"
		},
		{
			"description": "Cyrillic Small Letter Double Monocular O",
			"character": "ꙭ"
		},
		{
			"description": "Cyrillic Letter Multiocular O",
			"character": "ꙮ"
		}
	],
};
const Armenian = {
	title: "Armenian",
	content: [
		{
			"description": "Armenian Capital Letter Ayb",
			"character": "Ա"
		},
		{
			"description": "Armenian Small Letter Ayb",
			"character": "ա"
		},
		{
			"description": "Armenian Capital Letter Ben",
			"character": "Բ"
		},
		{
			"description": "Armenian Small Letter Ben",
			"character": "բ"
		},
		{
			"description": "Armenian Capital Letter Gim",
			"character": "Գ"
		},
		{
			"description": "Armenian Small Letter Gim",
			"character": "գ"
		},
		{
			"description": "Armenian Capital Letter Da",
			"character": "Դ"
		},
		{
			"description": "Armenian Small Letter Da",
			"character": "դ"
		},
		{
			"description": "Armenian Capital Letter Ech",
			"character": "Ե"
		},
		{
			"description": "Armenian Small Letter Ech",
			"character": "ե"
		},
		{
			"description": "Armenian Small Ligature Ech Yiwn",
			"character": "և"
		},
		{
			"description": "Armenian Capital Letter Za",
			"character": "Զ"
		},
		{
			"description": "Armenian Small Letter Za",
			"character": "զ"
		},
		{
			"description": "Armenian Capital Letter Eh",
			"character": "Է"
		},
		{
			"description": "Armenian Small Letter Eh",
			"character": "է"
		},
		{
			"description": "Armenian Capital Letter Et",
			"character": "Ը"
		},
		{
			"description": "Armenian Small Letter Et",
			"character": "ը"
		},
		{
			"description": "Armenian Capital Letter To",
			"character": "Թ"
		},
		{
			"description": "Armenian Small Letter To",
			"character": "թ"
		},
		{
			"description": "Armenian Capital Letter Zhe",
			"character": "Ժ"
		},
		{
			"description": "Armenian Small Letter Zhe",
			"character": "ժ"
		},
		{
			"description": "Armenian Capital Letter Ini",
			"character": "Ի"
		},
		{
			"description": "Armenian Small Letter Ini",
			"character": "ի"
		},
		{
			"description": "Armenian Capital Letter Liwn",
			"character": "Լ"
		},
		{
			"description": "Armenian Small Letter Liwn",
			"character": "լ"
		},
		{
			"description": "Armenian Capital Letter Xeh",
			"character": "Խ"
		},
		{
			"description": "Armenian Small Letter Xeh",
			"character": "խ"
		},
		{
			"description": "Armenian Capital Letter Ca",
			"character": "Ծ"
		},
		{
			"description": "Armenian Small Letter Ca",
			"character": "ծ"
		},
		{
			"description": "Armenian Capital Letter Ken",
			"character": "Կ"
		},
		{
			"description": "Armenian Small Letter Ken",
			"character": "կ"
		},
		{
			"description": "Armenian Capital Letter Ho",
			"character": "Հ"
		},
		{
			"description": "Armenian Small Letter Ho",
			"character": "հ"
		},
		{
			"description": "Armenian Capital Letter Ja",
			"character": "Ձ"
		},
		{
			"description": "Armenian Small Letter Ja",
			"character": "ձ"
		},
		{
			"description": "Armenian Capital Letter Ghad",
			"character": "Ղ"
		},
		{
			"description": "Armenian Small Letter Ghad",
			"character": "ղ"
		},
		{
			"description": "Armenian Capital Letter Cheh",
			"character": "Ճ"
		},
		{
			"description": "Armenian Small Letter Cheh",
			"character": "ճ"
		},
		{
			"description": "Armenian Capital Letter Men",
			"character": "Մ"
		},
		{
			"description": "Armenian Small Letter Men",
			"character": "մ"
		},
		{
			"description": "Armenian Capital Letter Yi",
			"character": "Յ"
		},
		{
			"description": "Armenian Small Letter Yi",
			"character": "յ"
		},
		{
			"description": "Armenian Capital Letter Now",
			"character": "Ն"
		},
		{
			"description": "Armenian Small Letter Now",
			"character": "ն"
		},
		{
			"description": "Armenian Capital Letter Sha",
			"character": "Շ"
		},
		{
			"description": "Armenian Small Letter Sha",
			"character": "շ"
		},
		{
			"description": "Armenian Capital Letter Vo",
			"character": "Ո"
		},
		{
			"description": "Armenian Small Letter Vo",
			"character": "ո"
		},
		{
			"description": "Armenian Capital Letter Cha",
			"character": "Չ"
		},
		{
			"description": "Armenian Small Letter Cha",
			"character": "չ"
		},
		{
			"description": "Armenian Capital Letter Peh",
			"character": "Պ"
		},
		{
			"description": "Armenian Small Letter Peh",
			"character": "պ"
		},
		{
			"description": "Armenian Capital Letter Jheh",
			"character": "Ջ"
		},
		{
			"description": "Armenian Small Letter Jheh",
			"character": "ջ"
		},
		{
			"description": "Armenian Capital Letter Ra",
			"character": "Ռ"
		},
		{
			"description": "Armenian Small Letter Ra",
			"character": "ռ"
		},
		{
			"description": "Armenian Capital Letter Seh",
			"character": "Ս"
		},
		{
			"description": "Armenian Small Letter Seh",
			"character": "ս"
		},
		{
			"description": "Armenian Capital Letter Vew",
			"character": "Վ"
		},
		{
			"description": "Armenian Small Letter Vew",
			"character": "վ"
		},
		{
			"description": "Armenian Capital Letter Tiwn",
			"character": "Տ"
		},
		{
			"description": "Armenian Small Letter Tiwn",
			"character": "տ"
		},
		{
			"description": "Armenian Capital Letter Reh",
			"character": "Ր"
		},
		{
			"description": "Armenian Small Letter Reh",
			"character": "ր"
		},
		{
			"description": "Armenian Capital Letter Co",
			"character": "Ց"
		},
		{
			"description": "Armenian Small Letter Co",
			"character": "ց"
		},
		{
			"description": "Armenian Capital Letter Yiwn",
			"character": "Ւ"
		},
		{
			"description": "Armenian Small Letter Yiwn",
			"character": "ւ"
		},
		{
			"description": "Armenian Capital Letter Piwr",
			"character": "Փ"
		},
		{
			"description": "Armenian Small Letter Piwr",
			"character": "փ"
		},
		{
			"description": "Armenian Capital Letter Keh",
			"character": "Ք"
		},
		{
			"description": "Armenian Small Letter Keh",
			"character": "ք"
		},
		{
			"description": "Armenian Capital Letter Oh",
			"character": "Օ"
		},
		{
			"description": "Armenian Small Letter Oh",
			"character": "օ"
		},
		{
			"description": "Armenian Capital Letter Feh",
			"character": "Ֆ"
		},
		{
			"description": "Armenian Small Letter Feh",
			"character": "ֆ"
		}
	],
};
const Hebrew = {
	title: "Hebrew",
	content: [
		{
			"description": "Hebrew Accent Etnahta",
			"character": "֑"
		},
		{
			"description": "Hebrew Accent Segol",
			"character": "֒"
		},
		{
			"description": "Hebrew Accent Shalshelet",
			"character": "֓"
		},
		{
			"description": "Hebrew Accent Zaqef Qatan",
			"character": "֔"
		},
		{
			"description": "Hebrew Accent Zaqef Gadol",
			"character": "֕"
		},
		{
			"description": "Hebrew Accent Tipeha",
			"character": "֖"
		},
		{
			"description": "Hebrew Accent Revia",
			"character": "֗"
		},
		{
			"description": "Hebrew Accent Zarqa",
			"character": "֘"
		},
		{
			"description": "Hebrew Accent Pashta",
			"character": "֙"
		},
		{
			"description": "Hebrew Accent Yetiv",
			"character": "֚"
		},
		{
			"description": "Hebrew Accent Tevir",
			"character": "֛"
		},
		{
			"description": "Hebrew Accent Geresh",
			"character": "֜"
		},
		{
			"description": "Hebrew Accent Geresh Muqdam",
			"character": "֝"
		},
		{
			"description": "Hebrew Accent Gershayim",
			"character": "֞"
		},
		{
			"description": "Hebrew Accent Qarney Para",
			"character": "֟"
		},
		{
			"description": "Hebrew Accent Telisha Gedola",
			"character": "֠"
		},
		{
			"description": "Hebrew Accent Pazer",
			"character": "֡"
		},
		{
			"description": "Hebrew Accent Munah",
			"character": "֣"
		},
		{
			"description": "Hebrew Accent Mahapakh",
			"character": "֤"
		},
		{
			"description": "Hebrew Accent Merkha",
			"character": "֥"
		},
		{
			"description": "Hebrew Accent Merkha Kefula",
			"character": "֦"
		},
		{
			"description": "Hebrew Accent Darga",
			"character": "֧"
		},
		{
			"description": "Hebrew Accent Qadma",
			"character": "֨"
		},
		{
			"description": "Hebrew Accent Telisha Qetana",
			"character": "֩"
		},
		{
			"description": "Hebrew Accent Yerah Ben Yomo",
			"character": "֪"
		},
		{
			"description": "Hebrew Accent Ole",
			"character": "֫"
		},
		{
			"description": "Hebrew Accent Iluy",
			"character": "֬"
		},
		{
			"description": "Hebrew Accent Dehi",
			"character": "֭"
		},
		{
			"description": "Hebrew Accent Zinor",
			"character": "֮"
		},
		{
			"description": "Hebrew Mark Masora Circle",
			"character": "֯"
		},
		{
			"description": "Hebrew Point Sheva",
			"character": "ְ"
		},
		{
			"description": "Hebrew Point Hataf Segol",
			"character": "ֱ"
		},
		{
			"description": "Hebrew Point Hataf Patah",
			"character": "ֲ"
		},
		{
			"description": "Hebrew Point Hataf Qamats",
			"character": "ֳ"
		},
		{
			"description": "Hebrew Point Hiriq",
			"character": "ִ"
		},
		{
			"description": "Hebrew Point Tsere",
			"character": "ֵ"
		},
		{
			"description": "Hebrew Point Segol",
			"character": "ֶ"
		},
		{
			"description": "Hebrew Point Patah",
			"character": "ַ"
		},
		{
			"description": "Hebrew Point Qamats",
			"character": "ָ"
		},
		{
			"description": "Hebrew Point Holam",
			"character": "ֹ"
		},
		{
			"description": "Hebrew Point Qubuts",
			"character": "ֻ"
		},
		{
			"description": "Hebrew Point Dagesh or Mapiq",
			"character": "ּ"
		},
		{
			"description": "Hebrew Point Meteg",
			"character": "ֽ"
		},
		{
			"description": "Hebrew Punctuation Maqaf",
			"character": "־"
		},
		{
			"description": "Hebrew Point Rafe",
			"character": "ֿ"
		},
		{
			"description": "Hebrew Punctuation Paseq",
			"character": "׀"
		},
		{
			"description": "Hebrew Point Shin Dot",
			"character": "ׁ"
		},
		{
			"description": "Hebrew Point Sin Dot",
			"character": "ׂ"
		},
		{
			"description": "Hebrew Punctuation Sof Pasuq",
			"character": "׃"
		},
		{
			"description": "Hebrew Mark Upper Dot",
			"character": "ׄ"
		},
		{
			"description": "Hebrew Letter Alef",
			"character": "א"
		},
		{
			"description": "Hebrew Letter Bet",
			"character": "ב"
		},
		{
			"description": "Hebrew Letter Gimel",
			"character": "ג"
		},
		{
			"description": "Hebrew Letter Dalet",
			"character": "ד"
		},
		{
			"description": "Hebrew Letter He",
			"character": "ה"
		},
		{
			"description": "Hebrew Letter Vav",
			"character": "ו"
		},
		{
			"description": "Hebrew Letter Zayin",
			"character": "ז"
		},
		{
			"description": "Hebrew Letter Het",
			"character": "ח"
		},
		{
			"description": "Hebrew Letter Tet",
			"character": "ט"
		},
		{
			"description": "Hebrew Letter Yod",
			"character": "י"
		},
		{
			"description": "Hebrew Letter Final Kaf",
			"character": "ך"
		},
		{
			"description": "Hebrew Letter Kaf",
			"character": "כ"
		},
		{
			"description": "Hebrew Letter Lamed",
			"character": "ל"
		},
		{
			"description": "Hebrew Letter Final Mem",
			"character": "ם"
		},
		{
			"description": "Hebrew Letter Mem",
			"character": "מ"
		},
		{
			"description": "Hebrew Letter Final Nun",
			"character": "ן"
		},
		{
			"description": "Hebrew Letter Nun",
			"character": "נ"
		},
		{
			"description": "Hebrew Letter Samekh",
			"character": "ס"
		},
		{
			"description": "Hebrew Letter Ayin",
			"character": "ע"
		},
		{
			"description": "Hebrew Letter Final Pe",
			"character": "ף"
		},
		{
			"description": "Hebrew Letter Pe",
			"character": "פ"
		},
		{
			"description": "Hebrew Letter Final Tsadi",
			"character": "ץ"
		},
		{
			"description": "Hebrew Letter Tsadi",
			"character": "צ"
		},
		{
			"description": "Hebrew Letter Qof",
			"character": "ק"
		},
		{
			"description": "Hebrew Letter Resh",
			"character": "ר"
		},
		{
			"description": "Hebrew Letter Shin",
			"character": "ש"
		},
		{
			"description": "Hebrew Letter Tav",
			"character": "ת"
		},
		{
			"description": "Hebrew Ligature Yiddish Double Vav",
			"character": "װ"
		},
		{
			"description": "Hebrew Ligature Yiddish Vav Yod",
			"character": "ױ"
		},
		{
			"description": "Hebrew Ligature Yiddish Double Yod",
			"character": "ײ"
		},
		{
			"description": "Hebrew Punctuation Geresh",
			"character": "׳"
		},
		{
			"description": "Hebrew Punctuation Gershayim",
			"character": "״"
		}
	]
};
const Arabic = {
	title: "Arabic",
	content: [
		{
			"description": "Arabic Comma",
			"character": "،"
		},
		{
			"description": "Arabic Semicolon",
			"character": "؛"
		},
		{
			"description": "Arabic Question Mark",
			"character": "؟"
		},
		{
			"description": "Arabic Letter Hamza",
			"character": "ء"
		},
		{
			"description": "Arabic Letter Alef with Madda Above",
			"character": "آ"
		},
		{
			"description": "Arabic Letter Alef with Hamza Above",
			"character": "أ"
		},
		{
			"description": "Arabic Letter Waw with Hamza Above",
			"character": "ؤ"
		},
		{
			"description": "Arabic Letter Alef with Hamza Below",
			"character": "إ"
		},
		{
			"description": "Arabic Letter Yeh with Hamza Above",
			"character": "ئ"
		},
		{
			"description": "Arabic Letter Alef",
			"character": "ا"
		},
		{
			"description": "Arabic Letter Beh",
			"character": "ب"
		},
		{
			"description": "Arabic Letter Teh Marbuta",
			"character": "ة"
		},
		{
			"description": "Arabic Letter Teh",
			"character": "ت"
		},
		{
			"description": "Arabic Letter Theh",
			"character": "ث"
		},
		{
			"description": "Arabic Letter Jeem",
			"character": "ج"
		},
		{
			"description": "Arabic Letter Hah",
			"character": "ح"
		},
		{
			"description": "Arabic Letter Khah",
			"character": "خ"
		},
		{
			"description": "Arabic Letter Dal",
			"character": "د"
		},
		{
			"description": "Arabic Letter Thal",
			"character": "ذ"
		},
		{
			"description": "Arabic Letter Reh",
			"character": "ر"
		},
		{
			"description": "Arabic Letter Zain",
			"character": "ز"
		},
		{
			"description": "Arabic Letter Seen",
			"character": "س"
		},
		{
			"description": "Arabic Letter Sheen",
			"character": "ش"
		},
		{
			"description": "Arabic Letter Sad",
			"character": "ص"
		},
		{
			"description": "Arabic Letter Dad",
			"character": "ض"
		},
		{
			"description": "Arabic Letter Tah",
			"character": "ط"
		},
		{
			"description": "Arabic Letter Zah",
			"character": "ظ"
		},
		{
			"description": "Arabic Letter Ain",
			"character": "ع"
		},
		{
			"description": "Arabic Letter Ghain",
			"character": "غ"
		},
		{
			"description": "Arabic Tatweel",
			"character": "ـ"
		},
		{
			"description": "Arabic Letter Feh",
			"character": "ف"
		},
		{
			"description": "Arabic Letter Qaf",
			"character": "ق"
		},
		{
			"description": "Arabic Letter Kaf",
			"character": "ك"
		},
		{
			"description": "Arabic Letter Lam",
			"character": "ل"
		},
		{
			"description": "Arabic Letter Meem",
			"character": "م"
		},
		{
			"description": "Arabic Letter Noon",
			"character": "ن"
		},
		{
			"description": "Arabic Letter Heh",
			"character": "ه"
		},
		{
			"description": "Arabic Letter Waw",
			"character": "و"
		},
		{
			"description": "Arabic Letter Alef Maksura",
			"character": "ى"
		},
		{
			"description": "Arabic Letter Yeh",
			"character": "ي"
		},
		{
			"description": "Arabic Fathatan",
			"character": "ً"
		},
		{
			"description": "Arabic Dammatan",
			"character": "ٌ"
		},
		{
			"description": "Arabic Kasratan",
			"character": "ٍ"
		},
		{
			"description": "Arabic Fatha",
			"character": "َ"
		},
		{
			"description": "Arabic Damma",
			"character": "ُ"
		},
		{
			"description": "Arabic Kasra",
			"character": "ِ"
		},
		{
			"description": "Arabic Shadda",
			"character": "ّ"
		},
		{
			"description": "Arabic Sukun",
			"character": "ْ"
		},
		{
			"description": "Arabic Maddah Above",
			"character": "ٓ"
		},
		{
			"description": "Arabic Hamza Above",
			"character": "ٔ"
		},
		{
			"description": "Arabic Hamza Below",
			"character": "ٕ"
		},
		{
			"description": "Arabic-Indic Digit Zero",
			"character": "٠"
		},
		{
			"description": "Arabic-Indic Digit One",
			"character": "١"
		},
		{
			"description": "Arabic-Indic Digit Two",
			"character": "٢"
		},
		{
			"description": "Arabic-Indic Digit Three",
			"character": "٣"
		},
		{
			"description": "Arabic-Indic Digit Four",
			"character": "٤"
		},
		{
			"description": "Arabic-Indic Digit Five",
			"character": "٥"
		},
		{
			"description": "Arabic-Indic Digit Six",
			"character": "٦"
		},
		{
			"description": "Arabic-Indic Digit Seven",
			"character": "٧"
		},
		{
			"description": "Arabic-Indic Digit Eight",
			"character": "٨"
		},
		{
			"description": "Arabic-Indic Digit Nine",
			"character": "٩"
		},
		{
			"description": "Arabic Percent Sign",
			"character": "٪"
		},
		{
			"description": "Arabic Decimal Separator",
			"character": "٫"
		},
		{
			"description": "Arabic Thousands Separator",
			"character": "٬"
		},
		{
			"description": "Arabic Five Pointed Star",
			"character": "٭"
		},
		{
			"description": "Arabic Letter Superscript Alef",
			"character": "ٰ"
		},
		{
			"description": "Arabic Letter Alef Wasla",
			"character": "ٱ"
		},
		{
			"description": "Arabic Letter Alef with Wavy Hamza Above",
			"character": "ٲ"
		},
		{
			"description": "Arabic Letter Alef with Wavy Hamza Below",
			"character": "ٳ"
		},
		{
			"description": "Arabic Letter High Hamza",
			"character": "ٴ"
		},
		{
			"description": "Arabic Letter High Hamza Alef",
			"character": "ٵ"
		},
		{
			"description": "Arabic Letter High Hamza Waw",
			"character": "ٶ"
		},
		{
			"description": "Arabic Letter U with Hamza Above",
			"character": "ٷ"
		},
		{
			"description": "Arabic Letter High Hamza Yeh",
			"character": "ٸ"
		},
		{
			"description": "Arabic Letter Tteh",
			"character": "ٹ"
		},
		{
			"description": "Arabic Letter Tteheh",
			"character": "ٺ"
		},
		{
			"description": "Arabic Letter Beeh",
			"character": "ٻ"
		},
		{
			"description": "Arabic Letter Teh with Ring",
			"character": "ټ"
		},
		{
			"description": "Arabic Letter Teh with Three Dots Above Downwards",
			"character": "ٽ"
		},
		{
			"description": "Arabic Letter Peh",
			"character": "پ"
		},
		{
			"description": "Arabic Letter Teheh",
			"character": "ٿ"
		},
		{
			"description": "Arabic Letter Beheh",
			"character": "ڀ"
		},
		{
			"description": "Arabic Letter Hah with Hamza Above",
			"character": "ځ"
		},
		{
			"description": "Arabic Letter Hah with Two Dots Vertical Above",
			"character": "ڂ"
		},
		{
			"description": "Arabic Letter Nyeh",
			"character": "ڃ"
		},
		{
			"description": "Arabic Letter Dyeh",
			"character": "ڄ"
		},
		{
			"description": "Arabic Letter Hah with Three Dots Above",
			"character": "څ"
		},
		{
			"description": "Arabic Letter Tcheh",
			"character": "چ"
		},
		{
			"description": "Arabic Letter Tcheheh",
			"character": "ڇ"
		},
		{
			"description": "Arabic Letter Ddal",
			"character": "ڈ"
		},
		{
			"description": "Arabic Letter Dal with Ring",
			"character": "ډ"
		},
		{
			"description": "Arabic Letter Dal with Dot Below",
			"character": "ڊ"
		},
		{
			"description": "Arabic Letter Dal with Dot Below and Small Tah",
			"character": "ڋ"
		},
		{
			"description": "Arabic Letter Dahal",
			"character": "ڌ"
		},
		{
			"description": "Arabic Letter Ddahal",
			"character": "ڍ"
		},
		{
			"description": "Arabic Letter Dul",
			"character": "ڎ"
		},
		{
			"description": "Arabic Letter Dal with Three Dots Above Downwards",
			"character": "ڏ"
		},
		{
			"description": "Arabic Letter Dal with Four Dots Above",
			"character": "ڐ"
		},
		{
			"description": "Arabic Letter Rreh",
			"character": "ڑ"
		},
		{
			"description": "Arabic Letter Reh with Small V",
			"character": "ڒ"
		},
		{
			"description": "Arabic Letter Reh with Ring",
			"character": "ړ"
		},
		{
			"description": "Arabic Letter Reh with Dot Below",
			"character": "ڔ"
		},
		{
			"description": "Arabic Letter Reh with Small V Below",
			"character": "ڕ"
		},
		{
			"description": "Arabic Letter Reh with Dot Below and Dot Above",
			"character": "ږ"
		},
		{
			"description": "Arabic Letter Reh with Two Dots Above",
			"character": "ڗ"
		},
		{
			"description": "Arabic Letter Jeh",
			"character": "ژ"
		},
		{
			"description": "Arabic Letter Reh with Four Dots Above",
			"character": "ڙ"
		},
		{
			"description": "Arabic Letter Seen with Dot Below and Dot Above",
			"character": "ښ"
		},
		{
			"description": "Arabic Letter Seen with Three Dots Below",
			"character": "ڛ"
		},
		{
			"description": "Arabic Letter Seen with Three Dots Below and Three Dots Above",
			"character": "ڜ"
		},
		{
			"description": "Arabic Letter Sad with Two Dots Below",
			"character": "ڝ"
		},
		{
			"description": "Arabic Letter Sad with Three Dots Above",
			"character": "ڞ"
		},
		{
			"description": "Arabic Letter Tah with Three Dots Above",
			"character": "ڟ"
		},
		{
			"description": "Arabic Letter Ain with Three Dots Above",
			"character": "ڠ"
		},
		{
			"description": "Arabic Letter Dotless Feh",
			"character": "ڡ"
		},
		{
			"description": "Arabic Letter Feh with Dot Moved Below",
			"character": "ڢ"
		},
		{
			"description": "Arabic Letter Feh with Dot Below",
			"character": "ڣ"
		},
		{
			"description": "Arabic Letter Veh",
			"character": "ڤ"
		},
		{
			"description": "Arabic Letter Feh with Three Dots Below",
			"character": "ڥ"
		},
		{
			"description": "Arabic Letter Peheh",
			"character": "ڦ"
		},
		{
			"description": "Arabic Letter Qaf with Dot Above",
			"character": "ڧ"
		},
		{
			"description": "Arabic Letter Qaf with Three Dots Above",
			"character": "ڨ"
		},
		{
			"description": "Arabic Letter Keheh",
			"character": "ک"
		},
		{
			"description": "Arabic Letter Swash Kaf",
			"character": "ڪ"
		},
		{
			"description": "Arabic Letter Kaf with Ring",
			"character": "ګ"
		},
		{
			"description": "Arabic Letter Kaf with Dot Above",
			"character": "ڬ"
		},
		{
			"description": "Arabic Letter Ng",
			"character": "ڭ"
		},
		{
			"description": "Arabic Letter Kaf with Three Dots Below",
			"character": "ڮ"
		},
		{
			"description": "Arabic Letter Gaf",
			"character": "گ"
		},
		{
			"description": "Arabic Letter Gaf with Ring",
			"character": "ڰ"
		},
		{
			"description": "Arabic Letter Ngoeh",
			"character": "ڱ"
		},
		{
			"description": "Arabic Letter Gaf with Two Dots Below",
			"character": "ڲ"
		},
		{
			"description": "Arabic Letter Gueh",
			"character": "ڳ"
		},
		{
			"description": "Arabic Letter Gaf with Three Dots Above",
			"character": "ڴ"
		},
		{
			"description": "Arabic Letter Lam with Small V",
			"character": "ڵ"
		},
		{
			"description": "Arabic Letter Lam with Dot Above",
			"character": "ڶ"
		},
		{
			"description": "Arabic Letter Lam with Three Dots Above",
			"character": "ڷ"
		},
		{
			"description": "Arabic Letter Lam with Three Dots Below",
			"character": "ڸ"
		},
		{
			"description": "Arabic Letter Noon with Dot Below",
			"character": "ڹ"
		},
		{
			"description": "Arabic Letter Noon Ghunna",
			"character": "ں"
		},
		{
			"description": "Arabic Letter Rnoon",
			"character": "ڻ"
		},
		{
			"description": "Arabic Letter Noon with Ring",
			"character": "ڼ"
		},
		{
			"description": "Arabic Letter Noon with Three Dots Above",
			"character": "ڽ"
		},
		{
			"description": "Arabic Letter Heh Doachashmee",
			"character": "ھ"
		},
		{
			"description": "Arabic Letter Tcheh with Dot Above",
			"character": "ڿ"
		},
		{
			"description": "Arabic Letter Heh with Yeh Above",
			"character": "ۀ"
		},
		{
			"description": "Arabic Letter Heh Goal",
			"character": "ہ"
		},
		{
			"description": "Arabic Letter Heh Goal with Hamza Above",
			"character": "ۂ"
		},
		{
			"description": "Arabic Letter Teh Marbuta Goal",
			"character": "ۃ"
		},
		{
			"description": "Arabic Letter Waw with Ring",
			"character": "ۄ"
		},
		{
			"description": "Arabic Letter Kirghiz Oe",
			"character": "ۅ"
		},
		{
			"description": "Arabic Letter Oe",
			"character": "ۆ"
		},
		{
			"description": "Arabic Letter U",
			"character": "ۇ"
		},
		{
			"description": "Arabic Letter Yu",
			"character": "ۈ"
		},
		{
			"description": "Arabic Letter Kirghiz Yu",
			"character": "ۉ"
		},
		{
			"description": "Arabic Letter Waw with Two Dots Above",
			"character": "ۊ"
		},
		{
			"description": "Arabic Letter Ve",
			"character": "ۋ"
		},
		{
			"description": "Arabic Letter Farsi Yeh",
			"character": "ی"
		},
		{
			"description": "Arabic Letter Yeh with Tail",
			"character": "ۍ"
		},
		{
			"description": "Arabic Letter Yeh with Small V",
			"character": "ێ"
		},
		{
			"description": "Arabic Letter Waw with Dot Above",
			"character": "ۏ"
		},
		{
			"description": "Arabic Letter E",
			"character": "ې"
		},
		{
			"description": "Arabic Letter Yeh with Three Dots Below",
			"character": "ۑ"
		},
		{
			"description": "Arabic Letter Yeh Barree",
			"character": "ے"
		},
		{
			"description": "Arabic Letter Yeh Barree with Hamza Above",
			"character": "ۓ"
		},
		{
			"description": "Arabic Full Stop",
			"character": "۔"
		},
		{
			"description": "Arabic Letter Ae",
			"character": "ە"
		},
		{
			"description": "Arabic Small High Ligature Sad with Lam with Alef Maksura",
			"character": "ۖ"
		},
		{
			"description": "Arabic Small High Ligature Qaf with Lam with Alef Maksura",
			"character": "ۗ"
		},
		{
			"description": "Arabic Small High Meem Initial Form",
			"character": "ۘ"
		},
		{
			"description": "Arabic Small High Lam Alef",
			"character": "ۙ"
		},
		{
			"description": "Arabic Small High Jeem",
			"character": "ۚ"
		},
		{
			"description": "Arabic Small High Three Dots",
			"character": "ۛ"
		},
		{
			"description": "Arabic Small High Seen",
			"character": "ۜ"
		},
		{
			"description": "Arabic End Of Ayah",
			"character": "۝"
		},
		{
			"description": "Arabic Start Of Rub El Hizb",
			"character": "۞"
		},
		{
			"description": "Arabic Small High Rounded Zero",
			"character": "۟"
		},
		{
			"description": "Arabic Small High Upright Rectangular Zero",
			"character": "۠"
		},
		{
			"description": "Arabic Small High Dotless Head Of Khah",
			"character": "ۡ"
		},
		{
			"description": "Arabic Small High Meem Isolated Form",
			"character": "ۢ"
		},
		{
			"description": "Arabic Small Low Seen",
			"character": "ۣ"
		},
		{
			"description": "Arabic Small High Madda",
			"character": "ۤ"
		},
		{
			"description": "Arabic Small Waw",
			"character": "ۥ"
		},
		{
			"description": "Arabic Small Yeh",
			"character": "ۦ"
		},
		{
			"description": "Arabic Small High Yeh",
			"character": "ۧ"
		},
		{
			"description": "Arabic Small High Noon",
			"character": "ۨ"
		},
		{
			"description": "Arabic Place Of Sajdah",
			"character": "۩"
		},
		{
			"description": "Arabic Empty Centre Low Stop",
			"character": "۪"
		},
		{
			"description": "Arabic Empty Centre High Stop",
			"character": "۫"
		},
		{
			"description": "Arabic Rounded High Stop with Filled Centre",
			"character": "۬"
		},
		{
			"description": "Arabic Small Low Meem",
			"character": "ۭ"
		},
		{
			"description": "Extended Arabic-Indic Digit Zero",
			"character": "۰"
		},
		{
			"description": "Extended Arabic-Indic Digit One",
			"character": "۱"
		},
		{
			"description": "Extended Arabic-Indic Digit Two",
			"character": "۲"
		},
		{
			"description": "Extended Arabic-Indic Digit Three",
			"character": "۳"
		},
		{
			"description": "Extended Arabic-Indic Digit Four",
			"character": "۴"
		},
		{
			"description": "Extended Arabic-Indic Digit Five",
			"character": "۵"
		},
		{
			"description": "Extended Arabic-Indic Digit Six",
			"character": "۶"
		},
		{
			"description": "Extended Arabic-Indic Digit Seven",
			"character": "۷"
		},
		{
			"description": "Extended Arabic-Indic Digit Eight",
			"character": "۸"
		},
		{
			"description": "Extended Arabic-Indic Digit Nine",
			"character": "۹"
		},
		{
			"description": "Arabic Letter Sheen with Dot Below",
			"character": "ۺ"
		},
		{
			"description": "Arabic Letter Dad with Dot Below",
			"character": "ۻ"
		},
		{
			"description": "Arabic Letter Ghain with Dot Below",
			"character": "ۼ"
		},
		{
			"description": "Arabic Sign Sindhi Ampersand",
			"character": "۽"
		},
		{
			"description": "Arabic Sign Sindhi Postposition Men",
			"character": "۾"
		}
	]
};
const Thai = {
	title: "Thai",
	content: [
		{
			"description": "Thai Character Ko Kai",
			"character": "ก"
		},
		{
			"description": "Thai Character Kho Khai",
			"character": "ข"
		},
		{
			"description": "Thai Character Kho Khuat",
			"character": "ฃ"
		},
		{
			"description": "Thai Character Kho Khwai",
			"character": "ค"
		},
		{
			"description": "Thai Character Kho Khon",
			"character": "ฅ"
		},
		{
			"description": "Thai Character Kho Rakhang",
			"character": "ฆ"
		},
		{
			"description": "Thai Character Ngo Ngu",
			"character": "ง"
		},
		{
			"description": "Thai Character Cho Chan",
			"character": "จ"
		},
		{
			"description": "Thai Character Cho Ching",
			"character": "ฉ"
		},
		{
			"description": "Thai Character Cho Chang",
			"character": "ช"
		},
		{
			"description": "Thai Character So So",
			"character": "ซ"
		},
		{
			"description": "Thai Character Cho Choe",
			"character": "ฌ"
		},
		{
			"description": "Thai Character Yo Ying",
			"character": "ญ"
		},
		{
			"description": "Thai Character Do Chada",
			"character": "ฎ"
		},
		{
			"description": "Thai Character To Patak",
			"character": "ฏ"
		},
		{
			"description": "Thai Character Tho Than",
			"character": "ฐ"
		},
		{
			"description": "Thai Character Tho Nangmontho",
			"character": "ฑ"
		},
		{
			"description": "Thai Character Tho Phuthao",
			"character": "ฒ"
		},
		{
			"description": "Thai Character No Nen",
			"character": "ณ"
		},
		{
			"description": "Thai Character Do Dek",
			"character": "ด"
		},
		{
			"description": "Thai Character To Tao",
			"character": "ต"
		},
		{
			"description": "Thai Character Tho Thung",
			"character": "ถ"
		},
		{
			"description": "Thai Character Tho Thahan",
			"character": "ท"
		},
		{
			"description": "Thai Character Tho Thong",
			"character": "ธ"
		},
		{
			"description": "Thai Character No Nu",
			"character": "น"
		},
		{
			"description": "Thai Character Bo Baimai",
			"character": "บ"
		},
		{
			"description": "Thai Character Po Pla",
			"character": "ป"
		},
		{
			"description": "Thai Character Pho Phung",
			"character": "ผ"
		},
		{
			"description": "Thai Character Fo Fa",
			"character": "ฝ"
		},
		{
			"description": "Thai Character Pho Phan",
			"character": "พ"
		},
		{
			"description": "Thai Character Fo Fan",
			"character": "ฟ"
		},
		{
			"description": "Thai Character Pho Samphao",
			"character": "ภ"
		},
		{
			"description": "Thai Character Mo Ma",
			"character": "ม"
		},
		{
			"description": "Thai Character Yo Yak",
			"character": "ย"
		},
		{
			"description": "Thai Character Ro Rua",
			"character": "ร"
		},
		{
			"description": "Thai Character Ru",
			"character": "ฤ"
		},
		{
			"description": "Thai Character Lo Ling",
			"character": "ล"
		},
		{
			"description": "Thai Character Lu",
			"character": "ฦ"
		},
		{
			"description": "Thai Character Wo Waen",
			"character": "ว"
		},
		{
			"description": "Thai Character So Sala",
			"character": "ศ"
		},
		{
			"description": "Thai Character So Rusi",
			"character": "ษ"
		},
		{
			"description": "Thai Character So Sua",
			"character": "ส"
		},
		{
			"description": "Thai Character Ho Hip",
			"character": "ห"
		},
		{
			"description": "Thai Character Lo Chula",
			"character": "ฬ"
		},
		{
			"description": "Thai Character O Ang",
			"character": "อ"
		},
		{
			"description": "Thai Character Ho Nokhuk",
			"character": "ฮ"
		},
		{
			"description": "Thai Character Paiyannoi",
			"character": "ฯ"
		},
		{
			"description": "Thai Character Sara A",
			"character": "ะ"
		},
		{
			"description": "Thai Character Mai Han-Akat",
			"character": "ั"
		},
		{
			"description": "Thai Character Sara Aa",
			"character": "า"
		},
		{
			"description": "Thai Character Sara Am",
			"character": "ำ"
		},
		{
			"description": "Thai Character Sara I",
			"character": "ิ"
		},
		{
			"description": "Thai Character Sara Ii",
			"character": "ี"
		},
		{
			"description": "Thai Character Sara Ue",
			"character": "ึ"
		},
		{
			"description": "Thai Character Sara Uee",
			"character": "ื"
		},
		{
			"description": "Thai Character Sara U",
			"character": "ุ"
		},
		{
			"description": "Thai Character Sara Uu",
			"character": "ู"
		},
		{
			"description": "Thai Character Phinthu",
			"character": "ฺ"
		},
		{
			"description": "Thai Currency Symbol Baht",
			"character": "฿"
		},
		{
			"description": "Thai Character Sara E",
			"character": "เ"
		},
		{
			"description": "Thai Character Sara Ae",
			"character": "แ"
		},
		{
			"description": "Thai Character Sara O",
			"character": "โ"
		},
		{
			"description": "Thai Character Sara Ai Maimuan",
			"character": "ใ"
		},
		{
			"description": "Thai Character Sara Ai Maimalai",
			"character": "ไ"
		},
		{
			"description": "Thai Character Lakkhangyao",
			"character": "ๅ"
		},
		{
			"description": "Thai Character Maiyamok",
			"character": "ๆ"
		},
		{
			"description": "Thai Character Maitaikhu",
			"character": "็"
		},
		{
			"description": "Thai Character Mai Ek",
			"character": "่"
		},
		{
			"description": "Thai Character Mai Tho",
			"character": "้"
		},
		{
			"description": "Thai Character Mai Tri",
			"character": "๊"
		},
		{
			"description": "Thai Character Mai Chattawa",
			"character": "๋"
		},
		{
			"description": "Thai Character Thanthakhat",
			"character": "์"
		},
		{
			"description": "Thai Character Nikhahit",
			"character": "ํ"
		},
		{
			"description": "Thai Character Yamakkan",
			"character": "๎"
		},
		{
			"description": "Thai Character Fongman",
			"character": "๏"
		},
		{
			"description": "Thai Digit Zero",
			"character": "๐"
		},
		{
			"description": "Thai Digit One",
			"character": "๑"
		},
		{
			"description": "Thai Digit Two",
			"character": "๒"
		},
		{
			"description": "Thai Digit Three",
			"character": "๓"
		},
		{
			"description": "Thai Digit Four",
			"character": "๔"
		},
		{
			"description": "Thai Digit Five",
			"character": "๕"
		},
		{
			"description": "Thai Digit Six",
			"character": "๖"
		},
		{
			"description": "Thai Digit Seven",
			"character": "๗"
		},
		{
			"description": "Thai Digit Eight",
			"character": "๘"
		},
		{
			"description": "Thai Digit Nine",
			"character": "๙"
		},
		{
			"description": "Thai Character Angkhankhu",
			"character": "๚"
		},
		{
			"description": "Thai Character Khomut",
			"character": "๛"
		}
	]
};
const Lao = {
	title: "Lao",
	content: [
		{
			"description": "Lao Letter Ko",
			"character": "ກ"
		},
		{
			"description": "Lao Letter Kho Sung",
			"character": "ຂ"
		},
		{
			"description": "Lao Letter Kho Tam",
			"character": "ຄ"
		},
		{
			"description": "Lao Letter Ngo",
			"character": "ງ"
		},
		{
			"description": "Lao Letter Co",
			"character": "ຈ"
		},
		{
			"description": "Lao Letter So Tam",
			"character": "ຊ"
		},
		{
			"description": "Lao Letter Nyo",
			"character": "ຍ"
		},
		{
			"description": "Lao Letter Do",
			"character": "ດ"
		},
		{
			"description": "Lao Letter To",
			"character": "ຕ"
		},
		{
			"description": "Lao Letter Tho Sung",
			"character": "ຖ"
		},
		{
			"description": "Lao Letter Tho Tam",
			"character": "ທ"
		},
		{
			"description": "Lao Letter No",
			"character": "ນ"
		},
		{
			"description": "Lao Letter Bo",
			"character": "ບ"
		},
		{
			"description": "Lao Letter Po",
			"character": "ປ"
		},
		{
			"description": "Lao Letter Pho Sung",
			"character": "ຜ"
		},
		{
			"description": "Lao Letter Fo Tam",
			"character": "ຝ"
		},
		{
			"description": "Lao Letter Pho Tam",
			"character": "ພ"
		},
		{
			"description": "Lao Letter Fo Sung",
			"character": "ຟ"
		},
		{
			"description": "Lao Letter Mo",
			"character": "ມ"
		},
		{
			"description": "Lao Letter Yo",
			"character": "ຢ"
		},
		{
			"description": "Lao Letter Lo Ling",
			"character": "ຣ"
		},
		{
			"description": "Lao Letter Lo Loot",
			"character": "ລ"
		},
		{
			"description": "Lao Letter Wo",
			"character": "ວ"
		},
		{
			"description": "Lao Letter So Sung",
			"character": "ສ"
		},
		{
			"description": "Lao Letter Ho Sung",
			"character": "ຫ"
		},
		{
			"description": "Lao Letter O",
			"character": "ອ"
		},
		{
			"description": "Lao Letter Ho Tam",
			"character": "ຮ"
		},
		{
			"description": "Lao Ellipsis",
			"character": "ຯ"
		},
		{
			"description": "Lao Vowel Sign A",
			"character": "ະ"
		},
		{
			"description": "Lao Vowel Sign Mai Kan",
			"character": "ັ"
		},
		{
			"description": "Lao Vowel Sign Aa",
			"character": "າ"
		},
		{
			"description": "Lao Vowel Sign Am",
			"character": "ຳ"
		},
		{
			"description": "Lao Vowel Sign I",
			"character": "ິ"
		},
		{
			"description": "Lao Vowel Sign Ii",
			"character": "ີ"
		},
		{
			"description": "Lao Vowel Sign Y",
			"character": "ຶ"
		},
		{
			"description": "Lao Vowel Sign Yy",
			"character": "ື"
		},
		{
			"description": "Lao Vowel Sign U",
			"character": "ຸ"
		},
		{
			"description": "Lao Vowel Sign Uu",
			"character": "ູ"
		},
		{
			"description": "Lao Vowel Sign Mai Kon",
			"character": "ົ"
		},
		{
			"description": "Lao Semivowel Sign Lo",
			"character": "ຼ"
		},
		{
			"description": "Lao Semivowel Sign Nyo",
			"character": "ຽ"
		},
		{
			"description": "Lao Vowel Sign E",
			"character": "ເ"
		},
		{
			"description": "Lao Vowel Sign Ei",
			"character": "ແ"
		},
		{
			"description": "Lao Vowel Sign O",
			"character": "ໂ"
		},
		{
			"description": "Lao Vowel Sign Ay",
			"character": "ໃ"
		},
		{
			"description": "Lao Vowel Sign Ai",
			"character": "ໄ"
		},
		{
			"description": "Lao Ko La",
			"character": "ໆ"
		},
		{
			"description": "Lao Tone Mai Ek",
			"character": "່"
		},
		{
			"description": "Lao Tone Mai Tho",
			"character": "້"
		},
		{
			"description": "Lao Tone Mai Ti",
			"character": "໊"
		},
		{
			"description": "Lao Tone Mai Catawa",
			"character": "໋"
		},
		{
			"description": "Lao Cancellation Mark",
			"character": "໌"
		},
		{
			"description": "Lao Niggahita",
			"character": "ໍ"
		},
		{
			"description": "Lao Digit Zero",
			"character": "໐"
		},
		{
			"description": "Lao Digit One",
			"character": "໑"
		},
		{
			"description": "Lao Digit Two",
			"character": "໒"
		},
		{
			"description": "Lao Digit Three",
			"character": "໓"
		},
		{
			"description": "Lao Digit Four",
			"character": "໔"
		},
		{
			"description": "Lao Digit Five",
			"character": "໕"
		},
		{
			"description": "Lao Digit Six",
			"character": "໖"
		},
		{
			"description": "Lao Digit Seven",
			"character": "໗"
		},
		{
			"description": "Lao Digit Eight",
			"character": "໘"
		},
		{
			"description": "Lao Digit Nine",
			"character": "໙"
		},
		{
			"description": "Lao Ho No",
			"character": "ໜ"
		},
		{
			"description": "Lao Ho Mo",
			"character": "ໝ"
		}
	]
};
const Hiragana = {
	title: "Hiragana",
	content: [
		{
			"description": "Hiragana Letter Small A",
			"character": "ぁ"
		},
		{
			"description": "Hiragana Letter A",
			"character": "あ"
		},
		{
			"description": "Hiragana Letter Small I",
			"character": "ぃ"
		},
		{
			"description": "Hiragana Letter I",
			"character": "い"
		},
		{
			"description": "Hiragana Letter Small U",
			"character": "ぅ"
		},
		{
			"description": "Hiragana Letter U",
			"character": "う"
		},
		{
			"description": "Hiragana Letter Small E",
			"character": "ぇ"
		},
		{
			"description": "Hiragana Letter E",
			"character": "え"
		},
		{
			"description": "Hiragana Letter Small O",
			"character": "ぉ"
		},
		{
			"description": "Hiragana Letter O",
			"character": "お"
		},
		{
			"description": "Hiragana Letter Ka",
			"character": "か"
		},
		{
			"description": "Hiragana Letter Ga",
			"character": "が"
		},
		{
			"description": "Hiragana Letter Ki",
			"character": "き"
		},
		{
			"description": "Hiragana Letter Gi",
			"character": "ぎ"
		},
		{
			"description": "Hiragana Letter Ku",
			"character": "く"
		},
		{
			"description": "Hiragana Letter Gu",
			"character": "ぐ"
		},
		{
			"description": "Hiragana Letter Ke",
			"character": "け"
		},
		{
			"description": "Hiragana Letter Ge",
			"character": "げ"
		},
		{
			"description": "Hiragana Letter Ko",
			"character": "こ"
		},
		{
			"description": "Hiragana Letter Go",
			"character": "ご"
		},
		{
			"description": "Hiragana Letter Sa",
			"character": "さ"
		},
		{
			"description": "Hiragana Letter Za",
			"character": "ざ"
		},
		{
			"description": "Hiragana Letter Si",
			"character": "し"
		},
		{
			"description": "Hiragana Letter Zi",
			"character": "じ"
		},
		{
			"description": "Hiragana Letter Su",
			"character": "す"
		},
		{
			"description": "Hiragana Letter Zu",
			"character": "ず"
		},
		{
			"description": "Hiragana Letter Se",
			"character": "せ"
		},
		{
			"description": "Hiragana Letter Ze",
			"character": "ぜ"
		},
		{
			"description": "Hiragana Letter So",
			"character": "そ"
		},
		{
			"description": "Hiragana Letter Zo",
			"character": "ぞ"
		},
		{
			"description": "Hiragana Letter Ta",
			"character": "た"
		},
		{
			"description": "Hiragana Letter Da",
			"character": "だ"
		},
		{
			"description": "Hiragana Letter Ti",
			"character": "ち"
		},
		{
			"description": "Hiragana Letter Di",
			"character": "ぢ"
		},
		{
			"description": "Hiragana Letter Small Tu",
			"character": "っ"
		},
		{
			"description": "Hiragana Letter Tu",
			"character": "つ"
		},
		{
			"description": "Hiragana Letter Du",
			"character": "づ"
		},
		{
			"description": "Hiragana Letter Te",
			"character": "て"
		},
		{
			"description": "Hiragana Letter De",
			"character": "で"
		},
		{
			"description": "Hiragana Letter To",
			"character": "と"
		},
		{
			"description": "Hiragana Letter Do",
			"character": "ど"
		},
		{
			"description": "Hiragana Letter Na",
			"character": "な"
		},
		{
			"description": "Hiragana Letter Ni",
			"character": "に"
		},
		{
			"description": "Hiragana Letter Nu",
			"character": "ぬ"
		},
		{
			"description": "Hiragana Letter Ne",
			"character": "ね"
		},
		{
			"description": "Hiragana Letter No",
			"character": "の"
		},
		{
			"description": "Hiragana Letter Ha",
			"character": "は"
		},
		{
			"description": "Hiragana Letter Ba",
			"character": "ば"
		},
		{
			"description": "Hiragana Letter Pa",
			"character": "ぱ"
		},
		{
			"description": "Hiragana Letter Hi",
			"character": "ひ"
		},
		{
			"description": "Hiragana Letter Bi",
			"character": "び"
		},
		{
			"description": "Hiragana Letter Pi",
			"character": "ぴ"
		},
		{
			"description": "Hiragana Letter Hu",
			"character": "ふ"
		},
		{
			"description": "Hiragana Letter Bu",
			"character": "ぶ"
		},
		{
			"description": "Hiragana Letter Pu",
			"character": "ぷ"
		},
		{
			"description": "Hiragana Letter He",
			"character": "へ"
		},
		{
			"description": "Hiragana Letter Be",
			"character": "べ"
		},
		{
			"description": "Hiragana Letter Pe",
			"character": "ぺ"
		},
		{
			"description": "Hiragana Letter Ho",
			"character": "ほ"
		},
		{
			"description": "Hiragana Letter Bo",
			"character": "ぼ"
		},
		{
			"description": "Hiragana Letter Po",
			"character": "ぽ"
		},
		{
			"description": "Hiragana Letter Ma",
			"character": "ま"
		},
		{
			"description": "Hiragana Letter Mi",
			"character": "み"
		},
		{
			"description": "Hiragana Letter Mu",
			"character": "む"
		},
		{
			"description": "Hiragana Letter Me",
			"character": "め"
		},
		{
			"description": "Hiragana Letter Mo",
			"character": "も"
		},
		{
			"description": "Hiragana Letter Small Ya",
			"character": "ゃ"
		},
		{
			"description": "Hiragana Letter Ya",
			"character": "や"
		},
		{
			"description": "Hiragana Letter Small Yu",
			"character": "ゅ"
		},
		{
			"description": "Hiragana Letter Yu",
			"character": "ゆ"
		},
		{
			"description": "Hiragana Letter Small Yo",
			"character": "ょ"
		},
		{
			"description": "Hiragana Letter Yo",
			"character": "よ"
		},
		{
			"description": "Hiragana Letter Ra",
			"character": "ら"
		},
		{
			"description": "Hiragana Letter Ri",
			"character": "り"
		},
		{
			"description": "Hiragana Letter Ru",
			"character": "る"
		},
		{
			"description": "Hiragana Letter Re",
			"character": "れ"
		},
		{
			"description": "Hiragana Letter Ro",
			"character": "ろ"
		},
		{
			"description": "Hiragana Letter Small Wa",
			"character": "ゎ"
		},
		{
			"description": "Hiragana Letter Wa",
			"character": "わ"
		},
		{
			"description": "Hiragana Letter Wi",
			"character": "ゐ"
		},
		{
			"description": "Hiragana Letter We",
			"character": "ゑ"
		},
		{
			"description": "Hiragana Letter Wo",
			"character": "を"
		},
		{
			"description": "Hiragana Letter N",
			"character": "ん"
		},
		{
			"description": "Hiragana Letter Vu",
			"character": "ゔ"
		},
		{
			"description": "Katakana-Hiragana Voiced Sound Mark",
			"character": "゛"
		},
		{
			"description": "Katakana-Hiragana Semi-Voiced Sound Mark",
			"character": "゜"
		},
		{
			"description": "Hiragana Iteration Mark",
			"character": "ゝ"
		},
		{
			"description": "Hiragana Voiced Iteration Mark",
			"character": "ゞ"
		}
	]
};
const Katakana = {
	title: "Katakana",
	content: [
		{
			"description": "Katakana Letter Small A",
			"character": "ァ"
		},
		{
			"description": "Katakana Letter A",
			"character": "ア"
		},
		{
			"description": "Katakana Letter Small I",
			"character": "ィ"
		},
		{
			"description": "Katakana Letter I",
			"character": "イ"
		},
		{
			"description": "Katakana Letter Small U",
			"character": "ゥ"
		},
		{
			"description": "Katakana Letter U",
			"character": "ウ"
		},
		{
			"description": "Katakana Letter Small E",
			"character": "ェ"
		},
		{
			"description": "Katakana Letter E",
			"character": "エ"
		},
		{
			"description": "Katakana Letter Small O",
			"character": "ォ"
		},
		{
			"description": "Katakana Letter O",
			"character": "オ"
		},
		{
			"description": "Katakana Letter Small Ka",
			"character": "ヵ"
		},
		{
			"description": "Katakana Letter Ka",
			"character": "カ"
		},
		{
			"description": "Katakana Letter Ga",
			"character": "ガ"
		},
		{
			"description": "Katakana Letter Ki",
			"character": "キ"
		},
		{
			"description": "Katakana Letter Gi",
			"character": "ギ"
		},
		{
			"description": "Katakana Letter Ku",
			"character": "ク"
		},
		{
			"description": "Katakana Letter Gu",
			"character": "グ"
		},
		{
			"description": "Katakana Letter Small Ke",
			"character": "ヶ"
		},
		{
			"description": "Katakana Letter Ke",
			"character": "ケ"
		},
		{
			"description": "Katakana Letter Ge",
			"character": "ゲ"
		},
		{
			"description": "Katakana Letter Ko",
			"character": "コ"
		},
		{
			"description": "Katakana Letter Go",
			"character": "ゴ"
		},
		{
			"description": "Katakana Letter Sa",
			"character": "サ"
		},
		{
			"description": "Katakana Letter Za",
			"character": "ザ"
		},
		{
			"description": "Katakana Letter Si",
			"character": "シ"
		},
		{
			"description": "Katakana Letter Zi",
			"character": "ジ"
		},
		{
			"description": "Katakana Letter Su",
			"character": "ス"
		},
		{
			"description": "Katakana Letter Zu",
			"character": "ズ"
		},
		{
			"description": "Katakana Letter Se",
			"character": "セ"
		},
		{
			"description": "Katakana Letter Ze",
			"character": "ゼ"
		},
		{
			"description": "Katakana Letter So",
			"character": "ソ"
		},
		{
			"description": "Katakana Letter Zo",
			"character": "ゾ"
		},
		{
			"description": "Katakana Letter Ta",
			"character": "タ"
		},
		{
			"description": "Katakana Letter Da",
			"character": "ダ"
		},
		{
			"description": "Katakana Letter Ti",
			"character": "チ"
		},
		{
			"description": "Katakana Letter Di",
			"character": "ヂ"
		},
		{
			"description": "Katakana Letter Small Tu",
			"character": "ッ"
		},
		{
			"description": "Katakana Letter Tu",
			"character": "ツ"
		},
		{
			"description": "Katakana Letter Du",
			"character": "ヅ"
		},
		{
			"description": "Katakana Letter Te",
			"character": "テ"
		},
		{
			"description": "Katakana Letter De",
			"character": "デ"
		},
		{
			"description": "Katakana Letter To",
			"character": "ト"
		},
		{
			"description": "Katakana Letter Do",
			"character": "ド"
		},
		{
			"description": "Katakana Letter Na",
			"character": "ナ"
		},
		{
			"description": "Katakana Letter Ni",
			"character": "ニ"
		},
		{
			"description": "Katakana Letter Nu",
			"character": "ヌ"
		},
		{
			"description": "Katakana Letter Ne",
			"character": "ネ"
		},
		{
			"description": "Katakana Letter No",
			"character": "ノ"
		},
		{
			"description": "Katakana Letter Ha",
			"character": "ハ"
		},
		{
			"description": "Katakana Letter Ba",
			"character": "バ"
		},
		{
			"description": "Katakana Letter Pa",
			"character": "パ"
		},
		{
			"description": "Katakana Letter Hi",
			"character": "ヒ"
		},
		{
			"description": "Katakana Letter Bi",
			"character": "ビ"
		},
		{
			"description": "Katakana Letter Pi",
			"character": "ピ"
		},
		{
			"description": "Katakana Letter Hu",
			"character": "フ"
		},
		{
			"description": "Katakana Letter Bu",
			"character": "ブ"
		},
		{
			"description": "Katakana Letter Pu",
			"character": "プ"
		},
		{
			"description": "Katakana Letter He",
			"character": "ヘ"
		},
		{
			"description": "Katakana Letter Be",
			"character": "ベ"
		},
		{
			"description": "Katakana Letter Pe",
			"character": "ペ"
		},
		{
			"description": "Katakana Letter Ho",
			"character": "ホ"
		},
		{
			"description": "Katakana Letter Bo",
			"character": "ボ"
		},
		{
			"description": "Katakana Letter Po",
			"character": "ポ"
		},
		{
			"description": "Katakana Letter Ma",
			"character": "マ"
		},
		{
			"description": "Katakana Letter Mi",
			"character": "ミ"
		},
		{
			"description": "Katakana Letter Mu",
			"character": "ム"
		},
		{
			"description": "Katakana Letter Me",
			"character": "メ"
		},
		{
			"description": "Katakana Letter Mo",
			"character": "モ"
		},
		{
			"description": "Katakana Letter Small Ya",
			"character": "ャ"
		},
		{
			"description": "Katakana Letter Ya",
			"character": "ヤ"
		},
		{
			"description": "Katakana Letter Small Yu",
			"character": "ュ"
		},
		{
			"description": "Katakana Letter Yu",
			"character": "ユ"
		},
		{
			"description": "Katakana Letter Small Yo",
			"character": "ョ"
		},
		{
			"description": "Katakana Letter Yo",
			"character": "ヨ"
		},
		{
			"description": "Katakana Letter Ra",
			"character": "ラ"
		},
		{
			"description": "Katakana Letter Ri",
			"character": "リ"
		},
		{
			"description": "Katakana Letter Ru",
			"character": "ル"
		},
		{
			"description": "Katakana Letter Re",
			"character": "レ"
		},
		{
			"description": "Katakana Letter Ro",
			"character": "ロ"
		},
		{
			"description": "Katakana Letter Small Wa",
			"character": "ヮ"
		},
		{
			"description": "Katakana Letter Wa",
			"character": "ワ"
		},
		{
			"description": "Katakana Letter Wi",
			"character": "ヰ"
		},
		{
			"description": "Katakana Letter We",
			"character": "ヱ"
		},
		{
			"description": "Katakana Letter Wo",
			"character": "ヲ"
		},
		{
			"description": "Katakana Letter N",
			"character": "ン"
		},
		{
			"description": "Katakana Letter Vu",
			"character": "ヴ"
		},
		{
			"description": "Katakana Letter Va",
			"character": "ヷ"
		},
		{
			"description": "Katakana Letter Vi",
			"character": "ヸ"
		},
		{
			"description": "Katakana Letter Ve",
			"character": "ヹ"
		},
		{
			"description": "Katakana Letter Vo",
			"character": "ヺ"
		},
		{
			"description": "Katakana Middle Dot",
			"character": "・"
		},
		{
			"description": "Katakana-Hiragana Prolonged Sound Mark",
			"character": "ー"
		},
		{
			"description": "Katakana Iteration Mark",
			"character": "ヽ"
		},
		{
			"description": "Katakana Voiced Iteration Mark",
			"character": "ヾ"
		}
	]
};
const Bopomofo = {
	title: "Bopomofo",
	content: [
		{
			"description": "Bopomofo Letter B",
			"character": "ㄅ"
		},
		{
			"description": "Bopomofo Letter P",
			"character": "ㄆ"
		},
		{
			"description": "Bopomofo Letter M",
			"character": "ㄇ"
		},
		{
			"description": "Bopomofo Letter F",
			"character": "ㄈ"
		},
		{
			"description": "Bopomofo Letter D",
			"character": "ㄉ"
		},
		{
			"description": "Bopomofo Letter T",
			"character": "ㄊ"
		},
		{
			"description": "Bopomofo Letter N",
			"character": "ㄋ"
		},
		{
			"description": "Bopomofo Letter L",
			"character": "ㄌ"
		},
		{
			"description": "Bopomofo Letter G",
			"character": "ㄍ"
		},
		{
			"description": "Bopomofo Letter K",
			"character": "ㄎ"
		},
		{
			"description": "Bopomofo Letter H",
			"character": "ㄏ"
		},
		{
			"description": "Bopomofo Letter J",
			"character": "ㄐ"
		},
		{
			"description": "Bopomofo Letter Q",
			"character": "ㄑ"
		},
		{
			"description": "Bopomofo Letter X",
			"character": "ㄒ"
		},
		{
			"description": "Bopomofo Letter Zh",
			"character": "ㄓ"
		},
		{
			"description": "Bopomofo Letter Ch",
			"character": "ㄔ"
		},
		{
			"description": "Bopomofo Letter Sh",
			"character": "ㄕ"
		},
		{
			"description": "Bopomofo Letter R",
			"character": "ㄖ"
		},
		{
			"description": "Bopomofo Letter Z",
			"character": "ㄗ"
		},
		{
			"description": "Bopomofo Letter C",
			"character": "ㄘ"
		},
		{
			"description": "Bopomofo Letter S",
			"character": "ㄙ"
		},
		{
			"description": "Bopomofo Letter A",
			"character": "ㄚ"
		},
		{
			"description": "Bopomofo Letter O",
			"character": "ㄛ"
		},
		{
			"description": "Bopomofo Letter E",
			"character": "ㄜ"
		},
		{
			"description": "Bopomofo Letter Eh",
			"character": "ㄝ"
		},
		{
			"description": "Bopomofo Letter Ai",
			"character": "ㄞ"
		},
		{
			"description": "Bopomofo Letter Ei",
			"character": "ㄟ"
		},
		{
			"description": "Bopomofo Letter Au",
			"character": "ㄠ"
		},
		{
			"description": "Bopomofo Letter Ou",
			"character": "ㄡ"
		},
		{
			"description": "Bopomofo Letter An",
			"character": "ㄢ"
		},
		{
			"description": "Bopomofo Letter En",
			"character": "ㄣ"
		},
		{
			"description": "Bopomofo Letter Ang",
			"character": "ㄤ"
		},
		{
			"description": "Bopomofo Letter Eng",
			"character": "ㄥ"
		},
		{
			"description": "Bopomofo Letter Er",
			"character": "ㄦ"
		},
		{
			"description": "Bopomofo Letter I",
			"character": "ㄧ"
		},
		{
			"description": "Bopomofo Letter U",
			"character": "ㄨ"
		},
		{
			"description": "Bopomofo Letter Iu",
			"character": "ㄩ"
		},
		{
			"description": "Bopomofo Letter V",
			"character": "ㄪ"
		},
		{
			"description": "Bopomofo Letter Ng",
			"character": "ㄫ"
		},
		{
			"description": "Bopomofo Letter Gn",
			"character": "ㄬ"
		},
		{
			"description": "Bopomofo Letter Bu",
			"character": "ㆠ"
		},
		{
			"description": "Bopomofo Letter Zi",
			"character": "ㆡ"
		},
		{
			"description": "Bopomofo Letter Ji",
			"character": "ㆢ"
		},
		{
			"description": "Bopomofo Letter Gu",
			"character": "ㆣ"
		},
		{
			"description": "Bopomofo Letter Ee",
			"character": "ㆤ"
		},
		{
			"description": "Bopomofo Letter Enn",
			"character": "ㆥ"
		},
		{
			"description": "Bopomofo Letter Oo",
			"character": "ㆦ"
		},
		{
			"description": "Bopomofo Letter Onn",
			"character": "ㆧ"
		},
		{
			"description": "Bopomofo Letter Ir",
			"character": "ㆨ"
		},
		{
			"description": "Bopomofo Letter Ann",
			"character": "ㆩ"
		},
		{
			"description": "Bopomofo Letter Inn",
			"character": "ㆪ"
		},
		{
			"description": "Bopomofo Letter Unn",
			"character": "ㆫ"
		},
		{
			"description": "Bopomofo Letter Im",
			"character": "ㆬ"
		},
		{
			"description": "Bopomofo Letter Ngg",
			"character": "ㆭ"
		},
		{
			"description": "Bopomofo Letter Ainn",
			"character": "ㆮ"
		},
		{
			"description": "Bopomofo Letter Aunn",
			"character": "ㆯ"
		},
		{
			"description": "Bopomofo Letter Am",
			"character": "ㆰ"
		},
		{
			"description": "Bopomofo Letter Om",
			"character": "ㆱ"
		},
		{
			"description": "Bopomofo Letter Ong",
			"character": "ㆲ"
		},
		{
			"description": "Bopomofo Letter Innn",
			"character": "ㆳ"
		},
		{
			"description": "Bopomofo Final Letter P",
			"character": "ㆴ"
		},
		{
			"description": "Bopomofo Final Letter T",
			"character": "ㆵ"
		},
		{
			"description": "Bopomofo Final Letter K",
			"character": "ㆶ"
		},
		{
			"description": "Bopomofo Final Letter H",
			"character": "ㆷ"
		}
	]
}

const charData = {
	Latin,
	IPA,
	Greek,
	Coptic,
	Cyrillic,
	Armenian,
	Hebrew,
	Arabic,
	Thai,
	Lao,
	Hiragana,
	Katakana,
	Bopomofo
};

/*
const All = [
	...Latin.content,
	...IPA.content,
	...Greek.content,
	...Coptic.content,
	...Cyrillic.content,
	...Armenian.content,
	...Hebrew.content,
	...Arabic.content,
	...Thai.content,
	...Lao.content,
	...Hiragana.content,
	...Katakana.content,
	...Bopomofo.content
];
*/
