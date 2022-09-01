import { useState, useRef, useEffect } from "react";
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
	IconButton
} from "native-base";
import { useDispatch, useSelector } from "react-redux";
import ReAnimated, {
	CurvedTransition,
	FadeInUp,
	FadeOutUp
} from 'react-native-reanimated';

import {
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
	setSingleWord,
	setWordInitial,
	setWordMiddle,
	setWordFinal,
	setMultipleSyllableTypes,
	setSyllableOverride
} from "../../store/wgSlice";


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
	const [editingSingleWord, setEditingSingleWord] = useState(false);
	const [editingWordInitial, setEditingWordInitial] = useState(false);
	const [editingWordMiddle, setEditingWordMiddle] = useState(false);
	const [editingWordFinal, setEditingWordFinal] = useState(false);
	const [editingSingleWordOverride, setEditingSingleWordOverride] = useState(false);
	const [editingWordInitialOverride, setEditingWordInitialOverride] = useState(false);
	const [editingWordMiddleOverride, setEditingWordMiddleOverride] = useState(false);
	const [editingWordFinalOverride, setEditingWordFinalOverride] = useState(false);
	const [editingSingleWordOverrideValue, setEditingSingleWordOverrideValue] = useState(false);
	const [editingWordInitialOverrideValue, setEditingWordInitialOverrideValue] = useState(false);
	const [editingWordMiddleOverrideValue, setEditingWordMiddleOverrideValue] = useState(false);
	const [editingWordFinalOverrideValue, setEditingWordFinalOverrideValue] = useState(false);
	const singleRef = useRef(null);
	const initialRef = useRef(null);
	const middleRef = useRef(null);
	const finalRef = useRef(null);
	useEffect(
		() => {
			const {singleWord, wordInitial, wordMiddle, wordFinal} = syllableDropoffOverrides;
			setEditingSingleWordOverride(singleWord !== null);
			setEditingSingleWordOverrideValue(singleWord === null ? syllableBoxDropoff : singleWord);
			setEditingWordInitialOverride(wordInitial !== null);
			setEditingWordInitialOverrideValue(wordInitial === null ? syllableBoxDropoff : wordInitial);
			setEditingWordMiddleOverride(wordMiddle !== null);
			setEditingWordMiddleOverrideValue(wordMiddle === null ? syllableBoxDropoff : wordMiddle);
			setEditingWordFinalOverride(wordFinal !== null);
			setEditingWordFinalOverrideValue(wordFinal === null ? syllableBoxDropoff : wordFinal);
		},
		[syllableBoxDropoff, syllableDropoffOverrides]
	);
	const textSize = useBreakpointValue(sizes.sm);
	const descSize = useBreakpointValue(sizes.xs);
	const oneBox = [
		{
			title: "Syllables",
			inputRef: singleRef,
			syllablesValue: singleWord,
			setValue: setSingleWord,
			editingFlag: editingSingleWord,
			setFlag: setEditingSingleWord,
			overrideFlag: editingSingleWordOverride,
			setOFlag: setEditingSingleWordOverride,
			overrideValue: editingSingleWordOverrideValue,
			setOValue: setEditingSingleWordOverrideValue,
			overridePropName: "singleWord"
		}
	];
	const allBoxes = [
		{
			...oneBox[0],
			title: "Single-Word Syllables"
		},
		{
			title: "Word-Initial Syllables",
			inputRef: initialRef,
			syllablesValue: wordInitial,
			setValue: setWordInitial,
			editingFlag: editingWordInitial,
			setFlag: setEditingWordInitial,
			overrideFlag: editingWordInitialOverride,
			setOFlag: setEditingWordInitialOverride,
			overrideValue: editingWordInitialOverrideValue,
			setOValue: setEditingWordInitialOverrideValue,
			overridePropName: "wordInitial"
		},
		{
			title: "Word-Middle Syllables",
			inputRef: middleRef,
			syllablesValue: wordMiddle,
			setValue: setWordMiddle,
			editingFlag: editingWordMiddle,
			setFlag: setEditingWordMiddle,
			overrideFlag: editingWordMiddleOverride,
			setOFlag: setEditingWordMiddleOverride,
			overrideValue: editingWordMiddleOverrideValue,
			setOValue: setEditingWordMiddleOverrideValue,
			overridePropName: "wordMiddle"
		},
		{
			title: "Word-Final Syllables",
			inputRef: finalRef,
			syllablesValue: wordFinal,
			setValue: setWordFinal,
			editingFlag: editingWordFinal,
			setFlag: setEditingWordFinal,
			overrideFlag: editingWordFinalOverride,
			setOFlag: setEditingWordFinalOverride,
			overrideValue: editingWordFinalOverrideValue,
			setOValue: setEditingWordFinalOverrideValue,
			overridePropName: "wordFinal"
		}
	];
	const boxes = multipleSyllableTypes ? allBoxes : oneBox;
	const maybeDoSave = () => {
		// Are we editing? Have we edited?
		boxes.forEach(box => {
			if(box.editingFlag) {
				// Save current value to property
				dispatch(box.setValue(box.inputRef.current.value));
				// Are we overriding?
				if(box.overrideFlag) {
					// Save that, too
					dispatch(setSyllableOverride({
						override: box.overridePropName,
						value: box.overrideValue
					}));
				}
			}
		});
	};
	const SyllableBox = ({
		title,
		inputRef,
		syllablesValue,
		editingFlag,
		setFlag,
		overrideFlag,
		setOFlag,
		overrideValue,
		setOValue
	}) => (
		<ReAnimated.View
			entering={FadeInUp}
			exiting={FadeOutUp}
		>
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
						{overrideFlag && !editingFlag ?
							<Box bg="lighter" px={1.5} py={1} m={0.5} mt={3}>
								<Text lineHeight={descSize} fontSize={descSize} italic>{overrideValue}%</Text>
							</Box>
						:
							<></>
						}
					</VStack>
					<TextAreaSetting
						rows={Math.max(3, syllablesValue.split(/\n/).length)}
						value={syllablesValue}
						text={null}
						boxProps={{
							flex: 1,
							maxW: 64,
							minW: 32
						}}
						inputProps={{
							disabled: !editingFlag,
							ref: inputRef
						}}
					/>
					<IconButton
						flexShrink={0}
						alignSelf="center"
						onPress={() => {
							maybeDoSave();
							setFlag(!editingFlag);
						}}
						p={1}
						bg={editingFlag ? "success.500" : "transparent"}
						icon={
							editingFlag ?
								<SaveIcon size={textSize} color={useContrastText("success.500")}/>
							:
								<EditIcon size={textSize} color="primary.400" />
						}
					/>
				</HStack>
				{editingFlag ?
					<ReAnimated.View
						entering={FadeInUp}
						exiting={FadeOutUp}
						layout={CurvedTransition}
					>
						<HStack
							w="full"
							alignItems="center"
							justifyContent="flex-start"
							space={2.5}
							py={2}
						>
							<Text fontSize={textSize}>Use separate dropoff rate</Text>
							<Switch
								isChecked={overrideFlag}
								onToggle={() => {
									maybeDoSave();
									setOFlag(!overrideFlag);
								}}
							/>
						</HStack>
						{overrideFlag ?
							<ReAnimated.View
								entering={FadeInUp}
								exiting={FadeOutUp}
							>
								<SliderWithLabels
									max={50}
									beginLabel={<EquiprobableIcon color="text.50" />}
									endLabel={<SharpDropoffIcon color="text.50" />}
									value={overrideValue}
									sliderProps={{
										accessibilityLabel: "Dropoff rate",
										onChangeEnd: (v) => setOValue(v)
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
										borderColor: "primary.600"
									}}
								/>
							</ReAnimated.View>
						:
							<></>
						}
					</ReAnimated.View>
				:
					<></>
				}
			</VStack>
		</ReAnimated.View>
	);
	return (
		<VStack h="full">
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
							maybeDoSave();
							dispatch(setMultipleSyllableTypes(!multipleSyllableTypes));
						}}
					/>
				</HStack>
				<ReAnimated.View
					layout={CurvedTransition}
				>
					{boxes.map(box => <SyllableBox key={box.title} {...box} />)}
				</ReAnimated.View>
			</ScrollView>
		</VStack>
	);
};

export default WGSyllables;
