import { useRef } from "react";
import { AlertDialog, Button, useContrastText } from "native-base";

const StandardAlert = ({
	alertOpen, setAlertOpen,
	alertProps, contentProps,
	headerProps, headerContent,
	bodyProps, bodyContent,
	footerProps,
	cancelProps, cancelText, cancelFunc,
	continueProps, continueText, continueFunc,
	leastDestructiveContinue,
	overrideButtons,
	detatchButtons,
	fontSize
}) => {
	// Makes an AlertDialog box
	//
	// alertOpen: boolean indicating when the AlertDialog is shown
	// setAlertOpen: func fired w/(false) when Cancel/Continue button pressed
	// alertProps: object of properties for AlertDialog
	// contentProps: object of properties for AlertDialog.Content
	// headerProps: object of properties for AlertDialog.Header
	// headerContent: string text or JSX for AlertDialog.Header
	//    Defaults to "Warning"
	// bodyProps: object of properties for AlertDialog.Body
	// bodyContent: string text or JSX for AlertDialog.Body
	//    Defaults to "Are you sure?"
	// footerProps: object of properties for AlertDialog.Footer
	// cancelProps: object of properties for the Cancel button
	// cancelText: string text of the Cancel button
	//    Defaults to "Cancel"
	// cancelFunc: function fired (no args) when Cancel is pressed
	// continueProps: same as cancelProps, but for Continue button
	// continueText: same as above
	//    Defaults to "Continue"
	// continueFunc: same as above
	// leastDestructiveContinue: boolean: Continue is less destructive than Cancel
	// overrideButtons: an array of elements to replace the two buttons
	//    Each button will be given a leastDestructiveRef - it should be
	//      used by only ONE of them.
	// detatchButtons: boolean, buttons should not appear attached
	// fontSize: optional, gives default size for text; overridable by other *Props
	const buttonRef = useRef(null);
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
			leastDestructiveRef={buttonRef}
			isOpen={alertOpen}
			onClose={() => doCancel()}
			closeOnOverlayClick={false}
			{...(alertProps || {})}
		>
			<AlertDialog.Content {...(contentProps || {})}>
				<AlertDialog.Header
					p={3}
					bg="warning.500"
					_text={{color: useContrastText((headerProps && headerProps.bg) || "warning.500"), fontSize}}
					borderBottomWidth={0}
					{...(headerProps || {})}
				>
					{headerContent || "Warning"}
				</AlertDialog.Header>
				<AlertDialog.Body
					_text={{color: "text.50", fontSize}}
					{...(bodyProps || {})}
				>
					{bodyContent || "Are you sure?"}
				</AlertDialog.Body>
				<AlertDialog.Footer
					p={3}
					borderTopWidth={0}
					{...(footerProps || {})}
				>
					<Button.Group isAttached={!detatchButtons}>
						{overrideButtons ?
							overrideButtons.map((B, i) => <B key={`Button ${i}`} leastDestructiveRef={buttonRef} />)
						:
							<>
								<Button
									bg="darker"
									ref={leastDestructiveContinue ? undefined : buttonRef}
									_text={{color: "text.50", fontSize}}
									{...(cancelProps || {})}
									onPress={() => doCancel()}
								>
									{cancelText || "Cancel"}
								</Button>
								<Button
									bg="success.500"
									ref={leastDestructiveContinue ? buttonRef : undefined}
									_text={{color: useContrastText((continueProps && continueProps.bg) || "success.50"), fontSize}}
									{...(continueProps || {})}
									onPress={() => doContinue()}
								>
									{continueText || "Continue"}
								</Button>
							</>
						}
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
		return (
			<StandardAlert
				key={id + "-MultiAlert"}
				alertOpen={alertOpen === id}
				setAlertOpen={setAlertOpen}
				{...sharedProps}
				{...properties}
			/>
		);
	});
};

