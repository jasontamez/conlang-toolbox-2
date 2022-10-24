import { createSlice } from '@reduxjs/toolkit'
import blankAppState from './blankAppState';

const initialState = blankAppState.morphoSyntax;

const setIDFunc = (state, action) => {
	// TO-DO: Determine if we really need this
	state.id = action.payload;
	return state;
};
const setLastSaveFunc = (state, action) => {
	// TO-DO: Determine if we really need this
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
		setText: setTextFunc
	}
});

export const {
	setID,
	setLastSave,
	setTitle,
	setDescription,
	setBool,
	setNum,
	setText
} = morphoSyntaxSlice.actions;

export default morphoSyntaxSlice.reducer;
