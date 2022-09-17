import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
	Box,
	HStack,
	ZStack,
	Slider,
	Input,
	ScrollView,
	Text,
	TextArea,
	VStack,
	useBreakpointValue,
	Switch,
	Factory,
	useToken
 } from "native-base";
 import { StyleSheet } from 'react-native';
 import NewSlider from '@react-native-community/slider';

import { Bar } from "./icons";
import debounce from '../helpers/debounce';

// $v(unknown property, default value)
//    returns the property if it exists, or default value otherwise
const $v = (given, base) => given === undefined ? base : given;
// Breakpoint object for Sliders
const sliderCapWidths = {
	base: 65,
	sm: 100,
	md: 164,
	lg: 213,
	xl: 350
};
const ThisSlider = Factory(NewSlider);

export const NavBar = (props) => {
	// <NavBar
	//    scrollProps={props for inner ScrollView}
	//    boxProps={props for outer Box}
	//    {other props go to inner HStack} />
	const location = useLocation();
	const [scrollPos, setScrollPos] = useState(0);
	const navRef = useRef(null);
	const maybeUpdateScrollPos = ({contentOffset}) => {
		contentOffset && contentOffset.x && setScrollPos(contentOffset.x);
	};
	useEffect(() => {
		navRef.current.scrollTo({x: scrollPos, y: 0, animated: false});
	}, [location]);
	const { boxProps, scrollProps, ...otherProps } = props;
	return (
		<Box
			w="full"
			position="absolute"
			left={0}
			bottom={0}
			right={0}
			bg="main.800"
			{...$v(boxProps, {})}
		>
			<ScrollView
				horizontal
				w="full"
				ref={navRef}
				onScroll={
					({nativeEvent}) =>
						debounce(
							maybeUpdateScrollPos,
							{
								args: [nativeEvent],
								namespace: "navBar"
							}
						)
				}
				scrollEventThrottle={16}
				{...$v(scrollProps, {})}
			>
				<HStack
					w="full"
					space={4}
					justifyContent="space-between"
					{...otherProps}
				/>
			</ScrollView>
		</Box>
	);
};

export const TabBar = (props) => {
	// <TabBar
	//    boxProps={properties for outer Box}
	//    {other props go to inner HStack} />
	const { boxProps, ...otherProps } = props;
	return (
		<Box
			w="full"
			position="absolute"
			left={0}
			bottom={0}
			right={0}
			bg="main.800"
			{...$v(boxProps, {})}
		>
			<HStack
				w="full"
				justifyContent="space-evenly"
				alignItems="center"
				{...otherProps}
			/>
		</Box>
	);
};

export const TextAreaSetting = (props) => {
	// <TextAreaSetting
	//    boxProps={props for outer Box}
	//    labelProps={props for Text}
	//    text={goes into Text; if missing, uses children instead; if null, not shown}
	//    value={TextArea value}
	//    defaultValue={TextArea defaultValue}
	//    placeholder={TextArea placeholder}
	//    rows={TextArea totalLines}
	//    onChangeText={TextArea onChangeText}
	//    inputProps={other props for TextArea}
	// />
	const {
		boxProps,
		labelProps,
		inputProps,
		text,
		children,
		value,
		defaultValue,
		placeholder,
		rows,
		onChangeText
	} = props;
	return (
		<Box w="full" {...$v(boxProps, {})}>
			{text === null ? <></> : <Text {...$v(labelProps, {})}>{$v(text, children)}</Text>}
			<TextArea
				mt={2}
				value={value}
				defaultValue={defaultValue}
				placeholder={placeholder}
				totalLines={$v(rows, 3)}
				onChangeText={onChangeText}
				{...$v(inputProps, {})}
			/>
		</Box>
	);
};

export const TextSetting = (props) => {
	// <TextSetting
	//    boxProps={props for outer Box}
	//    labelProps={props for Text}
	//    text={goes into Text; if missing, uses children instead}
	//    value={Input value}
	//    defaultValue={Input defaultValue}
	//    placeholder={Input placeholder}
	//    onChangeText={Input onChangeText}
	//    inputProps={other props for Input}
	// />
	const {
		boxProps,
		labelProps,
		inputProps,
		text,
		children,
		value,
		defaultValue,
		placeholder,
		onChangeText
	} = props;
	return (
		<Box w="full" {...$v(boxProps, {})}>
			<Text {...$v(labelProps, {})}>{$v(text, children)}</Text>
			<Input
				value={value}
				defaultValue={defaultValue}
				placeholder={placeholder}
				onChangeText={onChangeText}
				{...$v(inputProps, {})}
			/>
		</Box>
	);
};

const MySlider = ({
	min,
	max,
	colorScheme,
	notFilled,
	step,
	value,
	onSlidingComplete = (v) => console.log(v),
	...props
}) => {
	const colorProp = $v(colorScheme, "secondary");
	const filledProp = notFilled ? ".800" : ".400";
	const [
		filledColor,
		emptyColor,
		thumbColor
	] = useToken("colors", [colorProp + filledProp, colorProp + ".800", colorProp + ".400"]);
	const styles = StyleSheet.create({
		slider: {
		  width: "100%",
		  opacity: 1,
		  height: 50
		},
	  });
	return (
		<ThisSlider
			minimumValue={min}
			maximumValue={max}
			step={step}
			minimumTrackTintColor={filledColor}
			maximumTrackTintColor={emptyColor}
			thumbTintColor={thumbColor}
			onSlidingComplete={onSlidingComplete}
			value={value}
			w="full"
			height={12}
		/>
	);
};

/*
				<Slider
					size="sm"
					minimumValue={minVal}
					maximumValue={maxVal}
					step={1}
					defaultValue={defaultValue}
					{...$v(sliderProps, {})}
				>
*/

export const SliderWithTicks = (props) => {
	// <SliderWithTicks
	//    min={default 0}
	//    max={default 4}
	//    notFilled={if true, the slider does not fill}
	//    beginLabel={left of Slider}
	//    endLabel={right of Slider}
	//    fontSize={size of the labels, defaults to 'sizes.sm'}
	//    tickProps={props for the background tick bar}
	//    stackProps={props for the inner ZStack}
	//    sliderProps={props for the Slider}
	//    value={default value for the slider (defaults to `min`)
	//  />
	const {
		min,
		max,
		beginLabel,
		endLabel,
		tickProps,
		stackProps,
		sliderProps,
		accessibilityLabel,
		onSlidingEnd,
		notFilled,
		value,
		fontSize,
		step = 1
	} = props;
	const sizes = useSelector(state => state.appState.sizes);
	const minVal = $v(min, 0);
	const maxVal = $v(max, 4);
	const defaultValue = $v(value, minVal);
	const labelW = useBreakpointValue(sliderCapWidths);
	const Tick = ({adjustment= 0.5}) => {
		const pre = adjustment * 20;
		const post = 20 - pre;
		const h = 8;
		// {5} === 20px
		// {0.5} === 2px
		// pre + post === 18
		return (
			<HStack h={h} w={5} bg="transparent">
				<Box h={h} style={{width: pre}} bg="transparent" />
				<Box h={h} style={{width: 2}} bg="yellow.500" {...props} />
				<Box h={h} style={{width: post}} bg="transparent" />
			</HStack>
		);
	};
	const Ticky = (props) => <Bar size="xs" color="sliderTickColor" {...$v(tickProps, {})} {...props} />;
	let middleTicks = [<Tick key="FirstTick" adjustment={0} />];
	// padding depends on a formula where the first is 0, the median is 9, and the last is 18
	const stepsUntilEnd = (maxVal - minVal) / step;
	for (let c = 1; c < stepsUntilEnd; c++) {
		middleTicks.push(<Tick key={"Tick" + String(c)} />);
	}
	middleTicks.push(<Tick key="LastTick" size="xs" adjustment={1} />);
	const textSize = $v(fontSize, useBreakpointValue(sizes.sm));
	// TO-DO: Replace <Slider> with @react-native-community/slider
	//    Allows you to set value AND automatically move the handle
	return (
		<HStack
			w="full"
			bg="darker"
			px={2}
			py={1}
			rounded="md"
			alignItems="center"
		>
			<Box
				mr={3}
				flexGrow={0}
				flexShrink={1}
				flexBasis={labelW}
			>
				<Text
					textAlign="center"
					fontSize={textSize}
				>{$v(beginLabel, "MISSING LABEL")}</Text>
			</Box>
			<ZStack
				alignItems="center"
				justifyContent="center"
				flexGrow={1}
				flexShrink={1}
				flexBasis={labelW * 4}
				{...$v(stackProps, {})}
			>
				<HStack
					alignItems="center"
					justifyContent="space-between"
					w="full"
					children={middleTicks}
				/>
				<MySlider
					min={minVal}
					max={maxVal}
					step={step}
					value={defaultValue}
					notFilled={notFilled}
					accessibilityLabel={accessibilityLabel}
					{...$v(sliderProps, {})}
				/>
			</ZStack>
			<Box
				ml={3}
				flexGrow={0}
				flexShrink={1}
				flexBasis={labelW}
			>
				<Text
					textAlign="center"
					fontSize={textSize}
				>{$v(endLabel, "MISSING LABEL")}</Text>
			</Box>
		</HStack>
	);
};

export const SliderWithTicksAndValueDisplay = (props) => {
	// <SliderWithTicksAndValueDisplay
	//    min={default 0}
	//    max={default 4}
	//    value={starting value of the slider, defaults to `min`}
	//    notFilled={if true, the slider does not fill}
	//    beginLabel={left of Slider}
	//    endLabel={right of Slider}
	//    fontSize={size of the labels, defaults to 'sizes.sm'}
	//    sliderProps={props for the Slider}
	//       NOTE: sliderProps.defaultValue can override `value`
	//    stackProps={props for the containing VStack}
	//    zStackProps={props for the ZStack}
	//    tickProps={props for the background tick bar}
	//    Display={element that goes above the slider, gets given a
	//       `value` property}
	// />
	const {
		min,
		max,
		beginLabel,
		endLabel,
		sliderProps,
		tickProps,
		value,
		notFilled,
		Display,
		stackProps,
		zStackProps,
		fontSize
	} = props;
	const [currentValue, setCurrentValue] = useState($v(value, $v(min, 0)));
	return (
		<VStack {...$v(stackProps, {})}>
			<Display value={currentValue} />
			<SliderWithTicks
				stackProps={zStackProps}
				sliderProps={{
					onChange: (v) => setCurrentValue(v),
					onValueChange: (v) => setCurrentValue(v),
					...$v(sliderProps, {})
				}}
				{...{
					min,
					max,
					beginLabel,
					tickProps,
					endLabel,
					notFilled,
					value,
					fontSize
				}}
			/>
		</VStack>
	);
}


export const SliderWithValueDisplay = (props) => {
	// <SliderWithValueDisplay
	//    min={default 0}
	//    max={default 4}
	//    value={starting value of the slider, defaults to `min`}
	//    notFilled={if true, the slider does not fill}
	//    beginLabel={left of Slider}
	//    endLabel={right of Slider}
	//    fontSize={size of the labels, defaults to 'sizes.sm'}
	//    sliderProps={props for the Slider}
	//       NOTE: sliderProps.defaultValue can override `value`
	//    stackProps={props for the containing VStack}
	//    Display={element that goes above the slider, gets given a
	//       `value` property}
	// />
	const {
		min,
		max,
		beginLabel,
		endLabel,
		sliderProps,
		value,
		notFilled,
		Display,
		stackProps,
		fontSize
	} = props;
	const sizes = useSelector(state => state.appState.sizes);
	const minVal = $v(min, 0);
	const defaultValue = $v(value, minVal);
	const labelW = useBreakpointValue(sliderCapWidths);
	const textSize = $v(fontSize, useBreakpointValue(sizes.sm));
	const [currentValue, setCurrentValue] = useState(defaultValue);
	return (
		<VStack {...$v(stackProps, {})}>
			<Display value={currentValue} />
			<HStack
				w="full"
				bg="darker"
				px={2}
				py={1}
				rounded="md"
				alignItems="center"
				alignSelf="center"
			>
				<Box
					mr={3}
					flexGrow={0}
					flexShrink={1}
					flexBasis={labelW}
				>
					<Text textAlign="center" fontSize={textSize}>{$v(beginLabel, "MISSING LABEL")}</Text>
				</Box>
				<Slider
					size="sm"
					minimumValue={minVal}
					maximumValue={$v(max, 50)}
					step={1}
					defaultValue={defaultValue}
					flexGrow={1}
					flexShrink={1}
					flexBasis={labelW * 4}
					onChange={(v) => setCurrentValue(v)}
					{...$v(sliderProps, {})}
				>
					<Slider.Track>
						{notFilled ? <></> : <Slider.FilledTrack />}
					</Slider.Track>
					<Slider.Thumb />
				</Slider>
				<Box
					ml={3}
					flexGrow={0}
					flexShrink={1}
					flexBasis={labelW}
				>
					<Text textAlign="center" fontSize={textSize}>{$v(endLabel, "MISSING LABEL")}</Text>
				</Box>
			</HStack>
		</VStack>
	);
};

export const SliderWithTicksNoCaps = (props) => {
	// <SliderWithTicksNoCaps
	//    min={default 0}
	//    max={default 4}
	//    notFilled={if true, the slider does not fill}
	//    beginLabel={left of Slider}
	//    endLabel={right of Slider}
	//    fontSize={size of the labels, defaults to 'sizes.sm'}
	//    tickProps={props for the background tick bar}
	//    stackProps={props for the inner ZStack}
	//    sliderProps={props for the Slider}
	//    value={default value for the slider (defaults to `min`)
	//  />
	const {
		min,
		max,
		beginLabel,
		endLabel,
		tickProps,
		stackProps,
		sliderProps,
		notFilled,
		value,
		fontSize
	} = props;
	const sizes = useSelector(state => state.appState.sizes);
	const minVal = $v(min, 0);
	const maxVal = $v(max, 4);
	const defaultValue = $v(value, minVal);
	const Tick = (props) => <Bar size="xs" color="sliderTickColor" {...$v(tickProps, {})} {...props} />;
	let middleTicks = [<Tick key="FirstTick" color="transparent" size="2xs" />];
	for (let c = minVal + 1; c < maxVal; c++) {
		middleTicks.push(<Tick key={"Tick" + String(c)} />);
	}
	middleTicks.push(<Tick key="LastTick" color="transparent" size="2xs" />);
	const textSize = $v(fontSize, useBreakpointValue(sizes.sm));
	return (
		<VStack
			w="full"
			bg="darker"
			px={2}
			py={1}
			rounded="md"
			alignItems="center"
		>
			<HStack justifyContent="space-between" w="full">
				<Text textAlign="left" fontSize={textSize}>{$v(beginLabel, "MISSING LABEL")}</Text>
				<Text textAlign="right" fontSize={textSize}>{$v(endLabel, "MISSING LABEL")}</Text>
			</HStack>
			<ZStack
				w="5/6"
				m={3}
				alignItems="center"
				justifyContent="center"
				{...$v(stackProps, {})}
			>
				<HStack
					alignItems="center"
					justifyContent="space-between"
					w="full"
					children={middleTicks}
				/>
				<Slider
					size="sm"
					minimumValue={minVal}
					maximumValue={maxVal}
					step={1}
					defaultValue={defaultValue}
					{...$v(sliderProps, {})}
				>
					<Slider.Track>
						{notFilled ? <></> : <Slider.FilledTrack />}
					</Slider.Track>
					<Slider.Thumb />
				</Slider>
			</ZStack>
		</VStack>
	);
};

export const ToggleSwitch = (props) => {
	// <ToggleSwitch
	//    hProps={props for the outer HStack}
	//    vProps={props for the inner VStack}
	//    label={String, main text of the toggle}
	//    labelSize={font size of the label, defaults to 'sizes.sm'}
	//    labelProps={props for the label's Text}
	//    desc={optional; String with additional text}
	//    descSize={font size of the desc text, defaults to 'sizes.xs'}
	//    descProps={props for the desc's Text}
	//    switchState={default Boolean state of the toggle}
	//    switchToggle={Function that will be called when toggle changes}
	//    switchProps={props for the Switch}
	//  />
	const {
		hProps,
		vProps,
		label,
		labelSize,
		labelProps,
		desc,
		descSize,
		descProps,
		switchState,
		switchToggle,
		switchProps
	} = props;
	const sizes = useSelector(state => state.appState.sizes);
	const textSize = $v(labelSize, useBreakpointValue(sizes.sm));
	const smallerSize = $v(descSize, useBreakpointValue(sizes.xs));
	return (
		<HStack
			w="full"
			justifyContent="space-between"
			alignItems="center"
			{...(hProps || {})}
		>
			<VStack
				flexGrow={1}
				flexShrink={2}
				mr={2}
				{...(vProps || {})}
			>
				<Text fontSize={textSize} {...(labelProps || {})}>{label}</Text>
				{desc ? <Text fontSize={smallerSize} {...(descProps || {})}>{desc}</Text> : <></>}
			</VStack>
			<Switch
				isChecked={switchState}
				onToggle={switchToggle}
				{...(switchProps || {})}
			/>
		</HStack>
);
};
