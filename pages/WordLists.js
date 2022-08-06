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
	FlatList,
	Modal,
	VStack,
	Radio,
	useToast
} from 'native-base';
import {
	toggleDisplayedList,
	togglePickAndSaveForLexicon,
	toggleSavedForLexicon,
	setSavingForLexicon,
	equalityCheck
} from '../store/wordListsSlice';
import { CloseCircleIcon, SaveIcon } from "../components/icons";
import { addMultipleItemsAsColumn } from '../store/lexiconSlice';
import doToast from '../components/toast';

const WordLists = () => {
	const {
		centerTheDisplayedWords,
		listsDisplayed,
		pickAndSaveForLexicon,
		savingForLexicon
	} = useSelector((state) => state.wordLists, equalityCheck);
	const columns = useSelector((state) => state.lexicon.columns);
	const dispatch = useDispatch();
	const [addToLexicon, setAddToLexicon] = useState([]);
	const [columnID, setColumnID] = useState(columns[0].id);
	const shown = [];
	WL.words.forEach(({word, lists}) => {
		if(lists.some((list) => listsDisplayed[list])) {
			shown.push(word);
		}
	});
	const saveAllFunc = () => {
		setAddToLexicon([...shown]);
	};
	const beginSaveSome = () => {
		dispatch(togglePickAndSaveForLexicon());
	};
	const saveSomeFunc = () => {
		setAddToLexicon(Object.keys(savingForLexicon));
	};
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
	const alignment =
		centerTheDisplayedWords.length > 0 ?
			{ textAlign: "center" }
		:
			{}
	;
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
	const toast = useToast();
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
			<Modal isOpen={addToLexicon.length > 0}>
				<Modal.Content>
					<Modal.Header
						bg="primary.500"
					>
						<Text color="primaryContrast" fontSize="md">Add to Lexicon</Text>
					</Modal.Header>
					<Modal.CloseButton
						_icon={{color: "primaryContrast"}}
						onPress={() => setAddToLexicon([])}
					/>
					<Modal.Body>
						<VStack
							alignItems="center"
							justifyContent="flex-start"
						>
							<Text alignSelf="flex-start" mb={4}>Choose which Lexicon column to put the words in.</Text>
							<Radio.Group
								onChange={(value) => setColumnID(value)}
								accessibilityLabel="Lexicon columns"
								bg="lighter"
								alignItems="stretch"
							>
								{columns.map((col, index) => (
									<Radio
										value={col.id}
										key={col.id}
										_stack={{
											bg: index % 2 ? "darker" : "transparent",
											p: 2,
											pr: 4
										}}
									>
										{col.label}
									</Radio>
								))}
							</Radio.Group>
						</VStack>
					</Modal.Body>
					<Modal.Footer>
						<HStack
							justifyContent="space-between"
							w="full"
							mx={2}
							my={1}
							p={0}
						>
							<Button
								bg="lighter"
								onPress={() => setAddToLexicon([])}
								px={2}
								py={1}
							>Cancel</Button>
							<Button
								bg="secondary.500"
								_text={{color: "secondary.50"}}
								px={2}
								py={1}
								onPress={() => {
									const length = String(addToLexicon.length);
									dispatch(addMultipleItemsAsColumn({
										words: addToLexicon,
										column: columnID
									}));
									setAddToLexicon([]);
									if(pickAndSaveForLexicon) {
										dispatch(togglePickAndSaveForLexicon());
										dispatch(setSavingForLexicon({}));							
									}
									doToast({
										toast,
										msg: <Text>Added <Text bold>{length}</Text> words to the Lexicon.</Text>,
										placement: "top"
									});
								}}
							>Save</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</>
	);
};

export default WordLists;
