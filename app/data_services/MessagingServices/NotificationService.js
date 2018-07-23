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
            const backgroundTaskTimer = new Promise(resolve => {
                setTimeout(() => {
                    console.log('30 seconds elapsed');
                    resolve(false);
                }, 30 * 1000);
            });

            if (notification.data.remote && !notification.foreground) {
                const notificationPromise = MessagingServiceCoordinator.getInstance().onNotification(notification);
                Promise.race([notificationPromise, backgroundTaskTimer])
                    .then((result) => {
                        console.log('Reached promise then');
                        console.log(result);
                        if (result === false) {
                            notification.finish(PushNotificationIOS.FetchResult.ResultFailed);
                        }
                        notification.finish(PushNotificationIOS.FetchResult.NewData);
                    })
                    .catch(error => {
                        console.log('Error occurred during background fetch');
                        console.log(error);
                    });
                return;
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
