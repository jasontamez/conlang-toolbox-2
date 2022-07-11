import { IconButton } from "native-base";
import { ExtraCharactersIcon } from "./icons";

const openExtraChars = () => {
	//() => dispatch(openModal("ExtraCharacters"))
}
const ExtraChars = () => <IconButton variant="ghost" icon={<ExtraCharactersIcon color="text.50" />} onPress={() => openExtraChars()} />;

export default ExtraChars;