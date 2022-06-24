import { useNavigate } from 'react-router-dom';
import { shallowEqual, useSelector } from "react-redux";
import { Ionicons, Entypo } from '@expo/vector-icons';

import { NavBar } from '../components/Layout';
import { Button, ScrollView, Heading, IconButton } from 'native-base';
import { openModal } from '../../store/dFuncs';

const MS = () => {
	const msPage = useSelector((state) => state.viewState.ms, shallowEqual) || "msSettings";
	const navigate = useNavigate();
	const NavTab = (props) => {
		// if page == props.link, render as outline instead of ghost
		if(props.icon) {
			return (
				<IconButton variant="ghost" onPress={() => navigate(props.link)} icon={props.icon} _icon={{size: "md"}} />
			);
		}
		return (
			<Button variant="ghost" onPress={() => navigate(props.link)}>{props.label}</Button>
		);
	};
	const NavTabs = () => {
		let range = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
		return (
			<NavBar>
				<NavTab icon={<Icon as={Ionicons} name="settings-sharp" />} link="/ms" />
				{range.map((n, i) => <NavTab label={String(i+1)} link={"ms" + n} />)}
			</NavBar>
		);
	};
	const Menu = <IconButton onPress={() => navigate(props.link)} variant="ghost" icon={<Icon as={Entypo} size="md" />} />;
	const ExtraChars = () => {
		return (
			<IconButton variant="ghost" icon={<Icon as={Ionicons} name="globe-outline" />} onPress={() => dispatch(openModal("ExtraCharacters"))} />
		);
	};
	return (
		<VStack d="flex" h="100%" alignItems="stretch" justifyContent="space-between">
			<HStack>
				<Menu />
				<Heading flexGrow={1} isTruncated>MorphoSyntax</Heading>
				<ExtraChars />
			</HStack>
			<ScrollView flexGrow={1}>
				<Outlet />
			</ScrollView>
			<NavTabs />
		</VStack>
	);
};

export default MS;
