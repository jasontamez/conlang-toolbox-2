import { Box, Text } from "native-base";

const doToast = (toast, msg, bg="success.500", color="success.50") => {
	toast.show({
		render: () => <Box bg={bg} borderRadius="sm" px={2} py={1}><Text color={color}>{msg}</Text></Box>,
		duration: 2500
	});
};

export default doToast;
