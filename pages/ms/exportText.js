import ms from './msinfo.json';

// TO-DO: Adapt other export functions
// TO-DO: Send export info off to actually be exported

// doText({user data}, BOOLEAN: we want MarkDown, not plaintext)
const doText = (msInfo, md = false) => {
	const lines = [];
	const sections = ms.sections;
	sections.forEach((sec) => {
		const section = (ms[sec]);
		section.forEach((item) => {
			const {
				tag,
				min = 0,
				max = 4,
				prop,
				start,
				end,
				notFilled,
				content = "",
				level = 4,
				display: disp,
				boxes
			} = item;
			let info;
			switch(tag) {
				case "Header":
					if(md) {
						info = " " + content;
						for(let c = level; c > 0; c--) {
							info = "#" + info;
						}
						lines.push(info);
					} else {
						lines.push(content);
					}
					break;
				case "Range":
					lines.push(handleRange(msInfo, md, min, max, prop, start, end, notFilled));
					break;
				case "Text":
					if(md) {
						let txt = "";
						const textAsArray = (msInfo[`TEXT_${prop}`] || "[NO TEXT ENTERED]").split(/\n\n+/);
						textAsArray.forEach((textLine, i) => {
							if(i > 0) {
								txt += "\n\n"; // inserts paragraph break
							}
							textLine.split(/\n/).forEach((line, ind) => {
								if(ind > 0) {
									txt += "  \n"; // inserts line break
								}
								txt += line.trim();
							});
						});
						lines.push(content || "[TEXT PROMPT]", txt);
					} else {
						lines.push(content || "[TEXT PROMPT]", msInfo[`TEXT_${prop}`] || "[NO TEXT ENTERED]");
					}
					break;
				case "Checkboxes":
					//const value = bool[item.prop as keyof MorphoSyntaxBoolObject];
					const expo = disp.export;
					const output = expo.output;
					if(output) {
						const map = output.map((bit) => bit.map((b) => {
							if(typeof b === "string") {
								return b;
							}
							const found = [];
							b.forEach((pair) => {
								if(msInfo[`BOOL_${pair[0]}`]) {
									found.push(pair[1]);
								}
							});
							if (found.length === 0) {
								return md ? "*[NONE SELECTED]*" : "[NONE SELECTED]";
							} else if (found.length === 1) {
								return md ? `*${found[0]}*` : found[0];
							} else if (found.length === 2) {
								return md ? `*${found[0]}* and *${found[1]}*` : `${found[0]} and ${found[1]}`;
							}
							const final = found.pop();
							if(md) {
								return `*${found.join("*, *")}*, and *${final}*`;
							}
							return `${found.join(", ")}, and ${final}`;
						}).join(""));
						lines.push(map.join("\n"));
					} else {
						const {
							labels: dLabels,
							rowLabels
						} = disp;
						const {
							title = "",
							labels: eLabels
						} = expo;
						const boxSlices = boxes.slice();
						const labels = (eLabels || dLabels || rowLabels || boxSlices).slice();
						let result = "";
						const found = [];
						while(boxSlices.length > 0) {
							const box = boxSlices.shift();
							const label = labels.shift();
							if(msInfo[`BOOL_${box}`]) {
								found.push(label || "[ERROR]");
							}
						}
						if (found.length === 0) {
							result = md ? "*[NONE SELECTED]*" : "[NONE SELECTED]";
						} else if (found.length === 1) {
							result = md ? `*${found[0]}*` : found[0];
						} else if (found.length === 2) {
							const final = found.pop();
							if(md) {
								result = `*${found.join("*, *")}*, and *${final}*`;
							} else {
								result = `${found.join(", ")}, and ${final}`;
							}
						}
						lines.push(`${title} ${result}`);
					}
			}
		});
	});
	const {
		title,
		description = "[NO DESCRIPTION PROVIDED]"
	} = msInfo;
	const em = md ? "*" : "";
	const output = `${md ? "# " : ""}${title}\n\n${em}${description}${em}\n\n${lines.join("\n\n")}\n`;
	return output;
};

export default doText;

const handleRange = (msInfo, md, min, max, prop, start, end, notFilled) => {
	const value = msInfo[`NUM_${prop}`] || min;
	const cleanText = (input) => {
		return input.replace("\u00AD", "");
	};
	if(notFilled) {
		// This is a percentage between 0 and 100
		const div = 100 / (max - min);
		const lesser = Math.floor(((value - min) * div) + 0.5);
		if(md) {
			return `**${lesser}%** ${cleanText(start || "[MISSING]")}  \n**${100 - lesser}% ${cleanText(end || "[MISSING]")}`;
		}
		return `${lesser}% ${cleanText(start || "[MISSING]")}  \n${100 - lesser}% ${cleanText(end || "[MISSING]")}`;
	}
	// This is a spectrum between two endpoints
	const beginning = cleanText(start || "[MISSING]");
	const ending = cleanText(end || "[MISSING]");
	let rangefinder = [];
	for(let counter = min; counter <= max; counter++) {
		if(counter === value) {
			rangefinder.push(md ? `**(${counter})**` : `(${counter})`);
		} else {
			rangefinder.push(String(counter));
		}
	}
	if(md) {
		return `**${beginning}** ${rangefinder.join(' ')} **${ending}**`;
	}
	return `${beginning}${rangefinder} ${ending}`;
};
