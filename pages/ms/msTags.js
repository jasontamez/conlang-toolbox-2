import {
	Box,
	Text,
	Button,
	HStack,
	Checkbox,
	VStack,
	ScrollView,
	Center
} from 'native-base';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import getSizes from "../../helpers/getSizes";
import { InfoIcon } from "../../components/icons";
import FullPageModal from '../../components/FullBodyModal';
import { fontSizesInPx } from '../../store/appStateSlice';
import { RangeSlider, TextAreaSetting } from '../../components/inputTags';
import debounce from '../../helpers/debounce';
import { setNum, setText } from '../../store/morphoSyntaxSlice';

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
const margins = {
	0: 2,
	1: 3
};
const textProps = () => {
	const [
		smallerSize,
		textSize,
		lgSize,
		xlSize,
		x2Size
	] = getSizes("sm", "md", "lg", "xl", "x2");
	const headings = {
		0: x2Size,
		1: xlSize,
		2: lgSize,
		3: textSize,
		4: smallerSize
	};
	return {
		smallerSize,
		textSize,
		lgSize,
		xlSize,
		x2Size,
		headings
	};
};
export const T = (props) => {
	const {textSize} = textProps();
	return (
		<Text
			m={0}
			p={0}
			borderWidth={0}
			lineHeight={lineHeights[textSize]}
			fontSize={textSize}
			flexShrink={1}
			{...props}
		/>
	);
};
export const B = (props) => <T bold {...props} />;
export const I = (props) => <T italic {...props} />;
export const S = (props) => <T strikeThrough {...props} />;
export const P = (props) => {
	//top={0 = no margin, 1 = regular margin, 2 = larger margin}
	//indent={0...}
	const {
		top = 1,
		indent = 0,
		children,
		noDot = false
	} = props;
	const { textSize } = textProps();
	return (
		<HStack
			mt={top === 2 ? 6 : top ? 2 : 0}
			ml={indent * 4}
			alignItems="flex-start"
			justifyContent="flex-start"
		>
			{noDot || <Text fontSize={textSize} lineHeight={lineHeights[textSize]}>{`\u25CF `}</Text>}
			{children}
		</HStack>
	);
};


export const Header = ({level, children}) => {
	const { headings } = textProps();
	const headingSize = headings[level || 0];
	return (
		<Box
			my={margins[level === 1 ? level : 0]}
		>
			<B
				fontSize={headingSize}
				lineHeight={lineHeights[headingSize]}
			>{children}</B>
		</Box>
	);
};

export const Modal = (props) => {
	const {
		label = "Read About It",
		title,
		children
	} = props;
	const { textSize, smallerSize } = textProps();
	const [open, setOpen] = useState(false);
	return (
		<HStack
			justifyContent="flex-start"
		>
			<FullPageModal
				modalOpen={open}
				closeModal={() => setOpen(false)}
				BodyContent={() => <>{children}</>}
				textSize={textSize}
				modalTitle={title}
				modalBodyProps={{px: 5}}
			/>
			<Button
				py={1}
				px={2}
				ml={4}
				colorScheme="primary"
				size="sm"
				startIcon={<InfoIcon size={smallerSize} />}
				onPress={() => setOpen(true)}
				_text={{fontSize: smallerSize}}
			>{label}</Button>
		</HStack>
	);
};

export const Tabular = (props) => {
	const {
		top,
		indent,
		rows,
		final
	} = props;
	const [firstRow, ...otherRows] = rows.map((orig) => orig.slice());
	const columns = firstRow.map((item, i) => {
		return [item, ...otherRows.map(row => row[i])];
	});
	const prop = firstRow.join(',');
	return (
		<ScrollView
			horizontal
			mt={top === 2 ? 6 : top ? 2 : 0}
			ml={indent * 4}
			variant="tabular"
		>
			<VStack>
				<HStack>
					{columns.map((col, i) => {
						return (
							<VStack
								m={2}
								alignItems="center"
								justifyContent="space-between"
								key={`${prop}:TabularRow/${i}`}
							>
								{col.map((c, j) => {
									return <T key={`${prop}:TabularCol/${i}/${j}`}>{c}</T>;
								})}
							</VStack>
						);
					})}
				</HStack>
				{final && <T>{final}</T>}
			</VStack>
		</ScrollView>
	);
};

export const Range = (props) => {
	const {
		start,
		end,
		notFilled,
		max,
		uncapped,
		prop,
		value,
		label // accessibilityLabel?
	} = props;
	const { smallerSize } = textProps();
	const dispatch = useDispatch();
	return (
		<RangeSlider
			min={0}
			max={max}
			step={1}
			value={value}
			onChange={(vv) => dispatch(setNum({prop, value: vv}))}
			ticked
			capped={!uncapped}
			fontSize={smallerSize}
			notFilled={notFilled}
			minimumLabel={start}
			maximumLabel={end}
			xPadding={32}
		/>
	);
};

export const TextArea = ({rows, prop, value, children}) => {
	const { smallerSize, textSize } = textProps();
	const dispatch = useDispatch();
	return (
		<TextAreaSetting
			rows={rows}
			defaultValue={value || ""}
			labelProps={{fontSize: textSize}}
			inputProps={{fontSize: smallerSize}}
			boxProps={{bg: "lighter", mt: 4, p: 2}}
			onChangeText={
				(value) => debounce(
					() => dispatch(setText({prop, value})),
					{ namespace: `textarea-${prop}` }
				)
			}
		>
			<T>{children}</T>
		</TextAreaSetting>
	);
};

export const CheckBoxes = (props) => {
	const { boxes, display } = props;
	const dispatch = useDispatch();
	if(!display) {
		return (
			<Box key={`CheckboxError/${Math.random()}`}>
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
	const { smallerSize, textSize } = textProps();
	const boxing = boxes.slice();
	//const setters = (bit.setters || []).slice();
	const rowDescriptions = (display.rowDescriptions || []);
	const labels = (display.labels || []).slice();
	const accessibilityLabels = (display.accessibilityLabels || []).slice();
	const isCentered = (display.centering || []);
	const id = header || (
		inlineHeaders ?
			inlineHeaders.join(",")
		:
			labels.join(",")
	);
	// Assemble tabular section
	//
	let checkBoxDisplayRow = [];
	// See if we have multiple boxes per row
	if(multiBoxes) {
		// Iterate over the boxes until none remain
		while(boxing.length > 0) {
			let counter = 0;
			let row = [];
			while(counter < multiBoxes) {
				const box = boxing.shift();
				const setter = 0 //setters.shift();
				const label = (
					accessibilityLabels.shift() || "MISSING LABEL"
				);
				const rl = row.length;
				row.push(
					<Checkbox
						mx="auto"
						value={box}
						onChange={() => doSetBool(setter, !box)}
						defaultIsChecked={box}
						accessibilityLabel={label}
						key={`${id}-CheckboxMulti/${counter}/${rl}`}
					/>
				);
				counter++;
			}
			checkBoxDisplayRow.push(row);
		}
	} else {
		boxing.forEach((box, i) => {
			const label = labels.shift() || "MISSING LABEL";
			const setter = i //setters[i];
			let textProps = {fontSize: smallerSize};
			if(isCentered[0]) {
				textProps.textAlign = "center";
			}
			const emSize = fontSizesInPx[textSize];
			checkBoxDisplayRow.push([
				<Checkbox
					value={box}
					onChange={() => doSetBool(setter, !box)}
					defaultIsChecked={box}
					key={`${id}:CheckBox/${i}`}
				>
					<Box flex={1} style={{marginLeft: emSize}}>
						<T {...textProps}>{label}</T>
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
			<T key={`CheckBox-${id}-rowDesc/${i}`} {...textProps}>{rDesc}</T>
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
				<B key={`CheckBox-${id}-inlineHeader/${i}`} {...textProps}>{ih}</B>
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
			my={4}
			key={`${id}:CheckBox-Container`}
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
							<B>{header}</B>
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
							key={`${id}:CheckBox-Row/${i}`}
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
										key={`${id}:CheckBox-Column/${i}/${j}`}
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
};

