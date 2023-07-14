import { IconButton } from "native-base";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { ExtraCharactersIcon } from "./icons";
import { addPageToHistory } from "../store/appStateSlice";

const ExtraChars = ({
	iconProps = {},
	buttonProps = {},
	color = "text.50",
	size
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const navigator = (url) => {
		// Close this menu
		closeMenu();
		// Add to page history
		dispatch(addPageToHistory(pathname));
		// Go to page
		navigator(url);
	};
	const { pathname } = useLocation();
	return (
		<IconButton
			variant="ghost"
			icon={<ExtraCharactersIcon color={color} size={size} {...iconProps} />}
			onPress={() => {
				dispatch(addPageToHistory(pathname));
				navigate('/extrachars');
			}}
			{...buttonProps}
		/>
	);
};
// Need to add a modal to this, pass it the State vars

export default ExtraChars;