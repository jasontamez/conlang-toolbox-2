import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
	Box,
	HStack,
	ScrollView
 } from "native-base";

import debounce from '../helpers/debounce';

const NavBar = ({
	boxProps = {},
	scrollProps = {},
	...props
}) => {
	// <NavBar
	//    scrollProps={props for inner ScrollView}
	//    boxProps={props for outer Box}
	//    {other props go to inner HStack} />
	const location = useLocation();
	const [scrollPos, setScrollPos] = useState(0);
	const navRef = useRef(null);
	const maybeUpdateScrollPos = ({contentOffset}) => {
		if(contentOffset) {
			if(contentOffset.x || contentOffset.x === 0) {
				setScrollPos(contentOffset.x);
			}
		}
	};
	useEffect(() => {
		navRef.current.scrollTo({x: scrollPos, y: 0, animated: false});
	}, [location, scrollPos]);
	return (
		<Box
			w="full"
			position="absolute"
			left={0}
			bottom={0}
			right={0}
			bg="main.800"
			{...boxProps}
		>
			<ScrollView
				horizontal
				w="full"
				ref={navRef}
				onScroll={
					({nativeEvent}) =>
						debounce(
							maybeUpdateScrollPos,
							{
								args: [nativeEvent],
								namespace: "navBar"
							}
						)
				}
				scrollEventThrottle={16}
				{...scrollProps}
			>
				<HStack
					w="full"
					space={4}
					justifyContent="space-between"
					{...props}
				/>
			</ScrollView>
		</Box>
	);
};

export default NavBar;
