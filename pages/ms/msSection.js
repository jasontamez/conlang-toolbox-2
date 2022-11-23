import { useParams } from 'react-router-dom';
import {
	Box,
	Text
} from 'native-base';


import Section01 from './msSection01';
import Section02 from './msSection02';
import Section03 from './msSection03';
import Section04 from './msSection04';
import Section05 from './msSection05';
import Section06 from './msSection06';
import Section07 from './msSection07';
import Section08 from './msSection08';
import Section09 from './msSection09';
import Section10 from './msSection10';


const Section = () => {
	const { msPage } = useParams();

	switch (msPage.slice(-2)) {
		case "01":
			return <Section01 />;
		case "02":
			return <Section02 />;
		case "03":
			return <Section03 />;
		case "04":
			return <Section04 />;
		case "05":
			return <Section05 />;
		case "06":
			return <Section06 />;
		case "07":
			return <Section07 />;
		case "08":
			return <Section08 />;
		case "09":
			return <Section09 />;
		case "10":
			return <Section10 />;
	}
	return <Box><Text>Section {msPage} not found.</Text></Box>;
};

export default Section;