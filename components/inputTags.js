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
	Slider as OldSlider,
	Menu,
	Button
} from "native-base";
import { useWindowDimensions } from 'react-native';

import { SortEitherIcon } from './icons';
import NewSlider from './NewSlider';

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
const sliderStyle = {};

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


export const ResettableTextAreaSetting = ({
	boxProps = {},
	labelProps = {},
	inputProps = {},
	text,
	children,
	defaultValue,
	placeholder,
	rows = 3,
	onChangeText,
	reloadTrigger = 0,
	id = ""
}) => {
	// <ResettableTextAreaSetting
	//    boxProps={props for outer Box}
	//    labelProps={props for Text}
	//    text={goes into Text; if missing, uses children instead; if null, not shown}
	//    defaultValue={TextArea defaultValue}
	//    placeholder={TextArea placeholder}
	//    rows={TextArea totalLines}
	//    onChangeText={TextArea onChangeText}
	//    inputProps={other props for TextArea}
	// />
	const [inputElement, setInputElement] = useState(() => <Fragment key={`TextAreaInput-Frag-${id}-${reloadTrigger}`} />);
	useEffect(() => {
		setInputElement(() => (
			<TextArea
				key={`TextAreaInput-${id}-${reloadTrigger}`}
				mt={2}
				defaultValue={defaultValue}
				placeholder={placeholder}
				totalLines={rows}
				onChangeText={onChangeText}
				{...inputProps}
			/>
		));
	}, [reloadTrigger]);
	return (
		<Box w="full" {...boxProps}>
			{text === null ? <></> : <Text {...labelProps}>{$v(text, children)}</Text>}
			{[inputElement]}
		</Box>
	);
};


export const ResettableTextSetting = ({
	boxProps = {},
	labelProps = {},
	inputProps = {},
	text,
	children,
	defaultValue,
	placeholder,
	onChangeText,
	reloadTrigger = 0,
	id = ""
}) => {
	// <ResettableTextSetting
	//    boxProps={props for outer Box}
	//    labelProps={props for Text}
	//    text={goes into Text; if missing, uses children instead}
	//    defaultValue={Input defaultValue}
	//    placeholder={Input placeholder}
	//    onChangeText={Input onChangeText}
	//    inputProps={other props for Input}
	//    reloadTrigger={a value that changes when underlying props are modified}
	// />
	const [inputElement, setInputElement] = useState(() => <Fragment key={`TextInput-Frag-${id}-${reloadTrigger}`} />);
	useEffect(() => {
		setInputElement(() => (
			<Input
				key={`TextInput-${id}-${reloadTrigger}`}
				defaultValue={defaultValue}
				placeholder={placeholder}
				onChangeText={onChangeText}
				{...inputProps}
			/>
		));
	}, [reloadTrigger]);
	return (
		<Box w="full" {...boxProps}>
			<Text {...labelProps}>{$v(text, children)}</Text>
			{[inputElement]}
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
		middleTicks.push(<Tick key={`Tick-${c}`} />);
	}
	middleTicks.push(<Box key="LastTick" style={{width: 20, height: 12}} bg="transparent" />);
	return middleTicks;
};

// TO-DO: Investigate Sliders
//   the ones with Ticks don't seem to work well
export const RangeSlider = ({
	min = 0,
	max = 4,
	step = 1,
	ticked,
	capped,
	minimumLabel = "MISSING LABEL",
	maximumLabel = "MISSING LABEL",
	fontSize,
	notFilled,
	value,
//	accessibilityLabel,
	onSlide,
	onChange,
	PreElement,
	PostElement,
	showValue,
	colorScheme,
	xPadding = 0
}) => {
	// <RangeSlider
	//    min={default 0}
	//    max={default 4}
	//    step={default 1}
	//    ticked={if true, tick marks will be rendered}
	//    capped={if true, begin/end labels are put in line w/slider;
	//            otherwise, labels are put above the slider}
	//    notFilled={if true, the slider does not fill}
	//    minimumLabel={left of Slider}
	//    maximumLabel={right of Slider}
	//    fontSize={size of the labels, defaults to 'sizes.sm'}
	//    value={default value for the slider (defaults to `min`)
	//    onSlide={function; continuously updated when slider moves}
	//    onChange={function; fired when slider stops moving}
	//    resettable={if true, slider will change when underlying value changes}
	//    xPadding={extra padding around the slider element; default 0}
	// />
	const sizes = useSelector(state => state.appState.sizes);
	const defaultValue = $v(value, min);
	const textSize = $v(fontSize, useBreakpointValue(sizes.sm));
	const { width } = useWindowDimensions();
	const labelW = width / 6;
	// 24 = Box margins
	// 16 = HStack padding
	const innerPadding = capped ? (24 + (labelW * 2)) : 16;
	const containerWidth = width - xPadding;
	// 16 = OuterContainer padding
	const sliderWidth = containerWidth - 16 - innerPadding;
	const OuterContainer = ({children, ...props}) => {
		if(capped && !PreElement) {
			return <HStack {...props}>{children}</HStack>;
		}
		return (
			<VStack {...props}>
				{PreElement &&
					<PreElement />
				}
				{capped ||
					<HStack justifyContent="space-between" w="full">
						<Text textAlign="left" fontSize={textSize}>{minimumLabel}</Text>
						<Text textAlign="right" fontSize={textSize}>{maximumLabel}</Text>
					</HStack>
				}
				<HStack w="full" alignItems="center" px={2} py={1}>
					{children}
				</HStack>
				{PostElement &&
					<PostElement />
				}
			</VStack>
		);
	};
	return (
		<OuterContainer
			style={{width: containerWidth}}
			bg="darker"
			px={2}
			py={1}
			rounded="md"
			alignItems="center"
		>
			{capped &&
				<Box
					mr={3}
					style={{width: labelW}}
				>
					<Text
						textAlign="center"
						fontSize={textSize}
					>{minimumLabel}</Text>
				</Box>
			}
			<NewSlider
				value={defaultValue}
				{...{
					min,
					max,
					step,
					notFilled,
					onChange,
					fontSize,
					sliderWidth,
					ticked,
					capped,
					showValue,
					colorScheme
				}}
				onSlide={onSlide}
			/>
			{capped &&
				<Box
					ml={3}
					style={{width: labelW}}
				>
					<Text
						textAlign="center"
						fontSize={textSize}
					>{maximumLabel}</Text>
				</Box>
			}
		</OuterContainer>
	);
};

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
		middleTicks.push(<Tick key={`Tick-${c}`} />);
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
				<OldSlider
					size="sm"
					minValue={min}
					maxValue={max}
					step={step}
					defaultValue={defaultValue}
					{...sliderProps}
				>
					<OldSlider.Track>
						{notFilled ? <></> : <OldSlider.FilledTrack />}
					</OldSlider.Track>
					<OldSlider.Thumb />
				</OldSlider>
			</ZStack>
		</VStack>
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
			<OldSlider
				key={`${beginLabel}-${reloadTrigger}-${endLabel}`}
				size="sm"
				minValue={min}
				maxValue={max}
				step={step}
				defaultValue={defaultValue}
				onChange={(v) => setCurrentValue(v)}
				{...sliderProps}
			>
				<OldSlider.Track>
					{notFilled ? <></> : <OldSlider.FilledTrack />}
				</OldSlider.Track>
				<OldSlider.Thumb />
			</OldSlider>
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

// TO-DO: SliderWithValueDisplay doesn't always work
//   wgSettings: the first slider is ok, the other two have the
//     same issues as the Ticked ones
//   wgOutput: the two (modal) sliders DO NOT SLIDE at all
//   wgSyllables: same Ticked issue, plus modal sliders DON'T WORK
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
			<OldSlider
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
				<OldSlider.Track>
					{notFilled ? <></> : <OldSlider.FilledTrack />}
				</OldSlider.Track>
				<OldSlider.Thumb />
			</OldSlider>
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


export const DropDown = (props) => {
	const {
		placement = "bottom left",
		closeOnSelect = true,
		bg = "secondary.500",
		color = "secondary.50",
		fontSize = "sm",
		titleSize,
		menuSize,
		startIcon,
		labelFunc,
		onChange,
		defaultValue,
		value,
		title,
		options = [],
		buttonProps = {}
	} = props;
	// <DropDown
	//    placement = {string; default "bottom left"}
	//    closeOnSelect = {boolean; default true}
	//    bg = {string; background color; defaults to secondary.500}
	//    color = {string; foreground color; defaults to secondary.50}
	//    fontSize = {enum; font size}
	//    titleSize = {enum; optional; font size for Menu title}
	//    menuSize = {enum; optional; font size for Menu.ItemOption}
	//    startIcon = {<Icon>; optional}
	//    labelFunc = {Function; returns a string for the current label}
	//    onChange = {Function}
	//    defaultValue = {starting value}
	//    value = {controlled value}
	//    title = {title of the Menu}
	//    options = {Array; {key: string, label: string, value: any}}
	//    buttonProps = {Object; additional props for the <Button>}
	// />
	return (
		<Menu
			placement={placement}
			closeOnSelect={closeOnSelect}
			trigger={
				(props) => (
					<Button
						p={1}
						ml={2}
						mr={1}
						bg={bg}
						_stack={{
							justifyContent: "space-between",
							alignItems: "center",
							space: 0,
							style: {
								overflow: "hidden"
							}
						}}
						startIcon={startIcon || <SortEitherIcon size={fontSize} mr={1} color={color} flexGrow={0} flexShrink={0} />}
						{...buttonProps}
						{...props}
					>
						<Box
							overflow="hidden"
						>
							<Text fontSize={fontSize} color={color} isTruncated textAlign="left" noOfLines={1}>{labelFunc()}</Text>
						</Box>
					</Button>
				)
			}
		>
			<Menu.OptionGroup
				title={title}
				_title={{fontSize: titleSize || fontSize}}
				defaultValue={defaultValue}
				value={value}
				type="radio"
				onChange={onChange}
			>
				{
					options.map(({key, value, label}) => (
						<Menu.ItemOption
							key={key}
							value={value}
							_text={{fontSize: menuSize || fontSize}}
						>
							{label}
						</Menu.ItemOption>
					))
				}
			</Menu.OptionGroup>
		</Menu>
	);
};


export const DropDownMenu = (props) => {
	const {
		placement = "bottom left",
		closeOnSelect = true,
		bg = "secondary.500",
		color = "secondary.50",
		markedColor = "secondary.50",
		markedBg = "secondary.600",
		isMarked,
		fontSize = "sm",
		titleSize,
		menuSize,
		startIcon,
		labelFunc,
		title,
		options = [],
		buttonProps = {}
	} = props;
	// <DropDown
	//    placement = {string; default "bottom left"}
	//    closeOnSelect = {boolean; default true}
	//    bg = {string; background color; defaults to secondary.500}
	//    color = {string; foreground color; defaults to secondary.50}
	//    markedColor = {string; special text color; defaults to secondary.50}
	//    markedBg = {string; special bg color; defaults to secondary.600}
	//    isMarked = {Function; optional; given menu key as argument}
	//    fontSize = {enum; font size}
	//    titleSize = {enum; optional; font size for Menu title}
	//    menuSize = {enum; optional; font size for Menu.ItemOption}
	//    startIcon = {<Icon>; optional}
	//    labelFunc = {Function; returns a string for the current label}
	//    title = {title of the Menu}
	//    options = {Array: {key: string, label: string, onPress: Function}}
	//    buttonProps = {Object; additional props for the <Button>}
	// />
	const labelText = labelFunc();
	return (
		<Menu
			placement={placement}
			closeOnSelect={closeOnSelect}
			trigger={
				(props) => (
					<Button
						p={1}
						ml={2}
						mr={1}
						bg={bg}
						_stack={{
							justifyContent: "space-between",
							alignItems: "center",
							space: 0,
							style: {
								overflow: "hidden"
							}
						}}
						startIcon={startIcon || <SortEitherIcon size={fontSize} mr={1} color={color} flexGrow={0} flexShrink={0} />}
						{...buttonProps}
						{...props}
					>
						<Box
							overflow="hidden"
						>
							<Text fontSize={fontSize} color={color} isTruncated textAlign="left" noOfLines={1}>{labelText}</Text>
						</Box>
					</Button>
				)
			}
		>
			<Menu.Group
				title={title}
				_title={{fontSize: titleSize || fontSize}}
			>
				{
					options.map(({key, onPress, label}) => (
						<Menu.Item
							key={key}
							_text={{
								fontSize: menuSize || fontSize,
								color: isMarked && isMarked(key) ? markedColor : "text.50"
							}}
							bg={isMarked && isMarked(key) ? markedBg : "main.900"}
							onPress={onPress}
						>
							{label}
						</Menu.Item>
					))
				}
			</Menu.Group>
		</Menu>
	);
};
