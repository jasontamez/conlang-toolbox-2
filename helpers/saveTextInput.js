export const saveOnEnd = (func) => {
	// <SomeInput {...saveOnEnd(Function)} />
	// Takes an function that accepts a text argument. It will fire when editing is completed.
	// This will work correctly for web and Android, but will double-fire on iOS.
	const sendToFunc = (e) => {
		if(e.nativeEvent && e.nativeEvent.text !== undefined) {
			console.log("fired: " + e.nativeEvent.text);
			func(e.nativeEvent.text);
		}
	};
	return {
		onEndEditing: (e) => sendToFunc(e),
		onBlur: (e) => sendToFunc(e)
	};
};

export const ensureEnd = (refs = [], func) => {
	// onPress={() => ensureEnd([ref, ...], ?function)}
	// Add to a button to ensure text inputs are "saved" before continuing.
	// If a function is provided, it will be fired (no args) when complete, and its output returned.
	refs.forEach(r => {
		r.current && r.current.blur && r.current.blur();
	});
	if(func === undefined) {
		return;
	}
	return func();
};

