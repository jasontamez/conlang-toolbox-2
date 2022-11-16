export const timing = (dur = 500) => {
	return {
		type: "timing",
		duration: dur
	};
};

// When everything is going to/from zero
export const fromToZero = (nonZeroProps, dur = 500) => {
	let from = {};
	Object.keys(nonZeroProps).forEach(prop => (from[prop] = 0));
	const exit = {...from};
	return {
		from,
		animate: nonZeroProps,
		exit,
		transition: timing(dur)
	};
};

// When you have some initial props are animated to zero while
//    other props start at zero and animate away from it
export const flipFlop = (initialProps, finalProps, dur = 500) => {
	let from = {...initialProps};
	let animate = {...finalProps};
	Object.keys(initialProps).forEach(prop => (animate[prop] = 0));
	Object.keys(finalProps).forEach(prop => (from[prop] = 0));
	const exit = {...from};
	return {
		from,
		animate,
		exit,
		transition: timing(dur)
	};
};

// For when it should only animate on entrance SOME of the time...
export const maybeAnimate = (truthy, func, ...props) => {
	const maybeFunc = func(...props);
	if(truthy) {
		return maybeFunc;
	}
	return {
		...maybeFunc,
		from: {...maybeFunc.animate}
	};
};
