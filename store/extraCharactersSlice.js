import { createSlice } from '@reduxjs/toolkit'
import blankAppState from './blankAppState';

const initialState = blankAppState.extraCharacters;

const toggleCopyImmediatelyFunc = (state) => {
	state.copyImmediately = !state.copyImmediately;
	return state;
};
const toggleShowNamesFunc = (state) => {
	state.showNames = !state.showNames;
	return state;
};
const setToCopyFunc = (state, action) => {
	state.toCopy = action.payload;
	return state;
};
const setFavesFunc = (state, action) => {
	state.faves = action.payload;
	return state;
};

const extraCharactersSlice = createSlice({
	name: 'extraCharacters',
	initialState,
	reducers: {
		toggleCopyImmediately: toggleCopyImmediatelyFunc,
		toggleShowNames: toggleShowNamesFunc,
		setToCopy: setToCopyFunc,
		setFaves: setFavesFunc
	}
});

export const {
	toggleCopyImmediately,
	toggleShowNames,
	setToCopy,
	setFaves
} = extraCharactersSlice.actions;

export default extraCharactersSlice.reducer;
