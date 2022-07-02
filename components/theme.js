//import React from 'react';
import { extendTheme } from 'native-base';

const mainButton = {
	defaultProps: {
		colorScheme: "info",
		color: "white",
		_icon: {
			color: "main.50"
		},
		_text: {
			color: "main.50"
		}
	}
};
const mainBG = {
	defaultProps: {
		bg: "main.800"
	}
};
const mainFG = {
	defaultProps: {
		color: "main.50"
	}
};
const mainInput = {
	defaultProps: {
		bg: "darker",
		color: "main.50",
		borderColor: "main.700",
		_focus: {
			borderColor: "main.500",
			color: "main.50",
			bg: "darker"
		}
	}
};

const components = {
	Button: {...mainButton},
	IconButton: {...mainButton},
	Modal: {...mainBG},
	ModalBody: {...mainBG},
	ModalHeader: {
		defaultProps: {
			bg: "main.700",
			shadowColor: "main.900",
			shadowOffset: {
				width: 0,
				height: 5,
			},
			shadowOpacity: 0.34,
			shadowRadius: 6.27,
			elevation: 10,
			borderColor: "main.500"
		}
	},
	ModalContent: {...mainBG},
	ModalFooter: {
		defaultProps: {
			bg: "main.700",
			shadowColor: "main.900",
			shadowOffset: {
				width: 0,
				height: -5,
			},
			shadowOpacity: 0.34,
			shadowRadius: 6.27,
			elevation: 10,
			borderColor: "main.500"
		}
	},
	ModalCloseButton: {...mainFG},
	ScrollView: {
		variants: {
			tabular: {
				bg: "main.900",
				borderWidth: 2,
				borderColor: "main.700"
			}
		}
	},
	Heading: {...mainFG},
	Text: {...mainFG},
	Input: {...mainInput},
	TextArea: {...mainInput},
	Checkbox: {
		defaultProps: {
			bg: 'primary.900',
			borderColor: 'primary.400',
			_text: {
				color: 'white',
			},
			_icon: {
				color: `secondary.900`,
			},
			_checked: {
				borderColor: "secondary.500",
				bg: "secondary.500",
				_hover: {
					borderColor: "secondary.400",
					bg: "secondary.400",
					_disabled: {
						borderColor: "secondary.500",
						bg: "secondary.500",
					},
				},
				_pressed: {
					borderColor: "secondary.300",
					bg: "secondary.300",
				},
			},
			_hover: {
				borderColor: 'secondary.400',
				_disabled: {
					borderColor: 'secondary.500',
				},
			},
			_pressed: {
				borderColor: 'secondary.300',
			},
			_invalid: {
				borderColor: 'error.500',
			},
		}
	},
	Icon: {...mainFG},
	NativeBaseProvider: {...mainBG},
	Box: {
		variants: {
			main: {
				...mainBG
			}
		}
	}
};

const themes = {
	Default: {
		colors: {
			teal: {
				50: '#d8ffff',
				100: '#acffff',
				200: '#7dffff',
				300: '#4dffff',
				400: '#28ffff',
				500: '#18e5e6',
				600: '#00b2b3',
				700: '#007f80',
				800: '#004d4e',
				900: '#001b1d',
			},
			green: {
				50: "#55d068",
				100: "#41cb56",
				200: "#35be49",
				300: "#2faa41",
				400: "#2a963a",
				500: "#248232",
				600: "#1e6e2a",
				700: "#195a23",
				800: "#13461b",
				900: "#0e3213"
			},
			emerald: {
				50: '#e7f9f4',
				100: '#cbe6e0',
				200: '#add5cd',
				300: '#8cc4bb',
				400: '#6eb4aa',
				500: '#559a93',
				600: '#427874',
				700: '#2e5554',
				800: '#193434',
				900: '#001211',
			},
			red: {
				50: "#fb2249",
				100: "#fa0934",
				200: "#e5042d",
				300: "#cc0428",
				400: "#b30323",
				500: "#9a031e",
				600: "#810319",
				700: "#680214",
				800: "#4f020f",
				900: "#36010b"
			},
			lightBlue: {
				50: "#a0c1d4",
				100: "#8eb5cc",
				200: "#7daac4",
				300: "#6b9ebc",
				400: "#5993b4",
				500: "#4c86a8",
				600: "#447896",
				700: "#3c6a85",
				800: "#345c73",
				900: "#2c4e62"
			},
			rose: {
				50: "#ca7f89",
				100: "#c26d78",
				200: "#bb5b67",
				300: "#b24a58",
				400: "#a0424f",
				500: "#8e3b46",
				600: "#7c343d",
				700: "#6a2c34",
				800: "#58252b",
				900: "#461d22"
			},
			purple: {
				50: "#d229a9",
				100: "#bc2598",
				200: "#a72087",
				300: "#921c75",
				400: "#7c1864",
				500: "#671453",
				600: "#521042",
				700: "#3c0c31",
				800: "#27081f",
				900: "#12030e"
			},
			pink: {
				50: "#ffe2eb",
				100: "#ffc9d9",
				200: "#ffafc7",
				300: "#ff96b6",
				400: "#ff7ca4",
				500: "#ff6392",
				600: "#ff4980",
				700: "#ff306e",
				800: "#ff165d",
				900: "#fc004c"
			},
			orange: {
				50: "#fec173",
				100: "#feb65a",
				200: "#feaa40",
				300: "#fe9f27",
				400: "#fe940e",
				500: "#f18701",
				600: "#d87901",
				700: "#be6b01",
				800: "#a55c01",
				900: "#8b4e01"
			},
			lighter: "#ffffff11",
			darker: "#00000033",
			bg: "#070707",
			fg: "#f8f8f8",
			white: '#f8f8f8',
			black: '#070707',
			lightText: '#f8f8f8',
			darkText: '#070707'
		}
	}
};
const mappings = {
	"Default": ["emerald", "purple", "rose", "pink", "orange", "lightBlue", "teal", "green", "red"]
};
const themeNames = Object.keys(mappings);
themeNames.forEach((themeName) => {
	const colors = mappings[themeName];
	const props = ["main", "danger", "error", "success", "warning", "info", "primary", "secondary", "tertiary"];
	const themeColors = themes[themeName].colors;
	colors.forEach(color => {
		const prop = props.shift();
		themeColors[prop] = {...themeColors[color]};
	});
	// Apply component defaults to the theme
	themes[themeName].components = {...components};
});

const getTheme = (themeName) => {
	const theme = extendTheme(themes[themeName] || {});
	//console.log(themeName);
	//console.log(themes[themeName]);
	//console.log(theme);
	return theme;
};

export {
	getTheme as default,
	themeNames as themes
};
