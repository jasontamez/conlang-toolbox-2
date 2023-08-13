//import React from "react";
import { extendTheme } from "native-base";

const breakpoints = {
	sm: 390,
	md: 600,
	lg: 992,
	xl: 1280
}

const fontConfig = { /*
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
			normal: "Noto Sans",
			italic: "NotoSans_400Regular_Italic"
		},
		700: {
			normal: "NotoSans_700Bold",
			italic: "NotoSans_700Bold_Italic"
		}
	},*/
	"Noto Sans": {
		400: {
			normal: "Noto Sans",
			italic: "Noto Sans Italic"
		},
		700: {
			normal: "Noto Sans Bold",
			italic: "Noto Sans Bold Italic"
		}
	},/*
	"Noto Sans JP": {
		100: {
			normal: "NotoSansJP_100Thin"
		},
		300: {
			normal: "NotoSansJP_300Light"
		},
		400: {
			normal: "NotoSansJP_400Regular"
		},
		500: {
			normal: "NotoSansJP_500Medium"
		},
		700: {
			normal: "NotoSansJP_700Bold"
		},
		900: {
			normal: "NotoSansJP_900Black"
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
	},*/
	"Noto Serif": {
		400: {
			normal: "Noto Serif",
			italic: "Noto Serif Italic"
		},
		700: {
			normal: "Noto Serif Bold",
			italic: "Noto Serif Bold Italic"
		}
	},/*
	"Noto Serif JP": {
		200: {
			normal: "NotoSerifJP_200ExtraLight"
		},
		300: {
			normal: "NotoSerifJP_300Light"
		},
		400: {
			normal: "NotoSerifJP_400Regular"
		},
		500: {
			normal: "NotoSerifJP_500Medium"
		},
		600: {
			normal: "NotoSerifJP_600SemiBold"
		},
		700: {
			normal: "NotoSerifJP_700Bold"
		},
		900: {
			normal: "NotoSerifJP_900Black"
		}
	}, */
	"Source Code Pro": {
		400: {
			normal: "Source Code Pro",
			italic: "Source Code Pro Italic"
		},
		700: {
			normal: "Source Code Pro Bold",
			italic: "Source Code Pro Bold Italic"
		}
	},/*
	"Source Code Pro": {
		200: {
			normal: "SourceCodePro_200ExtraLight",
			italic: "SourceCodePro_200ExtraLight_Italic"
		},
		300: {
			normal: "SourceCodePro_300Light",
			italic: "SourceCodePro_300Light_Italic"
		},
		400: {
			normal: "SourceCodePro_400Regular",
			italic: "SourceCodePro_400Regular_Italic"
		},
		500: {
			normal: "SourceCodePro_500Medium",
			italic: "SourceCodePro_500Medium_Italic"
		},
		600: {
			normal: "SourceCodePro_600SemiBold",
			italic: "SourceCodePro_600SemiBold_Italic"
		},
		700: {
			normal: "SourceCodePro_700Bold",
			italic: "SourceCodePro_700Bold_Italic"
		},
		800: {
			normal: "SourceCodePro_800ExtraBold",
			italic: "SourceCodePro_800ExtraBold_Italic"
		},
		900: {
			normal: "SourceCodePro_900Black",
			italic: "SourceCodePro_900Black_Italic"
		}
	},
	ArTarumianKamar: {
		500: {
			normal: "ArTarumianKamar"
		}
	},
	Scherherazade: {
		400: {
			normal: "Scheherazade_400Regular"
		},
		700: {
			normal: "Scheherazade_700Bold"
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
	}*/
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
			fontFamily: fonts.body,
			fontWeight: 400,
			fontStyle: "normal",
			style: {
				fontVariant: ["small-caps"]
			}
		},
		_pressed: {
			bg: "success.900"
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
		fontFamily: fonts.body,
		fontWeight: 400,
		fontStyle: "normal"
	}
};
const mainHeading = {
	defaultProps: {
		color: "text.50",
		fontFamily: fonts.heading,
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
		px: 2,
		py: 0.5,
		_focus: {
			borderColor: "main.500",
			color: "text.50",
			bg: "lighter",
			borderRadius: 0
		},
		fontFamily: fonts.body,
		fontWeight: 400,
		fontStyle: "normal"
	}
};
const mainCheckboxesDefaultProps = {
	bg: "lighter",
	borderColor: "text.100",
	_text: {
		color: "primary.50",
		fontFamily: fonts.body,
		fontWeight: 400,
		fontStyle: "normal"
	},
	_icon: {
		color: "primary.50"
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
			}
		},
		_pressed: {
			borderColor: "primary.300",
			bg: "primary.300"
		}
	},
	_hover: {
		borderColor: "primary.400",
		_disabled: {
			borderColor: "gray.500"
		}
	},
	_pressed: {
		borderColor: "primary.300"
	},
	_invalid: {
		borderColor: "error.500"
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
			height: 5
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
			height: -5
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
	Link: {
		defaultProps: {
			_text: {
				color: "primary.500",
				fontFamily: fonts.body,
				fontWeight: 400,
				fontStyle: "normal",
				textDecoration: "underline"
			}
		}
	},
	Pressable: {...mainFG},
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
				fontFamily: fonts.body,
				fontWeight: 400,
				fontStyle: "normal"
			},
			_icon: {
				color: "primary.50"
			}
		}
	},
	Select: {...mainInput},
	Icon: {...mainFG},
	NativeBaseProvider: {...mainBG},
	Box: {
		sizes: {
			lexXxs: {
				flexGrow: 1,
				flexShrink: 2,
				flexBasis: 10
			},
			lexXs: {
				flexGrow: 2,
				flexShrink: 1,
				flexBasis: 20
			},
			lexSm: {
				flexGrow: 6,
				flexShrink: 1,
				flexBasis: 40
			},
			lexMd: {
				flexGrow: 18,
				flexShrink: 1,
				flexBasis: 96
			},
			lexLg: {
				flexGrow: 30,
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
	MenuGroup: {
		_title: {
			color: "primary.500",
			fontSize: "md"
		}
	},
	MenuItem: {
		defaultProps: {
			_text: {
				color: "text.50",
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
				color: "text.50",
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
				900: "#000304"
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
				900: "#001211"
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
				900: "#200000"
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
				900: "#1e024c"
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
				900: "#000120"
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
				900: "#051500"
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
				900: "#1d1300"
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
				900: "#001a0b"
			},
			lighter: "#ffffff11",
			darker: "#00000033",
			white: "#f8f8f8",
			black: "#070707"
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
				900: "#00151d"
			},
			orange: { // primary
				50: "#f5eeea",
				100: "#f0ded6",
				200: "#e5bba8",
				300: "#de9372",
				400: "#dc6c3d",
				500: "#cb4b16",
				600: "#97401B",
				700: "#6c3219",
				800: "#472415",
				900: "#21130D"
			},
			indigo: { // secondary
				50: "#edeefd",
				100: "#dcdef9",
				200: "#bcbff0",
				300: "#9fa3e5",
				400: "#8387d8",
				500: "#6c71c4",
				600: "#3b41ba",
				700: "#282d90",
				800: "#161a64",
				900: "#090b34"
			},
			cyan: { // tertiary
				50: "#ecf2f3",
				100: "#d7e6ea",
				200: "#a7ced7",
				300: "#77baca",
				400: "#41a5be",
				500: "#288198",
				600: "#276372",
				700: "#214a55",
				800: "#182f35",
				900: "#0e181b"
			},
			lime: { // success
				50: "#f8fcdf",
				100: "#f2fabd",
				200: "#e7f877",
				300: "#ddf830",
				400: "#bfdc04",
				500: "#859900",
				600: "#687802",
				700: "#4d5903",
				800: "#333a03",
				900: "#191c02"
			},
			amber: { // warning
				50: "#f8f4e7",
				100: "#f3e9c8",
				200: "#eed58c",
				300: "#edc44a",
				400: "#e7b10d",
				500: "#b58900",
				600: "#876708",
				700: "#614c0a",
				800: "#3e3109",
				900: "#1d1806"
			},
			red: { // danger/error
				50: "#f6efef",
				100: "#efdddc",
				200: "#e4b9b9",
				300: "#dc8f8e",
				400: "#d86664",
				500: "#dc322f",
				600: "#ac2d2b",
				700: "#792625",
				800: "#4e1e1d",
				900: "#231110"
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
				900: "#180502"
			},
			lighter: "#ffffff22",
			darker: "#00000033",
			white: "#f8f8f8",
			black: "#070707"
		}
	},
	"Solarized Light": {
		colors: {
			orange: { // primary
				50: "#f4eeec",
				100: "#eedfd8",
				200: "#e3bcab",
				300: "#db9476",
				400: "#da6d3f",
				500: "#cb4b16",
				600: "#95411D",
				700: "#69331C",
				800: "#452517",
				900: "#20130E"
			},
			indigo: { // secondary
				50: "#f0f1f9",
				100: "#e2e3f3",
				200: "#c5c7e8",
				300: "#a8aadc",
				400: "#8b8ed0",
				500: "#6c71c4",
				600: "#464baf",
				700: "#353983",
				800: "#232657",
				900: "#12132C"
			},
			lime: { // tertiary
				50: "#f3f5e5",
				100: "#eaf0c7",
				200: "#dce986",
				300: "#d1e740",
				400: "#b8d20f",
				500: "#859900",
				600: "#647208",
				700: "#48520A",
				800: "#2e3409",
				900: "#161806"
			},
			teal: { // success
				50: "#eff0f0",
				100: "#dbe5e5",
				200: "#b1d3d0",
				300: "#82c5bf",
				400: "#4dbcb3",
				500: "#2aa198",
				600: "#2c7771",
				700: "#275450",
				800: "#1e3432",
				900: "#111817"
			},
			yellow: { // warning
				50: "#f7f3e9",
				100: "#f1e7cb",
				200: "#ead48f",
				300: "#e9c24e",
				400: "#e5b010",
				500: "#b58900",
				600: "#866609",
				700: "#5f4a0c",
				800: "#3c300b",
				900: "#1c1707",
				950: "#0f0d06"
			},
			red: { // danger/error
				50: "#f4f0f0",
				100: "#eddede",
				200: "#e2bcbb",
				300: "#d99291",
				400: "#d66866",
				500: "#dc322f",
				600: "#a92f2d",
				700: "#762928",
				800: "#4b2120",
				900: "#211212"
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
				50: "#181202"
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
			black: "#070707"
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
				900: "#121212"
			},
			fuchsia: { // primary
				50: "#f9f5ff",
				100: "#f1e6fe",
				200: "#e3cdfe",
				300: "#d5b4fd",
				400: "#caa0fd",
				500: "#bb86fc",
				600: "#923dfa",
				700: "#6806e0",
				800: "#450495",
				900: "#23024B"
			},
			blue: { // secondary
				50: "#ebebff",
				100: "#dbdcff",
				200: "#b3b5ff",
				300: "#8f93ff",
				400: "#666bff",
				500: "#4249ff",
				600: "#0008ff",
				700: "#0006c2",
				800: "#000480",
				900: "#000242"
			},
			teal: { // tertiary
				50: "#dcfffb",
				100: "#bdfef8",
				200: "#7cfef1",
				300: "#3afde9",
				400: "#03f2da",
				500: "#02b09f",
				600: "#028d7f",
				700: "#016a5f",
				800: "#014740",
				900: "#002320"
			},
			green: { // success
				50: "#edfce8",
				100: "#d7f9cd",
				200: "#aef29c",
				300: "#8aec6f",
				400: "#62e63d",
				500: "#42d01b",
				600: "#35a716",
				700: "#287e10",
				800: "#1a510b",
				900: "#0d2905"
			},
			amber: { // warning
				50: "#f6f3ea",
				100: "#f0e9d1",
				200: "#e7d7a2",
				300: "#e2c66a",
				400: "#e1b833",
				500: "#c69c10",
				600: "#977917",
				700: "#6a5715",
				800: "#453912",
				900: "#1f1a0a"
			},
			red: { // error/danger
				50: "#f8e7ea",
				100: "#f4cdd4",
				200: "#f099a9",
				300: "#ef5d77",
				400: "#f22148",
				500: "#d80028",
				600: "#a40a26",
				700: "#740b1f",
				800: "#4b0b17",
				900: "#22070C",
				950: "#100507"
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
			black: "#070707"
		}
	},
	"Light": {
		colors: {
			cyan: { // tertiary
				900: "#052024",
				800: "#0a4148",
				700: "#0e5d67",
				600: "#137d8b",
				500: "#189daf",
				400: "#23cbe1",
				300: "#59d8e8",
				200: "#93e5f0",
				100: "#c9f2f8",
				50: "#e4f9fb"
			},
			indigo: { // secondary
				900: '#0b0024',
				800: '#150047',
				700: '#20006b',
				600: '#2b008f',
				500: '#3700b3',
				400: '#4900f5',
				300: '#7438ff',
				200: '#a27aff',
				100: '#d1bdff',
				50: '#eae0ff'
			},
			blue: { // primary/info
				900: '#ff0000',
				800: '#03036d',
				700: '#05059e',
				600: '#0707d5',
				500: '#1b1bf8',
				400: '#4848f9',
				300: '#7474fb',
				200: '#a6a6fc',
				100: '#d2d2fe',
				50: '#e6e6fe'
			},
			red: { // danger/error
				900: "#680303",
				800: "#990505",
				700: "#b70606",
				600: "#cb0606",
				500: "#e40707",
				400: "#fb7070",
				300: "#fca6a6",
				200: "#fdc9c9",
				100: "#fee6e6",
				50: "#fff5f5"
			},
			green: { // success
				900: "#012c01",
				800: "#035403",
				700: "#048004",
				600: "#06a806",
				500: "#07d507",
				400: "#1cf71c",
				300: "#57f957",
				200: "#8dfb8d",
				100: "#c9fdc9",
				50: "#e1fee1"
			},
			orange: { // warning
				900: "#69420C",
				800: "#975f11",
				700: "#b77315",
				600: "#ce8218",
				500: "#e5901c",
				400: "#ecaf5a",
				300: "#f2c88d",
				200: "#f7deba",
				100: "#fbedda",
				50: "#fdf8f1"
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
				50: "#0d0d0d"
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
				50: "#0d0d0d"
			},
			lighter: "#ffffff66",
			darker: "#00000016",
			white: "#f8f8f8",
			black: "#070707"
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
		tertiary: "teal",
		success: "lime",
		warning: "yellow",
		danger: "red",
		error: "red",
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
		warning: "orange",
		error: "red",
		danger: "red"
	},
	"Dark": {
		main: "gray",
		text: "trueGray",
		error: "red",
		danger: "red",
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
