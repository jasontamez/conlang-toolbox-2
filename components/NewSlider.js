import React, { useState } from 'react';
import {
	Box,
	HStack,
	ZStack,
	useTheme,
	Text,
	Circle,
	useContrastText
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

	// total height:
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

	const colors = useTheme().colors[colorScheme];
	const thumbColor = colors["400"];
	const trackColor = colors["700"];
	const filledColor = colors["500"];
	const tickColor = colors["600"];
	const textColor = useContrastText(thumbColor);

	const starting = useSharedValue((value - min) * stepLength);
	const actualValue = useSharedValue(value);
	const xPos = useSharedValue(starting.value);
	const pressed = useSharedValue(false);
	const [v, setV] = useState(actualValue.value);
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
	const Tick = () => <Circle size={`${tickDiameter}px`} bg={tickColor} />;
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
						<Box borderRadius="full" style={{
							width: trackLength,
							height: trackHeight,
							backgroundColor: trackColor
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
							<Box borderRadius="full" bg={notFilled ? trackColor : filledColor} style={{height: trackHeight}} />
						</ReAnimated.View>
					</HStack>
					<Box style={{height: trackHeightPad}}></Box>
				</Box>
				<Box>
					<GestureDetector gesture={gesture}>
						<ReAnimated.View style={thumbStyleAnimated}>
							<Circle style={{overflow: "visible"}} size={`${thumbDiameter}px`} bg={thumbColor}>
								{showValue !== 0 && ((showValue > 0) || pressed.value) && (
									ValueContainer ?
										<ValueContainer>{v}</ValueContainer>
									:
										<Text color={textColor} fontSize={fontSize}>{v}</Text>
								)}
							</Circle>
						</ReAnimated.View>
					</GestureDetector>
				</Box>
			</ZStack>
	);
};


export default NewSlider;
