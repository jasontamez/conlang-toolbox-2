import { Box, Heading, HStack, VStack, Pressable as Press, Text, Modal, Divider, IconButton } from 'native-base';
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
	SettingsIcon,
	CaretIcon
} from '../components/icons';
//import Header from '../components/Header';
import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMenuToggleOpen } from '../store/appStateSlice';
import { MenuIcon } from "../components/icons";
import { Animated } from 'react-native';

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


const Menu = () => {
	const toggledMenuSectionNumber = useSelector((state) => state.appState.menuToggleNumber);
	const toggledMenuSectionName = useSelector((state) => state.appState.menuToggleName);
	let [menuOpen, setMenuOpen] = useState(false);
	let [openSectionNumber, setOpenSectionNumber] = useState(toggledMenuSectionNumber || 0);
	let [openSectionName, setOpenSectionName] = useState(toggledMenuSectionName || '');
	//const location = useLocation();
	const dispatch = useDispatch();
	let toDispatch = 0;
	const openSectionInfo = useRef(new Animated.Value(openSectionNumber)).current;
	let numberOfSections = 0;
	let sectionInterpolationInfo = [];
	const getNewInterpolationInfo = () => {
		// additive starts at 0, goes up by 100s
		const additive = numberOfSections * 100;
		// create the input range
		const begin = 0 + additive;
		const end = 90 + additive;
		const inputRange = [
			-1 + additive,	// -1, 99, 199...
			begin,			// 0, 100, 200...
			end,			// 90, 190, 290...
			91 + additive,	// 91, 191, 291...
			92 + additive	// 92, 192, 292...
		];
		// create the output range
		const outputRange = [
			"0deg",		// make a dead zone before this
			"0deg",		// end this zone
			"90deg",	// end this zone
			"0deg",		// start another dead zone
			"0deg",		// continue the dead zone after this
		];
		// Note that we have a new section
		numberOfSections++;
		// Save the new range
		sectionInterpolationInfo.push([begin, end]);
		// Return info
		return {
			interpolator: { inputRange, outputRange },
			begin,
			end
		};
	};
	const toggleSection = (sectionName, beginValue, endValue) => {
		let newValue = endValue;
		if((openSectionNumber < beginValue || openSectionNumber > endValue)) {
			// We're not at the correct section
			if(openSectionName) {
				// Another section is open. Find it.
				let begin = -1, c = 0;
				while(begin < 0) {
					let [b, e] = sectionInterpolationInfo[c];
					if(openSectionNumber >= b && openSectionNumber <= e) {
						// This is the open section
						begin = b;
					}
					// Not this section
					c++;
				}
				// Section should be found.
				// Close the open section quickly, then open the new section afterward.
				Animated.timing(openSectionInfo, {
					toValue: begin,
					duration: 150,
					useNativeDriver: true
				}).start(() => {
					openSectionInfo.setValue(beginValue);
					Animated.timing(openSectionInfo, {
						toValue: endValue,
						duration: 350,
						useNativeDriver: true
					}).start();
				});
			} else {
				// Reset to the "closed" state of our current section, then animate
				openSectionInfo.setValue(beginValue);
				Animated.timing(openSectionInfo, {
					toValue: newValue,
					duration: 500,
					useNativeDriver: true
				}).start();
			}
		} else {
			// No other section open
			if(sectionName === openSectionName) {
				// We're closing our section
				newValue = beginValue;
			}
			Animated.timing(openSectionInfo, {
				toValue: newValue,
				duration: 500,
				useNativeDriver: true
			}).start();
		}
		setOpenSectionNumber(newValue);
		setOpenSectionName(sectionName === openSectionName ? '' : sectionName);
	}
	const navigate = useNavigate();
	const Pressable = (props) => (
		<Press onPress={() => navigate(props.url)}>{props.children}</Press>
	);
	const Toggleable = (props) => (
		<Press onPress={() => toggleSection(props.sectionName, props.beginValue, props.endValue)}>{props.children}</Press>
	);
	const closeMenu = () => {
		// Save current state
		dispatch(setMenuToggleOpen(toDispatch));
		// Close menu
		setMenuOpen(false);
	};
	return (
		<>
			<Modal h="full" isOpen={menuOpen} onClose={() => closeMenu()} animationPreset="slide" _slide={{delay: 0, placement: "left"}}>
				<Modal.Content w="full" maxWidth="full" maxHeight="full">
					<Modal.Header borderBottomWidth={0} h={0} m={0} p={0} />
					<Modal.Body p={0}>
						<VStack mb={3} p={2}>
							<Heading size="md">Conlang Toolbox</Heading>
							<Text fontSize="sm" color="primary.200">tools for language invention</Text>
						</VStack>
						{appMenuPages.map((section, i) => {
							const sectionId = section.id;
							const pages = section.pages;
							let output = [];
							if(i) {
								// Add a divider between sections
								output.push(<Divider key={"Divider"+String(i)} my={4} mx={1} />);
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
									// Get new information for this section
									const { interpolator, begin, end } = getNewInterpolationInfo();
									output.push(
										<Toggleable key={sectionId + "-" + id} sectionName={parentOf} beginValue={begin} endValue={end}>
											<HStack alignItems="space-between" justifyContent="center">
												<Box m={2}>{icon}</Box>
												<Box flexGrow={1} m={2} textAlign="end"><Text>{title}</Text></Box>
												<Animated.View style={[{transform: [{rotate: openSectionInfo.interpolate(interpolator)}]}]}>
													<CaretIcon m={2} />
												</Animated.View>
											</HStack>
										</Toggleable>
									);
								} else if (childId) {
									// Sub-page of App Section
									output.push(
										<Pressable key={sectionId + "-" + id} url={url}>
											<Text>{icon}{title}</Text>
										</Pressable>
									);
								} else {
									// App Section (standalone)
									output.push(
										<Pressable key={sectionId + "-" + id} url={url}>
											<Text>{icon}{title}</Text>
										</Pressable>
									);
								}
							});
							return <VStack w="full" key={"Stack" + String(i)}>{output}</VStack>;
						})}
					</Modal.Body>
					<Modal.Footer borderTopWidth={0} h={0} m={0} p={0} />
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
			<IconButton variant="ghost" icon={<MenuIcon color="text.50" />} onPress={() => setMenuOpen(true)} />
		</>
	);
};

export default Menu;
