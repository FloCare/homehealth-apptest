import PushNotification from 'react-native-push-notification';
import {PushNotificationIOS} from 'react-native';
import {dateService} from '../DateService';
import {MessagingServiceCoordinator} from './PubNubMessagingService/MessagingServiceCoordinator';
import {getItem} from '../../utils/InMemoryStore';

export function displayLocalNotificationIOS({body, data = {}}) {
    PushNotification.localNotification({
        message: body,
        userInfo: data
    });
}
export function configureNotificationIOS() {
    PushNotification.configure({
        onRegister(notificationTokenObject) {
            const messagingServiceCoordinator = MessagingServiceCoordinator.getInstance();
            if (messagingServiceCoordinator) messagingServiceCoordinator.onNotificationRegister({...notificationTokenObject, pushGateway: 'apns'});
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
                const notificationPromise = MessagingServiceCoordinator.getInstance().onContentAvailable();
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
            } else if (!notification.data.remote && !notification.foreground) {
                if (notification.data.payload.midnightEpoch) dateService.setDate(notification.data.payload.midnightEpoch);
                const navigator = getItem('navigator');
                if (navigator) {
                    navigator.push({
                        screen: notification.data.navigateTo,
                        // passProps: {...notification.data.payload, navigator: getItem('navigator')},
                        passProps: {...notification.data.payload},
                        navigatorStyle: {
                            tabBarHidden: notification.data.tabBarHidden
                        }
                    });
                }
            }

            notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        permissions: {
            alert: true,
            sound: true
        },

        popInitialNotification: true,

        requestPermissions: true,
    });
}
