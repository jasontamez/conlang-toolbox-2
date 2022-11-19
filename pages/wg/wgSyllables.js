import React, { useState } from "react";
import {
	Text,
	HStack,
	Box,
	ScrollView,
	VStack,
	useContrastText,
	Center,
	IconButton,
	Modal,
	Button
} from "native-base";
import { useWindowDimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, MotiView } from "moti";

import {
	CloseCircleIcon,
	EditIcon,
	EquiprobableIcon,
	SaveIcon,
	SharpDropoffIcon
} from "../../components/icons";
import { SliderWithValueDisplay, TextAreaSetting, ToggleSwitch } from "../../components/inputTags";
import {
	equalityCheck,
	setSyllableBoxDropoff,
	setMultipleSyllableTypes,
	setSyllableOverride,
	setSyllables
} from "../../store/wgSlice";
import ExtraChars from "../../components/ExtraCharsButton";
import getSizes from "../../helpers/getSizes";
import { flipFlop, fromToZero, maybeAnimate } from "../../helpers/motiAnimations";
import { fontSizesInPx } from "../../store/appStateSlice";


const WGSyllables = () => {
	const {
		syllableBoxDropoff,
		multipleSyllableTypes,
		syllableDropoffOverrides,
		singleWord,
		wordInitial,
		wordMiddle,
		wordFinal
	} = useSelector(state => state.wg, equalityCheck);
	const dispatch = useDispatch();
	const [modalOpen, setModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState("");
	const [modalSyllables, setModalSyllables] = useState("");
	const [modalPropName, setModalPropName] = useState("");
	const [modalOverrideFlag, setModalOverrideFlag] = useState(false);
	const [modalOverrideValue, setModalOverrideValue] = useState(0);
	const [modalTempInfo, setModalTempInfo] = useState("");
	const [hasNotToggled, setHasNotToggled] = useState(true);
	const primaryContrast = useContrastText('primary.500');
	const [headerSize, textSize, descSize] = getSizes("md", "sm", "xs");
	const emSize = fontSizesInPx[textSize] || fontSizesInPx.xs;
	const { width } = useWindowDimensions();
	const oneBox = [
		"singleWord"
	];
	const allBoxes = [
		"singleWord",
		"wordInitial",
		"wordMiddle",
		"wordFinal"
	];
	const SyllableBox = ({
		title,
		syllablesValue,
		propName
	}) => (
		<VStack
			py={2.5}
			px={2}
			space={2}
		>
			<HStack
				w="full"
				alignItems="flex-start"
				justifyContent="flex-start"
				space={2.5}
			>
				<VStack
					h="full"
					justifyContent="flex-start"
					alignItems="flex-end"
					flexGrow={0}
					mt={2}
				>
					<VStack
						justifyContent="flex-start"
						alignItems="flex-end"
						style={{minWidth: emSize * 8}}
					>
						{title.split(" ").map((t, i) => (
							<Text textAlign="right" fontSize={textSize} bold key={`${title}/${t}/${i}`}>{t}</Text>
						))}
					</VStack>
					{syllableDropoffOverrides[propName] !== null &&
						<Box key={`${title}-override`} bg="lighter" px={1.5} py={1} m={0.5} mt={3}>
							<Text lineHeight={descSize} fontSize={descSize} italic>{syllableDropoffOverrides[propName]}%</Text>
						</Box>
					}
				</VStack>
				<Box
					key={`${title}-Inactive`}
					bg="lighter"
					py={2}
					px={3}
					minW={32}
					style={{
						maxWidth: width
							- (emSize * 10) // label (8) + edit button (2)
							- 24 // xPadding
					}}
				>
					<Text fontSize={descSize} italic={syllablesValue === ""}>{syllablesValue || "(empty)"}</Text>
				</Box>
				<IconButton
					flexShrink={0}
					alignSelf="center"
					onPress={() => {
						setModalTitle(title);
						setModalSyllables(syllablesValue);
						setModalTempInfo(syllablesValue);
						setModalPropName(propName);
						const override = syllableDropoffOverrides[propName];
						if(override === null) {
							setModalOverrideFlag(false);
							setModalOverrideValue(syllableBoxDropoff);
						} else {
							setModalOverrideFlag(true);
							setModalOverrideValue(override);
						}
						setModalOpen(true);
					}}
					p={1}
					bg="transparent"
					icon={<EditIcon color="primary.400" size={textSize} />}
				/>
			</HStack>
		</VStack>
	);
	return (
		<VStack h="full">
			<Modal isOpen={modalOpen}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center" w="full">
							<Text flex={1} px={3} fontSize={headerSize} color={primaryContrast} textAlign="left" isTruncated>{modalTitle}</Text>
							<ExtraChars color={primaryContrast} size={textSize} buttonProps={{flexGrow: 0, flexShrink: 0}} />
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={headerSize} />}
								onPress={() => setModalOpen(false)}
								flexGrow={0}
								flexShrink={0}
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						{// The following abomination is because 1) Refs don't work, 2) State makes your cursor jump and skip in a controlled textarea
						(multipleSyllableTypes ? allBoxes : oneBox).filter(box => box === modalPropName).map(box => (
							<Box key={`${box}-editor`}>
								<TextAreaSetting
									rows={Math.max(3, modalSyllables.split(/\n/).length)}
									defaultValue={modalSyllables}
									onChangeText={(text) => setModalTempInfo(text)}
									text={null}
									boxProps={{
										w: "full",
										alignItems: "center"
									}}
									inputProps={{
										maxW: "5/6",
										minW: 32,
										fontSize: descSize
									}}
								/>
								<ToggleSwitch
									hProps={{
										space: 2.5,
										py: 2,
										justifyContent: "center",
										flexWrap: "wrap"
									}}
									vProps={{
										flexGrow: undefined,
										flexShrink: undefined,
										mr: 0
									}}
									label="Use separate dropoff rate"
									labelSize={textSize}
									switchState={modalOverrideFlag}
									switchToggle={() =>  setModalOverrideFlag(!modalOverrideFlag)}
								/>
								<AnimatePresence>
									{modalOverrideFlag &&
										<MotiView
											{...fromToZero(
												{
													opacity: 1,
													maxHeight: emSize * 6,
													scaleY: 1
												},
												500
											)}
											key="modalSlider"
										>
											<SliderWithValueDisplay
												max={50}
												beginLabel={<EquiprobableIcon color="text.50" size={descSize} />}
												endLabel={<SharpDropoffIcon color="text.50" size={descSize} />}
												value={modalOverrideValue}
												sliderProps={{
													accessibilityLabel: "Dropoff rate",
													onChangeEnd: (v) => setModalOverrideValue(v)
												}}
												Display={({value}) => (
													<Center>
														<Text fontSize={textSize}>Rate: <Text px={2.5} bg="lighter">{value}%</Text></Text>
													</Center>
												)}
												stackProps={{
													p: 2,
													mt: 3,
													space: 1,
													borderWidth: 1,
													borderColor: "primary.600",
													w: "full"
												}}
											/>
										</MotiView>
									}
								</AnimatePresence>
							</Box>
						))}
					</Modal.Body>
					<Modal.Footer>
						<Button
							colorScheme="success"
							startIcon={<SaveIcon color="success.50" size={textSize} />}
							_text={{fontSize: textSize}}
							px={2}
							py={1}
							mx={2}
							my={1.5}
							onPress={() => {
								dispatch(setSyllables({
									syllables: modalPropName,
									value: modalTempInfo
								}));
								dispatch(setSyllableOverride({
									override: modalPropName,
									value: modalOverrideFlag ? modalOverrideValue : null
								}));
								setModalOpen(false);
							}}
						>Save</Button>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<ScrollView>
				<SliderWithValueDisplay
					max={50}
					beginLabel={<EquiprobableIcon color="text.50" size={descSize} />}
					endLabel={<SharpDropoffIcon color="text.50" size={descSize} />}
					value={syllableBoxDropoff}
					sliderProps={{
						accessibilityLabel: "Dropoff rate",
						onChangeEnd: (v) => dispatch(setSyllableBoxDropoff(v))
					}}
					Display={({value}) => (
						<Box pb={1}>
							<HStack
								justifyContent="space-between"
								alignItems="flex-end"
								pb={1}
							>
								<Text bold fontSize={textSize}>Dropoff Rate</Text>
								<Text px={2.5} bg="lighter" fontSize={textSize}>{value}%</Text>
							</HStack>
							<Text fontSize={descSize}>Syllables at the top of a box tend to be picked more often than syllables at the bottom of the box. This slider controls this tendency. A rate of zero is flat, making all syllables equiprobable.</Text>
						</Box>
					)}
					stackProps={{
						borderBottomWidth: 0.5,
						borderColor: "main.700",
						py: 2.5,
						px: 2,
						bg: "main.800"
					}}
				/>
				<ToggleSwitch
					hProps={{
						px: 2,
						py: 2.5,
						borderBottomWidth: 0.5,
						borderColor: "main.700"
					}}
					label="Use multiple syllable types"
					labelSize={textSize}
					switchState={multipleSyllableTypes}
					switchToggle={() => {
						dispatch(setMultipleSyllableTypes(!multipleSyllableTypes));
						setHasNotToggled(false);
					}}
				/>
				<SyllableBox
					title={multipleSyllableTypes ? "Single-Word Syllables" : "Syllables"}
					propName="singleWord"
					syllablesValue={singleWord}
			/>
				<AnimatePresence>
					{multipleSyllableTypes &&
						<MotiView
							{...maybeAnimate(
								!hasNotToggled && multipleSyllableTypes,
								flipFlop,
								{
									translateX: -128 - (emSize * 8)
								},
								{
									opacity: 1
								},
								500
							)}
						>
							<SyllableBox
								title="Word-Initial Syllables"
								propName="wordInitial"
								syllablesValue={wordInitial}
							/>
							<SyllableBox
								title="Word-Middle Syllables"
								propName="wordMiddle"
								syllablesValue={wordMiddle}
							/>
							<SyllableBox
								title="Word-Final Syllables"
								propName="wordFinal"
								syllablesValue={wordFinal}
							/>
						</MotiView>
					}
				</AnimatePresence>
			</ScrollView>
		</VStack>
	);
};

export default WGSyllables;
