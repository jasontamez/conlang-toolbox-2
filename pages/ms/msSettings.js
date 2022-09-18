import { Text, VStack, Pressable, HStack, useBreakpointValue } from "native-base";
//import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import debounce from '../../helpers/debounce';
import { TextAreaSetting, TextSetting } from '../../components/inputTags';
import { setTitle, setDescription } from "../../store/morphoSyntaxSlice";
import {
	AddCircleIcon,
	ExportIcon,
	RemoveCircleIcon,
	SaveIcon,
	TrashIcon
} from "../../components/icons";

const Settings = () => {
	//const { msPage } = useParams();
	//const pageName = "s" + msPage.slice(-2);
	const synTitle = useSelector((state) => state.morphoSyntax.title);
	const synDescription = useSelector((state) => state.morphoSyntax.description);
	const sizes = useSelector(state => state.appState.sizes);
	const dispatch = useDispatch();
	const textSize = useBreakpointValue(sizes.md);
	const inputSize = useBreakpointValue(sizes.sm);
	const StoredInfoButton = ({onPress, bg, icon, text}) => {
		return (
			<Pressable
				onPress={onPress}
				mx={4}
			>
				<HStack
					bg={bg}
					space={3}
					p={2}
					alignItems="center"
				>
					{icon}
					<Text fontSize={textSize}>{text}</Text>
				</HStack>
			</Pressable>
		);
	};
	return (
		<VStack space={4} mt={3}>
			<TextSetting
				placeholder="Usually the language name."
				defaultValue={synTitle}
				onChangeText={(v) => debounce(
					() => dispatch(setTitle(v)),
					{ namespace: "msName" }
				)}
				text="MorphoSyntax Title:"
				labelProps={{fontSize: textSize}}
				inputProps={{fontSize: inputSize}}
			/>
			<TextAreaSetting
				placeholder="A short description of this document."
				defaultValue={synDescription}
				onChangeText={(v) => debounce(
					() => dispatch(setDescription(v)),
					{ namespace: "msDesc" }
				)}
				text="Description:"
				labelProps={{fontSize: textSize}}
				inputProps={{fontSize: inputSize}}
			/>
			<VStack alignSelf="flex-end">
				<StoredInfoButton
					bg="lighter"
					icon={<RemoveCircleIcon size={textSize} />}
					onPress={() => 2222}
					text="Clear MorphoSyntax Info"
				/>
				<StoredInfoButton
					bg="darker"
					icon={<AddCircleIcon size={textSize} />}
					onPress={() => 2222}
					text="Load MorphoSyntax Info"
				/>
				<StoredInfoButton
					bg="lighter"
					icon={<SaveIcon size={textSize} />}
					onPress={() => 2222}
					text="Save MorphoSyntax Info"
				/>
				<StoredInfoButton
					bg="darker"
					icon={<SaveIcon size={textSize} />}
					onPress={() => 2222}
					text="Save As"
				/>
				<StoredInfoButton
					bg="lighter"
					icon={<ExportIcon size={textSize} />}
					onPress={() => 2222}
					text="Export MorphoSyntax Info"
				/>
				<StoredInfoButton
					bg="darker"
					icon={<TrashIcon size={textSize} />}
					onPress={() => 2222}
					text="Delete Saved MorphoSyntax Info"
				/>
			</VStack>
		</VStack>
	);
};

export default Settings;
