import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import {
	HStack,
	VStack,
	Pressable,
	Text as Tx,
	Divider,
	ZStack,
	View,
	ScrollView
} from 'native-base';
import { Modal, useWindowDimensions } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';

import * as Icons from '../components/icons';
import IconButton from '../components/IconButton';
import { addPageToHistory } from '../store/historySlice';
import { fontSizesInPx, setMenuToggleName } from '../store/appStateSlice';
import { appMenuFormat } from '../appLayoutInfo';
import getSizes from '../helpers/getSizes';

const MenuModal = () => {
	const { menuToggleName } = useSelector(
		(state) => state.appState,
		shallowEqual
	);
	const [menuOpen, setMenuOpen] = useState(false);
	const [openId, setOpenId] = useState(menuToggleName || '');
	const [hasBeenToggled, setHasBeenToggled] = useState(false);
	const location = useLocation();
	const dispatch = useDispatch();
	const navigator = useNavigate();
	const { height } = useWindowDimensions();
	const [menuSize, subMenuSize, headerSize] = getSizes("sm", "xs", "md");
	const lineHeight = {
		"2xs": "2xs",
		xs: "2xs",
		sm: "xs",
		md: "sm"
	}[subMenuSize] || "md";
	const menuItemHeight = (fontSizesInPx[menuSize] * 3);
	const subMenuItemHeight = (fontSizesInPx[subMenuSize] * 2.5);
	const Text = (props) => <Tx lineHeight={lineHeight} {...props} />;
	const pathname = location.pathname;
	useEffect(() => setHasBeenToggled(false), [menuToggleName])
	const toggleSection = (parentId) => {
		if(openId === parentId) {
			// Closing this section
			setOpenId('');
		} else {
			// Opening new section
			setOpenId(parentId);
		}
		setHasBeenToggled(true);
	};
	const navigate = (url) => {
		// Close this menu
		closeMenu();
		// Add to page history
		dispatch(addPageToHistory(pathname));
		// Go to page
		navigator(url);
	};
	const closeMenu = () => {
		// Close menu
		setMenuOpen(false);
		// Save current state
		dispatch(setMenuToggleName(openId));
	};
	const renderItem = (item) => {
		const {
			icon,
			id,
			title,
			menuTitle,
			url,
			kids,
			divider,
			fontOptions = {},
			styleOptions = {},
			alignOptions = {},
			fontAdjustment = 0,
			heightMultiplier = 1
		} = item;
		if(divider) {
			return (
				<Divider
					key={id}
					my={2}
					mx="auto"
					w="5/6"
					bg="text.50"
					opacity={25}
				/>
			);
		} else if (kids) {
			// App Section w/subpages
			const isSelected = pathname.startsWith(url);
			const bgOptions = isSelected ? { bg: "primary.500" } : {};
			const textOptions = isSelected ? { color: "primary.500" } : {};
			const isOpen = id === openId;
			const previouslyOpen = id === menuToggleName && !hasBeenToggled;
			// Get new information for this section
			return (
				<React.Fragment key={`${id}-Fragment`}>
					<Pressable
						onPress={() => toggleSection(id)}
						key={id}
						style={{height: menuItemHeight}}
						w="full"
						bg="main.800"
					>
						<ZStack>
							<HStack
								style={{height: menuItemHeight}}
								w="full"
								{...bgOptions}
								opacity={20}
							/>
							<HStack
								style={{height: menuItemHeight}}
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
									{icon && Icons[icon](textOptions)}
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
								<MotiView
									animate={{
										rotate: isOpen ? "90deg" : "0deg",
										translateX: isOpen ? 2 : 0,
										translateY: isOpen ? 2 : 0
									}}
									transition={{
										type: 'timing',
										duration: 200
									}}
									style={{
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
								</MotiView>
							</HStack>
						</ZStack>
					</Pressable>
					<View bg="darker">
						<AnimatePresence>
							{kids.map(kid => {
								if(!isOpen) {
									return false;
								}
								const {
									id,
									url,
									title,
									menuTitle
								} = kid;
								const isSelected = pathname === url;
								const bgOptions = isSelected ? { bg: "primary.500" } : {};
								const offScreen = -500;
								const Inner = ({isPressed}) => {
									const textOptions = isSelected || isPressed ? { color: "primary.500" } : {};
									return (
										<ZStack>
											<HStack
												w="full"
												{...bgOptions}
												opacity={10}
											/>
											<HStack
												w="full"
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
													<Text
														textAlign="left"
														fontSize={menuSize}
														{...textOptions}
														color={isSelected ? "primary.500" : "transparent"}
													>{`\u25CF`}</Text>
												</VStack>
											</HStack>
										</ZStack>
									);
								};
								return (
									<MotiView
										key={id}
										from={{
											opacity: previouslyOpen ? 1 : 0.5,
											height: previouslyOpen ? subMenuItemHeight : 0,
											translateX: previouslyOpen ? 0 : offScreen
										}}
										animate={{
											opacity: 1,
											translateX: 0,
											height: subMenuItemHeight
										}}
										exit={{
											opacity: 0.5,
											translateX: offScreen,
											height: 0
										}}
										transition={{
											type: 'timing',
											duration: 300
										}}
									>
										<Pressable
											onPress={() => navigate(url)}
											style={{height: subMenuItemHeight}}
											key={`${id}-pressable`}
											children={(props) => <Inner {...props} />}
										/>
									</MotiView>
								);
							})}
						</AnimatePresence>
					</View>
				</React.Fragment>
			);
		}
		// App Section (standalone)
		const isSelected = pathname === url;
		const itemHeight = menuItemHeight * heightMultiplier;
		const Inner = ({isPressed}) => {
			const textOptions = {
				fontSize: [subMenuSize, menuSize, headerSize][1 + fontAdjustment],
				color: (isSelected || isPressed ? "primary.500" : undefined),
				...fontOptions
			};
			return (
				<ZStack>
					<HStack
						style={{height: itemHeight}}
						w="full"
						bg={isSelected || isPressed ? "primary.500" : undefined}
						opacity={20}
					/>
					<HStack
						w="full"
						style={{height: itemHeight}}
						alignItems="center"
						justifyContent="flex-start"
						{...styleOptions}
					>
						{icon && <VStack
							alignItems="center"
							justifyContent="center"
							m={2}
							minW={6}
						>
							{Icons[icon](textOptions)}
						</VStack>}
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
			);
		};
		return (
			<Pressable
				onPress={() => navigate(url)}
				key={id}
				style={{height: itemHeight}}
				w="full"
				bg="main.800"
				children={(props) => <Inner {...props} />}
			/>
		);
	};
	return (
		<>
			<Modal
				visible={menuOpen}
				transparent={true}
				style={{ height }}
				animationType="fade"
			>
				<HStack
					bg="#00000066"
					safeArea
					style={{height}}
				>
					<ScrollView bg="main.800">
						<VStack
							mb={3}
							p={2}
							w="full"
							mr={5}
						>
							<Tx bold fontSize={headerSize} lineHeight={subMenuSize}>Conlang Toolbox</Tx>
							<Tx fontSize={menuSize} lineHeight={subMenuSize} color="primary.200">tools for language invention</Tx>
						</VStack>
						<VStack
							m={0}
							p={0}
						>
							{appMenuFormat.map((page) => renderItem(page))}
						</VStack>
					</ScrollView>
					<Pressable
						h="full"
						flex={1}
						onPress={closeMenu}
					></Pressable>
				</HStack>
			</Modal>
			<IconButton
				variant="ghost"
				icon={<Icons.MenuIcon color="text.50" size={menuSize} />}
				pressedBg="darker"
				onPress={() => setMenuOpen(true)}
				flexGrow={0}
				flexShrink={0}
			/>
		</>
	);
};

export default MenuModal;
