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
import doParse from 'html-react-parser';
import { useParams } from 'react-router-dom';
import { Heading, Slider, Text } from 'native-base';

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
		switch(tag) {
			case "Header":
				return <Heading bold fontSize={headings[bit.level || 0]}>{bit.content}</Heading>;
			case "Range":
				const dispatch = useDispatch();
				const synNum = useSelector((state) => state.morphoSyntaxInfo.num)
				const what = bit.prop;
				const setNum = (what, value) => {
					dispatch(setSyntaxNum(what, value));
				};
				return (
					<HStack d="flex" w="100%" alignItems="stretch" justifyContent="space-between">
						<Text>{bit.start}</Text>
						<Slider flexGrow={1} w="3/4" defaultValue={synNum[what] || 0} minValue={0} maxValue={bit.max || 4} accessibilityLabel={bit.label} step={1} colorScheme="secondary" onChangeEnd={(v) => setNum(what, v)}>
							<Slider.Track bg="secondary.900">
								{bit.spectrum ? <Slider.FilledTrack /> : <></>}
							</Slider.Track>
							<Slider.Thumb />
						</Slider>
						<Text>{bit.end}</Text>
					</HStack>
				);
			case "Text":
				return <TextItem prop={bit.prop} rows={bit.rows || undefined}>{bit.content || ""}</TextItem>
			case "Modal":
				return <InfoModal title={bit.title} label={bit.label || undefined}>{
					doParse(bit.content || "", {
						replace: node => {
							if(node instanceof Element && node.attribs && node.name === "transtable") {
								return <TransTable rows={node.attribs.rows} className={node.attribs.className || ""}>{node.children.length ? (node.children[0]).data : ""}</TransTable>;
							}
							return node;
						}
					})
				}</InfoModal>;
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