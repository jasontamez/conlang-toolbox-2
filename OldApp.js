import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NativeBaseProvider, VStack, HStack, Spinner, Heading, Container, Text } from "native-base";
import { Provider, useSelector } from 'react-redux';
import getStoreInfo from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import getTheme from './helpers/theme';


import Menu from './components/menu';
import About from "./pages/About";
import WordLists from "./pages/WordLists";
import WG from "./pages/WG";
import WE from "./pages/WE";
import MS from "./pages/MS";
import Lexicon from "./pages/Lex";
import Settings from "./pages/AppSettings";
import Credits from './pages/Credits';


import { checkIfState, initialAppState } from './components/ReduxDucks';
import { overwriteState } from './components/ReduxDucksFuncs';
import { VERSION } from './components/ReduxDucksConst';
import compareVersions from 'compare-versions';
import store from './components/ReduxStore';
import { StateStorage } from './components/persistentInfo';



//Is this needed?
import ReactDOM from 'react-dom';


export default function App() {
	return (
		<View style={styles.container}>
			<Text>Open up App.js to start working on your app!</Text>
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});




import { Route, Redirect } from 'react-router-dom';
import {
	IonApp,
	IonRouterOutlet,
	IonSplitPane
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
/* My theming */
import './theme/App.css';




const Appp = () => {
	const maybeSetState = () => {
		return (dispatch) => {
			return StateStorage.getItem("lastState").then((storedState) => {
				if(storedState !== null) {
					if(storedState && (typeof storedState) === "object") {
						if (compareVersions.compare(storedState.currentVersion, VERSION.current, "<")) {
							// Do stuff to possibly bring storedState up to date
							storedState.currentVersion = VERSION.current;
						}
						if(checkIfState(storedState)) {
							return dispatch(overwriteState(storedState));
						}
					}
				}
				return dispatch(overwriteState(initialAppState));
			});
		}
	};
	store.dispatch(maybeSetState());
	return (
		<IonApp id="conlangToolbox">
			<IonReactRouter>
				<IonSplitPane contentId="main" when="xl">
					<Menu />
					{/*
						Using the render method prop cuts down the number of renders your components
						will have due to route changes. Use the component prop when your component
						depends on the RouterComponentProps passed in automatically.
					*/}
					<IonRouterOutlet id="main">
						<Route path="/wg" render={() => <WG />} />
						<Route path="/we"  render={() => <WE />} />
						<Route path="/lex" render={() => <Lexicon />} />
						<Route path="/ms" render={() => <MS />} />
						<Route path="/ph" render={() => <Lexicon />} />
						<Route path="/dc" render={() => <Lexicon />} />
						<Route path="/settings" render={() => <Settings />} />
						<Route path="/about" render={() => <About />} />
						<Route path="/wordlists" render={() => <WordLists />} />
						<Route path="/credits" render={() => <Credits />} />
						<Redirect exact={true} from="/" to="/about" />
					</IonRouterOutlet>
				</IonSplitPane>
			</IonReactRouter>
		</IonApp>
	);
};

const A = () => {
	const {store, persistor} = getStoreInfo();
	const themeName = useSelector(state => state.theme);
	const theme = getTheme(themeName);

	const Menu = <nav></nav>;
	const Content = <div></div>;

	const loading = (
		<VStack justifyContent={"center"} safeArea h="full" w="full">
			<HStack space="md" justifyContent={"center"} h="full" w="full">
				<Spinner accessibilityLabel="Loading info" color="secondary.500" />
				<Heading color="primary.500" fontSize="md">Loading...</Heading>
			</HStack>
		</VStack>
	);

	return (
		<Provider store={store}>
			<NativeBaseProvider theme={theme}>
				{/* Only the loader will appear until the persisted state is fully loaded. */}
				{/* Previously saved state must be found beforehand. */}
				<PersistGate loading={loading} persistor={persistor}>
					<Container bg="main.900" safeArea>
						<VStack space="sm" justifyContent={"start"}>
							<Menu />
							<Content />
						</VStack>
					</Container>
				</PersistGate>
				<StatusBar style="default" backgroundColor="#69f" />
			</NativeBaseProvider>
		</Provider>
	);
};

//export default App;
