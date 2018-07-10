import PushNotification from 'react-native-push-notification';
import {AppState, PushNotificationIOS} from 'react-native';
import {MessagingServiceCoordinator} from './PubNubMessagingService/MessagingServiceCoordinator';

export function configure() {
    AppState.addEventListener('change', nextState => console.log(nextState));
    PushNotification.configure({
        onRegister(notificationTokenObject) {
            const messagingServiceCoordinator = MessagingServiceCoordinator.getInstance();
            if (messagingServiceCoordinator) messagingServiceCoordinator.onNotificationRegister(notificationTokenObject);
        },
        onNotification(notification) {
            console.log('NOTIFICATION:', notification);

            if (notification.data.remote) {
                MessagingServiceCoordinator.getInstance().onNotification(notification);
            }

            notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        permissions: {
            alert: true,
            badge: true,
            sound: true
        },

        popInitialNotification: true,

        requestPermissions: true,
    });
}
