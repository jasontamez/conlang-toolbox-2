import { Icon } from 'native-base';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FAFive from '@expo/vector-icons/FontAwesome5';
import MCI from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Foundation from '@expo/vector-icons/Foundation';


export const CircleIcon = (props) => <Icon as={FontAwesome} name="circle" size="xs" {...props} />;

export const MorphoSyntaxIcon = (props) => <Icon as={FAFive} name="drafting-compass" size="sm" {...props} />;
export const WordGenIcon = (props) => <Icon as={MCI} name="factory" size="sm" {...props} />
export const WordEvolveIcon = (props) => <Icon as={Ionicons} name="shuffle-sharp" size="sm" {...props} />;
export const LexiconIcon = (props) => <Icon as={Ionicons} name="book-sharp" size="sm" {...props} />;
export const WordListsIcon = (props) => <Icon as={Entypo} name="list" size="sm" {...props} />;
export const PhonoGraphIcon = (props) => <Icon as={MCI} name="headphones" size="sm" {...props} />;
export const DeclenjugatorIcon = (props) => <Icon as={Foundation} name="results" size="sm" {...props} />

export const MenuIcon = (props) => <Icon as={Entypo} name="menu" size="sm" {...props} />;
export const ExtraCharactersIcon = (props) => <Icon as={Entypo} name="language" size="sm" {...props} />;
