import { useLocation, useOutletContext } from 'react-router-dom';
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

const WE = () => {
	const location = useLocation();
	const [doNavigate] = useOutletContext();
	const { width, height } = useWindowDimensions();
	const [buttonTextSize, iconSize, appHeaderSize] = getSizes("xs", "sm", "lg");
	const tabBarHeight = (fontSizesInPx[iconSize] + fontSizesInPx[buttonTextSize]) * 2 - 2;
	const appHeaderHeight = fontSizesInPx[appHeaderSize] * 2.5;
	const viewHeight = height - appHeaderHeight - tabBarHeight;
	const pathname = location.pathname;
	const ButtonLabel = useBreakpointValue({
		base: () => <></>,
		sm: ({color, label, opacity}) => (
			<Text
				textAlign="center"
				fontSize={buttonTextSize}
				color={color}
				noOfLines={1}
				opacity={opacity}
			>{label}</Text>
		)
	});
	const NavTab = ({ isCurrent, TabIcon, link, label }) => {
		const bg = isCurrent ? "lighter" : "transparent";
		const Inner = ({isPressed}) => {
			const colorProps = isCurrent || isPressed ? { color: "primary.500" } : { color: "text.50", opacity: 30 };
			return (
				<VStack
					alignItems="center"
					justifyContent="center"
					bg={bg}
					style={{
						height: tabBarHeight,
						width: (width - 6) / 5
					}}
				>
					<TabIcon size={iconSize} {...colorProps} />
					<ButtonLabel label={label} {...colorProps} />
				</VStack>
			)
		};
		return (
			<Pressable onPress={() => doNavigate(link)} overflow="hidden" children={(props) => <Inner {...props} />} />
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
				<Outlet context={[appHeaderHeight, viewHeight, tabBarHeight, doNavigate]} />
			</VStack>
			<TabBar rawHeight={tabBarHeight} boxProps={{zIndex: 5, bg: "main.800"}}>
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

export default WE;
