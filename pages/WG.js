import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-native';
import { useWindowDimensions } from 'react-native';
import {
	VStack,
	Text,
	Pressable,
	useBreakpointValue
} from 'native-base';

import TabBar from '../components/TabBar';
import {
	WGCharactersIcon,
	WGOutputIcon,
	WGTransformationsIcon,
	WGSettingsIcon,
	WGSyllablesIcon
} from '../components/icons';
import { fontSizesInPx } from '../store/appStateSlice';
import getSizes from '../helpers/getSizes';

const WG = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { width, height } = useWindowDimensions();
	const [buttonTextSize, iconSize, appHeaderSize] = getSizes("xs", "sm", "lg");
	const tabBarHeight = (fontSizesInPx[iconSize] + fontSizesInPx[buttonTextSize]) * 2 - 2;
	const appHeaderHeight = fontSizesInPx[appHeaderSize] * 2.5;
	const viewHeight = height - appHeaderHeight - tabBarHeight;
	const pathname = location.pathname;
	const ButtonLabel = useBreakpointValue({
		base: () => <></>,
		sm: ({color, label}) => <Text
				textAlign="center"
				fontSize={buttonTextSize}
				color={color}
				noOfLines={1}
			>{label}</Text>
	});
	const NavTab = ({ isCurrent, TabIcon, link, label }) => {
		const bg = isCurrent ? "lighter" : "transparent";
		const colorString = isCurrent ? "primary.500" : "main.600";
		return (
			<Pressable onPress={() => navigate(link)} overflow="hidden">
				<VStack
					alignItems="center"
					justifyContent="center"
					bg={bg}
					style={{
						height: tabBarHeight,
						width: (width - 6) / 5
					}}
				>
					<TabIcon color={colorString} size={iconSize} />
					<ButtonLabel color={colorString} label={label} />
				</VStack>
			</Pressable>
		);
	};
	return (
		<>
			<VStack
				alignItems="stretch"
				justifyContent="center"
				style={{
					height: viewHeight
				}}
			>
				<Outlet context={[appHeaderHeight, viewHeight, tabBarHeight]} />
			</VStack>
			<TabBar rawHeight={tabBarHeight}>
				<NavTab
					isCurrent={pathname === "/wg/characters"}
					TabIcon={(props) => <WGCharactersIcon {...props} />}
					link="/wg/characters"
					label="Characters"
				/>
				<NavTab
					isCurrent={pathname === "/wg/syllables"}
					TabIcon={(props) => <WGSyllablesIcon {...props} />}
					link="/wg/syllables"
					label="Syllables"
				/>
				<NavTab
					isCurrent={pathname === "/wg/transformations"}
					TabIcon={(props) => <WGTransformationsIcon {...props} />}
					link="/wg/transformations"
					label="Transforms"
				/>
				<NavTab
					isCurrent={pathname === "/wg/output"}
					TabIcon={(props) => <WGOutputIcon {...props} />}
					link="/wg/output"
					label="Output"
				/>
				<NavTab
					isCurrent={pathname === "/wg"}
					TabIcon={(props) => <WGSettingsIcon {...props} />}
					link="/wg"
					label="Settings"
				/>
			</TabBar>
		</>
	);
};

export default WG;
