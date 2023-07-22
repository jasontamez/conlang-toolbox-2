import {
//	Modal as NBModal,
	HStack,
	Text,
	IconButton,
	Button,
	Center,
	Spinner,
	ScrollView,
	useTheme,
	Box
} from 'native-base';
import {
	useWindowDimensions,
	Modal,
	View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseCircleIcon, OkIcon } from './icons';

// <FullPageModal
//    modalOpen={boolean} - true when modal is open
//    closeModal={function} - closes the modal when called
//    modalStyle={object} - additional props for <Modal>'s style
//    modalBackdropStyle={object} - additional props for the style of the <View> inside the Modal
//    modalContentStyle={object} - additional props for the style of the <View> that holds the content
//    modalHeaderProps={object} - additional props for the <HStack> that holds the header
//    HeaderOverride={Element} - replaces the default header
//       * receives modalWidth and modalHeight props
//    modalTitle={string} - placed in the header
//    noInnerScrollView - if missing or false, <BodyContent> is wrapped in a <ScrollView>
//    modalBodyProps={object} - additional props for the style of the <ScrollView> (if present)
//    BodyContent={Element} - placed in the body
//       * receives modalWidth and modalHeight props
//    modalFooterProps={object} - additional props for <Modal.Footer>
//    FooterOverride={Element} - replaces the default footer
//       * receives modalWidth and modalHeight props
//    textSize={font size} - size of header/footer elements
//    headerTextSize={font size} - size of header elements, overrides textSize
//    footerTextSize={font size} - size of footer elements, overrides textSize
// />
const FullPageModal = ({
	modalOpen,
	closeModal,
	modalStyle = {},
	modalBackdropStyle = {},
	modalContentStyle = {},
	modalHeaderProps = {},
	HeaderOverride,
	modalTitle,
	noInnerScrollView = false,
	modalBodyProps = {},
	BodyContent,
	modalFooterProps = {},
	FooterOverride,
	textSize,
	headerTextSize,
	footerTextSize
}) => {
	let { height, width } = useWindowDimensions();
	// Still not sure if these are even useful, but here we go...
	const { top, bottom, left, right } = useSafeAreaInsets();
	width -= left;
	width -= right;
	height -= top;
	height -= bottom;
	const {colors} = useTheme();
	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={modalOpen}
			onRequestClose={() => {
				closeModal();
			}}
			{...modalStyle}
		>
			<View style={{
				flex: 1,
				zIndex: 5000,
				justifyContent: 'center',
				alignItems: 'center',
				width,
				height,
				backgroundColor: colors.darker || "#00000044",
				marginHorizontal: 0,
				marginVertical: 0,
				paddingHorizontal: 0,
				paddingVertical: 0,
				...modalBackdropStyle
			}}>
				<View style={{
					paddingTop: 0,
					backgroundColor: colors.main["800"],
					justifyContent: 'space-between',
					width,
					height,
					marginHorizontal: 0,
					marginVertical: 0,
					paddingHorizontal: 0,
					paddingVertical: 0,
					...modalContentStyle
				}}>
					{HeaderOverride === undefined ?
						<HStack
							w="full"
							justifyContent="space-between"
							alignItems="center"
							px={1.5}
							bg="primary.500"
							flexGrow={0}
							{...modalHeaderProps}
						>
							<Text
								textAlign="center"
								bold
								flexGrow={1}
								flexShrink={1}
								fontSize={headerTextSize || textSize}
								color="primary.50"
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
					{noInnerScrollView ?
						<BodyContent modalWidth={width} modalHeight={height} />
					:
						<ScrollView {...modalBodyProps} flexGrow={1}>
							<BodyContent modalWidth={width} modalHeight={height} />
							<Box w={2} h={2} />
						</ScrollView>
					}
					{FooterOverride === undefined ?
						<HStack
							w="full"
							justifyContent="flex-end"
							alignItems="center"
							px={1.5}
							bg="main.700"
							{...modalFooterProps}
							flexGrow={0}
						>
							<Button
								m={0}
								startIcon={<OkIcon size={footerTextSize || textSize} />}
								onPress={closeModal}
								_text={{fontSize: footerTextSize || textSize}}
								bg="primary.500"
								color="primary.50"
							>Done</Button>
						</HStack>
					:
						<FooterOverride modalWidth={width} modalHeight={height} />
					}
				</View>
			</View>
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
		modalBackdropStyle={{
			backgroundColor: "transparent"
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
