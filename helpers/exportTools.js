import {
	documentDirectory,
	//EncodingType,
	writeAsStringAsync,
	getInfoAsync
} from "expo-file-system";
import sanitize from 'sanitize-filename';
import { StorageAccessFramework } from 'expo-file-system';

export const sendFile = async (filename, filecontents, overwriteOk = false) => {
	const truefilename = (sanitize(filename) || "defaultfilename.txt");
	const file = documentDirectory + truefilename;
	let result = {
		fail: false,
		filename: truefilename
	};
	return getInfoAsync(file).then(({exists, isDirectory}) => {
		if(isDirectory) {
			console.log("ERROR: File is a directory");
			result.fail = "Attempted to save file to a directory.";
			return result;
		} else if (exists && !overwriteOk) {
			console.log(`ERROR: Already exists`);
			result.fail = "File already exists.";
			return result;
		}
		return writeAsStringAsync(file, filecontents).then((...x) => {
			console.log(`SUCESS: ${JSON.stringify(x)}`);
			return result;
		}).catch((err) => {
			console.log(err);
			result.fail = `${err}`;
			return result;
		});
	}).catch((err) => {
		console.log(`ERROR: ${JSON.stringify(err)}`);
		result.fail = `${err}`;
		return result;
	});
};

export const doExport = async (saveableString, filename, encoding = "text/json") => {
	const directory = StorageAccessFramework.getUriForDirectoryInRoot(".");
	return StorageAccessFramework.requestDirectoryPermissionsAsync(directory).then((result) => {
		const { directoryUri, granted } = result;
		console.log("Requested: " + JSON.stringify(`${granted}: "${directoryUri}"`));
		return StorageAccessFramework.createFileAsync(directoryUri, filename, encoding);
	}).then((result) => {
		console.log("Created: " + JSON.stringify(result));
		return StorageAccessFramework.writeAsStringAsync(result, saveableString, { /* No props */ });
	}).then((...x) => {
		console.log("Written: " + JSON.stringify(x));
		return { written: true };
	}).catch((...error) => {
		console.log("---ERROR");
		Object.keys(error).forEach(z => console.log(`"${z}": ${JSON.stringify(x[z])}`));
		return { written: false, error };
	});
};


export default sendFile;
