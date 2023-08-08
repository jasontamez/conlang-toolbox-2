import {
	Heading,
	VStack,
	Link,
	Text,
	ScrollView,
	Image,
	Box,
	Center
} from 'native-base';
import { useWindowDimensions } from 'react-native';
import { openURL } from 'expo-linking';

import getSizes from '../helpers/getSizes';
import { fontSizesInPx } from '../store/appStateSlice';

const Credits = () => {
	const [headerSize, textSize, appHeaderSize] = getSizes("xl", "md", "lg");
	const {width, height} = useWindowDimensions();

	// Calculate coffee image width
	const originalWidth = 553;
	const originalHeight = 109;
	let bannerWidth = originalWidth;
	let bannerHeight = originalHeight;
	let fractional = 1.0;
	// Keep at least 25px margins
	const minimum = Math.min(width - 50, Math.floor(width * 2 / 3))
	while(fractional > 0 && minimum < bannerWidth) {
		fractional -= 0.1;
		bannerWidth = originalWidth * fractional;
		bannerHeight = originalHeight * fractional;
	}

	// Handle window size
	const appHeaderHeight = fontSizesInPx[appHeaderSize] * 2.5;
	const scrollpadding = 24; // p is {3} - scrollview
	const imagemargin = 40; // my is {5} - center
	const availableHeight = height - appHeaderHeight - imagemargin - scrollpadding - bannerHeight;

	// return JSX
	return (
		<ScrollView
			p={3}
			bg="darker"
		>
			<Box style={{ minHeight: availableHeight }}>
				<VStack
					m={5}
					shadow={3}
					bg="main.800"
					p={4}
					pt={0}
					alignItems="center"
					justifyContent="flex-start"
					space={5}
					borderRadius="xl"
				>
					<Heading color="primary.500" p={4} fontSize={headerSize} textAlign="center">Credits and Acknowledgements</Heading>
					<Box>
						<Text fontSize={textSize} textAlign="center">
							App icon is based on{' '}
							<Text onPress={() => openURL("https://thenounproject.com/term/toolbox/2586725/")} underline color="primary.500">Toolbox by Maxicons</Text>
							{' '}from the Noun Project
						</Text>
					</Box>
					<Box>
						<Text fontSize={textSize} textAlign="center">
							WordGen and WordEvolve are heavily inspired by{' '}
							<Text onPress={() => openURL("http://www.zompist.com/gen.html")} underline color="primary.500">Gen</Text>
							{' '}and{' '}
							<Text onPress={() => openURL("https://www.zompist.com/sca2.html")} underline color="primary.500">SCA²</Text>
							{' '}by Mark Rosenfelder
						</Text>
					</Box>
				</VStack>
			</Box>
			<Center my={5}><Link href="https://www.buymeacoffee.com/jasontank" textAlign="center">
				<Image source={require('../assets/buymeacoffee.png')} width={bannerWidth} height={bannerHeight} borderRadius="xl" alt="Buy me a coffee?" />
			</Link></Center>
		</ScrollView>
	);
};

export default Credits;
