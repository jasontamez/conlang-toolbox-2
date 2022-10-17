import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Text,
	VStack,
	HStack,
	IconButton,
	Button,
	Modal,
	useBreakpointValue,
	useContrastText,
	useToast
} from 'native-base';

import ExtraChars from './ExtraCharsButton';
import {
	CloseCircleIcon,
	TrashIcon,
	SaveIcon
} from './icons';
import { TextSetting } from './inputTags';
import doToast from '../helpers/toast';

const ModalTransformEditingItem = ({
	useDirection,
	transform,
	alertOpener,
	editTransform,
	endEditingFunc,
	maybeDeleteTransform,
}) => {
	//
	//
	// 	EDITING TRANSFORM MODAL
	//
	//
	// (has to be separate to keep State updates from flickering this all the time)
	const sizes = useSelector(state => state.appState.sizes);
	const [modifiedSearch, setModifiedSearch] = useState("");
	const [modifiedReplace, setModifiedReplace] = useState("");
	const [modifiedDirection, setModifiedDirection] = useState("both");
	const [modifiedDescription, setModifiedDescription] = useState("");
	const [editingID, setEditingID] = useState("");
	const inputSize = useBreakpointValue(sizes.xs);
	const textSize = useBreakpointValue(sizes.sm);
	const headerSize = useBreakpointValue(sizes.md);
	const dispatch = useDispatch();
	const toast = useToast();
	const sRef = useRef(null);
	const rRef = useRef(null);
	const dRef = useRef(null);
	useEffect(() => {
		const { id, search, replace, direction, description } = transform;
		const dummy = { value: "" };
		setEditingID(id);
		setModifiedSearch(search || "");
		(sRef.current || dummy).value = search || "";
		setModifiedReplace(replace || "");
		(rRef.current || dummy).value = replace || "";
		setModifiedDescription(description || "");
		(dRef.current || dummy).value = description || "";
		setModifiedDirection(direction || "both");
	}, [transform]);
	const primaryContrast = useContrastText('primary.500');
	const maybeSaveEditedTransform = () => {
		const modSearch = modifiedSearch.trim();
		if(!modSearch) {
			// If we have errors, abort with an alert
			alertOpener();
			return;
		}
		let editedTransform = {
			id: editingID,
			search: modSearch,
			replace: modifiedReplace.trim()
		};
		const modDesc = modifiedDescription.trim();
		if(useDirection) {
			editedTransform.direction = modifiedDirection;
		}
		if (modDesc) {
			editedTransform.description = modDesc;
		}
		dispatch(editTransform(editedTransform));
		doToast({
			toast,
			placement: "top",
			msg: "Transform edited!"
		});
		endEditingFunc();
	};
	return (
		<Modal isOpen={!!transform}>
			<Modal.Content>
				<Modal.Header bg="primary.500">
					<HStack justifyContent="flex-end" alignItems="center">
						<Text flex={1} px={3} fontSize={headerSize} color={primaryContrast} textAlign="left" isTruncated>Edit Transformation</Text>
						<ExtraChars size={headerSize} color={primaryContrast} buttonProps={{flexGrow: 0, flexShrink: 0}} />
						<IconButton
							icon={<CloseCircleIcon color={primaryContrast} size={headerSize} />}
							onPress={() => endEditingFunc()}
							flexGrow={0}
							flexShrink={0}
						/>
					</HStack>
				</Modal.Header>
				<Modal.Body>
					<VStack>
						<TextSetting
							text="Search Expression"
							placeholder="(what to replace)"
							inputProps={{ mt: 1, ref: sRef, fontSize: inputSize }}
							labelProps={{ fontSize: textSize }}
							boxProps={{ pb: 2 }}
							value={modifiedSearch}
							onChangeText={(v) => setModifiedSearch(v)}
						/>
						<TextSetting
							text="Replacement Expression"
							placeholder="(what to replace with)"
							boxProps={{ py: 2 }}
							inputProps={{ mt: 1, ref: rRef, fontSize: inputSize }}
							labelProps={{ fontSize: textSize }}
							value={modifiedReplace}
							onChangeText={(v) => setModifiedReplace(v)}
						/>
						<TextSetting
							text="Transformation Description"
							placeholder="(optional)"
							inputProps={{ mt: 1, ref: dRef, fontSize: inputSize }}
							boxProps={{ pb: 2 }}
							labelProps={{ fontSize: textSize }}
							value={modifiedDescription}
							onChangeText={(v) => setModifiedDescription(v)}
						/>
						<Text>TO-DO: Direction Menu thingie</Text>
					</VStack>
				</Modal.Body>
				<Modal.Footer>
					<HStack justifyContent="space-between" p={1} flexWrap="wrap">
						<Button
							startIcon={<TrashIcon color="danger.50" size={textSize} />}
							bg="danger.500"
							px={2}
							py={1}
							mx={1}
							onPress={() => maybeDeleteTransform(transform)}
							_text={{ fontSize: textSize }}
						>Delete</Button>
						<Button
							startIcon={<SaveIcon size={textSize} />}
							px={2}
							py={1}
							onPress={() => maybeSaveEditedTransform(true)}
							_text={{ fontSize: textSize }}
						>Save</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};

export default ModalTransformEditingItem;
