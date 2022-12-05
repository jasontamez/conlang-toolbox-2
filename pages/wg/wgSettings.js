import { useState, useRef } from "react";
import {
	Text,
	HStack,
	Box,
	ScrollView,
	Button,
	useToast
} from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import debounce from '../../helpers/debounce';
import {
	TextSetting,
	ToggleSwitch,
	RangeSlider
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
	const triggerResets = () => setResetCounter(currentCounter => currentCounter + 1);
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
		<GestureHandlerRootView><ScrollView>
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
			<RangeSlider
				value={monosyllablesRate}
				label="Monosyllable Rate"
				minimumLabel="Never"
				maximumLabel="Always"
				max={100}
				PreElement={() => <Text fontSize={textSize} textAlign="center">Rate of monosyllable words</Text>}
				fontSize={inputSize}
				onChange={(v) => dispatch(setMonosyllablesRate(v))}
				showValue={1}
				ValueContainer={
					(props) => <Text noOfLines={1} letterSpacing="sm" isTruncated={false} lineHeight={inputSize} sub textAlign="center" fontSize={inputSize} color="secondary.50">{props.children}%</Text>
				}
				labelWidth={4}
			/>
			<RangeSlider
				value={maxSyllablesPerWord}
				label="Maximum Syllables per Word"
				minimumLabel="2"
				maximumLabel="15"
				min={2}
				max={15}
				PreElement={() => <Text fontSize={textSize} textAlign="center">Maximum syllables per word</Text>}
				fontSize={inputSize}
				onChange={(v) => dispatch(setMaxSyllablesPerWord(v))}
				ticked
				showValue={1}
				labelWidth={2}
			/>
			<RangeSlider
				max={50}
				minimumLabel={<EquiprobableIcon color="text.50" />}
				maximumLabel={<SharpDropoffIcon color="text.50" />}
				value={characterGroupDropoff}
				label="Character Group dropoff"
				fontSize={inputSize}
				PreElement={() => <Text fontSize={textSize} textAlign="center">Character Group dropoff rate</Text>}
				onChange={(v) => dispatch(setCharacterGroupDropoff(v))}
				showValue={1}
				ValueContainer={
					(props) => <Text sub textAlign="center" fontSize={inputSize} color="secondary.50">{props.children}%</Text>
				}
				labelWidth={2}
			/>
			<RangeSlider
				max={50}
				minimumLabel={<EquiprobableIcon color="text.50" />}
				maximumLabel={<SharpDropoffIcon color="text.50" />}
				value={syllableBoxDropoff}
				label="Syllable box dropoff"
				PreElement={() => <Text fontSize={textSize} textAlign="center">Syllable box dropoff rate</Text>}
				onChange={(v) => dispatch(setSyllableBoxDropoff(v))}
				fontSize={inputSize}
				showValue={1}
				ValueContainer={
					(props) => <Text sub textAlign="center" fontSize={inputSize} color="secondary.50">{props.children}%</Text>
				}
				labelWidth={2}
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
		</ScrollView></GestureHandlerRootView>
	);
};

export default WGSettings;
