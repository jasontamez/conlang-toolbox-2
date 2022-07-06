import { Text, HStack, IconButton } from "native-base";
import Menu from "../pages/MenuModal";
//import { openModal } from '../store/dFuncs';
import { ExtraCharactersIcon } from "./icons";


const openExtraChars = () => {
	//() => dispatch(openModal("ExtraCharacters"))
}

const ExtraChars = () => <IconButton variant="ghost" icon={<ExtraCharactersIcon color="text.50" />} onPress={() => openExtraChars()} />;

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
