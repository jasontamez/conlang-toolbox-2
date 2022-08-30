import { NativeRouter } from 'react-router-native';
import { Route, Routes } from 'react-router';
import { Provider, useSelector } from 'react-redux';
import { useWindowDimensions, StatusBar } from 'react-native';
//import { PersistGate } from 'redux-persist/integration/react';
import { NativeBaseProvider, Box, VStack, Text } from 'native-base';
import 'react-native-gesture-handler';

import { useFonts } from 'expo-font';
//import {
//	Arimo_400Regular,
//	Arimo_400Regular_Italic,
//	Arimo_700Bold,
//	Arimo_700Bold_Italic
//} from '@expo-google-fonts/arimo';
import {
	NotoSans_400Regular,
	NotoSans_400Regular_Italic,
	NotoSans_700Bold,
	NotoSans_700Bold_Italic
} from '@expo-google-fonts/noto-sans';
//import {
//	NotoSansJP_100Thin,
//	NotoSansJP_300Light,
//	NotoSansJP_400Regular,
//	NotoSansJP_500Medium,
//	NotoSansJP_700Bold,
//	NotoSansJP_900Black
//} from '@expo-google-fonts/noto-sans-jp';
import {
	NotoSerif_400Regular,
	NotoSerif_400Regular_Italic,
	NotoSerif_700Bold,
	NotoSerif_700Bold_Italic
} from '@expo-google-fonts/noto-serif';
//import {
//	NotoSerifJP_200ExtraLight,
//	NotoSerifJP_300Light,
//	NotoSerifJP_400Regular,
//	NotoSerifJP_500Medium,
//	NotoSerifJP_600SemiBold,
//	NotoSerifJP_700Bold,
//	NotoSerifJP_900Black
//} from '@expo-google-fonts/noto-serif-jp';
import {
	SourceCodePro_200ExtraLight,
	SourceCodePro_300Light,
	SourceCodePro_400Regular,
	SourceCodePro_500Medium,
	SourceCodePro_600SemiBold,
	SourceCodePro_700Bold,
	SourceCodePro_800ExtraBold,
	SourceCodePro_900Black,
	SourceCodePro_200ExtraLight_Italic,
	SourceCodePro_300Light_Italic,
	SourceCodePro_400Regular_Italic,
	SourceCodePro_500Medium_Italic,
	SourceCodePro_600SemiBold_Italic,
	SourceCodePro_700Bold_Italic,
	SourceCodePro_800ExtraBold_Italic,
	SourceCodePro_900Black_Italic
} from '@expo-google-fonts/source-code-pro';
//import {
//	Scheherazade_400Regular,
//	Scheherazade_700Bold
//} from '@expo-google-fonts/scheherazade';
//import {
//	Sriracha_400Regular
//} from '@expo-google-fonts/sriracha'

import getTheme from './components/theme';

import getStoreInfo from './store/store';

import About from './pages/About.js';
import MS from './pages/MS';
import MSSection from './pages/ms/msSection';
import MSSettings from './pages/ms/msSettings';
import Lexicon from './pages/Lex';
import WordLists from './pages/WordLists';
import AppHeader from './components/Header.js';
import AppSettings from './pages/AppSettings';

import WG from './pages/WG';
import WGSettings from './pages/wg/wgSettings';
import WGCharacters from './pages/wg/wgCharacterGroups';
import WGSyllables from './pages/wg/wgSyllables';
import WGTransformations from './pages/wg/wgTransformations';

const WGOutput = () => <WGSettings />;

const App = () => {
	const {store, persistor} = getStoreInfo();
	return (
		<Provider store={store}><Layout /></Provider>
	);
};

const Layout = () => {
	const [fontsloaded] = useFonts({
		//Arimo_400Regular,
		//Arimo_400Regular_Italic,
		//Arimo_700Bold,
		//Arimo_700Bold_Italic,
		NotoSans_400Regular,
		NotoSans_400Regular_Italic,
		NotoSans_700Bold,
		NotoSans_700Bold_Italic,
		//NotoSansJP_100Thin,
		//NotoSansJP_300Light,
		//NotoSansJP_400Regular,
		//NotoSansJP_500Medium,
		//NotoSansJP_700Bold,
		//NotoSansJP_900Black,
		NotoSerif_400Regular,
		NotoSerif_400Regular_Italic,
		NotoSerif_700Bold,
		NotoSerif_700Bold_Italic,
		//NotoSerifJP_200ExtraLight,
		//NotoSerifJP_300Light,
		//NotoSerifJP_400Regular,
		//NotoSerifJP_500Medium,
		//NotoSerifJP_600SemiBold,
		//NotoSerifJP_700Bold,
		//NotoSerifJP_900Black,
		SourceCodePro_200ExtraLight,
		SourceCodePro_300Light,
		SourceCodePro_400Regular,
		SourceCodePro_500Medium,
		SourceCodePro_600SemiBold,
		SourceCodePro_700Bold,
		SourceCodePro_800ExtraBold,
		SourceCodePro_900Black,
		SourceCodePro_200ExtraLight_Italic,
		SourceCodePro_300Light_Italic,
		SourceCodePro_400Regular_Italic,
		SourceCodePro_500Medium_Italic,
		SourceCodePro_600SemiBold_Italic,
		SourceCodePro_700Bold_Italic,
		SourceCodePro_800ExtraBold_Italic,
		SourceCodePro_900Black_Italic,
		//Scheherazade_400Regular,
		//Scheherazade_700Bold,
		//Sriracha_400Regular,
		//'ArTarumianKamar': require('./assets/fonts/ArTarumianKamar-Regular.ttf'),
		//'LeelawadeeUI': require('./assets/fonts/LeelawadeeUI.ttf'),
		//'LeelawadeeUI_Bold': require('./assets/fonts/LeelawadeeUI-Bold.ttf')
	});
	const themeName = useSelector((state) => state.appState.theme);
	const theme = getTheme(themeName)
	return (
		<NativeBaseProvider
			theme={theme}
			safeArea
			bg="main.500"
		>
			<StatusBar
				backgroundColor={theme.colors.main["900"]}
				barStyle={themeName.indexOf("Light") === -1 ? "light-content" : "dark-content"}
			/>
			{fontsloaded ? <AppRoutes /> : <Fontless />}
		</NativeBaseProvider>
	);
};

const Fontless = () => {
	return (
		<Box bg="main.900" safeArea>
			<Text color="danger.500">Waiting for fonts...</Text>
		</Box>

	);
};

const AppRoutes = () => {
	const {width, height} = useWindowDimensions();
	return (
		<NativeRouter>
			<VStack
				h="full"
				alignItems="stretch"
				justifyContent="space-between"
				w="full"
				position="absolute"
				top={0}
				bottom={0}
				bg="main.800"
				style={{
					maxWidth: width,
					maxHeight: height
				}}
			>
				<AppHeader />
				<Routes> {
					<Route path="/wg/*" element={<WG />}>
						<Route index element={<WGSettings />} />
						<Route path="characters" element={<WGCharacters />} />
						<Route path="syllables" element={<WGSyllables />} />
						<Route path="transformations" element={<WGTransformations />} />
						<Route path="output" element={<WGOutput/>} />
					</Route> /*
					<Route path="/we/*"  element={<WE />}>
					</Route> */ }
					<Route path="/lex" element={<Lexicon />} />
					<Route path="/ms/*" element={<MS />}>
						<Route index element={<MSSettings />} />
						<Route path=":msPage" element={<MSSection />} />
					</Route> { /*
					<Route path="/ph/*" element={<Lexicon />}>
					</Route>
					<Route path="/dc/*" element={<Lexicon />}>
					</Route> */}
					<Route path="/settings" element={<AppSettings />} />
					<Route path="/wordlists" element={<WordLists  />} />
					{ /* <Route path="/credits" element={<Credits />} />
					<Route path="/about" element={<About />} /> */ }
					<Route index element={<About />} />
				</Routes>
			</VStack>
		</NativeRouter>
	);
};

// Need to change "default" links to "/" indexes in all pages

export default App;
