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
			color: "primaryContrast"
		},
		_text: {
			color: "primaryContrast",
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
		color: "text.50",
		fontFamily: "body"
	}
};
const mainHeading = {
	defaultProps: {
		color: "text.50",
		fontFamily: "heading"
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
		fontFamily: "body"
	}
};

const components = {
	Button: {...mainButton},
	IconButton: {...mainButton},
	Modal: {
		defaultProps: {
			_backdrop: {
				opacity: 60
			}
		}
	},
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
	ModalCloseButton: {
		defaultProps: {
			_icon: {
				color: "text.50"
			}
		}
	},
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
	Icon: {...mainFG},
	NativeBaseProvider: {...mainBG},
	Box: {
		sizes: {
			lexXs: {
				flex: "0 0 10px"
			},
			lexSm: {
				flex: "1 1 40px"
			},
			lexMd: {
				flex: "3 1 96px"
			},
			lexLg: {
				flex: "5 1 200px"
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
	Checkbox: {
		defaultProps: {
			bg: "lighter",
			borderColor: "text.100",
			_text: {
				color: "primaryContrast",
				fontFamily: "body"
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
		}
	},
	Switch: {
		defaultProps: {
			onTrackColor: "primary.900",
			onThumbColor: "primary.500",
			offTrackColor: "darker",
			offThumbColor: "text.50"
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
				50: "#f0f0ff",
				100: "#e3e8ff",
				200: "#b2b9ff",
				300: "#a9abff",
				400: "#7f8aff",
				500: "#4d5bff",
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
				500: "#cf4d16",
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
				400: "#5b61bd",
				500: "#4247a4",
				600: "#323780",
				700: "#24285d",
				800: "#14183b",
				900: "#05071a",
			},
			cyan: {
				50: "#dffaff",
				100: "#bce7f2",
				200: "#98d5e5",
				300: "#72c4da",
				400: "#4db4ce",
				500: "#359ab5",
				600: "#25788d",
				700: "#175666",
				800: "#04343f",
				900: "#001319",
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
				500: "#cf4d16",
				400: "#b84414",
				300: "#a23b10",
				200: "#742a0a",
				100: "#471702",
				50: "#1e0600",
			},
			indigo: {
				900: "#a3a7dc",
				800: "#8084cd",
				700: "#5b61bd",
				600: "#4247a4",
				500: "#323780",
				400: "#24285d",
				300: "#14183b",
				200: "#100f2a",
				100: "#05071a",
				50: "#02030c",
			},
			lime: {
				900: "#fbffdc",
				800: "#f5ffaf",
				700: "#eeff7f",
				600: "#e8ff4d",
				500: "#e1ff1f",
				400: "#c8e608",
				300: "#9bb300",
				200: "#6f8000",
				100: "#414d00",
				50: "#151b00",
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
				100: "#d0a4fe",
				100: "#c695fd",
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
				500: "#03e2cd",
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
				800: "#b6f0f8",
				700: "#8ce4f1",
				600: "#62d9e9",
				500: "#3bcfe2",
				400: "#25b5c9",
				300: "#168d9d",
				200: "#066571",
				100: "#003d45",
				50: "#00161a",
			},
			indigo: {
				900: "#eee4ff",
				800: "#cab2ff",
				700: "#a780ff",
				600: "#834dff",
				500: "#601bfe",
				400: "#4802e5",
				300: "#3700b3",
				200: "#270081",
				100: "#17004f",
				50: "#09001f",
			},
			blue: {
				900: "#e5e5ff",
				800: "#b4b5ff",
				700: "#8283fd",
				600: "#5152fb",
				500: "#2020f8",
				400: "#0707df",
				300: "#0204ae",
				200: "#00037e",
				100: "#00014d",
				50: "#000020",
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
			darker: "#00000033",
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
		const realColor = mapOfColorSpaces[namespace];
		const newColor = themeColors[realColor];
		themeColors[namespace] = {...newColor};
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
