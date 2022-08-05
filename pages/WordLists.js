import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import WL from '../components/wordLists';
//import { v4 as uuidv4 } from 'uuid';
import {
	HStack,
	Text,
	Button,
	Box,
	Pressable,
	FlatList
} from 'native-base';
import {
	toggleDisplayedList,
	togglePickAndSaveForLexicon,
	toggleSavedForLexicon,
	setSavingForLexicon,
	equalityCheck
} from '../store/wordListsSlice';
import { CloseCircleIcon, SaveIcon } from "../components/icons";

const WordLists = () => {
	const {
		centerTheDisplayedWords,
		listsDisplayed,
		pickAndSaveForLexicon,
		savingForLexicon
	} = useSelector((state) => state.wordLists, equalityCheck);
	const dispatch = useDispatch();
	const shown = [];
	WL.words.forEach(({word, lists}) => {
		if(lists.some((list) => listsDisplayed[list])) {
			shown.push(word);
		}
	});
	const alignment =
		centerTheDisplayedWords.length > 0 ?
			{ textAlign: "center" }
		:
			{}
	;
	const saveAllFunc = () => {};
	const beginSaveSome = () => {
		dispatch(togglePickAndSaveForLexicon());
	};
	const saveSomeFunc = () => {};
	const cancelSaveSome = () => {
		dispatch(togglePickAndSaveForLexicon());
		dispatch(setSavingForLexicon({}));
	};
	const SaveBar = () => {
		const SaveAll = () => (
			<Button
				justifySelf="flex-start"
				bg="secondary.500"
				m={1.5}
				py={1}
				px={1.5}
				_text={{color: "secondary.50"}}
				startIcon={<SaveIcon color="secondary.50" />}
				onPress={saveAllFunc}
			>SAVE ALL TO LEXICON</Button>
		);
		const SaveSome = () => (
			<Button
				bg="tertiary.500"
				m={1.5}
				py={1}
				px={1.5}
				_text={{color: "tertiary.50"}}
				startIcon={<SaveIcon color="tertiary.50" />}
				onPress={beginSaveSome}
			>SAVE SOME TO LEXICON</Button>
		);
		const Cancel = () => (
			<Button
				bg="danger.500"
				m={1.5}
				py={1}
				px={1.5}
				_text={{color: "danger.50"}}
				startIcon={<CloseCircleIcon color="danger.50" />}
				onPress={cancelSaveSome}
			>CANCEL</Button>
		);
		const SaveChosen = () => (
			<Button
				bg="tertiary.500"
				m={1.5}
				py={1}
				px={1.5}
				_text={{color: "tertiary.50"}}
				startIcon={<SaveIcon color="tertiary.50" />}
				onPress={saveSomeFunc}
			>SAVE CHOSEN TO LEXICON</Button>
		);
		const buttons = [];
		if(pickAndSaveForLexicon) {
			buttons.push(
				<Cancel key="cancel save" />,
				<SaveChosen key="save chosen" />
			);
		} else if(shown.length > 0) {
			buttons.push(
				<SaveAll key="save em all" />,
				<SaveSome key="save some" />
			);
		}
		return shown.length === 0 ? <></> : (
			<HStack
				borderTopColor="darker"
				borderTopWidth={1.5}
				bg="main.700"
				justifyContent="flex-end"
				alignItems="flex-end"
				flexWrap="wrap"
			>
				{buttons}
			</HStack>
		);
	};
	const renderItem = ({item, index}) => {
		const background = index % 2 ? {bg: "darker"} : {};
		const box = (
			<Box
				w="full"
				p={2}
				py={1}
				{...background}
			>
				<Text {...alignment}>{item}</Text>
			</Box>
		);
		return pickAndSaveForLexicon ?
			(
				<Pressable
					onPress={() => dispatch(toggleSavedForLexicon(item))}
					bg={savingForLexicon[item] ? "secondary.500" : "transparent"}
				>
					{box}
				</Pressable>
			)
		: box;
	};
	return (
		<>
			<HStack
				flexWrap="wrap"
				justifyContent="center"
				alignItems="flex-start"
				p={2}
				flexGrow={0}
				flexShrink={0}
			>
				<Box
					m={0}
					py={1}
					mr={1}
					alignSelf="flex-start"
				>
					<Text>Display:</Text>
				</Box>
				{WL.sources.map((list) => {
					const displayProps = listsDisplayed[list] ? {
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
							key={list}
							size="xs"
							borderRadius="full"
							py={1}
							m={1}
							onPress={() => dispatch(toggleDisplayedList(list))}
							{...displayProps}
						>
							<Text fontSize="xs">{list}</Text>
						</Button>
					);
				})}
			</HStack>
			<FlatList
				m={2}
				flexGrow={1}
				flexShrink={1}
				justifySelf="flex-start"
				shadow={shown.length ? 4 : undefined}
				borderWidth={shown.length ? 0.5 : 0}
				borderColor="lighter"
				renderItem={renderItem}
				data={shown}
				keyExtractor={(word) => word}
				extraData={[
					pickAndSaveForLexicon,
					savingForLexicon
				]}
			/>
			<SaveBar />
		</>
	);
};

export default WordLists;
