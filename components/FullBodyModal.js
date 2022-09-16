import {
	Modal,
	HStack,
	Text,
	IconButton,
	Button
} from 'native-base';
import { useWindowDimensions } from 'react-native';
import { CloseCircleIcon, OkIcon } from './icons';

// <FullPageModal
//    modalOpen={boolean} - true when modal is open
//    closeModal={function} - closes the modal when called
//    modalProps={object} - additional props for <Modal>
//    modalContentProps={object} - additional props for <Modal.Content>
//    modalHeaderProps={object} - additional props for <Modal.Header>
//    HeaderOverride={Element} - replaces the default header
//       * receives modalWidth and modalHeight props
//    modalTitle={string} - placed in the header
//    modalBodyProps={object} - additional props for <Modal.Body>
//    BodyContent={Element} - placed in the body
//       * receives modalWidth and modalHeight props
//    modalFooterProps={object} - additional props for <Modal.Footer>
//    FooterOverride={Element} - replaces the default footer
//       * receives modalWidth and modalHeight props
//    textSize={font size} - size of header/footer elements
//    headerTextSize={font size} - size of header elements, overrides textSize
//    footerTextSize={font size} - size of footer elements, overrides textSize
const FullPageModal = ({
	modalOpen,
	closeModal,
	modalProps,
	modalContentProps,
	modalHeaderProps,
	HeaderOverride,
	modalTitle,
	modalBodyProps,
	BodyContent,
	modalFooterProps,
	FooterOverride,
	textSize,
	headerTextSize,
	footerTextSize
}) => {
	const { height, width } = useWindowDimensions();
	return (
		<Modal
			m={0}
			isOpen={modalOpen}
			onClose={closeModal}
			size="full"
			style={{ width, height }}
			safeArea
			bg="main.800"
			{...(modalProps || {})}
		>
			<Modal.Content
				borderRadius="none"
				style={{ width, height, maxHeight: height }}
				{...(modalContentProps || {})}
			>
				<Modal.Header style={{width}} {...(modalHeaderProps || {})}>
					{HeaderOverride === undefined ?
						<HStack
							w="full"
							justifyContent="space-between"
							alignItems="center"
							pl={1.5}
						>
							<Text
								textAlign="center"
								bold
								flexGrow={1}
								flexShrink={1}
								fontSize={headerTextSize || textSize}
							>{modalTitle}</Text>
							<IconButton
								icon={<CloseCircleIcon color="primary.50" size={headerTextSize || textSize} />}
								onPress={closeModal}
								variant="ghost"
								flexGrow={0}
								flexShrink={0}
								px={0}
							/>
						</HStack>
					:
						<HeaderOverride modalWidth={width} modalHeight={height} />
					}
				</Modal.Header>
				<Modal.Body
					safeArea
					m={0}
					style={{width, height}}
					{...(modalBodyProps || {})}
				>
					<BodyContent modalWidth={width} modalHeight={height} />
				</Modal.Body>
				<Modal.Footer style={{width}} p={2} {...(modalFooterProps || {})}>
					{FooterOverride === undefined ?
						<Button
							m={0}
							startIcon={<OkIcon size={footerTextSize || textSize} />}
							onPress={closeModal}
							_text={{fontSize: footerTextSize || textSize}}
						>Done</Button>
					:
						<FooterOverride modalWidth={width} modalHeight={height} />
					}
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};

export default FullPageModal;
