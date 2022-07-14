import React, { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Button, ScrollView, IconButton, VStack, Box } from 'native-base';
import { Outlet } from 'react-router-native';
import { NavBar } from '../components/layoutTags';
import { SettingsIcon } from '../components/icons';
import debounce from '../components/debounce';

const MS = () => {
	//const msPage = useSelector((state) => state.viewState.ms, shallowEqual) || "msSettings";
	const navigate = useNavigate();
	const location = useLocation();
	const [scrollPos, setScrollPos] = useState(0);
	const pathname = location.pathname;
	const scrollRef = useRef(null);
	const navRef = useRef(null);
	const maybeUpdateScrollPos = ({contentOffset}) => {
		contentOffset && contentOffset.x && setScrollPos(contentOffset.x);
	};
	const doNav = (where) => {
		navigate(where);
		scrollRef.current.scrollTo({x: 0, y: 0, animated: false});
		navRef.current.scrollTo({x: scrollPos, y: 0, animated: false});
	};
	const NavTab = (props) => {
		const { isCurrent, icon, link, label } = props;
		const bg = isCurrent ? "lighter" : "transparent";
		const colorString = isCurrent ? "primary.500" : "text.50";
		const textOptions = isCurrent ? {bold: true, color: colorString} : {color: colorString}
		if(icon) {
			return (
				<IconButton minWidth={6} variant="ghost" bg={bg} color={colorString} onPress={() => doNav(link)} icon={icon} _icon={{size: "md", color: colorString}} />
			);
		}
		return (
			<Button minWidth={8} variant="ghost" bg={bg} color={colorString} _text={textOptions} onPress={() => doNav(link)}>{label}</Button>
		);
	};
	let range = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
	return (
		<VStack h="full" alignItems="stretch" justifyContent="space-between" w="full" position="fixed" top={0} bottom={0}>
			<Box flexGrow={2} flexShrink={2} flexBasis="5/6" my={0} mx={4}>
				<ScrollView ref={scrollRef} h="full">
					<Outlet />
				</ScrollView>
			</Box>
			<NavBar
				boxProps={
					{
						flexGrow: 0,
						borderColor: "main.700",
						borderTopWidth: 1
					}
				}
				scrollProps={
					{
						ref: navRef,
						onScroll: ({nativeEvent}) => debounce(maybeUpdateScrollPos, [nativeEvent], 250),
						scrollEventThrottle: 16
					}
				}
			>
				<NavTab isCurrent={pathname === "/ms"} icon={<SettingsIcon size="2xs" />} link="/ms" key="NavTabSettings" />
				{range.map((n, i) => <NavTab isCurrent={pathname === "/ms/ms" + n} label={String(i+1)} link={"ms" + n} key={"Tab"+n} />)}
			</NavBar>
		</VStack>
	);
};

export default MS;
