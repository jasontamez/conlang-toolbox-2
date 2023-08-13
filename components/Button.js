import {
	Button as Btn
} from "native-base";
import { forwardRef, memo } from "react";


// <Button
//   scheme="primary|secondary|success|etc"
//   bg=<specific BG color>
//   pressedBg=<specific BG color when pressed>
//   color=<specific text and icon color>
//   iconColor=<specific icon color>
// />
const Button = (
	{
		scheme,
		bg,
		pressedBg,
		color,
		iconColor,
		_pressed,
		_icon,
		_text,
		variant,
		...props
	},
	ref
) => {
	const pressed = {..._pressed};
	const icon = {..._icon};
	const text = {..._text};
	const otherProps = {};
	if(variant === "ghost") {
		otherProps.bg = bg || "transparent";
		filter(pressed, _pressed, "bg", pressedBg || "darker", scheme, 600);
		filter(icon, _icon, "color", iconColor || color, scheme || "text", 50);
		filter(text, _text, "color", color, scheme || "text", 50);
	} else {
		filter(pressed, _pressed, "bg", pressedBg, scheme, 600);
		filter(icon, _icon, "color", iconColor || color, scheme, 50);
		filter(text, _text, "color", color, scheme, 50);
		if(variant === "outline") {
			otherProps.bg = "transparent";
			otherProps.borderColor = bg || (scheme ? `${scheme}.500` : undefined);
			otherProps.borderWidth = 1
		} else /*if(variant === "solid")*/ {
			otherProps.bg = bg || (scheme ? `${scheme}.500` : undefined)
		}
	}
	return (
		<Btn
			_pressed={pressed}
			_icon={icon}
			_text={text}
			ref={ref}
			{...otherProps}
			{...props}
		/>
	);
};

const filter = (output, input, property, value, scheme, number) => {
	if(!input || !input[property]) {
		if (value) {
			output[property] = value;
		} else if(scheme) {
			output[property] = `${scheme}.${number}`;
		} 
	}
};

export default memo(forwardRef(Button));
