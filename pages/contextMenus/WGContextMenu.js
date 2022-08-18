import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from 'react';
import { Menu, Pressable, VStack, Text, Divider, Modal, useBreakpointValue, useContrastText, HStack, IconButton } from 'native-base';
import { useLocation } from "react-router-native";

import { InfoIcon, SaveIcon, HelpIcon, CloseCircleIcon } from '../../components/icons';
import { sizes } from "../../store/appStateSlice";

const WGContextMenu = () => {
	const { pathname } = useLocation();
	const textSize = useBreakpointValue(sizes.sm);
	const headerSize = useBreakpointValue(sizes.md);
	const [infoModalOpen, setInfoModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState("TITLE");
	const [modalContent, setModalContent] = useState('');
	const primaryContrast = useContrastText('primary.500');
	const P = (props) => <Text fontSize={textSize} {...props} />;
	const I = (props) => <P bg="darker" px={0.5} >/{props.children}/</P>;
	const Em = (props) => <P italic {...props} />;
	const B = (props) => <P bold {...props} />;
	const C = (props) => <B textAlign="center" {...props} />;
	useEffect(() => {
		switch (pathname) {
			case "/wg/characters":
				setModalTitle("Character Groups");
				setModalContent(
					<>
						<P>
							{'\t'}This is where you define groups of sounds. The two simplest groupings
							are <Em>consonants</Em> and <Em>vowels</Em>, but you may want to create multiple
							character groups depending on how you want your language's syllables formed. For
							example, the consonants <I>pbk</I> in English may be followed by the
							consonants <I>lr</I> at the beginning of syllables. So you might choose them as
							groups, while also putting <I>pbklr</I> in a third group for general consonants.
						</P>
						<P>
							{'\t'}Click the (+) button to add a new character group. When you make a group, you must
							give it a <Em>description</Em> and a one-character <Em>label</Em>. The label can be
							any single character except for these: <B>{"^$\\()[]{}.*+?|"}</B>. The
							description is for your own benefit, while the label will be used to refer to this
							group in the <B>Syllables</B> tab. So you may end up with groups that look
							like the following:
						</P>
						<VStack w="full" alignItems="center" space={1}>
							<C>I=pbk</C>
							<C>L=lr</C>
							<C>C=pbklr</C>
							<C>V=eioau</C>
						</VStack>
						<P>
							{'\t'}The letters/characters in your group are called a <Em>run</Em>. The run should be
							put in a specific order. The first letter is more likely to be used than the second,
							the second more likely than the third, and so on. This mimics natural languages, which
							tend to use certain sounds more than others. You can adjust this <Em>dropoff rate</Em>, or
							eliminate it entirely, at the top of this page or on the <B>Settings</B> tab.
						</P>
					</>
				);
				break;
			default:
				setModalTitle("TITLE");
				setModalContent(<Text>Nothing</Text>);
		}
	}, [pathname]);
	return (
		<>
			<Pressable
				m="auto"
				w={6}
				accessibilityLabel="Information"
				onPress={() => setInfoModalOpen(true)}
			>
				<InfoIcon size="md" />
			</Pressable>
			<Modal isOpen={infoModalOpen}>
				<Modal.Content>
					<Modal.Header
						bg="primary.500"
						borderBottomWidth={0}
						px={3}
					>
						<HStack w="full" justifyContent="space-between" alignItems="center">
							<Text color={primaryContrast} fontSize={headerSize}>{modalTitle}</Text>
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} />}
								onPress={() => setInfoModalOpen(false)}
								variant="ghost"
							/>
						</HStack>
					</Modal.Header>
					<Modal.Body>
						<VStack
							space={4}
							justifyContent="space-between"
						>
							{modalContent}
						</VStack>
					</Modal.Body>
					<Modal.Footer
						borderTopWidth={0}
						h={0}
					/>
				</Modal.Content>
			</Modal>
		</>
	)
};

export default WGContextMenu;
