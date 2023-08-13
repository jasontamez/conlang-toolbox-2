import { useState, useEffect } from "react";
import {
	Text,
	HStack,
	VStack,
	Modal,
} from "native-base";
import { useDispatch, useSelector } from "react-redux";

import { editInput } from "../../store/weSlice";
import {
	DropDown,
	TextAreaSetting
} from '../../components/inputTags';
import Button from "../../components/Button";
import IconButton from "../../components/IconButton";
import {
	ClearIcon,
	CloseCircleIcon,
	ImportIcon
} from "../../components/icons";
import StandardAlert from "../../components/StandardAlert";
import debounce from "../../helpers/debounce";
import getSizes from "../../helpers/getSizes";

const WEInput = () => {
	const { input } = useSelector(state => state.we);
	const { disableConfirms } = useSelector(state => state.appState);
	const { lexicon, columns } = useSelector(state => state.lexicon);
	const dispatch = useDispatch();
	const [stateInput, setStateInput] = useState("");
	const [clearDisabled, setClearDisabled] = useState(false);
	const [clearAlert, setClearAlert] = useState(false);
	const [importModalOpen, setImportModalOpen] = useState(false);
	const [column, setColumn] = useState(null);
	const [cols, setCols] = useState(null);
	const [importDisabled, setImportDisabled] = useState(false);
	const [buttonSize, textSize, inputSize] = getSizes("lg", "md", "sm");
	useEffect(() => {
		if(input && clearDisabled) {
			setClearDisabled(false);
		} else if (!input && !clearDisabled) {
			setClearDisabled(true);
		}
		setStateInput(input);
	}, [input]);
	useState(() => {
		if (lexicon.length > 0 && columns.length > 0) {
			const cc = columns.map(col => { return {...col}; });
			setCols(cc);
			importDisabled && setImportDisabled(false);
			column || setColumn(columns[0]);
		} else {
			importDisabled || setImportDisabled(true);
			column && setColumn(null);
		}
	}, [columns]);

	const maybeClearInput = () => {
		if(disableConfirms) {
			return doClearInput();
		}
		setClearAlert(true);
	};
	const doClearInput = () => {
		dispatch(editInput(""));
		setStateInput("");
	};

	const getCols = () => {
		return cols === null ? [] : cols;
	};
	const doImport = () => {
		let c = null;
		cols.some((col, i) => {
			if(col.id === column.id) {
				c = i;
				return true;
			}
			return false;
		});
		if(c === null) {
			console.log("ERROR");
		} else {
			const importing = [];
			input && importing.push(input);
			lexicon.forEach(lex => importing.push(lex.columns[c]));
			dispatch(editInput(importing.filter(i => i).join("\n")));
		}
		setImportModalOpen(false);
	};

	return (
		<VStack
			h="full"
			maxH="full"
			justifyContent="space-between"
			alignItems="center"
		>
			<StandardAlert
				alertOpen={clearAlert}
				setAlertOpen={setClearAlert}
				bodyContent="Are you sure you want to clear all the words from the input?"
				continueText="Yes, Do It"
				continueFunc={doClearInput}
				fontSize={textSize}
			/>
			<Modal isOpen={importModalOpen}>
				<Modal.Content>
					<Modal.Header bg="primary.500">
						<HStack justifyContent="flex-end" alignItems="center">
							<Text flex={1} px={3} fontSize={textSize} color="primary.50">Add Character Group</Text>
							<IconButton
								flexGrow={0}
								flexShrink={0}
								icon={<CloseCircleIcon size={textSize} />}
								onPress={() => setImportModalOpen(false)}
								scheme="primary"
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack
							alignItems="center"
							justifyContent="center"
							py={2}
							px={4}
						>
							<Text textAlign="center" fontSize={textSize}>Which Lexicon column do you want to import?</Text>
							<DropDown
								fontSize={buttonSize}
								labelFunc={() => column ? column.label : "[Empty Lexicon]"}
								onChange={(v) => setColumn(v)}
								title="Columns:"
								_title={{ fontSize: textSize, color: "primary.500" }}
								options={getCols().map((item) => {
									const {id, label} = item;
									return {
										key: id,
										value: id,
										label
									};
								})}
								buttonProps={{
									p: 2,
									py: 1,
									my: 2,
									mr: 0,
									ml: 0,
									mx: "auto"
								}}
							/>
						</VStack>
					</Modal.Body>
					<Modal.Footer>
						<HStack justifyContent="space-between" w="full" p={1} flexWrap="wrap">
							<Button
								startIcon={<CloseCircleIcon color="text.50" size={buttonSize} />}
								bg="darker"
								color="text.50"
								pressedBg="lighter"
								px={2}
								py={1}
								mx={1}
								onPress={() => setImportModalOpen(false)}
								_text={{
									fontSize: buttonSize
								}}
							>Cancel</Button>
							<Button
								startIcon={<ImportIcon size={buttonSize} />}
								px={2}
								py={1}
								onPress={doImport}
								_text={{
									fontSize: buttonSize
								}}
							>Import</Button>
						</HStack>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<TextAreaSetting
				text={null}
				value={stateInput}
				placeholder="Enter the words to evolve here, one word per line"
				onChangeText={
					(t) => {
						debounce(
							() => dispatch(editInput(t)),
							{ namespace: "WEinput "}
						);
						setStateInput(t);
					}
				}
				boxProps={{
					w: "full",
					h: "full",
					flex: 1,
					px: 4,
					py: 2
				}}
				inputProps={{
					h: "full",
					w: "full",
					fontSize: inputSize
				}}
			/>
			<HStack
				alignItems="flex-end"
				justifyContent="space-between"
				flexWrap="wrap"
				w="full"
				px={2}
				py={1}
			>
				<Button
					borderRadius="full"
					scheme="warning"
					_text={{
						fontSize: buttonSize
					}}
					isDisabled={clearDisabled}
					py={0.5}
					px={3}
					m={1}
					startIcon={<ClearIcon size={buttonSize} />}
					onPress={maybeClearInput}
				>Clear</Button>
				<Button
					borderRadius="full"
					scheme="primary"
					_text={{
						fontSize: buttonSize
					}}
					isDisabled={importDisabled}
					py={0.5}
					px={3}
					m={1}
					onPress={() => setImportModalOpen(true)}
					startIcon={<ImportIcon size={buttonSize} />}
				>Import From Lexicon</Button>
			</HStack>
		</VStack>
	);
};

export default WEInput;
