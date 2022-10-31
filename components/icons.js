import { Icon } from 'native-base';
import { Polygon } from 'react-native-svg';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FAFive from '@expo/vector-icons/FontAwesome5';
import MCI from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Foundation from '@expo/vector-icons/Foundation';
//import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';

// Menu/About page icons
export const CaretIcon = (props) => <Icon as={Ionicons} name="caret-forward-sharp" {...props} />
export const MorphoSyntaxIcon = (props) => <Icon as={FAFive} name="drafting-compass" {...props} />;
export const WordGenIcon = (props) => <Icon as={MCI} name="factory" {...props} />
export const WordEvolveIcon = (props) => <Icon as={Ionicons} name="shuffle-sharp" {...props} />;
export const LexiconIcon = (props) => <Icon as={Ionicons} name="book-sharp" {...props} />;
export const WordListsIcon = (props) => <Icon as={Entypo} name="list" {...props} />;
export const PhonoGraphIcon = (props) => <Icon as={MCI} name="headphones" {...props} />;
export const DeclenjugatorIcon = (props) => <Icon as={Foundation} name="results" {...props} />
export const AboutIcon = (props) => <Icon as={Ionicons} name="chatbox-ellipses-sharp" {...props} />;
export const SettingsIcon = (props) => <Icon as={Ionicons} name="settings-sharp" {...props} />;

// Header icons
export const MenuIcon = (props) => <Icon as={Entypo} name="menu" {...props} />;
export const DotsIcon = (props) => <Icon as={Ionicons} name="ellipsis-vertical" {...props} />
export const ExtraCharactersIcon = (props) => <Icon as={Ionicons} name="globe-outline" {...props} />;

// MS and About pages
export const DotIcon = (props) => <Icon as={FontAwesome} name="circle" {...props} />;

// Lexicon page
export const SortDownIcon = (props) => <Icon as={FAFive} name="sort-amount-down-alt" {...props} />;
export const SortUpIcon = (props) => <Icon as={FAFive} name="sort-amount-up" {...props} />;
export const SortEitherIcon = (props) => <Icon as={FAFive} name="sort" {...props} />;
export const ResetIcon = (props) => <Icon as={Fontisto} name="undo" {...props} />;

// WG pages
export const WGSettingsIcon = (props) => <Icon as={Ionicons} name="options-outline" {...props} />;
export const WGCharactersIcon = (props) => <Icon as={Entypo} name="language" {...props} />;
export const WGSyllablesIcon = (props) => <Icon as={MCI} name="text" {...props} />;
export const WGTransformationsIcon = (props) => <Icon as={MaterialIcons} name="transform" {...props} />;
export const WGOutputIcon = (props) => <Icon as={Ionicons} name="document-text-outline" {...props} />;
export const SuggestLeftIcon = (props) => <Icon as={Entypo} name="chevron-left" {...props} />;
export const GenerateIcon = (props) => <Icon as={MCI} name="play-circle-outline" {...props} />;
export const GearIcon = (props) => <Icon as={Ionicons} name="settings-outline" {...props} />;
export const CopyIcon = (props) => <Icon as={MaterialIcons} name="content-copy" {...props} />;
export const CancelIcon = (props) => <Icon as={MCI} name="cancel" {...props} />;
export const LoadIcon = (props) => <Icon as={MCI} name="chevron-double-up" {...props} />;

// WE pages
export const WEInputIcon = (props) => <Icon as={Ionicons} name="enter-outline" {...props} />;
export const WECharactersIcon = (props) => <Icon as={Entypo} name="language" {...props} />;
export const WESoundChangesIcon = (props) => <Icon as={MCI} name="transfer" {...props} />;
export const WETransformationsIcon = (props) => <Icon as={MaterialIcons} name="transform" {...props} />;
export const WEOutputIcon = (props) => <Icon as={Ionicons} name="exit-outline" {...props} />;

// Reordering controls
export const ReorderIcon = (props) => <Icon as={MCI} name="swap-vertical-circle" {...props} />;
export const StopIcon = (props) => <Icon as={MCI} name="stop" {...props} />;
export const UpIcon = (props) => <Icon as={Entypo} name="arrow-bold-up" {...props} />;
export const DownIcon = (props) => <Icon as={Entypo} name="arrow-bold-down" {...props} />;

// Add/Delete/Edit controls
export const AddIcon = (props) => <Icon as={Ionicons} name="add" {...props} />;
export const AddCircleIcon = (props) => <Icon as={Ionicons} name="add-circle-outline" {...props} />;
export const EditIcon = (props) => <Icon as={MaterialIcons} name="edit" {...props} />;
export const RemoveCircleIcon = (props) => <Icon as={Ionicons} name="remove-circle-outline" {...props} />;
export const SaveIcon = (props) => <Icon as={Ionicons} name="save-outline" {...props} />;
export const ExportIcon = (props) => <Icon as={Fontisto} name="export" {...props} />;
export const TrashIcon = (props) => <Icon as={Ionicons} name="trash-outline" {...props} />;
export const CloseCircleIcon = (props) => <Icon as={Ionicons} name="close-circle-outline" {...props} />;
export const CloseIcon = (props) => <Icon as={Ionicons} name="close-outline" {...props} />;
export const DragHandleIcon = (props) => <Icon as={MaterialIcons} name="drag-handle" {...props} />;
export const ImportIcon = (props) => <Icon as={MCI} name="book-arrow-right-outline" {...props} />;
export const ClearIcon = (props) => <Icon as={Ionicons} name="trash-bin-outline" {...props} />;

// Info controls
export const InfoIcon = (props) => <Icon as={MCI} name="information" {...props} />;
export const OkIcon = (props) => <Icon as={Ionicons} name="checkmark-circle-outline" {...props} />;
export const HelpIcon = (props) => <Icon as={Ionicons} name="help-circle-outline" {...props} />;

// Slider controls
export const SharpDropoffIcon = (props) => (
	<Icon viewBox="0 0 256 256" {...props}>
		<Polygon
			points="24,232 232,232 24,64"
			stroke="currentColor"
			strokeWidth={8}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</Icon>
);
export const EquiprobableIcon = (props) => (
	<Icon viewBox="0 0 256 256" {...props}>
		<Polygon
			points="24,232 232,232 24,232"
			stroke="currentColor"
			strokeWidth={8}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</Icon>
);
