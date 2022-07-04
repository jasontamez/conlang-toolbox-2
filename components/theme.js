//import React from "react";
import { extendTheme } from "native-base";

const fontConfig = {
	Arimo: {
		400: {
			normal: "Arimo_400Regular",
			italic: "Arimo_400Regular_Italic"
		},
		700: {
			normal: "Arimo_700Bold",
			italic: "Arimo_700Bold_Italic"
		}
	},
	"Noto Sans": {
		400: {
			normal: "NotoSans_400Regular",
			italic: "NotoSans_400Regular_Italic"
		},
		700: {
			normal: "NotoSans_700Bold",
			italic: "NotoSans_700Bold_Italic"
		}
	},
	"Noto Sans JP": {
		100: {
			normal: "NotoSansJP_100Thin",
		},
		300: {
			normal: "NotoSansJP_300Light",
		},
		400: {
			normal: "NotoSansJP_400Regular",
		},
		500: {
			normal: "NotoSansJP_500Medium",
		},
		700: {
			normal: "NotoSansJP_700Bold",
		},
		900: {
			normal: "NotoSansJP_900Black",
		}
	},
	"Noto Serif": {
		400: {
			normal: "NotoSerif_400Regular",
			italic: "NotoSerif_400Regular_Italic"
		},
		700: {
			normal: "NotoSerif_700Bold",
			italic: "NotoSerif_700Bold_Italic"
		}
	},
	"Noto Serif JP": {
		200: {
			normal: "NotoSerifJP_200ExtraLight",
		},
		300: {
			normal: "NotoSerifJP_300Light",
		},
		400: {
			normal: "NotoSerifJP_400Regular",
		},
		500: {
			normal: "NotoSerifJP_500Medium",
		},
		600: {
			normal: "NotoSerifJP_600SemiBold",
		},
		700: {
			normal: "NotoSerifJP_700Bold",
		},
		900: {
			normal: "NotoSerifJP_900Black",
		}
	},
	"DM Mono": {
		300: {
			normal: "DMMono_300Light",
			italic: "DMMono_300Light_Italic"
		},
		400: {
			normal: "DMMono_400Regular",
			italic: "DMMono_400Regular_Italic"
		},
		500: {
			normal: "DMMono_500Medium",
			italic: "DMMono_500Medium_Italic"
		}
	},
	Scherherazade: {
		400: {
			normal: "Scheherazade_400Regular",
		},
		700: {
			normal: "Scheherazade_700Bold",
		}
	},
	ArTarumianKamar: {
		500: {
			normal: "ArTarumianKamar"
		}
	},
	Leelawadee: {
		500: {
			normal: "LeelawadeeUI"
		},
		700: {
			normal: "LeelawadeeUI_Bold"
		}
	}
};

const fonts = {
	heading: "'Noto Sans', 'Noto Sans JP', 'Arimo', 'ArTarumianKamar', 'Scheherazade', 'Sriracha', 'Leelawadee'",
	body: "'Noto Sans', 'Noto Sans JP', 'Arimo', 'ArTarumianKamar', 'Scheherazade', 'Sriracha', 'Leelawadee'",
	mono: "DM Mono",
	serif: "'Noto Serif', 'Noto Serif JP'"
};

const mainButton = {
	defaultProps: {
		colorScheme: "success",
		_icon: {
			color: "main.900"
		},
		_text: {
			color: "main.900",
			fontFamily: "body"
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
		color: "main.50",
		fontFamily: "body"
	}
};
const mainHeading = {
	defaultProps: {
		color: "main.50",
		fontFamily: "heading"
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
		},
		fontFamily: "body"
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
	Heading: {...mainHeading},
	Text: {...mainFG},
	Link: {
		defaultProps: {
			fontFamily: "body"
		}
	},
	Input: {...mainInput},
	TextArea: {...mainInput},
	Radio: {...mainInput},
	Select: {...mainInput},
	SliderTrack: {
		defaultProps: {
			bg: "secondary.600"
		}
	},
	SliderFilledTrack: {
		defaultProps: {
			bg: "secondary.400"
		}
	},
	SliderThumb: {
		defaultProps: {
			bg: "secondary.400",
			_hover: {
				outlineColor: "secondary.200",
				borderColor: "secondary.200",
				_web: {
					outlineColor: "secondary.400",
					borderColor: "secondary.400"
				}
			},
			_focus: {
				outlineColor: "secondary.400",
				borderColor: "secondary.400",
				_web: {
					outlineColor: "secondary.400",
					borderColor: "secondary.400"
				}
			},
			_pressed: {
				_interactionBox: {
					borderColor: "secondary.400"
				}
			}
		}
	},
	Checkbox: {
		defaultProps: {
			bg: "main.900",
			borderColor: "primary.700",
			_text: {
				color: "white",
				fontFamily: "body"
			},
			_icon: {
				color: "primary.900"
			},
			_checked: {
				borderColor: "primary.500",
				bg: "primary.500",
				_hover: {
					borderColor: "primary.300",
					bg: "primary.300",
					_disabled: {
						borderColor: "gray.500",
						bg: "gray.900"
					},
				},
				_pressed: {
					borderColor: "primary.300",
					bg: "primary.300",
				}
			},
			_hover: {
				borderColor: "primary.400",
				_disabled: {
					borderColor: "gray.500",
				}
			},
			_pressed: {
				borderColor: "primary.300",
			},
			_invalid: {
				borderColor: "error.500",
			},
			_disabled: {
				borderColor: "gray.500",
				bg: "gray.900"
			}
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
				50: "#d8ffff",
				100: "#acffff",
				200: "#7dffff",
				300: "#4dffff",
				400: "#28ffff",
				500: "#18e5e6",
				600: "#00b2b3",
				700: "#007f80",
				800: "#004d4e",
				900: "#001b1d",
			},
			emerald: {
				50: "#e7f9f4",
				100: "#cbe6e0",
				200: "#add5cd",
				300: "#8cc4bb",
				400: "#6eb4aa",
				500: "#559a93",
				600: "#427874",
				700: "#2e5554",
				800: "#193434",
				900: "#001211",
			},
			red: {
				50: "#ffe2e2",
				100: "#ffb1b2",
				200: "#ff7f7f",
				300: "#ff4d4d",
				400: "#fe1d1b",
				500: "#e50501",
				600: "#b30000",
				700: "#810000",
				800: "#4f0000",
				900: "#200000",
			},
			purple: {
				50: "#f2e5ff",
				100: "#d2b5ff",
				200: "#b285fa",
				300: "#9356f7",
				400: "#7425f3",
				500: "#5a0cda",
				600: "#4608aa",
				700: "#32057b",
				800: "#1e024c",
				900: "#0c001e",
			},
			blue: {
				50: "#e3e8ff",
				100: "#b2b9ff",
				200: "#7f8aff",
				300: "#4d5bff",
				400: "#1d2cfe",
				500: "#0514e5",
				600: "#000eb3",
				700: "#000a81",
				800: "#000550",
				900: "#000120",
			},
			lime: {
				50: "#ebfbe4",
				100: "#d1eec1",
				200: "#b5e19c",
				300: "#97d576",
				400: "#7bc950",
				500: "#61af36",
				600: "#4b8829",
				700: "#34611c",
				800: "#1d3b0e",
				900: "#051500",
			},
			yellow: {
				50: "#fff9da",
				100: "#ffecad",
				200: "#ffdf7d",
				300: "#ffd24b",
				400: "#ffc51a",
				500: "#e6ac00",
				600: "#b38600",
				700: "#805f00",
				800: "#4e3900",
				900: "#1d1300",
			},
			lighter: "#ffffff11",
			darker: "#00000033",
			bg: "#070707",
			fg: "#f8f8f8",
			white: "#f8f8f8",
			black: "#070707",
			lightText: "#f8f8f8",
			darkText: "#070707"
		}
	}
};
const mappings = {
	"Default": ["emerald", "red", "red", "lime", "yellow", "teal", "teal", "purple", "blue"]
};
const themeNames = Object.keys(mappings);
themeNames.forEach((themeName) => {
	// Isolate the current theme
	const workingTheme = themes[themeName];
	// Get the map of colors
	const colors = mappings[themeName];
	// Get the color namespaces
	const props = ["main", "danger", "error", "success", "warning", "info", "primary", "secondary", "tertiary"];
	// Isolate the colors property of the theme
	const themeColors = workingTheme.colors;
	// Apply the namespaces to the theme
	colors.forEach(color => {
		const prop = props.shift();
		themeColors[prop] = {...themeColors[color]};
	});
	// Apply component defaults to the theme
	workingTheme.components = {...components};
	// Apply font defaults to the theme
	workingTheme.fontConfig = fontConfig;
	workingTheme.fonts = fonts;
});

const getTheme = (themeName) => {
	const theme = extendTheme(themes[themeName] || {});
	return theme;
};

export {
	getTheme as default,
	themeNames as availableThemes
};
