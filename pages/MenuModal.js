import { Factory, Heading, HStack, VStack, Pressable, Text, Modal, Divider, IconButton, ZStack } from 'native-base';
import { useLocation, useNavigate } from "react-router-dom";

import * as Icons from '../components/icons';
//import Header from '../components/Header';
import React, { useState, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setMenuToggleNumber, setMenuToggleName } from '../store/appStateSlice';
import { Animated } from 'react-native';
import { appMenuPages } from '../appLayoutInfo';

const AnimatedView = Factory(Animated.View);

const MenuModal = ({ scrollToTop }) => {
	const {menuToggleName, menuToggleNumber} = useSelector((state) => state.appState, shallowEqual);
	let [menuOpen, setMenuOpen] = useState(false);
	let [openSectionNumber, setOpenSectionNumber] = useState(menuToggleNumber || 0);
	let [openSectionName, setOpenSectionName] = useState(menuToggleName || '');
	const location = useLocation();
	const dispatch = useDispatch();
	const navigator = useNavigate();
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
			0,	// make a dead zone before this
			0,	// begin this zone
			5,	// end this zone
			0,	// start another dead zone
			0,	// continue the dead zone after this
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
	const getSubsectionInterpolationInfo = (childrenNumber) => {
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
			36 * childrenNumber,	// end this zone (equal to height={9})
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
	const navigate = (url) => {
		navigator(url);
		scrollToTop();
		closeMenu();
	};
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
						<VStack mb={3} p={2} w="full" mr={5}>
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
								const { icon, id, title, menuTitle, url, children } = page;
								if(children) {
									// App Section w/subpages
									const isSelected = location.pathname.startsWith(url);
									const bgOptions = isSelected ? { bg: "primary.500" } : {};
									const textOptions = isSelected ? { color: "primary.500" } : {};
									// Get new information for this section
									const { rotateInterpolator, translateInterpolator, begin, end } = getToggleInterpolationInfo();
									const thisSectionAnimationValue = useRef(new Animated.Value(openSectionNumber)).current;
									sectionAnimationValues[id] = [thisSectionAnimationValue, begin, end];
									// Note that we have a new section
									numberOfSections++;
									sectionAnimationValues.orderedList.push(id);
									output.push(
										<Pressable key={sectionId + "-" + id} height={10} onPress={() => toggleSection(id, begin, end)} w="full">
											<ZStack>
												<HStack height={10} w="full" {...bgOptions} opacity={20} />
												<HStack height={10} alignItems="center" w="full" justifyContent="flex-start">
													<VStack alignItems="center" justifyContent="center" m={2} minW={6}>
														{icon ? Icons[icon](textOptions) : <></>}
													</VStack>
													<VStack alignItems="flex-start" justifyContent="center" flex={1} m={2} textAlign="right">
														<Text {...textOptions}>{menuTitle || title}</Text>
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
									// Deal with the kids
									const interpolator = getSubsectionInterpolationInfo(children.length);
									const kidsSectionAnimationValue = sectionAnimationValues[id][0];
									output.push((
										<AnimatedView
											key={sectionId + "-" + id + '-AllChildren'}
											m={0}
											bg="darker"
											p={0}
											d="flex"
											justifyContent="center"
											style={[{
												height: kidsSectionAnimationValue.interpolate(interpolator),
												minHeight: kidsSectionAnimationValue.interpolate(interpolator),
												overflow: "hidden"
											}]}
										>
											{children.map(child => {
												const { id, title, menuTitle, url } = child;
												const isSelected = location.pathname === url;
												const dotOptions = isSelected ? { color: "primary.500" } : { color: "transparent" };
												const textOptions = isSelected ? { color: "primary.500" } : {};
												const bgOptions = isSelected ? { bg: "primary.500" } : {};
												return (
													<Pressable key={sectionId + "-" + id + '-' + id} height={9} w="full" onPress={() => navigate(url)}>
													<ZStack>
														<HStack height={9} w="full" {...bgOptions} opacity={10} />
														<HStack w="full" height={9} alignItems="center" justifyContent="flex-end">
															<VStack alignItems="flex-end" justifyContent="center" flex={1} m={2} ml={4}>
																<Text textAlign="right" fontSize="xs" {...textOptions}>{menuTitle || title}</Text>
															</VStack>
															<VStack alignItems="center" justifyContent="center" m={2} minW={4}>
																<Icons.DotIcon {...dotOptions} />
															</VStack>
														</HStack>
													</ZStack>
													</Pressable>
												);
											})}
										</AnimatedView>
									));
								} else {
									// App Section (standalone)
									const fontOptions = page.fontOptions || {};
									const styleOptions = page.styleOptions || {};
									const alignOptions = page.alignOptions || {};
									const isSelected = location.pathname === url;
									const bgOptions = isSelected ? { bg: "primary.500" } : {};
									const boxOptions = isSelected ? { color: "primary.500", ...styleOptions } : { color: "transparent", ...styleOptions };
									const textOptions = isSelected ? { color: "primary.500", fontOptions } : fontOptions;
									output.push(
										<Pressable key={sectionId + "-" + id} h={10} onPress={() => navigate(url)} w="full">
											<ZStack>
												<HStack height={10} w="full" {...bgOptions} opacity={20} />
												<HStack w="full" height={10} alignItems="center" justifyContent="flex-start" {...boxOptions}>
												<VStack alignItems="center" justifyContent="center" m={2} minW={6}>
													{icon ? Icons[icon](textOptions) : <></>}
												</VStack>
												<VStack alignItems="flex-start" justifyContent="center" flex={1} m={2} {...alignOptions}>
													<Text {...textOptions}>{menuTitle || title}</Text>
												</VStack>
											</HStack>
											</ZStack>
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

export default MenuModal;
