import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
	Input,
	Text,
	VStack,
	HStack,
	IconButton,
	Button,
	Modal,
	Heading,
	useBreakpointValue,
	useContrastText
} from 'native-base';

import ExtraChars from '../components/ExtraCharsButton';
import {
	CloseCircleIcon,
	TrashIcon,
	SaveIcon
} from '../components/icons';
import StandardAlert from '../components/StandardAlert';


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
	const sizes = useSelector(state => state.appState.sizes);
	const [newFields, setNewFields] = useState([]);
	const [alertOpen, setAlertOpen] = useState(false);
	const firstFieldRef = useRef(null);
	const textSize = useBreakpointValue(sizes.sm);
	const headerSize = useBreakpointValue(sizes.md);
	const doClose = () => {
		setNewFields([]);
		endEditingFunc();
	};
	useEffect(() => {
		setNewFields([...columns]);
	}, [columns]);
	const primaryContrast = useContrastText('primary.500');
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
				continueProps={{
					bg: "danger.500"
				}}
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
						<Heading
							color={primaryContrast}
							size={headerSize}
						>
							Edit Lexicon Item
						</Heading>
						<HStack justifyContent="flex-end" space={2}>
							<ExtraChars
								iconProps={{
									color: primaryContrast,
									size: "sm"
								}}
								buttonProps={{p: 1, m: 0}}
							/>
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} />}
								p={1}
								m={0}
								variant="ghost"
								onPress={() => doClose()}
							/>
						</HStack>
					</HStack>
				</Modal.Header>
				<Modal.Body m={0} p={0}>
					<VStack m={0} p={4} pb={10} space={6}>
						{columns.map((info, i) => {
							return (
								<VStack key={info + "-" + String(i)} >
									<Text fontSize={textSize}>{labels[i]}</Text>
									<Input
										defaultValue={info}
										size="md"
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
					<HStack justifyContent="space-between" w="full">
						<Button
							startIcon={<TrashIcon color="danger.50" m={0} />}
							bg="danger.500"
							onPress={() => (disableConfirms ? deleteEditingItemFunc() : setAlertOpen(true))}
							_text={{color: "danger.50"}}
							p={1}
							m={2}
						>DELETE ITEM</Button>
						<Button
							startIcon={<SaveIcon color="tertiary.50" m={0} />}
							bg="tertiary.500"
							onPress={() => saveItemFunc([...newFields])}
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
