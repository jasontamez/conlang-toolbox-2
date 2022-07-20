import React, { useState, useRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Animated } from 'react-native';
import { useLocation, useNavigate } from "react-router-dom";
import ReAnimated, { SlideInDown, SlideOutUp, Layout } from 'react-native-reanimated';
import {
	Factory,
	Heading,
	HStack,
	VStack,
	Pressable,
	Text,
	Modal,
	Divider,
	IconButton,
	ZStack,
	FlatList
} from 'native-base';

import * as Icons from '../components/icons';
import { setMenuToggleNumber, setMenuToggleName } from '../store/appStateSlice';
import { appMenuPages } from '../appLayoutInfo';

const ReAnimatedView = Factory(ReAnimated.View);

const MenuModal = ({ scrollToTop }) => {
	const {menuToggleName, menuToggleNumber} = useSelector((state) => state.appState, shallowEqual);
	let [menuOpen, setMenuOpen] = useState(false);
	let [openFamilyNumber, setOpenFamilyNumber] = useState(menuToggleNumber || 0);
	let [openId, setOpenId] = useState(menuToggleName || '');
	const location = useLocation();
	const dispatch = useDispatch();
	const navigator = useNavigate();
	let numberOfFamilies = 0;
	let allAnimationValues = {
		orderedList: []
	};
	const getToggleInterpolationInfo = () => {
		// additive starts at 0, goes up by 100s
		const additive = numberOfFamilies * 100;
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
			2,	// end this zone
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
	const toggleSection = (parentId) => {
		// Rotates the icon on the parent and shows/hides the kids
		const [familyAnimationValue, beginValue, endValue] = allAnimationValues[parentId];
		let newValue = endValue;
		if((openFamilyNumber < beginValue || openFamilyNumber > endValue)) {
			// We're not at the correct section
			if(openId) {
				// Another section is open. Find it.
				let sanityCounter = 0;
				const animations = [];
				const orderedList = allAnimationValues.orderedList;
				while(true) {
					let [sectionInfo, b, e] = allAnimationValues[orderedList[sanityCounter]];
					if(openFamilyNumber >= b && openFamilyNumber <= e) {
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
					sanityCounter++;
					if(sanityCounter >= numberOfFamilies) {
						// We've run out of options, somehow.
						console.log("ERROR: ran out of sections?!?");
						// Just go on as if there was no other section open.
					}
				}
				// Section should be found.
				// Add the animation for the current section we're opening.
				animations.push(Animated.timing(familyAnimationValue, {
					toValue: endValue,
					duration: 500,
					useNativeDriver: true
				}))
				// Run animation(s) simultaneously
				Animated.parallel(animations).start();
			} else {
				// Reset to the "closed" state of our current section, then animate it opening
				familyAnimationValue.setValue(beginValue);
				Animated.timing(familyAnimationValue, {
					toValue: newValue,
					duration: 500,
					useNativeDriver: true
				}).start();
			}
		} else {
			// No other section open
			if(parentId === openId) {
				// We're closing our section
				newValue = beginValue;
			}
			Animated.timing(familyAnimationValue, {
				toValue: newValue,
				duration: 500,
				useNativeDriver: false
			}).start();
		}
		setOpenFamilyNumber(newValue);
		setOpenId(parentId === openId ? '' : parentId);
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
		dispatch(setMenuToggleNumber(openFamilyNumber));
		dispatch(setMenuToggleName(openId));
	};
	let decrementingZIndex = 1001;
	const renderItem = (item) => {
		const {icon, id, title, menuTitle, url, kids, divider, isChildOf} = item;
		decrementingZIndex -= 1;
		if(divider) {
			return <Divider zIndex={decrementingZIndex} key={id} my={2} mx="auto" w="90%" bg="text.50" opacity={25} />
		} else if (kids) {
			// App Section w/subpages
			const isSelected = location.pathname.startsWith(url);
			const bgOptions = isSelected ? { bg: "primary.500" } : {};
			const textOptions = isSelected ? { color: "primary.500" } : {};
			// Get new information for this section
			const { rotateInterpolator, translateInterpolator, begin, end } = getToggleInterpolationInfo();
			const thisFamilyAnimationValue = useRef(new Animated.Value(openFamilyNumber)).current;
			allAnimationValues[id] = [thisFamilyAnimationValue, begin, end];
			// Note that we have a new section
			numberOfFamilies++;
			allAnimationValues.orderedList.push(id);
			return (
				<ReAnimatedView
					entering={SlideInDown.duration(2000)}
					exiting={SlideOutUp}
					layout={Layout.springify()}
					zIndex={decrementingZIndex}
					key={id}
					h={10}
					w="full"
				>
					<Pressable onPress={() => toggleSection(id)}>
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
												{ rotate: thisFamilyAnimationValue.interpolate(rotateInterpolator) },
												{ translateX: thisFamilyAnimationValue.interpolate(translateInterpolator) },
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
				</ReAnimatedView>
			);
		} else if (isChildOf) {
			const isSelected = location.pathname === url;
			const dotOptions = isSelected ? { color: "primary.500" } : { color: "transparent" };
			const textOptions = isSelected ? { color: "primary.500" } : {};
			const bgOptions = isSelected ? { bg: "primary.500" } : {};
			return (
				<ReAnimatedView
					entering={SlideInDown.duration(2000)}
					exiting={SlideOutUp}
					layout={Layout.springify()}
					zIndex={decrementingZIndex}
					key={id}
					h={9}
					w="full"
					bg="darker"
				>
					<Pressable onPress={() => navigate(url)}>
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
				</ReAnimatedView>
			);
		} else {
			// App Section (standalone)
			const fontOptions = item.fontOptions || {};
			const styleOptions = item.styleOptions || {};
			const alignOptions = item.alignOptions || {};
			const isSelected = location.pathname === url;
			const bgOptions = isSelected ? { bg: "primary.500" } : {};
			const boxOptions = isSelected ? { color: "primary.500", ...styleOptions } : { color: "transparent", ...styleOptions };
			const textOptions = isSelected ? { color: "primary.500", fontOptions } : fontOptions;
			return (
				<ReAnimatedView
					entering={SlideInDown.duration(2000)}
					exiting={SlideOutUp}
					layout={Layout.springify()}
					zIndex={decrementingZIndex}
					key={id}
					h={10}
					w="full"
				>
					<Pressable onPress={() => navigate(url)}>
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
				</ReAnimatedView>
			);
		}
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
						<VStack m={0} p={0}>
							{
							appMenuPages.filter(
									page => !page.isChildOf || page.isChildOf === openId
								).map(
									(page) => renderItem(page)
								)
							}
						</VStack>
					</Modal.Body>
					<Modal.Footer borderTopWidth={0} h={0} m={0} p={0} />
				</Modal.Content>
			</Modal>
			<IconButton variant="ghost" icon={<Icons.MenuIcon color="text.50" />} onPress={() => setMenuOpen(true)} />
		</>
	);
};

export default MenuModal;
