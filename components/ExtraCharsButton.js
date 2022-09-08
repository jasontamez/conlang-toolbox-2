import { IconButton } from "native-base";
import { ExtraCharactersIcon } from "./icons";

const openExtraChars = () => {
	//() => dispatch(openModal("ExtraCharacters"))
}
const ExtraChars = (props) => {
	const { iconProps, buttonProps, color, size } = {iconProps: {}, buttonProps: {}, ...props};
	return (
		<IconButton
			variant="ghost"
			icon={<ExtraCharactersIcon color={color || "text.50"} size={size} {...iconProps} />}
			onPress={() => openExtraChars()}
			size={size}
			{...buttonProps}
		/>
	);
};

export default ExtraChars;