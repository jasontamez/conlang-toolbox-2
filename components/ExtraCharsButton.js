import { IconButton } from "native-base";
import { ExtraCharactersIcon } from "./icons";
import { useState } from 'react';

const ExtraChars = ({
	iconProps = {},
	buttonProps = {},
	color = "text.50",
	size
}) => {
	const [openModal, setOpenModal] = useState(false);
	return (
		<IconButton
			variant="ghost"
			icon={<ExtraCharactersIcon color={color} size={size} {...iconProps} />}
			onPress={() => setOpenModal(true)}
			{...buttonProps}
		/>
	);
};
// Need to add a modal to this, pass it the State vars

export default ExtraChars;