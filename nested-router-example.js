import { StatusBar } from 'expo-status-bar';
import React from 'react';

//import React from "react";
import { NativeBaseProvider, Box, Text, VStack, HStack, Button } from "native-base";

import { NativeRouter, Outlet } from "react-router-native";
import { Route, Routes } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import { Provider } from 'react-redux';
//import { PersistGate } from 'redux-persist/integration/react';

import getStoreInfo from './store/store';
import MS from "./pages/MS";
import MSSection from "./pages/ms/msSection";
import MSSettings from "./pages/ms/msSettings";

import About from "./pages/About.js";

const Main = () => {
	let navigate = useNavigate();
	const navv = (where) => {
		console.log("Going: " + where);
		navigate("/catalog/" + where, {replace: true});
	};
	return (
		<HStack bg="gray.600">
			<VStack bg="blue.900">
				<Button variant="link" colorScheme="red" onPress={() => navv("red")}>Red</Button>
				<Button variant="link" colorScheme="green" onPress={() => navv("green")}>Green</Button>
				<Button variant="link" colorScheme="purple" onPress={() => navv("purple")}>Purple</Button>
			</VStack>
			<VStack>
				<Text color="white">Header</Text>
				<Outlet />
				<Text color="white">Footer</Text>
			</VStack>
		</HStack>
	);
};

const Sub = () => {
	let navigate = useNavigate();
	return (
		<HStack>
			<Box bg="amber.500">
				<Outlet />
			</Box>
			<Box><Button colorScheme="lime" onPress={() => navigate("/catalog")}>OK</Button></Box>
		</HStack>
	);
};

const Item = () => {
	let params = useParams();
	const color = params.id;
	return <Text color="white">This is {color} content.</Text>;
};

//export default function App() { return (
function Testo() {
	return (
		<NativeBaseProvider>
			<Box mt="64" color="white" safeArea>
				<NativeRouter>
					<Routes>
						<Route path="/welcome" element={<Box><Text color="white">Welcome</Text></Box>} />
						<Route path="*" element={<Main />}>
							<Route path="catalog/*" element={<Sub />}>
								<Route path=":id" element={<Item />} />
								<Route index element={<Text color="white">Use the left nav to selet a catalog item</Text>} />
							</Route>
							<Route index element={<Text color="red.300">This is home.</Text>} />
						</Route>
					</Routes>
				</NativeRouter>
			</Box>
			<StatusBar style="auto" />
		</NativeBaseProvider>
	);
};

const App = () => {
	const {store, persistor} = getStoreInfo();
	return (
		<Provider store={store}>
		<NativeBaseProvider>
			<Box safeArea>
				<NativeRouter>
					<VStack d="flex" h="full" alignItems="stretch" justifyContent="space-between">
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
					</VStack>
				</NativeRouter>
			</Box>
		</NativeBaseProvider>
		</Provider>
	);
};

// Need to change "default" links to "/" indexes in all pages

export default App;
