import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';

export interface Navigation {
  navigation: NavigationProp<ParamListBase, string, any, any, any>;
  route: RouteProp<ParamListBase, string>;
}
