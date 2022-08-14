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
	return (
		<ScrollView>
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
				Label={({value}) => <Label pre="Character Group dropoff: " value={value} />}
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
				Label={({value}) => <Label pre="Syllable box dropoff: " value={value} />}
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
					defaultIsChecked={capitalizeSentences}
					onValueChange={(value) => dispatch(setCapitalizeSentences(value))}
				/>
			</HStack>
			{/*
				Declarative sentence beginning, ending
				Interrogative sentence beginning, ending
				Exclamatory sentence beginning, ending
			*/}
			<TextSetting
				text="Declarative sentence beginning"
				value={declarativeSentencePre}
				onChangeText={(text) => debounce(
					() => dispatch(setDeclarativeSentencePre(text)),
					{ namespace: "declrPre" }
				)}
				boxProps={stackProps}
			/>
			<TextSetting
				text="Declarative sentence ending"
				value={declarativeSentencePost}
				onChangeText={(text) => debounce(
					() => dispatch(setDeclarativeSentencePost(text)),
					{ namespace: "declrPost" }
				)}
				boxProps={stackProps}
			/>
			<TextSetting
				text="Interrogative sentence beginning"
				value={interrogativeSentencePre}
				onChangeText={(text) => debounce(
					() => dispatch(setInterrogativeSentencePre(text)),
					{ namespace: "interrPre" }
				)}
				boxProps={stackProps}
			/>
			<TextSetting
				text="Interrogative sentence ending"
				value={interrogativeSentencePost}
				onChangeText={(text) => debounce(
					() => dispatch(setInterrogativeSentencePost(text)),
					{ namespace: "interrPost" }
				)}
				boxProps={stackProps}
			/>
			<TextSetting
				text="Exclamatory sentence beginning"
				value={exclamatorySentencePre}
				onChangeText={(text) => debounce(
					() => dispatch(setExclamatorySentencePre(text)),
					{ namespace: "exclmPre" }
				)}
				boxProps={stackProps}
			/>
			<TextSetting
				text="Exclamatory sentence ending"
				value={exclamatorySentencePost}
				onChangeText={(text) => debounce(
					() => dispatch(setExclamatorySentencePost(text)),
					{ namespace: "exclmPost" }
				)}
				boxProps={stackProps}
			/>
		</ScrollView>
	);
	// <TextSetting
	//    boxProps={props for outer Box}
	//    labelProps={props for Text}
	//    text={optional, goes into Text; if missing, uses children instead}
	//    value={Input defaultValue}
	//    placeholder={Input placeholder}
	//    onChangeText={Input onChangeText}
	//    inputProps={other props for Input} />
};

export default WGSettings;
