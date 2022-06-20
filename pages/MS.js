import { useNavigate, useParams } from 'react-router-dom';
import { shallowEqual, useSelector } from "react-redux";
import { settingsSharp } from 'ionicons/icons';

import { NavBar } from '../components/Layout';
import { Button, ScrollView, Heading } from 'native-base';

const MS = () => {
	const msPage = useSelector((state) => state.viewState.ms, shallowEqual) || "msSettings";
	const navigate = useNavigate();
	const NavTab = (props) => {
		return (
			<Button onPress={() => navigate(props.link)}>{props.label}</Button>
		);
	};
	const NavTabs = () => {
		let range = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
		return (
			<NavBar>
				<NavTab label="*" link="/ms" />
				{range.map((n, i) => <NavTab label={String(i+1)} link={"ms" + n} />)}
			</NavBar>
		);
	};
	return (
		<VStack d="flex" h="100%">
			<Heading>MorphoSyntax</Heading>
			<ScrollView flexGrow={1}>
				<Outlet />
			</ScrollView>
			<NavTabs />
		</VStack>
	);
};

export default MS;
