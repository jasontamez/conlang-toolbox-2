import {
	useBreakpointValue,
	Text,
	HStack,
	Box,
	ScrollView,
	VStack,
	useContrastText,
	Button
} from "native-base";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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


const WGChar = () => {
	const {
		syllableBoxDropoff,
		oneTypeOnly,
		syllableDropoffOverride,
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
	const primaryContrast = useContrastText("primary.500");
	const textSize = useBreakpointValue(sizes.sm);
	const descSize = useBreakpointValue(sizes.xs);
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
				<Text>TO-DO: Use multiple syllable types</Text>
				<HStack w="full" alignItems="center" justifyContent="space-between">
					<Text alignSelf="flex-start" flexGrow={0}>Syllables</Text>
					<Text flexGrow={3}>Textarea</Text>
					<TextAreaSetting
						rows={Math.min(3, singleWord.length)}
						value={singleWord}
						text={null}
						boxProps={{
							flexGrow: 3
						}}
						inputProps={{
							disabled: !editingSingleWord
							// TO-DO: determine if this takes array values or if we need to convert
						}}
						onChangeText={
							(v) => debounce(
								() => dispatch(setSingleWord(v)),
								{
									namespace: "singleWord",
									amount: 500
								}
							)
						}
					/>
					<Button
						flexGrow={0}
						flexShrink={0}
						onPress={() => setEditingSingleWord(!editingSingleWord)}
					>TO-DO: Edit/done icons</Button>
				</HStack>
				<Text>TO-DO: add a dropoff slider here; animate it to pop in and out</Text>
			</ScrollView>
		</VStack>
	);
};

export default WGChar;
