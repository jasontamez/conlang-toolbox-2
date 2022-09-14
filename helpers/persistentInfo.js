import AsyncStorage from '@react-native-async-storage/async-storage';
import localForage from 'localforage';

const makeAsyncStorageObject = (prefix, errorHandler) => {
	return {
		getItem: async (item) => {
			try {
				return await AsyncStorage.getItem(`@${prefix}/${item}`);
			} catch(e) {
				return errorHandler("getItem", prefix, e);
			}
		},
		setItem: async (item, value) => {
			try {
				return await AsyncStorage.setItem(`@${prefix}/${item}`, value);
			} catch(e) {
				return errorHandler("setItem", prefix, e);
			}
		},
		removeItem: async (item) => {
			try {
				return await AsyncStorage.removeItem(`@${prefix}/${item}`);
			} catch(e) {
				return errorHandler("removeItem", prefix, e);
			}
		},
		getAllKeys: async () => {
			const prefixString = `@${prefix}/`;
			const length = prefixString.length;
			let keys = [];
			try {
				keys = await AsyncStorage.getAllKeys();
				return keys
					.filter(key => key.indexOf(prefixString) === 0)
					.map(key => key.slice(length));
			} catch(e) {
				return errorHandler("getAllKeys", prefix, e);
			}
		}
		// multiGet?
		// multiSet?
		// mergeItem?
	};
};

const errHandle = (where, prefix, error) => {
	console.log(`ERROR in @${prefix} storage, ${where} method:`);
	console.log(error);
};

export const wgCustomStorage = makeAsyncStorageObject("WordGen", errHandle);


//export const StateStorage = localForage.createInstance({
//	name: 'Conlang Toolbox',
//	storeName: 'stateStorage',
//	version: 1,
//	description: 'Stores state information for the next time we load.'
//});

//export const LexiconStorage = localForage.createInstance({
//	name: 'Conlang Toolbox',
//	storeName: 'lexStorage',
//	version: 1,
//	description: 'Stores lexicon information.'
//});

export const OldCustomStorageWG = localForage.createInstance({
	name: 'Conlang Toolbox',
	storeName: 'customStorageWG',
	version: 1,
	description: 'Stores WordGen custom information.'
});

//export const CustomStorageWE = localForage.createInstance({
//	name: 'Conlang Toolbox',
//	storeName: 'customStorageWE',
//	version: 1,
//	description: 'Stores WordEvolve custom information.'
//});

//export const MorphoSyntaxStorage = localForage.createInstance({
//	name: 'Conlang Toolbox',
//	storeName: 'morphoSyntaxStorage',
//	version: 1,
//	description: 'Stores MorphoSyntax custom information.'
//});
