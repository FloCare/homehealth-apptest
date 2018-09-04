import RNSecureKeyStore from 'react-native-secure-key-store';
import firebase from 'react-native-firebase';
import {initialiseApp} from '../../screens/InitialiseApp';
import {MessagingServiceCoordinator} from './PubNubMessagingService/MessagingServiceCoordinator';

export function displayLocalNotificationAndroid({body, data = {}, notificationID}) {
    const notification = new firebase.notifications.Notification()
        .setNotificationId(notificationID)
        .setBody(body)
        .setSound('default')
        .setData(data);

    notification.android.setChannelId('default-channel');
    notification.android.setAutoCancel(true);
    notification.android.setSmallIcon('ic_notif');
    notification.android.setPriority(firebase.notifications.Android.Priority.High);
    notification.android.setBigText(body);
    firebase.notifications().displayNotification(notification)
        .catch(error => {
            console.log('error in displaying notification');
            console.log(error);
        });
}

export async function backgroundMessageAndroid(message) {
    console.log('bckMsg processing begun');
    console.log(message);

    const data = message.data;
    if (data && data.notificationBody) {
        displayLocalNotificationAndroid({notificationID: message.messageId, body: data.notificationBody});
    }

    if (!data.content_available) { return Promise.resolve(); }
    
    const backgroundTaskTimer = new Promise(resolve => {
        setTimeout(() => {
            console.log('30 seconds elapsed');
            resolve(false);
        }, 30 * 1000);
    });

    return RNSecureKeyStore.get('flokey')
        .then(async key => {
            await initialiseApp(key);
            const notificationPromise = MessagingServiceCoordinator.getInstance().onContentAvailable();
            return Promise.race([notificationPromise, backgroundTaskTimer])
                .then((result) => {
                    console.log('bckMsg Result');
                    console.log(result);
                })
                .catch(error => {
                    console.log('Error occurred during background fetch');
                    console.log(error);
                });
        }).catch(error => {
            console.log('backMsgRec failed with error');
            console.log(error);
        });
}

export function configureNotificationAndroid() {
    firebase.messaging().getToken()
        .then(fcmToken => {
            if (fcmToken) {
                const messagingServiceCoordinator = MessagingServiceCoordinator.getInstance();
                if (messagingServiceCoordinator) messagingServiceCoordinator.onNotificationRegister({token: fcmToken, pushGateway: 'gcm'});
            } else {
                //TODO
                console.log('not got token');
            }
        });

    firebase.notifications().onNotificationOpened((notificationOpen) => {
        console.log('onNotificationOpened');
        console.log(notificationOpen);
        // if (notification.data.payload.midnightEpoch) dateService.setDate(notification.data.payload.midnightEpoch);
        // const navigator = getItem('navigator');
        // if (navigator) {
        //     navigator.push({
        //         screen: notification.data.navigateTo,
        //         // passProps: {...notification.data.payload, navigator: getItem('navigator')},
        //         passProps: {...notification.data.payload},
        //         navigatorStyle: {
        //             tabBarHidden: notification.data.tabBarHidden
        //         }
        //     });
        // }
    });


    firebase.messaging().onMessage(message => {
        console.log('mssg rcvd');
        console.log(message);

        const data = message._data;
        if (data && data.notificationBody) {
            displayLocalNotificationAndroid({notificationID: message._messageId, body: data.notificationBody});
        }
    });

    const channel = new firebase.notifications.Android.Channel('default-channel', 'Default Channel', firebase.notifications.Android.Importance.High)
        .setDescription('My apps default channel');
    firebase.notifications().android.createChannel(channel);

    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
        console.log('notification displayed');
        console.log(notification);
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });
    // this.notificationListener = firebase.notifications().onNotification((notification) => {
    //     console.log('notification rcvd2');
    //     console.log(notification);
    //     notification.android.setChannelId('default-channel');
    //     notification.android.setPriority(firebase.notifications.Android.Priority.High);
    //     firebase.notifications().displayLocalNotification(notification);
    // });
}
