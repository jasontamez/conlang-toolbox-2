import React from "react";
import { Text, HStack, Box } from "native-base";
import { useLocation } from "react-router-dom";

//import { openModal } from '../store/dFuncs';
import MenuModal from "../pages/MenuModal";
import { allMainPages } from '../appLayoutInfo';
import ExtraChars from './ExtraCharsButton';
import LexiconContextMenu from "../pages/contextMenus/LexContextMenu";
import WordListsContextMenu from '../pages/contextMenus/WordListsContextMenu';
import WGContextMenu from '../pages/contextMenus/WGContextMenu';

const Headers = {
	WordListsContextMenu: <WordListsContextMenu key="header1" />,
	LexiconContextMenu: <LexiconContextMenu key="header2" />,
	WGContextMenu: <WGContextMenu key="header3" />
};

const AppHeader = () => {
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
	return (
		<HStack
			w="full"
			alignItems="center"
			bg="lighter"
			flexGrow={0}
			flexShrink={0}
			safeArea
			{...boxProps}
		>
			<MenuModal />
			<Box flexGrow={1} flexShrink={0}>
				<Text
					isTruncated
					fontSize="lg"
					textAlign="center"
					{...textProps}
				>
					{title}
				</Text>
			</Box>
			{extraChars ? <ExtraChars /> : <></>}
			{rightHeader.map(header => (
				<React.Fragment key={"Header-" + header}>
					{Headers[header]}
				</React.Fragment>
			))}
		</HStack>
	);
};

export default AppHeader;
