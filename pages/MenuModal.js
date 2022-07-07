import { Factory, Heading, HStack, VStack, Pressable, Text, Modal, Divider, IconButton, ZStack } from 'native-base';
import { useLocation, useNavigate } from "react-router-dom";

import * as Icons from '../components/icons';
//import Header from '../components/Header';
import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMenuToggleNumber, setMenuToggleName } from '../store/appStateSlice';
import { Animated } from 'react-native';

const appMenuPages = [
	{
		pages: [
			{
				title: 'MorphoSyntax',
				url: '/ms',
				icon: 'MorphoSyntaxIcon',
				id: 'menuitemSyntax',
				parentId: 'ms'
			},
			{
				title: 'Settings',
				url: '/ms',
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
				icon: 'WordGenIcon',
				id: 'menuitemWG',
				parentId: 'wg'
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
				icon: 'WordEvolveIcon',
				id: 'menuitemWE',
				parentId: 'we'
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
				icon: 'DeclenjugatorIcon',
				id: 'menuitemDC'
			}, // https://github.com/apache/cordova-plugin-media ??
			{
				title: 'PhonoGraph',
				url: '/ph',
				icon: 'PhonoGraphIcon',
				id: 'menuitemPG'
			},
			{
				title: 'Lexicon',
				url: '/lex',
				icon: 'LexiconIcon',
				id: 'menuitemLX'
			},
			{
				title: 'Word Lists',
				url: '/wordlists',
				icon: 'WordListsIcon',
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
				icon: 'SettingsIcon',
				id: 'menuitemSettings'
			},
			{
				title: 'About',
				url: '/about',
				icon: 'AboutIcon',
				id: 'menuitemAbout'
			},
			{
				title: 'Credits',
				url: '/credits',
				id: 'menuitemCredits',
				fontOptions: {
					fontFamily: 'mono',
					fontSize: 'xs'
				},
				styleOptions: {
					alignItems: 'end',
					justifyContent: 'end',
					mt: 8,
					mr: 6
				},
				alignOptions: {
					alignItems: 'end'
				}
			}
		],
		id: 'menuOthers'
	}
];

const AnimatedView = Factory(Animated.View);

const Menu = () => {
	const toggledMenuSectionNumber = useSelector((state) => state.appState.menuToggleNumber);
	const toggledMenuSectionName = useSelector((state) => state.appState.menuToggleName);
	let [menuOpen, setMenuOpen] = useState(false);
	let [openSectionNumber, setOpenSectionNumber] = useState(toggledMenuSectionNumber || 0);
	let [openSectionName, setOpenSectionName] = useState(toggledMenuSectionName || '');
	const location = useLocation();
	const dispatch = useDispatch();
	let numberOfSections = 0;
	let sectionAnimationValues = {
		orderedList: []
	};
	const getToggleInterpolationInfo = () => {
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
		// create the output range - rotation
		const outputRangeRotation = [
			"0deg",		// make a dead zone before this
			"0deg",		// begin this zone
			"90deg",	// end this zone
			"0deg",		// start another dead zone
			"0deg",		// continue the dead zone after this
		];
		// create the output range - translation
		const outputRangeTranslation = [
			"0%",	// make a dead zone before this
			"0%",	// begin this zone
			"20%",	// end this zone
			"0%",	// start another dead zone
			"0%",	// continue the dead zone after this
		];
		// Return info
		return {
			rotateInterpolator: {
				inputRange,
				outputRange: outputRangeRotation
			},
			translateInterpolator: {
				inputRange,
				outputRange: outputRangeTranslation
			},
			begin,
			end
		};
	};
	const getSubsectionInterpolationInfo = () => {
		// additive starts at 0, goes up by 100s
		const additive = (numberOfSections - 1) * 100;
		// create the input range
		const inputRange = [
			-1 + additive,	// -1, 99, 199...
			0 + additive,	// 0, 100, 200...
			90 + additive,	// 90, 190, 290...
			91 + additive,	// 91, 191, 291...
			92 + additive	// 92, 192, 292...
		];
		// create the output range
		const outputRange = [
			0,	// make a dead zone before this
			0,	// begin this zone
			36,	// end this zone (equal to height={9})
			0,	// start another dead zone
			0,	// continue the dead zone after this
		];
		// Return info
		return { inputRange, outputRange };
	};
	const toggleSection = (sectionName) => {
		const [targetedSectionAnimationValue, beginValue, endValue] = sectionAnimationValues[sectionName];
		let newValue = endValue;
		if((openSectionNumber < beginValue || openSectionNumber > endValue)) {
			// We're not at the correct section
			if(openSectionName) {
				// Another section is open. Find it.
				let c = 0;
				let animations = [];
				let orderedList = sectionAnimationValues.orderedList;
				while(true) {
					let [sectionInfo, b, e] = sectionAnimationValues[orderedList[c]];
					if(openSectionNumber >= b && openSectionNumber <= e) {
						// This is the open section
						// Add animation to close the open section quickly.
						animations.push(Animated.timing(sectionInfo, {
							toValue: b,
							duration: 500,
							useNativeDriver: true
						}));
						break;
					}
					// Not this section
					c++;
					if(c >= numberOfSections) {
						// We've run out of options, somehow.
						console.log("ERROR: ran out of sections?!?");
						// Just go on as if there was no other section open.
					}
				}
				// Section should be found.
				// Add the animation for the current section we're opening.
				animations.push(Animated.timing(targetedSectionAnimationValue, {
					toValue: endValue,
					duration: 500,
					useNativeDriver: true
				}))
				// Run animation(s) simultaneously
				Animated.parallel(animations).start();
			} else {
				// Reset to the "closed" state of our current section, then animate it opening
				targetedSectionAnimationValue.setValue(beginValue);
				Animated.timing(targetedSectionAnimationValue, {
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
			Animated.timing(targetedSectionAnimationValue, {
				toValue: newValue,
				duration: 500,
				useNativeDriver: true
			}).start();
		}
		setOpenSectionNumber(newValue);
		setOpenSectionName(sectionName === openSectionName ? '' : sectionName);
	}
	const navigate = useNavigate();
	const closeMenu = () => {
		// Close menu
		setMenuOpen(false);
		// Save current state
		dispatch(setMenuToggleNumber(openSectionNumber));
		dispatch(setMenuToggleName(openSectionName));
	};
	return (
		<>
			<Modal h="full" isOpen={menuOpen} onClose={() => closeMenu()} animationPreset="slide" _slide={{delay: 0, placement: "left"}}>
				<Modal.Content alignItems="flex-start" justifyContent="flex-start" style={{shadowOpacity: 0}} w="full" maxWidth="full" minHeight="full">
					<Modal.Header borderBottomWidth={0} h={0} m={0} p={0} />
					<Modal.Body h="full" minHeight="full" maxHeight="full" p={0} m={0}>
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
								output.push(<Divider key={"Divider"+String(i)} my={2} mx="auto" w="90%" bg="text.50" opacity={25} />);
							}
							pages.forEach(page => {
								const {
									parentId,
									childId,
									icon,
									id,
									title,
									url
								} = page;
								if(parentId) {
									// App Section w/subpages
									const isSelected = location.pathname.startsWith(url);
									const bgOptions = isSelected ? { bg: "primary.500" } : {};
									const textOptions = isSelected ? { color: "primary.500" } : {};
									// Get new information for this section
									const { rotateInterpolator, translateInterpolator, begin, end } = getToggleInterpolationInfo();
									const thisSectionAnimationValue = useRef(new Animated.Value(begin)).current;
									sectionAnimationValues[parentId] = [thisSectionAnimationValue, begin, end];
									// Note that we have a new section
									numberOfSections++;
									sectionAnimationValues.orderedList.push(parentId);
									output.push(
										<Pressable height={10} onPress={() => toggleSection(parentId, begin, end)} key={sectionId + "-" + id}>
											<ZStack>
												<HStack height={10} w="full" {...bgOptions} opacity={20} />
												<HStack height={10} alignItems="center" w="full" justifyContent="flex-start">
													<VStack alignItems="center" justifyContent="center" m={2} minW={6}>
														{icon ? Icons[icon](textOptions) : <></>}
													</VStack>
													<VStack alignItems="flex-start" justifyContent="center" flexGrow={1} m={2} textAlign="end">
														<Text {...textOptions}>{title}</Text>
													</VStack>
													<VStack alignItems="center" justifyContent="center" m={2}>
														<Animated.View
															style={[{
																transform: [
																	{ rotate: thisSectionAnimationValue.interpolate(rotateInterpolator) },
																	{ translateX: thisSectionAnimationValue.interpolate(translateInterpolator) },
																	{ perspective: 1000 }
																]
															}]}
														>
															<Icons.CaretIcon {...textOptions} />
														</Animated.View>
													</VStack>
												</HStack>
											</ZStack>
										</Pressable>
									);
								} else if (childId) {
									// Sub-page of App Section
									const interpolator = getSubsectionInterpolationInfo();
									const isSelected = location.pathname === url;
									const dotOptions = isSelected ? { color: "primary.500" } : { color: "transparent" };
									const textOptions = isSelected ? { color: "primary.500" } : {};
									const thisSectionAnimationValue = sectionAnimationValues[childId][0];
									output.push(
										<AnimatedView
											key={sectionId + "-" + id}
											m={0}
											bg="darker"
											p={0}
											d="flex"
											justifyContent="center"
											style={[{
												height: thisSectionAnimationValue.interpolate(interpolator),
												minHeight: thisSectionAnimationValue.interpolate(interpolator),
												overflow: "hidden"
											}]}
										>
											<Pressable height={9} onPress={() => navigate(url)}>
												<HStack w="full" height={9} alignItems="center" justifyContent="flex-end">
													<VStack alignItems="flex-end" justifyContent="center" flexGrow={1} m={2} ml={4}>
														<Text fontSize="xs" {...textOptions}>{title}</Text>
													</VStack>
													<VStack alignItems="center" justifyContent="center" m={2} minW={4}>
														<Icons.DotIcon {...dotOptions} />
													</VStack>
												</HStack>
											</Pressable>
										</AnimatedView>
									);
								} else {
									// App Section (standalone)
									const fontOptions = page.fontOptions || {};
									const styleOptions = page.styleOptions || {};
									const alignOptions = page.alignOptions || {};
									const isSelected = location.pathname === url;
									const boxOptions = isSelected ? { color: "primary.500", ...styleOptions } : { color: "transparent", ...styleOptions };
									const textOptions = isSelected ? { color: "primary.500", fontOptions } : fontOptions;
									output.push(
										<Pressable key={sectionId + "-" + id} onPress={() => navigate(url)}>
											<HStack w="full" height={10} alignItems="center" justifyContent="flex-start" {...boxOptions}>
												<VStack alignItems="center" justifyContent="center" m={2} minW={6}>
													{icon ? Icons[icon](textOptions) : <></>}
												</VStack>
												<VStack alignItems="flex-start" justifyContent="center" flexGrow={1} m={2} {...alignOptions}>
													<Text {...textOptions}>{title}</Text>
												</VStack>
											</HStack>
										</Pressable>
									);
								}
							});
							return <VStack w="full" key={"Stack" + String(i)}>{output}</VStack>;
						})}
					</Modal.Body>
					<Modal.Footer borderTopWidth={0} h={0} m={0} p={0} />
				</Modal.Content>
			</Modal>
			<IconButton variant="ghost" icon={<Icons.MenuIcon color="text.50" />} onPress={() => setMenuOpen(true)} />
		</>
	);
};

export default Menu;
