import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import {
	Button,
	Box,
	Checkbox,
	HStack,
	Modal,
	ScrollView,
	Text as Tx,
	VStack,
	useBreakpointValue,
	IconButton
} from 'native-base';

import ms from './msinfo.json';
import { /*
	setKey,
	setLastSave,*/
	setBool,
	setNum,
	setText
} from '../../store/morphoSyntaxSlice';
import { CloseCircleIcon, DotIcon, InfoIcon, OkIcon } from "../../components/icons";
import { SliderWithTicks, SliderWithTicksNoCaps, TextAreaSetting } from "../../components/layoutTags";
import debounce from "../../helpers/debounce";

const ParseMSJSON = (props) => {
	const [modalState, setModal] = useState('');
	const synBool = useSelector((state) => state.morphoSyntax.bool);
	const synNum = useSelector((state) => state.morphoSyntax.num);
	const synText = useSelector((state) => state.morphoSyntax.text);
	const sizes = useSelector(state => state.appState.sizes);
	const { height, width } = useWindowDimensions();
	const dotSize = useBreakpointValue(sizes.xs);
	const smallerSize = useBreakpointValue(sizes.sm);
	const textSize = useBreakpointValue(sizes.md);
	const lineHeights = {
		xs: "xs",
		sm: "xs",
		md: "sm",
		lg: "md",
		xl: "lg",
		"2xl": "xl",
		"3xl": "xl",
		"4xl": "xl"
	};
	const dotProps = {
		size: dotSize,
		mt: {
			"2xs": 1,
			xs: 1,
			sm: 1.5,
			md: 1.5,
			lg: 2.5,
			xl: 3.5,
			"2xl": 4
		}[dotSize],
		mr: {
			"2xs": 1.5,
			xs: 2,
			sm: 2.5,
			md: 2.5,
			lg: 3,
			xl: 3.5,
			"2xl": 4
		}[dotSize]
	};
	const { page } = props;
	const doc = ms[page];
	const headings = {
		0: useBreakpointValue(sizes.x2),
		1: useBreakpointValue(sizes.xl),
		2: useBreakpointValue(sizes.lg),
		3: textSize
	};
	const margins = {
		0: 2,
		1: 3
	};
	let keyCounter = 0;
	const getKey = (msg = "parsedJSON") => {
		return msg + String(keyCounter++);
	};
	const Text = (props) => (
		<Tx
			m={0}
			p={0}
			borderWidth={0}
			lineHeight={lineHeights[textSize]}
			fontSize={textSize}
			{...props}
		/>
	);
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
						temp2.push(
							<Text
								bold
								key={getKey("formattedText")}
							>
								{x}
							</Text>
						);
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
						temp2.push(
							<Text
								italic
								key={getKey("formattedText")}
							>
								{x}
							</Text>
						);
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
						temp2.push(
							<Text
								strikeThrough
								key={getKey("formattedText")}
							>
								{x}
							</Text>
						);
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
				final = (
					<Text
						bold={forceBold}
						key={getKey("formattedText")}
					>{oneLine}</Text>
				);
			} else {
				final = oneLine;
			}
			return final;
		}
		// Multi-lined texts
		return (
			<Text
				bold={forceBold}
				key={getKey("formattedText")}
			>{temp2}</Text>
		);
	};
	const content = doc.map((bit) => {
		const tag = (bit.tag || "");
		const dispatch = useDispatch();
		const {
			display,
			prop,
			id,
			rows,
			placeholder,
			content,
			level,
			title
		} = bit;
		switch(tag) {
			case "Header":
				const headingSize = headings[level || 0];
				return (
					<Box
						my={margins[level || 0]}
						key={getKey("header")}
					>
						<Text
							bold
							fontSize={headingSize}
							lineHeight={lineHeights[headingSize]}
						>{content}</Text>
					</Box>
				);
			case "Range":
				const doSetNum = (prop, value) => {
					dispatch(setNum({prop, value}));
				};
				const {
					start,
					end,
					notFilled,
					max,
					label,
					uncapped
				} = bit;
				const Element = uncapped ?
					(props) => <SliderWithTicksNoCaps {...props} />
				:
					(props) => <SliderWithTicks {...props} />
				;
				return (
					<Element
						key={getKey("range")}
						beginLabel={start}
						endLabel={end}
						notFilled={notFilled}
						min={0}
						max={max}
						value={synNum[prop] || 0}
						sliderProps={{
							accessibilityLabel: label,
							onChangeEnd: (v) => doSetNum(prop, v)
						}}
					/>
				);
			case "Text":
				return (
					<TextAreaSetting
						key={getKey("Fragment")}
						rows={rows}
						placeholder={placeholder}
						defaultValue={synText[prop] || ""}
						labelProps={{fontSize: textSize}}
						inputProps={{fontSize: smallerSize}}
						onChangeText={
							(value) => debounce(
								() => dispatch(setText({prop, value})),
								{ namespace: "textarea"+prop }
							)
						}
					>
						{content || ""}
					</TextAreaSetting>
				);
			case "Modal":
				//
				// BEGIN MODAL CONTENT DECLARATION
				//
				const ModalContent = (props) => {
					const content = props.content;
					if(!Array.isArray(content)) {
						return (
							<Text key={getKey()}>
								Missing Content Array
							</Text>
						);
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
							output.push(
								<HStack
									space={0}
									m={0}
									mt={margin}
									p={0}
									ml={indent * 4}
									alignItems="flex-start"
									justifyContent="flex-start"
									key={getKey(id)}
								>
									{prefix ?
										<DotIcon m={0} p={0} {...dotProps} />
									:
										<></>
									}
									<FormatText content={bit} />
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
									<VStack
										m={2}
										alignItems="center"
										justifyContent="space-between"
										key={getKey(id)}
									>
										{rows.map((r) => {
											return (
												<FormatText
													key={getKey(id + "InnerRow")}
													content={r}
												/>
											);
										})}
									</VStack>
								);
							};
							output.push(
								<ScrollView
									horizontal
									mt={margin}
									ml={indent * 4}
									key={getKey(id)}
									variant="tabular"
								>
									<VStack>
										<HStack>
											{newRows.map((line) => makeLine(line.slice()))}
										</HStack>
										{
											bit.final ?
												<FormatText content={bit.final} />
											:
												<React.Fragment></React.Fragment>
										}
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
					return (
						<VStack
							space={0}
							key={getKey("MainModal")}
							mx={4}
							maxW={width - 32}
						>
							{output}
						</VStack>
					);
				};
				//
				// END MODAL CONTENT DECLARATION
				//
				return (
					<HStack
						justifyContent="flex-start"
						key={getKey("ModalButton")}
						safeArea
					>
						<Modal
							bg="main.800"
							m={0}
							isOpen={modalState === id}
							onClose={() => setModal('')}
							size="full"
							style={{ width, height }}
							safeArea
						>
							<Modal.Content
								borderRadius="none"
								style={{ width, height, maxHeight: height }}
							>
								<Modal.Header style={{width}}>
									<HStack w="full" justifyContent="space-between" alignItems="center" pl={1.5}>
										<Text textAlign="center" bold flexGrow={1} flexShrink={1}>{title}</Text>
										<IconButton
											icon={<CloseCircleIcon color="primary.50" size={textSize} />}
											onPress={() => setModal('')}
											variant="ghost"
											flexGrow={0}
											flexShrink={0}
											px={0}
										/>
									</HStack>
								</Modal.Header>
								<Modal.Body
									safeArea
									m={0}
									style={{width}}
								>
									<ModalContent content={content} />
								</Modal.Body>
								<Modal.Footer style={{width}} p={2}>
									<Button
										m={0}
										startIcon={<OkIcon size={textSize} />}
										onPress={() => setModal('')}
										_text={{fontSize: textSize}}
									>Done</Button>
								</Modal.Footer>
							</Modal.Content>
						</Modal>
						<Button
							py={1}
							px={2}
							ml={4}
							colorScheme="primary"
							size="sm"
							startIcon={<InfoIcon size={smallerSize} />}
							onPress={() => setModal(id)}
							_text={{fontSize: smallerSize}}
						>{(label || "Read About It").toUpperCase()}</Button>
					</HStack>
				);
			case "Checkboxes":
				if(!display) {
					return (
						<Box key={getKey()}>
							<Text bold>CHECKBOX DISPLAY ERROR</Text>
						</Box>
					);
				}
				const doSetBool = (prop, value) => {
					dispatch(setBool({prop, value}));
				};
				const {
					multiBoxes,
					header,
					inlineHeaders,
					striped
				} = display;
				const boxes = (bit.boxes || []).slice();
				const rowDescriptions = (display.rowDescriptions || []);
				const labels = (display.labels || []).slice();
				const accessibilityLabels = (display.accessibilityLabels || []).slice();
				const isCentered = (display.centering || []);
				// Assemble tabular section
				//
				let boxRows = [];
				// See if we have multiple boxes per row
				if(multiBoxes) {
					// Iterate over the boxes until none remain
					while(boxes.length > 0) {
						let counter = 0;
						let row = [];
						while(counter < multiBoxes) {
							const id = boxes.shift();
							const label = (
								accessibilityLabels.shift() || "MISSING LABEL"
							);
							row.push(
								id ?
									<Checkbox
										mx="auto"
										value={id}
										onChange={() => doSetBool(id, !synBool[id])}
										defaultIsChecked={synBool[id] || false}
										accessibilityLabel={label}
										key={getKey(id+"CheckBox")}
									/>
								:
									<Text key={getKey(id+"Missing")}>
										MISSING CHECKBOX
									</Text>
							);
							counter++;
						}
						boxRows.push(row);
					}
				} else {
					boxes.forEach((box) => {
						const label = labels.shift() || "MISSING LABEL";
						boxRows.push([
							<Checkbox
								value={box}
								onChange={() => doSetBool(box, !synBool[id])}
								defaultIsChecked={synBool[box] || false}
								key={getKey(id + "CheckBox")}
							>
								<FormatText content={label} />
							</Checkbox>
						]);
					});
				}
				// Add rowDescriptions as a new column, if they exist
				rowDescriptions.length && boxRows.forEach((row, i) => {
					const rDesc = rowDescriptions[i] || "MISSING INFO";
					row.push(
						<FormatText
							key={getKey("FormattedText")}
							content={rDesc}
						/>
					);
				});
				// Add inlineheaders, if any, to the tops of the existing columns
				if(inlineHeaders) {
					let row = [];
					inlineHeaders.forEach((ih) => {
						row.push(
							<FormatText
								key={getKey("InlineHeader")}
								content={ih}
								forceBold
							/>
						);
					});
					boxRows.unshift(row);
				}
				const fractions = {
					1: "full",
					2: "1/2",
					3: "1/3",
					4: "1/4",
					5: "1/5"
				};
				// Put it all together
				return (
					<Box
						m={0}
						key={getKey("CheckboxesContainer")}
					>
						<VStack
							bg="darker"
							m={0}
							mr="auto"
							minWidth="300px"
						>
							{
								header ?
									<Box p={2}>
										<FormatText
											content={header}
											forceBold
										/>
									</Box>
								:
									<></>
							}
							{boxRows.map((row, i) => {
								// Stripe odd-numbered rows
								let stripedRow = (
									striped && (i % 2) ?
										{bg: "darker"}
									:
										{}
								);
								const maxWidth = fractions[row.length] || "1/6";
								return (
									<HStack
										key={getKey(id+"Row")}
										{...stripedRow}
									>
										{row.map((col, i) => {
											const alignment = isCentered[i] ? {textAlign: "center"} : {};
											return (
												<Box
													p={2}
													key={getKey(id+"Col")}
													w={maxWidth}
													{...alignment}
												>
													{col}
												</Box>
											);
										})}
									</HStack>
								);
							})}
						</VStack>
					</Box>
				);
			default:
				// No switch matched?
				return <Text key={getKey("ERROR")}>No Switch Matched: {tag}</Text>;
		}
	});
	return (
		<VStack
			space={4}
			key={getKey("Content")}
			mb={4}
		>
			{content}
		</VStack>
	);

};

const Section = () => {
	const { msPage } = useParams();
	const pageName = "s" + msPage.slice(-2);

	return <ParseMSJSON page={pageName} key={"ParsingASection" + pageName} />;
};

export default Section;