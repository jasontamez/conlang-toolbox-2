import { Text, VStack, Pressable, HStack } from "native-base";
//import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import debounce from '../../components/debounce';
import { TextAreaSetting, TextSetting } from '../../components/layoutTags';
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
	const dispatch = useDispatch();
	const StoredInfoButton = (props) => {
		return (
			<Pressable
				onPress={props.onPress}
				mx={4}
			>
				<HStack
					bg={props.bg}
					space={3}
					p={2}
					alignItems="center"
				>
					{props.icon}
					<Text>{props.text}</Text>
				</HStack>
			</Pressable>
		);
	};
	return (
		<VStack space={4} mt={3}>
			<TextSetting
				placeholder="Usually the language name."
				value={synTitle}
				onChangeText={(v) => debounce(
					() => dispatch(setTitle(v)),
					{ namespace: "msName" }
				)}
				text="MorphoSyntax Title:"
			/>
			<TextAreaSetting
				placeholder="A short description of this document."
				value={synDescription}
				onChangeText={(v) => debounce(
					() => dispatch(setDescription(v)),
					{ namespace: "msDesc" }
				)}
				text="Description:"
			/>
			<VStack alignSelf="flex-end">
				<StoredInfoButton
					bg="lighter"
					icon={<RemoveCircleIcon />}
					onPress={() => 2222}
					text="Clear MorphoSyntax Info"
				/>
				<StoredInfoButton
					bg="darker"
					icon={<AddCircleIcon />}
					onPress={() => 2222}
					text="Load MorphoSyntax Info"
				/>
				<StoredInfoButton
					bg="lighter"
					icon={<SaveIcon />}
					onPress={() => 2222}
					text="Save MorphoSyntax Info"
				/>
				<StoredInfoButton
					bg="darker"
					icon={<SaveIcon />}
					onPress={() => 2222}
					text="Save As"
				/>
				<StoredInfoButton
					bg="lighter"
					icon={<ExportIcon />}
					onPress={() => 2222}
					text="Export MorphoSyntax Info"
				/>
				<StoredInfoButton
					bg="darker"
					icon={<TrashIcon />}
					onPress={() => 2222}
					text="Delete Saved MorphoSyntax Info"
				/>
			</VStack>
		</VStack>
	);
};

export default Settings;
