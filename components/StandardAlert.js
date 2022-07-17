import { useRef } from "react";
import { AlertDialog, Button } from "native-base";

const StandardAlert = ({
	alertOpen, setAlertOpen,
	alertProps, contentProps,
	headerProps, headerContent,
	bodyProps, bodyContent,
	footerProps,
	cancelProps, cancelText, cancelFunc,
	continueProps, continueText, continueFunc
}) => {
	// Makes an AlertDialog box
	//
	// alertOpen: boolean indicating when the AlertDialog is shown
	// setAlertOpen: a function fired with (false) when Cancel OR
	//    Continue button is pressed
	// alertProps: object of properties for AlertDialog
	// contentProps: object of properties for AlertDialog.Content
	// headerProps: object of properties for AlertDialog.Header
	// headerContent: string text or JSX for AlertDialog.Header
	// bodyProps: object of properties for AlertDialog.Body
	// bodyContent: string text or JSX for AlertDialog.Body
	// footerProps: object of properties for AlertDialog.Footer
	// cancelProps: object of properties for the Cancel button
	// cancelText: string text of the Cancel button
	// cancelFunc: function fired (no args) when Cancel is pressed
	// continueProps: same as cancelProps, but for Continue button
	// continueText: same as above
	// continueFunc: same as above
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
					<Button.Group isAttached>
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
							bg="success.500"
							_text={{color: "success.50"}}
							{...(continueProps || {})}
							onPress={() => doContinue()}
						>
							{continueText || "Continue"}
						</Button>
					</Button.Group>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog>
	);
};

export default StandardAlert;

export const MultiAlert = (props) => {
	// Makes multiple StandardAlerts
	//
	// alertOpen = state variable
	// setAlertOpen = state setter
	// sharedProps = object of properties to be added to each StandardAlert
	// passedProps = Array of objects, each object being:
	//    {id: string, properties: object}
	//
	// Makes one StandardAlert for every object in passedProps.
	//   Each StandardAlert opens when alertOpen === id.
	//
	// NOTE:
	//   sharedProps can override alertOpen and setAlertOpen
	//   passedProps can override sharedProps, alertOpen, and setAlertOpen
	const {alertOpen, setAlertOpen, sharedProps, passedProps} = props;
	return passedProps.map(({id, properties}) => {
		return <StandardAlert key={id + "-MultiAlert"} alertOpen={alertOpen === id} setAlertOpen={setAlertOpen} {...sharedProps} {...properties} />;
	});
};

