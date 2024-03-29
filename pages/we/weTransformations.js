import {
	addTransform,
	editTransform,
	deleteTransform,
	rearrangeTransforms
} from "../../store/weSlice";
import Transformations from "../../components/Transformations";

const WETransformations = (props) => <Transformations useDirection={true} selector="we" {...{addTransform, editTransform, deleteTransform, rearrangeTransforms, ...props}} />;

export default WETransformations;
