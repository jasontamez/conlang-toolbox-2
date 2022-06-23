import { Factory, ScrollView } from "native-base";
import RH from 'react-native-render-html';

export const NavBar = (props) => {
	return <ScrollView horizontal {...props} />
	//return (
	//	<ScrollView horizontal>
	//		{props.children}
	//	</ScrollView>
	//);
};

export const RenderHtml = Factory(RH);
