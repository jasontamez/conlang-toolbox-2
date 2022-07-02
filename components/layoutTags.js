import { Box, HStack, Input, ScrollView, Text, TextArea } from "native-base";

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
