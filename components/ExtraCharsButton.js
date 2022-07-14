import { IconButton } from "native-base";
import { ExtraCharactersIcon } from "./icons";

const openExtraChars = () => {
	//() => dispatch(openModal("ExtraCharacters"))
}
const ExtraChars = (props) => {
	const { iconProps, buttonProps } = {iconProps: {}, buttonProps: {}, ...props};
	return <IconButton variant="ghost" icon={<ExtraCharactersIcon color="text.50" {...iconProps} />} onPress={() => openExtraChars()} {...buttonProps} />;
};

export default ExtraChars;