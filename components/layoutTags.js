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
	TextArea
 } from "native-base";

import { Bar } from "./icons";
import debounce from './debounce';

export const NavBar = (props) => {
	const location = useLocation();
	const [scrollPos, setScrollPos] = useState(0);
	const navRef = useRef(null);
	const maybeUpdateScrollPos = ({contentOffset}) => {
		contentOffset && contentOffset.x && setScrollPos(contentOffset.x);
	};
	useEffect(() => {
		navRef.current.scrollTo({x: scrollPos, y: 0, animated: false});
	}, [location]);
	const boxProps = props.boxProps || {};
	const scrollProps = props.scrollProps || {};
	const otherProps = {...props};
	delete otherProps.boxProps;
	delete otherProps.scrollProps;
	return (
		<Box
			w="full"
			position="absolute"
			left={0}
			bottom={0}
			right={0}
			bg="main.800"
			{...boxProps}
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
				{...scrollProps}
			>
				<HStack
					w="full"
					space={4}
					justifyContent="space-between"
					{...otherProps}/>
			</ScrollView>
		</Box>
	);
};

export const TextAreaSetting = (props) => {
	const boxProps = props.boxProps || {};
	const labelProps = props.labelProps || {};
	const inputProps = props.inputProps || {};
	const text = props.text || props.children;
	return (
		<Box w="full" {...boxProps}>
			<Text {...labelProps}>{text}</Text>
			<TextArea mt={2}
				defaultValue={props.value}
				placeholder={props.placeholder}
				totalLines={props.rows || 3}
				onChangeText={props.onChangeText}
				{...inputProps}
			/>
		</Box>
	);
};

export const TextSetting = (props) => {
	const boxProps = props.boxProps || {};
	const labelProps = props.labelProps || {};
	const inputProps = props.inputProps || {};
	const text = props.text || props.children;
	return (
		<Box w="full" {...boxProps}>
			<Text {...labelProps}>{text}</Text>
			<Input
				defaultValue={props.value}
				placeholder={props.placeholder}
				onChangeText={props.onChangeText}
				{...inputProps}
			/>
		</Box>
	);
};

export const SliderWithTicks = (props) => {
	const min = props.min || 0;
	const max = props.max || 4;
	const beginLabel = props.beginLabel || "MISSING LABEL";
	const endLabel = props.endLabel || "MISSING LABEL";
	const tickProps = props.tickProps || {};
	const stackProps = props.stackProps || {};
	const sliderProps = props.sliderProps || {};
	const width = Math.floor((props.width || 1000) / 6);
	const Tick = (props) => <Bar size="xs" color="sliderTickColor" {...tickProps} {...props} />;
	let middleTicks = [<Tick key="FirstTick" color="transparent" size="2xs" />];
	for (let c = min + 1; c < max; c++) {
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
				flexBasis={width}
			>
				<Text textAlign="center" fontSize="sm">{beginLabel}</Text>
			</Box>
			<ZStack
				alignItems="center"
				justifyContent="center"
				flexGrow={1}
				flexShrink={2}
				flexBasis={width * 4}
				{...stackProps}
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
					minValue={min}
					maxValue={max}
					step={1}
					{...sliderProps}
				>
					<Slider.Track>
						{props.notFilled ? <></> : <Slider.FilledTrack />}
					</Slider.Track>
					<Slider.Thumb />
				</Slider>
			</ZStack>
			<Box
				ml={3}
				flexGrow={0}
				flexShrink={1}
				flexBasis={width}
			><Text textAlign="center" fontSize="sm">{endLabel}</Text></Box>
		</HStack>
	);
};
