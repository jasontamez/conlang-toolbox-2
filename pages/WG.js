import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-native';
import { useWindowDimensions } from 'react-native';
import { VStack, Box, Text, Pressable, Divider } from 'native-base';

import { TabBar } from '../components/layoutTags';
import { WGCharactersIcon, WGOutputIcon, WGTransformsIcon, WGSettingsIcon, WGSyllablesIcon } from '../components/icons';

const WG = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const pathname = location.pathname;
	const { width } = useWindowDimensions();
	const NavTab = (props) => {
		const { isCurrent, TabIcon, link, label } = props;
		const bg = isCurrent ? "lighter" : "transparent";
		const colorString = isCurrent ? "primary.500" : "main.600";
		const buttonLabel = width > 390 ?
			<Text fontSize="xs" color={colorString}>{label}</Text>
		:
			<></>
		;
		return (
			<Pressable onPress={() => navigate(link)}>
				<VStack
					alignItems="center"
					justifyContent="center"
					h={12}
					bg={bg}
					w={width > 390 ? 20 : 12}
				>
					<TabIcon color={colorString} />
					{buttonLabel}
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
					mt={0}
					mx={4}
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
				/>
				<NavTab
					isCurrent={pathname === "/wg/syllables"}
					TabIcon={(props) => <WGSyllablesIcon {...props} />}
					link="/wg/syllables"
					label="Syllables"
				/>
				<NavTab
					isCurrent={pathname === "/wg/transforms"}
					TabIcon={(props) => <WGTransformsIcon {...props} />}
					link="/wg/transforms"
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
