import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import IconButton from "../../components/IconButton";
import { CloseCircleIcon } from '../../components/icons';
import getSizes from "../../helpers/getSizes";
import { removeLastPageFromHistory } from "../../store/historySlice";

const ExtraCharactersContextMenu = () => {
	const { history } = useSelector(state => state.history);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [headerSize] = getSizes("md");
	return (
		<IconButton
			icon={<CloseCircleIcon size={headerSize} />}
			flexGrow={0}
			flexShrink={0}
			scheme="primary"
			onPress={() => {
				navigate(history[0]);
				dispatch(removeLastPageFromHistory());
			}}
		/>
	);
};

export default ExtraCharactersContextMenu;
