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
	showValue,
	colorScheme = "secondary",
	id
}) => {
	const tickRadius = fontSizesInPx[fontSize] / 2;
	const trackHeight = tickRadius / 2;
	const thumbRadius = tickRadius * 4;
	const trackLength = sliderWidth - thumbRadius;
	const trackPad = thumbRadius / 2;
	const tickTrackLength = trackLength + tickRadius;
	const tickTrackPad = (thumbRadius / 2) - (tickRadius / 2);
	const stepLength = trackLength / ((max - min) / step);

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
//	console.log("minmax", min, max, "step", step, "value", actualValue.value);
//	console.log("track", trackLength, "step", stepLength, "starting", starting.value);
	const setter = (doSet = pressed.value) => {
		doSet && setV(actualValue.value);
	};

	const gesture = Gesture.Pan()
		.onBegin(() => {
			pressed.value = true;
//			console.log("Begins");
		})
		.onUpdate((e) => {
			//const newValue = Math.floor(0.5 + (Math.max(0, Math.min(max - 20, starting.value + e.translationX))))
			//xPos.value = newValue;
			//newValue && (newValue % 5 ) || console.log(starting.value, max, newValue)
			'worklet'
			const input = e.translationX;
			const rawX = Math.min(
				trackLength,
				Math.max(0, starting.value + input)
			);
			const rawValue = rawX / stepLength;
			const trueValue = Math.floor(rawValue + 0.5);
			const newValue = Math.floor((trueValue * stepLength) + 0.5);
			//console.log("input", input, "raw X", rawX, "raw value", rawValue);
			//console.log("true value", trueValue, "new value", newValue);
			actualValue.value = trueValue + min;
			runOnJS(setter)();
		//	setV(trueValue);
			xPos.value = newValue;
		})
		.onEnd(() => {
			starting.value = xPos.value;
//			console.log("saved val", xPos.value)
		})
		.onFinalize(() => {
			pressed.value = false;
			runOnJS(setter)(true);
//			console.log("Ended");
			runOnJS(onChange)(actualValue.value);
		});

	const containerStyle = {
		width: sliderWidth,
		height: thumbRadius * 1.5
	};
	const Ticked = () => {
		const pad = (tickRadius / 2)
		const Tick = () => <Circle size={`${tickRadius}px`} bg={tickColor} />;
		const ticks = [];
		for(let t = min; t <= max; t += step) {
			ticks.push(<Tick key={`${id}-tick/${t}`} />)
		}
		return (
			<Box><HStack style={containerStyle} alignItems="center" justifyContent="center">
				<Box style={{width: tickTrackPad}}></Box>
				<HStack style={{width: tickTrackLength}} alignItems="center" justifyContent="space-between">{ticks}</HStack>
				<Box style={{width: tickTrackPad}}></Box>
			</HStack></Box>
		);
	};
	const fillStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: notFilled ? trackColor : filledColor,
			height: trackHeight,
			width: xPos.value,
			borderRadius: 9999
		};
	});
	const thumbStyleAnimated = useAnimatedStyle(() => {
		return {
			transform: [ {translateX: xPos.value }, {translateY: thumbRadius / 4}]
		};
	});
	//console.log("container style", containerStyle);
	//console.log("ticky", ticky);

	return (
			<ZStack style={containerStyle}>
				<Box><HStack style={containerStyle} alignItems="center" justifyContent="flex-start">
					<Box style={{width: trackPad}}></Box>
					<Box borderRadius="full" style={{
						width: trackLength,
						height: trackHeight,
						backgroundColor: trackColor
					}} />
					<Box style={{width: trackPad}}></Box>
				</HStack></Box>
				{ticked && <Ticked />}
				<Box><HStack style={containerStyle} alignItems="center" justifyContent="flex-start">
					<Box style={{width: trackPad}}></Box>
					<ReAnimated.View style={fillStyle} />
				</HStack></Box>
				<Box><GestureDetector gesture={gesture}>
					<ReAnimated.View style={thumbStyleAnimated}>
						<Circle size={`${thumbRadius}px`} bg={thumbColor}>
							{showValue && <Text color={textColor} fontSize={fontSize}>{v}</Text>}
						</Circle>
					</ReAnimated.View>
				</GestureDetector></Box>
			</ZStack>
	);
};


export default NewSlider;
