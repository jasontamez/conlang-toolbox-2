import {
	Box,
	HStack,
 } from "native-base";

const TabBar = ({
	boxProps = {},
	...props
}) => {
	// <TabBar
	//    boxProps={properties for outer Box}
	//    {other props go to inner HStack} />
	return (
		<Box
			w="full"
			position="absolute"
			left={0}
			bottom={0}
			right={0}
			bg="main.800"
			{...boxProps}
		>
			<HStack
				w="full"
				justifyContent="space-evenly"
				alignItems="center"
				{...props}
			/>
		</Box>
	);
};

export default TabBar;
