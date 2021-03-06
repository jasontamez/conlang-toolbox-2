import React, { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import ReAnimated, { CurvedTransition, SlideInLeft, SlideOutLeft, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
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
	ZStack
} from 'native-base';

import * as Icons from '../components/icons';
import { setMenuToggleName } from '../store/appStateSlice';
import { appMenuPages } from '../appLayoutInfo';

const ReAnimatedView = Factory(ReAnimated.View);

const MenuModal = ({ scrollToTop }) => {
	const menuToggleName = useSelector((state) => state.appState.menuToggleName, shallowEqual);
	let [menuOpen, setMenuOpen] = useState(false);
	let [openId, setOpenId] = useState(menuToggleName || '');
	const location = useLocation();
	const dispatch = useDispatch();
	const navigator = useNavigate();
	let allAnimationValues = {};
	const toggleSection = (parentId) => {
		const target = allAnimationValues[parentId];
		if(openId === parentId) {
			// Closing this section
			setOpenId('');
			target.value = 0;
		} else {
			if (openId) {
				// Closing another section and opening this one
				allAnimationValues[openId].value = 0;
			}
			// Opening this section
			setOpenId(parentId);
			target.value = 2;
		}
	};
	const navigate = (url) => {
		// Close this menu
		closeMenu();
		// Go to page
		navigator(url);
		// Scroll the page to the top
		scrollToTop();
	};
	const closeMenu = () => {
		// Close menu
		setMenuOpen(false);
		// Save current state
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
			const caretAnimationValue = useSharedValue(id === openId ? 2 : 0);
			allAnimationValues[id] = caretAnimationValue;
			const caretAnimationStyle = useAnimatedStyle(() => {
				return {
					transform: [
						{rotate: String(caretAnimationValue.value * 45) + "deg"},
						{translateY: caretAnimationValue.value},
						{translateX: caretAnimationValue.value}
					]
				}
			});
			return (
				<Pressable
					onPress={() => toggleSection(id)}
					zIndex={decrementingZIndex}
					key={id}
					h={10}
					w="full"
					bg="main.800"
				>
					<ZStack>
						<HStack height={10} w="full" {...bgOptions} opacity={20} />
						<HStack height={10} alignItems="center" w="full" justifyContent="flex-start">
							<VStack alignItems="center" justifyContent="center" m={2} minW={6}>
								{icon ? Icons[icon](textOptions) : <></>}
							</VStack>
							<VStack alignItems="flex-start" justifyContent="center" flex={1} m={2} textAlign="right">
								<Text {...textOptions}>{menuTitle || title}</Text>
							</VStack>
							<ReAnimatedView 
								 style={caretAnimationStyle}
								 d="flex"
								 alignItems="center"
								 justifyContent="center"
								 m={2}
								 ml={0}
			 				>
								<Icons.CaretIcon {...textOptions} />
							</ReAnimatedView>
						</HStack>
					</ZStack>
				</Pressable>
			);
		} else if (isChildOf) {
			const isSelected = location.pathname === url;
			const dotOptions = isSelected ? { color: "primary.500" } : { color: "transparent" };
			const textOptions = isSelected ? { color: "primary.500" } : {};
			const bgOptions = isSelected ? { bg: "primary.500" } : {};
			return (
				<ReAnimatedView
					entering={SlideInLeft}
					exiting={SlideOutLeft}
					layout={CurvedTransition}
					zIndex={decrementingZIndex}
					key={id}
					h={9}
					w="full"
					bg="main.800"
				>
					<Pressable onPress={() => navigate(url)} bg="darker" h={9}>
						<ZStack>
							<HStack height={9} w="full" {...bgOptions} opacity={10} />
							<HStack w="full" height={9} alignItems="center" justifyContent="flex-end">
								<VStack alignItems="flex-end" justifyContent="center" flex={1} m={2} ml={4}>
									<Text textAlign="right" fontSize="xs" {...textOptions}>{menuTitle || title}</Text>
								</VStack>
								<VStack alignItems="center" justifyContent="center" m={2} minW={4} ml={0}>
									<Icons.DotIcon {...dotOptions} />
								</VStack>
							</HStack>
						</ZStack>
					</Pressable>
				</ReAnimatedView>
			);
		}
		// App Section (standalone)
		const fontOptions = item.fontOptions || {};
		const styleOptions = item.styleOptions || {};
		const alignOptions = item.alignOptions || {};
		const isSelected = location.pathname === url;
		const bgOptions = isSelected ? { bg: "primary.500" } : {};
		const boxOptions = isSelected ? { color: "primary.500", ...styleOptions } : { color: "transparent", ...styleOptions };
		const textOptions = isSelected ? { color: "primary.500", fontOptions } : fontOptions;
		return (
			<Pressable
				onPress={() => navigate(url)}
				zIndex={decrementingZIndex}
				key={id}
				h={10}
				w="full"
				bg="main.800"
			>
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
	};
	return (
		<>
			<Modal h="full" isOpen={menuOpen} onClose={() => closeMenu()} animationPreset="slide" _slide={{delay: 0, placement: "left"}}>
				<Modal.Content borderRadius={0} alignItems="flex-start" justifyContent="flex-start" style={{shadowOpacity: 0}} w="full" maxWidth="full" minHeight="full">
					<Modal.Header borderBottomWidth={0} h={0} m={0} p={0} />
					<Modal.Body h="full" minHeight="full" maxHeight="full" p={0} m={0}>
						<VStack mb={3} p={2} w="full" mr={5}>
							<Heading size="md">Conlang Toolbox</Heading>
							<Text fontSize="sm" color="primary.200">tools for language invention</Text>
						</VStack>
						<VStack m={0} p={0}>
							{
								appMenuPages
									.filter(page => !page.isChildOf || page.isChildOf === openId)
									.map((page) => renderItem(page))
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
