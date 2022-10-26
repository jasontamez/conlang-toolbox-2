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
	IconButton,
	Pressable
} from 'native-base';

import {
	AddCircleIcon,
	CloseCircleIcon,
	DotsIcon,
	LoadIcon,
	RemoveCircleIcon,
	SaveIcon
} from '../../components/icons';
import {
	setDisableBlankConfirms,
	setMaxColumns,
	setTruncate,
	consts
} from "../../store/lexiconSlice";
import doToast from '../../helpers/toast';
import { LexiconStorage } from '../../store/persistentInfo';
import { loadState } from '../../store/lexiconSlice';
import StandardAlert from '../../components/StandardAlert';
import { LoadingOverlay } from '../../components/FullBodyModal';
import blankAppState from '../../store/blankAppState';
import { DropDownMenu } from '../../components/inputTags';

const LexiconContextMenu = () => {
	const {
		sortPattern,
		disableBlankConfirms,
		truncateColumns,
		maxColumns,
		storedCustomInfo,
		storedCustomIDs
	} = useSelector((state) => state.lexicon, shallowEqual);
	const { sizes, disableConfirms } = useSelector(state => state.appState);
	const { absoluteMaxColumns } = consts;
	const dispatch = useDispatch();
	const toast = useToast();
	const primaryContrast = useContrastText('primary.500');
	const secondaryContrast = useContrastText('secondary.500');
	const largeSize = useBreakpointValue(sizes.lg);
	const textSize = useBreakpointValue(sizes.md);
	const smallerSize = useBreakpointValue(sizes.sm);
	const [menuOpen, setMenuOpen] = useState(false);
	const [checkboxOptions, setCheckboxOptions] = useState([]);
	const [columnsRangeOpen, setColumnsRangeOpen] = useState(false);

	const [yesNoMsg, setYesNoMsg] = useState("");
	const [yesFuncArg, setYesFuncArg] = useState("");

	const [loadLexicon, setLoadLexicon] = useState(false);
	const [customLabelChosen, setCustomLabelChosen] = useState(storedCustomIDs && storedCustomIDs[0]);
	const [loadingMethod, setLoadingMethod] = useState(0);
	const [loadingOverlayOpen, setLoadingOverlayOpen] = useState(false);

	const [saveLexicon, setSaveLexicon] = useState(false);
	const [saveNewLexicon, setSaveNewLexicon] = useState(false);
	const [overwriteLexicon, setOverwriteLexicon] = useState(false);

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
	const maybeClearLexicon = () => {
		if(disableConfirms) {
			doClearLexicon();
			return;
		}
		setYesNoMsg("This will erase the Title, Description, and every item in the Lexicon. It cannot be undone. Are you sure you want to do this?");
		setYesFuncArg("clear");
	};
	const doClearLexicon = () => {
		dispatch(loadState({
			method: "overwrite",
			lexicon: blankAppState.lexicon
		}));
		doToast({
			toast,
			msg: "Lexicon cleared",
			scheme: "danger",
			placement: "top",
			fontSize: textSize
		})
	};
	// TO-DO: FINISH THIS ALL; remember LoadCustomInfo modals, etc
	const loadingMethods = [
		{
			key: "overwrite",
			desc: "Overwrite all",
			label: "Overwrite title, description, and lexicon items",
			onPress: () => setLoadingMethod(0)
		},
		{
			key: "overappend",
			desc: "Overwrite info, append items",
			label: "Overwrite title and description, keep current lexicon items and append new items",
			onPress: () => setLoadingMethod(1)
		},
		{
			key: "append",
			desc: "Append new items",
			label: "Keep current lexicon info and only append new items",
			onPress: () => setLoadingMethod(2)
		},
	];
	const maybeLoadLexicon = () => {
		// [title, lastSave, numberOfLexiconWords, columns]
		// My Lang                 Saved: 10/12/2022, 10:00:00 PM
		// [14 Words]
		// Overwrite, Append/Overwrite, Append Only
		// method: overwrite | overappend | append
		// We will need to match columns
		// columnConversion: [(integer | null)...]
		setLoadLexicon(true);
	};
	const doLoadLexicon = () => {
		// TO-DO: load info from storage
		dispatch(loadState({
			method: loadingMethods[loadingMethod].key
			// TO-DO: add lexicon prop
		}));
		// TO-DO: handle loading overlay and toast success message
	};
	// TO-DO: Need to be able to save Lexicons in order to test Loader!
	const maybeSaveLexicon = () => {
		// if there's a previous save loaded, default to overwriting that
		//   -> Overwrite "X"? yes / cancel / overwrite other save / new save
	};
	const maybeOverwriteSaveLexicon = () => {};
	const maybeSaveNewLexicon = () => {};
	const doSaveLexicon = () => {};
	const doSaveNewLexicon = () => {};
	const yesFunc = () => {
		switch(yesFuncArg) {
			case "clear":
				return doClearLexicon();
			case "load":
				return doLoadLexicon();
			case "save":
				return doSaveLexicon();
		}
		console.log("Nothing to say 'YES' to");
	};
	const displayPreviousSaves = () => {
		return storedCustomIDs.map(info => {
			const [title, lastSave, lexNumber, columns] = storedCustomInfo[info];
			const time = new Date(lastSave);
			const color = customLabelChosen === info ? primaryContrast : "text.50"
			// TO-DO: Determine if time.toLocaleString() is going to work
			//    or if we need to use Moment.js or something else
			return (
				<Pressable
					onPress={() => setCustomLabelChosen(info)}
				>
					<HStack
						justifyContent="space-between"
						alignItems="center"
						borderWidth={1}
						borderColor={customLabelChosen === info ? "primary.500" : "darker"}
						borderRadius="xs"
						bg={customLabelChosen === info ? "primary.800" : "main.800"}
					>
						<VStack
							alignItems="flex-start"
							justifyContent="center"
						>
							<Text color={color} fontSize={textSize}>{title}</Text>
							<Text color={color} fontSize={smallerSize}>[{lexNumber} words]</Text>
						</VStack>
						<Text color={color} italic fontSize={smallerSize}>Saved: {time.toLocaleString()}</Text>
					</HStack>
				</Pressable>
			);
		});
	};
	return (
		<>
			<StandardAlert
				alertOpen={!!yesNoMsg}
				setAlertOpen={setYesNoMsg}
				bodyContent={yesNoMsg}
				cancelText="No"
				continueText="Yes"
				continueFunc={yesFunc}
				fontSize={textSize}
			/>
			<StandardAlert
				alertOpen={overwriteLexicon}
				setAlertOpen={setOverwriteLexicon}
				bodyContent={"TO-DO: write this message"}
				fontSize={textSize}
				overrideButtons={
	// TO-DO: an array of elements to replace the two buttons
	//    Each button will be given a leastDestructiveRef - it should be
	//      used by only ONE of them.
	//   -> Overwrite "X"? yes / cancel / overwrite other save / new save
					[
						// cancel - leastDestructiveRef
						// new save
						// save elsewhere
						// overwrite previous save
					]
				}
			/>
			<LoadingOverlay
				overlayOpen={loadingOverlayOpen}
				colorFamily="secondary"
				contents={<Text fontSize={largeSize} color={secondaryContrast} textAlign="center">Loading "{customLabelChosen}"...</Text>}
			/>
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
					<Menu.Item onPress={() => {
						setMenuOpen(false);
						maybeClearLexicon();
					}}>
						<HStack
							space={4}
							justifyContent="flex-start"
							alignItems="center"
						>
							<RemoveCircleIcon size={smallerSize} color="text.50" px={1} />
							<Text>Clear Lexicon</Text>
						</HStack>
					</Menu.Item>
					<Menu.Item onPress={() => {
						setMenuOpen(false);
						maybeLoadLexicon();
					}}>
						<HStack
							space={4}
							justifyContent="flex-start"
							alignItems="center"
						>
							<AddCircleIcon size={smallerSize} color="text.50" px={1} />
							<Text>Load Lexicon</Text>
						</HStack>
					</Menu.Item>
					<Menu.Item onPress={() => {
						setMenuOpen(false);
						maybeSaveLexicon();
					}}>
						<HStack
							space={4}
							justifyContent="flex-start"
							alignItems="center"
						>
							<SaveIcon size={smallerSize} color="text.50" px={1} />
							<Text>Save Lexicon</Text>
						</HStack>
					</Menu.Item>
					<Menu.Item onPress={() => {
						setMenuOpen(false);
						maybeSaveNewLexicon();
					}}>
						<HStack
							space={4}
							justifyContent="flex-start"
							alignItems="center"
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
			<Modal isOpen={loadLexicon}>
				<Modal.Content>
					<Modal.Header
						bg="primary.500"
						borderBottomWidth={0}
						px={3}
					>
						<HStack w="full" justifyContent="space-between" alignItems="center" pl={1.5}>
							<Text color={primaryContrast} fontSize={textSize}>Load Lexicon</Text>
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => setLoadLexicon(false)}
								variant="ghost"
								px={0}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						{displayPreviousSaves()}
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
								onPress={() => setLoadLexicon(false)}
							>Cancel</Button>
							<DropDownMenu
								placement="top left"
								fontSize={textSize}
								menuSize={smallerSize}
								titleSize={smallerSize}
								labelFunc={() => loadingMethods[loadingMethod].desc}
								options={loadingMethods}
								title="How to Load Lexicon"
								buttonProps={{mx: 4, my: 2}}
								isMarked={(key) => loadingMethods[loadingMethod].key === key}
							/>
							<Button
								startIcon={<LoadIcon color="success.50" m={0} size={textSize} />}
								bg="success.500"
								_text={{color: "success.50", fontSize: textSize}}
								p={1}
								m={2}
								disabled={storedCustomIDs.length === 0}
								onPress={maybeLoadLexicon}
							>Load</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<Modal isOpen={saveLexicon}>
				<Modal.Content>
					<Modal.Header
						bg="primary.500"
						borderBottomWidth={0}
						px={3}
					>
						<HStack w="full" justifyContent="space-between" alignItems="center" pl={1.5}>
							<Text color={primaryContrast} fontSize={textSize}>Save Lexicon</Text>
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => setSaveLexicon(false)}
								variant="ghost"
								px={0}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						{displayPreviousSaves()}
					</Modal.Body>
					<Modal.Footer
						borderTopWidth={0}
					>
						<HStack
							justifyContent="space-between"
							w="full"
							flexWrap="wrap"
						>
							<Button
								bg="lighter"
								_text={{color: "text.50", fontSize: textSize}}
								p={1}
								m={2}
								onPress={() => setSaveLexicon(false)}
							>Cancel</Button>
							<Button
								startIcon={<SaveIcon color={primaryContrast} m={0} size={textSize} />}
								bg="primary.500"
								_text={{color: primaryContrast, fontSize: textSize}}
								p={1}
								m={2}
								onPress={() => {
									setSaveLexicon(false);
									setSaveNewLexicon(true);
								}}
							>New Save</Button>
							<Button
								startIcon={<SaveIcon color="success.50" m={0} size={textSize} />}
								bg="success.500"
								_text={{color: "success.50", fontSize: textSize}}
								p={1}
								m={2}
								disabled={storedCustomIDs.length === 0}
								onPress={maybeOverwriteSaveLexicon}
							>Overwrite Save</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<Modal isOpen={saveNewLexicon}>
				<Modal.Content>
					<Modal.Header
						bg="primary.500"
						borderBottomWidth={0}
						px={3}
					>
						<HStack w="full" justifyContent="space-between" alignItems="center" pl={1.5}>
							<Text color={primaryContrast} fontSize={textSize}>Save Lexicon</Text>
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => setSaveNewLexicon(false)}
								variant="ghost"
								px={0}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						{
							// TO-DO: TextInput
						}
					</Modal.Body>
					<Modal.Footer
						borderTopWidth={0}
					>
						<HStack
							justifyContent="space-between"
							w="full"
							flexWrap="wrap"
						>
							<Button
								bg="lighter"
								_text={{color: "text.50", fontSize: textSize}}
								p={1}
								m={2}
								onPress={() => setSaveNewLexicon(false)}
							>Cancel</Button>
							<Button
								startIcon={<SaveIcon color="success.50" m={0} size={textSize} />}
								bg="success.500"
								_text={{color: "success.50", fontSize: textSize}}
								p={1}
								m={2}
								disabled={storedCustomIDs.length === 0}
								onPress={maybeSaveNewLexicon}
							>Save</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</>
	)
};


export default LexiconContextMenu;
