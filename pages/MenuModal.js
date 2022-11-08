import React, { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import ReAnimated, {
	CurvedTransition,
	SlideInLeft,
	SlideOutLeft,
	useAnimatedStyle,
	useSharedValue
} from 'react-native-reanimated';
import {
	HStack,
	VStack,
	Pressable,
	Text as Tx,
	Modal,
	Divider,
	IconButton,
	ZStack
} from 'native-base';

import * as Icons from '../components/icons';
import { fontSizesInPx, setMenuToggleName } from '../store/appStateSlice';
import { appMenuPages } from '../appLayoutInfo';
import getSizes from '../helpers/getSizes';

const MenuModal = () => {
	const { menuToggleName } = useSelector(
		(state) => state.appState,
		shallowEqual
	);
	let [menuOpen, setMenuOpen] = useState(false);
	let [openId, setOpenId] = useState(menuToggleName || '');
	const location = useLocation();
	const dispatch = useDispatch();
	const navigator = useNavigate();
	const [menuSize, subMenuSize, headerSize] = getSizes("sm", "xs", "md")
	const lineHeight = {
		"2xs": "2xs",
		xs: "2xs",
		sm: "xs",
		md: "sm"
	}[subMenuSize] || "md";
	const menuHeight = (fontSizesInPx[menuSize] * 2) + 12;
	const subMenuHeight = (fontSizesInPx[subMenuSize] * 2) + 8;
	const Text = (props) => <Tx lineHeight={lineHeight} {...props} />;
	const fontSizeAdjustments = {
		"-1": subMenuSize,
		"+1": headerSize
	};
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
	};
	const closeMenu = () => {
		// Close menu
		setMenuOpen(false);
		// Save current state
		dispatch(setMenuToggleName(openId));
	};
	let decrementingZIndex = 1001;
	const renderItem = (item) => {
		const {
			icon,
			id,
			title,
			menuTitle,
			url,
			kids,
			divider,
			isChildOf
		} = item;
		decrementingZIndex -= 1;
		if(divider) {
			return (
				<Divider
					zIndex={decrementingZIndex}
					key={id}
					my={2}
					mx="auto"
					w="5/6"
					bg="text.50"
					opacity={25}
				/>);
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
					style={{height: menuHeight}}
					w="full"
					bg="main.800"
				>
					<ZStack>
						<HStack
							style={{height: menuHeight}}
							w="full"
							{...bgOptions}
							opacity={20}
						/>
						<HStack
							style={{height: menuHeight}}
							alignItems="center"
							w="full"
							justifyContent="flex-start"
						>
							<VStack
								alignItems="center"
								justifyContent="center"
								m={2}
								minW={6}
							>
								{icon ? Icons[icon](textOptions) : <></>}
							</VStack>
							<VStack
								alignItems="flex-start"
								justifyContent="center"
								flex={1}
								m={2}
							>
								<Text
									textAlign="left"
									isTruncated
									fontSize={menuSize}
									{...textOptions}
								>{menuTitle || title}</Text>
							</VStack>
							<ReAnimated.View
								 style={{
									...caretAnimationStyle,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									margin: 8, // Same as {2}
									marginLeft: 0
								}}
			 				>
								<Icons.CaretIcon
									size={menuSize}
									{...textOptions}
								/>
							</ReAnimated.View>
						</HStack>
					</ZStack>
				</Pressable>
			);
		} else if (isChildOf) {
			const isSelected = location.pathname === url;
			const dotOptions =
				isSelected ?
					{ color: "primary.500" }
				:
					{ color: "transparent" }
			;
			const textOptions = isSelected ? { color: "primary.500" } : {};
			const bgOptions = isSelected ? { bg: "primary.500" } : {};
			return (
				<ReAnimated.View
					key={id}
					entering={SlideInLeft}
					exiting={SlideOutLeft}
					layout={CurvedTransition}
					style={{
						zIndex: decrementingZIndex,
						height: subMenuHeight,
						flex: 1
					}}
				>
					<Pressable
						onPress={() => navigate(url)}
						bg="darker"
						style={{height: subMenuHeight}}
					>
						<ZStack>
							<HStack
								style={{height: subMenuHeight}}
								w="full"
								{...bgOptions}
								opacity={10}
							/>
							<HStack
								w="full"
								style={{height: subMenuHeight}}
								alignItems="center"
								justifyContent="flex-end"
							>
								<VStack
									alignItems="flex-end"
									justifyContent="center"
									flex={1}
									m={2}
									ml={4}
								>
									<Text
										textAlign="right"
										fontSize={subMenuSize}
										{...textOptions}
										isTruncated
									>{menuTitle || title}</Text>
								</VStack>
								<VStack
									alignItems="center"
									justifyContent="center"
									m={2}
									minW={4}
									ml={0}
								>
									<Icons.DotIcon {...dotOptions}/>
								</VStack>
							</HStack>
						</ZStack>
					</Pressable>
				</ReAnimated.View>
			);
		}
		// App Section (standalone)
		const fontOptions = item.fontOptions || {};
		const fontSize = item.fontAdjustment ? fontSizeAdjustments[item.fontAdjustment] : menuSize;
		const styleOptions = item.styleOptions || {};
		const alignOptions = item.alignOptions || {};
		const isSelected = location.pathname === url;
		const bgOptions = isSelected ? { bg: "primary.500" } : {};
		const boxOptions =
			isSelected ?
				{ color: "primary.500", ...styleOptions }
			:
				{ color: "transparent", ...styleOptions }
		;
		const textOptions = {
			fontSize,
			...(isSelected ?
				{ color: "primary.500" }
			:
				{}
			),
			...fontOptions
		};
		return (
			<Pressable
				onPress={() => navigate(url)}
				zIndex={decrementingZIndex}
				key={id}
				style={{height: menuHeight}}
				w="full"
				bg="main.800"
			>
				<ZStack>
					<HStack
						style={{height: menuHeight}}
						w="full"
						{...bgOptions}
						opacity={20}
					/>
					<HStack
						w="full"
						style={{height: menuHeight}}
						alignItems="center"
						justifyContent="flex-start"
						{...boxOptions}
					>
					<VStack
						alignItems="center"
						justifyContent="center"
						m={2}
						minW={6}
					>
						{icon ? Icons[icon](textOptions) : <></>}
					</VStack>
					<VStack
						alignItems="flex-start"
						justifyContent="center"
						flex={1}
						m={2}
						{...alignOptions}
					>
						<Text fontSize={menuSize} {...textOptions}>{menuTitle || title}</Text>
					</VStack>
				</HStack>
				</ZStack>
			</Pressable>
		);
	};
	return (
		<>
			<Modal
				h="full"
				isOpen={menuOpen}
				onClose={() => closeMenu()}
				animationPreset="slide"
				_slide={{delay: 0, placement: "left"}}
			>
				<Modal.Content
					borderRadius={0}
					alignItems="flex-start"
					justifyContent="flex-start"
					style={{shadowOpacity: 0}}
					w="full"
					maxWidth="full"
					minHeight="full"
				>
					<Modal.Header
						borderBottomWidth={0}
						h={0}
					/>
					<Modal.Body
						h="full"
						minHeight="full"
						maxHeight="full"
						p={0}
						m={0}
					>
						<VStack
							mb={3}
							p={2}
							w="full"
							mr={5}
						>
							<Text fontSize={menuSize}>
								<Tx bold fontSize={headerSize}>Conlang Toolbox</Tx>{"\n"}
								<Tx color="primary.200">tools for language invention</Tx>
							</Text>
						</VStack>
						<VStack
							m={0}
							p={0}
						>
							{
								appMenuPages
									.filter(
										({isChildOf}) =>
											!isChildOf || isChildOf === openId
									)
									.map((page) => renderItem(page))
							}
						</VStack>
					</Modal.Body>
					<Modal.Footer
						borderTopWidth={0}
						h={0}
					/>
				</Modal.Content>
			</Modal>
			<IconButton
				variant="ghost"
				icon={<Icons.MenuIcon color="text.50" size={menuSize} />}
				onPress={() => setMenuOpen(true)}
				flexGrow={0}
				flexShrink={0}
			/>
		</>
	);
};

export default MenuModal;
