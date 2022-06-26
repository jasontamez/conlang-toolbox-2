import * as consts from './dConsts';

// action creators
//
// AppSettings
export function changeTheme(payload) {
	return {type: consts.CHANGE_THEME, payload};
}
export function toggleDisableConfirm(payload) {
	return {type: consts.TOGGLE_DISABLE_CONFIRM, payload};
}

//
// WORDGEN
//
// Category
export function addCategoryWG(payload) {
	return {type: consts.ADD_CATEGORY_WG, payload};
}
export function startEditCategoryWG(payload) {
	return {type: consts.START_EDIT_CATEGORY_WG, payload};
}
export function cancelEditCategoryWG(payload) {
	return {type: consts.CANCEL_EDIT_CATEGORY_WG, payload};
}
export function doEditCategoryWG(payload) {
	return {type: consts.DO_EDIT_CATEGORY_WG, payload};
}
export function deleteCategoryWG(payload) {
	return {type: consts.DELETE_CATEGORY_WG, payload};
}
// Syllables
export function toggleSyllables(payload) {
	return {type: consts.TOGGLE_SYLLABLES, payload};
}
export function editSyllables(payload1, payload2) {
	return {type: consts.EDIT_SYLLABLES, payload: {key: payload1, syllables: payload2}};
}
export function setEditableSyllables(payload) {
	return {type: consts.SET_EDIT_SYLLABLES, payload};
}
export function modSyllableDropoff(payload1, payload2) {
	return {type: consts.MOD_SYLLABLE_DROPOFF, payload: {key: payload1, value: payload2}};
}
// Rewrite Rules
export function addRewriteRuleWG(payload) {
	return {type: consts.ADD_REWRITE_RULE_WG, payload};
}
export function startEditRewriteRuleWG(payload) {
	return {type: consts.START_EDIT_REWRITE_RULE_WG, payload};
}
export function cancelEditRewriteRuleWG(payload) {
	return {type: consts.CANCEL_EDIT_REWRITE_RULE_WG, payload};
}
export function doEditRewriteRuleWG(payload) {
	return {type: consts.DO_EDIT_REWRITE_RULE_WG, payload};
}
export function deleteRewriteRuleWG(payload) {
	return {type: consts.DELETE_REWRITE_RULE_WG, payload};
}
export function reorderRewriteRulesWG(payload) {
	return {type: consts.REORDER_REWRITE_RULE_WG, payload};
}
// Wordgen Settings
export function setMonoRateWG(payload) {
	return {type: consts.SET_MONO_RATE_WG, payload};
}
export function setMaxSyllablesWG(payload) {
	return {type: consts.SET_MAX_SYLLABLES_WG, payload};
}
export function setCategoryDropoffWG(payload) {
	return {type: consts.SET_CATEGORY_DROPOFF_WG, payload};
}
export function setSyllableDropoffWG(payload) {
	return {type: consts.SET_SYLLABLE_DROPOFF_WG, payload};
}
export function setOutputTypeWG(payload) {
	return {type: consts.SET_OUTPUT_WG, payload};
}
export function setSyllableBreaksWG(payload) {
	return {type: consts.SET_SYLLABLE_BREAKS_WG, payload};
}
export function setSentencesPerTextWG(payload) {
	return {type: consts.SET_NUMBER_OF_SENTENCES_WG, payload};
}
export function setCapitalizeSentencesWG(payload) {
	return {type: consts.SET_SENTENCE_CAPITALIZATION_WG, payload};
}
export function setDeclarativePreWG(payload) {
	return {type: consts.SET_DECLARATIVE_PRE_WG, payload};
}
export function setDeclarativePostWG(payload) {
	return {type: consts.SET_DECLARATIVE_POST_WG, payload};
}
export function setInterrogativePreWG(payload) {
	return {type: consts.SET_INTERROGATIVE_PRE_WG, payload};
}
export function setInterrogativePostWG(payload) {
	return {type: consts.SET_INTERROGATIVE_POST_WG, payload};
}
export function setExclamatoryPreWG(payload) {
	return {type: consts.SET_EXCLAMATORY_PRE_WG, payload};
}
export function setExclamatoryPostWG(payload) {
	return {type: consts.SET_EXCLAMATORY_POST_WG, payload};
}
export function setCapitalizeWordsWG(payload) {
	return {type: consts.SET_WORD_CAPITALIZATION_WG, payload};
}
export function setSortWordlistWG(payload) {
	return {type: consts.SET_SORT_WORDLIST_WG, payload};
}
export function setWordlistMulticolumnWG(payload) {
	return {type: consts.SET_WORDLIST_MULTICOLUMN_WG, payload};
}
export function setWordsPerWordlistWG(payload) {
	return {type: consts.SET_WORDS_PER_WORDLIST_WG, payload};
}
// Presets
export function loadPresetWG(payload) {
	return {type: consts.LOAD_PRESET_WG, payload};
}
export function clearEverything() {
	return {type: consts.CLEAR_EVERYTHING_WG, payload: null};
}
export function loadCustomInfoWG(payload) {
	return {type: consts.LOAD_CUSTOM_INFO_WG, payload};
}
//
// WORDEVOLVE
//
// Category
export function addCategoryWE(payload) {
	return {type: consts.ADD_CATEGORY_WE, payload};
}
export function startEditCategoryWE(payload) {
	return {type: consts.START_EDIT_CATEGORY_WE, payload};
}
export function cancelEditCategoryWE(payload) {
	return {type: consts.CANCEL_EDIT_CATEGORY_WE, payload};
}
export function doEditCategoryWE(payload) {
	return {type: consts.DO_EDIT_CATEGORY_WE, payload};
}
export function deleteCategoryWE(payload) {
	return {type: consts.DELETE_CATEGORY_WE, payload};
}
// Transforms
export function addTransformWE(payload) {
	return {type: consts.ADD_TRANSFORM_WE, payload};
}
export function startEditTransformWE(payload) {
	return {type: consts.START_EDIT_TRANSFORM_WE, payload};
}
export function cancelEditTransformWE(payload) {
	return {type: consts.CANCEL_EDIT_TRANSFORM_WE, payload};
}
export function doEditTransformWE(payload) {
	return {type: consts.DO_EDIT_TRANSFORM_WE, payload};
}
export function deleteTransformWE(payload) {
	return {type: consts.DELETE_TRANSFORM_WE, payload};
}
export function reorderTransformsWE(payload) {
	return {type: consts.REORDER_TRANSFORM_WE, payload};
}
// Sound Changes
export function addSoundChangeWE(payload) {
	return {type: consts.ADD_SOUND_CHANGE_WE, payload};
}
export function startEditSoundChangeWE(payload) {
	return {type: consts.START_EDIT_SOUND_CHANGE_WE, payload};
}
export function cancelEditSoundChangeWE(payload) {
	return {type: consts.CANCEL_EDIT_SOUND_CHANGE_WE, payload};
}
export function doEditSoundChangeWE(payload) {
	return {type: consts.DO_EDIT_SOUND_CHANGE_WE, payload};
}
export function deleteSoundChangeWE(payload) {
	return {type: consts.DELETE_SOUND_CHANGE_WE, payload};
}
export function reorderSoundChangesWE(payload) {
	return {type: consts.REORDER_SOUND_CHANGE_WE, payload};
}
// Input Lexicon
export function updateInputLexicon(payload) {
	return {type: consts.UPDATE_INPUT_LEXICON, payload};
}
export function loadPresetWE(payload) {
	return {type: consts.LOAD_PRESET_WE, payload};
}
// Output
export function setOutputTypeWE(payload) {
	return {type: consts.SET_OUTPUT_WE, payload};
}
export function loadCustomInfoWE(payload) {
	return {type: consts.LOAD_CUSTOM_INFO_WE, payload};
}


//
// MORPHOSYNTAX
//
export function setSyntaxState(prop, toggle) {
	return {type: consts.SET_MORPHOSYNTAX_STATE, payload: [prop, toggle]};
}
export function setMorphoSyntax(payload) {
	return {type: consts.SET_MORPHOSYNTAX, payload};
}
export function setMorphoSyntaxText(payload1, payload2) {
	return {type: consts.SET_MORPHOSYNTAX_INFO_TEXT, payload: [payload1, payload2]};
}
export function setMorphoSyntaxNum(payload1, payload2) {
	return {type: consts.SET_MORPHOSYNTAX_INFO_NUM, payload: [payload1, payload2]};
}
//SET_MORPHOSYNTAX_INFO_TEXT
export function setSyntaxBool(payload1, payload2) {
	return {type: consts.SET_MORPHOSYNTAX_BOOL, payload: [payload1, payload2]};
}
export function setSyntaxNum(payload1, payload2) {
	return {type: consts.SET_MORPHOSYNTAX_NUM, payload: [payload1, payload2]};
}
export function setSyntaxText(payload1, payload2) {
	return {type: consts.SET_MORPHOSYNTAX_TEXT, payload: [payload1, payload2]};
}


//
// LEXICON
//
export function updateLexicon(payload) {
	return {type: consts.UPDATE_LEXICON, payload};
}
export function startEditLexiconItem(payload) {
	return {type: consts.UPDATE_LEXICON_EDITING, payload};
}
export function cancelEditLexiconItem() {
	return {type: consts.UPDATE_LEXICON_EDITING, payload: undefined};
}
export function doEditLexiconItem(payload) {
	return {type: consts.DO_EDIT_LEXICON_ITEM, payload};
}
export function deleteLexiconItem(payload) {
	return {type: consts.DELETE_LEXICON_ITEM, payload};
}
export function addLexiconItem(payload) {
	return {type: consts.ADD_LEXICON_ITEM, payload};
}
export function addDeferredLexiconItems(payload) {
	return {type: consts.ADD_DEFERRED_LEXICON_ITEM, payload};
}
export function removeDeferredLexiconItem(payload) {
	return {type:consts.REMOVE_DEFERRED_LEXICON_ITEM, payload}
}
export function clearDeferredLexiconItems() {
	return {type: consts.CLEAR_DEFERRED_LEXICON_ITEMS, payload: undefined};
}
export function updateLexiconText(prop, value) {
	return {type: consts.UPDATE_LEXICON_PROP, payload: {prop, value}};
}
export function updateLexiconNumber(prop, value) {
	return {type: consts.UPDATE_LEXICON_NUM, payload: {prop, value}};
}
export function updateLexiconBool(prop, value) {
	return {type: consts.UPDATE_LEXICON_BOOL, payload: {prop, value}};
}
export function updateLexiconColumns(payload) {
	return {type: consts.UPDATE_LEXICON_COLUMNS, payload};
}
export function updateLexiconOrder(payload) {
	return {type: consts.UPDATE_LEXICON_ITEM_ORDER, payload};
}
export function updateLexiconSort(payload) {
	return {type: consts.UPDATE_LEXICON_SORT, payload};
}
export function toggleLexiconWrap() {
	return {type: consts.TOGGLE_LEXICON_WRAP};
}

//
// MODALS
//
export function openModal(payload) {
	return {type: consts.TOGGLE_MODAL, payload: {modal: payload, flag: true}};
}
export function closeModal(payload) {
	return {type: consts.TOGGLE_MODAL, payload: {modal: payload, flag: false}};
}
export function openPopover(popover, event) {
	return {type: consts.TOGGLE_MODAL, payload: {modal: popover, flag: event}};
}
export function closePopover(popover) {
	return {type: consts.TOGGLE_MODAL, payload: {modal: popover, flag: undefined}};
}
export function setLoadingPage(payload) {
	return {type: consts.SET_LOADING_PAGE, payload};
}
export function setMenuToggle(payload) {
	return {type: consts.SET_MENU_TOGGLE, payload};
}

//
// VIEWS
//
export function changeView(payload) {
	return {type: consts.CHANGE_VIEW, payload: { app: payload[0], page: payload[1] }};
}

//
// EXTRA CHARACTERS
//
export function updateExtraCharsDisplay(payload) {
	return {type: consts.UPDATE_EXTRA_CHARS_DISPLAY, payload};
}
export function updateExtraCharsFavorites(payload) {
	return {type: consts.UPDATE_EXTRA_CHARS_FAVORITE, payload};
}
export function toggleExtraCharsBoolean(payload) {
	return {type: consts.TOGGLE_EXTRA_CHARS_BOOLEAN, payload};
}
export function updateExtraCharsToBeSaved(payload) {
	return {type: consts.UPDATE_EXTRA_CHARS_TO_BE_SAVED, payload};
}

//
// WORD LISTS
//
export function updateWordListsDisplay(payload) {
	return {type: consts.UPDATE_WORD_LISTS_DISPLAY, payload};
}
export function toggleWordListsBoolean(payload) {
	return {type: consts.TOGGLE_WORD_LISTS_BOOLEAN, payload};
}

//
// TEMPORARY INFO
//
export function setTemporaryInfo(payload) {
	return {type: consts.SET_TEMPORARY_INFO, payload};
}

// Overwrite State
export function overwriteState(payload) {
	return {type: consts.OVERWRITE_STATE, payload};
}
