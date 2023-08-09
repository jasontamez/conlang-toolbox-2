import { useSelector, useDispatch } from "react-redux";
import { IconButton } from 'native-base';
import { useNavigate } from "react-router-dom";

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
			icon={<CloseCircleIcon size={headerSize} color="primaryContrast" />}
			flexGrow={0}
			flexShrink={0}
			onPress={() => {
				navigate(history[0]);
				dispatch(removeLastPageFromHistory());
			}}
		/>
	);
};

export default ExtraCharactersContextMenu;
