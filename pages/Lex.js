//import React from 'react';
//import { useSelector, useDispatch } from "react-redux";
/* import {
	openPopover,
	closePopover,
	openModal,
	updateLexiconText,
	updateLexiconNumber,
	startEditLexiconItem,
	deleteLexiconItem,
	updateLexiconOrder,
	updateLexiconSort,
	updateLexicon,
	setLoadingPage,
	setTemporaryInfo,
	updateLexiconBool,
	toggleLexiconWrap,
	clearDeferredLexiconItems
} from '../components/ReduxDucksFuncs';
import { LexiconStorage } from '../components/PersistentInfo';
import { $i } from '../components/DollarSignExports';
import EditLexiconItemModal from './M-EditWord';
import EditLexiconOrderModal from './M-EditWordOrder';
import fireSwal from '../components/Swal';
import LoadLexiconModal from './M-LoadLexicon';
import DeleteLexiconModal from './M-DeleteLexicon';
import { v4 as uuidv4 } from 'uuid';
import escape from '../components/EscapeForHTML';
import VirtualList from 'react-tiny-virtual-list';
import { useWindowHeight } from '@react-hook/window-size/throttled';
import ltr from '../components/LTR';
import ExtraCharactersModal from './M-ExtraCharacters';
import ExportLexiconModal from './M-ExportLexicon';
import debounce from '../components/Debounce';
import { Clipboard } from '@capacitor/clipboard'; */
import { Input, FlatList, Text, TextArea, VStack, HStack, Box } from 'native-base';

const Lex = () => {
	/*
	const dispatch = useDispatch();
	//const [appSettings, modalState, lexicon] = useSelector((state) => [state.appSettings, state.modalState, state.lexicon]);
	const popstate = modalState.LexiconEllipsis;
	const twoThirds = Math.ceil(useWindowHeight() / 3 * 2);
	const clearSavedWords = () => {
		const thenFunc = () => {
			dispatch(clearDeferredLexiconItems());
			fireSwal({
				title: "Words deleted.",
				toast: true,
				timer: 2500,
				timerProgressBar: true,
				showConfirmButton: false
			});
		};
		if(appSettings.disableConfirms) {
			thenFunc();
		} else {
			fireSwal({
				text: "Are you sure you want to delete the saved words? This cannot be undone.",
				customClass: {popup: 'deleteConfirm'},
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: "Yes, delete them."
			}).then((result) => result.isConfirmed && thenFunc());
		}
	};
	const loadSavedWords = () => {
		let cols = lexicon.columns;
		let options = {};
		for(let x = 0; x < cols; x++) {
			options[x.toString()] = lexicon.columnTitles[x];
		}
		const thenFunc = (value) => {
			dispatch(setLoadingPage("lookingForLexicons"));
			let [col, dir] = lexicon.sort;
			const toAdd = [...lexicon.waitingToAdd];
			let everythingToSort = [...lexicon.lexicon];
			let pre = [];
			let post = [];
			for(let c = 0; c < value; c++) {
				pre.push("");
			}
			for(let c = value + 1; c < cols; c++) {
				post.push("");
			}
			toAdd.forEach(w => {
				everythingToSort.push({key: uuidv4(), columns: [...pre, w, ...post]});
			});
			internalSort(col, dir, everythingToSort);
			dispatch(clearDeferredLexiconItems());
			dispatch(setLoadingPage(false));
		};
		if(cols === 1) {
			return thenFunc(0);
		} else {
			return fireSwal({
				title: 'Import Lexicon',
				input: 'select',
				inputOptions: options,
				inputPlaceholder: 'Which column do you want to save to?',
				showCancelButton: true
			}).then((result) => {
				if(result.isConfirmed && result.value) {
					thenFunc(parseInt(result.value));
				}
			});
		}
	};
	const setNewInfo = (id, prop) => {
		const el = $i(id);
		const value = el.value.trim();
		debounce(dispatch, [updateLexiconText(prop, value)], (prop === "description" ? 2000 : 1000));
	};
	const theOrder = lexicon.columnOrder;
	const theTitles = lexicon.columnTitles;
	const theSizes = lexicon.columnSizes;
	const theSort = lexicon.sort.map((n) => n.toString()).join("");
	const internalSort = (col, dir, newLex = [...lexicon.lexicon]) => {
		newLex.sort((a, b) => {
			let x = a.columns[col];
			let y;
			let comp;
			if(dir) {
				y = x;
				x = b.columns[col];
			} else {
				y = b.columns[col];
			}
			try {
				comp = x.localeCompare(y, 'en', {numeric: true, usage: 'sort'});
			} catch(error) {
				comp = 0;
				console.log(error);
			}
			return comp;
		});
		dispatch(updateLexiconOrder(newLex));
		dispatch(updateLexiconBool("sorted", true));
	};
	const doSort = () => {
		const el = $i("lexiconSort");
		const value = el.value;
		let [col, dir] = value.split("").map((n) => parseInt(n));
		dispatch(updateLexiconSort([col, dir]));
		internalSort(col, dir);
	};
	const addToLex = () => {
		const newInfo = [];
		let foundFlag = false;
		const columns = lexicon.columns;
		let i = 0;
		while(i < columns) {
			let el = $i("inputLex" + i.toString());
			if(el !== null) {
				let info = el.value.trim();
				if(info) {
					foundFlag = true;
				}
				newInfo.push(info);
			}
			i++;
		}
		if(!foundFlag) {
			fireSwal({
				title: "Error",
				icon: "error",
				text: "You did not type any information into any text field."
			});
			return;
		}
		i = 0;
		while(i < columns) {
			let el = $i("inputLex" + i.toString());
			if(el !== null) {
				el.value = "";
			}
			i++;
		}
		const newWord = {
			key: uuidv4(),
			columns: newInfo
		}
		let [col, dir] = lexicon.sort;
		internalSort(col, dir, [...lexicon.lexicon, newWord]);
	};
	const delFromLex = (key) => {
		let title = "";
		let index = -1;
		if(lexicon.lexicon.every((lx, i) => {
			if(lx.key === key) {
				index = i;
				title = lx.columns.join(" / ");
				return false;
			}
			return true;
		})) {
			console.log("Bad key: " + key);
			return;
		}
		const thenFunc = () => dispatch(deleteLexiconItem(index));
		if(appSettings.disableConfirms) {
			thenFunc();
		} else {
			fireSwal({
				html: escape(title) + "<br /><br />Are you sure you want to delete this? This cannot be undone.",
				customClass: {popup: 'deleteConfirm'},
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: "Yes, delete it."
			}).then((result) => result.isConfirmed && thenFunc());
		}
	};
	const swapColumns = () => {
		dispatch(openModal('EditLexiconOrder'));
	};
	const editInLex = (key) => {
		//need modal
		let index = -1;
		if(lexicon.lexicon.every((lx, i) => {
			if(lx.key === key) {
				index = i;
				return false;
			}
			return true;
		})) {
			console.log("Bad key: " + key);
			return;
		}
		dispatch(startEditLexiconItem(index));
		dispatch(openModal('EditLexiconItem'));
	};
	const clearLexicon = () => {
		dispatch(closePopover('LexiconEllipsis'))
		const thenFunc = () => {
			const newLexObject = {
				key: "",
				lastSave: 0,
				title: "",
				description: "",
				columns: lexicon.columns,
				columnOrder: [...lexicon.columnOrder],
				columnTitles: [...lexicon.columnTitles],
				columnSizes: [...lexicon.columnSizes],
				sort: [...lexicon.sort],
				sorted: true,
				lexicon: [],
				waitingToAdd: [...lexicon.waitingToAdd],
				editing: undefined,
				colEdit: undefined,
				lexiconWrap: lexicon.lexiconWrap
			};
			dispatch(updateLexicon(newLex));
		};
		if(!appSettings.disableConfirms && (lexicon.title || lexicon.key || lexicon.description || lexicon.lexicon.length > 0)) {
			fireSwal({
				title: "Delete everything?",
				text: "This will erase everything currently displayed (but not anything previously saved). Are you sure you want to do this?",
				customClass: {popup: 'deleteConfirm'},
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: "Yes, erase it."
			}).then((result) => result.isConfirmed && thenFunc());
		} else {
			thenFunc();
		}
	};
	const openLexiconModal = (which) => {
		let info = [];
		LexiconStorage.iterate((valueObject, key) => {
			info.push([key, value]);
			return; // Blank return keeps the loop going
		}).then(() => {
			info.length > 0 && dispatch(setTemporaryInfo({ type: "storedlexicons", data: info }));
			dispatch(setLoadingPage(false));
			dispatch(openModal(which));
		});
		dispatch(closePopover('LexiconEllipsis'));
		dispatch(setLoadingPage("lookingForLexicons"));
	};
	const maybeExportLexicon = () => {
		if(!lexicon.title) {
			return fireSwal({
				title: "Error",
				text: "Please give your lexicon a title before exporting it.",
				icon: 'warning'
			});
		} else if (lexicon.lexicon.length < 1) {
			return fireSwal({
				title: "Error",
				text: "Please add words to your lexicon before exporting it.",
				icon: 'warning'
			});
		}
		dispatch(openModal("ExportLexicon"));
		dispatch(closePopover('LexiconEllipsis'));
	};
	const saveLexicon = (announce = "Lexicon saved.", key = lexicon.key, overwrite = true) => {
		// Save original key
		const firstKey = lexicon.key;
		// Save 'now'
		const now = Date.now();
		if(!lexicon.title) {
			dispatch(closePopover('LexiconEllipsis'));
			return lexiconSaveError();
		} else if(!key) {
			key = uuidv4();
			dispatch(updateLexiconText("key", key));
		}
		// Dispatch to state
		dispatch(updateLexiconNumber("lastSave", now));
		dispatch(setLoadingPage("lookingForLexicons"));
		// These dispatches will NOT be ready by the time Storage loads and saves
		//  so we will need to do some creative variable work
		let lexObject = {...lexicon};
		// Use possibly-new key
		lex.key = key;
		// Use 'now'
		lex.lastSave = now;
		// Deep copy lex.lexicon
		lex.lexicon = lex.lexicon.map((lx) => {
			let x = {...lx};
			x.columns = [...lx.columns];
			return x;
		});
		// Deep copy column info
		lex.columnOrder = [...lex.columnOrder];
		lex.columnTitles = [...lex.columnTitles];
		lex.columnSizes = [...lex.columnSizes];
		lex.sort = [...lex.sort];
		LexiconStorage.setItem(key, lex)
			.then(() => {
				// If we're overwriting, and it's a new key, delete the old one
				if(overwrite && key !== firstKey) {
					LexiconStorage.removeItem(firstKey);
				}
				dispatch(setLoadingPage(false));
				fireSwal({
					title: announce,
					toast: true,
					timer: 2500,
					timerProgressBar: true,
					showConfirmButton: false
				});
			});
		dispatch(closePopover('LexiconEllipsis'));
	};
	const saveLexiconNew = () => {
		if(!lexicon.title) {
			dispatch(closePopover('LexiconEllipsis'));
			return lexiconSaveError();
		}
		let key = uuidv4();
		dispatch(updateLexiconText("key", key));
		saveLexicon("Lexicon saved as new lexicon!", key, false);
	};
	const lexiconSaveError = () => {
		fireSwal({
			title: "Error",
			text: "You must input a title before saving.",
			icon: 'warning'
		});
	};
	const toggleWrap = () => {
		dispatch(closePopover('LexiconEllipsis'));
		dispatch(toggleLexiconWrap());
	};
	const copyText = async () => {
		const info = $i("revealFullElement");
		await Clipboard.write({string: info.textContent});
		//navigator.clipboard.writeText(info.textContent);
		fireSwal({
			title: "Copied to clipboard.",
			toast: true,
			timer: 1500,
			position: 'top',
			timerProgressBar: true,
			showConfirmButton: false
		});	
		clearTimeout(Number(info.dataset.timer));
		info.classList.add("hide");
	};
	const maybeExpand = (e) => {
		const span = e.target;
		if(!lexicon.lexiconWrap && span.matches('.lexItem') && span.clientWidth < span.scrollWidth) {
			let info = $i("revealFullElement");
			if(info.dataset.timer) {
				clearTimeout(Number(info.dataset.timer));
			}
			info.textContent = span.textContent;
			const body = $i("lexiconPage");
			const win = body.getBoundingClientRect();
			const maxend = win.right;
			const maxdown = win.bottom;
			const rect = span.getBoundingClientRect();
			const width = span.scrollWidth + 16;
			const height = span.scrollHeight;
			let style = [
				["width", String(width) + "px"],
			];
			// Determine the location of the span's four corners.
			// Prefer to expand to the end and down, then end and up,
			//   then start and down, and finally start and up
			// Set horizontal position
			if(ltr(span)) {
				// LTR
				let amount = String(Math.floor(rect.left - win.left)) + "px";
				if(rect.left + width > maxend) {
					style.push(["right", amount]);
				} else {
					style.push(["left", amount]);
				}
			} else {
				// RTL
				let amount = String(Math.floor(rect.right - win.right)) + "px";
				if(rect.right + width > maxend) {
					style.push(["left", amount]);
				} else {
					style.push(["right", amount]);
				}
			}
			// Set vertical position
			if(rect.top + height > maxdown) {
				style.push(["bottom", String(Math.floor(rect.bottom)) + "px"]);
			} else {
				style.push(["top", String(Math.floor(rect.top)) + "px"]);
			}
			// Set style
			info.setAttribute("style", style.map((pair) => {
				let [prop, value] = pair;
				return prop + ": " + String(value);
			}).join("; "));
			// Add to page
			info.classList.remove("hide");
			// Disappear after 6 seconds
			info.dataset.timer = String(setTimeout(() => info.classList.add("hide"), 6000));
		}
	};
	*/
	const props = {
		value: "test"
	};
	const LEX = {
		title: undefined,
		description: "Hi, this is a description.",
		wrap: false,
		columns: [
			{
				label: "Word",
				size: "lexMd"
			},
			{
				label: "Part of Speech",
				size: "lexSm"
			},
			{
				label: "Definition",
				size: "lexLg"
			}
		],
		lexicon: [
			{
				id: "0",
				columns: [
					"fleeb",
					"n",
					"A thing you know and love"
				]
			},
			{
				id: "1",
				columns: [
					"boof",
					"v",
					"vocalize in a dog way"
				]
			},
			{
				id: "2",
				columns: [
					"akorn",
					"adj",
					"warm wetness"
				]
			},
		]
	};
	const lexicon = LEX.lexicon;
	const extraData = [LEX.wrap, LEX.columns];
	const sizes = LEX.columns.map(col => col.size);
	const lastCol = sizes.length - 1;
	const isTruncated = !LEX.wrap;
	const ListEmpty = <Box><Text>Nothing here yet.</Text></Box>;
	const renderList = ({item, index}) => {
		const {id, columns} = item;
		const bg = index % 2 ? "lighter" : "darker";
		return (
			<HStack key={id} py={3.5} bg={bg}>
				{columns.map((text, i) => <Box px={1} size={sizes[i]} key={id + "-" + String(i)}><Text isTruncated={isTruncated}>{text}</Text></Box>)}
				{/* ... extra buttons here, with size="lexXs" */}
			</HStack>
		);
	}
	return (
		<VStack>
			<VStack m={3} mb={0}>
				<Text fontSize="sm">Lexicon Title:</Text>
				<Input
					mt={2}
					defaultValue={props.value}
					placeholder="Usually the language name."
					onChange={props.onChange}
					onChangeEnd={props.onChangeEnd}
				/>
			</VStack>
			<VStack m={3} mt={2}>
				<Text fontSize="sm">Description:</Text>
				<TextArea mt={2}
					defaultValue={props.area}
					placeholder="A short description of this lexicon."
					totalLines={3}
					onChange={props.onChange}
					onChangeEnd={props.onChangeEnd}
				/>
			</VStack>
			<HStack alignItems="flex-end" pt={3.5} mx={2}>
				{LEX.columns.map((col, i) => <Box px={1} key={String(i) + "-Col"} size={col.size}><Text bold isTruncated={isTruncated}>{col.label}</Text></Box>)}
			</HStack>
			<HStack alignItems="flex-end" mx={2} mb={1}>
				{LEX.columns.map((col, i) => <Box px={0.5} ml={i === 0 ? 0 : 0.5} mr={i === lastCol ? 0 : 0.5} size={col.size} key={String(i) + "-Input"}><Input w="full" /></Box>)}
			</HStack>
			<FlatList
				m={2}
				mt={0}
				data={lexicon}
				keyExtractor={(word) => word.id}
				ListEmptyComponent={ListEmpty}
				extraData={extraData}
				renderItem={renderList}
			/>
		</VStack>
	);
	/*return (
		<IonPage>
			<EditLexiconItemModal />
			<EditLexiconOrderModal />
			<LoadLexiconModal />
			<ExportLexiconModal />
			<DeleteLexiconModal />
			<ExtraCharactersModal />
			<IonLoading
	        	cssClass='loadingPage'
    	    	isOpen={modalState.loadingPage === "lookingForLexicons"}
    		    onDidDismiss={() => dispatch(setLoadingPage(false))}
	        	message={'Please wait...'}
				spinner="bubbles"
				/*duration={300000}* /
				duration={1000}
			/>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>Lexicon</IonTitle>
					<IonPopover
						event={popstate}
						isOpen={popstate !== undefined}
						onDidDismiss={() => dispatch(closePopover('LexiconEllipsis'))}
					>
						<IonList>
							<IonItem button={true} onClick={() => clearLexicon()}>
								<IonIcon icon={removeCircleOutline} className="ion-padding-end" />
								<IonLabel>Clear Lexicon</IonLabel>
							</IonItem>
							<IonItem button={true} onClick={() => openLexiconModal("LoadLexicon")}>
								<IonIcon icon={addCircleOutline} className="ion-padding-end" />
								<IonLabel>Load Lexicon</IonLabel>
							</IonItem>
							<IonItem button={true} onClick={() => saveLexicon()}>
								<IonIcon icon={saveOutline} className="ion-padding-end" />
								<IonLabel>Save Lexicon</IonLabel>
							</IonItem>
							<IonItem button={true} onClick={() => saveLexiconNew()}>
								<IonIcon icon={saveOutline} className="ion-padding-end" />
								<IonLabel>Save As New</IonLabel>
							</IonItem>
							<IonItem button={true} onClick={() => maybeExportLexicon()}>
								<IonIcon icon={codeDownloadOutline} className="ion-padding-end" />
								<IonLabel>Export Lexicon</IonLabel>
							</IonItem>
							<IonItem button={true} onClick={() => openLexiconModal("DeleteLexicon")}>
								<IonIcon icon={trashOutline} className="ion-padding-end" />
								<IonLabel>Delete Saved Lexicon</IonLabel>
							</IonItem>
							<IonItemDivider>
								<IonLabel>Options</IonLabel>
							</IonItemDivider>
							<IonItem button={true} onClick={() => toggleWrap()}>
								<IonLabel>{lexicon.lexiconWrap ? "Disable" : "Allow"} Text Wrapping</IonLabel>
							</IonItem>
						</IonList>
					</IonPopover>
					<IonButtons slot="end">
						<IonButton onClick={() => dispatch(openModal("ExtraCharacters"))}>
							<IonIcon icon={globeOutline} />
						</IonButton>
						<IonButton onClick={(e) => { e.persist(); dispatch(openPopover('LexiconEllipsis', e)); }}>
							<IonIcon icon={ellipsisVertical} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen className="evenBackground" id="lexiconPage">
				<IonButton id="revealFullElement" fill="clear" size="small" className="hide" onClick={() => copyText()} />
				<IonList lines="none">
					<IonItem>
						<IonLabel position="stacked" style={ {fontSize: "20px"} }>Lexicon Title:</IonLabel>
						<IonInput value={lexicon.title} id="lexTitle" className="ion-margin-top" placeholder="Usually the language name." onIonChange={() => setNewInfo("lexTitle", "title")}></IonInput>
					</IonItem>
					<IonItem>
						<IonLabel position="stacked" style={ {fontSize: "20px"} }>Description:</IonLabel>
						<IonTextarea value={lexicon.description} id="lexDesc" className="ion-margin-top" placeholder="A short description of this lexicon." rows={3} onIonChange={() => setNewInfo("lexDesc", "description")} />
					</IonItem>
					<IonGrid id="theLexiconHeader">
						<IonRow>
							<IonCol>
								<h1>{lexicon.lexicon.length === 1 ? "1 Word" : lexicon.lexicon.length.toString() + " Words"}</h1>
							</IonCol>
							<IonCol className={lexicon.waitingToAdd.length > 0 ? "" : "hide"} size="auto">
								<IonButton color="warning" strong={true} onClick={() => loadSavedWords()} style={ { padding: "0.25em" } }>
									<IonIcon size="small" icon={saveOutline} style={ { margin: "0 0.25em 0 0" } } /> Add Saved
								</IonButton>
							</IonCol>
							<IonCol className={lexicon.waitingToAdd.length > 0 ? "" : "hide"} size="auto">
								<IonButton color="danger" strong={true} onClick={() => clearSavedWords()} style={ { padding: "0.25em 0" } }>
									<IonIcon size="small" icon={trashOutline} />
								</IonButton>
							</IonCol>
							<IonCol size="auto">
								<IonSelect id="lexiconSort" interface="popover" value={theSort} onIonChange={() => doSort()}>
									{theOrder.map((i) => {
										const title = theTitles[i];
										const which = i.toString();
										const ascdec = [0, 1];
										return ascdec.map((s) => {
											const arrow = [" ↓", " ↑"][s];
											const dir = s.toString();
											return (
												<IonSelectOption value={which + dir} key={which + dir}>{title + arrow}</IonSelectOption>
											);
										});
									})}
								</IonSelect>
							</IonCol>
							<IonCol size="auto">
								<IonButton color="tertiary" style={ { padding: "0.25em 0" } } onClick={() => swapColumns()}>
									<IonIcon size="small" icon={settings} />
								</IonButton>
							</IonCol>
						</IonRow>
					</IonGrid>
					<IonGrid id="theLexiconHolder">
						<IonRow>
							<IonCol id="theLexicon">
								<IonItem className="lexRow lexHeader" style={ { order: -2, overflowY: "scroll" } }>
									{theOrder.map((i) => (
										<div
											className={
												(lexicon.lexiconWrap ? "ion-text-wrap " : "")
												+ theSizes[i]
											}
											style={ { overflowY: "hidden" }}
											key={theTitles[i]}
										>{theTitles[i]}</div>
									))}
									<div className="xs" style={ { overflowY: "hidden" }}></div>
									<div className="xs ion-hide-sm-down" style={ { overflowY: "hidden" }}></div>
								</IonItem>
								<IonItem className="lexRow serifChars lexInputs" style={ { order: -1, overflowY: "scroll" } }>
									{theOrder.map((i) => {
										const key = "inputLex" + i.toString();
										return (
											<IonInput id={key} key={key} className={theSizes[i]} type="text" style={ { overflowY: "hidden" }} />
										);
									})}
									<div className="xs" style={ { overflowY: "hidden" }}>
										<IonButton color="success" onClick={() => addToLex()}>
											<IonIcon icon={add} style={ { margin: 0 } } />
										</IonButton>
									</div>
									<div className="xs ion-hide-sm-down" style={ { overflowY: "hidden" }}></div>
								</IonItem>
								<VirtualList
									className="virtualLex"
									width="100%"
									height={twoThirds}
									itemCount={lexicon.lexicon.length}
									itemSize={48}
									renderItem={({index, style}) => {
										const lex = lexicon.lexicon[index];
										const cols = lex.columns;
										const key = lex.key;
										const id = "LEX" + key;
										let newStyle = {
											...style,
											order: index
										};
										return (
											<IonItem
												key={id}
												className={
													"lexRow lexiconDisplay serifChars "
													+ (index % 2 ? "even" : "odd")
												}
												id={id}
												style={ newStyle }
											>
												{theOrder.map((i) => (
													<div
														onClick={maybeExpand}
														key={key + i.toString()}
														className={
															(lexicon.lexiconWrap ? "ion-text-wrap " : "")
															+ "lexItem selectable "
															+ theSizes[i]
														}
													>{cols[i]}</div>
												))}
												<div className="xs">
													<IonButton style={ { margin: 0 } } color="warning" onClick={() => editInLex(key)}>
														<IonIcon icon={construct} style={ { margin: 0 } } />
													</IonButton>
												</div>
												<div className="xs ion-hide-sm-down">
													<IonButton style={ { margin: 0 } } color="danger" onClick={() => delFromLex(key)}>
														<IonIcon icon={trash} style={ { margin: 0 } } />
													</IonButton>
												</div>
											</IonItem>
										);
									}}
		  						/>
							</IonCol>
						</IonRow>
					</IonGrid>
				</IonList>
			</IonContent>
		</IonPage>
	);*/
};
 
export default Lex;
