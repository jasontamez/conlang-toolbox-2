import { useSelector, useDispatch } from "react-redux";
import WL from '../components/wordLists';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { HStack, VStack, Text, Button, Box } from 'native-base';
import { addList, removeList } from '../store/wordListsSlice';

const WordLists = () => {
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
	const [waitingToAdd, setWaitingToAdd] = useState([]);
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
	const toggleList = (list) => {
		if (listsDisplayed[list]) {
			dispatch(removeList(list));
		} else {
			dispatch(addList(list))
		}
	};
	const alignment = centerTheDisplayedWords.length > 0 ? { textAlign: "center" } : {};
	return (
		<>
			<HStack
				flexWrap="wrap"
				justifyContent="center"
				alignItems="center"
				p={2}
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
							onPress={() => toggleList(list)}
							{...displayProps}
						>
							<Text fontSize="xs">{list}</Text>
						</Button>
					);
				})}
			</HStack>
			<VStack m={2}>
				{shown.map((word) => {
					const background = stripeFlag ? {bg: "darker"} : {};
					stripeFlag = !stripeFlag;
					return (
						<Box
							key={word}
							w="full"
							p={2}
							py={1}
							{...background}
						>
							<Text {...alignment}>{word}</Text>
						</Box>
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

export default WordLists;
