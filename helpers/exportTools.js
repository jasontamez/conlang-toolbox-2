import {
	documentDirectory,
	//EncodingType,
	writeAsStringAsync,
	getInfoAsync
} from "expo-file-system";
import sanitize from 'sanitize-filename';

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

export default sendFile;
