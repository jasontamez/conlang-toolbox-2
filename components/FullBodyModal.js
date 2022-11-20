import {
	Modal,
	HStack,
	Text,
	IconButton,
	Button,
	Center,
	Spinner
} from 'native-base';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
	modalProps = {},
	modalContentProps = {},
	modalHeaderProps = {},
	HeaderOverride,
	modalTitle,
	modalBodyProps = {},
	BodyContent,
	modalFooterProps = {},
	FooterOverride,
	textSize,
	headerTextSize,
	footerTextSize
}) => {
	const { height, width } = useWindowDimensions();
	// Still not sure if these are even useful, but here we go...
	const {top, bottom, left, right} = useSafeAreaInsets();
	const style = {
		paddingTop: 0,
		height: height - top - bottom,
		width: width - left - right
	};
	return (
		<Modal
			isOpen={modalOpen}
			onClose={closeModal}
			size="full"
			style={style}
			{...modalProps}
		>
			<Modal.Content
				bg="main.800"
				borderRadius="none"
				style={style}
				{...modalContentProps}
			>
				<Modal.Header w="full" {...modalHeaderProps}>
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
						<HeaderOverride modalWidth={style.width} modalHeight={style.height} />
					}
				</Modal.Header>
				<Modal.Body
					m={0}
					{...modalBodyProps}
				>
					<BodyContent modalWidth={style.width} modalHeight={style.height} />
				</Modal.Body>
				<Modal.Footer p={2} {...modalFooterProps}>
					{FooterOverride === undefined ?
						<Button
							m={0}
							startIcon={<OkIcon size={footerTextSize || textSize} />}
							onPress={closeModal}
							_text={{fontSize: footerTextSize || textSize}}
						>Done</Button>
					:
						<FooterOverride modalWidth={style.width} modalHeight={style.height} />
					}
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};

export default FullPageModal;

export const LoadingOverlay = ({
	overlayOpen,
	contents,
	spinnerSize = "lg",
	colorFamily
}) => (
	<FullPageModal
		modalOpen={overlayOpen}
		closeModal={() => null}
		HeaderOverride={() => <></>}
		FooterOverride={() => <></>}
		modalProps={{
			bg: "transparent"
		}}
		modalContentProps={{
			bg: "darker"
		}}
		modalHeaderProps={{
			height: 0,
			borderBottomWidth: 0,
			bg: "transparent"
		}}
		modalFooterProps={{
			height: 0,
			borderTopWidth: 0,
			bg: "transparent"
		}}
		modalBodyProps={{
			bg: "transparent"
		}}
		BodyContent={({modalHeight, modalWidth}) => (
			<Center
				width={modalWidth}
				height={modalHeight}
				bg="darker"
			>
				<HStack
					flexWrap="wrap"
					alignItems="center"
					justifyContent="center"
					space={10}
					py={4}
					px={8}
					bg={`${colorFamily}.900`}
					borderRadius="3xl"
					borderWidth={2}
					borderColor={`${colorFamily}.500`}
				>
					{contents}
					<Spinner size={spinnerSize} color={`${colorFamily}.500`} />
				</HStack>
			</Center>
		)}
	/>
);
