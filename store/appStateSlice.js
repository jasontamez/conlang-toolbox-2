import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	menuToggleOpen: ''
};

const setMenuToggleOpenFunc = (state, action) => {
	state.menuToggleOpen = action.payload;
	return state;
};

const appStateSlice = createSlice({
	name: 'morphoSyntax',
	initialState,
	reducers: {
		setMenuToggleOpen: setMenuToggleOpenFunc
	}
});

export const { setMenuToggleOpen } = appStateSlice.actions;

export default appStateSlice.reducer;
