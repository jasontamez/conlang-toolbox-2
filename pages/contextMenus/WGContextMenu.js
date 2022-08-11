import { useSelector, useDispatch } from "react-redux";
import { useState } from 'react';
import { Menu, Pressable, VStack, Text, Divider, Modal } from 'native-base';
import { DotsIcon, SaveIcon, HelpIcon } from '../../components/icons';

const WGContextMenu = () => {
	const { pathname } = useLocation();
	const dispatch = useDispatch();
	const [menuOpen, setMenuOpen] = useState(false);
	const [infoModalOpen, setInfoModalOpen] = useState(false);
	const doMenuClose = () => {
		// close menu
		setMenuOpen(false);
	};
	return (
		<>
			<Menu
				placement="bottom right"
				closeOnSelect={false}
				w="full"
				trigger={(triggerProps) => (
					<Pressable
						m="auto"
						w={6}
						accessibilityLabel="More options menu"
						{...triggerProps}
					>
						<DotsIcon />
					</Pressable>
				)}
				onOpen={() => setMenuOpen(true)}
				onPress={() => setMenuOpen(true)}
				onClose={() => doMenuClose()}
				isOpen={menuOpen}
			>
				{/* Menu.Items go here */}
			</Menu>
			<Modal
				isOpen={infoModalOpen}
				h="full"
			>
				<Modal.Content
					w="full"
					maxWidth="full"
					minHeight="full"
					p={0}
					m={0}
					borderTopRadius={0}
				>
					<Modal.Header
						bg="primary.500"
						borderBottomWidth={0}
					>
						<Text color="primaryContrast" fontSize="md">TITLE</Text>
					</Modal.Header>
					<Modal.CloseButton
						_icon={{color: "primaryContrast"}}
						onPress={() => setInfoModalOpen(false)}
					/>
					<Modal.Body
						h="full"
						maxWidth="full"
						minHeight="full"
					>
						<VStack
							space={4}
							justifyContent="space-between"
						>
							<Text px={5} fontSize="sm">
								{'\t'}Sample text. This should depend on navigator location.
							</Text>
						</VStack>
					</Modal.Body>
					<Modal.Footer
						borderTopWidth={0}
						h={0}
						m={0}
						p={0}
					/>
				</Modal.Content>
			</Modal>
		</>
	)
};

export default WGContextMenu;
