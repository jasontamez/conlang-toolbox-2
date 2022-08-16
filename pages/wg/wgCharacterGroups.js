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
	Modal
} from "native-base";
import { useDispatch, useSelector } from "react-redux";

import { AddIcon } from "../../components/icons";
import StandardAlert from "../../components/StandardAlert";
import { sizes } from "../../store/appStateSlice";
import { deleteCharacterGroup } from "../../store/wgSlice";


const WGChar = () => {
	const { characterGroups, characterGroupDropoff } = useSelector(state => state.wg);
	const { disableConfirms } = useSelector(state => state.appSettings);
	const dispatch = useDispatch();
	const [alertOpen, setAlertOpen] = useState(false);
	const [deletingGroup, setDeletingGroup] = useState(false);
	const [editingGroup, setEditingGroup] = useState(false);
	const [addGroupOpen, setAddGroupOpen] = useState(false);
	// add group
	// edit group
	// delete group

	// dropoff rate explanation
	// range slider
	// X=chars   [del] [edit]
	// label
	const maybeDeleteGroup = (group) => {
		if(disableConfirms) {
			return doDeleteGroup(group);
		}
		setDeletingGroup(group);
	};
	const doDeleteGroup = (group = deletingGroup) => {
		dispatch(deleteCharacterGroup(group));
		// TO-DO: toast confirm?
	};
	const textSize = useBreakpointValue(sizes.sm);
	const descSize = useBreakpointValue(sizes.xs);
	const renderGroup = (group) => {
		const {label, run, description} = group;
		return (
			<HStack
				justifyContent="flex-end"
				alignItems="center"
				borderBottomWidth={0.5}
				borderColor="main.700"
				py={2.5}
				px={2}
				key={label}
			>
				<VStack
					alignItems="flex-start"
					justifyContent="center"
					justifySelf="flex-start"
				>
					<Text fontSize={textSize} isTruncated><Text bold>{label}</Text>={run}</Text>
					{description ? <Text italic fontSize={descSize} noOfLines={3}>{description}</Text> : <></>}
				</VStack>
				<IconButton
					icon={<EditIcon size={descSize} color="primary.400" />}
					accessibilityLabel="Edit"
					bg="transparent"
					p={1}
					m={0.5}
					onPress={() => setEditingGroup(group)}
				/>
				<IconButton
					icon={<TrashIcon size={descSize} color="danger.400" />}
					accessibilityLabel="Delete"
					bg="transparent"
					p={1}
					m={0.5}
					onPress={() => maybeDeleteGroup(group)}
				/>
			</HStack>
		);
	};
	return (
		<VStack>
			<StandardAlert
				alertOpen={alertOpen}
				setAlertOpen={setAlertOpen}
				bodyContent={<Text fontSize={textSize}>Are you sure you want to delete the character group <Text bold>{deletingGroup.label}</Text>? This cannot be undone.</Text>}
				continueText="Yes, Delete It"
				continueProps={{
					bg: "danger.500",
					_text: {
						color: "danger.50"
					}
				}}
				continueFunc={() => doDeleteGroup(group)}
			/>
			<Modal
				isOpen={editingGroup}
			>
				<Modal.Content>
					<Modal.Header></Modal.Header>
					<Modal.Body></Modal.Body>
					<Modal.Footer></Modal.Footer>
				</Modal.Content>
			</Modal>
			<Modal
				isOpen={addGroupOpen}
			>
				<Modal.Content>
					<Modal.Header></Modal.Header>
					<Modal.Body></Modal.Body>
					<Modal.Footer></Modal.Footer>
				</Modal.Content>
			</Modal>
			<Fab
				bg="secondary.500"
				renderInPortal={false}
				icon={<AddIcon size={textSize} color="secondary.50" />}
				accessibilityLabel="Add Group"
				onPress={() => setAddGroupOpen(true)}
			/>
			<ScrollView bg="main.900">
				{characterGroups.map(group => renderGroup(group))}
			</ScrollView>
		</VStack>
	);
};

export default WGChar;
