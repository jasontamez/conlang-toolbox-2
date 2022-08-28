import {
	useBreakpointValue,
	Text,
	HStack,
	Box,
	Switch,
	ScrollView,
	VStack,
	IconButton,
	Fab,
	Modal,
	useContrastText,
	Button,
	Center,
	Input,
	useToast,
	Factory
} from "native-base";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReAnimated, {
	CurvedTransition,
	FadeInUp,
	FadeOutUp
} from 'react-native-reanimated';
import DFL from "react-native-draggable-flatlist";

import {
	AddIcon,
	ChevronLeftIcon,
	CloseCircleIcon,
	DragHandleIcon,
	EditIcon,
	EquiprobableIcon,
	SaveIcon,
	SharpDropoffIcon,
	TrashIcon
} from "../../components/icons";
import { SliderWithLabels, TextSetting } from "../../components/layoutTags";
import StandardAlert from "../../components/StandardAlert";
import { sizes } from "../../store/appStateSlice";
import {
	addCharacterGroup,
	deleteCharacterGroup,
	editCharacterGroup,
	setCharacterGroupDropoff,
	equalityCheck
} from "../../store/wgSlice";
import ExtraChars from "../../components/ExtraCharsButton";
import doToast from "../../components/toast";

const DraggableFlatList = Factory(DFL);

const WGRew = () => {
	const { transforms } = useSelector(state => state.wg, equalityCheck);
	const disableConfirms = useSelector(state => state.appState.disableConfirms);
	const dispatch = useDispatch();
	const [reordering, setReordering] = useState([]);
	const textSize = useBreakpointValue(sizes.sm);
	const descSize = useBreakpointValue(sizes.xs);
	const remap = data => data.map(d => { return {...d} });
	const startEditTransform = () => {};
	const maybeDeleteTransform = () => {};
	const Unit = (props) => <Box borderColor="text.50" borderWidth={2} py={1} px={2}><Text fontSize={textSize} fontFamily="serif" bold {...props} /></Box>;
	const Arrow = (props) => <Text fontSize={textSize} {...props}>⟶</Text>;
	const Item = ({item, stackProps}) => {
		const { search, replace, description } = item;
		return (
			<VStack
				alignItems="flex-start"
				justifyContent="center"
				{...(stackProps || {})}
			>
				<HStack
					alignItems="center"
					justifyContent="flex-start"
					overflow="hidden"
					space={2}
				>
					<Unit>{search}</Unit>
					<Arrow />
					<Unit>{replace}</Unit>
				</HStack>
				<Text italic fontSize={descSize}>{description}</Text>
			</VStack>
		);
	};
	const renderItem = ({item, drag, isActive}) => {
		return (
			<Pressable onPressIn={drag}>
				<HStack
					alignItems="center"
					justifyContent="flex-start"
					p={1}
					bg={isActive ? "main.700" : "main.800"}
					h={12}
					overflow="hidden"
				>
					<DragHandleIcon pr={4} />
					<Item item={item} />
				</HStack>
			</Pressable>
		);
	};
	return (
		<VStack h="full">
			<Fab
				bg="tertiary.500"
				renderInPortal={false}
				icon={<AddIcon size={textSize} color="tertiary.50" />}
				accessibilityLabel="Add Group"
				onPress={() => setReordering(remap(transforms))}
			/>
			{
				reordering.length > 0 ?
					<DraggableFlatList
						data={reordering}
						renderItem={renderItem}
						keyExtractor={(item) => item.id + "-Reordering"}
						onDragEnd={(data) => setReordering(remap(data.data))}
						bg="main.900"
					/>
				:
					<ScrollView bg="main.900">
						{transforms.map(item => (
							<HStack
								key={item.id}
								alignItems="center"
								justifyContent="flex-start"
								borderBottomWidth={0.5}
								borderColor="main.700"
								py={2.5}
								px={2}
								bg="main.800"
								w="full"
							>
								<Item
									item={item}
									stackProps={{
										flexGrow: 1,
										flexShrink: 1,
										overflow: "hidden"
									}}
								/>
								<IconButton
									icon={<EditIcon size={textSize} color="primary.400" />}
									accessibilityLabel="Edit"
									bg="transparent"
									p={1}
									m={0.5}
									flex={0}
									onPress={() => startEditTransform(group)}
								/>
								<IconButton
									icon={<TrashIcon size={textSize} color="danger.400" />}
									accessibilityLabel="Delete"
									bg="transparent"
									p={1}
									m={0.5}
									flex={0}
									onPress={() => maybeDeleteTransform(group)}
								/>
							</HStack>
						))}
					</ScrollView>	
			}
		</VStack>
	);
};

export default WGRew;
