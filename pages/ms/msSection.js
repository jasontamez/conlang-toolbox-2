import { useDispatch } from "react-redux";
import ms from './ms.json';
import { useParams } from 'react-router-dom';
import { Checkbox, HStack, Modal, ScrollView, Slider, Text, TextArea, VStack } from 'native-base';
import {
	setSyntaxBool,
	setSyntaxNum,
	setSyntaxText,
	setSyntaxState
} from '../../store/dFuncs';

const parseMSJSON = (page) => {
	const doc = ms[page];
	const headings = {
		0: "1rem",
		1: "1.4rem",
		2: "1.25rem",
		3: "1.1rem"
	};
	// Text formatting
	const formatText = (bit, makeBold=false) => {
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
			}
		});
		// If only one line of text, present it simply
		if(temp2.length === 1) {
			const oneLine = temp2[0];
			let final;
			if(typeof oneLine === "string") {
				final = <Text bold={makeBold}>{oneLine}</Text>;
			} else {
				final = oneLine;
			}
			return final;
		}
		// Multi-lined texts
		return <Text bold={makeBold}>{...temp2}</Text>;
	};
	return doc.map((bit) => {
		const tag = (bit.tag || "");
		const dispatch = useDispatch();
		switch(tag) {
			case "Header":
				return <Text bold fontSize={headings[bit.level || 0]}>{bit.content}</Text>;
			case "Range":
				const synNum = useSelector((state) => state.morphoSyntaxInfo.num)
				const what = bit.prop;
				const setNum = (what, value) => {
					dispatch(setSyntaxNum(what, value));
				};
				return (
					<HStack d="flex" w="100%" alignItems="stretch" justifyContent="space-between">
						<Text>{bit.start}</Text>
						<Slider flexGrow={1} flexBasis="75%" defaultValue={synNum[what] || 0} minValue={0} maxValue={bit.max || 4} accessibilityLabel={bit.label} step={1} colorScheme="secondary" onChangeEnd={(v) => setNum(what, v)}>
							<Slider.Track bg="secondary.900">
								{bit.spectrum ? <Slider.FilledTrack /> : <></>}
							</Slider.Track>
							<Slider.Thumb />
						</Slider>
						<Text>{bit.end}</Text>
					</HStack>
				);
			case "Text":
				const synText = useSelector((state) => state.morphoSyntaxInfo.text)
				const setText = (what, value) => {
					dispatch(setSyntaxText(what, value));
				};
				const lines = bit.rows === undefined ? 3 : (bit.rows);
				// bit.classes does not seem to be useful anymore?
				//return <TextItem prop={bit.prop} rows={bit.rows || undefined}>{bit.content || ""}</TextItem>
				return (
					<>
						<Text>{bit.content || ""}</Text>
						<TextArea totalLines={lines} placeholder={bit.placeholder || undefined} onBlur={(e) => setText(what, e.currentTarget.value || "")} defaultValue={synText[what] || ""} />
					</>
				);
			case "Modal":
				const synState = useSelector((state) => state.morphoSyntaxModalState);
				//
				// BEGIN MODAL CONTENT DECLARATION
				//
				const ModalContent = (content) => {
					const regularMargin = 2;
					const noMargin = 0;
					const biggerMargin = 4;
					let input = [...content];
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
							output.push(
								<Box mt={margin} pl={String(indent * 2)+"rem"}>
									{formatText(bit)}
								</Box>
							);
							// Reset margin, if needed
							margin = regularMargin;
						} else {
							// some type of object - currently only have the tabular object so I won't bother checking
							// Make a vertical stack of all row elements
							const makeLine = (rows) => {
								return (
									<VStack m={2} alignItems="center" justifyContent="space-between">
										{rows.map((r) => {
											return <Text>{r.unshift()}</Text>;
										})}
									</VStack>
								);
							};
							output.push(
								<ScrollView horizontal mt={margin} pl={String(indent * 2)+"rem"}>
									<VStack>
										<HStack>
											{data.map(() => makeLine([...bit.rows]))}
										</HStack>
										{bit.final ? <Text>{bit.final}</Text> : ""}
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
					return <>{...output}</>;
				};
				//
				// END MODAL CONTENT DECLARATION
				//
				return (
					<>
						<Modal size="5/6" m="auto" isOpen={synState[id] !== undefined} onClose={() => dispatch(setSyntaxState(id, false))}>
							<Modal.CloseButton />
							<Modal.Header><Text>{bit.title}</Text></Modal.Header>
							<Modal.Body>
								<VStack>
									<ModalContent content={bit.content} />
								</VStack>
							</Modal.Body>
							<Modal.Footer>
								<Button startIcon={<Icon as={Ionicons} name="checkmark-circle-outline" />}>Done</Button>
							</Modal.Footer>
						</Modal>
						<Button startIcon={<Icon as={Ionicons} name="information-circle-sharp" />} onPress={() => dispatch(setSyntaxState(id, true))}>{bit.label || "Read About It"}</Button>
					</>
				);
			case "Checkboxes":
				const synBool = useSelector((state) => state.morphoSyntaxInfo.bool);
				const setBool = (what, value) => {
					dispatch(setSyntaxBool(what, value));
				};				const disp = bit.display;
				if(!disp) {
					return <Box><Text bold>CHECKBOX DISPLAY ERROR</Text></Box>;
				}
				const boxes = (bit.boxes || []).slice();
				const rowLabels = (disp.rowLabels || []).slice();
				const perRow = disp.boxesPerRow;
				const labels = (disp.labels || []).slice();
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
						col.push(id ? <Checkbox value={id} onChange={(val) => setBool(what, val)} defaultIsChecked={synBool[what] || false} /> : <Text>ERROR</Text>);
					});
				}
				// If labels exist, add them as a new column
				if(labels) {
					cols.push(labels.map((l) => formatText(l)));
				}
				// Add rowlabels
				cols.push(rowLabels.map(rl => formatText(rl)));
				// Add inlineheaders, if any
				if(inlineHeaders) {
					cols.forEach(col => {
						const header = inlineHeaders.shift() || "ERROR";
						// Force headers to be bold
						col.unshift(formatText(header, true));
					});
				}
				// Put it all together
				return (
					<ScrollView horizontal>
						<VStack>
							{header ? <Box>{formatText(header, true)}</Box> : ""}
							<HStack>
								{cols.map(col => <VStack>{col.map(c => <Box>{c}</Box>)}</VStack>)}
							</HStack>
						</VStack>
					</ScrollView>
				);
		}
		// No switch matched?
		return "";
	});
};

const Section = () => {
	const { msPage } = useParams();
	const pageName = "s" + msPage.slice(-2);

	return (
		<>
			{parseMSJSON(pageName)}
		</>
	);
};

export default Section;