import React from "react";
import { Text, HStack, Box, useBreakpointValue, ZStack } from "native-base";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//import { openModal } from '../store/dFuncs';
import MenuModal from "../pages/MenuModal";
import IconButton from "./IconButton";
import { allMainPages } from '../appLayoutInfo';
import LexiconContextMenu from "../pages/contextMenus/LexContextMenu";
import WordListsContextMenu from '../pages/contextMenus/WordListsContextMenu';
import WGContextMenu from '../pages/contextMenus/WGContextMenu';
import WEContextMenu from '../pages/contextMenus/WEContextMenu';
import ExtraCharsHeaderButton from '../pages/contextMenus/ExtraCharactersHeaderButton';
import { fontSizesInPx } from "../store/appStateSlice";
import { addPageToHistory } from "../store/historySlice";
import { ExtraCharactersIcon } from "./icons";

const Headers = {
	WordListsContextMenu: <WordListsContextMenu key="header1" />,
	LexiconContextMenu: <LexiconContextMenu key="header2" />,
	WGContextMenu: <WGContextMenu key="header3" />,
	WEContextMenu: <WEContextMenu key="header4" />,
	ExtraCharsHeaderButton: <ExtraCharsHeaderButton key="header5" />
};

const defaultProps = {
	title: 'Conlang Toolbox',
	boxProps: {},
	textBoxProps: {},
	textProps: {},
	buttonsBoxProps: {},
	extraChars: true,
	rightHeader: [],
	pretendModal: false
};

const AppHeader = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const sizes = useSelector(state => state.appState.sizes);
	const { pathname } = useLocation();
	const currentPage = allMainPages.find(page => pathname.startsWith(page.url)) || {};
	const {
		title,
		boxProps,
		textBoxProps,
		textProps,
		buttonsBoxProps,
		extraChars,
		rightHeader,
		pretendModal
	} = {...defaultProps, ...currentPage};
	const textSize = useBreakpointValue(sizes.lg);
	const emSize = fontSizesInPx[textSize] || fontSizesInPx.xs;
	const style = {height: emSize * 2.5};
	return (
		<ZStack
			style={style}
			safeArea
			bg="lighter"
			w="full"
			justifyContent="center"
			alignItems="center"
			{...boxProps}
		>
			<HStack
				w="full"
				justifyContent="center"
				style={style}
				alignItems="center"
				{...textBoxProps}
				{ /* THIS CENTERS THE HEADER PROPERLY! */ ...{}}
			>
				<Text
					isTruncated
					fontSize={textSize}
					textAlign="center"
					{...textProps}
				>
					{title}
				</Text>
			</HStack>
			<HStack
				w="full"
				style={style}
				alignItems="center"
				{...buttonsBoxProps}
			>
				{pretendModal || <MenuModal />}
				<Box flexGrow={1} flexShrink={0}></Box>
				{extraChars && <IconButton
					variant="ghost"
					color="text.50"
					icon={<ExtraCharactersIcon size={textSize} />}
					onPress={() => {
						dispatch(addPageToHistory(pathname));
						navigate('/extrachars');
					}}
					flexGrow={0}
					flexShrink={0}
				/>}
				{rightHeader.map(header => (
					<React.Fragment key={"Header-" + header}>
						{Headers[header]}
					</React.Fragment>
				))}
			</HStack>
		</ZStack>
	);
};

export default AppHeader;
