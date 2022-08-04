let bouncing = {};

//const debounce = (func, {args = [], amount = 250, namespace = "bouncing"}) => {
const debounce = (func, {args, amount, namespace}) => {
	const ns = namespace || 'bouncing';
	if(bouncing[ns]) {
		clearTimeout(bouncing[ns]);
	}
	bouncing[ns] = setTimeout(
		() => {
			delete bouncing[ns];
			func.call(null, ...(args || []));
		},
	amount || 250);
}

export default debounce;
