import { useBreakpointValue } from "native-base";
import { useSelector } from "react-redux";

const getSizes = (...sizes) => {
	const sizeObject = useSelector(state => state.appState.sizes);
	const output = sizes.map(size => useBreakpointValue(sizeObject[size]));
	return output;
};

export default getSizes;
