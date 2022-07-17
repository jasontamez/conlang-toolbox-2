import { Icon as ICON } from 'native-base';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FAFive from '@expo/vector-icons/FontAwesome5';
import MCI from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Foundation from '@expo/vector-icons/Foundation';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';

const Icon = (props) => <ICON size="sm" {...props} />;

export const DotIcon = (props) => <ICON as={FontAwesome} name="circle" size="xs" {...props} />;
export const CaretIcon = (props) => <Icon as={Ionicons} name="caret-forward-sharp" {...props} />
export const DotsIcon = (props) => <Icon as={Ionicons} name="ellipsis-vertical" {...props} />

export const MorphoSyntaxIcon = (props) => <Icon as={FAFive} name="drafting-compass" {...props} />;
export const WordGenIcon = (props) => <Icon as={MCI} name="factory" {...props} />
export const WordEvolveIcon = (props) => <Icon as={Ionicons} name="shuffle-sharp" {...props} />;
export const LexiconIcon = (props) => <Icon as={Ionicons} name="book-sharp" {...props} />;
export const WordListsIcon = (props) => <Icon as={Entypo} name="list" {...props} />;
export const PhonoGraphIcon = (props) => <Icon as={MCI} name="headphones" {...props} />;
export const DeclenjugatorIcon = (props) => <Icon as={Foundation} name="results" {...props} />

export const AboutIcon = (props) => <Icon as={Ionicons} name="chatbox-ellipses-sharp" {...props} />;
export const SettingsIcon = (props) => <Icon as={Ionicons} name="settings-sharp" {...props} />;

export const MenuIcon = (props) => <Icon as={Entypo} name="menu" {...props} />;
export const ExtraCharactersIcon = (props) => <Icon as={Ionicons} name="globe-outline" {...props} />;
// as={Entypo} name="language"

export const SortDownIcon = (props) => <Icon as={FAFive} name="sort-amount-down-alt" {...props} />;
export const SortUpIcon = (props) => <Icon as={FAFive} name="sort-amount-up" {...props} />;
export const DoubleCaretIcon = (props) => <ICON as={FAFive} name="sort" size="xs" {...props} />;
export const EditIcon = (props) => <ICON as={MaterialIcons} name="edit" size="xs" {...props} />;

export const Bar = (props) => <Icon as={Octicons} name="horizontal-rule" style={{transform: [{"rotate": "90deg"}]}} {...props} />;

export const AddIcon = (props) => <Icon as={Ionicons} name="add" {...props} />;
export const AddCircleIcon = (props) => <Icon as={Ionicons} name="add-circle-outline" {...props} />;
export const RemoveCircleIcon = (props) => <Icon as={Ionicons} name="remove-circle-outline" {...props} />;
export const SaveIcon = (props) => <Icon as={Ionicons} name="save-outline" {...props} />;
export const ExportIcon = (props) => <Icon as={Fontisto} name="export"  {...props} />;
export const TrashIcon = (props) => <Icon as={Ionicons} name="trash-outline" {...props} />;
export const CloseCircleIcon = (props) => <Icon as={Ionicons} name="close-circle-outline" {...props} />;
export const DragHandleIcon = (props) => <Icon as={MaterialIcons} name="drag-handle" {...props} />;

export const InfoIcon = (props) => <Icon as={Ionicons} name="information-circle-sharp" {...props} />;
export const OkIcon = (props) => <Icon as={Ionicons} name="checkmark-circle-outline" {...props} />;
export const HelpIcon = (props) => <Icon as={Ionicons} name="help-circle-outline" {...props} />;
