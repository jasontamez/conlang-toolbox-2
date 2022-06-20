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

const parseMSJSON = (page) => {
	const doc = ms[page];
	const key = page + "-";
	let counter = 0;
	return doc.map((bit) => {
		counter++;
		const tag = (bit.tag || "");
		switch(tag) {
			case "Header":
				return <HeaderItem key={key + String(counter)} level={bit.level}>{bit.content}</HeaderItem>;
			case "Range":
				return <RangeItem key={key + String(counter)} prop={bit.prop} start={bit.start} end={bit.end} innerClass={bit.spectrum ? "spectrum" : undefined} max={bit.max || undefined} />;
			case "Text":
				return <TextItem key={key + String(counter)} prop={bit.prop} rows={bit.rows || undefined}>{bit.content || ""}</TextItem>
			case "Modal":
				return <InfoModal key={key + String(counter)} title={bit.title} label={bit.label || undefined}>{
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
				const printRow = (row, key, cn = "") => {
					const label = row.pop() || "";
					let cc = 0;
					return (
						<IonRow className={cn || undefined} key={"ROW-" + String(key)}>
							{row.map((c) => <IonCol className="cbox" key={"X-" + String(cc++)}><RadioBox prop={String(c)} /></IonCol>)}
							<IonCol key={"LX-" + String(cc++)}>{doParse(label)}</IonCol>
						</IonRow>
					);
				};
				const printRowWithLabel = (row, key, cn = "") => {
					const final = row.pop() || "";
					const label = labels.shift() || "";
					const labelClass = disp.labelClass || "label"
					let cc = 0;
					return (
						<IonRow className={cn || undefined} key={"ROW-" + String(key)}>
							{row.map((c) => <IonCol className="cbox" key={"C-" + String(cc++)}><RadioBox prop={String(c)} /></IonCol>)}
							<IonCol className={labelClass} key={"LC-" + String(cc++)}>{doParse(label)}</IonCol>
							<IonCol key={"FC-" + String(cc++)}>{doParse(final)}</IonCol>
						</IonRow>
					);
				};
				const printHeaderRow = (row, key, hasLabel = false) => {
					const final = row.pop() || "";
					let label = "";
					if(hasLabel) {
						label = row.pop();
					}
					let cc = 0;
					return (
						<IonRow className="header" key={"ROW-" + String(key)}>
							{row.map((c) => <IonCol className="cbox" key={"B-" + String(cc++)}>{c}</IonCol>)}
							{label ? <IonCol className={disp.labelClass || "label"} key={"L-" + String(cc++)}>{doParse(label)}</IonCol> : label}
							<IonCol key={"F-" + String(cc++)}>{doParse(final)}</IonCol>
						</IonRow>
					);
				};
				count = 1;
				return (
					<IonItem className="content" key={key + String(counter)}>
						<IonGrid className={disp.class || undefined}>
							{header ? <IonRow key="headerRow-0" className="header"><IonCol>{doParse(header)}</IonCol></IonRow> : ""}
							{inlineHeaders ? printHeaderRow(inlineHeaders.slice(), count++, !!disp.labels) : ""}
							{rows.map((r) => disp.labels ? printRowWithLabel(r.slice(), count++) : printRow(r.slice(), count++))}
						</IonGrid>
					</IonItem>
				);
		}
		return "";
	});
};

const Section = () => {
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

export default Section;