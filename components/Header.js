import { Heading, HStack, IconButton } from "native-base";
import { openModal } from '../store/dFuncs';
import { ExtraCharactersIcon, MenuIcon } from "./icons";

const openMenu = () => {
	// Open modal for Menu
};
const openExtraChars = () => {
	//() => dispatch(openModal("ExtraCharacters"))
}

const Menu = <IconButton onPress={() => openMenu()} variant="ghost" icon={<MenuIcon />} />;
const ExtraChars = <IconButton variant="ghost" icon={<ExtraCharactersIcon />} onPress={() => openExtraChars()} />;

const Header = (props) => {
	return (
		<HStack w="full">
			<Menu />
			<Heading flexGrow={1} isTruncated>{props.children}</Heading>
			<ExtraChars />
		</HStack>
	);
};

export default Header;
