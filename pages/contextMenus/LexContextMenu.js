import { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
	Menu,
	HStack,
	Text as Tx,
	Divider,
	Modal,
	VStack,
	Box,
	Slider,
	Button,
	useToast,
	useBreakpointValue,
	useContrastText,
	IconButton
} from 'native-base';

import { AddCircleIcon, CloseCircleIcon, DotsIcon, RemoveCircleIcon, SaveIcon } from '../../components/icons';
import {
	setDisableBlankConfirms,
	setMaxColumns,
	setTruncate,
	consts
} from "../../store/lexiconSlice";
import doToast from '../../helpers/toast';

const LexiconContextMenu = () => {
	const {
		sortPattern,
		disableBlankConfirms,
		truncateColumns,
		maxColumns
	} = useSelector((state) => state.lexicon, shallowEqual);
	const sizes = useSelector(state => state.appState.sizes);
	const { absoluteMaxColumns } = consts;
	const dispatch = useDispatch();
	const textSize = useBreakpointValue(sizes.md);
	const smallerSize = useBreakpointValue(sizes.sm);
	const [menuOpen, setMenuOpen] = useState(false);
	const [checkboxOptions, setCheckboxOptions] = useState([]);
	const [columnsRangeOpen, setColumnsRangeOpen] = useState(false);
	const [yesNoMsg, setYesNoMsg] = useState(false);
	const [loadLexicon, setLoadLexicon] = useState(false);
	const [saveLexicon, setSaveLexicon] = useState(false);
	const [saveNewLexicon, setSaveNewLexicon] = useState(false);
	const [cols, setCols] = useState(maxColumns);
	useEffect(() => {
		setCheckboxOptions([
			...(truncateColumns ? ["truncateColumns"] : []),
			...(disableBlankConfirms ? ["disableBlankConfirms"] : [])
		]);
	}, [menuOpen, truncateColumns, disableBlankConfirms]);
	const Text = (props) => {
		return <Tx fontSize={textSize} {...props} />;
	};
	const handleLexiconOptions = (checkboxes) => {
		let options = {};
		checkboxes.forEach(opt => options[opt] = true);
		const {disableBlankConfirms, truncateColumns} = options;
		dispatch(setDisableBlankConfirms(!!disableBlankConfirms));
		dispatch(setTruncate(!!truncateColumns));
		setCheckboxOptions(checkboxes);
	};
	const doMenuClose = () => {
		// close menu
		setMenuOpen(false);
	};
	const showColumnsRange = () => {
		doMenuClose();
		setColumnsRangeOpen(true);
	};
	const newColumnsChosenFunc = (cols) => {
		dispatch(setMaxColumns(cols));
	}
	const toast = useToast();
	const primaryContrast = useContrastText('primary.500');
	const maybeClearLexicon = () => {};
	const maybeLoadLexicon = () => {
		// [title, lastSave, numberOfLexiconWords]
		// My Lang                 Saved: 10/12/2022, 10:00:00 PM
		// [14 Words]
	};// TO-DO: FINISH THIS ALL
	const maybeSaveLexicon = () => {};
	const maybeSaveNewLexicon = () => {};
	return (
		<>
			<Menu
				placement="bottom right"
				closeOnSelect={false}
				w="full"
				trigger={(triggerProps) => (
					<IconButton
						accessibilityLabel="More options menu"
						flexGrow={0}
						flexShrink={0}
						icon={<DotsIcon size={smallerSize} />}
						{...triggerProps}
					/>
				)}
				onOpen={() => setMenuOpen(true)}
				onPress={() => setMenuOpen(true)}
				onClose={() => doMenuClose()}
				isOpen={menuOpen}
			>
				<Menu.Group
					title="Info Management"
					_title={{ fontSize: smallerSize }}
				>
					<Menu.Item onPress={maybeClearLexicon}>
						<HStack
							space={1}
							justifyContent="flex-start"
						>
							<RemoveCircleIcon size={smallerSize} color="text.50" px={1} />
							<Text>Clear Lexicon</Text>
						</HStack>
					</Menu.Item>
					<Menu.Item onPress={maybeLoadLexicon}>
						<HStack
							space={1}
							justifyContent="flex-start"
						>
							<AddCircleIcon size={smallerSize} color="text.50" px={1} />
							<Text>Load Lexicon</Text>
						</HStack>
					</Menu.Item>
					<Menu.Item onPress={maybeSaveLexicon}>
						<HStack
							space={1}
							justifyContent="flex-start"
						>
							<SaveIcon size={smallerSize} color="text.50" px={1} />
							<Text>Save Lexicon</Text>
						</HStack>
					</Menu.Item>
					<Menu.Item onPress={maybeSaveNewLexicon}>
						<HStack
							space={1}
							justifyContent="flex-start"
						>
							<SaveIcon size={smallerSize} color="text.50" px={1} />
							<Text>Save as New Lexicon</Text>
						</HStack>
					</Menu.Item>
				</Menu.Group>
				<Menu.OptionGroup
					title="Options"
					_title={{ fontSize: smallerSize }}
					defaultValue={checkboxOptions}
					type="checkbox"
					onChange={(v) => handleLexiconOptions(v)}
				>
					<Menu.ItemOption value="disableBlankConfirms">
						<HStack
							flexWrap="wrap"
							space={1}
							justifyContent="flex-end"
						>
							<Text>Disable</Text>
							<Text>Blank</Text>
							<Text>Lexicon</Text>
							<Text>Confirmations</Text>
						</HStack>
					</Menu.ItemOption>
					<Menu.ItemOption value="truncateColumns">
						<HStack
							flexWrap="wrap"
							space={1}
							justifyContent="flex-end"
						>
							<Text>Truncate</Text>
							<Text>Long</Text>
							<Text>Lines</Text>
						</HStack>
					</Menu.ItemOption>
				</Menu.OptionGroup>
				<Divider my={2} mx="auto" w="5/6" bg="main.50" opacity={25} />
				<Menu.Group
					title="Advanced"
					_title={{ fontSize: smallerSize }}
				>
					<Menu.Item onPress={() => showColumnsRange()}>
						<HStack
							w="full"
							maxW="full"
							flexWrap="wrap"
							justifyContent="flex-end"
							alignItems="center"
						>
							<Box p={2}>
								<Text>Column Maximum:</Text>
							</Box>
							<Box
								borderColor="text.50"
								borderWidth={1}
								py={1}
								px={2}
								ml={2}
							>
								<Text bold>{String(maxColumns)}</Text>
							</Box>
						</HStack>
					</Menu.Item>
				</Menu.Group>
			</Menu>
			<Modal isOpen={columnsRangeOpen}>
				<Modal.Content>
					<Modal.Header
						bg="primary.500"
						borderBottomWidth={0}
						px={3}
					>
						<HStack w="full" justifyContent="space-between" alignItems="center" pl={1.5}>
							<Text color={primaryContrast} fontSize={textSize}>Set Max Columns</Text>
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => setColumnsRangeOpen(false)}
								variant="ghost"
								px={0}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack>
							<Box><Text fontSize={textSize}>Maximum columns: {cols}</Text></Box>
							<Slider
								size="sm"
								minValue={sortPattern.length || 1 /* Set by current amount of columns. */}
								maxValue={absoluteMaxColumns}
								step={1}
								defaultValue={cols}
								accessibilityLabel={"Set the maximum number of columns per lexicon entry"}
								onChange={(v) => setCols(v)}
							>
								<Slider.Track>
									<Slider.FilledTrack />
								</Slider.Track>
								<Slider.Thumb />
							</Slider>
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
								p={1}
								m={2}
								onPress={() => setColumnsRangeOpen(false)}
							>Cancel</Button>
							<Button
								startIcon={<SaveIcon color="success.50" m={0} size={textSize} />}
								bg="success.500"
								_text={{color: "success.50", fontSize: textSize}}
								p={1}
								m={2}
								onPress={() => {
									setColumnsRangeOpen(false);
									newColumnsChosenFunc(cols);
									doToast({
										toast,
										fontSize: textSize,
										msg: "Saved: " + String(cols) + " columns"
									});
								}}
							>Save</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</>
	)
};


export default LexiconContextMenu;
