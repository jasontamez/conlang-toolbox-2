import { useNavigate } from 'react-router-dom';
//import { shallowEqual, useSelector } from "react-redux";
import { Ionicons } from '@expo/vector-icons';

import { NavBar } from '../components/layoutTags';
import { Button, ScrollView, IconButton, Icon, VStack, Box } from 'native-base';
import Header from '../components/Header';
import { Outlet } from 'react-router-native';

const MS = () => {
	//const msPage = useSelector((state) => state.viewState.ms, shallowEqual) || "msSettings";
	const navigate = useNavigate();
	const NavTab = (props) => {
		// TO-DO:
		// if page == props.link, render as outline instead of ghost
		const variant = "ghost";
		if(props.icon) {
			return (
				<IconButton minWidth={6} variant={variant} color="main.50" onPress={() => navigate(props.link)} icon={props.icon} _icon={{size: "md", color: "main.50"}} />
			);
		}
		return (
			<Button minWidth={8} variant={variant} color="main.50" _text={{color: "main.50"}} onPress={() => navigate(props.link)}>{props.label}</Button>
		);
	};
	const NavTabs = () => {
		let range = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
		return (
			<NavBar boxProps={{flexGrow: 0, borderColor: "main.700", borderTopWidth: 1}}>
				<NavTab icon={<Icon as={Ionicons} name="settings-sharp" size="2xs" />} link="/ms" key="NavTabSettings" />
				{range.map((n, i) => <NavTab label={String(i+1)} link={"ms" + n} key={"Tab"+n} />)}
			</NavBar>
		);
	};
	return (
		<VStack h="full" alignItems="stretch" justifyContent="space-between" w="full" position="fixed" top={0} bottom={0}>
			<Header title="MorphoSyntax" />
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
