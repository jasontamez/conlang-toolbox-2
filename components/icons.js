import { Icon as ICON } from 'native-base';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FAFive from '@expo/vector-icons/FontAwesome5';
import MCI from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Foundation from '@expo/vector-icons/Foundation';
import Octicons from '@expo/vector-icons/Octicons';

const Icon = (props) => <ICON size="sm" {...props} />;

export const DotIcon = (props) => <Icon as={FontAwesome} name="circle" size="xs" {...props} />;
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

export const MenuIcon = (props) => <Icon as={Entypo} name="menu" {...props} />;
export const ExtraCharactersIcon = (props) => <Icon as={Ionicons} name="globe-outline" {...props} />;
// as={Entypo} name="language"

export const Bar = (props) => <Icon as={Octicons} name="horizontal-rule" style={{transform: [{"rotate": "90deg"}]}} {...props} />
