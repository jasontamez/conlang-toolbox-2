import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	menuToggleName: '',
	menuToggleNumber: 0,
	headerState: {
		title: 'Conlang Toolbox',
		textProps: false,
		boxProps: false,
		extraChars: true,
		rightHeader: []
	}
};

const setMenuToggleNameFunc = (state, action) => {
	state.menuToggleName = action.payload;
	return state;
};

const setMenuToggleNumberFunc = (state, action) => {
	state.menuToggleNumber = action.payload;
	return state;
};

const setHeaderStateFunc = (state, action) => {
	const initHeader = {...initialState.headerState};
	state.headerState = {...initHeader, ...action.payload};
	return state;
};

const appStateSlice = createSlice({
	name: 'appState',
	initialState,
	reducers: {
		setMenuToggleName: setMenuToggleNameFunc,
		setMenuToggleNumber: setMenuToggleNumberFunc,
		setHeaderState: setHeaderStateFunc
	}
});

export const { setMenuToggleName, setMenuToggleNumber, setHeaderState } = appStateSlice.actions;

export default appStateSlice.reducer;
