import React, { useState } from 'react';
import {
	Box,
	HStack,
	ZStack,
	Text,
	Circle
} from "native-base";
import ReAnimated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { fontSizesInPx } from '../store/appStateSlice';


const NewSlider = ({
	min = 0,
	max = 4,
	step = 1,
	notFilled,
	fontSize,
	value,
	onChange,
	ticked,
	sliderWidth,
	showValue = 0,
	ValueContainer,
	colorScheme = "secondary",
	id
}) => {

	// A - trAck height
	// I - tIck diameter
	// B - thumB diameter
	// H - total height

	// total Height:
	//
	// H
	// H B
	// H B
	// H B
	// H B I A
	// H B I
	// H B
	// H B
	// H B
	// H

	// I = 2A
	// B = 8A = 4I
	// H = 10A = 5I = (B + I)

	// H - A = 9A (4.5A for pad)
	// H - I = 8A = 4I = B (4A, 2I, B/2 for pad)
	// H - B = I = 2A (A for pad)

	const tickDiameter = fontSizesInPx[fontSize] / 2;
	const trackHeight = tickDiameter / 2;
	const thumbDiameter = tickDiameter * 4;
	const totalHeight = thumbDiameter + tickDiameter;
	const trackLength = sliderWidth - thumbDiameter;
	const trackWidthPad = thumbDiameter / 2;
	const trackHeightPad = trackHeight * 4.5;
	const stepLength = trackLength / ((max - min) / step);

	const tickTrackLength = trackLength + tickDiameter;
	const tickTrackWidthPad = (thumbDiameter / 2) - (tickDiameter / 2);
	const tickTrackHeightPad = tickDiameter * 2;

	const _start = (value - min) * stepLength;

	const starting = useSharedValue(_start);
	const actualValue = useSharedValue(value);
	const xPos = useSharedValue(_start);
	const pressed = useSharedValue(false);
	const [v, setV] = useState(value);
	const setter = (doSet = pressed.value) => {
		doSet && setV(actualValue.value);
	};

	const gesture = Gesture.Pan()
		.onBegin(() => {
			pressed.value = true;
		})
		.onUpdate((e) => {
			'worklet'
			const input = e.translationX;
			const rawX = Math.min(
				trackLength,
				Math.max(0, starting.value + input)
			);
			const rawValue = rawX / stepLength;
			const trueValue = Math.floor(rawValue + 0.5);
			const newValue = Math.floor((trueValue * stepLength) + 0.5);
			actualValue.value = trueValue + min;
			runOnJS(setter)();
			xPos.value = newValue;
		})
		.onEnd(() => {
			starting.value = xPos.value;
		})
		.onFinalize(() => {
			pressed.value = false;
			runOnJS(setter)(true);
			runOnJS(onChange)(actualValue.value);
		});

	const fillStyle = useAnimatedStyle(() => {
		return {
			height: trackHeight,
			width: xPos.value
		};
	});
	const thumbStyleAnimated = useAnimatedStyle(() => {
		return {
			marginTop: trackHeight,
			transform: [ {translateX: xPos.value } ]
		};
	});
	const Tick = () => <Circle size={`${tickDiameter}px`} bg={`${colorScheme}.600`} />;
	const ticks = [];
	for(let t = min; t <= max; t += step) {
		ticks.push(<Tick key={`${id}-tick/${t}`} />)
	}

	return (
		<ZStack style={{width: sliderWidth, height: totalHeight}}>
			<Box>
				<Box style={{height: trackHeightPad}}></Box>
				<HStack alignItems="center" justifyContent="flex-start">
					<Box style={{width: trackWidthPad}}></Box>
					<Box borderRadius="full" bg={`${colorScheme}.700`} style={{
						width: trackLength,
						height: trackHeight
					}} />
					<Box style={{width: trackWidthPad}}></Box>
				</HStack>
				<Box style={{height: trackHeightPad}}></Box>
			</Box>
			{ticked && (
				<Box>
					<Box style={{height: tickTrackHeightPad}} />
					<HStack style={{height: tickDiameter}} alignItems="center" justifyContent="center">
						<Box style={{width: tickTrackWidthPad}}></Box>
						<HStack style={{width: tickTrackLength, height: tickDiameter}} alignItems="center" justifyContent="space-between">{ticks}</HStack>
						<Box style={{width: tickTrackWidthPad}}></Box>
					</HStack>
					<Box style={{height: tickTrackHeightPad}} />
				</Box>
			)}
			<Box>
				<Box style={{height: trackHeightPad}}></Box>
				<HStack style={{height: trackHeight}} alignItems="center" justifyContent="flex-start">
					<Box style={{width: trackWidthPad}}></Box>
					<ReAnimated.View style={fillStyle}>
						<Box borderRadius="full" bg={notFilled ? `${colorScheme}.700` : `${colorScheme}.500`} style={{height: trackHeight}} />
					</ReAnimated.View>
				</HStack>
				<Box style={{height: trackHeightPad}}></Box>
			</Box>
			<Box>
				<GestureDetector gesture={gesture}>
					<ReAnimated.View style={thumbStyleAnimated}>
						<Circle style={{overflow: "visible"}} borderColor={`${colorScheme}.${pressed.value ? 200 : 400}`} borderWidth={showValue ? 0 : 5} borderRadius="full" size={`${thumbDiameter}px`} bg={`${colorScheme}.${showValue && pressed.value ? 900 : 400}`}>
							{showValue !== 0 && ((showValue > 0) || pressed.value) && (
								ValueContainer ?
									<ValueContainer>{v}</ValueContainer>
								:
									<Text fontSize={fontSize}>{v}</Text>
							)}
						</Circle>
					</ReAnimated.View>
				</GestureDetector>
			</Box>
		</ZStack>
	);
};


export default NewSlider;
