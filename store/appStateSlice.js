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

const setBaseTextSizeFunc = (state, action) => {
	// action.payload = string from the first line
	//     of the following array
	const sizeArray = [
		"2xs", "xs", "sm", "md", "lg", "xl", "2xl",
		"3xl", "4xl", "5xl", "6xl", "7xl", "8xl", "9xl"
	];
	const appSizes = ["xs", "sm", "md", "lg", "xl", "x2"];
	const size = action.payload;
	const pos = sizeArray.findIndex((sz) => sz === size);
	// pos cannot be smaller than 0 (2xs) or
	//    larger than 6 (2xl)
	const max = pos + 6;
	let sizeObj = {};
	for(let x = pos, y = 0; x < max; x++, y++) {
		sizeObj[appSizes[y]] = {
			base: sizeArray[x],
			lg: sizeArray[x+1],
			xl: sizeArray[x+2]
		};
	}
	state.sizes = sizeObj;
	state.sizeName = size;
	return state;
};

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

const setHasCheckedForOldCustomInfoFunc = (state, action) => {
	state.hasCheckedForOldCustomInfo = action.payload;
	return state;
};

const loadStateFunc = (state, action) => {
	return {
		...state,
		...action.payload
	}
};

const appStateSlice = createSlice({
	name: 'appState',
	initialState,
	reducers: {
		setMenuToggleName: setMenuToggleNameFunc,
		setTheme: setThemeFunc,
		setDisableConfirms: setDisableConfirmsFunc,
		setBaseTextSize: setBaseTextSizeFunc,
		addPageToHistory: addPageToHistoryFunc,
		removeLastPageFromHistory: removeLastPageFromHistoryFunc,
		setHasCheckedForOldCustomInfo: setHasCheckedForOldCustomInfoFunc,
		loadStateAppSettings: loadStateFunc
	}
});

export const {
	setMenuToggleName,
	setTheme,
	setDisableConfirms,
	setBaseTextSize,
	addPageToHistory,
	removeLastPageFromHistory,
	setHasCheckedForOldCustomInfo,
	loadStateAppSettings
} = appStateSlice.actions;

export default appStateSlice.reducer;

// Sizes are not changeable.
export const basicSizes = {
	xs: {
		base: "sm",
		lg: "md",
		xl: "lg"
	},
	sm: {
		base: "md",
		lg: "lg",
		xl: "xl"
	},
	md: {
		base: "lg",
		lg: "xl",
		xl: "2xl"
	},
	lg: {
		base: "xl",
		lg: "2xl",
		xl: "3xl"
	},
	xl: {
		base: "2xl",
		lg: "3xl",
		xl: "4xl"
	},
	x2: {
		base: "3xl",
		lg: "4xl",
		xl: "5xl"
	}
};
export const fontSizesInPx = {
	'2xs': 10,
	xs: 12,
	sm: 14,
	md: 16,
	lg: 18,
	xl: 20,
	'2xl': 24,
	'3xl': 30,
	'4xl': 36,
	'5xl': 48,
	'6xl': 60,
	'7xl': 72
};
export const fontSizesInWs = {
	'2xs': 2.5,
	xs: 3,
	sm: 3.5,
	md: 4,
	lg: 5, // 18px is between 4 and 5
	xl: 5,
	'2xl': 6,
	'3xl': 8, // 8 is actually 32px
	'4xl': 10, // 10 is actually 40px; 9 is 36px but has no double
	'5xl': 12,
	'6xl': 16, // 16 is actually 64px
	'7xl': 20 // 20 is actually 80px
};
