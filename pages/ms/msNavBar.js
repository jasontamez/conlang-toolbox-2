import { useNavigate, useLocation } from 'react-router-dom';
import { Button, IconButton } from 'native-base';

import { NavBar } from '../../components/layoutTags';
import { SettingsIcon } from '../../components/icons';

const MSNavBar = () => {
	const location = useLocation();
	const navigate = useNavigate();
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
	const range = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
	const children = [
		<NavTab isCurrent={pathname === "/ms"} icon={<SettingsIcon size="2xs" />} link="/ms" key="NavTabSettings" />
	];
	range.forEach((n, i) => {
		children.push(<NavTab isCurrent={pathname === "/ms/ms" + n} label={String(i+1)} link={"ms" + n} key={"Tab"+n} />);
	});
	return (
		<NavBar
			boxProps={
				{
					flex: 1,
					borderColor: "main.700",
					borderTopWidth: 1
				}
			}
		>
			<NavTab isCurrent={pathname === "/ms"} icon={<SettingsIcon size="2xs" />} link="/ms" key="NavTabSettings" />
			{range.map((n, i) => <NavTab isCurrent={pathname === "/ms/ms" + n} label={String(i+1)} link={"ms" + n} key={"Tab"+n} />)}
		</NavBar>
	);
};

export default MSNavBar;
