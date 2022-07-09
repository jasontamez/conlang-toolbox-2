import React from 'react';
import {
	IonLabel,
	IonPage,
	IonContent,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonList,
	IonItem,
	IonToggle,
	IonButtons,
	IonMenuButton,
	IonNote
} from '@ionic/react';
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import {
	toggleDisableConfirm,
	openModal
} from '../components/ReduxDucksFuncs';
import ChooseThemeModal from './M-Theme';
import { HStack, Text, VStack } from 'native-base';


const AppSettings = ({headerSetter}) => {
	const dispatch = useDispatch();
	const settings = useSelector((state) => state.appSettings, shallowEqual);
	headerSetter({
		title: 'App Settings',
		extraChars: false
	});
	const Item = ({label, description, element}) => {
		return (
			<HStack w="full" justifyContent="space-between" alignItems="flex-end" p={2} borderBottomWidth={1} borderBottomColor="text.500">
				<VStack>
					<Text fontSize="md">{label}</Text>
					<Text fontSize="xs">{description}</Text>
				</VStack>
				{element}
			</HStack>
		);
	};
	return (
		<VStack>
			<Item />
		</VStack>
	);
	/*return (
		<IonPage>
			<ChooseThemeModal />
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>App Settings</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonList>
					<IonItem>
						<IonLabel className="possiblyLargeLabel">
							<h2>Disable Confirmation Prompts</h2>
							<p>Eliminates yes/no prompts when deleting or overwriting data.</p>
						</IonLabel>
						<IonToggle slot="end" checked={settings.disableConfirms} onIonChange={e => dispatch(toggleDisableConfirm(e.detail.checked))} />
					</IonItem>
					<IonItem button={true} onClick={() => dispatch(openModal('AppTheme'))}>
						<IonLabel>Change Theme</IonLabel>
						<IonNote slot="end" color="primary" style={ { color: "var(--ion-color-primary"} } >{settings.theme || "Default"}</IonNote>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	);*/
};
 
export default AppSettings;
