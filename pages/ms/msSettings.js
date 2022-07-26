import { Button, Text, VStack, Pressable, HStack } from "native-base";
//import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { TextAreaSetting, TextSetting } from '../../components/layoutTags';
import { setTitle, setDescription } from "../../store/morphoSyntaxSlice";
import { useNavigate } from "react-router-native";
import { AddCircleIcon, ExportIcon, RemoveCircleIcon, SaveIcon, TrashIcon } from "../../components/icons";

const Settings = () => {
	//const { msPage } = useParams();
	//const pageName = "s" + msPage.slice(-2);
	const synTitle = useSelector((state) => state.morphoSyntax.title);
	const synDescription = useSelector((state) => state.morphoSyntax.description);
	const dispatch = useDispatch();
	const StoredInfoButton = (props) => {
		return (
			<Pressable onPress={props.onPress} mx={4}>
				<HStack bg={props.bg} space={3} p={2} alignItems="center">
					{props.icon}
					<Text>{props.children}</Text>
				</HStack>
			</Pressable>
		);
	};
	return (
		<VStack space={4} mt={3}>
			<TextSetting
				placeholder="Usually the language name."
				value={synTitle}
				onChangeEnd={(v) => dispatch(setTitle(v))}
			>MorphoSyntax Title:</TextSetting>
			<TextAreaSetting
				placeholder="A short description of this document."
				value={synDescription}
				onChangeEnd={(v) => dispatch(setDescription(v))}
			>Description:</TextAreaSetting>
			<VStack alignSelf="flex-end">
				<StoredInfoButton bg="lighter" icon={<RemoveCircleIcon />} onPress={() => 2222}>Clear MorphoSyntax Info</StoredInfoButton>
				<StoredInfoButton bg="darker" icon={<AddCircleIcon />} onPress={() => 2222}>Load MorphoSyntax Info</StoredInfoButton>
				<StoredInfoButton bg="lighter" icon={<SaveIcon />} onPress={() => 2222}>Save MorphoSyntax Info</StoredInfoButton>
				<StoredInfoButton bg="darker" icon={<SaveIcon />} onPress={() => 2222}>Save As</StoredInfoButton>
				<StoredInfoButton bg="lighter" icon={<ExportIcon />} onPress={() => 2222}>Export MorphoSyntax Info</StoredInfoButton>
				<StoredInfoButton bg="darker" icon={<TrashIcon />} onPress={() => 2222}>Delete Saved MorphoSyntax Info</StoredInfoButton>
			</VStack>
		</VStack>
	);
};

export default Settings;
