import { useRef, useEffect } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { Outlet } from 'react-router-native';
import { ScrollView, VStack, Box, Button, IconButton, useBreakpointValue } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';

import NavBar from '../components/NavBar';
import { SettingsIcon } from '../components/icons';
import { addPageToHistory, fontSizesInPx } from '../store/appStateSlice';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const MS = () => {
	//const msPage = useSelector((state) => state.viewState.ms, shallowEqual) || "msSettings";
	const location = useLocation();
	const [doNavigate] = useOutletContext();
	const pathname = location.pathname;
	const scrollRef = useRef(null);
	const sizes = useSelector(state => state.appState.sizes);
	const dispatch = useDispatch();
	const textSize = useBreakpointValue(sizes.sm);
	const buffer = fontSizesInPx[textSize] * 3;
	useEffect(() => {
		// Scrolls to top of page when we navigate
		scrollRef.current.scrollTo({x: 0, y: 0, animated: false});
	}, [location]);
	const NavTab = (props) => {
		const { isCurrent, icon, link, label } = props;
		const bg = isCurrent ? "lighter" : "transparent";
		const colorString = isCurrent ? "primary.500" : "text.50";
		if(icon) {
			return (
				<IconButton
					minWidth={6}
					variant="ghost"
					bg={bg}
					color={colorString}
					onPress={() => doNavigate(link)}
					icon={icon}
					_icon={{color: colorString, size: textSize}}
				/>
			);
		}
		return (
			<Button
				minWidth={8}
				variant="ghost"
				bg={bg}
				color={colorString}
				_text={{bold: isCurrent, color: colorString, fontSize: textSize}}
				onPress={() => doNavigate(link)}
			>
				{label}
			</Button>
		);
	};
	const range = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
	return (
		<>
			<VStack
				alignItems="stretch"
				justifyContent="space-between"
				left={0}
				bottom={0}
				right={0}
				flex={1}
				style={{marginBottom: buffer}}
			>
				<Box
					mt={0}
					px={4}
				>
					<GestureHandlerRootView>
						<ScrollView ref={scrollRef} h="full">
							<Outlet />
							<Box w={2} h={2} />
						</ScrollView>
					</GestureHandlerRootView>
				</Box>
			</VStack>
			<NavBar
				boxProps={
					{
						flex: 1,
						borderColor: "main.700",
						borderTopWidth: 1,
						style: {height: buffer}
					}
				}
			>
				<NavTab
					isCurrent={pathname === "/ms"}
					icon={<SettingsIcon />}
					link="/ms"
					key="NavTabSettings"
				/>
				{range.map((n, i) => {
					const link = `/ms/ms${n}`;
					return (
						<NavTab
							isCurrent={pathname === link}
							label={String(i+1)}
							link={link}
							key={"Tab"+n}
						/>
					)
				})}
			</NavBar>
		</>
	);
};

export default MS;
