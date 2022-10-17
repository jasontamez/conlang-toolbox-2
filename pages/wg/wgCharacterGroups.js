import {
	addCharacterGroup,
	deleteCharacterGroup,
	editCharacterGroup,
	setCharacterGroupDropoff
} from "../../store/wgSlice";
import CharGroups from "../../components/CharacterGroups";

const WGChar = (props) => <CharGroups useDropoff={true} selector="wg" {...{addCharacterGroup, deleteCharacterGroup, editCharacterGroup, setCharacterGroupDropoff, ...props}} />;

export default WGChar;
