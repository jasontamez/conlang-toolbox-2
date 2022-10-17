import {
	addTransform,
	editTransform,
	deleteTransform,
	rearrangeTransforms
} from "../../store/wgSlice";
import Transformations from "../../components/Transformations";

const WGTransformations = (props) => <Transformations selector="wg" {...{addTransform, editTransform, deleteTransform, rearrangeTransforms, ...props}} />;

export default WGTransformations;
