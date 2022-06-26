import { HStack, ScrollView } from "native-base";

export const NavBar = (props) => {
	return (
		<ScrollView horizontal w="full">
			<HStack space="2" justifyContent={"space-between"} {...props} />
		</ScrollView>
	);
	//return (
	//	<ScrollView horizontal>
	//		{props.children}
	//	</ScrollView>
	//);
};
