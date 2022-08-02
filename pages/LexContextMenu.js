import { useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Menu, Pressable, HStack, Text, Divider, Modal, VStack, Box, Slider, Button, useToast } from 'native-base';

import { DotsIcon, SaveIcon } from '../components/icons';
import { setDisableBlankSetting, setMaxColumns, consts } from "../store/lexiconSlice";
import doToast from '../components/toast';

const LexiconContextMenu = () => {
	const { sortPattern, disableBlankConfirms, maxColumns } = useSelector((state) => state.lexicon, shallowEqual);
	const { absoluteMaxColumns } = consts;
	const dispatch = useDispatch();
	const [menuOpen, setMenuOpen] = useState(false);
	const [disableBlanks, setDisableBlanks] = useState(disableBlankConfirms ? ["disable"] : []);
	const [columnsRangeOpen, setColumnsRangeOpen] = useState(false);
	const [cols, setCols] = useState(maxColumns);
	const handleBlankConfirms = (checkboxes) => {
		setDisableBlanks(checkboxes);
		dispatch(setDisableBlankSetting(checkboxes.length === 1));
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
					defaultValue={disableBlanks}
					value={disableBlanks}
					type="checkbox"
					onChange={(v) => handleBlankConfirms(v)}
				>
					<Menu.ItemOption value="disable">
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
				</Menu.OptionGroup>
				<Divider my={2} mx="auto" w="90%" bg="main.50" opacity={25} />
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
					>
						<Text color="primaryContrast" fontSize="md">Set Max Columns</Text>
					</Modal.Header>
					<Modal.CloseButton _icon={{color: "primaryContrast"}} onPress={() => setColumnsRangeOpen(false)} />
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
						m={0}
						p={0}
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
