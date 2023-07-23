import { createSlice } from '@reduxjs/toolkit'
import blankAppState from './blankAppState';

const initialState = blankAppState.morphoSyntax;

const setIDFunc = (state, action) => {
	state.id = action.payload;
	return state;
};
const setLastSaveFunc = (state, action) => {
	state.lastSave = action.payload;
	return state;
};
const setTitleFunc = (state, action) => {
	state.title = action.payload;
	return state;
};
const setDescriptionFunc = (state, action) => {
	state.description = action.payload;
	return state;
};
const setBoolFunc = (state, action) => {
	const { prop, value } = action.payload;
	state[prop] = value;
	return state;
};
const setNumFunc = (state, action) => {
	const { prop, value } = action.payload;
	state["NUM_" + prop] = value;
	return state;
};
const setTextFunc = (state, action) => {
	const { prop, value } = action.payload;
	state["TEXT_" + prop] = value;
	return state;
};
// LOAD INFO and CLEAR ALL
const loadStateFunc = (state, action) => {
	// If payload is null (or falsy), then initialState is used
	const newState = action.payload || initialState;
	return {
		...state,
		...newState
	};
};
// STORED CUSTOM INFO
const setStoredCustomInfoFunc = (state, action) => {
	const { payload } = action;
	state.storedCustomInfo = payload;
	state.storedCustomIDs = Object.keys(payload);
	return state;
};

const morphoSyntaxSlice = createSlice({
	name: 'morphoSyntax',
	initialState,
	reducers: {
		setID: setIDFunc,
		setLastSave: setLastSaveFunc,
		setTitle: setTitleFunc,
		setDescription: setDescriptionFunc,
		setBool: setBoolFunc,
		setNum: setNumFunc,
		setText: setTextFunc,
		loadState: loadStateFunc,
		setStoredCustomInfo: setStoredCustomInfoFunc
	}
});

export const {
	setID,
	setLastSave,
	setTitle,
	setDescription,
	setBool,
	setNum,
	setText,
	loadState,
	setStoredCustomInfo
} = morphoSyntaxSlice.actions;

export default morphoSyntaxSlice.reducer;
