import { useEffect, useState } from 'react';
import { NativeRouter } from 'react-router-native';
import { Route, Routes } from 'react-router';
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Provider, useDispatch, useSelector } from 'react-redux';
import { useWindowDimensions, StatusBar, BackHandler } from 'react-native';
//import { PersistGate } from 'redux-persist/integration/react';
import { NativeBaseProvider, VStack } from 'native-base';
import 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';


import { useFonts } from 'expo-font';

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
import doConvertOldStorageToNew from './helpers/convertOldStorageToNew';
import WE from './pages/WE';
import WEInput from './pages/we/weInput';
import WECharacters from './pages/we/weCharacterGroups';
import WETransformations from './pages/we/weTransformations';
import WESoundChanges from './pages/we/weSoundChanges';
import WEOutput from './pages/we/weOutput';
import Credits from './pages/Credits'
import ExtraCharacters from './pages/ExtraCharacters';

SplashScreen.preventAutoHideAsync();

const App = () => {
	const {store, persistor} = getStoreInfo();
	return (
		<Provider store={store}><Layout /></Provider>
	);
};

const Layout = () => {
	const [fontsloaded] = useFonts({
		'Noto Sans': require('./assets/fonts/NotoSans-Regular.ttf'),
		'Noto Sans Italic': require('./assets/fonts/NotoSans-Italic.ttf'),
		'Noto Sans Bold': require('./assets/fonts/NotoSans-Bold.ttf'),
		'Noto Sans Bold Italic': require('./assets/fonts/NotoSans-BoldItalic.ttf'),
		'Noto Serif': require('./assets/fonts/NotoSerif-Regular.ttf'),
		'Noto Serif Italic': require('./assets/fonts/NotoSerif-Italic.ttf'),
		'Noto Serif Bold': require('./assets/fonts/NotoSerif-Bold.ttf'),
		'Noto Serif Bold Italic': require('./assets/fonts/NotoSerif-BoldItalic.ttf'),
		'Source Code Pro': require('./assets/fonts/SourceCodePro-Regular.ttf'),
		'Source Code Pro Italic': require('./assets/fonts/SourceCodePro-Italic.ttf'),
		'Source Code Pro Bold': require('./assets/fonts/SourceCodePro-Bold.ttf'),
		'Source Code Pro Bold Italic': require('./assets/fonts/SourceCodePro-BoldItalic.ttf')
	});
	const { theme, hasCheckedForOldCustomInfo } = useSelector((state) => state.appState);
	const themeObject = getTheme(theme);
	const [okToProceed, setOkToProceed] = useState(hasCheckedForOldCustomInfo);
	const [oldInfoCheckDispatched, setOldInfoCheckDispatched] = useState(false);
	const [delayFinished, setDelayFinished] = useState(0);
	const dispatch = useDispatch();
	useEffect(() => {
		if(!oldInfoCheckDispatched) {
			setOldInfoCheckDispatched(true);
			// Convert old storage to new storage (if needed)
			hasCheckedForOldCustomInfo || doConvertOldStorageToNew(dispatch);
		}
		if(delayFinished === 0) {
			setDelayFinished(false);
			new Promise(resolve => setTimeout(resolve, 1000)).then(() => setDelayFinished(true));
		}
		if(hasCheckedForOldCustomInfo && fontsloaded && delayFinished) {
			SplashScreen.hideAsync();
			setOkToProceed(true);
		}
	}, [
		fontsloaded,
		hasCheckedForOldCustomInfo,
		delayFinished
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
			{okToProceed && <AppRoutes />}
		</NativeBaseProvider>
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
		// Save to history
		dispatch(addPageToHistory(pathname));
		// Navigate
		return navigate(where);
	};
	useEffect(() => {
		const backAction = () => {
			if(history.length > 0) {
				dispatch(removeLastPageFromHistory());
				navigate(history[0]);
			} else {
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
