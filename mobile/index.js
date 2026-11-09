import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { initSentry, Sentry } from './src/services/sentry';
import App from './App';

initSentry();

registerRootComponent(Sentry.wrap(App));
