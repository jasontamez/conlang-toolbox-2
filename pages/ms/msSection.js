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
import { useWindowDimensions } from 'react-native';
import { HTMLElementModel, HTMLContentModel } from 'react-native-render-html';
import { useParams } from 'react-router-dom';
import { Heading, Modal, Slider, Text, TextArea } from 'native-base';
import { RenderHtml } from '../../components/Layout';


const parseMSJSON = (page) => {
	const doc = ms[page];
	const headings = {
		0: "1rem",
		1: "1.4rem",
		2: "1.25rem",
		3: "1.1rem"
	};
	const { width } = useWindowDimensions();
	const customHTMLElementModels = {
		'transtable': HTMLElementModel.fromCustomModel({
			tagName: 'trans-table',
			contentModel: HTMLContentModel.block
		})
	};
	const renderers = {
		"trans-table": (props) => {
			const rows = (props.rows || "").trim().split(/\s+\/\s+/);
			let length = 1;
			let cName = "translation";
			if(props.className) {
				cName += " " + props.className;
			}
			const final = props.final;
			let finalRow = -1;
			if(final) {
				finalRow = rows.length;
				rows.push(final);
			}
			const mainRows = rows.filter((row) => row).map((row, i) => {
				if(i === finalRow) {
					return <tr key={"ROW-" + String(i)}><td colSpan={length}>{row}</td></tr>;
				}
				const tds = row.split(/\s+/);
				length = Math.max(length, tds.length);
				return <tr key={"ROW-" + String(i)}>{
						tds.filter((el) => el).map((el, i) => <td key={"TD-" + String(i)}>{el.replace(/__/g, " ")}</td>)
					}</tr>;
				});
			return <table className={cName}><tbody>{mainRows}</tbody></table>;
		},
		"temp": (props) => {
			const rows = (props.rows || "").trim().split(/\s+\/\s+/);

		}
	};
	return doc.map((bit) => {
		const tag = (bit.tag || "");
		const dispatch = useDispatch();
		switch(tag) {
			case "Header":
				return <Heading bold fontSize={headings[bit.level || 0]}>{bit.content}</Heading>;
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
				const InfoModal = (props) => {
					const dispatch = useDispatch();
					const id = "modal" + (props.title).replace(/[^a-zA-Z0-9]/g, "");
					const label = props.label || "Read About It";
					return (
						<IonItem className={props.className ? props.className + " infoModal" : "infoModal"}>
							<IonModal isOpen={synState[id] !== undefined} onDidDismiss={() => dispatch(setSyntaxState(id, false))}>
								<IonHeader>
									<IonToolbar color="primary">
										<IonTitle>{props.title}</IonTitle>
									</IonToolbar>
								</IonHeader>
								<IonContent className="morphoSyntaxModal">
									<IonList lines="none">
										<IonItem>
											{props.children}
										</IonItem>
									</IonList>
								</IonContent>
								<IonFooter>
									<IonToolbar className="ion-text-wrap">
										<IonButtons slot="end">
											<IonButton onClick={() => dispatch(setSyntaxState(id, false))} slot="end" fill="solid" color="success">
												<IonIcon icon={checkmarkCircleOutline} slot="start" />
												<IonLabel>Done</IonLabel>
											</IonButton>
										</IonButtons>
									</IonToolbar>
								</IonFooter>
							</IonModal>
							<IonButton color="primary" onClick={() => dispatch(setSyntaxState(id, true))}>
								<IonIcon icon={informationCircleSharp} slot="start" style={{ marginInlineStart: "0", marginInlineEnd: "0.5rem"}} />
								<IonLabel>{label}</IonLabel>
							</IonButton>
						</IonItem>
					);
				};
				//return <InfoModal title={bit.title} label={bit.label || undefined}>{
				//	doParse(bit.content || "", {
				//		replace: node => {
				//			if(node instanceof Element && node.attribs && node.name === "transtable") {
				//				return <TransTable rows={node.attribs.rows} className={node.attribs.className || ""}>{node.children.length ? (node.children[0]).data : ""}</TransTable>;
				//			}
				//			return node;
				//		}
				//	})
				//}</InfoModal>;
				//"content": "<ul>
				//	<li>Languages can be broadly classified on two continuums based on their <strong>morphemes</strong>.
				//		<ul><li>A morpheme is the most basic unit of meaning in a language. For example, the word \"cats\" has two morphemes: \"cat\" (a feline animal) and \"s\" (more than one of them are being talked about).</li></ul>
				//	</li>
				//	<li class=\"newSection\"><strong>Synthesis</strong> is a measure of how many morphemes appear in a word.
				//		<ul><li>Chinese is very <em>isolating</em>, tending towards one morpheme per word.</li>
				//			<li>Inuit and Quechua are very <em>polysynthetic</em>, with many morphemes per word.</li>
				//		</ul>
				//	</li>
				//	<li class=\"newSection\"><strong>Fusion</strong> is a measure of how many meanings a single morpheme can encode.
				//		<ul><li>Completely isolating languages, be definiton, always lack fusion.</li>
				//			<li>Spanish can be very <em>fusional</em>, with a single suffix capable of encoding tense (8.3.1), aspect (8.3.2), mood (8.3.3) and number (4.3).</li>
				//			<li>Though fusional forms are possible (e.g. swam, was), English is mostly <em>agglutinative</em>, with one meaning per morpheme.
				//				<ul><li>e.g. \"antidisestablishmentarianism\"<br />
				//					<TransTable rows=\"anti dis es&shy;tab&shy;lish ment ary an ism / against undo es&shy;tab&shy;lish in&shy;stance__of__verb of__or__like__the__noun per&shy;son be&shy;lief__sys&shy;tem\"></TransTable>
				//					(The \"establishment\" in question is actually contextually fusional, as it refers to the Church of England receiving government patronage, so the full meaning of the word is \"the belief system of opposing the people who want to remove the government patronage of the Church of England.\")</li>
				//				</ul>
				//			</li>
				//		</ul>
				//	</li>
				//</ul>"
				//<TransTable rows=\"ne ye so ye / 1s PST horse see\">\"I saw a horse\"</TransTable>
				//<TransTable rows=\"Nyaa '-ashvar-k '-iima-k / I 1-sing-SS 1-dance-ASPECT\" />
				const TransTable = (props) => {
					const rows = (props.rows || "").trim().split(/\s+\/\s+/);
					let length = 1;
					let cName = "translation";
					if(props.className) {
						cName += " " + props.className;
					}
					const final = props.children;
					let finalRow = -1;
					if(final) {
						finalRow = rows.length;
						rows.push(final);
					}
					const mainRows = rows.filter((row) => row).map((row, i) => {
						if(i === finalRow) {
							return <tr key={"ROW-" + String(i)}><td colSpan={length}>{row}</td></tr>;
						}
						const tds = row.split(/\s+/);
						length = Math.max(length, tds.length);
						return <tr key={"ROW-" + String(i)}>{
								tds.filter((el) => el).map((el, i) => <td key={"TD-" + String(i)}>{el.replace(/__/g, " ")}</td>)
							}</tr>;
						});
					return <table className={cName}><tbody>{mainRows}</tbody></table>;
				}
				return (
					<>
						<Modal size="5/6" m="auto" isOpen={synState[id] !== undefined} onClose={() => dispatch(setSyntaxState(id, false))}>
							<Modal.CloseButton />
							<Modal.Header>{bit.title}</Modal.Header>
							<Modal.Body>
								<RenderHtml contentWidth={width} source={bit.content} customHTMLElementModels={customHTMLElementModels} renderers={renderers} />
								{
//								doParse(bit.content || "", {
//									replace: node => {
//										if(node instanceof Element && node.attribs && node.name === "transtable") {
//											return <TransTable rows={node.attribs.rows} className={node.attribs.className || ""}>{node.children.length ? (node.children[0]).data : ""}</TransTable>;
//										}
//									}
//								})
								}
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