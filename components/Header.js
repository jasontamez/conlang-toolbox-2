import { Text, HStack, Box } from "native-base";
//import { openModal } from '../store/dFuncs';
import MenuModal from "../pages/MenuModal";
import { allMainPages } from '../appLayoutInfo';
import { useLocation } from "react-router-dom";
import React from "react";
import WordListsContextMenu from '../pages/WordListsContextMenu';
import ExtraChars from './ExtraCharsButton';
import LexiconContextMenu from "../pages/LexContextMenu";

const Headers = {
	WordListsContextMenu: <WordListsContextMenu key="header1" />,
	LexiconContextMenu: <LexiconContextMenu key="header2" />
};

const AppHeader = ({ scrollToTop }) => {
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
	const {title, boxProps, textProps, extraChars, rightHeader } = {...defaultProps, ...currentPage};
	return (
		<HStack w="full" alignItems="center" bg="lighter" flex="0 0 auto" safeArea {...boxProps}>
			<MenuModal scrollToTop={scrollToTop} />
			<Box flex="1 0 auto">
				<Text isTruncated fontSize="lg" textAlign="center" {...textProps}>{title}</Text>
			</Box>
			{extraChars ? <ExtraChars /> : <></>}
			{rightHeader.map(header => {
				return <React.Fragment key={"Header-" + header}>{Headers[header]}</React.Fragment>;
			})}
		</HStack>
	);
};

export default AppHeader;
