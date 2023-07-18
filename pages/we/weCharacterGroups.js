import {
	addCharacterGroup,
	deleteCharacterGroup,
	editCharacterGroup
} from "../../store/weSlice";
import CharGroups from "../../components/CharacterGroups";

const WEChar = (props) => <CharGroups useDropoff={false} selector="we" {...{addCharacterGroup, deleteCharacterGroup, editCharacterGroup, ...props}} />;

export default WEChar;
