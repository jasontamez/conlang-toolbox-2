import { Button, HStack } from "native-base";
import { useSwipeableItemParams } from "react-native-swipeable-item";
import { EditIcon, TrashIcon } from "./icons";


const Underlay = ({left, fontSize, onPress, leaveOpen = false}) => {
	let props = {
		fontSize,
		onPress,
		leaveOpen
	};
	if(left) {
		props = {
			...props,
			buttonProps: {
				endIcon: <TrashIcon color="danger.400" size={fontSize} />,
				bg: "danger.900"
			},
			justifyContent: "flex-end",
			color: "danger.400",
			text: "Delete"
		}
	} else {
		props = {
			...props,
			buttonProps: {
				startIcon: <EditIcon color="primary.400" size={fontSize} />,
				bg: "main.900"
			},
			justifyContent: "flex-start",
			color: "primary.400",
			text: "Edit"
		}
	}
	return <UnderlayBase {...props} />;
};
const UnderlayBase = ({fontSize, onPress, leaveOpen, buttonProps, justifyContent, color, text}) => {
	const { close } = useSwipeableItemParams();
	return (
		<HStack alignItems="center" justifyContent={justifyContent} px={2.5} h="full" bg="lighter">
			<Button
				py={1}
				px={2}
				flexShrink={0}
				flexGrow={0}
				onPress={() => {
					onPress();
					leaveOpen || close();
				}}
				_stack={{
					alignItems: "center",
					justifyContent
				}}
				_text={{
					fontSize,
					color,
					bold: true
				}}
				{...buttonProps}
			>{text}</Button>
		</HStack>
	);
};

export default Underlay;
