import React, { useState } from "react";
import {
	useBreakpointValue,
	Text,
	HStack,
	Box,
	ScrollView,
	VStack,
	useContrastText,
	Switch,
	Center,
	IconButton,
	Modal,
	Button
} from "native-base";
import { useDispatch, useSelector } from "react-redux";
import ReAnimated, {
	FadeInUp,
	FadeOutUp
} from 'react-native-reanimated';

import {
	CloseCircleIcon,
	EditIcon,
	EquiprobableIcon,
	SaveIcon,
	SharpDropoffIcon
} from "../../components/icons";
import { SliderWithLabels, TextAreaSetting } from "../../components/layoutTags";
import { sizes } from "../../store/appStateSlice";
import {
	equalityCheck,
	setSyllableBoxDropoff,
	setMultipleSyllableTypes,
	setSyllableOverride,
	setSyllables
} from "../../store/wgSlice";
import ExtraChars from "../../components/ExtraCharsButton";


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
	const primaryContrast = useContrastText('primary.500');
	const headerSize = useBreakpointValue(sizes.md);
	const textSize = useBreakpointValue(sizes.sm);
	const descSize = useBreakpointValue(sizes.xs);
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
					{title.split(" ").map((t, i) => (
						<Text fontSize={textSize} bold key={title + t + String(i)}>{t}</Text>
					))}
					{syllableDropoffOverrides[propName] !== null ?
						<Box key={`${title}-override`} bg="lighter" px={1.5} py={1} m={0.5} mt={3}>
							<Text lineHeight={descSize} fontSize={descSize} italic>{syllableDropoffOverrides[propName]}%</Text>
						</Box>
					:
						<React.Fragment key={`${title}-noOverride`} />
					}
				</VStack>
				<Box
					key={`${title}-Inactive`}
					bg="lighter"
					py={2}
					px={3}
					minW={32}
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
					icon={<EditIcon size={textSize} color="primary.400" />}
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
							<ExtraChars color={primaryContrast} buttonProps={{size: textSize, mx: 1, flex: 0}} />
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								onPress={() => setModalOpen(false)}
								flex={0}
								mx={1}
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
										maxW: 64,
										minW: 32
									}}
								/>
								<HStack
									w="full"
									alignItems="center"
									justifyContent="center"
									space={2.5}
									py={2}
								>
									<Text fontSize={textSize}>Use separate dropoff rate</Text>
									<Switch
										isChecked={modalOverrideFlag}
										onToggle={() =>  setModalOverrideFlag(!modalOverrideFlag)}
									/>
								</HStack>
								{modalOverrideFlag ?
									<ReAnimated.View
										entering={FadeInUp}
										exiting={FadeOutUp}
										key="modalSlider"
									>
										<SliderWithLabels
											max={50}
											beginLabel={<EquiprobableIcon color="text.50" />}
											endLabel={<SharpDropoffIcon color="text.50" />}
											value={modalOverrideValue}
											sliderProps={{
												accessibilityLabel: "Dropoff rate",
												onChangeEnd: (v) => setModalOverrideValue(v)
											}}
											Label={({value}) => (
												<Center>
													<Text>Rate: <Text px={2.5} bg="lighter" fontSize={textSize}>{value}%</Text></Text>
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
									</ReAnimated.View>
								:
									<React.Fragment key="noModalSlider" />
								}
							</Box>
						))}
					</Modal.Body>
					<Modal.Footer>
						<Button
							colorScheme="success"
							startIcon={<SaveIcon size={descSize} color="success.50" />}
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
						>SAVE</Button>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<ScrollView>
				<SliderWithLabels
					max={50}
					beginLabel={<EquiprobableIcon color="text.50" />}
					endLabel={<SharpDropoffIcon color="text.50" />}
					value={syllableBoxDropoff}
					sliderProps={{
						accessibilityLabel: "Dropoff rate",
						onChangeEnd: (v) => dispatch(setSyllableBoxDropoff(v))
					}}
					Label={({value}) => (
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
				<HStack
					w="full"
					alignItems="center"
					justifyContent="space-between"
					borderBottomWidth={0.5}
					borderColor="main.700"
					py={2.5}
					px={2}
				>
					<Text fontSize={textSize}>Use multiple syllable types</Text>
					<Switch
						isChecked={multipleSyllableTypes}
						onToggle={() => {
							dispatch(setMultipleSyllableTypes(!multipleSyllableTypes));
						}}
					/>
				</HStack>
				<SyllableBox
					title={multipleSyllableTypes ? "Single-Word Syllables" : "Syllables"}
					propName="singleWord"
					syllablesValue={singleWord}
				/>
				{multipleSyllableTypes ?
					<ReAnimated.View
						entering={FadeInUp}
						exiting={FadeOutUp}
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
					</ReAnimated.View>
				:
					<></>
				}
			</ScrollView>
		</VStack>
	);
};

export default WGSyllables;
