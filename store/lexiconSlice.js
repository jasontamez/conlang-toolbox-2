import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid';
import blankAppState from './blankAppState';
import { setStoredCustomInfo } from './weSlice';

const initialState = blankAppState.lexicon;

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


const loadLexiconFunc = (state, action) => {
	//
	//
	// TO-DO: add code for saving/loading lexicons
	//
	//
	const {
		method,
		lexicon: {
			id,
			lastSave, // needed?
			title,
			description,
			truncateColumns,
			sortDir,
			sortPattern,
			columns,
			lexicon
		}
	} = action.payload;
};
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
const setDescFunc = (state, action) => {
	state.description = action.payload;
	return state;
};
const allIDs = (lexicon) => {
	// Works for any array of objects with "id" props.
	let ids = {};
	lexicon.forEach((word) => (ids[word.id] = true));
	return ids;
};
const newID = (ids) => {
	// Make a unique ID given an object of other IDs
	let id;
	do {
		id = uuidv4();
	} while(ids[id]);
	return id;
};
const addLexiconItemFunc = (state, action) => {
	//addLexiconItem([columns])
	const lex = state.lexicon;
	const columns = [...action.payload];
	// Get unique ID
	let ids = allIDs(lex);
	const id = newID(ids);
	// Construct new item
	const item = {
		id,
		columns
	};
	// add it in (and sort)
	state.lexicon = sortLexicon([item, ...lex], state.sortPattern, state.sortDir);
	return state;
};
const addMultipleItemsAsColumnFunc = (state, action) => {
	//addMultipleItemsAsColumn({words: [array], column: "id"})
	const {words, column} = action.payload;
	const pre = [];
	const post = [];
	const {lexicon, columns, sortPattern, sortDir} = state;
	// Make blanks for the other columns.
	let found = false;
	columns.forEach(col => {
		if(col.id === column) {
			found = true;
		} else if (found) {
			post.push("");
		} else {
			pre.push("");
		}
	});
	// Construct objects for each word and add them in
	let ids = allIDs(lexicon);
	words.forEach(word => {
		const id = newID(ids);
		lexicon.push({id, columns: [...pre, word, ...post]});
		ids[id] = true;
	});
	// Sort the lexicon
	state.lexicon = sortLexicon(lexicon, sortPattern, sortDir);
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
	//deleteMultipleLexiconItems([items])
	const {payload} = action;
	let tester = {};
	payload.forEach(id => tester[id] = true);
	state.lexicon = state.lexicon.filter(item => !tester[item.id]);
	return state;
};
const modifyLexiconColumnsFunc = (state, action) => {
	//modifyLexiconColumns([newColumns])
	// Columns have been changed
	const newCols = action.payload;
	const oldCols = [...state.columns];
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
	state.sortPattern = newPattern;
	// Sort lexicon before we save
	state.lexicon = sortLexicon(newLexicon, newPattern, state.sortDir);
	state.columns = newCols;
	return state;
};
const changeSortOrderFunc = (state, action) => {
	//changeSortOrder([newOrder])
	const { payload } = action;
	state.sortPattern = payload;
	state.lexicon = sortLexicon([...state.lexicon], payload, state.sortDir);
	return state;
};
const toggleSortDirFunc = (state) => {
	//toggleSortDir()
	state.sortDir = !state.sortDir;
	// Changing the direction should just reverse everything.
	state.lexicon.reverse();
	return state;
};
const setTruncateFunc = (state, action) => {
	//setTruncate(boolean)
	state.truncateColumns = action.payload;
	return state;
};
const setDisableBlankConfirmsFunc = (state, action) => {
	//setDisableBlankConfirms(boolean)
	state.disableBlankConfirms = action.payload;
	return state;
};
const setMaxColumnsFunc = (state, action) => {
	//setMaxColumns(number)
	state.maxColumns = action.payload;
	return state;
};
const setStoredCustomInfoFunc = (state, action) => {
	//setStoredCustomInfo({
	//  id: [title, lastSave],
	//  ...
	//})
	const { payload } = action;
	state.storedCustomInfo = payload;
	state.storedCustomIDs = Object.keys(payload);
	return state;
};
//const setTitleFunc = (state, action) => {};


const lexiconSlice = createSlice({
	name: 'lexicon',
	initialState,
	reducers: {
		setID: setIDFunc,
		setLastSave: setLastSaveFunc,
		loadLexicon: loadLexiconFunc,
		setTitle: setTitleFunc,
		setDesc: setDescFunc,
		addLexiconItem: addLexiconItemFunc,
		addMultipleItemsAsColumn: addMultipleItemsAsColumnFunc,
		editLexiconItem: editLexiconItemFunc,
		deleteLexiconItem: deleteLexiconItemFunc,
		deleteMultipleLexiconItems: deleteMultipleLexiconItemsFunc,
		modifyLexiconColumns: modifyLexiconColumnsFunc,
		changeSortOrder: changeSortOrderFunc,
		toggleSortDir: toggleSortDirFunc,
		setTruncate: setTruncateFunc,
		setDisableBlankConfirms: setDisableBlankConfirmsFunc,
		setMaxColumns: setMaxColumnsFunc,
		setStoredCustomInfo: setStoredCustomInfoFunc
	}
});

export const {
	setID,
	setLastSave,
	loadLexicon,
	setTitle,
	setDesc,
	addLexiconItem,
	addMultipleItemsAsColumn,
	editLexiconItem,
	deleteLexiconItem,
	deleteMultipleLexiconItems,
	modifyLexiconColumns,
	reorganizeLexiconItems,
	changeSortOrder,
	toggleSortDir,
	setTruncate,
	setDisableBlankConfirms,
	setMaxColumns,
	setStoredCustomInfo
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
	const truncateColumnsA = stateA.truncateColumns;
	const columnsA = stateA.columns;
	const sortDirA = stateA.sortDir;
	const sortPatternA = stateA.sortPattern;
	const disableBlankConfirmsA = stateA.disableBlankConfirms;
	const maxColumnsA = stateA.maxColumns;
	// stateB
	const titleB = stateB.title;
	const descriptionB = stateB.description;
	const lexiconB = stateB.lexicon;
	const truncateColumnsB = stateB.truncateColumns;
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
		|| truncateColumnsA !== truncateColumnsB
		|| sortDirA !== sortDirB
		|| disableBlankConfirmsA !== disableBlankConfirmsB
		|| maxColumnsA !== maxColumnsB
		|| String(sortPatternA) !== String(sortPatternB)
	) {
		return false;
	} else if(lexiconA === lexiconB) {
		if(columnsA === columnsB) {
			return true;
		}
		lex = true;
	}
	if(columnsA === columnsB) {
		col = true;
	} else {
		// Cols bad?
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
	// Cols are good.
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

