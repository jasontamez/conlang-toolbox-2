import { useNavigate } from 'react-router-dom';
//import { shallowEqual, useSelector } from "react-redux";
import { Ionicons } from '@expo/vector-icons';

import { NavBar } from '../components/layoutTags';
import { Button, ScrollView, IconButton, Icon } from 'native-base';
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
				<IconButton variant={variant} onPress={() => navigate(props.link)} icon={props.icon} _icon={{size: "md"}} />
			);
		}
		return (
			<Button variant={variant} onPress={() => navigate(props.link)}>{props.label}</Button>
		);
	};
	const NavTabs = () => {
		let range = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
		return (
			<NavBar>
				<NavTab icon={<Icon as={Ionicons} name="settings-sharp" />} link="/ms" key="NavTabSettings" />
				{range.map((n, i) => <NavTab label={String(i+1)} link={"ms" + n} key={"Tab"+n} />)}
			</NavBar>
		);
	};
	return (
		<>
			<Header title="MorphoSyntax" textAlign="center" />
			<ScrollView flexGrow={1}>
				<Outlet />
			</ScrollView>
			<NavTabs />
		</>
	);
};

export default MS;
