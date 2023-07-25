import {
	BorderStyle,
	Document,
	HeadingLevel,
	Packer,
	Paragraph,
	SectionType,
	Table,
	TableCell,
	TableRow,
	TextRun,
	WidthType
} from "docx";
import ms from './msinfo.json';

export const doJSON = async (info) => JSON.stringify(info);

// doText({user data}, BOOLEAN: we want MarkDown, not plaintext)
export const doText = async (msInfo, md = false) => {
	const {
		title,
		description
	} = msInfo;
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
						// Start with one extra level, since the document title will have rank 1
						info = "# " + content;
						for(let c = level; c > 0; c--) {
							info = "#" + info;
						}
						lines.push(info);
					} else {
						lines.push(content);
					}
					break;
				case "Range":
					lines.push(handleTextRange(msInfo, md, min, max, prop, start, end, notFilled));
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
							rowDescriptions
						} = disp;
						const {
							title = "",
							labels: eLabels
						} = expo;
						const boxSlices = boxes.slice();
						const labels = (eLabels || dLabels || rowDescriptions || boxSlices).slice();
						let result = "";
						const found = [];
						while(boxSlices.length > 0) {
							const box = boxSlices.shift();
							const label = labels.shift();
							console.log(`Checking BOOL_${box}: ${msInfo[`BOOL_${box}`]}`)
							if(msInfo[`BOOL_${box}`]) {
								found.push(label || "[ERROR]");
							}
						}
						if (found.length === 0) {
							result = md ? "*[NONE SELECTED]*" : "[NONE SELECTED]";
						} else if (found.length === 1) {
							result = md ? `*${found[0]}*` : found[0];
						} else if (found.length === 2) {
							if(md) {
								result = `*${found[0]}* and *${found[1]}*`;
							} else {
								result = `${found[0]} and ${found[1]}`;
							}
						} else {
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
	const em = md ? "*" : "";
	const output = `${md ? "# " : ""}${title}\n\n${em}${description || "[NO DESCRIPTION PROVIDED]"}${em}\n\n${lines.join("\n\n")}\n`;
	return output;
};

export const doDocx = async (msInfo) => {
	const msSections = ms.sections;
	const sections = [];
	const spacing = {
		before: 200
	}
	msSections.forEach((sec) => {
		const msSection = (ms[sec]);
		const children = [];
		msSection.forEach((item) => {
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
				display,
				boxes = []
			} = item;
			switch(tag) {
				case "Header":
					children.push(new Paragraph({
						text: content,
						heading: HeadingLevel[`HEADING_${level}`],
						spacing
					}))
					break;
				case "Range":
					children.push(handleDocxRange(msInfo, min, max, prop, start, end, notFilled, spacing));
					break;
				case "Text":
					children.push(new Paragraph({
						text: (content || "[TEXT PROMPT]"),
						spacing
					}))
					const textArray = (msInfo[`TEXT_${prop}`] || "[NO TEXT ENTERED]").split(/\n\n+/);
					textArray.forEach((txt) => {
						let run = [];
						run.push(...txt.split(/\n/).map((text, i) => {
							return new TextRun(
								(i > 0) ? {
									text: tag,
									break: 1
								} : {
									text
								}
							);
						}));
						children.push(new Paragraph({
							children: run,
							spacing
						}));
					});
					break;
				case "Checkboxes":
					children.push(handleDocxCheckboxes(msInfo, display, boxes.slice(), spacing));
			}
		});
		sections.push({
			properties: { type: SectionType.CONTINUOUS },
			children
		});
	});
	const doc = new Document({
		creator: "Conlang Toolbox",
		description: "A MorphoSyntax document exported from Conlang Toolbox.",
		title: msInfo.title + " - MorphoSyntax Document",
		sections
	});
	return Packer.toBase64String(doc);
};

const handleDocxRange = (msInfo, min, max, prop, start, end, notFilled, spacing) => {
	const value = msInfo[`NUM_${prop}`] || min;
	const paragraph = [];
	const cleanText = (input) => {
		return input.replace(/\u00AD/g, "");
	};
	if(notFilled) {
		// This is a percentage between 0 and 100
		const div = 100 / (max - min);
		const lesser = Math.floor(((value - min) * div) + 0.5);
		paragraph.push(
			new TextRun({
				text: `${100 - lesser}% ${cleanText(start) || "[MISSING]"}`
			}),
			new TextRun({
				text: `${lesser}% ${cleanText(end) || "[MISSING]"}`,
				break: 1
			})
		);
	} else {
		// This is a spectrum between two endpoints
		paragraph.push(new TextRun({
			text: cleanText(start) || "[MISSING]",
			bold: true
		}));
		for(let counter = min; counter <= max; counter++) {
			if(counter === value) {
				paragraph.push(
					new TextRun({
						text: " "
					}),
					new TextRun({
						text: `(${counter})`,
						bold: true
					})
				);
			} else {
				paragraph.push(new TextRun({
					text: ` ${counter}`
				}));
			}
		}
		paragraph.push(new TextRun({
			text: " " + (cleanText(end) || "[MISSING]"),
			bold: true
		}));
	}
	return new Paragraph({
		children: paragraph,
		spacing
	});
};

const handleDocxCheckboxes = (msInfo, disp, boxes, spacing) => {
	if(!disp) {
		return new Paragraph({ text: "CHECKBOX DISPLAY ERROR", spacing });
	}
	const cleanText = (input) => {
		return input.replace(/\u00AD/g, "");
	};
	const {
		export: expo,
		multiBoxes: boxesPerRow = 1,
		header,
		inlineHeaders,
		rowDescriptions
	} = disp;
	let temp;
	const labels = disp.labels ? disp.labels.map(label => cleanText(label)) : [];
	const labelsForRow = (
		expo.labelOverrideDocx ? (expo.labels || labels).slice() : rowDescriptions && rowDescriptions.map(label => cleanText(label))
	) || [];
	const rows = [];
	const output = [];
	const colWidths = [];
	let count = 0;
	let colCount = 0;
	let allColumns = 0;
	// Determine ratio of columns to each other
	for(let x = 0; x < boxesPerRow; x++) {
		colWidths.push(1);
		allColumns++;
	}
	if(labels.length > 0) {
		// Labels are longer, and should have 4x the width of a normal column
		colWidths.push(4);
		allColumns = allColumns + 4;
	}
	if(labelsForRow.length > 0) {
		// These labels are even longer, and should have 6x the width of a normal column
		colWidths.push(6);
		allColumns = allColumns + 6;
	}
	// Recalculate column widths
	const singleColumnPercentage = 100 / allColumns;
	temp = 100;
	const columnPercentages = colWidths.map(col => {
		const percentage = Math.floor(col * singleColumnPercentage);
		temp -= percentage;
		return percentage;
	});
	if(temp !== 0) {
		const last = columnPercentages.pop();
		columnPercentages.push(last + temp);
	}
	temp = [];
	boxes.forEach((box) => {
		count++;
		temp.push(box || "Error");
		if(count >= boxesPerRow) {
			count = 0;
			rows.push(temp);
			temp = [];
		}
	});
	const border = {
		style: BorderStyle.SINGLE,
		size: 1,
		color: "000000"
	}
	rows.forEach((row) => {
		const cells = [];
		let cols = columnPercentages.slice();
		row.forEach((cell) => {
			cells.push(new TableCell({
				borders: border,
				width: {
					size: cols.shift(),
					type: WidthType.PERCENTAGE
				},
				children: [new Paragraph({
					text: msInfo[`BOOL_${cell}`] ? "X" : " "
				})]
			}));
		});
		if(labels.length > 0) {
			cells.push(
				new TableCell({
					borders: border,
					width: {
						size: cols.shift(),
						type: WidthType.PERCENTAGE
					},
					children: [new Paragraph({
						text: labels.shift() || ""
					})]
				})
			);	
		}
		if (labelsForRow.length > 0) {
			cells.push(
				new TableCell({
					borders: border,
					width: {
						size: cols.shift(),
						type: WidthType.PERCENTAGE
					},
					children: [new Paragraph({
						text: labelsForRow.shift() || ""
					})]
				})
			);
		}
		colCount = Math.max(colCount, cells.length);
		output.push(new TableRow({
			children: cells,
			cantSplit: true
		}));
	});
	if(inlineHeaders) {
		const cells = [];
		let cols = columnPercentages.slice();
		inlineHeaders.forEach((cell) => {
			cells.push(new TableCell({
				borders: border,
				width: {
					size: cols.shift(),
					type: WidthType.PERCENTAGE
				},
				children: [new Paragraph({
					text: cleanText(cell)
				})]
			}));
			colCount = Math.max(colCount, cells.length);
		});
		output.unshift(new TableRow({
			children: cells,
			cantSplit: true,
			tableHeader: true
		}));
	}
	if(header) {
		// prepend one header using colCount
		output.unshift(new TableRow({
			tableHeader: true,
			cantSplit: true,
			children: [new TableCell({
				children: [new Paragraph({
					text: header
				})],
				width: {
					size: 100,
					type: WidthType.PERCENTAGE
				},
				borders: border,
				columnSpan: colCount
			})]
		}));
	}
	return new Table({
		rows: output,
		margins: {
			left: 75,
			right: 75,
			top: 50,
			bottom: 25
		},
		width: {
			size: 100,
			type: WidthType.PERCENTAGE
		}
	});
};

const handleTextRange = (msInfo, md, min, max, prop, start, end, notFilled) => {
	const value = msInfo[`NUM_${prop}`] || min;
	const cleanText = (input) => {
		return input.replace(/\u00AD/g, "");
	};
	if(notFilled) {
		// This is a percentage between 0 and 100
		const div = 100 / (max - min);
		const lesser = Math.floor(((value - min) * div) + 0.5);
		if(md) {
			return `**${100 - lesser}%** ${cleanText(start || "[MISSING]")}  \n**${lesser}%** ${cleanText(end || "[MISSING]")}`;
		}
		return `${100 - lesser}% ${cleanText(start || "[MISSING]")}  \n${lesser}% ${cleanText(end || "[MISSING]")}`;
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
