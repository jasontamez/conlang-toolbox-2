import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	menuToggleName: '',
	menuToggleNumber: 0
};

const setMenuToggleNameFunc = (state, action) => {
	state.menuToggleName = action.payload;
	return state;
};

const setMenuToggleNumberFunc = (state, action) => {
	state.menuToggleNumber = action.payload;
	return state;
};

const appStateSlice = createSlice({
	name: 'morphoSyntax',
	initialState,
	reducers: {
		setMenuToggleName: setMenuToggleNameFunc,
		setMenuToggleNumber: setMenuToggleNumberFunc
	}
});

export const { setMenuToggleName, setMenuToggleNumber } = appStateSlice.actions;

export default appStateSlice.reducer;
