import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { HStack, Menu, ScrollView, Switch, Text, VStack } from 'native-base';
import { setTheme, setDisableConfirms, sizes } from '../store/appStateSlice';


const AppSettings = () => {
	const dispatch = useDispatch();
	const {
		disableConfirms,
		theme
	} = useSelector((state) => state.appState, shallowEqual);
	const titleSize = useBreakpointValue(sizes.md);
	const textSize = useBreakpointValue(sizes.xs);
	return (
		<ScrollView>
			<HStack
				w="full"
				justifyContent="space-between"
				alignItems="center"
				p={2}
				borderBottomWidth={1}
				borderBottomColor="main.900"
			>
				<VStack
					flexGrow={1}
					flexShrink={2}
					mr={2}
				>
					<Text fontSize={titleSize}>Disable Confirmation Prompts</Text>
					<Text fontSize={textSize} color="main.500">Eliminates yes/no prompts when deleting or overwriting data.</Text>
				</VStack>
				<Switch
					defaultIsChecked={disableConfirms}
					onValueChange={(value) => dispatch(setDisableConfirms(value))}
				/>
			</HStack>
			<HStack
				w="full"
				justifyContent="space-between"
				alignItems="center"
				p={2}
				borderBottomWidth={1}
				borderBottomColor="main.900"
			>
				<VStack>
					<Text fontSize={titleSize}>Change Theme</Text>
				</VStack>
				<Menu
					placement="bottom right"
					closeOnSelect={false}
					trigger={(props) => <Text color="primary.500" {...props}>{theme}</Text>}
				>
					<Menu.OptionGroup
						defaultValue={theme}
						type="radio"
						onChange={(newTheme) => dispatch(setTheme(newTheme))}
					>
						<Menu.ItemOption value="Default">Default</Menu.ItemOption>
						<Menu.ItemOption value="Light">Light</Menu.ItemOption>
						<Menu.ItemOption value="Dark">Dark</Menu.ItemOption>
						<Menu.ItemOption value="Solarized Light">Solarized Light</Menu.ItemOption>
						<Menu.ItemOption value="Solarized Dark">Solarized Dark</Menu.ItemOption>
					</Menu.OptionGroup>
				</Menu>
			</HStack>
		</ScrollView>
	);
};

export default AppSettings;
