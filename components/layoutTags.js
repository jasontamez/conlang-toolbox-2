import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
	Box,
	HStack,
	ZStack,
	Slider,
	Input,
	ScrollView,
	Text,
	TextArea,
	VStack
 } from "native-base";

import { Bar } from "./icons";
import debounce from './debounce';

// v(unknown property, default value)
//    returns the property if it exists, or default value otherwise
const v = (given, base) => given === undefined ? base : given;


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
			{...v(boxProps, {})}
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
				{...v(scrollProps, {})}
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
			{...v(boxProps, {})}
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
	//    text={optional, goes into Text; if missing, uses children instead}
	//    value={TextArea defaultValue}
	//    placeholder={TextArea placeholder}
	//    rows={TextArea totalLines}
	//    onChangeText={TextArea onChangeText}
	//    inputProps={other props for TextArea} />
	const {
		boxProps,
		labelProps,
		inputProps,
		text,
		children,
		value,
		placeholder,
		rows,
		onChangeText
	} = props;
	return (
		<Box w="full" {...v(boxProps, {})}>
			<Text {...v(labelProps, {})}>{v(text, children)}</Text>
			<TextArea
				mt={2}
				defaultValue={value}
				placeholder={placeholder}
				totalLines={v(rows, 3)}
				onChangeText={onChangeText}
				{...v(inputProps, {})}
			/>
		</Box>
	);
};

export const TextSetting = (props) => {
	// <TextSetting
	//    boxProps={props for outer Box}
	//    labelProps={props for Text}
	//    text={optional, goes into Text; if missing, uses children instead}
	//    value={Input defaultValue}
	//    placeholder={Input placeholder}
	//    onChangeText={Input onChangeText}
	//    inputProps={other props for Input} />
	const {
		boxProps,
		labelProps,
		inputProps,
		text,
		children,
		value,
		placeholder,
		onChangeText
	} = props;
	return (
		<Box w="full" {...v(boxProps, {})}>
			<Text {...v(labelProps, {})}>{v(text, children)}</Text>
			<Input
				defaultValue={value}
				placeholder={placeholder}
				onChangeText={onChangeText}
				{...v(inputProps, {})}
			/>
		</Box>
	);
};

export const SliderWithTicks = (props) => {
	// <SliderWithTicks
	//    min={default 0}
	//    max={default 4}
	//    notFilled={if true, the slider does not fill}
	//    beginLabel={left of Slider}
	//    endLabel={right of Slider}
	//    width={desired width of entire element including labels}
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
		width,
		notFilled,
		value
	} = props;
	const minVal = v(min, 0);
	const maxVal = v(max, 4);
	const defaultValue = v(value, minVal);
	const labelW = Math.floor(v(width, 1000) / 6);
	const Tick = (props) => <Bar size="xs" color="sliderTickColor" {...v(tickProps, {})} {...props} />;
	let middleTicks = [<Tick key="FirstTick" color="transparent" size="2xs" />];
	for (let c = minVal + 1; c < maxVal; c++) {
		middleTicks.push(<Tick key={"Tick" + String(c)} />);
	}
	middleTicks.push(<Tick key="LastTick" color="transparent" size="2xs" />);
	return (
		<HStack
			d="flex"
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
				<Text textAlign="center" fontSize="sm">{v(beginLabel, "MISSING LABEL")}</Text>
			</Box>
			<ZStack
				alignItems="center"
				justifyContent="center"
				flexGrow={1}
				flexShrink={2}
				flexBasis={labelW * 4}
				{...v(stackProps, {})}
			>
				<HStack
					alignItems="center"
					justifyContent="space-between"
					w="full"
					children={middleTicks}
				>
				</HStack>
				<Slider
					size="sm"
					minValue={minVal}
					maxValue={maxVal}
					step={1}
					defaultValue={defaultValue}
					{...v(sliderProps, {})}
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
				<Text textAlign="center" fontSize="sm">{v(endLabel, "MISSING LABEL")}</Text>
			</Box>
		</HStack>
	);
};

export const SliderWithTicksAndLabels = (props) => {
	// <SliderWithLabels
	//    min={default 0}
	//    max={default 4}
	//    value={starting value of the slider, defaults to `min`}
	//    notFilled={if true, the slider does not fill}
	//    beginLabel={left of Slider}
	//    endLabel={right of Slider}
	//    width={desired width of entire element including labels}
	//    sliderProps={props for the Slider}
	//       NOTE: sliderProps.defaultValue can override `value`
	//    stackProps={props for the containing VStack}
	//    zStackProps={props for the ZStack}
	//    tickProps={props for the background tick bar}
	//    valueProps={props for the Text element surrounding `value`}
	//    Label={element that goes above the slider, gets given a
	//       `value` property}
	// />
	const {
		min,
		max,
		beginLabel,
		endLabel,
		sliderProps,
		tickProps,
		width,
		value,
		notFilled,
		Label,
		stackProps,
		zStackProps
	} = props;
	const [currentValue, setCurrentValue] = useState(v(value, v(min, 0)));
	return (
		<VStack {...v(stackProps, {})}>
			<Label value={currentValue} />
			<SliderWithTicks
				stackProps={zStackProps}
				sliderProps={{
					onChange: (v) => setCurrentValue(v),
					...v(sliderProps, {})
				}}
				{...{
					min,
					max,
					beginLabel,
					tickProps,
					endLabel,
					width,
					notFilled,
					value
				}}
			/>
		</VStack>
	);
}


export const SliderWithLabels = (props) => {
	// <SliderWithLabels
	//    min={default 0}
	//    max={default 4}
	//    value={starting value of the slider, defaults to `min`}
	//    notFilled={if true, the slider does not fill}
	//    beginLabel={left of Slider}
	//    endLabel={right of Slider}
	//    width={desired width of entire element including labels}
	//    sliderProps={props for the Slider}
	//       NOTE: sliderProps.defaultValue can override `value`
	//    stackProps={props for the containing VStack}
	//    valueProps={props for the Text element surrounding `value`}
	//    Label={element that goes above the slider, gets given a
	//       `value` property}
	// />
	const {
		min,
		max,
		beginLabel,
		endLabel,
		sliderProps,
		width,
		value,
		notFilled,
		Label,
		stackProps
	} = props;
	const minVal = v(min, 0);
	const defaultValue = v(value, minVal);
	const labelW = Math.floor(v(width, 1000) / 6);
	const [currentValue, setCurrentValue] = useState(defaultValue);
	return (
		<VStack {...v(stackProps, {})}>
			<Label value={currentValue} />
			<HStack
				d="flex"
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
					<Text textAlign="center" fontSize="sm">{v(beginLabel, "MISSING LABEL")}</Text>
				</Box>
				<Slider
					size="sm"
					minValue={minVal}
					maxValue={v(max, 50)}
					step={1}
					defaultValue={defaultValue}
					flexGrow={1}
					flexShrink={2}
					flexBasis={labelW * 4}
						onChange={(v) => setCurrentValue(v)}
					{...v(sliderProps, {})}
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
					<Text textAlign="center" fontSize="sm">{v(endLabel, "MISSING LABEL")}</Text>
				</Box>
			</HStack>
		</VStack>
	);
};
