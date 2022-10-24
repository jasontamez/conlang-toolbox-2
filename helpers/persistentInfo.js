import AsyncStorage from '@react-native-async-storage/async-storage';
import localForage from 'localforage';

const makeAsyncStorageObject = (prefix, errorHandler) => {
	return {
		getItem: async (item) => {
			try {
				return await AsyncStorage.getItem(`@${prefix}/${item}`);
			} catch(e) {
				errorHandler("getItem", prefix, e);
				return null;
			}
		},
		setItem: async (item, value) => {
			try {
				return await AsyncStorage.setItem(`@${prefix}/${item}`, value);
			} catch(e) {
				errorHandler("setItem", prefix, e);
				return null;
			}
		},
		removeItem: async (item) => {
			try {
				return await AsyncStorage.removeItem(`@${prefix}/${item}`);
			} catch(e) {
				errorHandler("removeItem", prefix, e);
				return null;
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
				errorHandler("getAllKeys", prefix, e);
				return null;
			}
		}
		// multiGet?
		// multiSet?
		// mergeItem?
	};
};

export const errHandle = (where, prefix, error) => {
	console.log(`ERROR in @${prefix} storage, ${where} method:`);
	console.log(error);
};

export const wgCustomStorage = makeAsyncStorageObject("WordGen", errHandle);
export const weCustomStorage = makeAsyncStorageObject("WordEvolve", errHandle);
export const lexCustomStorage = makeAsyncStorageObject("Lexicon", errHandle);


//export const StateStorage = localForage.createInstance({
//	name: 'Conlang Toolbox',
//	storeName: 'stateStorage',
//	version: 1,
//	description: 'Stores state information for the next time we load.'
//});

export const OldLexiconStorage = localForage.createInstance({
	name: 'Conlang Toolbox',
	storeName: 'lexStorage',
	version: 1,
	description: 'Stores lexicon information.'
});

export const OldCustomStorageWG = localForage.createInstance({
	name: 'Conlang Toolbox',
	storeName: 'customStorageWG',
	version: 1,
	description: 'Stores WordGen custom information.'
});

export const OldCustomStorageWE = localForage.createInstance({
	name: 'Conlang Toolbox',
	storeName: 'customStorageWE',
	version: 1,
	description: 'Stores WordEvolve custom information.'
});

//TO-DO: Mine this for old info
//export const OldMorphoSyntaxStorage = localForage.createInstance({
//	name: 'Conlang Toolbox',
//	storeName: 'morphoSyntaxStorage',
//	version: 1,
//	description: 'Stores MorphoSyntax custom information.'
//});
