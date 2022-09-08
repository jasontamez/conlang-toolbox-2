import { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
	Menu,
	Pressable,
	HStack,
	Text,
	Divider,
	Modal,
	VStack,
	Box,
	Slider,
	Button,
	useToast,
	useBreakpointValue,
	useContrastText
} from 'native-base';

import { DotsIcon, SaveIcon } from '../../components/icons';
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
	const [menuOpen, setMenuOpen] = useState(false);
	const [checkboxOptions, setCheckboxOptions] = useState([]);
	const [columnsRangeOpen, setColumnsRangeOpen] = useState(false);
	const [cols, setCols] = useState(maxColumns);
	useEffect(() => {
		setCheckboxOptions([
			...(truncateColumns ? ["truncateColumns"] : []),
			...(disableBlankConfirms ? ["disableBlankConfirms"] : [])
		]);
	}, [menuOpen, truncateColumns, disableBlankConfirms]);
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
	return (
		<>
			<Menu
				placement="bottom right"
				closeOnSelect={false}
				w="full"
				trigger={(triggerProps) => (
					<Pressable
						m="auto"
						w={6}
						accessibilityLabel="More options menu"
						{...triggerProps}>
						<DotsIcon />
					</Pressable>
				)}
				onOpen={() => setMenuOpen(true)}
				onPress={() => setMenuOpen(true)}
				onClose={() => doMenuClose()}
				isOpen={menuOpen}
			>
				<Menu.OptionGroup
					title="Options"
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
				<Menu.Group title="Advanced">
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
						<Text color={primaryContrast} fontSize={textSize}>Set Max Columns</Text>
					</Modal.Header>
					<Modal.CloseButton
						_icon={{color: primaryContrast}}
						onPress={() => setColumnsRangeOpen(false)}
					/>
					<Modal.Body>
						<VStack>
							<Box><Text>Maximum columns: {cols}</Text></Box>
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
								_text={{color: "text.50"}}
								p={1}
								m={2}
								onPress={() => setColumnsRangeOpen(false)}
							>CANCEL</Button>
							<Button
								startIcon={<SaveIcon color="success.50" m={0} />}
								bg="success.500"
								_text={{color: "success.50"}}
								p={1}
								m={2}
								onPress={() => {
									setColumnsRangeOpen(false);
									newColumnsChosenFunc(cols);
									doToast({
										toast,
										msg: "Saved: " + String(cols) + " columns"
									});
								}}
							>SAVE</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</>
	)
};


export default LexiconContextMenu;
