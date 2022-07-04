import { Box, HStack, ZStack, Slider, Input, ScrollView, Text, TextArea } from "native-base";
import { Bar } from "./icons";

export const NavBar = (props) => {
	const boxProps = props.boxProps || {};
	return (
		<Box w="full" {...boxProps}>
			<ScrollView horizontal w="full">
				<HStack w="full" space={4} justifyContent="space-between" {...props} />
			</ScrollView>
		</Box>
	);
	//return (
	//	<ScrollView horizontal>
	//		{props.children}
	//	</ScrollView>
	//);
};

export const TextAreaSetting = (props) => {
	// <TextAreaSetting value="" placeholder="" rows={3} onChange={} onChangeEnd={}>Text Label</TextAreaSetting>
	const boxProps = props.boxProps || {};
	const labelProps = props.labelProps || {};
	const inputProps = props.inputProps || {};
	return (
		<Box w="full" {...boxProps}>
			<Text {...labelProps}>{props.children}</Text>
			<TextArea mt={2}
				defaultValue={props.value}
				placeholder={props.placeholder}
				totalLines={props.rows || 3}
				onChange={props.onChange}
				onChangeEnd={props.onChangeEnd}
				{...inputProps}
			/>
		</Box>
	);
};

export const TextSetting = (props) => {
	// <TextSetting value="" placeholder="" onChange={} onChangeEnd={}>Text Label</TextSetting>
	const boxProps = props.boxProps || {};
	const labelProps = props.labelProps || {};
	const inputProps = props.inputProps || {};
	return (
		<Box w="full" {...boxProps}>
			<Text {...labelProps}>{props.children}</Text>
			<Input
				defaultValue={props.value}
				placeholder={props.placeholder}
				onChange={props.onChange}
				onChangeEnd={props.onChangeEnd}
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
	const Tick = (props) => <Bar size="xs" color="secondary.400" {...tickProps} {...props} />;
	let middleTicks = [<Tick key="FirstTick" color="transparent" size="2xs" />];
	for (let c = min + 1; c < max; c++) {
		middleTicks.push(<Tick key={"Tick" + String(c)} />);
	}
	middleTicks.push(<Tick key="LastTick" color="transparent" size="2xs" />);
	return (
		<HStack d="flex" w="full" alignItems="stretch">
			<Box mr={3} flexShrink={1}><Text textAlign="center" fontSize="sm">{beginLabel}</Text></Box>
			<ZStack alignItems="center" justifyContent="center" flexGrow={1} flexShrink={2} flexBasis="75%" {...stackProps}>
				<HStack alignItems="center" justifyContent="space-between" w="full" children={middleTicks}>
				</HStack>
				<Slider size="sm" minValue={min} maxValue={max} step={1} {...sliderProps}>
					<Slider.Track>
						{props.spectrum ? <Slider.FilledTrack /> : <></>}
					</Slider.Track>
					<Slider.Thumb />
				</Slider>
			</ZStack>
			<Box ml={3} flexShrink={1}><Text textAlign="center" fontSize="sm">{endLabel}</Text></Box>
		</HStack>
	);
};
