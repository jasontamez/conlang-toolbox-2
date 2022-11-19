import React from "react";
import { Text, HStack, Box, useBreakpointValue, ZStack } from "native-base";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

//import { openModal } from '../store/dFuncs';
import MenuModal from "../pages/MenuModal";
import { allMainPages } from '../appLayoutInfo';
import ExtraChars from './ExtraCharsButton';
import LexiconContextMenu from "../pages/contextMenus/LexContextMenu";
import WordListsContextMenu from '../pages/contextMenus/WordListsContextMenu';
import WGContextMenu from '../pages/contextMenus/WGContextMenu';
import WEContextMenu from '../pages/contextMenus/WEContextMenu';
import { fontSizesInPx } from "../store/appStateSlice";

const Headers = {
	WordListsContextMenu: <WordListsContextMenu key="header1" />,
	LexiconContextMenu: <LexiconContextMenu key="header2" />,
	WGContextMenu: <WGContextMenu key="header3" />,
	WEContextMenu: <WEContextMenu key="header4" />
};

const AppHeader = () => {
	const sizes = useSelector(state => state.appState.sizes);
	const location = useLocation();
	const here = location.pathname;
	const currentPage = allMainPages.find(page => here.startsWith(page.url)) || {};
	const defaultProps = {
		title: 'Conlang Toolbox',
		boxProps: {},
		textProps: {},
		extraChars: true,
		rightHeader: []
	};
	const {
		title,
		boxProps,
		textProps,
		extraChars,
		rightHeader
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
		>
			<HStack
				w="full"
				justifyContent="center"
				style={style}
				alignItems="center"
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
				{...boxProps}
			>
				<MenuModal />
				<Box flexGrow={1} flexShrink={0}></Box>
				{extraChars ? <ExtraChars size={textSize} buttonProps={{flexGrow: 0, flexShrink: 0}} /> : <></>}
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
