import { Box, Center, Text } from "native-base";

const doToast = ({
	toast,         // From useToast
	placement,     // Where the toast is placed
	duration,      // How long it appears, defaults to 2500ms

	override,      // Element; optional: completely overrides the toast content and everything else below

	msg,           // Text of toast
	fontSize,      // Size of the toast text
	color,         // Text color; default success.50
	textProps = {},// Extra properties for the text; can override 'color' and 'fontSize'

	bg,            // Background color; default success.500
	boxProps = {}, // Properties of the inner <Box> that holds the text; can override 'bg'

	scheme,        // Color scheme (overrides bg and color with 'scheme'.500 and 'scheme'.50)

	center,        // If true, wraps <Box> in <Center> and centers text; otherwise, <Box> is wrapped in another <Box>
	wrapProps = {} // Properties for the <Center> or outer <Box>; this defaults to a fullscreen width
}) => {
	if(duration === undefined) {
		duration = 2500;
	}
	if(scheme) {
		bg = scheme + ".500";
		color = scheme + ".50";
	}
	const Wrap = (props) => ( center ? <Center {...props} /> : <Box {...props} /> );
	toast.show({
		render: () => override || (
			<Wrap w="full" {...wrapProps}>
				<Box
					bg={bg || "success.500"}
					borderRadius="sm"
					px={2}
					py={1}
					{...(boxProps || {})}
				>
					<Text fontSize={fontSize} color={color || "success.50"} textAlign={center ? "center" : undefined} {...textProps}>
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
