import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-native';
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

const WG = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const sizes = useSelector(state => state.appState.sizes);
	const buttonTextSize = useBreakpointValue(sizes.xs);
	const pathname = location.pathname;
	const w = useBreakpointValue({
		base: 12,
		sm: 20
	});
	const ButtonLabel = useBreakpointValue({
		base: () => <></>,
		sm: ({color, label}) => <Text fontSize={buttonTextSize} color={color}>{label}</Text>
	});
	const NavTab = (props) => {
		const { isCurrent, TabIcon, link, label } = props;
		const bg = isCurrent ? "lighter" : "transparent";
		const colorString = isCurrent ? "primary.500" : "main.600";
		return (
			<Pressable onPress={() => navigate(link)}>
				<VStack
					alignItems="center"
					justifyContent="center"
					h={12}
					bg={bg}
					w={w}
				>
					<TabIcon color={colorString} />
					<ButtonLabel color={colorString} label={label} />
				</VStack>
			</Pressable>
		);
	};
	return (
		<>
			<VStack
				alignItems="stretch"
				justifyContent="space-between"
				left={0}
				bottom={0}
				right={0}
				flex={1}
				mb={16}
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
						h: 16,
						pt: 2
					}
				}
				divider={
					<Divider
						bg="main.700"
						orientation="vertical"
						thickness={1}
						mx={2}
						height={10}
					/>
				}
				h={12}
			>
				<NavTab
					isCurrent={pathname === "/wg/characters"}
					TabIcon={(props) => <WGCharactersIcon {...props} />}
					link="/wg/characters"
					label="Characters"
					w={w}
				/>
				<NavTab
					isCurrent={pathname === "/wg/syllables"}
					TabIcon={(props) => <WGSyllablesIcon {...props} />}
					link="/wg/syllables"
					label="Syllables"
					w={w}
				/>
				<NavTab
					isCurrent={pathname === "/wg/transformations"}
					TabIcon={(props) => <WGTransformationsIcon {...props} />}
					link="/wg/transformations"
					label="Transforms"
					w={w}
				/>
				<NavTab
					isCurrent={pathname === "/wg/output"}
					TabIcon={(props) => <WGOutputIcon {...props} />}
					link="/wg/output"
					label="Output"
					w={w}
				/>
				<NavTab
					isCurrent={pathname === "/wg"}
					TabIcon={(props) => <WGSettingsIcon {...props} />}
					link="/wg"
					label="Settings"
					w={w}
				/>
			</TabBar>
		</>
	);
};

export default WG;
