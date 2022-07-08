import { useSelector, useDispatch } from "react-redux";
import WL from '../components/WordLists';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { HStack, Icon, Menu, Pressable, ScrollView, VStack, Text, Divider, Button } from 'native-base';
import { DotsIcon } from '../components/icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MenuModal from "../pages/MenuModal";
import { centerTheDisplayedWords, addList, removeList } from '../store/wordListsSlice';

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
	const dispatch = useDispatch();
	/*const theDisplay = wordListsState.display;
	const toggleChars = (what) => {
		if(theDisplay.some((p) => p === what)) {
			return dispatch(updateWordListsDisplay(theDisplay.filter((p) => p !== what)));
		}
		dispatch(updateWordListsDisplay([...theDisplay, what]));
	};*/
	const shown = WL.words.filter((word) => /* theDisplay.some((p) => word[p])*/ 222);
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
	const onMenuClose = () => {
		// close menu
		setMenuOpen(false);
		// save state of the centering option
		dispatch(centerTheDisplayedWords(centerMenuOption));
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
					onClose={() => onMenuClose()}
					isOpen={menuOpen}
				>
					<Menu.OptionGroup defaultValue={centerMenuOption} value={centerMenuOption} type="checkbox" onChange={(v) => handleCenterText(v)}>
						<Menu.ItemOption value="center">Center-Justify Text</Menu.ItemOption>
					</Menu.OptionGroup>
					<Divider my={2} mx="auto" w="90%" bg="main.50" opacity={25} />
					<Menu.Item>
						<Icon as={Ionicons} name="save-outline" size="xs" m={2} />
						<Text>Save All to Lexicon</Text>
					</Menu.Item>
					<Menu.Item>
						<Icon as={Ionicons} name="save-outline" size="xs" m={2} />
						<Text>Choose what to save</Text>
					</Menu.Item>
				</Menu>
			</HStack>
			<ScrollView flexGrow={1}>
				<VStack>
					<Text>Display:</Text>
					<HStack flexWrap="wrap" justifyContent="center">
						{WL.sources.map((list) => {
							const variant = listsDisplayed[list] ? "outline" : "ghost";
							return (
								<Button key={list} variant={variant} onClick={() => 222}>
									<Text>{list}</Text>
								</Button>	
							);
						})}
					</HStack>
				</VStack>
			</ScrollView>
		</VStack>
	);

	/*return (
		<IonPage>
			<ExtraCharactersModal />
			<ModalWrap pageInfo={viewInfo} content={WLCard} />
			<IonHeader>
				<IonToolbar>
					 <IonButtons slot="start">
						 <IonMenuButton />
					 </IonButtons>
					<IonTitle>Word Lists</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={() => dispatch(openModal("InfoModal"))}>
							<IonIcon icon={helpCircleOutline} />
						</IonButton>
						<IonButton onClick={(e) => {
							e.persist();
							dispatch(openPopover("WordListsEllipsis", e));
						}}>
							<IonIcon icon={ellipsisVertical} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonPopover
			        {/*cssClass='my-custom-class'*       /...{}}
					event={modalState.WordListsEllipsis}
					isOpen={modalState.WordListsEllipsis !== undefined}
					onDidDismiss={() => dispatch(closePopover("WordListsEllipsis"))}
				>
					<IonList lines="none">
						<IonItem button={true} onClick={() => dispatch(toggleWordListsBoolean("textCenter"))}>
							<IonIcon icon={textOutline} slot="start" />
							<IonLabel className="ion-text-wrap">{wordListsState.textCenter ? "De-center Text" : "Center Text"}</IonLabel>
						</IonItem>
						<IonItem button={true} onClick={() => saveEverything()}>
							<IonIcon icon={saveOutline} slot="start" />
							<IonLabel className="ion-text-wrap">Save All to Lexicon</IonLabel>
						</IonItem>
						<IonItem button={true} onClick={() => pickAndSave()}>
							<IonIcon icon={saveOutline} slot="start" />
							<IonLabel className="ion-text-wrap">Choose what to save</IonLabel>
						</IonItem>
					</IonList>
				</IonPopover>
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
