import { useDispatch, useSelector } from "react-redux";
import ms from './msinfo.json';
import { useParams } from 'react-router-dom';
import { Button, Box, Checkbox, HStack, Modal, ScrollView, Slider, Text, TextArea, VStack, Icon, Center } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useState } from "react";
import { /*
	setKey,
	setLastSavec,
	setTitlec,
	setDescriptionc,*/
	setBool,
	setNum,
	setText
} from '../../store/morphoSyntaxSlice';


const ParseMSJSON = (props) => {
	const [modalState, setModal] = useState('');
	const synBool = useSelector((state) => state.morphoSyntax.bool);
	const synNum = useSelector((state) => state.morphoSyntax.num);
	const synText = useSelector((state) => state.morphoSyntax.text);
	const { page } = props;
	const doc = ms[page];
	const headings = {
		0: "2xl",
		1: "xl",
		2: "lg",
		3: "md"
	};
	// Text formatting
	const formatText = (bit, forceBold=false) => {
		let temp = [bit];
		let temp2 = [];
		// Check for BOLD text
		temp.forEach((t) => {
			if(typeof t === "string") {
				let toggle = false;
				t.split("**").forEach((x) => {
					if(x === "") {
						// Just skip.
						return;
					} else if (toggle) {
						temp2.push(<Text bold>{x}</Text>);
						toggle = false;
					} else {
						temp2.push(x);
						toggle = true;
					}
				});
			} else {
				temp2.push(t);
			}
		});
		temp = [...temp2];
		temp2 = [];
		// Check for ITALIC text
		temp.forEach((t) => {
			if(typeof t === "string") {
				let toggle = false;
				t.split("//").forEach((x) => {
					if(x === "") {
						// Just skip.
						return;
					} else if (toggle) {
						temp2.push(<Text italic>{x}</Text>);
						toggle = false;
					} else {
						temp2.push(x);
						toggle = true;
					}
				});
			} else {
				temp2.push(t);
			}
		});
		temp = [...temp2];
		temp2 = [];
		// Check for STRIKE-THROUGH text
		temp.forEach((t) => {
			if(typeof t === "string") {
				let toggle = false;
				t.split("--").forEach((x) => {
					if(x === "") {
						// Just skip.
						return;
					} else if (toggle) {
						temp2.push(<Text strikeThrough>{x}</Text>);
						toggle = false;
					} else {
						temp2.push(x);
						toggle = true;
					}
				});
			} else {
				temp2.push(t);
			}
		});
		// If only one line of text, present it simply
		if(temp2.length === 1) {
			const oneLine = temp2[0];
			let final;
			if(typeof oneLine === "string") {
				final = <Text bold={forceBold}>{oneLine}</Text>;
			} else {
				final = oneLine;
			}
			return final;
		}
		// Multi-lined texts
		return <Text bold={forceBold}>{temp2}</Text>;
	};
	return doc.map((bit) => {
		const tag = (bit.tag || "");
		const dispatch = useDispatch();
		switch(tag) {
			case "Header":
				return <Text bold fontSize={headings[bit.level || 0]}>{bit.content}</Text>;
			case "Range":
				const what = bit.prop;
				const doSetNum = (prop, value) => {
					dispatch(setNum({prop, value}));
				};
				return (
					<HStack d="flex" w="full" alignItems="stretch">
						<Box mr={3}><Text>{bit.start}</Text></Box>
						<Slider flexGrow={1} flexShrink={1} flexBasis="75%" defaultValue={synNum[what] || 0} minValue={0} maxValue={bit.max || 4} accessibilityLabel={bit.label} step={1} colorScheme="secondary" onChangeEnd={(v) => doSetNum(what, v)}>
							<Slider.Track bg="secondary.900">
								{bit.spectrum ? <Slider.FilledTrack /> : <></>}
							</Slider.Track>
							<Slider.Thumb />
						</Slider>
						<Box ml={3}><Text>{bit.end}</Text></Box>
					</HStack>
				);
			case "Text":
				const doSetText = (prop, value) => {
					dispatch(setText({prop, value}));
				};
				const lines = bit.rows === undefined ? 3 : (bit.rows);
				// bit.classes does not seem to be useful anymore?
				//return <TextItem prop={bit.prop} rows={bit.rows || undefined}>{bit.content || ""}</TextItem>
				return (
					<>
						<Text>{bit.content || ""}</Text>
						<TextArea totalLines={lines} placeholder={bit.placeholder || undefined} onBlur={(e) => doSetText(what, e.currentTarget.value || "")} defaultValue={synText[what] || ""} />
					</>
				);
			case "Modal":
				//
				// BEGIN MODAL CONTENT DECLARATION
				//
				const ModalContent = (props) => {
					const content = props.content;
					if(!Array.isArray(content)) {
						return <Text>Missing Content Array</Text>;
					}
					const regularMargin = 2;
					const noMargin = 0;
					const biggerMargin = 4;
					let input = content.slice();
					let output = [];
					let margin = regularMargin;
					let indent = 0;
					let unindent = 0;
					let unindentStorage = [];
					//
					// BEGIN WHILE LOOP
					//
					while(input.length > 0) {
						let bit = input.shift();
						// Begin tree
						if(bit === true) {
							// Next line needs a bigger top margin
							margin = biggerMargin;
						} else if (bit === false) {
							// Next line needs zero top margin
							margin = noMargin;
						} else if (Array.isArray(bit)) {
							// The next section is indented.
							//
							// increment indentation
							indent++;
							// isolate next section
							let newContent = [...bit];
							// check if we're currently indented
							if(unindent > 0) {
								// We are.
								// Store the current value, but decremented by 1 since it won't see the Cleanup Stage
								unindentStorage.push(unindent - 1);
							}
							// Make the new unindent value, but incremented by 1 since it WILL see the Cleanup Stage
							unindent = newContent.length + 1;
							// Add new content to the input
							input.unshift(...newContent);
						} else if (typeof bit === "string") {
							// Make a simple text
							output.push(  // String(indent * 2)+"rem" isn't valid for some reason??
								<Box mt={margin} pl={indent}>
									{formatText(bit)}
								</Box>
							);
							// Reset margin, if needed
							margin = regularMargin;
						} else {
							// some type of object - currently only have the tabular object so I won't bother checking
							// Reorganize row info
							let newRows = [];
							let oldRows = bit.rows.slice().map((orig) => orig.slice());
							let flag = true;
							while(flag) {
								// Put the first bit of each row together
								const newRow = oldRows.map((row) => {
									if(row.length <= 1) {
										flag = false;
									}
									return row.shift();
								});
								newRows.push(newRow);
							}
							// Make a vertical stack of all row elements
							const makeLine = (rows) => {
								return (
									<VStack m={2} alignItems="center" justifyContent="space-between">
										{rows.map((r) => {
											return <Text>{r}</Text>;
										})}
									</VStack>
								);
							};
							output.push(  // String(indent * 2)+"rem" isn't valid for some reason??
								<ScrollView horizontal mt={margin} pl={indent}>
									<VStack>
										<HStack>
											{newRows.map((line) => makeLine(line.slice()))}
										</HStack>
										{bit.final ? <Text>{bit.final}</Text> : []}
									</VStack>
								</ScrollView>
							);
							// Reset margin, if needed
							margin = regularMargin;
						}
						//
						// Cleanup Stage
						//
						// Check to if we may need to unindent
						if(unindent > 0) {
							// Decrement the counter
							unindent--;
							// See if we've reached the end
							if(unindent === 0) {
								// We have. Reduce the indentation level by one.
								indent--;
								// Are there other indentations we're maintaining?
								// Cycle through them, if needed.
								while(unindentStorage.length > 0) {
									let next = unindentStorage.pop();
									if(next === 0) {
										// Another 0? Decrement indentation again.
										indent--;
									} else {
										// New non-zero indentation counter found
										unindent = next;
										// Exit this loop.
										break;
									}
								}
							}
						}
					}
					//
					// END WHILE LOOP
					//
					return <>{output}</>;
				};
				//
				// END MODAL CONTENT DECLARATION
				//
				const id = bit.id;
				return (
					<>
						<Modal size="5/6" m="auto" isOpen={modalState === id} onClose={() => setModal('')} bg="gray.50">
							<Modal.CloseButton />
							<Modal.Header w="full"><Center><Text>{bit.title}</Text></Center></Modal.Header>
							<Modal.Body>
								<VStack>
									<ModalContent content={bit.content} />
								</VStack>
							</Modal.Body>
							<Modal.Footer w="full">
								<Button startIcon={<Icon as={Ionicons} name="checkmark-circle-outline" />} onPress={() => setModal('')}>Done</Button>
							</Modal.Footer>
						</Modal>
						<HStack justifyContent="flex-end">
							<Button size="md" startIcon={<Icon as={Ionicons} name="information-circle-sharp" />} onPress={() => setModal(id)}>{bit.label || "Read About It"}</Button>
						</HStack>
					</>
				);
			case "Checkboxes":
				//return <Box><Text bold>CHECKBOX HERE</Text></Box>;
				const doSetBool = (prop, value) => {
					dispatch(setBool({prop, value}));
				};
				const disp = bit.display;
				if(!disp) {
					return <Box><Text bold>CHECKBOX DISPLAY ERROR</Text></Box>;
				}
				const boxes = (bit.boxes || []).slice();
				const rowLabels = (disp.rowLabels || []);
				const perRow = disp.boxesPerRow;
				const labels = (disp.labels || []);
				const header = disp.header;
				const inlineHeaders = disp.inlineHeaders;
				// Assemble tabular section
				//
				// Start with the checkboxes
				let cols = [];
				let count = 0;
				// Make X arrays of checkboxes, where X is boxesPerRow
				while(count < perRow) {
					cols.push([]);
					count++;
				}
				// Iterate over the columns until no boxes remain
				while(boxes.length > 0) {
					cols.forEach((col) => {
						const id = boxes.shift();
						col.push(id ? <Checkbox value={id} onChange={(val) => doSetBool(what, val)} defaultIsChecked={synBool[what] || false} /> : <Text>MISSING CHECKBOX</Text>);
					});
				}
				// If labels exist, add them as a new column
				if(labels.length > 0) {
					cols.push(labels.map((l) => formatText(l)));
				}
				// Add rowlabels as a new column
				cols.push(rowLabels.map(rl => formatText(rl)));
				// Add inlineheaders, if any, to the tops of the existing columns
				if(inlineHeaders) {
					const iH = inlineHeaders.slice()
					cols.forEach((col) => {
						const header = iH.shift();
						// Force headers to be bold
						col.unshift(formatText(header || "MISSING INLINE HEADER", true));
					});
				}
				// Put it all together
				return (
					<ScrollView horizontal>
						<VStack>
							{header ? <Box>{formatText(header, true)}</Box> : <Text fontSize={1}></Text>}
							<HStack>
								{cols.map(col => <VStack>{col.map(c => <Box>{c}</Box>)}</VStack>)}
							</HStack>
						</VStack>
					</ScrollView>
				);
		}
		// No switch matched?
		return <Text>No Switch Matched: {tag}</Text>;
	});
};

const Section = () => {
	const { msPage } = useParams();
	const pageName = "s" + msPage.slice(-2);

	return (
		<>
			<ParseMSJSON page={pageName} />
		</>
	);
};

export default Section;