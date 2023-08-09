import { createSlice } from '@reduxjs/toolkit';

const initialState = { history: [] };

// These are settings that will only be looked at by the app and aren't
//    directly settable by the user.
const addPageToHistoryFunc = (state, action) => {
	// action.payload = 'URL' of page
	const history = state.history.slice();
	// history is [newest, ..., oldest]
	const { payload } = action;
	if(history[0] !== payload) {
		// There was a change; if no change, state will not change
		history.unshift(payload);
		while(history.length > 50) {
			history.pop();
		}
		state.history = history;
	}
	return state;
};
const removeLastPageFromHistoryFunc = (state, action) => {
	// history is [newest, ..., oldest]
	state.history.shift();
	return state;
};

const historySlice = createSlice({
	name: 'history',
	initialState,
	reducers: {
		addPageToHistory: addPageToHistoryFunc,
		removeLastPageFromHistory: removeLastPageFromHistoryFunc
	}
});

export const {
	addPageToHistory,
	removeLastPageFromHistory
} = historySlice.actions;

export default historySlice.reducer;
