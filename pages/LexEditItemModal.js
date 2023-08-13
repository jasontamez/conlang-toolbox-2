import { useEffect, useRef, useState } from 'react';
import {
	Input,
	Text,
	VStack,
	HStack,
	Modal
} from 'native-base';

import {
	CloseCircleIcon,
	TrashIcon,
	SaveIcon
} from '../components/icons';
import StandardAlert from '../components/StandardAlert';
import getSizes from '../helpers/getSizes';
import Button from '../components/Button';
import IconButton from '../components/IconButton';


const ModalLexiconEditingItem = ({
	isEditing,
	columns,
	labels,
	saveItemFunc,
	deleteEditingItemFunc,
	disableConfirms,
	endEditingFunc
}) => {
	//
	//
	// 	EDITING LEXICON ITEM MODAL
	//
	//
	// (has to be separate to keep State updates from flickering this all the time)
	const [newFields, setNewFields] = useState([]);
	const [alertOpen, setAlertOpen] = useState(false);
	const firstFieldRef = useRef(null);
	const [textSize, inputSize] = getSizes("sm", "xs");
	const doClose = () => {
		setNewFields([]);
		endEditingFunc();
	};
	useEffect(() => {
		setNewFields([...columns]);
	}, [columns]);
	return (
		<Modal
			isOpen={isEditing}
			closeOnOverlayClick={false}
			initialFocusRef={firstFieldRef}
		>
			<StandardAlert
				alertOpen={alertOpen}
				setAlertOpen={setAlertOpen}
				bodyContent="Are you sure you want to delete this Lexicon entry? This cannot be undone."
				continueText="Yes"
				continueFunc={deleteEditingItemFunc}
				continueProps={{ scheme: "danger" }}
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
							color="primary.50"
							fontSize={textSize}
							bold
						>
							Edit Lexicon Item
						</Text>
						<IconButton
							icon={<CloseCircleIcon size={textSize} />}
							p={1}
							m={0}
							variant="ghost"
							scheme="primary"
							onPress={() => doClose()}
						/>
					</HStack>
				</Modal.Header>
				<Modal.Body m={0} p={0}>
					<VStack m={0} p={4} pb={10} space={6}>
						{columns.map((info, i) => {
							return (
								<VStack key={`${info}-${i}`} >
									<Text fontSize={textSize}>{labels[i]}</Text>
									<Input
										defaultValue={info}
										fontSize={inputSize}
										ref={i ? null : firstFieldRef}
										onChangeText={(value) => {
											let fields = [...newFields];
											fields.splice(i, 1, value);
											setNewFields([...fields]);
										}}
									/>
								</VStack>
							);
						})}
					</VStack>
				</Modal.Body>
				<Modal.Footer borderTopWidth={0}>
					<HStack justifyContent="space-between" w="full" flexWrap="wrap">
						<Button
							startIcon={<TrashIcon size={textSize} m={0} />}
							scheme="danger"
							onPress={() => (disableConfirms ? deleteEditingItemFunc() : setAlertOpen(true))}
							_text={{fontSize: textSize}}
							p={1}
							m={2}
						>Delete</Button>
						<Button
							startIcon={<SaveIcon size={textSize} m={0} />}
							scheme="tertiary"
							onPress={() => saveItemFunc([...newFields])}
							_text={{fontSize: textSize}}
							p={1}
							m={2}
						>Save</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};

export default ModalLexiconEditingItem;
