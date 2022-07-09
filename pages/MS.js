import { useNavigate, useLocation } from 'react-router-dom';
//import { shallowEqual, useSelector } from "react-redux";
import { Ionicons } from '@expo/vector-icons';

import { NavBar } from '../components/layoutTags';
import { Button, ScrollView, IconButton, Icon, VStack, Box } from 'native-base';
import { Outlet } from 'react-router-native';
import { useDispatch } from 'react-redux';
import { setHeaderState } from '../store/appStateSlice';

const MS = () => {
	//const msPage = useSelector((state) => state.viewState.ms, shallowEqual) || "msSettings";
	const dispatch = useDispatch();
	dispatch(setHeaderState({
		title: 'MorphoSyntax'
	}));
	const navigate = useNavigate();
	const location = useLocation();
	const pathname = location.pathname;
	const NavTab = (props) => {
		const { isCurrent, icon, link, label } = props;
		const bg = isCurrent ? "lighter" : "transparent";
		const colorString = isCurrent ? "primary.500" : "text.50";
		const textOptions = isCurrent ? {bold: true, color: colorString} : {color: colorString}
		if(icon) {
			return (
				<IconButton minWidth={6} variant="ghost" bg={bg} color={colorString} onPress={() => navigate(link)} icon={icon} _icon={{size: "md", color: colorString}} />
			);
		}
		return (
			<Button minWidth={8} variant="ghost" bg={bg} color={colorString} _text={textOptions} onPress={() => navigate(link)}>{label}</Button>
		);
	};
	const NavTabs = () => {
		let range = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
		return (
			<NavBar boxProps={{flexGrow: 0, borderColor: "main.700", borderTopWidth: 1}}>
				<NavTab isCurrent={pathname === "/ms"} icon={<Icon as={Ionicons} name="settings-sharp" size="2xs" />} link="/ms" key="NavTabSettings" />
				{range.map((n, i) => <NavTab isCurrent={pathname === "/ms/ms" + n} label={String(i+1)} link={"ms" + n} key={"Tab"+n} />)}
			</NavBar>
		);
	};
	return (
		<VStack h="full" alignItems="stretch" justifyContent="space-between" w="full" position="fixed" top={0} bottom={0}>
			<Box flexGrow={2} flexShrink={2} flexBasis="5/6" my={0} mx={4}>
				<ScrollView h="full">
					<Outlet />
				</ScrollView>
			</Box>
			<NavTabs />
		</VStack>
	);
};

export default MS;
