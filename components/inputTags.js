import { Fragment, useEffect, useState } from 'react';
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
	Slider
} from "native-base";

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

export const SliderWithTicks = ({
	min = 0,
	max = 4,
	step = 1,
	beginLabel = "MISSING LABEL",
	endLabel = "MISSING LABEL",
	stackProps = {},
	sliderProps = {},
	notFilled,
	value,
	fontSize
}) => {
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
	//    sliderProps={optional properties for the slider}
	// />
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
					size="sm"
					minValue={min}
					maxValue={max}
					step={step}
					defaultValue={defaultValue}
					{...sliderProps}
				>
					<Slider.Track>
						{notFilled ? <></> : <Slider.FilledTrack />}
					</Slider.Track>
					<Slider.Thumb />
				</Slider>
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

export const SliderWithTicksAndValueDisplay = ({
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
	sliderProps = {},
	reloadTrigger = 0
}) => {
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
	//    sliderProps={optional properties for the slider}
	//    reloadTrigger={a value that changes when underlying props are modified}
	// />
	const sizes = useSelector(state => state.appState.sizes);
	const defaultValue = $v(value, min);
	const [currentValue, setCurrentValue] = useState(defaultValue);
	const labelW = useBreakpointValue(sliderCapWidths);
	const textSize = $v(fontSize, useBreakpointValue(sizes.sm));
	const [sliderElement, setSliderElement] = useState(() => <Fragment key={`${beginLabel}-${reloadTrigger}-${endLabel}-Frag`} />);
	useEffect(() => {
		setCurrentValue(defaultValue);
		setSliderElement(() => (
			<Slider
				key={`${beginLabel}-${reloadTrigger}-${endLabel}`}
				size="sm"
				minValue={min}
				maxValue={max}
				step={step}
				defaultValue={defaultValue}
				onChange={(v) => setCurrentValue(v)}
				{...sliderProps}
			>
				<Slider.Track>
					{notFilled ? <></> : <Slider.FilledTrack />}
				</Slider.Track>
				<Slider.Thumb />
			</Slider>
		));
	}, [reloadTrigger]);
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
					{[sliderElement]}
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


export const SliderWithValueDisplay = (({
	min = 0,
	max = 4,
	beginLabel = "MISSING LABEL",
	endLabel = "MISSING LABEL",
	sliderProps = {},
	value,
	notFilled,
	Display,
	stackProps = {},
	fontSize,
	reloadTrigger = 0
}) => {
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
	//    reloadTrigger={a value that changes when underlying props are modified}
	// />
	const sizes = useSelector(state => state.appState.sizes);
	const defaultValue = $v(value, min);
	const labelW = useBreakpointValue(sliderCapWidths);
	const textSize = $v(fontSize, useBreakpointValue(sizes.sm));
	const [currentValue, setCurrentValue] = useState(defaultValue);
	const [sliderElement, setSliderElement] = useState(() => <Fragment key={`${beginLabel}-${reloadTrigger}-${endLabel}-FRAG`} />);
	useEffect(() => {
		setCurrentValue(defaultValue);
		setSliderElement(() => (
			<Slider
				key={`${beginLabel}-${reloadTrigger}-${endLabel}`}
				size="sm"
				minValue={min}
				maxValue={max}
				step={1}
				defaultValue={defaultValue}
				flexGrow={1}
				flexShrink={1}
				flexBasis={labelW * 4}
				onChange={(v) => setCurrentValue(v)}
				{...sliderProps}
			>
				<Slider.Track>
					{notFilled ? <></> : <Slider.FilledTrack />}
				</Slider.Track>
				<Slider.Thumb />
			</Slider>
		));
	}, [reloadTrigger]);
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
				{[sliderElement]}
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
});

export const SliderWithTicksNoCaps = ({
	min = 0,
	max = 4,
	step = 1,
	beginLabel = "MISSING LABEL",
	endLabel = "MISSING LABEL",
	stackProps = {},
	sliderProps = {},
	notFilled,
	value,
	fontSize
}) => {
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
	//    sliderProps={optional properties for the slider}
	// />
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
					size="sm"
					minValue={min}
					maxValue={max}
					step={step}
					defaultValue={defaultValue}
					{...sliderProps}
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

export const ToggleSwitch = ({
	hProps = {},
	vProps = {},
	label = "MISSING LABEL",
	labelSize,
	labelProps = {},
	desc,
	descSize,
	descProps = {},
	switchState,
	switchToggle,
	switchProps = {}
}) => {
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
	// />
	const sizes = useSelector(state => state.appState.sizes);
	const textSize = $v(labelSize, useBreakpointValue(sizes.sm));
	const smallerSize = $v(descSize, useBreakpointValue(sizes.xs));
	return (
		<HStack
			w="full"
			justifyContent="space-between"
			alignItems="center"
			{...hProps}
		>
			<VStack
				flexGrow={1}
				flexShrink={2}
				mr={2}
				{...vProps}
			>
				<Text fontSize={textSize} {...labelProps}>{label}</Text>
				{desc ? <Text fontSize={smallerSize} {...descProps}>{desc}</Text> : <></>}
			</VStack>
			<Switch
				isChecked={switchState}
				onToggle={switchToggle}
				{...switchProps}
			/>
		</HStack>
);
};
