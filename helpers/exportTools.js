import {
	documentDirectory,
	//EncodingType,
	writeAsStringAsync,
	getInfoAsync,
	StorageAccessFramework
} from "expo-file-system";
import sanitize from 'sanitize-filename';

const doExport = async(filecontents, filename, encoding = "text/json") => {
	const truefilename = (sanitize(filename) || "defaultfilename.txt");
	if(StorageAccessFramework && StorageAccessFramework.requestDirectoryPermissionsAsync) {
		return newStyleExport(filecontents, truefilename, encoding);
	}
	return oldStyleExport(filecontents, truefilename);
};

const oldStyleExport = async (filecontents, filename) => {
	const file = documentDirectory + filename;
	const result = {
		fail: false,
		filename
	};
	return getInfoAsync(file).then(({exists, isDirectory}) => {
		if(isDirectory) {
			console.log("ERROR: File is a directory");
			result.fail = "Attempted to save file to a directory.";
			return result;
		} else if (exists) {
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

const newStyleExport = async (saveableString, filename, encoding) => {
	const directory = StorageAccessFramework.getUriForDirectoryInRoot(".");
	const outcome = {
		fail: false,
		filename
	};
	return StorageAccessFramework.requestDirectoryPermissionsAsync(directory).then((result) => {
		const { directoryUri, granted } = result;
		console.log("Requested: " + JSON.stringify(`${granted}: "${directoryUri}"`));
		return StorageAccessFramework.createFileAsync(directoryUri, filename, encoding);
	}).then((result) => {
		console.log("Created: " + JSON.stringify(result));
		return StorageAccessFramework.writeAsStringAsync(result, saveableString, { /* No props */ });
	}).then((...x) => {
		console.log("Written: " + JSON.stringify(x));
		return outcome;
	}).catch((...error) => {
		console.log("---ERROR");
		Object.keys(error).forEach(z => console.log(`"${z}": ${JSON.stringify(x[z])}`));
		outcome.fail = JSON.stringify(error);
		return outcome;
	});
};

export default doExport;
