const doXML = (msInfo) => {
	let XML =
			'<?xml version="1.0" encoding="UTF-8"?>'
			+ "\n<MorphoSyntaxObject>\n\t<Title>"
			+ msInfo.title
			+ "</Title>\n\t<Description>"
			+ msInfo.description
			+ "</Description>\n\t<Bool>\n";
	const bool = [];
	const num = [];
	const text = [];
	Object.keys(msInfo).forEach(property => {
		const [pref, prop] = property.split("");
		switch(pref) {
			case "BOOL":
				msInfo[property] && bool.push(prop);
				break;
			case "NUM":
				num.push([prop, msInfo[property]]);
				break;
			case "TEXT":
				text.push([prop, msInfo[property]]);
		}
	});
	Object.keys(bool).forEach((prop) => {
		XML += `\t\t<Item prop=\"${prop}\"></Item>\n`;
	});
	XML += "\t</Bool>\n\t<Num>\n";
	Object.keys(num).forEach(([prop, value]) => {
		XML += `\t\t<Item prop=\"${prop}\">${value}</Item>\n`;
	});
	XML += "\t</Num>\n\t<Text>\n";
	Object.keys(mst).forEach(([prop, value]) => {
		XML += `\t\t<Item prop=\"${prop}\">${value}</Item>\n`;
	});
	return XML + "\t</Text>\n</MorphoSyntaxObject>";
};

export default doXML;
