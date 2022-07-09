import { Text, HStack, IconButton } from "native-base";
import Menu from "../pages/MenuModal";
//import { openModal } from '../store/dFuncs';
import { ExtraCharactersIcon } from "./icons";


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

const WordListsContextMenu = () => (
	<Menu
		placement="bottom right"
		closeOnSelect={false}
		w="full"
		trigger={(triggerProps) => (
			<Pressable m="auto" w={6} accessibilityLabel="More options menu" {...triggerProps}>
				<DotsIcon />
			</Pressable>
		)}
		onOpen={() => setMenuOpen(true)}
		onPress={() => setMenuOpen(true)}
		onClose={() => doMenuClose()}
		isOpen={menuOpen}
	>
		<Menu.OptionGroup defaultValue={centerMenuOption} value={centerMenuOption} type="checkbox" onChange={(v) => handleCenterText(v)}>
			<Menu.ItemOption value="center">Center-Justify Text</Menu.ItemOption>
		</Menu.OptionGroup>
		<Divider my={2} mx="auto" w="90%" bg="main.50" opacity={25} />
		<Menu.Item>
			<Icon as={Ionicons} name="save-outline" size="sm" m={2} ml={0} />
			<Text>Save All to Lexicon</Text>
		</Menu.Item>
		<Menu.Item>
			<Icon as={Ionicons} name="save-outline" size="sm" m={2} ml={0} />
			<Text>Choose what to save</Text>
		</Menu.Item>
		<Divider my={2} mx="auto" w="90%" bg="main.50" opacity={25} />
		<Menu.Item onPress={() => showInfo()}>
		<Icon as={Ionicons} name="help-circle-outline" size="sm" m={2} ml={0} />
			<Text>Info About the Lists</Text>
		</Menu.Item>
	</Menu>
);
const WordListsContextMenuModal = () => (
	<Modal isOpen={infoModalOpen} h="full">
		<Modal.Content w="full" maxWidth="full" minHeight="full" p={0} m={0} borderTopRadius={0}>
			<Modal.Header bg="primary.600" borderBottomWidth={0}>
				<Text color="primaryContrast" fontSize="md">About the Lists</Text>
			</Modal.Header>
			<Modal.CloseButton _icon={{color: "primaryContrast"}} onPress={() => setInfoModelOpen(false)} />
			<Modal.Body h="full" maxWidth="full" minHeight="full">
				<VStack space={4} justifyContent="space-between">
					<Text px={5} fontSize="sm">
						{'\t'}Presented here are a number of lists of English words representing basic concepts
						for the purposes of historical-comparative linguistics. These may serve as a good
						source of words to start a conlang with.
					</Text>
					<Text fontSize="md">Swadesh Lists</Text>
					<Text px={5} fontSize="sm">
						{'\t'}Originally assembled by Morris Swadesh, chosen for their universal, culturally
						independent availability in as many languages as possible. However, he relied
						more on his intuition than on a rigorous set of criteria. <Text bold>Swadesh
						100</Text> is his final list from 1971. The <Text bold>Swadesh 207</Text> is
						adapted from his original list from 1952. <Text bold>Swadesh-Yakhontov</Text> is
						a subset of the 207 assembled by Sergei Yakhontov. And the <Text bold>Swadesh-Woodward
						Sign List</Text> was assembled by James Woodward to take into account the ways
						sign languages use words and concepts.
					</Text>
					<Text fontSize="md">Dogolposky List</Text>
					<Text px={5} fontSize="sm">
						{'\t'}Compiled by Aharon Dolgopolsky in 1964, this lists the 15 lexical items that are
						the least likely to be replaced by other words as a language evolves. It was based
						on a study of 140 languages from across Eurasia.
					</Text>
					<Text fontSize="md">Leipzig-Jakarta List</Text>
					<Text px={5} fontSize="sm">
						{'\t'}Similar to the Dogolposky list, this is a list of words judged to be the most
						resistant to borrowing. Experts on 41 languages from across the world were given a
						uniform vocabulary list and asked to provide the words for each item in the language
						on which they were an expert, as well as information on how strong the evidence that
						each word was borrowed was. The 100 concepts that were found in most languages and
						were most resistant to borrowing formed the Leipzig-Jakarta list.
					</Text>
					<Text fontSize="md">ASJP List</Text>
					<Text px={5} fontSize="sm">
						{'\t'}<Text bold>Automated Similarity Judgment Program</Text> is a collaborative project
						applying computational approaches to comparative linguistics using a database of word
						lists. It uses a 40-word list to evaluate the similarity of words with the same
						meaning from different languages.
					</Text>
				</VStack>
			</Modal.Body>
			<Modal.Footer borderTopWidth={0} h={0} m={0} p={0} />
		</Modal.Content>
	</Modal>
);

export const WordListMenu = () => <><WordListsContextMenu /><WordListsContextMenuModal /></>;
