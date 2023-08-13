import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	Text,
	VStack,
	HStack,
	Modal,
	useToast
} from 'native-base';

import {
	CloseCircleIcon,
	TrashIcon,
	SaveIcon
} from './icons';
import Button from './Button';
import IconButton from './IconButton';
import { DropDown, TextSetting } from './inputTags';
import doToast from '../helpers/toast';
import getSizes from '../helpers/getSizes';

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
	const [modifiedSearch, setModifiedSearch] = useState("");
	const [modifiedReplace, setModifiedReplace] = useState("");
	const [modifiedDirection, setModifiedDirection] = useState("both");
	const [modifiedDescription, setModifiedDescription] = useState("");
	const [editingID, setEditingID] = useState("");
	const [inputSize, textSize, headerSize] = getSizes("xs", "sm", "md")
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
	const directionTexts = {
		both: "at input, then undo at output",
		input: "at input only",
		output: "at output only",
		double: "at input, then again at output"
	};
	const MaybeDirection = () => {
		if(!useDirection) {
			return <></>;
		}
		return (
			<HStack
				space={1}
				flexWrap="wrap"
				alignItems="center"
				justifyContent="flex-start"
			>
				<Text fontSize={textSize}>Transform:</Text>
				<DropDown
					placement="top right"
					bg="lighter"
					color="text.50"
					pressedBg="darker"
					fontSize={textSize}
					labelFunc={() => directionTexts[modifiedDirection]}
					onChange={(v) => setModifiedDirection(v)}
					defaultValue={modifiedDirection}
					title="When Used?"
					options={Object.keys(directionTexts).map(opt => {
						return {
							key: `${opt}-DirectionChoice`,
							value: opt,
							label: directionTexts[opt]
						};
					})}
					buttonProps={{
						flex: 1,
						px: 2,
						_stack: {
							justifyContent: "flex-start",
							alignItems: "center",
							flex: 1,
							space: 0,
							style: {
								overflow: "hidden"
							}
						}
					}}
				/>
			</HStack>
		);
	};
	return (
		<Modal isOpen={!!transform}>
			<Modal.Content>
				<Modal.Header bg="primary.500">
					<HStack justifyContent="flex-end" alignItems="center">
						<Text flex={1} px={3} fontSize={headerSize} color="primary.50" textAlign="left" isTruncated>Edit Transformation</Text>
						<IconButton
							icon={<CloseCircleIcon size={headerSize} />}
							onPress={() => endEditingFunc()}
							flexGrow={0}
							flexShrink={0}
							scheme="primary"
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
						<MaybeDirection />
					</VStack>
				</Modal.Body>
				<Modal.Footer>
					<HStack justifyContent="space-between" p={1} flexWrap="wrap">
						<Button
							startIcon={<TrashIcon size={textSize} />}
							scheme="danger"
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
