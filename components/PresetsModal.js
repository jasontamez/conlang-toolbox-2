import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Text,
	HStack,
	IconButton,
	Button,
	Modal,
	useContrastText,
	Radio,
	useToast
} from 'native-base';

import ExtraChars from './ExtraCharsButton';
import { CloseCircleIcon, LoadIcon } from './icons';
import StandardAlert from './StandardAlert';
import doToast from '../helpers/toast';
import getSizes from '../helpers/getSizes';


const PresetsModal = ({
	modalOpen,
	setModalOpen,
	triggerResets,
	presetsInfo,
	loadState,
	overwriteText
}) => {
	const { disableConfirms } = useSelector(state => state.appState);
	const [textSize, inputSize] = getSizes("sm", "xs");
	const primaryContrast = useContrastText('primary.500');
	const [presetChosen, setPresetChosen] = useState("");
	const [alertOpen, setAlertOpen] = useState(false);
	const dispatch = useDispatch();
	const toast = useToast();
	useEffect(() => {
		presetsInfo && presetsInfo.length > 0 && setPresetChosen(presetsInfo[0][0]);
	}, [presetsInfo]);
	const maybeLoadPreset = () => {
		if(disableConfirms) {
			return doLoadPreset();
		}
		setAlertOpen(true);
	};
	const doLoadPreset = () => {
		const [label, preset] = presetsInfo.find(pi => pi[0] === presetChosen);
		dispatch(loadState(preset));
		// Trigger any resets needed on the main page
		triggerResets && triggerResets();
		doToast({
			toast,
			msg: `"${label}" loaded`,
			placement: "top",
			fontSize: inputSize
		});
		setModalOpen(false);
	};
	return (
		<Modal isOpen={modalOpen} size="sm">
			<StandardAlert
				alertOpen={alertOpen}
				setAlertOpen={setAlertOpen}
				bodyContent={`Are you sure you want to load the ${presetChosen} Preset? This will overwrite ${overwriteText}.`}
				continueText="Yes"
				continueFunc={doLoadPreset}
				fontSize={textSize}
			/>
			<Modal.Content>
				<Modal.Header>
					<HStack
						pl={2}
						w="full"
						justifyContent="space-between"
						space={5}
						alignItems="center"
						bg="primary.500"
					>
						<Text
							color={primaryContrast}
							fontSize={textSize}
							bold
						>Load Preset</Text>
						<HStack justifyContent="flex-end" space={2}>
							<ExtraChars
								color={primaryContrast}
								size={textSize}
								buttonProps={{p: 1, m: 0}}
							/>
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
								p={1}
								m={0}
								variant="ghost"
								onPress={() => setModalOpen(false)}
							/>
						</HStack>
					</HStack>
				</Modal.Header>
				<Modal.Body m={0} p={0}>
					<Radio.Group
						value={presetChosen}
						onChange={(v) => setPresetChosen(v)}
						alignItems="flex-start"
						justifyContent="center"
						mx="auto"
						my={4}
						label="List of Presets"
					>
						{presetsInfo.map(preset => {
							const label = preset[0];
							return (
								<Radio
									key={`${label}-RadioButton`}
									size={textSize}
									value={label}
									_text={{fontSize: inputSize}}
									my={1}
								>{label}</Radio>
							);
						})}
					</Radio.Group>
				</Modal.Body>
				<Modal.Footer borderTopWidth={0}>
					<HStack justifyContent="space-between" w="full" flexWrap="wrap">
						<Button
							bg="darker"
							onPress={() => setModalOpen(false)}
							_text={{color: "text.50", fontSize: textSize}}
							p={1}
							m={2}
						>Cancel</Button>
						<Button
							startIcon={<LoadIcon color="tertiary.50" size={textSize} m={0} />}
							bg="tertiary.500"
							onPress={() => maybeLoadPreset()}
							_text={{color: "tertiary.50", fontSize: textSize}}
							p={1}
							m={2}
						>Load</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};

export default PresetsModal;
