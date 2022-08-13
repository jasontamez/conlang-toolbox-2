import { Text, VStack, Pressable, HStack, Heading, Box } from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { useWindowDimensions } from "react-native";

import debounce from '../../components/debounce';
import {
	TextSetting,
	SliderWithTicks,
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
	AddCircleIcon,
	EquiprobableIcon,
	ExportIcon,
	RemoveCircleIcon,
	SaveIcon,
	SharpDropoffIcon,
	TrashIcon
} from "../../components/icons";

const WGSettings = () => {
	const {
		monosyllablesRate,   //0-100
		maxSyllablesPerWord, //2-15
		characterGroupDropoff,  //0-50
		syllableBoxDropoff,  //0-50
		capitalizeSentences,
		declarativeSentencePre,
		declarativeSentencePost,
		interrogativeSentencePre,
		interrogativeSentencePost,
		exclamatorySentencePre,
		exclamatorySentencePost
	} = useSelector(state => state.wg);
	const dispatch = useDispatch();
	const { width } = useWindowDimensions();
	const stackProps = {
		justifyContent: "flex-start",
		borderBottomWidth: 0.5,
		borderColor: "main.700",
		py: 2.5,
		px: 2,
		space: 1.5
	};
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
					fontSize="sm"
					letterSpacing={0.5}
					color="main.600"
				>{props.children}</Text>
			</Box>
		);
	};
	const Label = ({pre, post, value}) =>
		<Text
			fontSize="sm"
		>{pre || ""}<Text
				color="primary.500"
				px={1.5}
				bg="lighter"
			>{value}{post || ""}</Text></Text>;
	return (
		<VStack>
			{/*
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
				width={width}
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
				width={width}
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
				width={width}
				value={characterGroupDropoff}
				sliderProps={{
					accessibilityLabel: "Character Group dropoff",
					onChangeEnd: (v) => dispatch(setCharacterGroupDropoff(v))
				}}
				Label={({value}) => <Label pre="Character Group dropoff: " value={value} />}
				stackProps={stackProps}
			/>
			<SliderWithLabels
				max={50}
				beginLabel={<EquiprobableIcon color="text.50" />}
				endLabel={<SharpDropoffIcon color="text.50" />}
				width={width}
				value={syllableBoxDropoff}
				sliderProps={{
					accessibilityLabel: "Syllable box dropoff",
					onChangeEnd: (v) => dispatch(setSyllableBoxDropoff(v))
				}}
				Label={({value}) => <Label pre="Syllable box dropoff: " value={value} />}
				stackProps={stackProps}
			/>
			<SectionHeader>Pseudo-text Controls</SectionHeader>
			{/*
				Capitalize sentences (switch)
				Declarative sentence beginning, ending
				Interrogative sentence beginning, ending
				Exclamatory sentence beginning, ending
			*/}
		</VStack>
	);
	// Consider changing the above to mimic AppSettings
};

export default WGSettings;
