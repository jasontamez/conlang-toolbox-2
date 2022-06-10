//import AsyncStorage from '@react-native-async-storage/async-storage';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
//import { createStore, applyMiddleware } from "redux";
import { reducer, blankAppState } from "./ducks";
import { persistStore, persistReducer } from 'redux-persist';
//import thunk from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';

const persistConfig = {
	key: 'root',
	storage: ExpoFileSystemStorage
}
const persistedReducer = persistReducer(persistConfig, reducer);

export default () => {
	//let store = createStore(persistedReducer(reducer), blankAppState, applyMiddleware(thunk));
	let store = configureStore({
		reducer: persistedReducer(reducer),
		preloadedState: blankAppState
	})
	let persistor = persistStore(store);
	return { store, persistor };
};
