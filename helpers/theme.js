//import React from "react";
import { extendTheme } from "native-base";

const breakpoints = {
	sm: 390,
	md: 600,
	lg: 992,
	xl: 1280
}

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
	"Source Code Pro": {
		200: {
			normal: "SourceCodePro_200ExtraLight",
			italic: "SourceCodePro_200ExtraLight_Italic",
		},
		300: {
			normal: "SourceCodePro_300Light",
			italic: "SourceCodePro_300Light_Italic",
		},
		400: {
			normal: "SourceCodePro_400Regular",
			italic: "SourceCodePro_400Regular_Italic",
		},
		500: {
			normal: "SourceCodePro_500Medium",
			italic: "SourceCodePro_500Medium_Italic",
		},
		600: {
			normal: "SourceCodePro_600SemiBold",
			italic: "SourceCodePro_600SemiBold_Italic",
		},
		700: {
			normal: "SourceCodePro_700Bold",
			italic: "SourceCodePro_700Bold_Italic",
		},
		800: {
			normal: "SourceCodePro_800ExtraBold",
			italic: "SourceCodePro_800ExtraBold_Italic",
		},
		900: {
			normal: "SourceCodePro_900Black",
			italic: "SourceCodePro_900Black_Italic",
		}
	},
	ArTarumianKamar: {
		500: {
			normal: "ArTarumianKamar"
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
	Sriracha: {
		400: {
			normal: "Sriracha_400Regular"
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

const fonts = { // Temporary fix until I figure out how to have fallback fonts (if possible?)
//	heading: "'Noto Sans', 'Noto Sans JP', 'Arimo', 'ArTarumianKamar', 'Scheherazade', 'Sriracha', 'Leelawadee'",
	heading: "Noto Sans",
//	body: "'Noto Sans', 'Noto Sans JP', 'Arimo', 'ArTarumianKamar', 'Scheherazade', 'Sriracha', 'Leelawadee'",
	body: "Noto Sans",
	mono: "Source Code Pro",
//	serif: "'Noto Serif', 'Noto Serif JP'",
	serif: "Noto Serif"
};

const mainButton = {
	defaultProps: {
		colorScheme: "success",
		_icon: {
			color: "success.50"
		},
		_text: {
			color: "success.50",
//			fontFamily: "body",
			fontWeight: 400,
			fontStyle: "normal",
			style: {
				fontVariant: ["small-caps"]
			}
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
		color: "text.50",
//		fontFamily: "body",
		fontWeight: 400,
		fontStyle: "normal"
	}
};
const mainHeading = {
	defaultProps: {
		color: "text.50",
//		fontFamily: "heading",
		fontWeight: 700,
		fontStyle: "normal"
	}
};
const mainInput = {
	defaultProps: {
		bg: "lighter",
		color: "text.50",
		borderRadius: 0,
		placeholderTextColor: "text.200",
		borderColor: "transparent",
		_focus: {
			borderColor: "main.500",
			color: "text.50",
			bg: "lighter",
			borderRadius: 0
		},
//		fontFamily: "body",
		fontWeight: 400,
		fontStyle: "normal"
	}
};
const mainCheckboxesDefaultProps = {
	bg: "lighter",
	borderColor: "text.100",
	_text: {
		color: "primaryContrast",
//		fontFamily: "body",
		fontWeight: 400,
		fontStyle: "normal"
	},
	_icon: {
		color: "primaryContrast"
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
};
const modalProps = {
	defaultProps: {
		avoidKeyboard: true,
		size: "xl",
		maxWidth: "full",
		_backdrop: {
			opacity: 60
		}
	}
};
const mainModalHeader = {
	defaultProps: {
		avoidKeyboard: true,
		bg: "main.700",
		shadowColor: "main.900",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.34,
		shadowRadius: 6.27,
		elevation: 10,
		borderColor: "main.500",
		p: 0,
		m: 0
	}
};
const mainModalFooter = {
	defaultProps: {
		avoidKeyboard: true,
		bg: "main.700",
		shadowColor: "main.900",
		shadowOffset: {
			width: 0,
			height: -5,
		},
		shadowOpacity: 0.34,
		shadowRadius: 6.27,
		elevation: 10,
		borderColor: "main.500",
		p: 0,
		m: 0
	}
};
const mainModalCloseButton = {
	defaultProps: {
		_icon: {
			color: "text.50"
		}
	}
};

const components = {
	Button: {...mainButton},
	IconButton: {...mainButton},
	Modal: {...modalProps},
	ModalContent: {
		defaultProps: {
			maxWidth: "full",
			...mainBG.defaultProps
		}
	},
	ModalHeader: {...mainModalHeader},
	ModalBody: {
		defaultProps: {
			p: 3,
			...mainBG.defaultProps
		}
	},
	ModalFooter: {...mainModalFooter},
	ModalCloseButton: {...mainModalCloseButton},
	AlertDialog: {...modalProps},
	AlertDialogContent: {...mainBG},
	AlertDialogHeader: {...mainModalHeader},
	AlertDialogBody: {
		defaultProps: {
			p: 3,
			...mainBG.defaultProps
		}
	},
	AlertDialogFooter: {...mainModalFooter},
	AlertDialogCloseButton: {...mainModalCloseButton},
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
	Pressable: {...mainFG},
	Link: {
		defaultProps: {
//			fontFamily: "body",
			fontWeight: 400,
			fontStyle: "normal"
		}
	},
	Input: {...mainInput},
	TextArea: {...mainInput},
	Checkbox: {
		defaultProps: {
			...mainCheckboxesDefaultProps
		}
	},
	Radio: {
		defaultProps: {
			...mainCheckboxesDefaultProps,
			_text: {
				color: "primary.50",
//				fontFamily: "body",
				fontWeight: 400,
				fontStyle: "normal"
			},
			_icon: {
				color: "primary.50"
			},
		}
	},
	Select: {...mainInput},
	Icon: {...mainFG},
	NativeBaseProvider: {...mainBG},
	Box: {
		sizes: {
			lexXs: {
				flexGrow: 1,
				flexShrink: 1,
				flexBasis: 20
			},
			lexSm: {
				flexGrow: 3,
				flexShrink: 1,
				flexBasis: 40
			},
			lexMd: {
				flexGrow: 9,
				flexShrink: 1,
				flexBasis: 96
			},
			lexLg: {
				flexGrow: 15,
				flexShrink: 1,
				flexBasis: 200
			}
		}
	},
	SliderTrack: {
		defaultProps: {
			bg: "secondary.800",
			_light: {
				bg: "secondary.800"
			},
			_dark: {
				bg: "secondary.800"
			}
		}
	},
	SliderFilledTrack: {
		defaultProps: {
			bg: "secondary.400",
			_light: {
				bg: "secondary.400"
			},
			_dark: {
				bg: "secondary.400"
			}
		}
	},
	SliderThumb: {
		defaultProps: {
			colorScheme: undefined,
			bg: "secondary.400",
			_hover: {
				outlineColor: "secondary.200",
				borderColor: "secondary.200",
				_web: {
					outlineColor: "secondary.200",
					borderColor: "secondary.200"
				}
			},
			_focus: {
				outlineColor: "secondary.200",
				borderColor: "secondary.200",
				_web: {
					outlineColor: "secondary.200",
					borderColor: "secondary.200"
				}
			},
			_pressed: {
				_interactionBox: {
					borderColor: "secondary.200",
					borderWidth: 2
				}
			},
			_light: {
				bg: "secondary.400",
				_hover: {
					outlineColor: "secondary.200",
					borderColor: "secondary.200",
					_web: {
						outlineColor: "secondary.200",
						borderColor: "secondary.200"
					}
				},
				_focus: {
					outlineColor: "secondary.200",
					borderColor: "secondary.200",
					_web: {
						outlineColor: "secondary.200",
						borderColor: "secondary.200"
					}
				},
				_pressed: {
					_interactionBox: {
						borderColor: "secondary.200",
						borderWidth: 2
					}
				}
			},
			_dark: {
				bg: "secondary.400",
				_hover: {
					outlineColor: "secondary.200",
					borderColor: "secondary.200",
					_web: {
						outlineColor: "secondary.200",
						borderColor: "secondary.200"
					}
				},
				_focus: {
					outlineColor: "secondary.200",
					borderColor: "secondary.200",
					_web: {
						outlineColor: "secondary.200",
						borderColor: "secondary.200"
					}
				},
				_pressed: {
					_interactionBox: {
						borderColor: "secondary.200",
						borderWidth: 2
					}
				}
			}
		}
	},
	Switch: {
		defaultProps: {
			onTrackColor: "lighter",
			onThumbColor: "primary.500",
			offTrackColor: "darker",
			offThumbColor: "text.900"
		}
	},
	Menu: {
		defaultProps: {
			bg: "main.900"
		}
	},
	MenuItem: {
		defaultProps: {
			_text: {
				color: "main.50",
				fontSize: "sm"
			},
			d: "flex",
			alignItems: "center",
			justifyContent: "flex-start",
			flexDirection: "row",
			_focus: {
				bg: "lighter"
			},
			_hover: {
				bg: "lighter"
			},
			_pressed: {
				bg: "lighter"
			}
		}
	},
	MenuItemOption: {
		defaultProps: {
			_text: {
				color: "main.50",
				fontSize: "sm"
			},
			_icon: {
				color: "tertiary.500"
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
				500: "#00b8b8",
				600: "#007f80",
				700: "#004d4e",
				800: "#001b1d",
				900: "#000304",
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
				400: "#7c33f5",
				500: "#6610f2",
				600: "#5a0cda",
				700: "#4608aa",
				800: "#32057b",
				900: "#1e024c",
			},
			blue: {
				50: "#f0f0ff",
				100: "#e3e8ff",
				200: "#b2b9ff",
				300: "#a9abff",
				400: "#7f8aff",
				500: "#5260ff",
				600: "#0514e5",
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
			green: {
				50: "#e5ffff",
				100: "#bcfef9",
				200: "#91fdee",
				300: "#6cfddf",
				400: "#57fcd0",
				500: "#4ce3b1",
				600: "#3bb082",
				700: "#297e57",
				800: "#154c2f",
				900: "#001a0b",
			},
			lighter: "#ffffff11",
			darker: "#00000033",
			white: "#f8f8f8",
			black: "#070707",
			sliderTickColor: "#7425f3", // purple 400
			primaryContrast: "#001211" // emerald 900
		}
	},
	"Solarized Dark": {
		colors: {
			lightBlue: {
				50: "#defbff",
				100: "#b3efff",
				200: "#86e4fd",
				300: "#5bdafc",
				400: "#3dcffb",
				500: "#30b6e2",
				600: "#218db0",
				700: "#13667e",
				800: "#003d4d",
				900: "#00151d",
			},
			orange: {
				50: "#ffebe0",
				100: "#fdcbb6",
				200: "#f5a98a",
				300: "#ef885d",
				400: "#e96630",
				500: "#cb4b16",
				600: "#a23b10",
				700: "#742a0a",
				800: "#471702",
				900: "#1e0600",
			},
			indigo: {
				50: "#ececff",
				100: "#c7caee",
				200: "#a3a7dc",
				300: "#8084cd",
				400: "#7b79c7",
				500: "#6c71c4",
				600: "#4247a4",
				700: "#323780",
				800: "#24285d",
				900: "#14183b",
			},
			cyan: {
				50: "#bce7f2",
				100: "#98d5e5",
				200: "#72c4da",
				300: "#4db4ce",
				400: "#359ab5",
				500: "#288198",
				600: "#175666",
				700: "#04343f",
				800: "#001319",
				900: "#000607",
			},
			lime: {
				50: "#fbffdc",
				100: "#f5ffaf",
				200: "#eeff7f",
				300: "#e8ff4d",
				400: "#e1ff1f",
				500: "#c8e608",
				600: "#9bb300",
				700: "#6f8000",
				800: "#414d00",
				900: "#151b00",
			},
			amber: {
				50: "#fff9db",
				100: "#ffecaf",
				200: "#ffe07f",
				300: "#ffd44d",
				400: "#ffc71e",
				500: "#e6ae06",
				600: "#b38700",
				700: "#806100",
				800: "#4e3a00",
				900: "#1d1300",
			},
			red: {
				50: "#ffe5e5",
				100: "#f9bcbc",
				200: "#ef9291",
				300: "#e66765",
				400: "#de3d3b",
				500: "#c42421",
				600: "#9a1b19",
				700: "#6e1211",
				800: "#440808",
				900: "#1e0000",
			},
			yellow: {
				50: "#fdf7e7",
				100: "#f8e4be",
				200: "#f5cc91",
				300: "#f1ad63",
				400: "#ee8b3a",
				500: "#d46827",
				600: "#a5471e",
				700: "#762c15",
				800: "#46170c",
				900: "#180502",
			},
			lighter: "#ffffff22",
			darker: "#00000033",
			white: "#f8f8f8",
			black: "#070707",
			sliderTickColor: "#323780", // indigo 600
			primaryContrast: "#defbff" // lightBlue 50
		}
	},
	"Solarized Light": {
		colors: {
			orange: {
				900: "#fdcbb6",
				800: "#f5a98a",
				700: "#ef885d",
				600: "#e96630",
				500: "#cb4b16",
				400: "#b84414",
				300: "#a23b10",
				200: "#742a0a",
				100: "#471702",
				50: "#1e0600",
			},
			indigo: {
				900: "#ececff",
				800: "#c7caee",
				700: "#a3a7dc",
				600: "#8084cd",
				500: "#7b79c7",
				400: "#6c71c4",
				300: "#4247a4",
				200: "#323780",
				100: "#24285d",
				50: "#14183b",
			},
			lime: {
				900: "#f5ffaf",
				800: "#eeff7f",
				700: "#e8ff4d",
				600: "#e1ff1f",
				500: "#859900",
				400: "#9bb300",
				300: "#6f8000",
				200: "#414d00",
				100: "#151b00",
				50: "#060700"
			},
			teal: {
				900: "#98e5df",
				800: "#71dad2",
				700: "#4dd0c5",
				600: "#34b6ac",
				500: "#258e86",
				400: "#2c7a75",
				300: "#16655f",
				200: "#043e39",
				100: "#001614",
				50: "#000807"
			},
			yellow: {
				900: "#ffe07f",
				800: "#ffd44d",
				700: "#ffc71e",
				600: "#e6ae06",
				500: "#b38700",
				400: "#9f7400",
				300: "#806100",
				200: "#4e3a00",
				100: "#322000",
				50: "#1d1300",
			},
			pink: {
				900: "#ffe6f5",
				800: "#f5bed9",
				700: "#ea95bf",
				600: "#e06ca4",
				500: "#d6438a",
				400: "#bc2970",
				300: "#931e57",
				200: "#6b143e",
				100: "#420a25",
				50: "#1c010e",
			},
			amber: {
				900: "#fdf7e7",
				800: "#f8e8be",
				700: "#f5d991",
				600: "#f1c963",
				500: "#eeba3a",
				400: "#d4a227",
				300: "#a57d1e",
				200: "#765915",
				100: "#46360c",
				50: "#181202",
			},
			cyan: {
				900: "#f0ffff",
				800: "#defbff",
				700: "#b3efff",
				600: "#86e4fd",
				500: "#5bdafc",
				400: "#3dcffb",
				300: "#30b6e2",
				200: "#218db0",
				100: "#13667e",
				50: "#003d4d"
			},
			lighter: "#ffffff66",
			darker: "#00000033",
			white: "#f8f8f8",
			black: "#070707",
			sliderTickColor: "#323780", // indigo 500
			primaryContrast: "#181202" // amber 50
		}
	},
	"Dark": {
		colors: {
			gray: {
				50: "#f2f2f2",
				100: "#d9d9d9",
				200: "#bfbfbf",
				300: "#a6a6a6",
				400: "#8c8c8c",
				500: "#737373",
				600: "#595959",
				700: "#404040",
				800: "#262626",
				900: "#121212",
			},
			fuchsia: {
				50: "#f5e5ff",
				100: "#c6dcff",
				200: "#d8b3ff",
				300: "#d0a4fe",
				400: "#c695fd",
				500: "#bb86fc",
				600: "#a576de",
				700: "#9e21f7",
				800: "#930ade",
				900: "#7e05ad",
			},
			blue: {
				50: "#e4e5ff",
				100: "#b2b5ff",
				200: "#7f84ff",
				300: "#6a75ff",
				400: "#565fff",
				500: "#4249ff",
				600: "#1d23fe",
				700: "#050ae5",
				800: "#0007b3",
				900: "#000581"
			},
			teal: {
				50: "#d8fffe",
				100: "#abfff8",
				200: "#7bfef1",
				300: "#4afdec",
				400: "#1dfce6",
				500: "#03dac5",
				600: "#00b09f",
				700: "#007f72",
				800: "#004c44",
				900: "#001b18",
			},
			green: {
				50: "#e4fee0",
				100: "#bff7b7",
				200: "#9cf08c",
				300: "#79eb60",
				400: "#5ae534",
				500: "#35cb1a",
				600: "#1f9e12",
				700: "#0c710b",
				800: "#044508",
				900: "#001908",
			},
			amber: {
				50: "#fff5dd",
				100: "#fae5b4",
				200: "#f5d888",
				300: "#f2cf5a",
				400: "#eeb42d",
				500: "#d48e15",
				600: "#a5640d",
				700: "#763f07",
				800: "#482001",
				900: "#1b0800",
			},
			pink: {
				50: "#ffe9ef",
				100: "#f1c4cf",
				200: "#e29dac",
				300: "#d47788",
				400: "#c7516e",
				500: "#ae385c",
				600: "#882b4e",
				700: "#621d3c",
				800: "#3c1027",
				900: "#1b0210",
			},
			trueGray: {
				50: "#d9d9d9",
				100: "#bfbfbf",
				200: "#a6a6a6",
				300: "#8c8c8c",
				400: "#737373",
				500: "#595959",
				600: "#404040",
				700: "#262626",
				800: "#120b0d",
				900: "#000000"
			},
			lighter: "#ffffff22",
			darker: "#00000033",
			white: "#f8f8f8",
			black: "#070707",
			sliderTickColor: "#4249ff", // blue 500
			primaryContrast: "#121212" // gray 900
		}
	},
	"Light": {
		colors: {
			cyan: {
				900: "#ddfdff",
				800: "#8ce4f1",
				700: "#3bcfe2",
				600: "#25b5c9",
				500: "#189daf",
				400: "#0f8290",
				300: "#066571",
				200: "#03595b",
				100: "#003d45",
				50: "#00161a",
			},
			indigo: {
				900: '#eee4ff',
				800: '#cab2ff',
				700: '#b9a7ff',
				600: '#a780ff',
				500: '#9566ff',
				400: '#834dff',
				300: '#4802e5',
				200: '#270081',
				100: '#17004f',
				50: '#09001f',
			},
			blue: {
				900: '#d9fdff',
				800: '#adf1ff',
				700: '#7fe7fb',
				600: '#50dcf8',
				500: '#24d2f5',
				400: '#0ab9db',
				300: '#0090ab',
				200: '#00677c',
				100: '#003f4c',
				50: '#00171c',
			},
			red: {
				900: "#ffe2e2",
				800: "#ffb3b3",
				700: "#fd8282",
				600: "#fb5151",
				500: "#f82020",
				400: "#df0707",
				300: "#ae0204",
				200: "#7d0002",
				100: "#4d0000",
				50: "#200000",
			},
			green: {
				900: "#b1feb1",
				800: "#80db81",
				700: "#50ca51",
				600: "#20a420",
				500: "#019001",
				400: "#007701",
				300: "#005500",
				200: "#003b00",
				100: "#001b00",
				50: "#000000"
			},
			yellow: {
				900: "#fffadb",
				800: "#fef7ad",
				700: "#fef67e",
				600: "#fdf74c",
				500: "#fdfd1c",
				400: "#e3d402",
				300: "#b19a00",
				200: "#7e6500",
				100: "#4c3900",
				50: "#1a1100",
			},
			trueGray: {
				900: "#f2f2f2",
				800: "#d9d9d9",
				700: "#bfbfbf",
				600: "#a6a6a6",
				500: "#8c8c8c",
				400: "#737373",
				300: "#595959",
				200: "#404040",
				100: "#262626",
				50: "#0d0d0d",
			},
			gray: {
				900: "#f2f2f2",
				800: "#d9d9d9",
				700: "#bfbfbf",
				600: "#a6a6a6",
				500: "#8c8c8c",
				400: "#737373",
				300: "#595959",
				200: "#404040",
				100: "#262626",
				50: "#0d0d0d",
			},
			lighter: "#ffffff66",
			darker: "#00000016",
			white: "#f8f8f8",
			black: "#070707",
			sliderTickColor: "#601bfe", // indigo 500
			primaryContrast: "#f2f2f2" // gray 900
		}
	}
};
const mappings = {
	"Default": {
		main: "emerald",
		text: "green",
		error: "red",
		danger: "red",
		success: "lime",
		warning: "yellow",
		primary: "teal",
		info: "teal",
		secondary: "purple",
		tertiary: "blue"
	},
	"Solarized Light": {
		primary: "orange",
		info: "orange",
		secondary: "indigo",
		tertiary: "lime",
		success: "teal",
		warning: "yellow",
		danger: "pink",
		error: "pink",
		main: "amber",
		text: "cyan"
	},
	"Solarized Dark": {
		main: "lightBlue",
		text: "yellow",
		error: "red",
		danger: "red",
		success: "lime",
		warning: "amber",
		info: "orange",
		primary: "orange",
		secondary: "indigo",
		tertiary: "cyan"
	},
	"Light": {
		info: "blue",
		primary: "blue",
		secondary: "indigo",
		tertiary: "cyan",
		main: "gray",
		text: "trueGray",
		success: "green",
		warning: "yellow",
		error: "red",
		danger: "red"
	},
	"Dark": {
		main: "gray",
		text: "trueGray",
		error: "pink",
		danger: "pink",
		success: "green",
		warning: "amber",
		info: "fuchsia",
		primary: "fuchsia",
		secondary: "blue",
		tertiary: "teal"
	}
};
const themeNames = Object.keys(mappings);
themeNames.forEach((themeName) => {
	// Isolate the current theme object we're modifying
	const workingTheme = themes[themeName];
	// Isolate the colors property of the theme
	// This holds the base colors
	const themeColors = workingTheme.colors;

	// Get the map of namespace => actual color
	// This tells us the new "color" to add, and what real color it matches
	const mapOfColorSpaces = mappings[themeName];

	// Apply the namespaces to the theme
	Object.keys(mapOfColorSpaces).forEach(namespace => {
		const desiredColor = mapOfColorSpaces[namespace];
		const newColor = themeColors[desiredColor];
		themeColors[namespace] = {...newColor};
	});

	// Apply component defaults to the theme
	workingTheme.components = {...components};
	// Apply font defaults to the theme
	workingTheme.fontConfig = fontConfig;
	workingTheme.fonts = fonts;
	workingTheme.breakpoints = breakpoints;
});

const getTheme = (themeName) => {
	const theme = extendTheme(themes[themeName] || {});
	return theme;
};

export {
	getTheme as default,
	themeNames as availableThemes
};
