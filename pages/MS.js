import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-native';
import { ScrollView, VStack, Box } from 'native-base';

const MS = () => {
	//const msPage = useSelector((state) => state.viewState.ms, shallowEqual) || "msSettings";
	const location = useLocation();
	const scrollRef = useRef(null);
	useEffect(() => {
		scrollRef.current.scrollTo({x: 0, y: 0, animated: false});
	}, [location]);
	return (
		<VStack
			alignItems="stretch"
			justifyContent="space-between"
			left={0}
			bottom={0}
			right={0}
			flex={1}
			mb={8}
		>
			<Box flex="2 2 5/6" mt={0} mx={4}>
				<ScrollView ref={scrollRef} h="full">
					<Outlet />
				</ScrollView>
			</Box>
		</VStack>
	);
};

export default MS;
