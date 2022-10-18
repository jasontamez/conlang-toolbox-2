import { createSlice } from '@reduxjs/toolkit'
import blankAppState from './blankAppState';

const initialState = blankAppState.we;

// INPUT
const editInputFunc = (state, action) => {
	const { payload } = action;
	state.input = payload.trim().replaceAll(/(\s*\n\s*)+/g, "\n");
	return state;
};

// GROUPS
const addCharacterGroupFunc = (state, action) => {
	// {label, description, run}
	state.characterGroups.push(action.payload);
	return state;
};
const deleteCharacterGroupFunc = (state, action) => {
	const { label } = action.payload;
	state.characterGroups = state.characterGroups.filter(group => group.label !== label);
	return state;
};
const editCharacterGroupFunc = (state, action) => {
	const {old, edited} = action.payload;
	const { label } = old;
	state.characterGroups = state.characterGroups.map(group => group.label === label ? edited : group);
	return state;
};

// TRANSFORMS
const addTransformFunc = (state, action) => {
	// { id, search, replace, direction, ?description }
	state.transforms.push(action.payload);
	return state;
};
const deleteTransformFunc = (state, action) => {
	const id = action.payload;
	state.transforms = state.transforms.filter(t => t.id !== id);
	return state;
};
const editTransformFunc = (state, action) => {
	const item = action.payload;
	const { id } = item;
	state.transforms = state.transforms.map(t => t.id === id ? item : t);
	return state;
};
const rearrangeTransformsFunc = (state, action) => {
	state.transforms = action.payload;
	return state;
};

// SOUND CHANGES
const addSoundChangeFunc = (state, action) => {
	// { id, beginning, ending, context, anticontext }
	state.soundChanges.push(action.payload);
	return state;
};
const deleteSoundChangeFunc = (state, action) => {
	const id = action.payload;
	state.soundChanges = state.soundChanges.filter(t => t.id !== id);
	return state;
};
const editSoundChangeFunc = (state, action) => {
	const item = action.payload;
	const { id } = item;
	state.soundChanges = state.soundChanges.map(t => t.id === id ? item : t);
	return state;
};
const rearrangeSoundChangesFunc = (state, action) => {
	state.soundChanges = action.payload;
	return state;
};

// SETTINGS

// STORED CUSTOM INFO
const setStoredCustomInfoFunc = (state, action) => {
	const { payload } = action;
	state.storedCustomInfo = payload;
	state.storedCustomIDs = Object.keys(payload);
	return state;
};

// LOAD INFO and CLEAR ALL
const loadWEStateFunc = (state, action) => {
	const {
		input,
		characterGroups,
		transforms,
		soundChanges,
		output
	} = action.payload || initialState;
	return {
		...state,
		input,
		characterGroups: [...characterGroups],
		transforms: [...transforms],
		soundChanges: [...soundChanges],
		output
	};
};


const weSlice = createSlice({
	name: 'we',
	initialState,
	reducers: {
		editInput: editInputFunc,
		addCharacterGroup: addCharacterGroupFunc,
		deleteCharacterGroup: deleteCharacterGroupFunc,
		editCharacterGroup: editCharacterGroupFunc,
		addTransform: addTransformFunc,
		deleteTransform: deleteTransformFunc,
		editTransform: editTransformFunc,
		rearrangeTransforms: rearrangeTransformsFunc,
		addSoundChange: addSoundChangeFunc,
		deleteSoundChange: deleteSoundChangeFunc,
		editSoundChange: editSoundChangeFunc,
		rearrangeSoundChanges: rearrangeSoundChangesFunc,
		loadWEState: loadWEStateFunc,
		setStoredCustomInfo: setStoredCustomInfoFunc
	}
});

export const {
	editInput,
	addCharacterGroup,
	deleteCharacterGroup,
	editCharacterGroup,
	addTransform,
	deleteTransform,
	editTransform,
	rearrangeTransforms,
	addSoundChange,
	deleteSoundChange,
	editSoundChange,
	rearrangeSoundChanges,
	loadWEState,
	setStoredCustomInfo
} = weSlice.actions;

export default weSlice.reducer;
