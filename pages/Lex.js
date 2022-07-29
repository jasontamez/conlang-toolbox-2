import { useSelector, useDispatch } from "react-redux";
import {
	Input,
	ScrollView,
	Text,
	TextArea,
	VStack
} from 'native-base';

import debounce from '../components/debounce';
import {
	setTitle,
	setDesc,
	equalityCheck
} from '../store/lexiconSlice';

const Lex = () => {
	//
	//
	// GET DATA
	//
	//
	const dispatch = useDispatch();
	const {
		title,
		description
	} = useSelector((state) => state.lexicon, equalityCheck);
	//
	//
	// RETURN JSX
	//
	//
	return (
		<ScrollView flex={1}>
			<VStack m={3} mb={0}>
				<Text fontSize="sm">Lexicon Title:</Text>
				<Input
					mt={2}
					defaultValue={title}
					placeholder="Usually the language name."
					onChangeText={(v) => debounce(() => dispatch(setTitle(v)))}
				/>
			</VStack>
			<VStack m={3} mt={2}>
				<Text fontSize="sm">Description:</Text>
				<TextArea mt={2}
					defaultValue={description}
					placeholder="A short description of this lexicon."
					totalLines={3}
					onChangeText={(v) => debounce(() => dispatch(setDesc(v)))}
				/>
			</VStack>
		</ScrollView>
	);
};
 
export default Lex;
