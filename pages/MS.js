import { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-native';
import { ScrollView, VStack, Box, Button, IconButton } from 'native-base';

import { NavBar } from '../components/layoutTags';
import { SettingsIcon } from '../components/icons';

const MS = () => {
	//const msPage = useSelector((state) => state.viewState.ms, shallowEqual) || "msSettings";
	const location = useLocation();
	const navigate = useNavigate();
	const pathname = location.pathname;
	const scrollRef = useRef(null);
	useEffect(() => {
		// Scrolls to top of page when we navigate
		scrollRef.current.scrollTo({x: 0, y: 0, animated: false});
	}, [location]);
	const NavTab = (props) => {
		const { isCurrent, icon, link, label } = props;
		const bg = isCurrent ? "lighter" : "transparent";
		const colorString = isCurrent ? "primary.500" : "text.50";
		const textOptions =
			isCurrent ?
				{bold: true, color: colorString}
			:
				{color: colorString}
		;
		if(icon) {
			return (
				<IconButton
					minWidth={6}
					variant="ghost"
					bg={bg}
					color={colorString}
					onPress={() => navigate(link)}
					icon={icon}
					_icon={{size: "md", color: colorString}}
				/>
			);
		}
		return (
			<Button
				minWidth={8}
				variant="ghost"
				bg={bg}
				color={colorString}
				_text={textOptions}
				onPress={() => navigate(link)}
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
				mb={8}
			>
				<Box
					flexGrow={2}
					flexShrink={2}
					flexBasis="85%"
					mt={0}
					mx={4}
				>
					<ScrollView ref={scrollRef} h="full">
						<Outlet />
					</ScrollView>
				</Box>
			</VStack>
			<NavBar
				boxProps={
					{
						flex: 1,
						borderColor: "main.700",
						borderTopWidth: 1
					}
				}
			>
				<NavTab
					isCurrent={pathname === "/ms"}
					icon={<SettingsIcon size="2xs" />}
					link="/ms"
					key="NavTabSettings"
				/>
				{range.map((n, i) => (
					<NavTab
						isCurrent={pathname === "/ms/ms" + n}
						label={String(i+1)}
						link={"ms" + n}
						key={"Tab"+n}
					/>
				))}
			</NavBar>
		</>
	);
};

export default MS;
