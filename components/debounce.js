let bouncing = null;

const debounce = (func, args = [], amount = 250) => {
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
