import { Heading, HStack, IconButton } from "native-base";
import { Ionicons, Entypo } from '@expo/vector-icons';
import { openModal } from '../store/dFuncs';

const openMenu = () => {
	// Open modal for Menu
};
const openExtraChars = () => {
	//() => dispatch(openModal("ExtraCharacters"))
}

const Menu = <IconButton onPress={() => openMenu()} variant="ghost" icon={<Icon as={Entypo} size="md" />} />;
const ExtraChars = <IconButton variant="ghost" icon={<Icon as={Ionicons} name="globe-outline" />} onPress={() => openExtraChars()} />;

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
