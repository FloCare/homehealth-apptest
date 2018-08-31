import {AppRegistry, Platform} from 'react-native';
import {Navigation, NativeEventsReceiver} from 'react-native-navigation';
import {StartApp} from './app/App';
import {backgroundMessageAndroid} from './app/data_services/MessagingServices/AndroidNotificationService';

require('./app/App');

AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => backgroundMessageAndroid);
AppRegistry.registerComponent('FloCare', () => {
    Navigation.isAppLaunched()
        .then(appLaunched => {
            if (appLaunched) {
                StartApp(); // App is launched -> show UI
            }
            new NativeEventsReceiver().appLaunched(StartApp); // App hasn't been launched yet -> show the UI only when needed.
        });
});

Platform.select({
    ios: StartApp,
    android: () => {
        Navigation.isAppLaunched()
            .then(appLaunched => {
                if (appLaunched) {
                    StartApp(); // App is launched -> show UI
                }
                new NativeEventsReceiver().appLaunched(StartApp); // App hasn't been launched yet -> show the UI only when needed.
            });
    }
})();
