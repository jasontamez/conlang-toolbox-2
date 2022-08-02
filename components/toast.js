import { Box, Text } from "native-base";

const doToast = ({toast, msg, bg, color, placement}) => {
	toast.show({
		render: () => (
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
		duration: 2500,
		placement
	});
};

export default doToast;
