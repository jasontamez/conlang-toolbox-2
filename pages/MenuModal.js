import React, { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import {
	HStack,
	VStack,
	Pressable,
	Text as Tx,
	Divider,
	IconButton,
	ZStack,
	View
} from 'native-base';
import { Modal as MModal } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';

import * as Icons from '../components/icons';
import { fontSizesInPx, setMenuToggleName } from '../store/appStateSlice';
import { appMenuFormat } from '../appLayoutInfo';
import getSizes from '../helpers/getSizes';

// TO-DO: Massively fix this on mobile
// https://docs.swmansion.com/react-native-reanimated/docs/api/LayoutAnimations/customAnimations
// Why does it work ok on wg/syllables but not here?

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
	const menuItemHeight = (fontSizesInPx[menuSize] * 3);
	const subMenuItemHeight = (fontSizesInPx[subMenuSize] * 2.5);
	const Text = (props) => <Tx lineHeight={lineHeight} {...props} />;
	const fontSizeAdjustments = {
		"-1": subMenuSize,
		"+1": headerSize
	};
	const toggleSection = (parentId) => {
		if(openId === parentId) {
			// Closing this section
			setOpenId('');
		} else {
			// Opening new section
			setOpenId(parentId);
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
	const renderItem = (item) => {
		const {
			icon,
			id,
			title,
			url,
			kids,
			divider
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
				/>);
		} else if (kids) {
			// App Section w/subpages
			const isSelected = location.pathname.startsWith(url);
			const bgOptions = isSelected ? { bg: "primary.500" } : {};
			const textOptions = isSelected ? { color: "primary.500" } : {};
			const isOpen = id === openId;
			const previouslyOpen = id === menuToggleName;
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
									>{title}</Text>
								</VStack>
								<MotiView
									animate={{
										rotate: isOpen ? "90deg" : "0deg",
										translateX: isOpen ? 2 : 0,
										translateY: isOpen ? 2 : 0
									}}
									transition={{
										type: 'timing',
										duration: 300
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
					<View style={{backgroundColor: "#00000066"}}><AnimatePresence>
						{kids.map(kid => {
							if(!isOpen) {
								return false;
							}
							const {
								id,
								url,
								title
							} = kid;
							const isSelected = location.pathname === url;
							const dotOptions =
								isSelected ?
									{ color: "primary.500" }
								:
									{ color: "transparent" }
							;
							const textOptions = isSelected ? { color: "primary.500" } : {};
							const bgOptions = isSelected ? { bg: "primary.500" } : {};
							const offScreen = -500;
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
										duration: 800
									}}
									onDidAnimate={(a, b, c, d) => console.log(a, b, c, d)}
								>
									<Pressable
										onPress={() => navigate(url)}
										style={{height: subMenuItemHeight}}
										key={`${id}-pressable`}
									>
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
													>{title}</Text>
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
								</MotiView>
							);
						})}
					</AnimatePresence></View>
				</React.Fragment>
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
						w="full"
						style={{height: menuItemHeight}}
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
							<Text fontSize={menuSize} {...textOptions}>{title}</Text>
						</VStack>
					</HStack>
				</ZStack>
			</Pressable>
		);
	};
	return (
		<>
			<MModal
				visible={menuOpen}
				transparent={true}
				style={{
					height: "100%",
					minHeight: "100%",
					maxHeight: "100%"
				}}
				animationType="fade"
			>
				<HStack
					h="full"
					minHeight="full"
					bg="#00000066"
				>
					<VStack bg="main.800">
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
							{appMenuFormat.map((page) => renderItem(page))}
						</VStack>
					</VStack>
					<Pressable
						h="full"
						flex={1}
						onPress={() => closeMenu()}
					></Pressable>
				</HStack>
			</MModal>
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
