import { Text, VStack, Pressable, HStack } from "native-base";
import { useDispatch, useSelector } from "react-redux";

import debounce from '../../components/debounce';
import {
	TextSetting,
	SliderWithTicks
} from '../../components/layoutTags';
import {
	setMonosyllablesRate,
	setMaxSyllablesPerWord,
	setCategoryRunDropoff,
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
	AddCircleIcon,
	ExportIcon,
	RemoveCircleIcon,
	SaveIcon,
	TrashIcon
} from "../../components/icons";

const WGSettings = () => {
	const {
		monosyllablesRate,
		maxSyllablesPerWord,
		categoryRunDropoff,
		syllableBoxDropoff,
		capitalizeSentences,
		declarativeSentencePre,
		declarativeSentencePost,
		interrogativeSentencePre,
		interrogativeSentencePost,
		exclamatorySentencePre,
		exclamatorySentencePost
	} = useSelector(state => state.wg);
	const dispatch = useDispatch();
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
		</VStack>
	);
	// Consider changing the above to mimic AppSettings
};

export default WGSettings;
