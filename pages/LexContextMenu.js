import { useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Menu, Pressable, HStack, Text, Divider, Modal, VStack, Box, Slider, Button } from 'native-base';

import { DotsIcon, SaveIcon } from '../components/icons';
import { setDisableBlankSetting, setMaxColumns } from "../store/lexiconSlice";

const LexiconContextMenu = () => {
	const { disableBlankConfirms, maxColumns } = useSelector((state) => state.lexicon, shallowEqual);
	const dispatch = useDispatch();
	const [menuOpen, setMenuOpen] = useState(false);
	const [disableBlanks, setDisableBlanks] = useState(disableBlankConfirms ? ["disable"] : []);
	const [columnsRangeOpen, setColumnsRangeOpen] = useState(false);
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
	return (
		<>
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
				<Menu.OptionGroup defaultValue={disableBlanks} value={disableBlanks} type="checkbox" onChange={(v) => handleBlankConfirms(v)}>
					<Menu.ItemOption value="disable">Disable Blank Lexicon Confirmations</Menu.ItemOption>
				</Menu.OptionGroup>
				<Divider my={2} mx="auto" w="90%" bg="main.50" opacity={25} />
				<Menu.Item onPress={() => showColumnsRange()}>
					<Text>Maximum Number of Columns: {String(maxColumns)}</Text>
				</Menu.Item>
			</Menu>
			<RangeModal
				columnsRangeOpen={columnsRangeOpen}
				setColumnsRangeOpen={setColumnsRangeOpen}
				maxColumns={maxColumns}
				newColumnsChosenFunc={newColumnsChosenFunc}
			/>
		</>
	)
};

const RangeModal = ({columnsRangeOpen, setColumnsRangeOpen, maxColumns, newColumnsChosenFunc}) => {
	const [cols, setCols] = useState(maxColumns);
	return (
		<Modal isOpen={columnsRangeOpen}>
			<Modal.Content>
				<Modal.Header bg="primary.500" borderBottomWidth={0}>
					<Text color="primaryContrast" fontSize="md">Set Max Columns</Text>
				</Modal.Header>
				<Modal.CloseButton _icon={{color: "primaryContrast"}} onPress={() => setColumnsRangeOpen(false)} />
				<Modal.Body>
					<VStack>
						<Box><Text>Maximum columns: {cols}</Text></Box>
						<Slider
							size="sm"
							minValue={1}
							{/*
							//
							//
							// MINIMUM SHOULD BE SET BY THE CURRENT LEXICON
							//
							//
							*/ ...{}}
							maxValue={100}
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
				<Modal.Footer m={0} p={0} borderTopWidth={0}>
					<HStack justifyContent="space-between" w="full">
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
								// TOAST?
							}}
						>SAVE</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
}

export default LexiconContextMenu;
