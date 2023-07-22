import { useEffect, useState } from 'react';
import { NativeRouter } from 'react-router-native';
import { Route, Routes } from 'react-router';
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Provider, useDispatch, useSelector } from 'react-redux';
import { useWindowDimensions, StatusBar, Text, BackHandler } from 'react-native';
//import { PersistGate } from 'redux-persist/integration/react';
import { NativeBaseProvider, VStack, Center, useTheme } from 'native-base';
import 'react-native-gesture-handler';


// KILLSWITCH
import { useFonts } from 'expo-font';
import { NotoSans_400Regular, NotoSans_400Regular_Italic, NotoSans_700Bold, NotoSans_700Bold_Italic } from '@expo-google-fonts/noto-sans';
import { NotoSerif_400Regular, NotoSerif_400Regular_Italic, NotoSerif_700Bold, NotoSerif_700Bold_Italic } from '@expo-google-fonts/noto-serif';
import { SourceCodePro_200ExtraLight, SourceCodePro_300Light, SourceCodePro_400Regular, SourceCodePro_500Medium, SourceCodePro_600SemiBold, SourceCodePro_700Bold, SourceCodePro_800ExtraBold, SourceCodePro_900Black, SourceCodePro_200ExtraLight_Italic, SourceCodePro_300Light_Italic, SourceCodePro_400Regular_Italic, SourceCodePro_500Medium_Italic, SourceCodePro_600SemiBold_Italic, SourceCodePro_700Bold_Italic, SourceCodePro_800ExtraBold_Italic, SourceCodePro_900Black_Italic } from '@expo-google-fonts/source-code-pro';
// KILLSWITCH

//import { Arimo_400Regular, Arimo_400Regular_Italic, Arimo_700Bold, Arimo_700Bold_Italic } from '@expo-google-fonts/arimo';
//import { NotoSansJP_100Thin, NotoSansJP_300Light, NotoSansJP_400Regular, NotoSansJP_500Medium, NotoSansJP_700Bold, NotoSansJP_900Black } from '@expo-google-fonts/noto-sans-jp';
//import { NotoSerifJP_200ExtraLight, NotoSerifJP_300Light, NotoSerifJP_400Regular, NotoSerifJP_500Medium, NotoSerifJP_600SemiBold, NotoSerifJP_700Bold, NotoSerifJP_900Black } from '@expo-google-fonts/noto-serif-jp';
//import { Scheherazade_400Regular, Scheherazade_700Bold } from '@expo-google-fonts/scheherazade';
//import { Sriracha_400Regular } from '@expo-google-fonts/sriracha'

import StandardAlert from './components/StandardAlert';
import getTheme from './helpers/theme';

import getStoreInfo from './store/store';

import AppHeader from './components/Header.js';
import AppSettings from './pages/AppSettings';

import MS from './pages/MS';
import MSSection from './pages/ms/msSection';
import MSSettings from './pages/ms/msSettings';

import Lexicon from './pages/Lex';
import WordLists from './pages/WordLists';
import About from './pages/About.js';

import { addPageToHistory, removeLastPageFromHistory } from './store/appStateSlice';
import WG from './pages/WG';
import WGSettings from './pages/wg/wgSettings';
import WGCharacters from './pages/wg/wgCharacterGroups';
import WGSyllables from './pages/wg/wgSyllables';
import WGTransformations from './pages/wg/wgTransformations';
import WGOutput from './pages/wg/wgOutput';
import doConvert from './helpers/convertOldStorageToNew';
import WE from './pages/WE';
import WEInput from './pages/we/weInput';
import WECharacters from './pages/we/weCharacterGroups';
import WETransformations from './pages/we/weTransformations';
import WESoundChanges from './pages/we/weSoundChanges';
import WEOutput from './pages/we/weOutput';
import Credits from './pages/Credits'
import ExtraCharacters from './pages/ExtraCharacters';

const App = () => {
	const {store, persistor} = getStoreInfo();
	return (
		<Provider store={store}><Layout /></Provider>
	);
};

// For when the font thingie keeps messing up:
//	change comments so killSwitch is [true]
//	comment out everything in "killswitch" above
//	uncomment useFonts below
let killSwitch //= [true];
//const useFonts = () => [true];

const Layout = () => {
	const [fontsloaded] = killSwitch || useFonts({
		//Arimo_400Regular,
		//Arimo_400Regular_Italic,
		//Arimo_700Bold,
		//Arimo_700Bold_Italic,
//		NotoSans_400Regular,
//		NotoSans_400Regular_Italic,
//		NotoSans_700Bold,
//		NotoSans_700Bold_Italic,
		//NotoSansJP_100Thin,
		//NotoSansJP_300Light,
		//NotoSansJP_400Regular,
		//NotoSansJP_500Medium,
		//NotoSansJP_700Bold,
		//NotoSansJP_900Black,
//		NotoSerif_400Regular,
//		NotoSerif_400Regular_Italic,
//		NotoSerif_700Bold,
//		NotoSerif_700Bold_Italic,
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
		//'LeelawadeeUI_Bold': require('./assets/fonts/LeelawadeeUI-Bold.ttf'),
		'Noto Sans': require('./assets/fonts/NotoSans-Regular.ttf'),
		'Noto Serif': require('./assets/fonts/NotoSerif-Regular.ttf')
	});
	const { theme, hasCheckedForOldCustomInfo } = useSelector((state) => state.appState);
	const themeObject = getTheme(theme);
	const [okToProceed, setOkToProceed] = useState(hasCheckedForOldCustomInfo);
	const [oldInfoCheckDispatched, setOldInfoCheckDispatched] = useState(false);
	const dispatch = useDispatch();
	useEffect(() => {
		if(!oldInfoCheckDispatched) {
			setOldInfoCheckDispatched(true);
			// Convert old storage to new storage (if needed)
			hasCheckedForOldCustomInfo || doConvert(dispatch);
		}
		setOkToProceed(hasCheckedForOldCustomInfo && fontsloaded);
	}, [
		fontsloaded,
		hasCheckedForOldCustomInfo
	]);
	return (
		<NativeBaseProvider
			theme={themeObject}
			safeArea
			bg="main.500"
		>
			<StatusBar
				backgroundColor={themeObject.colors.main["900"]}
				barStyle={theme.indexOf("Light") === -1 ? "light-content" : "dark-content"}
			/>
			{okToProceed ? <AppRoutes /> : <Fontless />}
		</NativeBaseProvider>
	);
};

const Fontless = () => {
	const {width, height} = useWindowDimensions();
	const {colors} = useTheme();
	return (
		<Center safeArea bg="main.900" width={width} height={height}>
			<Text style={{color: colors.red["500"]}}>Waiting for fonts...</Text>
		</Center>

	);
};

const MainOutlet = ({setBackButtonAlert}) => {
	const location = useLocation();
	const { pathname } = location;
	const navigate = useNavigate();
	const { history } = useSelector((state) => state.appState);
	const dispatch = useDispatch();
	const navigator = (where) => {
		if(pathname === where) {
			// Do nothing
			return;
		}
		console.log(`ADD to history: ${pathname}`);
		// Save to history
		dispatch(addPageToHistory(pathname));
		// Navigate
		return navigate(where);
	};
	useEffect(() => {
		const backAction = () => {
			if(history.length > 0) {
				console.log(`NAV TO: ${history.join(', ')}`);
				dispatch(removeLastPageFromHistory());
				navigate(history[0]);
			} else {
				console.log("NO NAV");
				setBackButtonAlert(true);
			}
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction,
		);

		return () => backHandler.remove();
	}, [setBackButtonAlert, navigate, dispatch, history]);
	console.log(`CURRENT: ${pathname}`);
	return <Outlet context={[navigator]} />;
};

const AppRoutes = () => {
	const {width, height} = useWindowDimensions();
	const [backButtonAlert, setBackButtonAlert] = useState(false);
	return (
		<NativeRouter>
			<StandardAlert
				alertOpen={backButtonAlert}
				setAlertOpen={setBackButtonAlert}
				headerProps={{ bg: "danger.500", _text: {color: "danger.50", bold: true} }}
				bodyContent="Do you want to exit the app?"
				cancelFunc={() => setBackButtonAlert(false)}
				continueText="Close App"
				continueFunc={BackHandler.exitApp}
				detatchButtons
			/>
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
				<Routes>
					<Route path="/*" element={<MainOutlet setBackButtonAlert={setBackButtonAlert} />}>
						<Route index element={<About />} />
						<Route path="wg/*" element={<WG />}>
							<Route index element={<WGSettings />} />
							<Route path="characters" element={<WGCharacters />} />
							<Route path="syllables" element={<WGSyllables />} />
							<Route path="transformations" element={<WGTransformations />}  />
							<Route path="output" element={<WGOutput/>} />
						</Route>
						<Route path="we/*" element={<WE />}>
							<Route index element={<WEInput />} />
							<Route path="characters" element={<WECharacters />} />
							<Route path="transformations" element={<WETransformations />} />
							<Route path="soundchanges" element={<WESoundChanges />} />
							<Route path="output" element={<WEOutput/>} />
						</Route>
						<Route path="lex" element={<Lexicon />} />
						<Route path="ms/*" element={<MS />}>
							<Route index element={<MSSettings />} />
							<Route path=":msPage" element={<MSSection />} />
						</Route> { /*
						<Route path="ph/*" element={<Lexicon />}>
						</Route>
						<Route path="dc/*" element={<Lexicon />}>
						</Route> */}
						<Route path="settings" element={<AppSettings />} />
						<Route path="wordlists" element={<WordLists />} />
						<Route path="credits" element={<Credits />} />
						<Route path="extrachars" element={<ExtraCharacters />} />
					</Route>
				</Routes>
			</VStack>
		</NativeRouter>
	);
};

// Need to change "default" links to "/" indexes in all pages

export default App;
