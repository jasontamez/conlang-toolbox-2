import React, { useCallback, useEffect, useState } from "react";
import {
	Text,
	HStack,
	Box,
	VStack,
	TextArea,
	Center
} from "native-base";
import { Keyboard, useWindowDimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, MotiView } from "moti";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

import {
	EditIcon,
	EquiprobableIcon,
	SaveIcon,
	SharpDropoffIcon,
	CloseIcon
} from "../../components/icons";
import { RangeSlider, ToggleSwitch } from "../../components/inputTags";
import {
	equalityCheck,
	setSyllableBoxDropoff,
	setMultipleSyllableTypes,
	setSyllableOverride,
	setSyllables
} from "../../store/wgSlice";
import getSizes from "../../helpers/getSizes";
import { flipFlop, fromToZero, maybeAnimate } from "../../helpers/motiAnimations";
import { fontSizesInPx } from "../../store/appStateSlice";
import Button from "../../components/Button";
import IconButton from "../../components/IconButton";
import FullPageModal from "../../components/FullBodyModal";
import { useOutletContext } from "react-router-dom";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const WGSyllables = () => {
	const {
		syllableBoxDropoff,
		multipleSyllableTypes,
		syllableDropoffOverrides,
		singleWord,
		wordInitial,
		wordMiddle,
		wordFinal
	} = useSelector(state => state.wg, equalityCheck);
	const dispatch = useDispatch();
	const [hasNotToggled, setHasNotToggled] = useState(true);
	const [headerSize, textSize, descSize] = getSizes("md", "sm", "xs");
	const emSize = fontSizesInPx[textSize] || fontSizesInPx.xs;
	const { width, height } = useWindowDimensions();
	const [appHeaderHeight, viewHeight, tabBarHeight, navigate] = useOutletContext();
	useEffect(() => {
		console.log(`height: ${height}`);
	}, [height])
	const SyllableBox = ({ title, syllablesValue, propName }) => {
		const [modalOpen, setModalOpen] = useState(false);
		const baseHeight = (height - (appHeaderHeight * 1.75) - 8);
		const bodyHeight = useSharedValue(baseHeight);
		const topPadding = useSharedValue(0);
		const toggleOpacity = useSharedValue(1);
		const toggleHeight = useSharedValue(appHeaderHeight * 3);
		const handleKeyboardShow = useCallback(({endCoordinates}) => {
			console.log(endCoordinates.height);
			bodyHeight.value = withTiming(baseHeight - endCoordinates.height / 2, { duration: 50 });
			topPadding.value = withTiming(endCoordinates.height / 2 - appHeaderHeight * 0.75, { duration: 50 });
			toggleOpacity.value = withTiming(0, { duration: 50 });
			toggleHeight.value = withTiming(0, { duration: 50});
		}, [baseHeight, bodyHeight, toggleOpacity, toggleHeight])
		const handleKeyboardHide = useCallback(({endCoordinates}) => {
			console.log(endCoordinates.height);
			bodyHeight.value = withTiming(baseHeight - endCoordinates.height / 2, { duration: 50 });
			topPadding.value = withTiming(endCoordinates.height / 2 - appHeaderHeight * 0.75, { duration: 50 });
			toggleOpacity.value = withTiming(1, { duration: 50 });
			toggleHeight.value = withTiming(appHeaderHeight * 3, { duration: 50 });
		}, [baseHeight, bodyHeight, toggleOpacity, toggleHeight])
		useEffect(() => {
			const listener = Keyboard.addListener("keyboardDidShow", handleKeyboardShow);
			return () => listener.remove();
		}, [handleKeyboardShow]);
		useEffect(() => {
			const listener = Keyboard.addListener("keyboardDidHide", handleKeyboardHide);
			return () => listener.remove();
		}, [handleKeyboardHide]);
		const mainAnimatedStyle = useAnimatedStyle(() => ({
			height: bodyHeight.value,
			paddingTop: topPadding.value
		}));
		const toggleAnimatedStyle = useAnimatedStyle(() => ({
			opacity: toggleOpacity.value,
			height: toggleHeight.value,
			overflow: "hidden"
		}));
		const Body = () => {
			const rows = Math.max(3, syllablesValue.split(/\n/).length);
			const [modalOverrideFlag, setModalOverrideFlag] = useState(syllableDropoffOverrides[propName] !== null);
			const [modalOverrideValue, setModalOverrideValue] = useState(syllableDropoffOverrides[propName] !== null ? syllableDropoffOverrides[propName] : syllableBoxDropoff);
			const [modalTempInfo, setModalTempInfo] = useState(syllablesValue);
			const saveAndClose = () => {
				dispatch(setSyllables({
					syllables: propName,
					value: modalTempInfo
				}));
				dispatch(setSyllableOverride({
					override: propName,
					value: modalOverrideFlag ? modalOverrideValue : null
				}));
				setModalOpen(false);
			};
			return (
				<GestureHandlerRootView>
					<Animated.View style={mainAnimatedStyle}>
						<Center px={5} py={2} alignItems="center" h="full" justifyContent="flex-start">
							<TextArea
								defaultValue={syllablesValue}
								totalLines={rows}
								onChangeText={(text) => setModalTempInfo(text)}
								fontSize={descSize}
								w="full"
								flexGrow={5}
								flexShrink={1}
							/>
							<Animated.View style={toggleAnimatedStyle}>
								<ToggleSwitch
									hProps={{
										space: 2.5,
										py: 2,
										justifyContent: "center",
										flexWrap: "wrap",
										width
									}}
									vProps={{
										flexGrow: 0,
										flexShrink: 0,
										mr: 0
									}}
									label="Use separate dropoff rate"
									labelSize={textSize}
									switchState={modalOverrideFlag}
									switchToggle={() =>  setModalOverrideFlag(!modalOverrideFlag)}
								/>
								<AnimatePresence>
									{modalOverrideFlag &&
										<MotiView
											{...fromToZero(
												{
													opacity: 1,
													scaleY: 1
												},
												500
											)}
											key="modalSlider"
										>
											<RangeSlider
												max={50}
												minimumLabel={<EquiprobableIcon color="text.50" size={descSize} />}
												maximumLabel={<SharpDropoffIcon color="text.50" size={descSize} />}
												value={modalOverrideValue}
												label="Dropoff rate"
												onChange={(v) => setModalOverrideValue(v)}
												PreElement={() => <Text textAlign="center" fontSize={descSize}>Dropoff rate</Text>}
												showValue={1}
												ValueContainer={
													(props) => <Text textAlign="center" fontSize={descSize} color="secondary.50">{props.children}%</Text>
												}
												labelWidth={2}
												xPadding={24}
												containerProps={{style: {width}, alignItems: "center", justifyContent: "center"}}
											/>
										</MotiView>
									}
								</AnimatePresence>
							</Animated.View>
						</Center>
					</Animated.View>
					<HStack
						w="full"
						justifyContent="space-between"
						alignItems="center"
						px={1.5}
						flexGrow={0}
						style={{height: appHeaderHeight}}
					>
						<Button
							m={0}
							startIcon={<CloseIcon size={textSize} />}
							onPress={() => setModalOpen(false)}
							_text={{fontSize: textSize}}
							scheme="warning"
						>Cancel</Button>
						<Button
							m={0}
							startIcon={<SaveIcon size={textSize} />}
							onPress={saveAndClose}
							_text={{fontSize: textSize}}
						>Save</Button>
					</HStack>
				</GestureHandlerRootView>
			);
		};
		const Header = () => {
			return (
				<HStack
					w="full"
					justifyContent="center"
					alignItems="center"
					px={1.5}
					bg="primary.500"
					flexGrow={0}
					style={{height: appHeaderHeight * 0.75}}
				>
					<Text
						textAlign="center"
						bold
						flexGrow={1}
						flexShrink={1}
						fontSize={headerSize}
						color="primary.50"
					>{title}</Text>
				</HStack>
			);
		};
		return (
		<VStack
			py={2.5}
			px={2}
			space={2}
		>
			<FullPageModal
				modalOpen={modalOpen}
				closeModal={() => setModalOpen(false)}
				HeaderOverride={() => <Header />}
				BodyContent={(props) => (<Body {...props} />)}
				FooterOverride={() => <></>}
			/>
			<HStack
				w="full"
				alignItems="flex-start"
				justifyContent="flex-start"
				space={2.5}
			>
				<VStack
					h="full"
					justifyContent="flex-start"
					alignItems="flex-end"
					flexGrow={0}
					mt={2}
				>
					<VStack
						justifyContent="flex-start"
						alignItems="flex-end"
						style={{minWidth: emSize * 8}}
					>
						{title.split(" ").map((t, i) => (
							<Text textAlign="right" fontSize={textSize} bold key={`${title}/${t}/${i}`}>{t}</Text>
						))}
					</VStack>
					{syllableDropoffOverrides[propName] !== null &&
						<Box key={`${title}-override`} bg="lighter" px={1.5} py={1} m={0.5} mt={3}>
							<Text lineHeight={descSize} fontSize={descSize} italic>{syllableDropoffOverrides[propName]}%</Text>
						</Box>
					}
				</VStack>
				<Box
					key={`${title}-Inactive`}
					bg="lighter"
					py={2}
					px={3}
					minW={32}
					style={{
						maxWidth: width
							- (emSize * 10) // label (8) + edit button (2)
							- 24 // xPadding
					}}
				>
					<Text fontSize={descSize} italic={syllablesValue === ""}>{syllablesValue || "(empty)"}</Text>
				</Box>
				<IconButton
					flexShrink={0}
					alignSelf="center"
					onPress={() => setModalOpen(true)}
					p={1}
					variant="ghost"
					icon={<EditIcon color="primary.400" size={textSize} />}
				/>
			</HStack>
		</VStack>
	)};
	return (
		<VStack h="full">
			<GestureHandlerRootView><ScrollView>
				<RangeSlider
					max={50}
					minimumLabel={<EquiprobableIcon color="text.50" size={descSize} />}
					maximumLabel={<SharpDropoffIcon color="text.50" size={descSize} />}
					value={syllableBoxDropoff}
					label="Dropoff rate"
					onChange={(v) => dispatch(setSyllableBoxDropoff(v))}
					PreElement={() => (
						<Box pb={1}>
							<HStack
								justifyContent="space-between"
								alignItems="flex-end"
								pb={1}
							>
								<Text bold fontSize={textSize}>Dropoff Rate</Text>
							</HStack>
							<Text fontSize={descSize}>Syllables at the top of a box tend to be picked more often than syllables at the bottom of the box. This slider controls this tendency. A rate of zero is flat, making all syllables equiprobable.</Text>
						</Box>
					)}
					showValue={1}
					labelWidth={2}
					fontSize={descSize}
					ValueContainer={
						(props) => <Text textAlign="center" sub fontSize={descSize} color="secondary.50">{props.children}%</Text>
					}
				/>
				<ToggleSwitch
					hProps={{
						px: 2,
						py: 2.5,
						borderBottomWidth: 1,
						borderColor: "main.700"
					}}
					label="Use multiple syllable types"
					labelSize={textSize}
					switchState={multipleSyllableTypes}
					switchToggle={() => {
						dispatch(setMultipleSyllableTypes(!multipleSyllableTypes));
						setHasNotToggled(false);
					}}
				/>
				<SyllableBox
					title={multipleSyllableTypes ? "Single-Word Syllables" : "Syllables"}
					propName="singleWord"
					syllablesValue={singleWord}
				/>
				<AnimatePresence>
					{multipleSyllableTypes &&
						<MotiView
							{...maybeAnimate(
								!hasNotToggled && multipleSyllableTypes,
								flipFlop,
								{
									translateX: -128 - (emSize * 8)
								},
								{
									opacity: 1
								},
								500
							)}
						>
							<SyllableBox
								title="Word-Initial Syllables"
								propName="wordInitial"
								syllablesValue={wordInitial}
							/>
							<SyllableBox
								title="Word-Middle Syllables"
								propName="wordMiddle"
								syllablesValue={wordMiddle}
							/>
							<SyllableBox
								title="Word-Final Syllables"
								propName="wordFinal"
								syllablesValue={wordFinal}
							/>
						</MotiView>
					}
				</AnimatePresence>
			</ScrollView></GestureHandlerRootView>
		</VStack>
	);
};

export default WGSyllables;
