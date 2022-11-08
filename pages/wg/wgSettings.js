import { useState } from "react";
import {
	Text,
	HStack,
	Box,
	ScrollView,
	Button,
	useToast
} from "native-base";
import { useDispatch, useSelector } from "react-redux";

import debounce from '../../helpers/debounce';
import {
	TextSetting,
	SliderWithValueDisplay,
	SliderWithTicksAndValueDisplay,
	ToggleSwitch
} from '../../components/inputTags';
import {
	loadState,
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
	setExclamatorySentencePost,
	setStoredCustomInfo
} from  "../../store/wgSlice";
import {
	EquiprobableIcon,
	SharpDropoffIcon
} from "../../components/icons";
import doToast from "../../helpers/toast";
import StandardAlert from "../../components/StandardAlert";
import WGPresetsModal from "./wgPresetsModal";
import LoadCustomInfoModal from "../../components/LoadCustomInfoModal";
import SaveCustomInfoModal from "../../components/SaveCustomInfoModal";
import { wgCustomStorage } from "../../helpers/persistentInfo";
import getSizes from "../../helpers/getSizes";

const WGSettings = () => {
	const {
		characterGroups,
		multipleSyllableTypes,
		syllableDropoffOverrides,
		singleWord,
		wordInitial,
		wordMiddle,
		wordFinal,
		transforms,
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
		exclamatorySentencePost,
		storedCustomInfo,
		storedCustomIDs
	} = useSelector(state => state.wg);
	const { disableConfirms } = useSelector(state => state.appState);
	const dispatch = useDispatch();
	const [clearAlertOpen, setClearAlertOpen] = useState(false);
	const [openPresetModal, setOpenPresetModal] = useState(false);
	const [openLoadCustomInfoModal, setOpenLoadCustomInfoModal] = useState(false);
	const [openSaveCustomInfoModal, setOpenSaveCustomInfoModal] = useState(false);
	const [resetCounter, setResetCounter] = useState(0); // key
	const toast = useToast();
	const stackProps = {
		justifyContent: "flex-start",
		borderBottomWidth: 0.5,
		borderColor: "main.700",
		py: 2.5,
		px: 2,
		space: 1.5
	};
	const [buttonSize, textSize, inputSize] = getSizes("md", "sm", "xs");
	const maybeClearEverything = () => {
		if(disableConfirms) {
			doClearEveything();
		}
		setClearAlertOpen(true);
	};
	const triggerResets = () => setResetCounter(resetCounter + 1);
	const doClearEveything = () => {
		dispatch(loadState(null));
		triggerResets();
		doToast({
			toast,
			msg: "Info has been cleared.",
			scheme: "danger",
			placement: "bottom"
		})
	};
	const maybeSaveInfo = () => setOpenSaveCustomInfoModal(true);
	const maybeLoadPreset = () => setOpenPresetModal(true);
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
	const Display = ({pre, post, value}) =>
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
			inputProps={{fontSize: inputSize}}
			labelProps={{fontSize: textSize}}
		/>
	);
	const InfoButton = (props) => {
		return (
			<Button
				borderRadius="full"
				_text={{
					fontSize: buttonSize
				}}
				py={0.5}
				px={3}
				m={1}
				{...props}
			/>
		);
	};
	return (
		<ScrollView>
			<StandardAlert
				alertOpen={clearAlertOpen}
				setAlertOpen={setClearAlertOpen}
				bodyContent="This will erase every Character Group, Syllable and Transform currently loaded in the app, and reset the settings on this page to their initial values. Are you sure you want to do this?"
				continueText="Yes, Do It"
				continueFunc={() => doClearEveything()}
				fontSize={textSize}
			/>
			<WGPresetsModal
				modalOpen={openPresetModal}
				setModalOpen={setOpenPresetModal}
				triggerResets={triggerResets}
				loadState={loadState}
			/>
			<LoadCustomInfoModal
				modalOpen={openLoadCustomInfoModal}
				closeModal={() => setOpenLoadCustomInfoModal(false)}
				triggerResets={triggerResets}
				customStorage={wgCustomStorage}
				loadState={loadState}
				setStoredCustomInfo={setStoredCustomInfo}
				storedCustomIDs={storedCustomIDs}
				storedCustomInfo={storedCustomInfo}
				overwriteMessage={"all current Character Groups, Syllables, Transformations, and the settings on this page"}
			/>
			<SaveCustomInfoModal
				modalOpen={openSaveCustomInfoModal}
				closeModal={() => setOpenSaveCustomInfoModal(false)}
				customStorage={wgCustomStorage}
				saveableObject={{
					characterGroups,
					multipleSyllableTypes,
					syllableDropoffOverrides,
					singleWord,
					wordInitial,
					wordMiddle,
					wordFinal,
					transforms,
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
				}}
				setStoredCustomInfo={setStoredCustomInfo}
				storedCustomInfo={storedCustomInfo}
				storedCustomIDs={storedCustomIDs}
				savedInfoString="all current Character Groups, Syllables, Transformations, and the settings on this page"
			/>
			<SectionHeader>Info Management</SectionHeader>
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
				>Load a Preset</InfoButton>
				<InfoButton
					colorScheme="danger"
					onPress={() => maybeClearEverything()}
				>Reset All Fields</InfoButton>
				<InfoButton
					colorScheme="secondary"
					onPress={() => setOpenLoadCustomInfoModal(true)}
				>Load Saved Info</InfoButton>
				<InfoButton
					colorScheme="tertiary"
					onPress={() => maybeSaveInfo()}
				>Save Current Info</InfoButton>
			</HStack>
			<SectionHeader>Word Generation Controls</SectionHeader>
			<SliderWithValueDisplay
				max={100}
				beginLabel="Never"
				endLabel="Always"
				fontSize={inputSize}
				value={monosyllablesRate}
				sliderProps={{
					accessibilityLabel: "Monosyllable Rate",
					onChangeEnd: (v) => dispatch(setMonosyllablesRate(v))
				}}
				Display={({value}) => <Display pre="Rate of monosyllable words: " value={value} post="%" />}
				stackProps={stackProps}
				reloadTrigger={resetCounter}
			/>
			<SliderWithTicksAndValueDisplay
				min={2}
				max={15}
				beginLabel="2"
				endLabel="15"
				fontSize={inputSize}
				value={maxSyllablesPerWord}
				sliderProps={{
					accessibilityLabel: "Maximum Syllables per Word",
					onChangeEnd: (v) => dispatch(setMaxSyllablesPerWord(v))
				}}
				Display={({value}) => <Display pre="Maximum syllables per word: " value={value} />}
				stackProps={stackProps}
				reloadTrigger={resetCounter}
			/>
			<SliderWithValueDisplay
				max={50}
				beginLabel={<EquiprobableIcon color="text.50" />}
				endLabel={<SharpDropoffIcon color="text.50" />}
				value={characterGroupDropoff}
				sliderProps={{
					accessibilityLabel: "Character Group dropoff",
					onChangeEnd: (v) => dispatch(setCharacterGroupDropoff(v))
				}}
				Display={({value}) => <Display pre="Character Group dropoff: " value={value} post="%" />}
				stackProps={stackProps}
				reloadTrigger={resetCounter}
			/>
			<SliderWithValueDisplay
				max={50}
				beginLabel={<EquiprobableIcon color="text.50" />}
				endLabel={<SharpDropoffIcon color="text.50" />}
				value={syllableBoxDropoff}
				sliderProps={{
					accessibilityLabel: "Syllable box dropoff",
					onChangeEnd: (v) => dispatch(setSyllableBoxDropoff(v))
				}}
				Display={({value}) => <Display pre="Syllable box dropoff: " value={value} post="%" />}
				stackProps={stackProps}
				reloadTrigger={resetCounter}
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
