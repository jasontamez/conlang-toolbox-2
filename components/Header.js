import { Text, HStack, IconButton } from "native-base";
//import { openModal } from '../store/dFuncs';
import { ExtraCharactersIcon, MenuIcon } from "./icons";

const openMenu = () => {
	// Open modal for Menu
};
const openExtraChars = () => {
	//() => dispatch(openModal("ExtraCharacters"))
}

const Menu = () => <IconButton variant="ghost" icon={<MenuIcon />} onPress={() => openMenu()} />;
const ExtraChars = () => <IconButton variant="ghost" icon={<ExtraCharactersIcon />} onPress={() => openExtraChars()} />;

const Header = (props) => {
	const title = props.title;
	const boxProps = props.boxProps || {};
	const textProps = props.textProps || {};
	return (
		<HStack w="full" alignItems="center" bg="lighter" flexGrow={0} safeArea {...boxProps}>
			<Menu />
			<Text flexGrow={1} isTruncated fontSize="lg" textAlign="center" {...textProps}>{title}</Text>
			{props.hideExtraChars ? <></> : <ExtraChars />}
		</HStack>
	);
};

export default Header;
