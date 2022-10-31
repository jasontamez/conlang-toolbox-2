import { useEffect, useRef, useState } from 'react';
import {
	HStack,
	IconButton,
	Button,
	Modal,
	Text
} from 'native-base';

import {
	CloseCircleIcon,
	LoadIcon,
	ResetIcon
} from '../components/icons';
import { DropDown } from '../components/inputTags';

const LoadingColumnsPickerModal = ({
	modalOpen,
	closeModal,
	currentColumns,
	incomingColumns,
	textSize,
	primaryContrast,
	endingFunc
}) => {
	// TO-DO: lots of state variables?
	const [unusedIncoming, setUnusedIncoming] = useState([]);
	const [columnsChosen, setColumnsChosen] = useState([]);

	const resetAll = () => {
		// everything starts unused
		setUnusedIncoming(incomingColumns.map((col, i) => i));
		// set all selections to "nothing"
		const chosen = currentColumns.map(() => null);
		setColumnsChosen(chosen);
	};
	useEffect(() => {
		resetAll();
	}, [currentColumns, incomingColumns]);

	// TO-DO: We need to check for entirely blank appending
	//   It's likely a user error, and anyway, we can't append
	//   a bunch of blank lines!

	return (
		<Modal isOpen={modalOpen}>
			<Modal.Content>
				<Modal.Header
					bg="primary.500"
					borderBottomWidth={0}
					px={3}
				>
					<HStack w="full" justifyContent="space-between" alignItems="center" pl={1.5}>
						<Text color={primaryContrast} fontSize={textSize}>Organize Columns</Text>
						<IconButton
							icon={<CloseCircleIcon color={primaryContrast} size={textSize} />}
							onPress={closeModal}
							variant="ghost"
							px={0}
						/>
					</HStack>
				</Modal.Header>
				<Modal.Body>
					{
						// TO-DO: Code goes here
						// Explanation at top
						// currentColumns.map()
						// possible values = null + unused + current value
						// probably DropDown tags
						currentColumns.map((col, i) => {
							const valSort = (a, b) => {
								if(a === null) {
									return -1;
								} else if (b === null) {
									return 1;
								}
								return a - b;
							};
							const okToProceed = incomingColumns.length > 0;
							let possibles = unusedIncoming.slice();
							const current = okToProceed ? columnsChosen[i] : null;
							if(okToProceed) {
								if(current !== null && current !== undefined) {
									possibles.push(current);
								}
								possibles.push(null);
								possibles.sort(valSort);
							} else {
								possibles = [null];
							}
							return (
								<HStack
									justifyContent="space-between"
									alignItems="center"
									px={2}
									py={1}
									key={`${i}/${col.label}/HStack`}
								>
									<Text fontSize={textSize}>{col.label}</Text>
									<DropDown
										fontSize={textSize}
										title="Incoming Column:"
										labelFunc={() => current == null ? "(blank)" : incomingColumns[current].label}
										onChange={(newValue) => {
											// remove new value from unused
											let newUnused = unusedIncoming.filter(ui => ui !== newValue);
											if(current !== null) {
												// add in current value (if not null)
												newUnused.push(current);
											}
											newUnused.sort(valSort);
											setUnusedIncoming(newUnused);
											// Set chosen column
											setColumnsChosen(columnsChosen.map((cc, ind) => {
												return ind === i ? newValue : cc
											}));
										}}
										defaultValue={null}
										options={possibles.map(p => {
											if(p === null) {
												return {
													key: `${i}/${p}/blank`,
													value: null,
													label: "(blank)"
												};
											}
											const {id, label} = incomingColumns[p];
											return {
												key: `${i}/${id}/${label}`,
												value: p,
												label
											};
										})}
										buttonProps={{ marginLeft: 2 }}
									/>
								</HStack>
							);
						})
					}
				</Modal.Body>
				<Modal.Footer
					borderTopWidth={0}
				>
					<HStack
						justifyContent="space-between"
						w="full"
						flexWrap="wrap"
					>
						<Button
							bg="lighter"
							_text={{color: "text.50", fontSize: textSize}}
							p={1}
							m={2}
							onPress={closeModal}
						>Cancel</Button>
						<Button
							startIcon={<ResetIcon color="warning.50" m={0} size={textSize} />}
							bg="warning.500"
							_text={{color: "warning.50", fontSize: textSize}}
							p={1}
							m={2}
							onPress={resetAll}
						>Reset</Button>
						<Button
							startIcon={<LoadIcon color="success.50" m={0} size={textSize} />}
							bg="success.500"
							_text={{color: "success.50", fontSize: textSize}}
							p={1}
							m={2}
							disabled={unusedIncoming.length === incomingColumns.length}
							onPress={() => endingFunc(columnsChosen)}
						>Load Lexicon</Button>
					</HStack>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};

export default LoadingColumnsPickerModal;
