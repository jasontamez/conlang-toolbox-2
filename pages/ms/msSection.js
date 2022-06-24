import React from 'react';
import {
	IonPage,
	IonContent,
	IonList,
	useIonViewDidEnter
} from '@ionic/react';
import {
	SyntaxHeader
} from './MorphoSyntaxElements';
import { changeView } from '../../components/ReduxDucksFuncs';
import { useDispatch } from "react-redux";

import ms from './ms.json';
//import doParse from 'html-react-parser';
import { useParams } from 'react-router-dom';
import { Modal, Slider, Text, TextArea, VStack } from 'native-base';
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
							let temp = [bit];
							let temp2 = [];
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
							if(temp2.length === 1) {
								const oneLine = temp2[0];
								let final;
								if(typeof oneLine === "string") {
									final = <Text>{oneLine}</Text>;
								} else {
									final = oneLine;
								}
								output.push(
									<Box mt={margin} pl={String(indent * 2)+"rem"}>
										{final}
									</Box>
								);
							} else {
								output.push(
									<Box mt={margin} pl={String(indent * 2)+"rem"}>
										<Text>{...temp2}</Text>
									</Box>
								);
							};
							// Reset margin, if needed
							margin = regularMargin;
						} else {
							// some type of object - currently only have the tabular object so I won't bother checking
							const makeLine = (inputRows) => {
								let rows = [];
								inputRows.forEach(ir => rows.push([...ir]));
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
											{data.map(item => makeLine(bit.rows))}
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
					return (
						<>
							{...output}
						</>
					);
				};
				return (
					<>
						<Modal size="5/6" m="auto" isOpen={synState[id] !== undefined} onClose={() => dispatch(setSyntaxState(id, false))}>
							<Modal.CloseButton />
							<Modal.Header>{bit.title}</Modal.Header>
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
				const disp = bit.display;
				if(!disp) {
					return "<div>CHECKBOX DISPLAY ERROR</div>";
				}
				const boxes = (bit.boxes || []);
				const rowLabels = (disp.rowLabels || []).slice();
				const perRow = disp.boxesPerRow;
				const labels = (disp.labels || []).slice();
				const header = disp.header;
				const inlineHeaders = disp.inlineHeaders;
				let count = 0;
				let rows = [];
				let temp = [];
				boxes.forEach((box) => {
					count++;
					temp.push(box || "Error");
					if(count >= perRow) {
						temp.push(rowLabels.shift() || "Error");
						count = 0;
						rows.push(temp);
						temp = [];
					}
				});
				const printRow = (row, cn = "") => {
					const label = row.pop() || "";
					return (
						<IonRow className={cn || undefined}>
							{row.map((c) => <IonCol className="cbox"><RadioBox prop={String(c)} /></IonCol>)}
							<IonCol>{doParse(label)}</IonCol>
						</IonRow>
					);
				};
				const printRowWithLabel = (row, cn = "") => {
					const final = row.pop() || "";
					const label = labels.shift() || "";
					const labelClass = disp.labelClass || "label"
					return (
						<IonRow className={cn || undefined}>
							{row.map((c) => <IonCol className="cbox"><RadioBox prop={String(c)} /></IonCol>)}
							<IonCol className={labelClass}>{doParse(label)}</IonCol>
							<IonCol>{doParse(final)}</IonCol>
						</IonRow>
					);
				};
				const printHeaderRow = (row, hasLabel = false) => {
					const final = row.pop() || "";
					let label = "";
					if(hasLabel) {
						label = row.pop();
					}
					return (
						<IonRow className="header">
							{row.map((c) => <IonCol className="cbox">{c}</IonCol>)}
							{label ? <IonCol className={disp.labelClass || "label"}>{doParse(label)}</IonCol> : label}
							<IonCol>{doParse(final)}</IonCol>
						</IonRow>
					);
				};
				return (
					<IonItem className="content">
						<IonGrid className={disp.class || undefined}>
							{header ? <IonRow  className="header"><IonCol>{doParse(header)}</IonCol></IonRow> : ""}
							{inlineHeaders ? printHeaderRow(inlineHeaders.slice(), !!disp.labels) : ""}
							{rows.map((r) => disp.labels ? printRowWithLabel(r.slice()) : printRow(r.slice()))}
						</IonGrid>
					</IonItem>
				);
		}
		return "";
	});
};

const OldSection = () => {
	const dispatch = useDispatch();
	const viewInfo = ['ms', 'ms01'];
	useIonViewDidEnter(() => {
		dispatch(changeView(viewInfo));
	});

	const { page } = useParams();
	const n = page.slice(-2);
	const pageNum = Number(page.slice(-2));
	const pageName = "s" + n;

	return (
		<IonPage>
			<SyntaxHeader title={ms.titles[pageNum]} />
			<IonContent fullscreen className="evenBackground disappearingHeaderKludgeFix" id="morphoSyntaxPage">
				<IonList lines="none">
					{parseMSJSON(pageName)}
				</IonList>
			</IonContent>
		</IonPage>
	);
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