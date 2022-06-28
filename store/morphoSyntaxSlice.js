import { createSlice } from '@reduxjs/toolkit'

const initialState = {
		key: "",
		lastSave: 0,
		title: "",
		description: "",
		bool: {},
		num: {},
		text: {}
};

const setKeyFunc = (state, action) => {
	state.key = action.payload;
};
const setLastSaveFunc = (state, action) => {
	state.lastSave = action.payload;
};
const setTitleFunc = (state, action) => {
	state.title = action.payload;
};
const setDescriptionFunc = (state, action) => {
	state.description = action.payload;
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
		setKey: setKeyFunc,
		setLastSave: setLastSaveFunc,
		setTitle: setTitleFunc,
		setDescription: setDescriptionFunc,
		setBool: setBoolFunc,
		setNum: setNumFunc,
		setText: setTextFunc
	}
});

export const {
	setKey,
	setLastSave,
	setTitle,
	setDescription,
	setBool,
	setNum,
	setText
} = morphoSyntaxSlice.actions;

export default morphoSyntaxSlice.reducer;
