import { useState, useEffect } from "react";
import {
	Text,
	HStack,
	Box,
	ScrollView,
	useBreakpointValue,
	Button,
	useToast,
	VStack,
	useContrastText
} from "native-base";
import { useDispatch, useSelector } from "react-redux";

import { editInput } from "../../store/weSlice";
import {
	TextAreaSetting
} from '../../components/inputTags';
import {
	ClearIcon,
	ImportIcon,
} from "../../components/icons";
import doToast from "../../helpers/toast";
import StandardAlert from "../../components/StandardAlert";
import debounce from "../../helpers/debounce";

const WEInput = () => {
	const { input } = useSelector(state => state.we);
	const { disableConfirms, sizes } = useSelector(state => state.appState);
	const dispatch = useDispatch();
	const [clearDisabled, setClearDisabled] = useState(false);
	const buttonSize = useBreakpointValue(sizes.lg);
	const inputSize = useBreakpointValue(sizes.sm);
	const warningContrast = useContrastText("warning.500");
	const primaryContrast = useContrastText("primary.500");
	useEffect(() => {
		if(input && clearDisabled) {
			setClearDisabled(false);
		} else if (!input && !clearDisabled) {
			setClearDisabled(true);
		}
	},[input]);

	// TO-DO: Clear function
	// TO-DO: Yes/no prompt
	// TO-DO: Toggle "clear" button disabled depending on if anything's loaded
	// TO-DO: Import function
	// TO-DO: Import overwrite or import add?
	// TO-DO: Import from which column?
	return (
		<VStack
			h="full"
			maxH="full"
			justifyContent="space-between"
			alignItems="center"
		>
			<TextAreaSetting
				text={null}
				defaultValue={input}
				placeholder="Enter the words to evolve here, one word per line"
				onChangeText={
					(t) => debounce(
						() => dispatch(editInput(t)),
						{ namespace: "WEinput "}
					)
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
					bg={clearDisabled ? "gray.500" : "warning.500"}
					_text={{
						fontSize: buttonSize,
						color: warningContrast,
						style: {
							fontVariant: ["small-caps"]
						}
					}}
					disabled={clearDisabled}
					py={0.5}
					px={3}
					m={1}
					startIcon={<ClearIcon color={clearDisabled ? "gray.900" : warningContrast} size={buttonSize} />}
				>Clear</Button>
				<Button
					borderRadius="full"
					bg="primary.500"
					_text={{
						fontSize: buttonSize,
						color: primaryContrast,
						style: {
							fontVariant: ["small-caps"]
						}
					}}
					py={0.5}
					px={3}
					m={1}
					startIcon={<ImportIcon color={primaryContrast} size={buttonSize} />}
				>Import From Lexicon</Button>
			</HStack>
		</VStack>
	);
};

export default WEInput;
