import { useSelector, useDispatch } from "react-redux";
import WL from '../components/WordLists';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { HStack, Icon, Menu, Pressable, VStack, Text, Divider, Button, Box, Modal } from 'native-base';
import { DotsIcon } from '../components/icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { setCenterTheDisplayedWords, addList, removeList } from '../store/wordListsSlice';
import { setHeaderState } from "../store/appStateSlice";

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
	dispatch(setHeaderState({
		title: 'Word Lists',
		extraChars: false
	}));
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
		<>
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
		</>
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
