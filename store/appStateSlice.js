import { createSlice } from '@reduxjs/toolkit';
import { availableThemes } from '../helpers/theme';
import blankAppState from './blankAppState';

const initialState = blankAppState.appState;

const setMenuToggleNameFunc = (state, action) => {
	state.menuToggleName = action.payload;
	return state;
};

const setThemeFunc = (state, action) => {
	state.theme = availableThemes.find(
		(theme) => theme === action.payload
	) || "Default";
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

// Sizes are not changeable.
export const sizes = {
	xs: {
		base: "xs",
		lg: "sm",
		xl: "md"
	},
	sm: {
		base: "sm",
		lg: "md",
		xl: "lg"
	},
	md: {
		base: "md",
		lg: "lg",
		xl: "xl"
	},
	lg: {
		base: "lg",
		lg: "xl",
		xl: "2xl"
	},
	xl: {
		base: "xl",
		lg: "2xl",
		xl: "3xl"
	},
	x2: {
		base: "2xl",
		lg: "3xl",
		xl: "4xl"
	}
};
export const fontSizesInPx = {
	xs: 12,
	sm: 14,
	md: 16,
	lg: 18,
	xl: 20,
	'2xl': 24
};
