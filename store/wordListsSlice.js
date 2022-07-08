import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	centerTheDisplayedWords: [],
	listsDisplayed: {ASJP: true}
};

const centerTheDisplayedWordsFunc = (state, action) => {
	state.centerTheDisplayedWords = action.payload;
	return state;
};
const addListFunc = (state, action) => {
	state.listsDisplayed[action.payload] = true;
	return state;
};
const removeListFunc = (state, action) => {
	const display = state.listsDisplayed;
	delete display[action.payload];
	state.listsDisplayed = display;
	return state;
};

const wordListsSlice = createSlice({
	name: 'wordLists',
	initialState,
	reducers: {
		centerTheDisplayedWords: centerTheDisplayedWordsFunc,
		addList: addListFunc,
		removeList: removeListFunc
	}
});

export const { setMenuToggleName, setMenuToggleNumber } = wordListsSlice.actions;

export default wordListsSlice.reducer;
