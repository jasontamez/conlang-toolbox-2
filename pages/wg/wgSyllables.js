import { useState, useRef, useEffect } from "react";
import {
	useBreakpointValue,
	Text,
	HStack,
	Box,
	ScrollView,
	VStack,
	useContrastText,
	Button,
	Switch,
	Center
} from "native-base";
import { useDispatch, useSelector } from "react-redux";
import ReAnimated, {
	CurvedTransition,
	FadeInUp,
	FadeOutUp
} from 'react-native-reanimated';

import {
	EquiprobableIcon,
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
	setOneTypeOnly,
	setSyllableOverride
} from "../../store/wgSlice";
import debounce from "../../components/debounce";


const WGSyllables = () => {
	const {
		syllableBoxDropoff,
		oneTypeOnly,
		syllableDropoffOverrides,
		singleWord,
		wordInitial,
		wordMiddle,
		wordFinal
	} = useSelector(state => state.wg, equalityCheck);
	const { disableConfirms } = useSelector(state => state.appState);
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
	const primaryContrast = useContrastText("primary.500");
	const textSize = useBreakpointValue(sizes.sm);
	const descSize = useBreakpointValue(sizes.xs);
	const boxes = [
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
	const SyllableBox = ({
		title,
		inputRef,
		syllablesValue,
		setValue,
		editingFlag,
		setFlag,
		overrideFlag,
		setOFlag,
		overrideValue,
		setOValue,
		overridePropName
	}) => {
		const maybeDoSave = () => {
			// Are we editing? Have we edited?
			if(editingFlag) {
				// Save current value to property
				dispatch(setValue(inputRef.current.value));
				// Are we overriding?
				if(overrideFlag) {
					// Save that, too
					dispatch(setSyllableOverride({
						override: overridePropName,
						value: overrideValue
					}));
				}
			}
		};
		return (
			<>
				<HStack w="full" alignItems="flex-start" justifyContent="flex-start">
					<Text flexGrow={0} mt={2}>{title /* TO-DO: Make this stuff look prettier, and add an override value if needed (VSTACK) */}</Text>
					<TextAreaSetting
						rows={Math.min(3, singleWord.length)}
						value={syllablesValue}
						text={null}
						boxProps={{
							flex: 1,
							maxW: 64
						}}
						inputProps={{
							disabled: !editingFlag,
							ref: inputRef
						}}
					/>
					<Button
						flexShrink={0}
						alignSelf="center"
						onPress={() => {
							maybeDoSave();
							setFlag(!editingFlag);
						}}
						w={6}
						mx={4}
					>TO-DO: Edit/done icons</Button>
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
							justifyContent="space-between"
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
								layout={CurvedTransition}
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
											<Text>Rate: <Text px={2.5} bg="lighter" fontSize={textSize}>{value}</Text></Text>
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
			</>
		);
	};
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
								<Text px={2.5} bg="lighter" fontSize={textSize}>{value}</Text>
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
				{boxes.map(box => <SyllableBox key={box.title} {...box} />)}
			</ScrollView>
		</VStack>
	);
};

export default WGSyllables;
