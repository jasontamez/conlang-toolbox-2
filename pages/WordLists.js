import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useOutletContext } from 'react-router-native';
import WL from '../helpers/wordLists';
import {
	HStack,
	Text,
	Box,
	Pressable,
	ScrollView,
	Modal,
	VStack,
	useToast,
	useContrastText
} from 'native-base';

//import uuidv4 from '../helpers/uuidv4';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import {
	toggleDisplayedList,
	togglePickAndSaveForLexicon,
	toggleSavedForLexicon,
	setSavingForLexicon,
	equalityCheck
} from '../store/wordListsSlice';
import { CloseCircleIcon, CloseIcon, SaveIcon } from "../components/icons";
import { addMultipleItemsAsColumn } from '../store/lexiconSlice';
import doToast from '../helpers/toast';
import { DropDown } from '../components/inputTags';
import getSizes from '../helpers/getSizes';

const WordLists = () => {
	const {
		centerTheDisplayedWords,
		listsDisplayed,
		pickAndSaveForLexicon,
		savingForLexicon
	} = useSelector((state) => state.wordLists, equalityCheck);
	const columns = useSelector((state) => state.lexicon.columns);
	const dispatch = useDispatch();
	const [navigate] = useOutletContext();
	const toast = useToast();
	const [headerSize, textSize, buttonTextSize] = getSizes("md", "sm", "xs");
	const [addToLexicon, setAddToLexicon] = useState([]);
	const [columnID, setColumnID] = useState(0);
	const shown = [];
	WL.words.forEach(({word, lists}) => {
		if(lists.some((list) => listsDisplayed[list])) {
			shown.push(word);
		}
	});
	const saveAllFunc = () => {
		setAddToLexicon([...shown]);
	};
	const beginSaveSome = () => {
		dispatch(togglePickAndSaveForLexicon());
		doToast({
			toast,
			override: (
				<Box
					borderRadius="sm"
					maxW={56}
					bg="tertiary.500"
					p={3}
				>
					<Text textAlign="center" fontSize={textSize} color="tertiary.50">Tap on rows to select them. Tap <Text bold>Save</Text> below to save them to the Lexicon.</Text>
				</Box>
			),
			placement: "bottom-right",
			duration: 4000
		});
	};
	const saveSomeFunc = () => {
		const keys = Object.keys(savingForLexicon);
		if(keys.length === 0) {
			return doToast({
				toast,
				msg: "You haven't selected any words to add!",
				placement: "bottom",
				scheme: "error"
			});
		}
		setAddToLexicon(keys);
	};
	const cancelSaveSome = () => {
		toast.closeAll();
		dispatch(togglePickAndSaveForLexicon());
		dispatch(setSavingForLexicon({}));
	};
	const SaveBar = () => {
		// sanity check
		if(columns.length === 0) {
			return <></>;
		}
		const SaveAll = () => (
			<Button
				scheme="secondary"
				m={1.5}
				py={1}
				px={1.5}
				startIcon={<SaveIcon size={textSize} />}
				onPress={saveAllFunc}
			>Save All to Lexicon</Button>
		);
		const SaveSome = () => (
			<Button
				scheme="tertiary"
				m={1.5}
				py={1}
				px={1.5}
				startIcon={<SaveIcon size={textSize} />}
				onPress={beginSaveSome}
			>Save Some to Lexicon</Button>
		);
		const Cancel = () => (
			<Button
				scheme="danger"
				m={1.5}
				py={1}
				px={1.5}
				startIcon={<CloseCircleIcon size={textSize} />}
				onPress={cancelSaveSome}
			>Cancel</Button>
		);
		const SaveChosen = () => (
			<Button
				scheme="tertiary"
				m={1.5}
				py={1}
				px={1.5}
				startIcon={<SaveIcon size={textSize} />}
				onPress={saveSomeFunc}
			>Save</Button>
		);
		const buttons = [];
		if(pickAndSaveForLexicon) {
			buttons.push(
				<Cancel key="cancel save" />,
				<SaveChosen key="save chosen" />
			);
		} else if(shown.length > 0) {
			buttons.push(
				<SaveAll key="save em all" />,
				<SaveSome key="save some" />
			);
		}
		return shown.length !== 0 && (
			<HStack
				borderTopColor="darker"
				borderTopWidth={1.5}
				bg="main.700"
				justifyContent={pickAndSaveForLexicon ? "flex-end" : "space-between"}
				alignItems="flex-end"
				alignContent="center"
				flexWrap="wrap"
			>
				{buttons}
			</HStack>
		);
	};
	const doAddToLexicon = () => {
		// Save # of items
		const length = String(addToLexicon.length);
		// change global state
		dispatch(addMultipleItemsAsColumn({
			words: addToLexicon,
			column: columns[columnID].id
		}));
		// close modal
		setAddToLexicon([]);
		// reset saving-for-lexicon, if needed
		if(pickAndSaveForLexicon) {
			dispatch(togglePickAndSaveForLexicon());
			dispatch(setSavingForLexicon({}));
		}
		// send toast message
		doToast({
			toast,
			override: (
				<VStack
					alignItems="center"
					borderRadius="sm"
					bg="success.500"
					maxW={56}
					p={0}
					m={0}
				>
					<IconButton
						alignSelf="flex-end"
						onPress={() => toast.closeAll()}
						variant="ghost"
						scheme="success"
						icon={<CloseIcon size={textSize} />}
						p={1}
						m={0}
					/>
					<Box
						mb={2}
						mt={0}
						p={0}
						px={3}
					>
						<Text textAlign="center" color="success.50" fontSize={textSize}>Added <Text bold>{length}</Text> words to the Lexicon.</Text>
					</Box>
					<Button
						bg="darker"
						scheme="success"
						px={2}
						py={1}
						mb={1}
						_text={{fontSize: textSize}}
						onPress={() => {
							navigate("/lex");
							toast.closeAll();
						}}
					>Go to Lexicon</Button>
				</VStack>
			),
			placement: "top",
			duration: 5000
		});
	};
	const alignment =
		centerTheDisplayedWords.length > 0 ?
			{ textAlign: "center" }
		:
			{}
	;
	const renderItem = (item, index) => {
		const background = index % 2 ? {} : {bg: "darker"};
		return (
			<Pressable
				onPress={() => {
					pickAndSaveForLexicon ?
						dispatch(toggleSavedForLexicon(item))
					:
						0
				}}
				key={item}
				bg={
					savingForLexicon[item] ?
						"secondary.500"
					:
						"transparent"
				}
			>
				<Box
					w="full"
					p={2}
					py={1}
					{...background}
				>
					<Text {...alignment} fontSize={textSize}>{item}</Text>
				</Box>
			</Pressable>
		);
	};
	const primaryContrast = useContrastText('primary.500');
	return (
		<>
			<HStack
				flexWrap="wrap"
				justifyContent="center"
				alignItems="flex-start"
				p={2}
				flexGrow={0}
				flexShrink={0}
			>
				<Box
					m={0}
					py={1}
					mr={1}
					alignSelf="flex-start"
				>
					<Text fontSize={textSize}>Display:</Text>
				</Box>
				{WL.sources.map((list) => {
					const displayProps = listsDisplayed[list] ? {
						variant: "solid",
						borderWidth: 1,
						borderColor: "primary.500"
					} : {
						opacity: 75,
						variant: "outline",
						color: "text.50"
					};
					return (
						<Button
							scheme="primary"
							key={list}
							size="xs"
							borderRadius="full"
							py={1}
							m={1}
							onPress={() => dispatch(toggleDisplayedList(list))}
							_text={{
								fontSize: buttonTextSize
							}}
							{...displayProps}
						>{list}</Button>
					);
				})}
			</HStack>
			<Box
				m={2}
				flexGrow={1}
				flexShrink={1}
				borderWidth={shown.length ? 2 : 0}
				borderColor="lighter"
			>
				<ScrollView>
					{shown.map((item, index) => renderItem(item, index))}
				</ScrollView>
			</Box>
			<SaveBar />
			<Modal isOpen={addToLexicon.length > 0} size="sm">
				<Modal.Content>
					<Modal.Header
						bg="primary.500"
						borderBottomWidth={0}
						pl={3}
					>
						<HStack
							justifyContent="space-between"
							alignItems="center"
						>
							<Text color={primaryContrast} fontSize={headerSize}>Add to Lexicon</Text>
							<IconButton
								variant="ghost"
								scheme="primary"
								icon={<CloseCircleIcon size={headerSize} />}
								onPress={() => setAddToLexicon([])}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack
							alignItems="center"
							justifyContent="flex-start"
						>
							<Text textAlign="center" mb={4} fontSize={textSize}>Choose which Lexicon column to put the words in.</Text>
							<DropDown
								placement="top right"
								fontSize={buttonTextSize}
								labelFunc={() => columns.length > 0 && columns[columnID].label}
								onChange={(v) => setColumnID(v)}
								defaultValue={0}
								title="Columns:"
								options={columns.map((item, i) => {
									const {id, label} = item;
									return {
										key: `${id}-ImportDestination`,
										value: i,
										label
									};
								})}
							/>
						</VStack>
					</Modal.Body>
					<Modal.Footer
						borderTopWidth={0}
					>
						<HStack
							justifyContent="space-between"
							w="full"
						>
							<Button
								bg="lighter"
								_text={{color: "text.50", fontSize: textSize}}
								onPress={() => setAddToLexicon([])}
								px={2}
								py={1}
								m={2}
							>Cancel</Button>
							<Button
								scheme="success"
								_text={{fontSize: textSize}}
								px={2}
								py={1}
								m={2}
								onPress={() => doAddToLexicon()}
							>Save</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</>
	);
};

export default WordLists;
