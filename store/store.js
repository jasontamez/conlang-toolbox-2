//import AsyncStorage from '@react-native-async-storage/async-storage';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
//import { createStore, applyMiddleware } from "redux";
import { reducer, blankAppState } from "./ducks";
import { persistStore, persistReducer } from 'redux-persist';
//import thunk from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
import { StateStorage } from './persistentInfo';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
//import packageJson from '../../package.json';

const reconcile = async (incoming, original, reduced) => {
	if(!incoming || typeof incoming !== 'object') {
		// If we have no incoming state, then there might be previously stored state.
		let storedState = await StateStorage.getItem("lastState");
		if(storedState !== null && (typeof storedState) === "object") {
			// Delete stored state
			StateStorage.removeItem("lastState");
			// Not going to use a currentVersion prop anymore
			delete storedState.currentVersion;
			//
			//
			// Make any other changes if needed
			//
			//
			//
			return storedState;
			//const VERSION = packageJson.version;
			//if(checkIfState(storedState)) {
			//	return dispatch(overwriteState(storedState));
			//}
		}
	}
	// Previous state given? No state found from old method? Just pass along.
	return autoMergeLevel2(incoming, original, reduced);
};


export default () => {
	const persistConfig = {
		key: 'root',
		storage: ExpoFileSystemStorage,
		version: 0,
		stateReconciler: reconcile
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
