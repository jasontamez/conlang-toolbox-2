import { useSelector, useDispatch } from "react-redux";
import WL from '../components/WordLists';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { HStack, Icon, Menu, Pressable, ScrollView, VStack, Text, Divider, Button, Box, Modal } from 'native-base';
import { DotsIcon } from '../components/icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MenuModal from "../pages/MenuModal";
import { setCenterTheDisplayedWords, addList, removeList } from '../store/wordListsSlice';

const WordListsPage = () => {
	const equalityCheck = (stateA, stateB) => {
		if (stateA === stateB) {
			return true;
		} else if (String(stateA.centerTheDisplayedWords) !== String(stateB.centerTheDisplayedWords)) {
			return false;
		}
		try {
			const listA = stateA.listsDisplayed;
			const listB = stateB.listsDisplayed;
			if(listA === listB) {
				return true;
			}
			const keysA = Object.keys(listA);
			const keysB = Object.keys(listB);
			return (keysA.length === keysB.length && String(keysA.sort()) === String(keysB.sort()));
		} catch (error) {
			console.log(error);
			// Assume false
			return false;
		}
	};
	//const [modalState, wordListsState, waitingToAdd] = useSelector((state) => [state.modalState, state.wordListsState, state.lexicon.waitingToAdd], shallowEqual);
	const {centerTheDisplayedWords, listsDisplayed} = useSelector((state) => state.wordLists, equalityCheck);
	const [centerMenuOption, setCenterMenuOption] = useState(centerTheDisplayedWords);
	const [centerAlignText, setCenterAlignText] = useState(centerTheDisplayedWords.length > 0);
	const [menuOpen, setMenuOpen] = useState(false);
	const [waitingToAdd, setWaitingToAdd] = useState([]);
	const [infoModalOpen, setInfoModelOpen] = useState(false);
	const dispatch = useDispatch();
	const shown = [];
	WL.words.forEach(({word, lists}) => {
		if(lists.some((list) => listsDisplayed[list])) {
			shown.push(word);
		}
	});
	let stripeFlag = true;
	/*const viewInfo = ['wl', 'home'];
	useIonViewDidEnter(() => {
		dispatch(changeView(viewInfo));
	});
	const outputPane = $i("outputPaneWL");*/

	// // //
	// Save to Lexicon
	// // //
	/*const pickAndSave = () => {
		dispatch(closePopover("WordListsEllipsis"));
		dispatch(openModal("PickAndSaveWG"));
	};
	const donePickingAndSaving = () => {
		dispatch(closeModal("PickAndSaveWG"));
	};
	const saveEverything = () => {
		let wordsToSave = [];
		dispatch(closePopover("WordListsEllipsis"));
		$a(".word", outputPane).forEach((word) => {
			word.textContent && wordsToSave.push(word.textContent);
		});
		dispatch(addDeferredLexiconItems(wordsToSave));
	};
	const maybeSaveThisWord = (text, id) => {
		if(outputPane.classList.contains("pickAndSave")) {
			let CL = ($i(id)).classList;
			if(CL.contains("saved")) {
				CL.remove("saved");
				dispatch(removeDeferredLexiconItem(text));
			} else {
				CL.add("saved");
				dispatch(addDeferredLexiconItems([text]));
			}
		}
	};*/
	const handleCenterText = (checkboxes) => {
		setCenterMenuOption(checkboxes);
		setCenterAlignText(checkboxes.length > 0);
	};
	const doMenuClose = () => {
		// close menu
		setMenuOpen(false);
		// save state of the centering option
		dispatch(setCenterTheDisplayedWords(centerMenuOption));
	};
	const showInfo = () => {
		doMenuClose();
		setInfoModelOpen(true);
	};
	const toggleList = (list) => {
		if (listsDisplayed[list]) {
			dispatch(removeList(list));
		} else {
			dispatch(addList(list))
		}
	};
	return (
		<VStack h="full" alignItems="stretch" justifyContent="space-between" w="full" position="fixed" top={0} bottom={0}>
			<HStack w="full" alignItems="center" bg="lighter" flexGrow={0} safeArea>
				<MenuModal />
				<Text flexGrow={1} isTruncated fontSize="lg" textAlign="center">Word Lists</Text>
				<Menu
					placement="bottom right"
					closeOnSelect={false}
					w="full"
					trigger={(triggerProps) => (
						<Pressable m="auto" w={6} accessibilityLabel="More options menu" {...triggerProps}>
							<DotsIcon />
						</Pressable>
					)}
					onOpen={() => setMenuOpen(true)}
					onPress={() => setMenuOpen(true)}
					onClose={() => doMenuClose()}
					isOpen={menuOpen}
				>
					<Menu.OptionGroup defaultValue={centerMenuOption} value={centerMenuOption} type="checkbox" onChange={(v) => handleCenterText(v)}>
						<Menu.ItemOption value="center">Center-Justify Text</Menu.ItemOption>
					</Menu.OptionGroup>
					<Divider my={2} mx="auto" w="90%" bg="main.50" opacity={25} />
					<Menu.Item>
						<Icon as={Ionicons} name="save-outline" size="sm" m={2} ml={0} />
						<Text>Save All to Lexicon</Text>
					</Menu.Item>
					<Menu.Item>
						<Icon as={Ionicons} name="save-outline" size="sm" m={2} ml={0} />
						<Text>Choose what to save</Text>
					</Menu.Item>
					<Divider my={2} mx="auto" w="90%" bg="main.50" opacity={25} />
					<Menu.Item onPress={() => showInfo()}>
						<Icon as={Ionicons} name="help-circle-outline" size="sm" m={2} ml={0} />
						<Text>Info About the Lists</Text>
					</Menu.Item>
				</Menu>
				<Modal isOpen={infoModalOpen} h="full">
					<Modal.Content w="full" maxWidth="full" minHeight="full" p={0} m={0} borderTopRadius={0}>
						<Modal.Header bg="primary.600" borderBottomWidth={0}>
							<Text color="primaryContrast" fontSize="md">About the Lists</Text>
						</Modal.Header>
						<Modal.CloseButton _icon={{color: "primaryContrast"}} onPress={() => setInfoModelOpen(false)} />
						<Modal.Body h="full" maxWidth="full" minHeight="full">
							<VStack space={4} justifyContent="space-between">
								<Text px={5} fontSize="sm">
									{'\t'}Presented here are a number of lists of English words representing basic concepts
									for the purposes of historical-comparative linguistics. These may serve as a good
									source of words to start a conlang with.
								</Text>
								<Text fontSize="md">Swadesh Lists</Text>
								<Text px={5} fontSize="sm">
									{'\t'}Originally assembled by Morris Swadesh, chosen for their universal, culturally
									independent availability in as many languages as possible. However, he relied
									more on his intuition than on a rigorous set of criteria. <Text bold>Swadesh
									100</Text> is his final list from 1971. The <Text bold>Swadesh 207</Text> is
									adapted from his original list from 1952. <Text bold>Swadesh-Yakhontov</Text> is
									a subset of the 207 assembled by Sergei Yakhontov. And the <Text bold>Swadesh-Woodward
									Sign List</Text> was assembled by James Woodward to take into account the ways
									sign languages use words and concepts.
								</Text>
								<Text fontSize="md">Dogolposky List</Text>
								<Text px={5} fontSize="sm">
									{'\t'}Compiled by Aharon Dolgopolsky in 1964, this lists the 15 lexical items that are
									the least likely to be replaced by other words as a language evolves. It was based
									on a study of 140 languages from across Eurasia.
								</Text>
								<Text fontSize="md">Leipzig-Jakarta List</Text>
								<Text px={5} fontSize="sm">
									{'\t'}Similar to the Dogolposky list, this is a list of words judged to be the most
									resistant to borrowing. Experts on 41 languages from across the world were given a
									uniform vocabulary list and asked to provide the words for each item in the language
									on which they were an expert, as well as information on how strong the evidence that
									each word was borrowed was. The 100 concepts that were found in most languages and
									were most resistant to borrowing formed the Leipzig-Jakarta list.
								</Text>
								<Text fontSize="md">ASJP List</Text>
								<Text px={5} fontSize="sm">
									{'\t'}<Text bold>Automated Similarity Judgment Program</Text> is a collaborative project
									applying computational approaches to comparative linguistics using a database of word
									lists. It uses a 40-word list to evaluate the similarity of words with the same
									meaning from different languages.
								</Text>
							</VStack>
						</Modal.Body>
						<Modal.Footer borderTopWidth={0} h={0} m={0} p={0} />
					</Modal.Content>
				</Modal>
			</HStack>
			<ScrollView flexGrow={1}>
				<HStack flexWrap="wrap" justifyContent="center" alignItems="center" p={2}>
					<Box m={0} py={1} mr={1} alignSelf="flex-start"><Text>Display:</Text></Box>
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
							<Button colorScheme="primary" key={list} size="xs" borderRadius="full" py={1} m={1} onPress={() => toggleList(list)} {...displayProps}>
								<Text fontSize="xs">{list}</Text>
							</Button>	
						);
					})}
				</HStack>
				<VStack m={2}>
					{shown.map((word) => {
						const alignment = centerAlignText ? { textAlign: "center" } : {};
						const background = stripeFlag ? {bg: "darker"} : {};
						stripeFlag = !stripeFlag;
						return (
							<Box key={word} w="full" p={2} py={1} {...background}><Text {...alignment}>{word}</Text></Box>
						);
					})}
				</VStack>
			</ScrollView>
		</VStack>
	);

	/*return (
		<IonPage>
			<IonContent>
				<IonList lines="none">
					<IonItem className={modalState.PickAndSaveWG ? "" : "hide"}>
						<IonButton expand="block" strong={true} color="secondary" onClick={() => donePickingAndSaving()}>
							<IonIcon icon={saveOutline} style={ { marginRight: "0.5em" } } /> Done Saving
						</IonButton>
					</IonItem>
					<IonItem>
						<div>
							<span>Display:</span>
							{WL.sources.map((pair, ind) => {
								let [list, prop] = pair;
								const current = theDisplay.some((p) => p === prop);
								return (
									<IonChip key={prop} outline={!current} onClick={() => toggleChars(prop)} className={(ind === 0 ? ("ion-margin-start" + (current ? " " : "")) : "") + (current ? "active" : "")}>
										<IonLabel>{list}</IonLabel>
									</IonChip>	
								);
							})}
						</div>
					</IonItem>
					<div id="outputPaneWL" className={(modalState.PickAndSaveWG ? "pickAndSave " : "") + "wordList"}>
						{shown.map((word) => {
							const ww = word.word;
							const id = uuidv4();
							let c = "word ";
							if(waitingToAdd.some((w) => w === ww)) {
								c = "word saved ";
							}
							return (
								<div onClick={() => maybeSaveThisWord(ww, id)} key={id} id={id} className={c + (wordListsState.textCenter ? "ion-text-center" : "ion-text-start")}>{ww}</div>
							)
						})}
					</div>
				</IonList>
			</IonContent>
		</IonPage>
	); */
};

export default WordListsPage;
