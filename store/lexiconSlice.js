import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';

const initialState = {
	key: "",
	lastSave: 0,
	title: "",
	description: "Hi, this is a description.",
	wrap: false,
	sortDir: false,
	sortPattern: [0, 1, 2],
	columns: [
		{
			id: "00",
			label: "Word",
			size: "lexMd"
		},
		{
			id: "11",
			label: "Part of Speech",
			size: "lexSm"
		},
		{
			id: "22",
			label: "Definition",
			size: "lexLg"
		}
	],
	lexicon: [
		{
			id: "0",
			columns: [
				"fleeb",
				"n",
				"a thing you know and love"
			]
		},
		{
			id: "1",
			columns: [
				"boof",
				"v",
				"vocalize in a dog way"
			]
		},
		{
			id: "2",
			columns: [
				"akorn",
				"adj",
				"damp and musty"
			]
		},
		{
			id: "10",
			columns: [
				"marr",
				"n",
				"a movie featuring a black dog and a brown cat"
			]
		},
		{
			id: "11",
			columns: [
				"treff",
				"v",
				"mispronounce words on purpose"
			]
		},
		{
			id: "12",
			columns: [
				"plo",
				"adj",
				"scary but heartwarming"
			]
		},
		{
			id: "20",
			columns: [
				"quog",
				"n",
				"a tower of cans"
			]
		},
		{
			id: "21",
			columns: [
				"ickthioraptorimino",
				"v",
				"imitating a potato"
			]
		},
		{
			id: "22",
			columns: [
				"rhyk",
				"adj",
				"juvenile and intelligent"
			]
		},
		{
			id: "30",
			columns: [
				"ulululu",
				"n",
				"a doorbell that doesn't work"
			]
		},
		{
			id: "31",
			columns: [
				"dru",
				"v",
				"mixing with broth"
			]
		},
		{
			id: "32",
			columns: [
				"fargu",
				"adj",
				"toothy"
			]
		},
		{
			id: "40",
			columns: [
				"tirg",
				"n",
				"a staircase to nowhere"
			]
		},
		{
			id: "41",
			columns: [
				"mimm",
				"v",
				"charming a snake or other reptile"
			]
		},
		{
			id: "42",
			columns: [
				"bilo",
				"adj",
				"dead for at least twenty years"
			]
		},
	],
	disableBlankConfirms: false,
	maxColumns: 10
};

const sortLexicon = (lexicon, sortPattern, sortDir) => {
	const maxCol = sortPattern.length;
	let newLexicon = [...lexicon];
	newLexicon.sort((a, b) => {
		const columnsA = a.columns;
		const columnsB = b.columns;
		let comp = 0;
		let col = 0;
		// Check each column until we find a non-equal comparison
		//   (or we run out of columns)
		do {
			const sortingCol = sortPattern[col];
			const x = columnsA[sortingCol];
			const y = columnsB[sortingCol];
			try {
				comp = x.localeCompare(y, 'en', {numeric: true, usage: 'sort'});
			} catch(error) {
				comp = 0;
				console.log(error);
			}
		} while (!comp && ++col < maxCol);
		if(col === maxCol) {
			// Use IDs to keep things consistent.
			const x = a.id;
			const y = b.id;
			// X SHOULD NEVER EQUAL Y
			comp = x > y ? 1 : -1;
		}
		if(sortDir && comp) {
			// Reverse order
			return 0 - comp;
		}
		return comp;
	});
	return newLexicon;
};


const loadNewLexiconFunc = (state, action) => {
	//
	//
	// TO-DO:
	//
	//
};
const setTitleFunc = (state, action) => {
	state.title = action.payload;
	return state;
};
const setDescFunc = (state, action) => {
	state.description = action.payload;
	return state;
};
const addLexiconItemFunc = (state, action) => {
	//addLexiconItem([columns])
	const lex = state.lexicon;
	const columns = [...action.payload];
	// Get unique ID
	let ids = {};
	lex.forEach((word) => (ids[word.id] = true));
	let id;
	do {
		id = uuidv4();
	} while(ids[id]);
	// Construct new item
	const item = {
		id,
		columns
	};
	// add it in (and sort)
	state.lexicon = sortLexicon([item, ...state.lexicon], state.sortPattern, state.sortDir);
	return state;
};
const editLexiconItemFunc = (state, action) => {
	//editLexiconItem({item})
	const editedItem = action.payload;
	const editedID = editedItem.id;
	const editedLexicon = state.lexicon.map(item => item.id === editedID ? editedItem : item);
	state.lexicon = sortLexicon(editedLexicon, state.sortPattern, state.sortDir);
	return state;
};
const deleteLexiconItemFunc = (state, action) => {
	//deleteLexiconItem("id")
	const id = action.payload;
	state.lexicon = state.lexicon.filter(item => item.id !== id);
	return state;
};
const deleteMultipleLexiconItemsFunc = (state, action) => {
	const {payload} = action;
	let tester = {};
	payload.forEach(id => tester[id] = true);
	state.lexicon = state.lexicon.filter(item => !tester[item.id]);
	return state;
};
const addLexiconColumnFunc = (state, action) => {
	const {col, toEnd, dummy} = action.payload;
	const attach = toEnd ? "push" : "unshift";
	state.columns[attach](col);
	state.lexicon = state.lexicon.map((item) => {
		item.columns[attach](dummy);
		return item;
	});
	// Adding a column should not change the sort order, since everything is getting the same new info in the same place.
	return state;
};
const deleteLexiconColumnFunc = (state, action) => {
	const toDelete = action.payload;
	const pattern = state.sortPattern;
	let lexicon = state.lexicon;
	// Delete the column.
	state.columns.splice(toDelete, 1);
	// Delete the column from the sortPattern
	state.sortPattern =
		pattern.filter(p => p !== toDelete)
		// Adjust any columns after the deleted column
		.map(p => p > toDelete ? p - 1 : p);
	// Delete the column from each lexicon item
	lexicon.forEach(item => item.columns.splice(toDelete, 1));
	// Sort the lexcicon
	state.lexicon = sortLexicon([...lexicon], pattern, state.sortDir);
	return state;
};
const modifyLexiconColumnsFunc = (state, action) => {
	// Columns have been changed
	const oldCols = [...state.columns];
	const newCols = action.payload;
	const sortPattern = [...state.sortPattern];
	const lexicon = [...state.lexicon];
	//
	//
	// Determine how the columns have changed
	//
	//
	let colStillExists = {};
	// note which old columns remain
	oldCols.forEach((oc, i) => {
		const newI = newCols.findIndex(nc => nc.id === oc.id);
		if (newI > -1) {
			colStillExists[i] = newI;
		}
	});
	let newToOld = [];
	// create a map of the new columns to their position in the old columns
	newCols.forEach(nc => {
		newToOld.push(oldCols.findIndex(oc => oc.id === nc.id))
	});
	//
	//
	// Modify sortPattern
	//
	//
	let newPattern = [];
	// Reduce old pattern to just the remaining columns, keeping the same order
	sortPattern.forEach(sp => {
		const newI = colStillExists[sp];
		if(newI !== undefined) {
			newPattern.push(newI);
		}
	});
	// Append new columns to the sort pattern
	newToOld.forEach((oldI, newI) => {
		if(oldI < 0) {
			newPattern.push(newI);
		}
	});
	//
	//
	// Modify all columns in lexicon
	//
	//
	let newLexicon = [];
	lexicon.forEach(lex => {
		const currentCols = lex.columns;
		let moddedCols = [];
		// Construct new columns using the old columns,
		//   inserting blank strings when we have a new column
		newToOld.forEach(i => {
			if(i < 0) {
				moddedCols.push("");
			} else {
				moddedCols.push(currentCols[i]);
			}
		});
		// Add new item to lexicon
		newLexicon.push({id: lex.id, columns: moddedCols});
	});
	//
	//
	// Save everything to state
	//
	//
	// TO-DO: test deleting columns
	//console.log("colStillExists:");
	//console.log({...colStillExists});
	//console.log(["newToOld", ...newToOld]);
	//console.log(["oldPattern", ...state.sortPattern]);
	//console.log(["newPattern", ...newPattern]);
	//console.log(["oldLexicon", ...state.lexicon]);
	//console.log(["newLexicon", ...newLexicon]);
	//console.log(["oldCols", ...state.columns]);
	//console.log(["newCols", ...newCols]);
	state.sortPattern = newPattern;
	// Sort lexicon before we save
	state.lexicon = sortLexicon(newLexicon, newPattern, state.sortDir);
	state.columns = newCols;
	return state;
};
const reorderLexiconColumnsFunc = (state, action) => {
	const newOrder = action.payload;
	const columns = state.columns;
	const pattern = state.sortPattern;
	state.columns = newOrder.map(o => columns[o]);
	state.sortPattern = newOrder.map(o => pattern[o]);
	state.lexicon.forEach(item => {
		const columns = item.columns;
		item.columns = newOrder.map(o => columns[o]);
	});
	return state;
};
const changeSortOrderFunc = (state, action) => {
	const { payload } = action;
	state.sortPattern = payload;
	state.lexicon = sortLexicon([...state.lexicon], payload, state.sortDir);
	return state;
};
const changeSortDirFunc = (state, action) => {
	state.sortDir = action.payload;
	// Changing the direction should just reverse everything.
	state.lexicon.reverse();
	return state;
};
const changeLexiconWrapFunc = (state, action) => {
	state.wrap = action.payload;
	return state;
};
const setDisableBlankSettingFunc = (state, action) => {
	state.disableBlankConfirms = action.payload;
	return state;
};
const setMaxColumnsFunc = (state, action) => {
	state.maxColumns = action.payload;
	return state;
};
//const setTitleFunc = (state, action) => {};
//const setTitleFunc = (state, action) => {};


const lexiconSlice = createSlice({
	name: 'lexicon',
	initialState,
	reducers: {
		loadNewLexicon: loadNewLexiconFunc,
		setTitle: setTitleFunc,
		setDesc: setDescFunc,
		addLexiconItem: addLexiconItemFunc,
		editLexiconItem: editLexiconItemFunc,
		deleteLexiconItem: deleteLexiconItemFunc,
		addLexiconColumn: addLexiconColumnFunc,
		deleteLexiconColumn: deleteLexiconColumnFunc,
		deleteMultipleLexiconItems: deleteMultipleLexiconItemsFunc,
		modifyLexiconColumns: modifyLexiconColumnsFunc,
		reorderLexiconColumns: reorderLexiconColumnsFunc,
		changeSortOrder: changeSortOrderFunc,
		changeSortDir: changeSortDirFunc,
		changeLexiconWrap: changeLexiconWrapFunc,
		setDisableBlankSetting: setDisableBlankSettingFunc,
		setMaxColumns: setMaxColumnsFunc
	}
});

export const {
	loadNewLexicon,
	setTitle,
	setDesc,
	addLexiconItem,
	editLexiconItem,
	deleteLexiconItem,
	deleteMultipleLexiconItems,
	modifyLexiconColumns,
	reorganizeLexiconItems,
	changeSortOrder,
	changeSortDir,
	changeLexiconWrap,
	setDisableBlankSetting,
	setMaxColumns
} = lexiconSlice.actions;

export default lexiconSlice.reducer;

// Constants are not changeable.
export const consts = {
	absoluteMaxColumns: 30
};

// An equality-check function
export const equalityCheck = (stateA, stateB) => {
	if (stateA === stateB) {
		return true;
	}
	// stateA
	const titleA = stateA.title;
	const descriptionA = stateA.description;
	const lexiconA = stateA.lexicon;
	const wrapA = stateA.wrap;
	const columnsA = stateA.columns;
	const sortDirA = stateA.sortDir;
	const sortPatternA = stateA.sortPattern;
	const disableBlankConfirmsA = stateA.disableBlankConfirms;
	const maxColumnsA = stateA.maxColumns;
	// stateB
	const titleB = stateB.title;
	const descriptionB = stateB.description;
	const lexiconB = stateB.lexicon;
	const wrapB = stateB.wrap;
	const columnsB = stateB.columns;
	const sortDirB = stateB.sortDir;
	const sortPatternB = stateB.sortPattern;
	const disableBlankConfirmsB = stateB.disableBlankConfirms;
	const maxColumnsB = stateB.maxColumns;
	// flags
	let lex = false;
	let col = false;
	if (
		titleA !== titleB
		|| descriptionA !== descriptionB
		|| wrapA !== wrapB
		|| sortDirA !== sortDirB
		|| disableBlankConfirmsA !== disableBlankConfirmsB
		|| maxColumnsA !== maxColumnsB
		|| String(sortPatternA) !== String(sortPatternB)
	) {
		return false;
	} else if(lexiconA === lexiconB) {
		lex = true;
	}
	if(columnsA === columnsB) {
		col = true;
	}
	if(lex && col) {
		return true;
	} else if (!col) {
		// Cols bad
		col = columnsA.every((col, i) => {
			const otherCol = columnsB[i];
			return col === otherCol ||
				(
					col.label === otherCol.label
					&& col.size === otherCol.size
				);
		});
		if(!col) {
			// if still bad, we're unequal
			return false;
		}
	}
	// Lex bad?
	return lex || lexiconA.every((lex, i) => {
		const otherLex = lexiconB[i];
		return lex === otherLex ||
			(
				lex.id === otherLex.id
				&& String(lex.columns) === String(otherLex.columns)
			);
	});
};

