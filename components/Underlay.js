import { HStack } from "native-base";
import { useSwipeableItemParams } from "react-native-swipeable-item";
import { EditIcon, TrashIcon } from "./icons";
import Button from "./Button";

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
				endIcon: <TrashIcon size={fontSize} />,
				bg: "danger.900",
				color: "danger.400",
				scheme: "danger"
			},
			justifyContent: "flex-end",
			text: "Delete"
		}
	} else {
		props = {
			...props,
			buttonProps: {
				startIcon: <EditIcon size={fontSize} />,
				bg: "main.900",
				color: "primary.400",
				scheme: "primary"
			},
			justifyContent: "flex-start",
			text: "Edit"
		}
	}
	return <UnderlayBase {...props} />;
};
const UnderlayBase = ({fontSize, onPress, leaveOpen, buttonProps, justifyContent, text}) => {
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
					bold: true
				}}
				{...buttonProps}
			>{text}</Button>
		</HStack>
	);
};

export default Underlay;
