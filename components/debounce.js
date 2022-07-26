let bouncing = {};

const debounce = (func, args = [], amount = 250, namespace = "bouncing") => {
	if(bouncing[namespace]) {
		clearTimeout(bouncing[namespace]);
	}
	bouncing[namespace] = setTimeout(
		() => {
			delete bouncing[namespace];
			func.call(null, ...args);
		},
	amount);
}

export default debounce;
