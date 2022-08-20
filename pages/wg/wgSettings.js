import {
	Text,
	HStack,
	Box,
	Switch,
	ScrollView,
	useBreakpointValue
} from "native-base";
import { useDispatch, useSelector } from "react-redux";

import debounce from '../../components/debounce';
import {
	TextSetting,
	SliderWithLabels,
	SliderWithTicksAndLabels
} from '../../components/layoutTags';
import {
	setMonosyllablesRate,
	setMaxSyllablesPerWord,
	setCharacterGroupDropoff,
	setSyllableBoxDropoff,
	setCapitalizeSentences,
	setDeclarativeSentencePre,
	setDeclarativeSentencePost,
	setInterrogativeSentencePre,
	setInterrogativeSentencePost,
	setExclamatorySentencePre,
	setExclamatorySentencePost
} from  "../../store/wgSlice";
import {
	EquiprobableIcon,
	SharpDropoffIcon
} from "../../components/icons";
import { sizes } from "../../store/appStateSlice";

const WGSettings = () => {
	const {
		monosyllablesRate,
		maxSyllablesPerWord,
		characterGroupDropoff,
		syllableBoxDropoff,
		capitalizeSentences,
		declarativeSentencePre,
		declarativeSentencePost,
		interrogativeSentencePre,
		interrogativeSentencePost,
		exclamatorySentencePre,
		exclamatorySentencePost
	} = useSelector(state => state.wg);
	const dispatch = useDispatch();
	const stackProps = {
		justifyContent: "flex-start",
		borderBottomWidth: 0.5,
		borderColor: "main.700",
		py: 2.5,
		px: 2,
		space: 1.5
	};
	const textSize = useBreakpointValue(sizes.sm);
	const SectionHeader = (props) => {
		return (
			<Box
				bg="darker"
				px={2}
				py={1}
				borderBottomWidth={0.5}
				borderColor="main.700"
			>
				<Text
					opacity={80}
					fontSize={textSize}
					letterSpacing="lg"
					color="main.600"
				>{props.children}</Text>
			</Box>
		);
	};
	const Label = ({pre, post, value}) =>
		<Text
			fontSize={textSize}
		>{pre || ""}<Text
				color="primary.500"
				px={1.5}
				bg="lighter"
			>{value}{post || ""}</Text></Text>;
	const TextField = ({text, value, setter}) => (
		<TextSetting
			text={text}
			value={value}
			onChangeText={(text) => debounce(
				() => dispatch(setter(text)),
				{ namespace: text }
			)}
			boxProps={stackProps}
		/>
	);
	return (
		<ScrollView>
			{/* TO-DO: presets/stored info buttons
				<SectionHeader>Presets and Stored Info</SectionHeader>
				Load Preset button
				Clear All Fields button
				Save/Load Custom Info button
			*/}
			<SectionHeader>Word Generation Controls</SectionHeader>
			<SliderWithLabels
				max={100}
				beginLabel="Never"
				endLabel="Always"
				value={monosyllablesRate}
				sliderProps={{
					accessibilityLabel: "Monosyllable Rate",
					onChangeEnd: (v) => dispatch(setMonosyllablesRate(v))
				}}
				Label={({value}) => <Label pre="Rate of monosyllable words: " value={value} post="%" />}
				stackProps={stackProps}
			/>
			<SliderWithTicksAndLabels
				min={2}
				max={15}
				beginLabel="2"
				endLabel="15"
				value={maxSyllablesPerWord}
				sliderProps={{
					accessibilityLabel: "Maximum Syllables per Word",
					onChangeEnd: (v) => dispatch(setMaxSyllablesPerWord(v))
				}}
				Label={({value}) => <Label pre="Maximum syllables per word: " value={value} />}
				stackProps={stackProps}
			/>
			<SliderWithLabels
				max={50}
				beginLabel={<EquiprobableIcon color="text.50" />}
				endLabel={<SharpDropoffIcon color="text.50" />}
				value={characterGroupDropoff}
				sliderProps={{
					accessibilityLabel: "Character Group dropoff",
					onChangeEnd: (v) => dispatch(setCharacterGroupDropoff(v))
				}}
				Label={({value}) => <Label pre="Character Group dropoff: " value={value} post="%" />}
				stackProps={stackProps}
			/>
			<SliderWithLabels
				max={50}
				beginLabel={<EquiprobableIcon color="text.50" />}
				endLabel={<SharpDropoffIcon color="text.50" />}
				value={syllableBoxDropoff}
				sliderProps={{
					accessibilityLabel: "Syllable box dropoff",
					onChangeEnd: (v) => dispatch(setSyllableBoxDropoff(v))
				}}
				Label={({value}) => <Label pre="Syllable box dropoff: " value={value} post="%" />}
				stackProps={stackProps}
			/>
			<SectionHeader>Pseudo-text Controls</SectionHeader>
			<HStack
				w="full"
				alignItems="center"
				{...stackProps}
				justifyContent="space-between"
			>
				<Text fontSize={textSize}>Capitalize sentences</Text>
				<Switch
					isChecked={capitalizeSentences}
					onToggle={() => dispatch(setCapitalizeSentences(!capitalizeSentences))}
				/>
			</HStack>
			<TextField
				text="Declarative sentence beginning"
				value={declarativeSentencePre}
				setter={setDeclarativeSentencePre}
			/>
			<TextField
				text="Declarative sentence ending"
				value={declarativeSentencePost}
				setter={setDeclarativeSentencePost}
			/>
			<TextField
				text="Interrogative sentence beginning"
				value={interrogativeSentencePre}
				setter={setInterrogativeSentencePre}
			/>
			<TextField
				text="Interrogative sentence ending"
				value={interrogativeSentencePost}
				setter={setInterrogativeSentencePost}
			/>
			<TextField
				text="Exclamatory sentence beginning"
				value={exclamatorySentencePre}
				setter={setExclamatorySentencePre}
			/>
			<TextField
				text="Exclamatory sentence ending"
				value={exclamatorySentencePost}
				setter={setExclamatorySentencePost}
			/>
		</ScrollView>
	);
};

export default WGSettings;
