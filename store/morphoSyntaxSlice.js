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
	if(!!value) {
		state.bool[prop] = true;
	} else {
		delete state.bool[prop];
	}
	return state;
};
const setNumFunc = (state, action) => {
	const { prop, value } = action.payload;
	if(value) {
		state.num[prop] = value;
	} else {
		delete state.num[prop];
	}
	return state;
};
const setTextFunc = (state, action) => {
	const { prop, value } = action.payload;
	if(value) {
		state.text[prop] = value;
	} else {
		delete state.text[prop];
	}
	return state;
};
// LOAD INFO and CLEAR ALL
const loadStateFunc = (state, action) => {
	// If payload is null (or falsy), then initialState is used
	const {
		bool,
		num,
		text,
		...others
	} = action.payload || initialState;
	return {
		...state,
		...others,
		bool: {...bool},
		num: {...num},
		text: {...text}
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
