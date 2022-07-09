import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	centerTheDisplayedWords: [],
	listsDisplayed: {}
};

const setCenterTheDisplayedWordsFunc = (state, action) => {
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
		setCenterTheDisplayedWords: setCenterTheDisplayedWordsFunc,
		addList: addListFunc,
		removeList: removeListFunc
	}
});

export const {
	addList,
	removeList,
	setCenterTheDisplayedWords
} = wordListsSlice.actions;

export default wordListsSlice.reducer;
