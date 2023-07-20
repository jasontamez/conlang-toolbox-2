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
		success: false,
		fail: false,
		exists: false,
		filename: truefilename
	};
	return getInfoAsync(file).then(({exists, isDirectory}) => {
		if(isDirectory) {
			console.log("ERROR: File is a directory");
			result.fail = "Attempted to save file to a directory.";
			return result;
		} else if (exists && !overwriteOk) {
			result.exists = true;
			return result;
		}
		return writeAsStringAsync(file, filecontents).then((...x) => {
			console.log(x);
			result.success = true;
			return result;
		}).catch((err) => {
			console.log(err);
			result.fail = `${err}`;
			return result;
		});
	}).catch((err) => {
		console.log(err);
		result.fail = `${err}`;
		return result;
	});
};

export const doExportInfo = (filename, saveableObject, doToast, toast) => {
	const directory = StorageAccessFramework.getUriForDirectoryInRoot(".");
	StorageAccessFramework.requestDirectoryPermissionsAsync(directory).then((result) => {
		const { directoryUri, granted } = result;
		doToast({
			toast,
			msg: "Requested: " + JSON.stringify(`${granted}: "${directoryUri}"`),
			position: "top",
			duration: 10000
		});
		console.log("Requested: " + JSON.stringify(`${granted}: "${directoryUri}"`));
		return StorageAccessFramework.createFileAsync(directoryUri, `${filename}.json`, "text/json");
	}).then((result) => {
		doToast({
			toast,
			msg: "Created: " + JSON.stringify(result),
			position: "top",
			duration: 10000
		});
		console.log("Created: " + JSON.stringify(result));
		return StorageAccessFramework.writeAsStringAsync(result, JSON.stringify(saveableObject), {});
	}).then((...x) => {
		doToast({
			toast,
			msg: "Written: " + JSON.stringify(x),
			position: "top",
			duration: 10000
		});
		console.log("Written: " + JSON.stringify(x));
	}).catch((x) => {
		doToast({
			toast,
			msg: "Error encountered",
			position: "top",
			duration: 10000
		});
		console.log("---ERROR");
		Object.keys(x).forEach(z => console.log(`"${z}": ${JSON.stringify(x[z])}`));
	});
};


export default sendFile;
