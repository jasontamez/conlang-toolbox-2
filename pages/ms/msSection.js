import React, { useCallback, useState, memo } from "react";
import { useWindowDimensions } from "react-native";
import { useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import {
	Button,
	Box,
	Checkbox,
	HStack,
	ScrollView,
	Text as Tx,
	VStack,
	Center
} from 'native-base';

import { DotIcon, InfoIcon } from "../../components/icons";
import { SliderWithTicks, SliderWithTicksNoCaps, TextAreaSetting } from "../../components/inputTags";
import debounce from "../../helpers/debounce";
import { fontSizesInPx } from "../../store/appStateSlice";
import FullPageModal from "../../components/FullBodyModal";
import getSizes from "../../helpers/getSizes";
import getSection from "./sections";

const ParseMSJSON = (props) => {
	const [modalState, setModal] = useState('');

	const { width } = useWindowDimensions();
	const [dotSize, smallerSize, textSize, lgSize, xlSize, x2Size] = getSizes("xs", "sm", "md", "lg", "xl", "x2");
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
	const emSize = fontSizesInPx[textSize];
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
	const doc = getSection(page);
	const headings = {
		0: x2Size,
		1: xlSize,
		2: lgSize,
		3: textSize,
		4: smallerSize
	};
	const margins = {
		0: 2,
		1: 3
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
		const {
			textProps = {},
			id
		} = props;
		let temp = [bit];
		let temp2 = [];
		// Check for BOLD text
		temp.forEach((t, boldIndex) => {
			if(typeof t === "string") {
				let toggle = false;
				t.split("**").forEach((x) => {
					if(x === "") {
						// Just skip.
					} else if (toggle) {
						temp2.push(
							<Text
								bold
								key={`${page}:${id}/BOLD/${boldIndex}`}
								{...textProps}
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
		temp.forEach((t, italIndex) => {
			if(typeof t === "string") {
				let toggle = false;
				t.split("//").forEach((x) => {
					if(x === "") {
						// Just skip.
					} else if (toggle) {
						temp2.push(
							<Text
								italic
								key={`${page}:${id}/ITAL/${italIndex}`}
								{...textProps}
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
		temp.forEach((t, strikeIndex) => {
			if(typeof t === "string") {
				let toggle = false;
				t.split("--").forEach((x) => {
					if(x === "") {
						// Just skip.
					} else if (toggle) {
						temp2.push(
							<Text
								strikeThrough
								key={`${page}:${id}/STRUCK/${strikeIndex}`}
								{...textProps}
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
						key={`${page}:${id}/singleLine`}
						{...textProps}
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
				key={`${page}:${id}/multilineText`}
				{...textProps}
			>{temp2}</Text>
		);
	};
	const content = doc.map((bit, contentIndex) => {
		const tag = (bit.tag || "");
		const dispatch = useDispatch();
		const {
			display,
			prop,
			setProp,
			id,
			rows,
			placeholder,
			content,
			label,
			level,
			title
		} = bit;
		switch(tag) {
			case "Header":
				const headingSize = headings[level || 0];
				return (
					<Box
						my={margins[level || 0]}
						key={`${page}:Header/${contentIndex}`}
					>
						<Text
							bold
							fontSize={headingSize}
							lineHeight={lineHeights[headingSize]}
						>{content}</Text>
					</Box>
				);
			case "Range":
				const {
					start,
					end,
					notFilled,
					max,
					uncapped
				} = bit;
				const Element = memo(({
					uncapped,
					key,
					min,
					max,
					step,
					beginLabel,
					endLabel,
					fontSize,
					notFilled,
					value,
					sliderProps
				}) => {
					const onEnd = useCallback((vv) => {
						if(vv !== value) {
							dispatch(setProp(vv));
						}
					}, [setProp, value]);
					if(uncapped) {
						return <SliderWithTicksNoCaps onEnd={onEnd} {...{sliderProps, key, min, max, step, beginLabel, endLabel, fontSize, notFilled, value}} />;
					}
					return <SliderWithTicks onEnd={onEnd} {...{key, min, max, step, beginLabel, endLabel, fontSize, notFilled, value}} />;
				});
				const onChangeEnd = useCallback((vv) => dispatch(setProp(vv)), [prop]);
				return (
					<Element
						uncapped={uncapped}
						key={`${page}:Range/${contentIndex}`}
						min={0}
						max={max}
						step={1}
						beginLabel={start}
						endLabel={end}
						fontSize={smallerSize}
						notFilled={notFilled}
						value={prop || 0}
						sliderProps={{
							accessibilityLabel: label,
							onChangeEnd
						}}
					/>
				);
			case "Text":
				return (
					<TextAreaSetting
						key={`${page}:TextArea/${contentIndex}`}
						rows={rows}
						placeholder={placeholder}
						defaultValue={prop || ""}
						labelProps={{fontSize: textSize}}
						inputProps={{fontSize: smallerSize}}
						onChangeText={
							(value) => debounce(
								() => dispatch(setProp(value)),
								{ namespace: `textarea-${contentIndex}` }
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
							<Text key={`${page}:${id}-MISSING/${contentIndex}`}>
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
					let inputCounter = 0;
					while(input.length > 0) {
						let bit = input.shift();
						inputCounter++;
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
									key={`${page}:${id}-HStack/${contentIndex}/${inputCounter}`}
								>
									{prefix &&
										<DotIcon m={0} p={0} {...dotProps} />
									}
									<FormatText content={bit} id={`${id}-FormattedText/${contentIndex}`} />
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
							const makeLine = (rows, i) => {
								return (
									<VStack
										m={2}
										alignItems="center"
										justifyContent="space-between"
										key={`${page}:${id}-Row/${i}`}
									>
										{rows.map((r, j) => {
											return (
												<FormatText
													key={`${page}:${id}-InnerRow/${i}/${j}`}
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
									key={`${page}:${id}-ScrollView/tabular`}
									variant="tabular"
								>
									<VStack>
										<HStack>
											{newRows.map((line, i) => makeLine(line.slice(), i))}
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
							key={`${page}:${id}-MainModal`}
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
						key={`${page}:${id}-ModalButton`}
						safeArea
					>
						<FullPageModal
							modalOpen={modalState === id}
							closeModal={() => setModal('')}
							BodyContent={() => <ModalContent content={content} />}
							textSize={textSize}
							modalTitle={title}
							modalBodyProps={{pr: 10}}
						/>
						<Button
							py={1}
							px={2}
							ml={4}
							colorScheme="primary"
							size="sm"
							startIcon={<InfoIcon size={smallerSize} />}
							onPress={() => setModal(id)}
							_text={{fontSize: smallerSize}}
						>{(label || "Read About It")}</Button>
					</HStack>
				);
			case "Checkboxes":
				if(!display) {
					return (
						<Box key={`${page}:CheckboxError/${contentIndex}`}>
							<Text bold>CHECKBOX DISPLAY ERROR</Text>
						</Box>
					);
				}
				const doSetBool = (setter, value) => {
					dispatch(setter(value));
				};
				const {
					multiBoxes,
					header,
					inlineHeaders,
					striped
				} = display;
				const boxes = (bit.boxes || []).slice();
				const setters = (bit.setters || []).slice();
				const rowDescriptions = (display.rowDescriptions || []);
				const labels = (display.labels || []).slice();
				const accessibilityLabels = (display.accessibilityLabels || []).slice();
				const isCentered = (display.centering || []);
				// Assemble tabular section
				//
				let checkBoxDisplayRow = [];
				// See if we have multiple boxes per row
				if(multiBoxes) {
					// Iterate over the boxes until none remain
					while(boxes.length > 0) {
						let counter = 0;
						let row = [];
						while(counter < multiBoxes) {
							const box = boxes.shift();
							const setter = setters.shift();
							const label = (
								accessibilityLabels.shift() || "MISSING LABEL"
							);
							row.push(
								<Checkbox
									mx="auto"
									value={box}
									onChange={() => doSetBool(setter, !box)}
									defaultIsChecked={box}
									accessibilityLabel={label}
									key={`${page}:CheckBox/${contentIndex}/${counter}`}
								/>
							);
							counter++;
						}
						checkBoxDisplayRow.push(row);
					}
				} else {
					boxes.forEach((box, i) => {
						const label = labels.shift() || "MISSING LABEL";
						const setter = setters[i];
						let textProps = {fontSize: smallerSize};
						if(isCentered[0]) {
							textProps.textAlign = "center";
						}
						checkBoxDisplayRow.push([
							<Checkbox
								value={box}
								onChange={() => doSetBool(setter, !box)}
								defaultIsChecked={box}
								key={`${page}:CheckBox/${contentIndex}/${i}`}
							>
								<Box flex={1} style={{marginLeft: emSize}}>
									<FormatText
										content={label}
										textProps={textProps}
									/>
								</Box>
							</Checkbox>
						]);
					});
				}
				// Add rowDescriptions as a new column, if they exist
				rowDescriptions.length && checkBoxDisplayRow.forEach((row, i) => {
					const rDesc = rowDescriptions[i] || "MISSING INFO";
					let textProps = {fontSize: smallerSize};
					if(isCentered[row.length]) {
						textProps.textAlign = "center";
					}
					row.push(
						<FormatText
							key={`${page}:CheckBox-RowDescs/${contentIndex}/${i}`}
							id={`CheckBox-RowDescs/${contentIndex}/${i}`}
							content={rDesc}
							textProps={textProps}
						/>
					);
				});
				// Add inlineheaders, if any, to the tops of the existing columns
				if(inlineHeaders) {
					let row = [];
					inlineHeaders.forEach((ih, i) => {
						let textProps = {};
						if(isCentered[i]) {
							textProps.textAlign = "center";
						}
						row.push(
							<FormatText
								key={`${page}:CheckBox-InlineHeader/${contentIndex}/${i}`}
								id={`CheckBox-InlineHeader/${contentIndex}/${i}`}
								content={ih}
								forceBold
								textProps={textProps}
							/>
						);
					});
					checkBoxDisplayRow.unshift(row);
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
						key={`${page}:CheckBox-Container/${contentIndex}`}
					>
						<VStack
							bg="darker"
							m={0}
							maxW="5/6"
							style={{
								minWidth: 300
							}}
						>
							{
								header &&
									<Box p={2}>
										<FormatText
											content={header}
											forceBold
										/>
									</Box>
							}
							{checkBoxDisplayRow.map((row, i) => {
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
										key={`${page}:CheckBox-Row/${contentIndex}/${i}`}
										{...stripedRow}
									>
										{row.map((col, j) => {
											const Element =
												isCentered[j] ?
													(props) => <Center {...props} />
												:
													(props) => <Box {...props} />
											;
											return (
												<Element
													p={2}
													key={`${page}:CheckBox-Column/${contentIndex}/${i}/${j}`}
													w={maxWidth}
												>
													{col}
												</Element>
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
				return <Text key={`${page}:ERROR/${contentIndex}`}>No Switch Matched: {tag}</Text>;
		}
	});
	return (
		<VStack
			space={4}
			key={`${page}:Content`}
			mb={4}
		>
			{content}
		</VStack>
	);

};

const Section = () => {
	const { msPage } = useParams();
	const pageName = "s" + msPage.slice(-2);

	return <ParseMSJSON page={pageName} key={`ParsingASection-${pageName}`} />;
};

export default Section;