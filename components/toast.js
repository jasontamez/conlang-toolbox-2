import { Box, Text } from "native-base";

const doToast = ({toast, msg, override, bg, color, scheme, placement, duration}) => {
	if(duration === undefined) {
		duration = 2500;
	}
	if(scheme) {
		bg = scheme + ".500";
		color = scheme + ".50";
	}
	toast.show({
		render: () => override || (
			<Box
				bg={bg || "success.500"}
				borderRadius="sm"
				px={2}
				py={1}
			>
				<Text color={color || "success.50"}>
					{msg}
				</Text>
			</Box>
		),
		duration,
		placement
	});
};

export default doToast;
