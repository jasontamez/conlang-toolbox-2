import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-native';
import { useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import {
	VStack,
	Box,
	Text,
	Pressable,
	Divider,
	useBreakpointValue
} from 'native-base';

import { TabBar } from '../components/layoutTags';
import {
	WGCharactersIcon,
	WGOutputIcon,
	WGTransformationsIcon,
	WGSettingsIcon,
	WGSyllablesIcon
} from '../components/icons';
import { fontSizesInPx } from '../store/appStateSlice';

const WG = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const sizes = useSelector(state => state.appState.sizes);
	const buttonTextSize = useBreakpointValue(sizes.xs);
	const iconSize = useBreakpointValue(sizes.sm);
	const lineHeight = (fontSizesInPx[iconSize] + fontSizesInPx[buttonTextSize]) * 2;
	const pathname = location.pathname;
	const w = (useWindowDimensions().width / 5) - 10;
	const ButtonLabel = useBreakpointValue({
		base: () => <></>,
		sm: ({color, label}) => <Text fontSize={buttonTextSize} color={color}>{label}</Text>
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
				style={{marginBottom: lineHeight + 10}}
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
			<TabBar
				boxProps={
					{
						flex: 1,
						borderColor: "main.700",
						borderTopWidth: 1,
						pt: 2,
						style: {
							height: lineHeight + 10
						}
					}
				}
				divider={
					<Divider
						bg="main.700"
						orientation="vertical"
						thickness={1}
						mx={2}
						style={{height: lineHeight * 0.8}}
					/>
				}
			>
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
