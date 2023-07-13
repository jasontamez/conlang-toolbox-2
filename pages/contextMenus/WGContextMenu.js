import { useEffect, useRef, useState } from 'react';
import {
	VStack,
	Text,
	Modal,
	useContrastText,
	HStack,
	IconButton,
	Divider,
	Box,
	Button,
	Center
} from 'native-base';
import { useLocation } from "react-router-native";

import {
	InfoIcon,
	CloseCircleIcon,
	GearIcon,
	GenerateIcon,
	SaveIcon,
	AddCircleIcon,
	EditIcon,
	TrashIcon
} from '../../components/icons';
import getSizes from '../../helpers/getSizes';

const WGContextMenu = () => {
	const { pathname } = useLocation();
	const [iconSize, textSize, headerSize] = getSizes("lg", "sm", "md")
	const [infoModalOpen, setInfoModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState("TITLE");
	const [modalBody, setModalBody] = useState('');
	const modalRef = useRef(null);
	const primaryContrast = useContrastText('primary.500');
	const P = (props) => <Text textAlign="justify" lineHeight={headerSize} fontSize={textSize} {...props} />;
	const I = (props) => <P bg="darker" px={0.5} >/{props.children}/</P>;
	const Em = (props) => <P italic {...props} />;
	const B = (props) => <P bold {...props} />;
	const S = (props) => <P fontFamily="serif" {...props} />;
	const Unit = (props) => <Box borderColor="text.50" borderWidth={2} py={1} px={2}><S bold {...props} /></Box>;
	const C = (props) => <B textAlign="center" {...props} />;
	const HWrap = (props) => <HStack space={1} alignItems="center" flexWrap="wrap" {...props} />;
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
			case "/wg/characters":
				setModalTitle("Character Groups");
				setModalBody(
					<ModalBody>
						<P>
							{'\t\t\t'}This is where you define groups of sounds. The two simplest groupings
							are <Em>consonants</Em> and <Em>vowels</Em>, but you may want to create multiple
							character groups depending on how you want your language's syllables formed. For
							example, the consonants <I>pbk</I> in English may be followed by the
							consonants <I>lr</I> at the beginning of syllables. So you might choose them as
							groups, while also putting <I>pbklr</I> in a third group for general consonants.
						</P>
						<HStack space={2} justifyContent="center">
							<AddCircleIcon color="secondary.500" size={iconSize} />
							<EditIcon color="primary.500" size={iconSize} />
							<TrashIcon color="danger.500" size={iconSize} />
						</HStack>
						<P>
							{'\t\t\t'}Click the <B color="secondary.500">Add</B> button to add a new character group.
							Swiping right will reveal the <B color="primary.500">Edit</B> button, while swiping left
							will reveal the <B color="danger.500">Delete</B> button.
						</P>
						<P>
							{'\t\t\t'}When you make a group, you must give it a <Em>description</Em> and a
							one-character <Em>label</Em>. The label can be any single character except for
							these: <B letterSpacing="2xl">{"^$\\()[]{}.*+?|"}</B>. The description is for your own
							benefit, while the label will be used to refer to this group in the <B>Syllables</B> tab.
							So you may end up with groups that look like the following:
						</P>
						<VStack w="full" alignItems="center" space={1}>
							<C>I=pbk</C>
							<C>L=lr</C>
							<C>C=pbklr</C>
							<C>V=eioau</C>
						</VStack>
						<P>
							{'\t\t\t'}The letters/characters in your group are called a <Em>run</Em>. The run should be
							put in a specific order. <B>Character Group run dropoff</B> can range from 0% to 50%. At
							zero (flat), group choices are all equiprobable. Otherwise, the higher the number, the more
							likely it is that the first characters are used. (This mimics natural languages, which tend
							to prefer certain sounds and patterns.) This is how it works:
						</P>
						<P mx={space} textAlign="left"><S><B>1)</B></S> A random number is generated from 1 to 100.</P>
						<P mx={space} textAlign="left"><S><B>2)</B></S> If the number is lower than the dropoff percentage, the first choice is picked.</P>
						<P mx={space} textAlign="left"><S><B>3)</B></S> If not, the generator moves the first choice to the end of the line, then returns to step 1, generating a new number.</P>
						<P mx={space} textAlign="left"><S><B>4)</B></S> This cycle continues until a number is generated that is equal to or greater than the dropoff percentage.</P>
					</ModalBody>
				);
				break;
			case "/wg/syllables":
				setModalTitle("Syllables");
				setModalBody(
					<ModalBody>
						<P>
							{'\t\t\t'}This is where you determine how your syllables are formed. You use the <Em>labels</Em> to
							describe the elements that make up a syllable. For example, using the labels above, you
							could decide to make a list of syllables such as the following:
						</P>
						<VStack w="full" alignItems="center" space={1}>
							<C>ILV</C>
							<C>CV</C>
							<C>ILVC</C>
						</VStack>
						<P>
							{'\t\t\t'}The above can generate syllables such as <Em>pla</Em>, <Em>ku</Em>, or <Em>brep</Em>, which
							could then be combined into words such as <Em>plabrep</Em> or <Em>kupla</Em>. You can
							also put characters in a syllable that don't correspond to a group: <B>sILV</B> could
							generate syllables such as <Em>sbra</Em> or <Em>spli</Em>.
						</P>
						<P>
							{'\t\t\t'}If you desire a greater amount of control over your words, you can turn on
							the <B>Use multiple syllable types</B> toggle. This will show you four
							separate boxes, each with a different role in a word: <B>single-word syllables</B> are
							used exclusively for one-syllable words, <B>word-initial syllables</B> are
							only used at the start of a word, <B>word-final syllables</B> are only used
							at the end of a word, and <B>mid-word syllables</B> fill out the middle
							of words when needed.
						</P>
						<P>
							{'\t\t\t'}The order of syllables in each box makes a difference. <B>Syllable dropoff</B> can
							range from 0% to 50%. At zero (flat), syllable choices are all equiprobable. Otherwise,
							the higher the number, the more likely it is that the first syllables are used. (This
							mimics natural languages, which tend to prefer certain sounds and patterns.) This is how
							it works:
						</P>
						<P mx={space} textAlign="left"><S><B>1)</B></S> A random number is generated from 1 to 100.</P>
						<P mx={space} textAlign="left"><S><B>2)</B></S> If the number is lower than the dropoff percentage, the first choice is picked.</P>
						<P mx={space} textAlign="left"><S><B>3)</B></S> If not, the generator moves the first choice to the end of the line, then returns to step 1, generating a new number.</P>
						<P mx={space} textAlign="left"><S><B>4)</B></S> This cycle continues until a number is generated that is equal to or greater than the dropoff percentage.</P>
					</ModalBody>
				);
				break;
			case "/wg/transformations":
				setModalTitle("Transformations");
				setModalBody(
					<ModalBody>
						<P>
							{'\t\t\t'}There may be cases when you need to fine-tune the words that get generated
							on the <B>Output</B> tab. A common reason would be to turn a
							specific character into two or three letters. You may create a group such
							as <B>C=pbkClrS</B>, using capital letters in place of sounds
							like <Em>"ch"</Em> or <Em>"sh"</Em>. This could generate syllables
							like <Em>Cu</Em> or <Em>pliS</Em>.
						</P>
						<P>
							{'\t\t\t'}When you make a new <Em>transformation</Em>, you provide
							a <Em>search expression</Em>, a <Em>replacement expression</Em>, and, optionally,
							a <Em>transformation description</Em> for your own benefit. Both expressions can
							use <B>regular expressions</B>, which are beyond the scope of this
							tutorial. You can also use the special expression %X to indicate any character
							in group X's run, or !%X to indicate any character <Em>not</Em> in that run.
						</P>
						<P>
							{'\t\t\t'}So, you could make a search expression <B>C</B> with a replacement
							expression <B>ch</B>, which will result in <Em>Cu</Em> above
							becoming <Em>chu</Em>. This will result in a transformation that looks like
							the following:
						</P>
						<HStack alignItems="center" justifyContent="center" space={1}>
							<Unit>C</Unit>
							<P>⟶</P>
							<Unit>ch</Unit>
						</HStack>
						<Divider />
						<HStack space={2} justifyContent="center">
							<AddCircleIcon color="tertiary.500" size={iconSize} />
							<EditIcon color="primary.500" size={iconSize} />
							<TrashIcon color="danger.500" size={iconSize} />
						</HStack>
						<P>
							{'\t\t\t'}Tap on the <B color="tertiary.500">Add</B> button to add a new transformation.
							Swiping right on a transformation reveals the <B color="primary.500">Edit</B> button,
							and swiping left reveals the <B color="danger.500">Delete</B> button.
						</P>
						<P>
							{'\t\t\t'}The first transformation in the list will be run first, the second
							transformation second, and so on down the list. If this causes unintended
							effects, you can reorganize your transformations to avoid
							them. <B color="warning.500">Long-press</B> a transformation
							to <B color="warning.500">drag</B> it to a new position.
						</P>
						<Divider />
						<P>
							{'\t\t\t'}Here are some sample transformations for some linguistic phenomina:
						</P>
						<VStack alignItems="center">
							<P>Consonant harmony:</P>
							<HWrap my={1}>
								<S>RtL:</S>
								<Unit>s(?=.*ʃ)</Unit>
								<P>⟶</P>
								<Unit>ʃ</Unit>
							</HWrap>
							<HWrap mb={3}>
								<S>LtR:</S>
								<Unit>(ʃ.+)s</Unit>
								<P>⟶</P>
								<Unit>$1ʃ</Unit>
							</HWrap>
							<P>Liquid dissimilation:</P>
							<HWrap my={1}>
								<Unit>r(.+)r</Unit>
								<P>⟶</P>
								<Unit>r$1l</Unit>
							</HWrap>
							<HWrap mb={3}>
								<Unit>l(.+)l</Unit>
								<P>⟶</P>
								<Unit>l$1r</Unit>
							</HWrap>
							<P>Synchronic epenthesis:</P>
							<HWrap mt={1} mb={3}>
								<Unit>r([aeiou]r)$</Unit>
								<P>⟶</P>
								<Unit>rd$1</Unit>
							</HWrap>
							<P>Anticipatory assimilation:</P>
							<HWrap mt={1} mb={3}>
								<Unit>[kp]t+</Unit>
								<P>⟶</P>
								<Unit>tt</Unit>
							</HWrap>
						</VStack>
					</ModalBody>
				);
				break;
			case "/wg/output":
				setModalTitle("Output");
				setModalBody(
					<ModalBody>
						<Center><GenerateIcon color="text.50" size={iconSize} /></Center>
						<P>
							{'\t\t\t'}This is where the magic happens. Click the <B>Generate</B> button and your
							output will appear below it. Press the button again and a new set of output
							will replace it.
						</P>
						<Center><GearIcon color="text.50" size={iconSize} /></Center>
						<P>
							{'\t\t\t'}Click on the gear icon to open a list of <B>Settings</B>. At the top, you
							can choose to <B>show syllable breaks</B>, which will in·sert a dot be·tween
							eve·ry syl·la·ble in each word. While this option can be useful, please note
							that it will break any <Em>transformations</Em> that try to work across
							syllable boundaries. The other settings are mentioned below.
						</P>
						<P>
							{'\t\t\t'}There is a drop-down menu above the Generate button where you can
							select what to output. The choices are <B>Pseudo-text</B>, <B>Wordlist</B> and <B>All
							possible syllables</B>.
						</P>
						<P>
							{'\t\t\t'}The <B>pseudo-text</B> will create words and put them into sentences, making a
							block of text you might find in a book. You can determine how many sentences are made by
							adjusting the <B>numer of sentences</B> slider in the <B>Settings</B>.
						</P>
						<P>
							{'\t\t\t'}The <B>wordlist</B> outputs a list of words devoid of context. You can choose
							a number of options in the <B>Settings</B> to modify this list. <B>Capitalize
							words</B> will capitalize every word. <B>Sort output</B> will alphabetize the list,
							and <B>multi-column layout</B> will arrange the list in multiple columns instead of
							one long column. At the bottom, there is a <B>wordlist size</B> slider that controls
							how many words are generated.
						</P>
						<P>
							{'\t\t\t'}<B>All possible syllables</B>, as you might guess, outputs a list of every
							possible syllable your character groups, syllables and transformations allow.
							The <Em>capitalize</Em>, <Em>sort</Em> and <Em>multi-column</Em> options above will
							also work on this syllable list.
						</P>
						<Center><SaveIcon color="text.50" size={iconSize} /></Center>
						<P>
							{'\t\t\t'}Once you've generated words, you can save them to the <B>Lexicon</B>. Click
							the <B>Save</B> button and you're presented with two options. <Em>Save All to
							Lexicon</Em> will store every single generated word for the Lexicon. <Em>Choose
							What to Save</Em> will highlight every word, and you can tap on a word to store
							it; when you're done choosing, hit the big green save button that appears. You
							will be presented with a pop-up asking you which Lexicon column to save the
							words to.
						</P>
					</ModalBody>
				);
				break;
			case "/wg":
			case "/wg/":
			case "/wg/settings":
				setModalTitle("Settings");
				setModalBody(
					<ModalBody>
						<P>
							{'\t\t\t'}This final pane fine-tunes the output. These can make a huge difference in
							how your conlang appears.
						</P>
						<Divider />
						<P>
							{'\t\t\t'}<B>Load a Preset</B> brings up a menu where you can choose from several
							pre-loaded options. The initial settings when you first start the app are
							the <Em>Simple</Em> preset. The others are offered to give you ideas of what's
							possible with the app. They will load <Em>character
							groups</Em>, <Em>syllables</Em>, <Em>transformations</Em> and possibly change the
							remaining settings on this page, too.
						</P><P>
							{'\t\t\t'}<B>Reset All Fields</B> clears all <Em>character
							groups</Em>, <Em>syllables</Em>, and <Em>transformations</Em>, and resets all settings
							to their default value.
						</P><P>
							{'\t\t\t'}<B>Save Current Info</B> and <B>Load Saved Info</B> open a dialogs where you
							can save and load your own <Em>character groups</Em>, <Em>syllables</Em>, <Em>transformations</Em> and
							the settings on this page. This allows you to switch between your own personal
							language settings.
						</P>
						<Divider />
						<Em>Word-Generation Controls</Em>
						<P>
							{'\t\t\t'}<B>Rate of monosyllable words</B> determines how often a one-syllable
							word is created. It's a percentage from 0% (never) to 100% (always).
						</P>
						<P>
							{'\t\t\t'}<B>Maximum number of syllables per word</B> sets an upper limit on how long
							your words can grow. If the <B>Rate</B> above is set to 100%, this setting is ignored.
						</P>
						<P>
							{'\t\t\t'}<B>Character Group run dropoff</B> and <B>Syllable run dropoff</B> can range
							from 0% to 50%. At zero (flat), group and syllable choices are all equiprobable.
							Otherwise, the number becomes a percentage. The higher the number, the more likely it
							is that the first syllables or group characters are used. (This mimics natural
							languages, which tend to prefer certain sounds and patterns.) This is how it works:
						</P>
						<P mx={space} textAlign="left"><S><B>1)</B></S> A random number is generated from 1 to 100.</P>
						<P mx={space} textAlign="left"><S><B>2)</B></S> If the number is lower than the dropoff percentage, the first choice is picked.</P>
						<P mx={space} textAlign="left"><S><B>3)</B></S> If not, the generator moves the first choice to the end of the line, then returns to step 1, generating a new number.</P>
						<P mx={space} textAlign="left"><S><B>4)</B></S> This cycle continues until a number is generated that is equal to or greater than the dropoff percentage.</P>
						<Divider />
						<Em>Pseudo-text Controls</Em>
						<P>
							{'\t\t\t'}<B>Capitalize sentences</B> determines if each sentence starts with a capital
							letter.
						</P>
						<P>
							{'\t\t\t'}The remaining options determine what your sentences look like. By default,
							three-fourths of all sentences will be <Em>declarative</Em>, one-sixth will
							be <Em>interrogative</Em> (questions), and the remaining one-twelfth will
							be <Em>exclamatory</Em>. You can put special punctuation before and after these
							sentences if you wish.
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
					//modalRef.current.scrollTo({x: 0, y: 0, animated: false});
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

export default WGContextMenu;
