import { Box, Center, Text } from "native-base";

const doToast = ({
	toast,
	msg,
	override,
	bg,
	color,
	scheme,
	placement,
	duration,
	boxProps,
	center,
	fontSize
}) => {
	if(duration === undefined) {
		duration = 2500;
	}
	if(scheme) {
		bg = scheme + ".500";
		color = scheme + ".50";
	}
	const Wrap = (props) => ( center ? <Center w="full" {...props} /> : <Box w="full" {...props} /> );
	toast.show({
		render: () => override || (
			<Wrap>
				<Box
					bg={bg || "success.500"}
					borderRadius="sm"
					px={2}
					py={1}
					{...(boxProps || {})}
				>
					<Text fontSize={fontSize} color={color || "success.50"} textAlign={center ? "center" : undefined}>
						{msg}
					</Text>
				</Box>
			</Wrap>
		),
		duration,
		placement
	});
};

export default doToast;
