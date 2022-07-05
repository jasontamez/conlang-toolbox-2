import { Box, Heading, HStack, VStack, Pressable as Press, Text, Modal, Divider } from 'native-base';
import { useLocation, useNavigate } from "react-router-dom";

import {
	DeclenjugatorIcon,
	DotIcon,
	LexiconIcon,
	MorphoSyntaxIcon,
	PhonoGraphIcon,
	WordEvolveIcon,
	WordGenIcon,
	WordListsIcon,
	AboutIcon,
	SettingsIcon
} from '../components/icons';
//import Header from '../components/Header';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMenuToggleOpen } from '../store/appStateSlice';

const appMenuPages = [
	{
		pages: [
			{
				title: 'MorphoSyntax',
				url: '/ms',
				icon: <MorphoSyntaxIcon />,
				id: 'menuitemSyntax',
				parentOf: 'ms'
			},
			{
				title: 'Settings',
				url: '/ms/msSettings',
				id: 'menuitemMSSettings',
				childId: 'ms'
			},
			{
				title: '1. Morphological Typology',
				url: '/ms/ms01',
				id: 'menuitemMS1',
				childId: 'ms'
			},
			{
				title: '2. Grammatical Categories',
				url: '/ms/ms02',
				id: 'menuitemMS2',
				childId: 'ms'
			},
			{
				title: '3. Constituent Order Typology',
				url: '/ms/ms03',
				id: 'menuitemMS3',
				childId: 'ms'
			},
			{
				title: '4. Noun Operations',
				url: '/ms/ms04',
				id: 'menuitemMS4',
				childId: 'ms'
			},
			{
				title: '5. Predicate Nominals etc.',
				url: '/ms/ms05',
				id: 'menuitemMS5',
				childId: 'ms'
			},
			{
				title: '6. Grammatical Relations',
				url: '/ms/ms06',
				id: 'menuitemMS6',
				childId: 'ms'
			},
			{
				title: '7. Voice/Valence Operations',
				url: '/ms/ms07',
				id: 'menuitemMS7',
				childId: 'ms'
			},
			{
				title: '8. Other Verb Operations',
				url: '/ms/ms08',
				id: 'menuitemMS8',
				childId: 'ms'
			},
			{
				title: '9. Pragmatic Marking',
				url: '/ms/ms09',
				id: 'menuitemMS9',
				childId: 'ms'
			},
			{
				title: '10. Clause Combinations',
				url: '/ms/ms10',
				id: 'menuitemMS10',
				childId: 'ms'
			},
			{
				title: 'WordGen',
				url: '/wg',
				icon: <WordGenIcon />,
				id: 'menuitemWG',
				parentOf: 'wg'
			},
			{
				title: 'Character Groups',
				url: '/wg/categories',
				id: 'menuitemWGcat',
				childId: 'wg'
			},
			{
				title: 'Syllables',
				url: '/wg/syllables',
				id: 'menuitemWGsyl',
				childId: 'wg'
			},
			{
				title: 'Transformations',
				url: '/wg/rewriterules',
				id: 'menuitemWGrew',
				childId: 'wg'
			},
			{
				title: 'Output',
				url: '/wg/output',
				id: 'menuitemWGout',
				childId: 'wg'
			},
			{
				title: 'Settings',
				url: '/wg/settings',
				id: 'menuitemWGset',
				childId: 'wg'
			},
			{
				title: 'WordEvolve',
				url: '/we',
				icon: <WordEvolveIcon />,
				id: 'menuitemWE',
				parentOf: 'we'
			},
			{
				title: 'Input',
				url: '/we/input',
				id: 'menuitemWEinp',
				childId: 'we'
			},
			{
				title: 'Character Groups',
				url: '/we/categories',
				id: 'menuitemWEcat',
				childId: 'we'
			},
			{
				title: 'Transformations',
				url: '/we/transformations',
				id: 'menuitemWEtns',
				childId: 'we'
			},
			{
				title: 'Sound Changes',
				url: '/we/soundchanges',
				id: 'menuitemWEscs',
				childId: 'we'
			},
			{
				title: 'Output',
				url: '/we/output',
				id: 'menuitemWEout',
				childId: 'we'
			},
			{
				title: 'Declenjugator',
				url: '/dc',
				icon: <DeclenjugatorIcon />,
				id: 'menuitemDC'
			}, // https://github.com/apache/cordova-plugin-media
			{
				title: 'PhonoGraph',
				url: '/ph',
				icon: <PhonoGraphIcon />,
				id: 'menuitemPG'
			},
			{
				title: 'Lexicon',
				url: '/lex',
				icon: <LexiconIcon />,
				id: 'menuitemLX'
			},
			{
				title: 'Word Lists',
				url: '/wordlists',
				icon: <WordListsIcon />,
				id: 'menuitemWL'
			}
		],
		id: 'menuMain'
	},
	{
		pages: [
			{
				title: 'Settings',
				url: '/settings',
				icon: <SettingsIcon />,
				id: 'menuitemSettings'
			},
			{
				title: 'About',
				url: '/about',
				icon: <AboutIcon />,
				id: 'menuitemAbout'
			}
		],
		id: 'menuOthers'
	},
	{
		pages: [
			{
				title: 'Credits',
				url: '/credits',
				icon: <></>,
				id: 'menuitemAbout'
			}
		],
		id: 'menuCredits'
	}
];


const Indented = (props) => (
	<HStack m={1} mx={4} justifyContent="flex-start" alignItems="flex-start">
		<DotIcon m={1} mt={2} />
		<Text>{props.children}</Text>
	</HStack>
);

const Highlight = (props) => (
	<Box alignSelf="center" textAlign="center" bg="lighter" p={2} mb={3}><Text>{props.children}</Text></Box>
);

const Pressable = (props) => (
	<Press bg="main.800" shadow={3} onPress={props.onPress}>
		<VStack p={4} pt={0}>{props.children}</VStack>
	</Press>
);

const Menu = (MenuButton) => {
	let [menuOpen, setMenuOpen] = useState(false);
	const toggledSection = useSelector((state) => state.menuToggleOpen, shallowEqual);
	const location = useLocation();
	const dispatch = useDispatch();
	const toggleTo = (toggle) => dispatch(setMenuToggleOpen(toggle === toggledSection ? '' : toggle));
	const navigate = useNavigate();
	const Pressable = (props) => (
		<Press onPress={() => navigate(props.url)}>{props.children}</Press>
	);
	const Toggleable = (props) => (
		<Press onPress={() => toggleTo(props.toggle)}>{props.children}</Press>
	);
	return (
		<>
			<Modal h="full" isOpen={menuOpen} onClose={() => setMenuOpen(false)} animationPreset="slide" _slide={{delay: 0, placement: "left"}}>
				<Modal.Content w="5/6">
					<Modal.Body>
						<VStack mb={8}>
							<Heading>Conlang Toolbox</Heading>
							<Text color="text.200">tools for language invention</Text>
						</VStack>
						{appMenuPages.map((section, i) => {
							const sectionId = section.id;
							const pages = section.pages;
							let output = [];
							if(i) {
								// Add a divider between sections
								output.push(<Divider my={4} />);
							}
							pages.forEach(page => {
								const {
									parentOf,
									childId,
									icon,
									id,
									title,
									url
								} = page;
								if(parentOf) {
									// App Section w/subpages
									output.push(
										<Toggleable key={sectionId + "-" + id} toggle={parentOf}>
											{title}
										</Toggleable>
									);
								} else if (childId) {
									// Sub-page of App Section
									output.push(
										<Pressable key={sectionId + "-" + id} url={url}>
											{icon}{title}
										</Pressable>
									);
								} else {
									// App Section (standalone)
									output.push(
										<Pressable key={sectionId + "-" + id} url={url}>
											{icon}{title}
										</Pressable>
									);
								}
							});
							return <VStack w="full">{output}</VStack>;
						})}
					</Modal.Body>
				</Modal.Content>
		{/*<VStack h="full" alignItems="stretch" justifyContent="space-between" w="full" position="fixed" top={0} bottom={0}>
			{appMenuPages.map((menuSection) => {
				const pages = menuSection.pages.map((appPage) => {
					if(appPage.parentOf) {
						return (
							<IonItem
								key={appPage.id}
								className={
									'mainHeading'
									+ (location.pathname.startsWith(appPage.url) ? ' selected' : '')
									+ (toggledSection === appPage.parentOf ? ' toggled' : '')
								}
								onPress={
									() => dispatch(
										toggleTo(
											toggledSection === appPage.parentOf
												? ''
												: appPage.parentOf
										)
									)
								}
							>
								<IonIcon slot="start" icon={appPage.icon} />
								<IonLabel>{appPage.title}</IonLabel>
								<IonIcon className="caret" slot="end" icon={caretForwardSharp} />
							</IonItem>
						);
					} else if(appPage.parent) {
						return (
							<IonMenuToggle key={appPage.id} autoHide={false}>
								<IonItem className={'subHeading' + (location.pathname.startsWith(appPage.url) ? ' selected' : '') + (toggledSection === appPage.parent ? '' : ' hidden')} routerLink={appPage.url} routerDirection="forward" lines="none" detail={false}>
									<IonLabel>{appPage.title}</IonLabel>
									<IonIcon slot="end" size="small" icon={ellipseSharp} />
								</IonItem>
							</IonMenuToggle>
						);
					}
					return (
						<IonMenuToggle key={appPage.id} autoHide={false}>
							<IonItem className={'mainHeading' + (location.pathname.startsWith(appPage.url) ? ' selected' : '')} routerLink={appPage.url} routerDirection="forward" lines="none" detail={false}>
								{appPage.icon ? (<IonIcon slot="start" icon={appPage.icon} />) : ""}
								<IonLabel>{appPage.title}</IonLabel>
							</IonItem>
						</IonMenuToggle>
					);
				});
				let head = (menuSection.header) ? (<IonListHeader>{menuSection.header}</IonListHeader>) : <></>,
					note = (menuSection.note) ? (<IonNote>{menuSection.note}</IonNote>) : <></>;
				return (
					<IonList key={menuSection.id} id={menuSection.id}>
						{head}{note}
						{pages}
					</IonList>
				);
			})}
		</VStack>*/}
			</Modal>
			<MenuButton onPress={() => setMenuOpen(true)} />
		</>
	);
};

export default Menu;
