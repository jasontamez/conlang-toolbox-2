import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
	Box,
	HStack,
	ZStack,
	Input,
	Text,
	TextArea,
	VStack,
	useBreakpointValue,
	Switch,
	Factory,
	useToken
 } from "native-base";
 import NewSlider from '@react-native-community/slider';

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
const Slider = Factory(NewSlider);

export const TextAreaSetting = ({
	boxProps = {},
	labelProps = {},
	inputProps = {},
	text,
	children,
	value,
	defaultValue,
	placeholder,
	rows = 3,
	onChangeText
}) => {
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
	return (
		<Box w="full" {...boxProps}>
			{text === null ? <></> : <Text {...labelProps}>{$v(text, children)}</Text>}
			<TextArea
				mt={2}
				value={value}
				defaultValue={defaultValue}
				placeholder={placeholder}
				totalLines={rows}
				onChangeText={onChangeText}
				{...inputProps}
			/>
		</Box>
	);
};

export const TextSetting = ({
	boxProps = {},
	labelProps = {},
	inputProps = {},
	text,
	children,
	value,
	defaultValue,
	placeholder,
	onChangeText
}) => {
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
	return (
		<Box w="full" {...boxProps}>
			<Text {...labelProps}>{$v(text, children)}</Text>
			<Input
				value={value}
				defaultValue={defaultValue}
				placeholder={placeholder}
				onChangeText={onChangeText}
				{...inputProps}
			/>
		</Box>
	);
};

const getSliderProps = ({
	min,
	max,
	step,
	colorScheme = "secondary",
	notFilled,
	updateValue,
	...props
}) => {
	const filledProp = notFilled ? ".800" : ".400";
	const [
		filledColor,
		emptyColor,
		thumbColor
	] = useToken(
		"colors",
		[
			colorScheme + filledProp,
			colorScheme + ".800",
			colorScheme + ".400"
		]
	);
	return {
		minimumValue: min,
		maximumValue: max,
		step,
		w: "full",
		height: 8,
		minimumTrackTintColor: filledColor,
		maximumTrackTintColor: emptyColor,
		thumbTintColor: thumbColor,
		...props
	};
};


const Tick = () => {
	return (
		<HStack alignItems="center" style={{width: 20, height: 12}} bg="transparent">
			<Box style={{width: 9, height: 12}} bg="transparent" />
			<Box style={{width: 2, height: 12}} bg="sliderTickColor" />
			<Box style={{width: 9, height: 12}} bg="transparent" />
		</HStack>
	);
};
const makeTicks = (min, max, step) => {
	let middleTicks = [<Box key="FirstTick" style={{width: 20, height: 12}} bg="transparent" />];
	const stepsUntilEnd = (max - min) / step;
	for (let c = 1; c < stepsUntilEnd; c++) {
		middleTicks.push(<Tick key={"Tick" + String(c)} />);
	}
	middleTicks.push(<Box key="LastTick" style={{width: 20, height: 12}} bg="transparent" />);
	return middleTicks;
};

export const SliderWithTicks = (props) => {
	// <SliderWithTicks
	//    min={default 0}
	//    max={default 4}
	//    step={default 1}
	//    colorScheme={defaults to "secondary"}
	//    notFilled={if true, the slider does not fill}
	//    beginLabel={left of Slider}
	//    endLabel={right of Slider}
	//    fontSize={size of the labels, defaults to 'sizes.sm'}
	//    stackProps={props for the inner ZStack}
	//    value={default value for the slider (defaults to `min`)
	//    onSlidingComplete={function for when the slider stops}
	//    accessibilityLabel={description of slider}
	//    sliderProps={optional properties for the slider}
	//  />
	const {
		min = 0,
		max = 4,
		step = 1,
		beginLabel = "MISSING LABEL",
		endLabel = "MISSING LABEL",
		stackProps = {},
		sliderProps = {},
		accessibilityLabel,
		onSlidingComplete,
		notFilled,
		value,
		fontSize
	} = props;
	const sizes = useSelector(state => state.appState.sizes);
	const defaultValue = $v(value, min);
	const labelW = useBreakpointValue(sliderCapWidths);
	const textSize = $v(fontSize, useBreakpointValue(sizes.sm));
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
				>{beginLabel}</Text>
			</Box>
			<ZStack
				alignItems="center"
				justifyContent="center"
				flexGrow={1}
				flexShrink={1}
				flexBasis={labelW * 4}
				{...stackProps}
			>
				<HStack
					alignItems="center"
					justifyContent="space-between"
					w="full"
					children={makeTicks(min, max, step)}
				/>
				<Slider
					{...getSliderProps({
						min,
						max,
						step,
						value: defaultValue,
						notFilled,
						accessibilityLabel,
						onSlidingComplete,
						...sliderProps
					})}
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
				>{endLabel}</Text>
			</Box>
		</HStack>
	);
};

export const SliderWithTicksAndValueDisplay = (props) => {
	// <SliderWithTicksAndValueDisplay
	//    min={default 0}
	//    max={default 4}
	//    step={default 1}
	//    value={starting value of the slider, defaults to `min`}
	//    notFilled={if true, the slider does not fill}
	//    beginLabel={left of Slider}
	//    endLabel={right of Slider}
	//    fontSize={size of the labels, defaults to 'sizes.sm'}
	//    stackProps={props for the containing VStack}
	//    zStackProps={props for the ZStack}
	//    Display={element that goes above the slider, gets given a
	//       `value` property}
	//    onSlidingComplete={function for when the slider stops}
	//    accessibilityLabel={description of slider}
	//    sliderProps={optional properties for the slider}
	// />
	const {
		min = 0,
		max = 4,
		step = 1,
		beginLabel = "MISSING LABEL",
		endLabel = "MISSING LABEL",
		value,
		notFilled,
		Display,
		stackProps = {},
		zStackProps = {},
		fontSize,
		accessibilityLabel,
		sliderProps = {},
		onSlidingComplete
	} = props;
	const sizes = useSelector(state => state.appState.sizes);
	const defaultValue = $v(value, min);
	const [currentValue, setCurrentValue] = useState(defaultValue);
	const labelW = useBreakpointValue(sliderCapWidths);
	const textSize = $v(fontSize, useBreakpointValue(sizes.sm));
	return (
		<VStack {...stackProps}>
			<Display value={currentValue} />
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
					>{beginLabel}</Text>
				</Box>
				<ZStack
					alignItems="center"
					justifyContent="center"
					flexGrow={1}
					flexShrink={1}
					flexBasis={labelW * 4}
					{...zStackProps}
				>
					<HStack
						alignItems="center"
						justifyContent="space-between"
						w="full"
						children={makeTicks(min, max, step)}
					/>
					<Slider
						{...getSliderProps({
							min,
							max,
							step,
							value: defaultValue,
							notFilled,
							accessibilityLabel,
							onSlidingComplete,
							...sliderProps
						})}
						onValueChange={(v) => setCurrentValue(v)}
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
					>{endLabel}</Text>
				</Box>
			</HStack>
		</VStack>
	);
}


export const SliderWithValueDisplay = (props) => {
	// <SliderWithValueDisplay
	//    min={default 0}
	//    max={default 4}
	//    step={default 1}
	//    value={starting value of the slider, defaults to `min`}
	//    notFilled={if true, the slider does not fill}
	//    beginLabel={left of Slider}
	//    endLabel={right of Slider}
	//    fontSize={size of the labels, defaults to 'sizes.sm'}
	//    stackProps={props for the containing VStack}
	//    Display={element that goes above the slider, gets given a
	//       `value` property}
	//    onSlidingComplete={function for when the slider stops}
	//    accessibilityLabel={description of slider}
	//    sliderProps={optional properties for the slider}
	// />
	const {
		min = 0,
		max = 4,
		step = 1,
		beginLabel = "MISSING LABEL",
		endLabel = "MISSING LABEL",
		sliderProps = {},
		value,
		notFilled,
		Display,
		stackProps = {},
		fontSize,
		accessibilityLabel,
		onSlidingComplete
	} = props;
	const sizes = useSelector(state => state.appState.sizes);
	const defaultValue = $v(value, min);
	const labelW = useBreakpointValue(sliderCapWidths);
	const textSize = $v(fontSize, useBreakpointValue(sizes.sm));
	const [currentValue, setCurrentValue] = useState(defaultValue);
	return (
		<VStack {...stackProps}>
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
					<Text textAlign="center" fontSize={textSize}>{beginLabel}</Text>
				</Box>
				<Slider
					flexGrow={1}
					flexShrink={1}
					flexBasis={labelW * 4}
					{...getSliderProps({
						min,
						max,
						step,
						value: defaultValue,
						notFilled,
						accessibilityLabel,
						onSlidingComplete,
						...sliderProps
					})}
					onValueChange={(v) => setCurrentValue(v)}
				/>
				<Box
					ml={3}
					flexGrow={0}
					flexShrink={1}
					flexBasis={labelW}
				>
					<Text textAlign="center" fontSize={textSize}>{endLabel}</Text>
				</Box>
			</HStack>
		</VStack>
	);
};

export const SliderWithTicksNoCaps = (props) => {
	// <SliderWithTicksNoCaps
	//    min={default 0}
	//    max={default 4}
	//    step={default 1}
	//    notFilled={if true, the slider does not fill}
	//    beginLabel={left of Slider}
	//    endLabel={right of Slider}
	//    fontSize={size of the labels, defaults to 'sizes.sm'}
	//    stackProps={props for the inner ZStack}
	//    value={default value for the slider (defaults to `min`)
	//    onSlidingComplete={function for when the slider stops}
	//    accessibilityLabel={description of slider}
	//    sliderProps={optional properties for the slider}
	//  />
	const {
		min = 0,
		max = 4,
		step = 1,
		beginLabel = "MISSING LABEL",
		endLabel = "MISSING LABEL",
		stackProps = {},
		sliderProps = {},
		notFilled,
		value,
		fontSize,
		accessibilityLabel,
		onSlidingComplete
	} = props;
	const sizes = useSelector(state => state.appState.sizes);
	const defaultValue = $v(value, min);
	let middleTicks = [<Box key="FirstTick" style={{width: 20, height: 12}} bg="transparent" />];
	const stepsUntilEnd = (max - min) / step;
	for (let c = 1; c < stepsUntilEnd; c++) {
		middleTicks.push(<Tick key={"Tick" + String(c)} />);
	}
	middleTicks.push(<Box key="LastTick" style={{width: 20, height: 12}} bg="transparent" />);
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
				<Text textAlign="left" fontSize={textSize}>{beginLabel}</Text>
				<Text textAlign="right" fontSize={textSize}>{endLabel}</Text>
			</HStack>
			<ZStack
				w="5/6"
				m={3}
				alignItems="center"
				justifyContent="center"
				{...stackProps}
			>
				<HStack
					alignItems="center"
					justifyContent="space-between"
					w="full"
					children={middleTicks}
				/>
				<Slider
					{...getSliderProps({
						min,
						max,
						step,
						value: defaultValue,
						notFilled,
						accessibilityLabel,
						onSlidingComplete,
						...sliderProps
					})}
				/>
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
