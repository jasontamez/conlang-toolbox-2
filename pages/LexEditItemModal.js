import { useRef, useState } from 'react';
import {
	Input,
	Text,
	VStack,
	HStack,
	IconButton,
	Button,
	Modal,
	Heading
} from 'native-base';

import ExtraChars from '../components/ExtraCharsButton';
import {
	CloseCircleIcon,
	TrashIcon,
	SaveIcon
} from '../components/icons';


const ModalLexiconEditingItem = ({
	isEditing,
	columns,
	labels,
	saveItemFunc,
	deleteEditingItemFunc,
	endEditingFunc
}) => {
	//
	//
	// 	EDITING LEXICON ITEM MODAL
	//
	//
	// (has to be separate to keep State updates from flickering this all the time)
	const [newFields, setNewFields] = useState([]);
	const [active, setActive] = useState(false);
	const firstFieldRef = useRef(null);
	const doClose = () => {
		setActive(false);
		setNewFields([]);
		endEditingFunc();
	};
	return (
		<Modal isOpen={isEditing} closeOnOverlayClick={false} initialFocusRef={firstFieldRef}>
			<Modal.Content>
				<Modal.Header m={0} p={0}>
					<HStack pl={2} w="full" justifyContent="space-between" space={5} alignItems="center" bg="primary.500">
						<Heading color="primaryContrast" size="md">Edit Lexicon Item</Heading>
						<HStack justifyContent="flex-end" space={2}>
							<ExtraChars iconProps={{color: "primaryContrast", size: "sm"}} buttonProps={{p: 1, m: 0}} />
							<IconButton icon={<CloseCircleIcon color="primaryContrast" />} p={1} m={0} variant="ghost" onPress={() => doClose()} />
						</HStack>
					</HStack>
				</Modal.Header>
				<Modal.Body m={0} p={0}>
					<VStack m={0} p={4} pb={10} space={6}>
						{columns.map((info, i) => {
							return (
								<VStack key={info + "-" + String(i)} >
									<Text fontSize="sm">{labels[i]}</Text>
									<Input
										defaultValue={info}
										size="md"
										ref={i ? null : firstFieldRef}
										onChangeText={(value) => {
											let fields = [...newFields];
											if(!active) {
												// We need to set everything up
												fields = [...columns];
												setActive(true);
											}
											fields.splice(i, 1, value);
											setNewFields([...fields]);
										}}
									/>
								</VStack>
							);
						})}
					</VStack>
				</Modal.Body>
				<Modal.Footer m={0} p={0} borderTopWidth={0}>
					<HStack justifyContent="space-between" w="full">
						<Button
							startIcon={<TrashIcon color="danger.50" m={0} />}
							bg="danger.500"
							onPress={() => {
								// TO-DO yes/no prompt
								setActive(false);
								deleteEditingItemFunc();
							}}
							_text={{color: "danger.50"}}
							p={1}
							m={2}
						>DELETE ITEM</Button>
						<Button
							startIcon={<SaveIcon color="tertiary.50" m={0} />}
							bg="tertiary.500"
							onPress={() => {
								setActive(false);
								saveItemFunc([...newFields]);
							}}
							_text={{color: "tertiary.50"}}
							p={1}
							m={2}
						>SAVE ITEM</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};

export default ModalLexiconEditingItem;
