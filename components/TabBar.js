import {
	Box,
	HStack,
 } from "native-base";

const TabBar = ({
	boxProps = {},
	rawHeight = 20,
	...props
}) => {
	// <TabBar
	//    rawHeight={height of the outer Box}
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
			alignItems="center"
			flex={1}
			borderColor="main.700"
			borderTopWidth={1}
			style={{
				height: rawHeight
			}}
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
