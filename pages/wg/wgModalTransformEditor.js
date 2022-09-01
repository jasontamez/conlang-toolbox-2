import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
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

import ExtraChars from '../../components/ExtraCharsButton';
import {
	CloseCircleIcon,
	TrashIcon,
	SaveIcon
} from '../../components/icons';
import { sizes } from '../../store/appStateSlice';
import { editTransform } from '../../store/wgSlice';
import { TextSetting } from '../../components/layoutTags';
import doToast from '../../components/toast';

const ModalTransformEditingItem = ({
	transform,
	alertOpener,
	endEditingFunc,
	maybeDeleteTransform,
	iconSize
}) => {
	//
	//
	// 	EDITING TRANSFORM MODAL
	//
	//
	// (has to be separate to keep State updates from flickering this all the time)
	const [modifiedSearch, setModifiedSearch] = useState("");
	const [modifiedReplace, setModifiedReplace] = useState("");
	const [modifiedDescription, setModifiedDescription] = useState("");
	const [editingID, setEditingID] = useState("");
	const textSize = useBreakpointValue(sizes.sm);
	const headerSize = useBreakpointValue(sizes.md);
	const dispatch = useDispatch();
	const toast = useToast();
	const sRef = useRef(null);
	const rRef = useRef(null);
	const dRef = useRef(null);
	useEffect(() => {
		const { id, search, replace, description } = transform;
		const dummy = { value: "" };
		setEditingID(id);
		setModifiedSearch(search || "");
		(sRef.current || dummy).value = search || "";
		setModifiedReplace(replace || "");
		(rRef.current || dummy).value = replace || "";
		setModifiedDescription(description || "");
		(dRef.current || dummy).value = description || "";
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
			replace: modifiedReplace.trim(),
		};
		const modDesc = modifiedDescription.trim();
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
						<Text flex={1} px={3} fontSize={headerSize} color={primaryContrast} justifySelf="flex-start" isTruncated>Edit Transformation</Text>
						<ExtraChars color={primaryContrast} buttonProps={{size: textSize}} />
						<IconButton
							icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
							onPress={() => endEditingFunc()}
						/>
					</HStack>
				</Modal.Header>
				<Modal.Body>
					<VStack>
						<TextSetting
							text="Search Expression"
							placeholder="(what to replace)"
							inputProps={{ mt: 1, ref: sRef }}
							boxProps={{ pb: 2 }}
							value={modifiedSearch}
							onChangeText={(v) => setModifiedSearch(v)}
						/>
						<TextSetting
							text="Replacement Expression"
							placeholder="(what to replace with)"
							boxProps={{ py: 2 }}
							inputProps={{ mt: 1, ref: rRef }}
							value={modifiedReplace}
							onChangeText={(v) => setModifiedReplace(v)}
						/>
						<TextSetting
							text="Transformation Description"
							placeholder="(optional)"
							inputProps={{ mt: 1, ref: dRef }}
							boxProps={{ pb: 2 }}
							value={modifiedDescription}
							onChangeText={(v) => setModifiedDescription(v)}
						/>
					</VStack>
				</Modal.Body>
				<Modal.Footer>
					<HStack justifyContent="space-between" p={1}>
						<Button
							startIcon={<TrashIcon size={iconSize} color="danger.50" />}
							bg="danger.500"
							px={2}
							py={1}
							mx={1}
							onPress={() => maybeDeleteTransform()}
						>DELETE</Button>
						<Button
							startIcon={<SaveIcon size={iconSize} />}
							px={2}
							py={1}
							onPress={() => maybeSaveEditedTransform(true)}
						>SAVE</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};

export default ModalTransformEditingItem;
