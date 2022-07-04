import React from 'react';

//import React from "react";
import { NativeBaseProvider, Box } from "native-base";

import { NativeRouter } from "react-router-native";
import { Route, Routes } from "react-router";
import { Provider } from 'react-redux';
//import { PersistGate } from 'redux-persist/integration/react';

import { useFonts } from 'expo-font';
import {
	Arimo_400Regular,
	Arimo_400Regular_Italic,
	Arimo_700Bold,
	Arimo_700Bold_Italic
} from '@expo-google-fonts/arimo';
import { 
	NotoSans_400Regular,
	NotoSans_400Regular_Italic,
	NotoSans_700Bold,
	NotoSans_700Bold_Italic
} from '@expo-google-fonts/noto-sans';
import { 
	NotoSansJP_100Thin,
	NotoSansJP_300Light,
	NotoSansJP_400Regular,
	NotoSansJP_500Medium,
	NotoSansJP_700Bold,
	NotoSansJP_900Black
} from '@expo-google-fonts/noto-sans-jp';
import { 
	NotoSerif_400Regular,
	NotoSerif_400Regular_Italic,
	NotoSerif_700Bold,
	NotoSerif_700Bold_Italic
} from '@expo-google-fonts/noto-serif';
import { 
	NotoSerifJP_200ExtraLight,
	NotoSerifJP_300Light,
	NotoSerifJP_400Regular,
	NotoSerifJP_500Medium,
	NotoSerifJP_600SemiBold,
	NotoSerifJP_700Bold,
	NotoSerifJP_900Black
} from '@expo-google-fonts/noto-serif-jp';
import { 
	DMMono_300Light,
	DMMono_300Light_Italic,
	DMMono_400Regular,
	DMMono_400Regular_Italic,
	DMMono_500Medium,
	DMMono_500Medium_Italic
} from '@expo-google-fonts/dm-mono';
import { 
	Scheherazade_400Regular,
	Scheherazade_700Bold
} from '@expo-google-fonts/scheherazade';
import { 
	Sriracha_400Regular
} from '@expo-google-fonts/sriracha'

import getTheme from './components/theme';

import getStoreInfo from './store/store';
import MS from "./pages/MS";
import MSSection from "./pages/ms/msSection";
import MSSettings from "./pages/ms/msSettings";

import About from "./pages/About.js";

const App = () => {
	const {store, persistor} = getStoreInfo();
	const [fontsloaded] = useFonts({
		Arimo_400Regular,
		Arimo_400Regular_Italic,
		Arimo_700Bold,
		Arimo_700Bold_Italic,
		NotoSans_400Regular,
		NotoSans_400Regular_Italic,
		NotoSans_700Bold,
		NotoSans_700Bold_Italic,
		NotoSansJP_100Thin,
		NotoSansJP_300Light,
		NotoSansJP_400Regular,
		NotoSansJP_500Medium,
		NotoSansJP_700Bold,
		NotoSansJP_900Black,
		NotoSerif_400Regular,
		NotoSerif_400Regular_Italic,
		NotoSerif_700Bold,
		NotoSerif_700Bold_Italic,
		NotoSerifJP_200ExtraLight,
		NotoSerifJP_300Light,
		NotoSerifJP_400Regular,
		NotoSerifJP_500Medium,
		NotoSerifJP_600SemiBold,
		NotoSerifJP_700Bold,
		NotoSerifJP_900Black,
		DMMono_300Light,
		DMMono_300Light_Italic,
		DMMono_400Regular,
		DMMono_400Regular_Italic,
		DMMono_500Medium,
		DMMono_500Medium_Italic,
		Scheherazade_400Regular,
		Scheherazade_700Bold,
		Sriracha_400Regular,
		'ArTarumianKamar': require('./assets/fonts/ArTarumianKamar-Regular.ttf'),
		'LeelawadeeUI': require('./assets/fonts/LeelawadeeUI.ttf'),
		'LeelawadeeUI_Bold': require('./assets/fonts/LeelawadeeUI-Bold.ttf')
	});
	const theme = getTheme("Solarized Dark");
	return (
		<Provider store={store}>
		<NativeBaseProvider theme={theme}>
			<Box h="full" safeArea bg="main.800">
				<NativeRouter>
						<Routes> { /* 
							<Route path="/wg/*" element={<WG />}>
							</Route>
							<Route path="/we/*"  element={<WE />}>
							</Route>
							<Route path="/lex/*" element={<Lexicon />}>
							</Route> */ }
							<Route path="/ms/*" element={<MS />}>
								<Route index element={<MSSettings />} />
								<Route path=":msPage" element={<MSSection />} />
							</Route> { /*
							<Route path="/ph/*" element={<Lexicon />}>
							</Route>
							<Route path="/dc/*" element={<Lexicon />}>
							</Route>
							<Route path="/settings" element={<Settings />} />
							<Route path="/wordlists" element={<WordLists />} />
							<Route path="/credits" element={<Credits />} />
							<Route path="/about" element={<About />} /> */ }
							<Route index element={<About />} />
						</Routes>
				</NativeRouter>
			</Box>
		</NativeBaseProvider>
		</Provider>
	);
};

// Need to change "default" links to "/" indexes in all pages

export default App;
