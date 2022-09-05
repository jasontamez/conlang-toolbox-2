import { useState } from "react";
import {
	Text,
	HStack,
	Box,
	ScrollView,
	useBreakpointValue,
	Button,
	useToast
} from "native-base";
import { useDispatch, useSelector } from "react-redux";

import debounce from '../../helpers/debounce';
import {
	TextSetting,
	SliderWithLabels,
	SliderWithTicksAndLabels,
	ToggleSwitch
} from '../../components/layoutTags';
import {
	clearWG,
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
import doToast from "../../helpers/toast";
import StandardAlert from "../../components/StandardAlert";

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
	const { disableConfirms } = useSelector(state => state.appState);
	const dispatch = useDispatch();
	const [clearAlertOpen, setClearAlertOpen] = useState(false);
	const toast = useToast();
	const stackProps = {
		justifyContent: "flex-start",
		borderBottomWidth: 0.5,
		borderColor: "main.700",
		py: 2.5,
		px: 2,
		space: 1.5
	};
	const textSize = useBreakpointValue(sizes.sm);
	const maybeClearEverything = () => {
		if(disableConfirms) {
			doClearEveything();
		}
		setClearAlertOpen(true);
	};
	const doClearEveything = () => {
		dispatch(clearWG());
		doToast({
			toast,
			msg: "Info has been cleared.",
			scheme: "danger",
			placement: "bottom"
		})
	};
	const maybeLoadInfo = () => {};
	const maybeSaveInfo = () => {};
	const maybeLoadPreset = () => {};
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
			defaultValue={value}
			onChangeText={(text) => debounce(
				() => dispatch(setter(text)),
				{ namespace: text }
			)}
			boxProps={stackProps}
		/>
	);
	const InfoButton = (props) => {
		return (
			<Button
				borderRadius="full"
				_text={{fontSize: textSize}}
				py={0.5}
				px={3}
				m={1}
				{...props}
			/>
		);
	};
	return (
		<ScrollView>
			<SectionHeader>Info Management</SectionHeader>
			{/* TO-DO: presets/stored info buttons
				Load Preset button
				Save/Load Custom Info button
			*/}
				<StandardAlert
					alertOpen={clearAlertOpen}
					setAlertOpen={setClearAlertOpen}
					bodyContent="This will erase every Character Group, Syllable and Transform currently loaded in the app. Are you sure you want to do this?"
					continueText="Yes, Do It"
					continueFunc={() => doClearEveything()}
				/>
				<HStack
					py={1.5}
					px={2}
					alignItems="center"
					justifyContent="center"
					alignContent="space-between"
					flexWrap="wrap"
					borderBottomWidth={0.5}
					borderColor="main.700"
				>
					<InfoButton
						colorScheme="primary"
						onPress={() => maybeLoadPreset()}
					>LOAD A PRESET</InfoButton>
					<InfoButton
						colorScheme="danger"
						onPress={() => maybeClearEverything()}
					>CLEAR ALL FIELDS</InfoButton>
					<InfoButton
						colorScheme="secondary"
						onPress={() => maybeLoadInfo()}
					>LOAD SAVED INFO</InfoButton>
					<InfoButton
						colorScheme="tertiary"
						onPress={() => maybeSaveInfo()}
					>SAVE CURRENT INFO</InfoButton>
				</HStack>
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
			<ToggleSwitch
				hProps={{...stackProps, justifyContent: "space-between"}}
				label="Capitalize sentences"
				labelSize={textSize}
				switchState={capitalizeSentences}
				switchToggle={() => dispatch(setCapitalizeSentences(!capitalizeSentences))}
			/>
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
