let bouncing = null;

const debounce = (func, args, amount = 500) => {
	if(bouncing) {
		clearTimeout(bouncing);
	}
	bouncing = setTimeout(
		() => {
			bouncing = null;
			func.call(null, ...args);
		},
	amount);
}

export default debounce;
