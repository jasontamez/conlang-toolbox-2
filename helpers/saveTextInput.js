// Functions for text inputs.
// 
// saveOnEnd(func) returns an object with two properties that can be used on text inputs
//
// ensureEnd can be called to trigger any/all text inputs
//
// // // NOTICE: THESE ARE NO LONGER USED. Not very useful, after all.

export const saveOnEnd = (func) => {
	// <SomeInput {...saveOnEnd(Function)} />
	// Takes a function that accepts a text argument. It will fire when editing is completed.
	// This will work correctly for web and Android, but will double-fire on iOS.
	const sendToFunc = (e) => {
		if(e.nativeEvent && e.nativeEvent.text !== undefined) {
			//console.log("fired: " + e.nativeEvent.text);
			func(e.nativeEvent.text);
		}
	};
	return {
		onEndEditing: (e) => sendToFunc(e),
		onBlur: (e) => sendToFunc(e)
	};
};

export const ensureEnd = (refs = [], func, ...args) => {
	// onPress={() => ensureEnd([ref, ...], ?function)}
	// Add to a button to ensure text inputs are "saved" before continuing.
	// If a function is provided, it will be fired (with `args`) when complete, and its output returned.
	refs.forEach(r => {
		r.current && r.current.blur && r.current.blur();
	});
	if(func === undefined) {
		return;
	}
	return func(...args);
};

