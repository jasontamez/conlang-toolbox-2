import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { wgCustomStorage, OldCustomStorageWG } from '../../helpers/PersistentInfo';
import { equalityCheck } from '../../store/wgSlice';
//import doExport from '../../components/ExportServices';

const CustomInfoModal = ({
	openModal,
	setOpenModal
}) => {
	const dispatch = useDispatch();
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
		exclamatorySentencePost
	} = useSelector((state) => state.wg, equalityCheck);
	const disableConfirms = useSelector(state => state.appState.disableConfirms);
	// state variable for holding saved custom info keys
	const [savedCustomInfo, setSavedCustomInfo] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	// Grab keys when this loads
	useEffect(() => {
		loadKeys();
	}, []);
	const loadKeys = async () => {
		setIsLoading(true);
		const keys = await wgCustomStorage.getAllKeys();
		setSavedCustomInfo(keys || []);
		setIsLoading(false);
	};
	const doCleanClose = () => {
		// close modal
		setOpenModal(false);
	};
	// TO-DO: Save to new storage.
	// TO-DO: Look at/delete old storage?
	// TO-DO: Figure out how to mark when we've handled an old storage method.
	//   and apply that to App.js too
	// TO-DO: Make a loading screen, kill it when isLoading false
	// TO-DO: Finish everything else!!!
	const maybeSaveInfo = () => {
		let title = ($i("currentInfoSaveName").value).trim();
		if(title === "") {
			// toast error - need title
		}
		const doSave = (title, msg = "saved") => {
			const save = [
				//categories,
				//syllables,
				//rules,
				//{...settingsWG}
			];
			OldCustomStorageWG.setItem(title, save).then(() => {
				// toast - msg ("saved" or "overwritten")
			}).finally(() => doCleanClose());
		};
		// Check if overwriting
		OldCustomStorageWG.getItem(title).then((value) => {
			if(!value) {
				doSave(title);
			} else if (disableConfirms) {
				doSave(title, "overwritten");
			} else {
				// Alert - overwrite?
				// doSave(title, "overwritten");
			}
		});
	};
	//const maybeExportInfo = () => {
	//	let title = ($i("currentInfoExportName").value).trim();
	//	if(title === "") {
	//		// Toast error - needs title
	//	}
	//	title = title + ".json";
	//	const exporting = {
	//		categories,
	//		syllables,
	//		rules,
	//		settingsWG: {...settingsWG}
	//	}
	//	doExport(JSON.stringify(exporting), title)
	//		.catch((e = "Error?") => console.log(e))
	//		.then(() => doCleanClose());
	//};
	const maybeLoadInfo = (title) => {
		const thenFunc = () => {
			OldCustomStorageWG.getItem(title).then((value) => {
				if(value) {
					// dispatch loaded info
					// loaded toast
					doCleanClose()
				} else {
					// Display some error?
						//title: "Unknown Error",
						//text: "Preset \"" + title + "\" not found",
				}
			});
		};
		if(disableConfirms) {
			thenFunc();
		} else {
			// Warning alert - overwriting
			// thenFunc();
		}
	};
	const maybeDeleteInfo = (title) => {
		const thenFunc = () => {
			let newCustom = customInfo.filter(ci => ci !== title);
			//dispatch(setTemporaryInfo({type: "custominfo", data: newCustom}));
			OldCustomStorageWG.removeItem(title).then(() => {
				// toast
			});
		};
		if(disableConfirms) {
			thenFunc();
		} else {
			// Warning alert - deleting
			// thenFunc();
		}
	};
	// has ExtraChars
	// Save Current Info
	//   name input
	// Export Current Info to File
	//   name input
	// Load Saved Info
	//   map of saved info, each with Load and Delete buttons
	//   notice message if nothing previously saved
	return;
};

export default CustomInfoModal;
