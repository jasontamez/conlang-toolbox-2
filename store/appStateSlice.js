import { createSlice } from '@reduxjs/toolkit';
import { availableThemes } from '../components/theme';

const initialState = {
	menuToggleName: '',
	theme: 'Default',
	disableConfirms: false
};

const setMenuToggleNameFunc = (state, action) => {
	state.menuToggleName = action.payload;
	return state;
};

const setThemeFunc = (state, action) => {
	state.theme = availableThemes.find((theme) => theme === action.payload) || "Default";
	return state;
};

const setDisableConfirmsFunc = (state, action) => {
	state.disableConfirms = action.payload;
	return state;
};

const appStateSlice = createSlice({
	name: 'appState',
	initialState,
	reducers: {
		setMenuToggleName: setMenuToggleNameFunc,
		setTheme: setThemeFunc,
		setDisableConfirms: setDisableConfirmsFunc
	}
});

export const {
	setMenuToggleName,
	setTheme,
	setDisableConfirms
} = appStateSlice.actions;

export default appStateSlice.reducer;
