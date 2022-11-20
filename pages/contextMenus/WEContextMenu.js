import { useEffect, useRef, useState } from 'react';
import {
	VStack,
	Text,
	Modal,
	useContrastText,
	HStack,
	IconButton,
	Button,
	Center
} from 'native-base';
import { useLocation } from "react-router-native";

import {
	InfoIcon,
	CloseCircleIcon,
	ReorderIcon,
	GearIcon,
	SaveIcon,
	AddCircleIcon
} from '../../components/icons';
import getSizes from '../../helpers/getSizes';

const WEContextMenu = () => {
	const { pathname } = useLocation();
	const [textSize, headerSize, iconSize] = getSizes("sm", "md", "lg");
	const [infoModalOpen, setInfoModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState("TITLE");
	const [modalBody, setModalBody] = useState('');
	const modalRef = useRef(null);
	const primaryContrast = useContrastText('primary.500');
	const P = (props) => <Text lineHeight={headerSize} fontSize={textSize} {...props} />;
	const Em = (props) => <P italic {...props} />;
	const B = (props) => <P bold {...props} />;
	const S = (props) => <P fontFamily="serif" {...props} />;
	const HWrap = (props) => <HStack space={1} w="full" justifyContent="center" alignItems="center" flexWrap="wrap" {...props} />;
	const space = {
		md: 5,
		lg: 6,
		xl: 8,
		"2xl": 12,
		"3xl": 16,
		"4xl": 20,
		"5xl": 32,
		"6xl": 48,
		"7xl": 64
	}[textSize] || 4;
	const ModalBody = (props) => (
		<Modal.Body _scrollview={{ref: modalRef}}>
			<VStack
				space={space}
				justifyContent="space-between"
				{...props}
			/>
		</Modal.Body>
	);
	useEffect(() => {
		// Since modalRef isn't working, use this hack to
		//   make it scroll to the top.
		if(!infoModalOpen) {
			return;
		}
		// END OF HACK (remove infoModalOpen from [list] at end, too)
		switch (pathname) {
			case "/we/characters":
				setModalTitle("Character Groups");
				setModalBody(
					<ModalBody>
						<P>
							{'\t'}This is where you define groups of characters representing sounds. You can reference
							these groups in <B>Transformations</B> and <B>Sound Changes</B> to fine-tune the way your
							language evolves.
						</P>
						<Center><AddCircleIcon color="text.50" size={iconSize} /></Center>
						<P>
							{'\t'}Click the <B>Add</B> button to add a new group. When you make a group, you must give
							it a <Em>description</Em> and a one-character <Em>label</Em>. The description is for your
							own benefit, while the label will be used to refer to this group in the other tabs. The
							label can be any single character except for these: <B>{"^$\\()[]{}.*+?|"}</B>. The
							letters/characters in a group are called a <Em>run</Em>.
						</P>
					</ModalBody>
				);
				break;
			case "/we/soundchanges":
				setModalTitle("Sound Changes");
				setModalBody(
					<ModalBody>
						<P>
							{'\t'}This is where you determine how your words evolve. The display follows basic standard
							phonological rules for describing sound changes:
						</P>
						<HWrap>
							<S>s</S>
							<P>⟶</P>
							<S>z</S>
							<P>/</P>
							<S>d_</S>
							<P>!</P>
							<S>_h</S>
						</HWrap>
						<P>
							{'\t'}The above means that "s" changes to "z" after a "d", but not when it's before an "h".
						</P><P>
							{'\t'}The first box is the <Em>beginning expression</Em>, the second is the <Em>ending
							expression</Em>, the third is the <Em>context expression</Em>, and the last is
							the <Em>exception expression</Em>.
						</P><P>
							{'\t'}The <Em>beginning expression</Em> can include plain text or regular expressions. It
							can also contain %Group references. (A group reference is something like %G to
							indicate any character in character group C's run, or !%G to indicate any character
							that is <Em>not</Em> in that run.)
						</P><P>
							{'\t'}The <Em>ending expression</Em> should be plain text. However, it can include
							non-negative %Group references <B>if and only if</B> the <Em>beginning
							expression</Em> does, too. In that case, something special happens: when the
							evolver matches a character in a group, it will note what position that
							character is in the group's run. It will then look at the <Em>ending</Em> group
							and pick out the character in the same position. For example: If %S is being
							replaced with %Z, and those groups have runs "ptk" and "bdg", "p" will be
							replaced with "b", "t" will be replaced with "d", and "k" will be replaced by
							"g". (If the first group has more letters than the second, the second group's
							run will be repeated until it's long enough to find a match.) <B>NOTE:</B> If
							you have unequal numbers of %Groups in
							the <Em>beginning</Em> and <Em>ending</Em> expressions, errors may occur.
						</P><P>
							{'\t'}The <Em>context expression</Em> describes where in the word the <Em>beginning
							expression</Em> must be before it can be changed into the <Em>ending
							expression</Em>. The <Em>exception expression</Em> is similar, but it
							describes where in the world a match <B>can't</B> be made.
							(The <Em>exception</Em> is optional.)
						</P><P>
							{'\t'}There are two characters in <Em>contexts</Em> and <Em>exceptions</Em> that
							have special functions. The underscore _ represents where the <Em>ending
							expression</Em> is being matched. You <B>must</B> include an
							underscore. The hash symbol # represents the beginning or end of a word. For
							example: if you want to turn "s" into "z" at the beginning of a word, you
							could create the following:
						</P>
						<HWrap>
							<S>s</S>
							<P>⟶</P>
							<S>z</S>
							<P>/</P>
							<S>#_</S>
						</HWrap>
						<P>
							{'\t'}If you have no special rules for where in a word a replacement can happen,
							just make a <Em>context expression</Em> that's only a single underscore.
						</P>
						<Center><AddCircleIcon color="text.50" size={iconSize} /></Center>
						<P>
							{'\t'}Click the <B>Add</B> button to add a new sound-change.
						</P>
						<Center><ReorderIcon color="text.50" size={iconSize} /></Center>
						<P>
							{'\t'}The first sound-change in the list will be run first, the second
							sound-change second, and so on down the list. This may cause unintended effects,
							so you can reorganize your sound-changes to avoid them by using the reordering
							mode.
						</P>
					</ModalBody>
				);
				break;
			case "/we/transformations":
				setModalTitle("Transformations");
				setModalBody(
					<ModalBody>
						<P>
							{'\t'}There may be cases when you need to modify the input words before you evolve
							them. A common reason would be to turn a group of characters (such as "sh",
							"th", or "ng" in English) into a single character that can be targeted
							more easily.
						</P><P>
							{'\t'}When you make a new <Em>transformation</Em>, you provide an <Em>input expression</Em>,
							a <Em>transform direction</Em>, an <Em>output expression</Em>, and, optionally,
							a <Em>transform description</Em> for your own benefit.
						</P><P>
							{'\t'}The <Em>transform direction</Em> is either "at input, then undo at output", "at
							input and at output", "at input only", or "at output only", and they determine how
							the two expressions are used.
						</P>
						<VStack px={4} space={1}>
							<P>
								{'\t'}<B>Input only:</B> Before anything else happens, input words are
								searched, and any instances of the <Em>input expression</Em> are replaced with
								the <Em>output expression</Em>. Regular expressions and %Group references
								are allowed in the <Em>input expression</Em> only. (A group reference is
								something like %G to indicate any character in characyer group C's run, or
								!%G to indicate any character <Em>not</Em> in that run.)
							</P><P>
								{'\t'}<B>Output only:</B> After all <B>sound changes</B> are
								processed, any instances of the <Em>input expression</Em> are replaced with
								the <Em>output expression</Em>. Regular expressions and %Group references
								are allowed in the <Em>input expression</Em> only.
							</P><P>
								{'\t'}<B>At input, then undo at output:</B> Before anything else happens,
								input words are searched, and any instances of the <Em>input
								expression</Em> are replaced with the <Em>output expression</Em>. After
								all <B>sound changes</B> are processed, any instances of
								the <Em>output expression</Em> are replaced with the <Em>input expression</Em>.
							</P><P>
								{'\t'}Regular expressions are not allowed, but non-negative %Group references are
								allowed if and only if both input and output have them. In that case, something
								special happens: when the transformer matches a character in a group, it will
								note what position that character is in the group's run. It will then look at
								the other expression's group and pick out the character in the same position.
							</P><P>
								{'\t'}For example: If %S is being replaced with %Z, and those groups have runs "ptk"
								and "bdg", "p" will be replaced with "b", "t" will be replaced with "d", and "k"
								will be replaced by "g". If the first group has more letters than the second,
								the second group's run will be repeated until it's long enough to find a match.
							</P><P>
								{'\t'}NOTE: If you have unequal numbers of %Groups in the beginning and ending
								expressions, errors may occur.
							</P><P>
								{'\t'}<B>At input and at output:</B> As <Em>at input, then undo at
								output</Em>, but the <Em>input expression</Em> is replaced with the <Em>output
								expression</Em> before AND after the <B>sound changes</B> are processed.
							</P>
						</VStack>
						<Center><AddCircleIcon color="text.50" size={iconSize} /></Center>
						<P>
							{'\t'}Click the <B>Add</B> button to add a new transformation.
						</P>
						<Center><ReorderIcon color="text.50" size={iconSize} /></Center>
						<P>
							{'\t'}The first transformation in the list will be run first, the second
							transformation second, and so on down the list. This may cause unintended effects,
							so you can reorganize your transformations to avoid them by using the reordering
							mode.
						</P>
					</ModalBody>
				);
				break;
			case "/we/output":
				setModalTitle("Output");
				setModalBody(
					<ModalBody>
						<P>
							{'\t'}This is where the magic happens. Click the <B>Generate</B> button and the
							evolver will process all your input words and present your output in the space below.
						</P>
							<Center><GearIcon color="text.50" size={iconSize} /></Center>
						<P>
							{'\t'}Click on the <B>Gear</B> to open a list of options. They should all be
							self-explanatory.
						</P><P>
							{'\t'}There is a drop-down menu above the <B>Evolve</B> button where you can
							select what to output. The choices are <B>Output only</B>, <B>Output with
							Rules</B>, <B>Input ⟶ Output</B> and <B>Output, then
							Input</B>.
						</P><P>
							{'\t'}Choosing <B>Output only</B> will display a simple list of evolved words.
						</P><P>
							{'\t'}<B>Output with Rules</B> displays the most complex output.
							For every word, it will print the input word, an arrow, and then the evolved word.
							Below that, it will print an indented list of the <B>Sound Changes</B> that
							evolved the word, in the format [rule] ⟶ [evolved word]. (If a sound-change
							didn't affect that word, then it will be omitted from this list.)
						</P><P>
							{'\t'}<B>Input ⟶ Output</B>, as you might guess, prints a list in the format
							[input word] ⟶ [evolved word]. <B>Output ⟵ Input</B> is the same,
							but the evolved word comes first.
						</P>
						<Center><SaveIcon color="text.50" size={iconSize} /></Center>
						<P>
							{'\t'}Once you've evolved words, you can save them to the <B>Lexicon</B>. Click
							the <B>Save</B> button and you're presented with two options. <Em>Save All to
							Lexicon</Em> will store every single evolved word for the Lexicon. <Em>Choose What
							to Save</Em> will highlight every evolved word, and you can tap on a word to store
							it; when you're done choosing, hit the big green save button that appears. You
							will be presented with a pop-up asking you which Lexicon column to save the words to.
						</P>
					</ModalBody>
				);
				break;
			case "/we":
			case "/we/":
			case "/we/input":
				setModalTitle("Input");
				setModalBody(
					<ModalBody>
						<P>
							{'\t'}This pane has one purpose: determining which words you want to change.
						</P><P>
							{'\t'}The easiest way is to copy-paste a list of words, each on a line by itself. Or, you
							can use the <B>Import From Lexicon</B> button to pull in words stored in
							the <B>Lexicon</B>.
						</P><P>
							{'\t'}Use the <B>Clear</B> button to empty all words from Input.
						</P>
					</ModalBody>
				);
				break;
			default:
				setModalTitle("TITLE");
				setModalBody(<Text>Display Error</Text>);
		}
	}, [pathname, infoModalOpen]);
	return (
		<>
			<IconButton
				accessibilityLabel="Information"
				flexGrow={0}
				flexShrink={0}
				icon={<InfoIcon size={textSize} />}
				onPress={() => {
					setInfoModalOpen(true);
				}}
			/>
			<Modal isOpen={infoModalOpen} closeOnOverlayClick={true}>
				<Modal.Content>
					<Modal.Header
						bg="primary.500"
						borderBottomWidth={0}
						px={3}
					>
						<HStack w="full" justifyContent="space-between" alignItems="center" pl={1.5}>
							<Text color={primaryContrast} fontSize={headerSize}>{modalTitle}</Text>
							<IconButton
								icon={<CloseCircleIcon color={primaryContrast} size={headerSize} />}
								onPress={() => setInfoModalOpen(false)}
								variant="ghost"
								px={0}
							/>
						</HStack>
					</Modal.Header>
					{modalBody}
					<Modal.Footer p={2}>
						<Button
							onPress={() => setInfoModalOpen(false)}
							py={1}
							px={2}
							colorScheme="info"
							_text={{fontSize: textSize}}
						>OK</Button>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
		</>
	);
};

export default WEContextMenu;
