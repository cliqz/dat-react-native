import {AppRegistry} from 'react-native';
import './setup';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
