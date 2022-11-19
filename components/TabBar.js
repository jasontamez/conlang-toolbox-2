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
	const barHeight = rawHeight; // remove width of border?
	return (
		<Box
			w="full"
			bg="main.800"
			alignItems="center"
			borderColor="main.700"
			borderTopWidth={1}
			style={{
				height: barHeight
			}}
			{...boxProps}
		>
			<HStack
				w="full"
				justifyContent="space-evenly"
				alignItems="center"
				{...props}
				style={{maxHeight: barHeight}}
			/>
		</Box>
	);
};

export default TabBar;
