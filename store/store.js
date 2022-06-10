//import AsyncStorage from '@react-native-async-storage/async-storage';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
//import { createStore, applyMiddleware } from "redux";
import { reducer, blankAppState } from "./ducks";
import { persistStore, persistReducer } from 'redux-persist';
//import thunk from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import { StateStorage } from './PersistentInfo';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const maybeSetState = async () => {
	let storedState = await StateStorage.getItem("lastState");
	if(storedState !== null) {
		if(storedState && (typeof storedState) === "object") {
			if (compareVersions.compare(storedState.currentVersion, VERSION.current, "<")) {
				// Do stuff to possibly bring storedState up to date
				storedState.currentVersion = VERSION.current;
			}
			if(checkIfState(storedState)) {
				return dispatch(overwriteState(storedState));
			}
		}
	}
	return dispatch(overwriteState(initialAppState));
};


export default () => {
	const persistConfig = {
		key: 'root',
		storage: ExpoFileSystemStorage,
		version: 0,
		stateReconciler: autoMergeLevel2
	}
	//let store = createStore(persistedReducer(reducer), blankAppState, applyMiddleware(thunk));
	const persistedReducer = persistReducer(persistConfig, reducer);
	let store = configureStore({
		reducer: persistedReducer(reducer),
		preloadedState: blankAppState
	});
	let persistor = persistStore(store);
	return { store, persistor };
};
