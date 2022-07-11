import { Text, HStack } from "native-base";
//import { openModal } from '../store/dFuncs';
import MenuModal from "../pages/MenuModal";
import { allMainPages } from '../appLayoutInfo';
import { useLocation } from "react-router-dom";
import React from "react";
import WordListsContextMenu from '../pages/WordListsContextMenu';
import ExtraChars from './ExtraCharsButton';

const AppHeader = () => {
	const location = useLocation();
	const here = location.pathname;
	const currentPage = allMainPages.find(page => here.startsWith(page.url)) || {};
	const Headers = {
		WordListsContextMenu: <WordListsContextMenu key="header1" />
	};
	const defaultProps = {
		title: 'Conlang Toolbox',
		boxProps: {},
		textProps: {},
		extraChars: true,
		rightHeader: []
	};
	const {title, boxProps, textProps, extraChars, rightHeader } = {...defaultProps, ...currentPage};
	return (
		<HStack w="full" alignItems="center" bg="lighter" flexGrow={0} safeArea {...boxProps}>
			<MenuModal />
			<Text flexGrow={1} isTruncated fontSize="lg" textAlign="center" {...textProps}>{title}</Text>
			{extraChars ? <ExtraChars /> : <></>}
			{rightHeader.map(header => {
				return <React.Fragment key={"Header-" + header}>{Headers[header]}</React.Fragment>;
			})}
		</HStack>
	);
};

export default AppHeader;
