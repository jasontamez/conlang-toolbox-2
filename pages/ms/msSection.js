import { useDispatch, useSelector } from "react-redux";
import ms from './msinfo.json';
import { useParams } from 'react-router-dom';
import { Button, Box, Checkbox, HStack, Modal, ScrollView, Slider, Text as Tx, TextArea, VStack, Icon, Center } from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';

import React, { useState } from "react";
import { /*
	setKey,
	setLastSavec,
	setTitlec,
	setDescriptionc,*/
	setBool,
	setNum,
	setText
} from '../../store/morphoSyntaxSlice';
import { CircleIcon } from "../../components/icons";


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
	let keyCounter = 0;
	const getKey = (msg = "parsedJSON") => {
		return msg + String(keyCounter++);
	};
	const Text = (props) => <Tx m={0} p={0} borderWidth={0} lineHeight="md" fontSize="md" {...props} />
	// Text formatting
	const FormatText = (props) => {
		const bit = props.content;
		const forceBold = !!props.forceBold;
		let temp = [bit];
		let temp2 = [];
		// Check for BOLD text
		temp.forEach((t) => {
			if(typeof t === "string") {
				let toggle = false;
				t.split("**").forEach((x) => {
					if(x === "") {
						// Just skip.
					} else if (toggle) {
						temp2.push(<Text bold key={getKey("formattedText")}>{x}</Text>);
					} else {
						temp2.push(x);
					}
					// Change toggle
					toggle = !toggle;
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
					} else if (toggle) {
						temp2.push(<Text italic key={getKey("formattedText")}>{x}</Text>);
					} else {
						temp2.push(x);
					}
					// Change toggle
					toggle = !toggle;
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
					} else if (toggle) {
						temp2.push(<Text strikeThrough key={getKey("formattedText")}>{x}</Text>);
					} else {
						temp2.push(x);
					}
					// Change toggle
					toggle = !toggle;
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
				final = <Text bold={forceBold} key={getKey("formattedText")}>{oneLine}</Text>;
			} else {
				final = oneLine;
			}
			return final;
		}
		// Multi-lined texts
		return <Text bold={forceBold} key={getKey("formattedText")}>{temp2}</Text>;
	};
	return doc.map((bit) => {
		const tag = (bit.tag || "");
		const dispatch = useDispatch();
		const id = bit.id;
		switch(tag) {
			case "Header":
				return <Text bold fontSize={headings[bit.level || 0]} key={getKey("header")}>{bit.content}</Text>;
			case "Range":
				const what = bit.prop;
				const doSetNum = (prop, value) => {
					dispatch(setNum({prop, value}));
				};
				return (
					<HStack d="flex" w="full" alignItems="stretch" key={getKey("range")}>
						<Box mr={3} key={getKey("rangeBoxTop")}><Text key={getKey("Text")}>{bit.start}</Text></Box>
						<Slider key={getKey("Slider")} flexGrow={1} flexShrink={1} flexBasis="75%" defaultValue={synNum[what] || 0} minValue={0} maxValue={bit.max || 4} accessibilityLabel={bit.label} step={1} colorScheme="secondary" onChangeEnd={(v) => doSetNum(what, v)}>
							<Slider.Track bg="secondary.900" key={getKey("SliderTrack")}>
								{bit.spectrum ? <Slider.FilledTrack key={getKey("FilledTrack")} /> : <React.Fragment key={getKey("Fragment")}></React.Fragment>}
							</Slider.Track>
							<Slider.Thumb key={getKey("SliderThumb")} />
						</Slider>
						<Box ml={3} key={getKey("rangeBoxBottom")}><Text key={getKey("Text")}>{bit.end}</Text></Box>
					</HStack>
				);
			case "Text":
				const doSetText = (prop, value) => {
					dispatch(setText({prop, value}));
				};
				const prop = bit.prop;
				const lines = bit.rows === undefined ? 3 : (bit.rows);
				// bit.classes does not seem to be useful anymore?
				//return <TextItem prop={bit.prop} rows={bit.rows || undefined}>{bit.content || ""}</TextItem>
				return (
					<React.Fragment key={getKey("Fragment")}>
						<Text key={getKey("textInfo")}>{bit.content || ""}</Text>
						<TextArea totalLines={lines} placeholder={bit.placeholder || undefined} onBlur={(e) => doSetText(prop, e.currentTarget.value || "")} defaultValue={synText[prop] || ""} key={getKey("textBox")} />
					</React.Fragment>
				);
			case "Modal":
				//
				// BEGIN MODAL CONTENT DECLARATION
				//
				const ModalContent = (props) => {
					const content = props.content;
					if(!Array.isArray(content)) {
						return <Text key={getKey()}>Missing Content Array</Text>;
					}
					const regularMargin = 2;
					const noMargin = 0;
					const biggerMargin = 6;
					let input = content.slice();
					let output = [];
					let margin = regularMargin;
					let indent = 0;
					let unindent = 0;
					let unindentStorage = [];
					let prefix = true;
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
						} else if (bit === null) {
							// Toggle adding the circle icon before
							prefix = !prefix;
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
								<HStack space={0} m={0} mt={margin} p={0} ml={indent * 4} alignItems="flex-start" justifyContent="flex-start" key={getKey(id)}>
									{prefix ? <CircleIcon m={0} p={0} mt={1.5} mr={1} size="2xs" /> : <></>}
									<FormatText key={getKey("FormattedText")} content={bit} />
								</HStack>
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
									<VStack m={2} alignItems="center" justifyContent="space-between" key={getKey(id)}>
										{rows.map((r) => {
											return <FormatText key={getKey(id + "InnerRow")} content={r} />;
										})}
									</VStack>
								);
							};
							output.push(  // String(indent * 2)+"rem" isn't valid for some reason??
								<ScrollView horizontal mt={margin} pl={indent * 4} key={getKey(id)} bg="gray.200">
									<VStack key={getKey("TabularVStack")}>
										<HStack key={getKey("tabular")}>
											{newRows.map((line) => makeLine(line.slice()))}
										</HStack>
										{bit.final ? <FormatText key={getKey(id + "FinalRow")} content={bit.final} /> : <React.Fragment key={getKey("Fragment")}></React.Fragment>}
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
					return <VStack space={0} key={getKey("MainModal")}>{output}</VStack>;
				};
				//
				// END MODAL CONTENT DECLARATION
				//
				return (
					<React.Fragment key={getKey("Fragment")}>
						<Modal size="full" m={0} isOpen={modalState === id} onClose={() => setModal('')} key={getKey("Modal")}>
							<Modal.CloseButton />
							<Modal.Header w="full"><Center><Text>{bit.title}</Text></Center></Modal.Header>
							<Modal.Body w="5/6" mx="auto">
								<ModalContent content={bit.content} />
							</Modal.Body>
							<Modal.Footer w="full">
								<Button startIcon={<Icon as={Ionicons} name="checkmark-circle-outline" />} onPress={() => setModal('')}>Done</Button>
							</Modal.Footer>
						</Modal>
						<HStack justifyContent="flex-end" key={getKey("ModalButton")}>
							<Button size="sm" startIcon={<Icon as={Ionicons} name="information-circle-sharp" />} onPress={() => setModal(id)}>{(bit.label || "Read About It").toUpperCase()}</Button>
						</HStack>
					</React.Fragment>
				);
			case "Checkboxes":
				//return <Box><Text bold>CHECKBOX HERE</Text></Box>;
				const doSetBool = (prop, value) => {
					dispatch(setBool({prop, value}));
				};
				const disp = bit.display;
				if(!disp) {
					return <Box key={getKey()}><Text bold key={getKey()}>CHECKBOX DISPLAY ERROR</Text></Box>;
				}
				const boxes = (bit.boxes || []).slice();
				const rowDescriptions = (disp.rowDescriptions || []);
				const perRow = disp.multiBoxes;
				const labels = (disp.labels || []).slice();
				const header = disp.header;
				const inlineHeaders = disp.inlineHeaders;
				const accessibilityLabels = (disp.accessibilityLabels || []).slice();
				const stripes = disp.striped;
				// Assemble tabular section
				//
				let cols = [];
				let count = 0;
				// See if we have multiple boxes per row
				if(perRow) {
					// Make X arrays of checkboxes, where X is multiBoxes
					while(count < perRow) {
						cols.push([]);
						count++;
					}
					// Iterate over the columns until no boxes remain
					while(boxes.length > 0) {
						cols.forEach((col) => {
							const id = boxes.shift();
							const label = accessibilityLabels.shift() || "MISSING LABEL";
							col.push(id ? <Checkbox mx="auto" value={id} onChange={() => doSetBool(id, !synBool[id])} defaultIsChecked={synBool[id] || false} accessibilityLabel={label} key={getKey(id+"CheckBox")} /> : <Text key={getKey(id+"Missing")}>MISSING CHECKBOX</Text>);
						});
					}
				} else {
					let temp = [];
					boxes.forEach((box) => {
						temp.push(<Checkbox value={box} onChange={() => doSetBool(box, !synBool[id])} defaultIsChecked={synBool[box] || false} key={getKey(id + "CheckBox")}><FormatText key={getKey("FormattedText")} content={(labels.shift() || "MISSING LABEL")} /></Checkbox>);
					});
					cols.push(temp);
				}
				// Add rowDescriptions as a new column
				cols.push(rowDescriptions.map(rl => <FormatText key={getKey("FormattedText")} content={rl} />));
				// Add inlineheaders, if any, to the tops of the existing columns
				if(inlineHeaders) {
					const iH = inlineHeaders.slice()
					cols.forEach((col) => {
						const header = iH.shift();
						// Force headers to be bold
						col.unshift(<FormatText key={getKey("FormattedText")} content={(header || "MISSING INLINE HEADER")} forceBold />);
					});
				}
				// Put it all together
				let striping = stripes ? 1 : 0;
				return (
					<ScrollView horizontal key={getKey("TabularScroll")}>
						<VStack key={getKey("TabularVStack")}>
							{header ? <Box key={getKey(id+"Header")}><FormatText key={getKey("FormattedText")} content={header} forceBold /></Box> : <React.Fragment key={getKey("Fragment")}></React.Fragment>}
							<HStack key={getKey("TabularHStack")}>
								{cols.map(col => {
									// Reset to 1 before each loop.
									striping = striping && 1;
									return (
										<VStack key={getKey(id+"ColStack")}>{
											col.map(c => {
												let bgStripe = {};
												if(striping) {
													if(striping > 0) {
														// Stripe
														bgStripe.bg = "#00000066";
														striping = -1;
													} else {
														// No stripe
														striping = 1;
													}
												}
												return <Box p={1} key={getKey(id+"Col")} {...bgStripe}>{c}</Box>;
											})
										}</VStack>
									);
								})}
							</HStack>
						</VStack>
					</ScrollView>
				);
		}
		// No switch matched?
		return <Text key={getKey()}>No Switch Matched: {tag}</Text>;
	});
};

const Section = () => {
	const { msPage } = useParams();
	const pageName = "s" + msPage.slice(-2);

	return (
		<>
			<ParseMSJSON page={pageName} key={"ParsingASection" + pageName} />
		</>
	);
};

export default Section;