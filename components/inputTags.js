import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
	Box,
	HStack,
	Input,
	Text,
	TextArea,
	VStack,
	useBreakpointValue,
	Switch,
	Menu
} from "native-base";
import { useWindowDimensions } from 'react-native';

import { SortEitherIcon } from './icons';
import NewSlider from './NewSlider';
import { fontSizesInPx } from '../store/appStateSlice';
import Button from './Button';

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
	labelSize,
	inputProps = {},
	inputSize,
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
	const innerSizeEstimate = fontSizesInPx[inputSize || "sm"] * (rows + 0.2);
	const sizeEstimate = innerSizeEstimate + fontSizesInPx[labelSize || "md"];
	useEffect(() => {
		if(inputProps.style) {
			inputProps.style = {
				height: innerSizeEstimate,
				...inputProps.style
			};
		} else {
			inputProps.style = {
				height: innerSizeEstimate
			};
		}
		setInputElement(() => (
			<TextArea
				key={`TextAreaInput-${id}-${reloadTrigger}`}
				mt={2}
				defaultValue={defaultValue}
				placeholder={placeholder}
				totalLines={rows}
				onChangeText={onChangeText}
				fontSize={inputSize}
				alignItems="flex-start"
				justifyContent="flex-start"
				{...inputProps}
			/>
		));
	}, [reloadTrigger, innerSizeEstimate]);
	if(boxProps.style) {
		boxProps.style = {
			minHeight: sizeEstimate,
			...boxProps.style
		}
	} else {
		boxProps.style = {
			minHeight: sizeEstimate
		}
	}
	return (
		<Box w="full" {...boxProps}>
			{text === null ? <></> : <Text fontSize={labelSize} {...labelProps}>{$v(text, children)}</Text>}
			{[inputElement]}
		</Box>
	);
};


export const ResettableTextSetting = ({
	boxProps = {},
	labelProps = {},
	labelSize,
	inputProps = {},
	inputSize,
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
				fontSize={inputSize}
				{...inputProps}
			/>
		));
	}, [reloadTrigger]);
	const sizeEstimate = fontSizesInPx[inputSize || "sm"] + fontSizesInPx[labelSize || "md"];
	if(boxProps.style) {
		boxProps.style = {
			minHeight: sizeEstimate,
			...boxProps
		}
	} else {
		boxProps.style = {
			minHeight: sizeEstimate
		}
	}
	return (
		<Box w="full" {...boxProps}>
			<Text fontSize={labelSize} {...labelProps}>{$v(text, children)}</Text>
			{[inputElement]}
		</Box>
	);
};


export const RangeSlider = ({
	min = 0,
	max = 4,
	step = 1,
	value = min,
	ticked,
	capped = true,
	notFilled,
	minimumLabel = "MISSING LABEL",
	maximumLabel = "MISSING LABEL",
	fontSize,
//	accessibilityLabel,
	onChange,
	PreElement,
	PostElement,
	showValue,
	ValueContainer,
	colorScheme,
	xPadding = 0,
	modalPaddingInfo,
	labelWidth,
	containerProps = {},
	id
}) => {
	// <RangeSlider
	//    min={number; default 0}
	//    max={number; default 4}
	//    step={number; default 1}
	//    value={number; starting value for the slider; defaults to `min`}
	//    ticked={boolean; if true, tick marks will be rendered; default false}
	//    capped={boolean; if true, min/max labels are put in line w/slider;
	//            otherwise, labels are put above the slider; default true}
	//    notFilled={boolean; if true, the slider does not "fill"; default false}
	//    minimumLabel={string or Element; left of Slider}
	//    maximumLabel={string or Element; right of Slider}
	//    fontSize={size of the labels, defaults to 'sizes.sm'}
	//    onChange={function; fired when slider stops moving}
	//    PreElement={optional, displayed above the slider}
	//    PostElement={optional, displayed below the slider}
	//    showValue={integer; if positive, value will be shown always;
	//               if negative, value will be shown only when active;
	//               if zero, value is never shown}
	//    ValueContainer={an Element that will wrap the value when shown;
	//                    defaults to simple text in the thumb}
	//    colorScheme={defaults to 'secondary'}
	//    xPadding={integer; extra padding around the slider element; default 0}
	//    labelWidth={number; estimated ems the labels should span}
	// />
	const sizes = useSelector(state => state.appState.sizes);
	const textSize = $v(fontSize, useBreakpointValue(sizes.sm));
	const { width } = useWindowDimensions();
	const simpleOutput = capped && !(PreElement || PostElement);
	const labelW = labelWidth ? fontSizesInPx[textSize] * labelWidth : width / 6;
	let maybeExtraPadding = 0;
	if(modalPaddingInfo) {
		const { maxWidth, sizeRatio } = modalPaddingInfo;
		const modalSize = Math.min(maxWidth, width * sizeRatio);
		maybeExtraPadding = width - modalSize;
	}
	const containerWidth = width - xPadding - maybeExtraPadding;
	const outerContainerWidth = containerWidth - 16;
	const sliderWidth = outerContainerWidth - (capped ? (labelW * 2) + 32 : 16) - 16;

	const OuterContainer = ({children, ...props}) => {
		if(simpleOutput) {
			return (
				<HStack
					{...props}
					bg="darker"
					borderRadius="md"
					style={{
						width: outerContainerWidth
					}}
				>{children}</HStack>);
		}
		return (
			<VStack {...props} style={{width: outerContainerWidth}}>
				{PreElement &&
					<PreElement />
				}
				<Box
					bg="darker"
					borderRadius="md"
					style={{
						width: outerContainerWidth
					}}
				>
					{capped ||
						<HStack justifyContent="space-between" w="full" px={2}>
							<Text textAlign="left" fontSize={textSize}>{minimumLabel}</Text>
							<Text textAlign="right" fontSize={textSize}>{maximumLabel}</Text>
						</HStack>
					}
					<HStack
						w="full"
						alignItems="center"
						style={{
							paddingVertical: 4,
							paddingHorizontal: 8
						}}
					>
						{children}
					</HStack>
				</Box>
				{PostElement &&
					<PostElement />
				}
			</VStack>
		);
	};
	return (
		<Box
			style={{
				width: containerWidth,
				paddingHorizontal: 8,
				paddingVertical: 4
			}}
			{...containerProps}
		><OuterContainer
			alignItems="center"
			justifyContent="center"
		>
			{capped &&
				<Box
					style={{
						width: labelW
					}}
				>
					<Text
						textAlign="center"
						fontSize={textSize}
					>{minimumLabel}</Text>
				</Box>
			}
			<Box style={{width: 8}} />
			<NewSlider
				fontSize={textSize}
				id={id || `${minimumLabel}/${maximumLabel}:${min}/${max}/${step}`}
				{...{
					min,
					max,
					step,
					value,
					notFilled,
					onChange,
					sliderWidth,
					ticked,
					capped,
					showValue,
					ValueContainer,
					colorScheme
				}}
			/>
			<Box style={{width: 8}} />
			{capped &&
				<Box
					style={{
						width: labelW
					}}
				>
					<Text
						textAlign="center"
						fontSize={textSize}
					>{maximumLabel}</Text>
				</Box>
			}
		</OuterContainer></Box>
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


export const DropDown = (props) => {
	const {
		placement = "bottom left",
		closeOnSelect = true,
		bg,
		color,
		pressedBg,
		scheme = "secondary",
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
	//    scheme = {string; Button color scheme; defaults to secondary}
	//    bg,color,pressedBg = {string; overrides scheme}
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
	const coloring = color || `${scheme}.50`;
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
						color={color}
						pressedBg={pressedBg}
						scheme={scheme}
						_stack={{
							justifyContent: "space-between",
							alignItems: "center",
							space: 0,
							style: {
								overflow: "hidden"
							}
						}}
						startIcon={startIcon || <SortEitherIcon size={fontSize} mr={1} flexGrow={0} flexShrink={0} />}
						{...buttonProps}
						{...props}
					>
						<Box
							overflow="hidden"
						>
							<Text fontSize={fontSize} color={coloring} isTruncated textAlign="left" noOfLines={1}>{labelFunc()}</Text>
						</Box>
					</Button>
				)
			}
		>
			<Menu.OptionGroup
				title={title}
				_title={{fontSize: titleSize || fontSize, color: "primary.500"}}
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
		scheme = "secondary",
		bg,
		color,
		pressedBg,
		markedColor,
		markedBg,
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
	//    scheme = {string; Button color scheme; defaults to secondary}
	//    bg,color,pressedBg = {string; overrides scheme}
	//    markedColor = {string; special text color; defaults to `scheme`.50}
	//    markedBg = {string; special bg color; defaults to `scheme`.600}
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
	const coloring = color || `${scheme}.50`;
	const markF = markedColor || `${scheme}.50`;
	const markB = markedBg || `${scheme}.600`;
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
						scheme={scheme}
						bg={bg}
						color={color}
						pressedBg={pressedBg}
						_stack={{
							justifyContent: "space-between",
							alignItems: "center",
							space: 0,
							style: {
								overflow: "hidden"
							}
						}}
						startIcon={startIcon || <SortEitherIcon size={fontSize} mr={1} flexGrow={0} flexShrink={0} />}
						{...buttonProps}
						{...props}
					>
						<Box
							overflow="hidden"
						>
							<Text fontSize={fontSize} color={coloring} isTruncated textAlign="left" noOfLines={1}>{labelText}</Text>
						</Box>
					</Button>
				)
			}
		>
			<Menu.Group
				title={title}
				_title={{fontSize: titleSize || fontSize, color: "primary.500"}}
			>
				{
					options.map(({key, onPress, label}) => (
						<Menu.Item
							key={key}
							_text={{
								fontSize: menuSize || fontSize,
								color: isMarked && isMarked(key) ? markF : "text.50"
							}}
							bg={isMarked && isMarked(key) ? markB : "main.900"}
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
