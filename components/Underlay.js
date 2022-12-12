import { Button, HStack } from "native-base";
import { useSwipeableItemParams } from "react-native-swipeable-item";
import { EditIcon, TrashIcon } from "./icons";


const Underlay = ({left, fontSize, onPress}) => {
	return left ?
		<UnderlayLeft fontSize={fontSize} onPress={onPress} />
	:
		<UnderlayRight fontSize={fontSize} onPress={onPress} />
	;
};
const UnderlayRight = ({fontSize, onPress}) => {
	const { close } = useSwipeableItemParams();
	return (
		<HStack alignItems="center" justifyContent="flex-start" px={2.5} h="full" bg="lighter">
			<Button
				startIcon={<EditIcon color="primary.400" size={fontSize} />}
				py={1}
				px={2}
				flexShrink={0}
				flexGrow={0}
				onPress={() => {
					onPress();
					close();
				}}
				bg="main.900"
				_stack={{
					alignItems: "center",
					justifyContent: "flex-start"
				}}
				_text={{
					fontSize,
					color: "primary.400",
					bold: true
				}}
			>Edit</Button>
		</HStack>
	);
};
const UnderlayLeft = ({fontSize, onPress}) => {
	return (
		<HStack alignItems="center" justifyContent="flex-end" px={2.5} h="full" bg="lighter">
			<Button
				endIcon={<TrashIcon color="danger.400" size={fontSize} />}
				py={1}
				px={2}
				onPress={onPress}
				bg="danger.900"
				_stack={{
					alignItems: "center",
					justifyContent: "flex-end"
				}}
				_text={{
					fontSize,
					color: "danger.400",
					bold: true
				}}
			>Delete</Button>
		</HStack>
	);
};

export default Underlay;
