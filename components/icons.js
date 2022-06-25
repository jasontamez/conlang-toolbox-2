import { Icon } from 'native-base';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FAFive from '@expo/vector-icons/FontAwesome5';
import MCI from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';


export const Circle = (props) => <Icon as={FontAwesome} name="circle" size="sm" {...props} />;

export const MorphoSyntaxIcon = (props) => <Icon as={FAFive} name="drafting-compass" size="sm" {...props} />;

export const WordGenIcon = (props) => <Icon as={MCI} name="factory" size="sm" {...props} />

export const MenuIcon = (props) => <Icon as={Entypo} name="menu" size="sm" {...props} />;
export const ExtraCharactersIcon = (props) => <Icon as={Entypo} name="language" size="sm" {...props} />;
