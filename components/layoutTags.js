import { Box, HStack, ScrollView } from "native-base";

export const NavBar = (props) => {
	const outerProps = props.outerProps || {};
	return (
		<Box w="full" {...outerProps}>
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
