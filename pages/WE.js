import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-native';
import { useWindowDimensions } from 'react-native';
import {
	VStack,
	Box,
	Text,
	Pressable,
	useBreakpointValue
} from 'native-base';

import TabBar from '../components/TabBar';
import {
	WEInputIcon,
	WECharactersIcon,
	WETransformationsIcon,
	WESoundChangesIcon,
	WEOutputIcon
} from '../components/icons';
import { fontSizesInPx } from '../store/appStateSlice';
import getSizes from '../helpers/getSizes';

const WG = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [buttonTextSize, iconSize] = getSizes("xs", "sm");
	const lineHeight = (fontSizesInPx[iconSize] + fontSizesInPx[buttonTextSize]) * 2;
	const pathname = location.pathname;
	const w = (useWindowDimensions().width / 5) - 10;
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
					w={w}
					style={{height: lineHeight}}
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
				left={0}
				bottom={0}
				right={0}
				flex={1}
				style={{marginBottom: lineHeight}}
			>
				<Box
					flexGrow={2}
					flexShrink={2}
					flexBasis="85%"
					m={0}
				>
					<Outlet />
				</Box>
			</VStack>
			<TabBar rawHeight={lineHeight}>
				<NavTab
					isCurrent={pathname === "/we"}
					TabIcon={(props) => <WEInputIcon {...props} />}
					link="/we"
					label="Input"
				/>
				<NavTab
					isCurrent={pathname === "/we/characters"}
					TabIcon={(props) => <WECharactersIcon {...props} />}
					link="/we/characters"
					label="Characters"
				/>
				<NavTab
					isCurrent={pathname === "/we/transformations"}
					TabIcon={(props) => <WETransformationsIcon {...props} />}
					link="/we/transformations"
					label="Transforms"
				/>
				<NavTab
					isCurrent={pathname === "/we/soundchanges"}
					TabIcon={(props) => <WESoundChangesIcon {...props} />}
					link="/we/soundchanges"
					label="Sound Changes"
				/>
				<NavTab
					isCurrent={pathname === "/we/output"}
					TabIcon={(props) => <WEOutputIcon {...props} />}
					link="/we/output"
					label="Output"
				/>
			</TabBar>
		</>
	);
};

export default WG;
