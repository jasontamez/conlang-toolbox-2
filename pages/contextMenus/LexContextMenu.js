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
	useToast,
	useContrastText,
	Input
} from 'native-base';

import {
	CloseCircleIcon,
	DotsIcon,
	SaveIcon
} from '../../components/icons';
import IconButton from '../../components/IconButton';
import Button from '../../components/Button';
import {
	setDisableBlankConfirms,
	setMaxColumns,
	setTruncate,
	setFontType,
	consts
} from "../../store/lexiconSlice";
import doToast from '../../helpers/toast';
import getSizes from '../../helpers/getSizes';

const LexiconContextMenu = () => {
	const {
		sortPattern,
		truncateColumns,
		maxColumns,
		fontType,
		disableBlankConfirms
	} = useSelector((state) => state.lexicon, shallowEqual);
	const { absoluteMaxColumns, fontsMap } = consts;
	const dispatch = useDispatch();
	const toast = useToast();
	const primaryContrast = useContrastText('primary.500');
	const [textSize, smallerSize] = getSizes("md", "sm");
	const [menuOpen, setMenuOpen] = useState(false);
	const [checkboxOptions, setCheckboxOptions] = useState([]);
	const [columnsRangeOpen, setColumnsRangeOpen] = useState(false);

	const [cols, setCols] = useState(maxColumns);
	const [errMsg, setErrMsg] = useState(false);
	const minimum = sortPattern.length || 1;
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
						icon={<DotsIcon size={smallerSize} color="text.50" />}
						variant="ghost"
						{...triggerProps}
					/>
				)}
				onOpen={() => setMenuOpen(true)}
				onPress={() => setMenuOpen(true)}
				onClose={() => doMenuClose()}
				isOpen={menuOpen}
			>
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
				<Menu.OptionGroup
					title="Display Font"
					_title={{ fontSize: smallerSize }}
					defaultValue={fontType}
					type="radio"
					onChange={(v) => dispatch(setFontType(v))}
				>
					{fontsMap.map(([label, value]) => <Menu.ItemOption key={label} value={value}>{label}</Menu.ItemOption>)}
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
								icon={<CloseCircleIcon size={textSize} />}
								onPress={() => setColumnsRangeOpen(false)}
								variant="ghost"
								scheme="primary"
								px={0}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack alignItems="center" justifyContent="center" space={2} pb={2} px={2}>
							<Text
								textAlign="right"
								flexShrink={1}
								flexGrow={0}
								color="text.50"
								fontSize={textSize}
							>Choose a number between {minimum} and {absoluteMaxColumns}:</Text>
							<Input
								defaultValue={String(maxColumns)}
								onChangeText={(v) => setCols(Number(v))}
								size={textSize}
								flexShrink={0}
								flexGrow={0}
								width={16}
								_input={{textAlign: "center", p: 0, m: 0}}
								p={0}
							/>
							{errMsg && <Text color="danger.500" bold textAlign="center">{errMsg}</Text>}
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
								bg="darker"
								_pressed={{bg: "lighter"}}
								_text={{color: "text.50", fontSize: textSize}}
								p={1}
								m={2}
								onPress={() => setColumnsRangeOpen(false)}
							>Cancel</Button>
							<Button
								startIcon={<SaveIcon m={0} size={textSize} />}
								scheme="success"
								_text={{fontSize: textSize}}
								p={1}
								m={2}
								onPress={() => {
									if(cols < minimum || cols > absoluteMaxColumns || parseInt(cols) !== cols) {
										setErrMsg(`Please use a whole number between ${minimum} and ${absoluteMaxColumns}`);
									} else {
										setColumnsRangeOpen(false);
										newColumnsChosenFunc(cols);
										doToast({
											toast,
											fontSize: textSize,
											msg: `Saved: ${cols} columns`
										});
									}
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
