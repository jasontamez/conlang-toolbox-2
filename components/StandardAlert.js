import { useRef } from "react";
import { AlertDialog, Button } from "native-base";

const StandardAlert = ({
	cancelProps, cancelText, cancelFunc,
	continueProps, continueText, continueFunc,
	headerProps, headerContent,
	bodyProps, bodyContent,
	footerProps,
	alertProps, contentProps,
	alertOpen, setAlertOpen
}) => {
	const cancelRef = useRef(null);
	const doCancel = () => {
		setAlertOpen(false);
		cancelFunc && cancelFunc();
	};
	const doContinue = () => {
		setAlertOpen(false);
		continueFunc && continueFunc();
	};
	return (
		<AlertDialog
			zIndex={100}
			leastDestructiveRef={cancelRef}
			isOpen={alertOpen}
			onClose={() => doCancel()}
			closeOnOverlayClick={false}
			{...(alertProps || {})}
		>
			<AlertDialog.Content {...(contentProps || {})}>
				<AlertDialog.Header
					bg="warning.500"
					_text={{color: "warning.50"}}
					borderBottomWidth={0}
					{...(headerProps || {})}
				>
					{headerContent || "Warning"}
				</AlertDialog.Header>
				<AlertDialog.Body
					_text={{color: "text.50"}}
					{...(bodyProps || {})}
				>
					{bodyContent || "Are you sure?"}
				</AlertDialog.Body>
				<AlertDialog.Footer
					borderTopWidth={0}
					{...(footerProps || {})}
				>
					<Button
						variant="unstyled"
						ref={cancelRef}
						_text={{color: "text.50"}}
						{...(cancelProps || {})}
						onPress={() => doCancel()}
					>
						{cancelText || "Cancel"}
					</Button>
					<Button
						bg="danger.500"
						_text={{color: "danger.50"}}
						{...(continueProps || {})}
						onPress={() => doContinue()}
					>
						{continueText || "Continue"}
					</Button>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog>
	);
};

export default StandardAlert;
