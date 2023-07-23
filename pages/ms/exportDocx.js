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
import ms from './ms.json';

const doDocx = (msInfo) => {
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
					let head = ("HEADING_" + String(level));
					children.push(new Paragraph({
						text: content,
						heading: HeadingLevel[head],
						spacing
					}))
					break;
				case "Range":
					children.push(handleRange(msInfo, min, max, prop, start, end, notFilled));
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
					children.push(handleCheckboxes(msInfo, display, boxes.slice()));
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

export default doDocx;

const handleRange = (msInfo, min, max, prop, start, end, notFilled) => {
	const value = msInfo[`NUM_${prop}`] || min;
	const paragraph = [];
	const cleanText = (input) => {
		return input.replace("\u00AD", "");
	};
	if(notFilled) {
		// This is a percentage between 0 and 100
		const div = 100 / (max - min);
		const lesser = Math.floor(((value - min) * div) + 0.5);
		paragraph.push(
			new TextRun({
				text: `${lesser}% ${cleanText(start) || "[MISSING]"}`
			}),
			new TextRun({
				text: `${100 - lesser}% ${cleanText(end) || "[MISSING]"}`,
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

const handleCheckboxes = (msInfo, disp, boxes) => {
	if(!disp) {
		return new Paragraph({ text: "CHECKBOX DISPLAY ERROR", spacing });
	}
	const {
		export: expo,
		boxesPerRow: perRow = 1,
		header,
		inlineHeaders
	} = disp;
	let temp;
	const labels = disp.labels ? disp.labels.slice() : [];
	temp = expo.labelOverrideDocx ? (expo.labels || labels) : disp.rowLabels;
	const rowLabels = temp ? temp.slice() : [];
	const cells = [];
	const rows = [];
	const output = [];
	const colWidths = [];
	let count = 0;
	let colCount = 0;
	let allColumns = 6;
	for(let x = 0; x < perRow; x++) {
		colWidths.push(1);
		allColumns++;
	}
	if(labels.length > 0) {
		colWidths.push(4);
		allColumns = allColumns + 4;
	}
	let leftover = 100;
	const portion = 100 / allColumns;
	temp = [];
	boxes.forEach((box) => {
		count++;
		temp.push(box || "Error");
		if(count >= perRow) {
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
		// cell[s] [label] rowLabel
		let cols = colWidths.slice();
		leftover = 100;
		row.forEach((cell) => {
			const percent = Math.floor(cols.shift() * portion);
			leftover -= percent;
			cells.push(new TableCell({
				borders: border,
				width: {
					size: percent,
					type: WidthType.PERCENTAGE
				},
				children: [new Paragraph({
					text: msInfo[`BOOL_${cell}`] ? "X" : " "
				})]
			}));
		});
		if(labels.length > 0) {
			const percent = Math.floor(cols.shift() * portion);
			leftover -= percent;
			cells.push(
				new TableCell({
					borders: border,
					width: {
						size: percent,
						type: WidthType.PERCENTAGE
					},
					children: [new Paragraph({
						text: labels.shift() || ""
					})]
				})
			);	
		}
		cells.push(
			new TableCell({
				borders: border,
				width: {
					size: leftover,
					type: WidthType.PERCENTAGE
				},
				children: [new Paragraph({
					text: rowLabels.shift() || ""
				})]
			})
		);
		colCount = Math.max(colCount, cells.length);
		output.push(new TableRow({
			children: cells,
			cantSplit: true
		}));
		cells = [];
	});
	if(inlineHeaders) {
		leftover = 100;
		let cols = colWidths.slice();
		inlineHeaders.forEach((cell) => {
			const percent = cols.length > 0 ? Math.floor(cols.shift() * portion) : leftover;
			leftover -= percent;
			cells.push(new TableCell({
				borders: border,
				width: {
					size: percent,
					type: WidthType.PERCENTAGE
				},
				children: [new Paragraph({
					text: cell
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
