import PushNotification from 'react-native-push-notification';
import {AppState, PushNotificationIOS} from 'react-native';
import moment from 'moment/moment';
import {MessagingServiceCoordinator} from './PubNubMessagingService/MessagingServiceCoordinator';
import {screenNames} from '../../utils/constants';
import {todayMomentInUTCMidnight} from '../../utils/utils';
import {dateService} from '../DateService';
import {getItem} from '../../utils/InMemoryStore';

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

export function showVisitCollisionNotification(myVisit, collidingVisit) {
    const coworkerName = collidingVisit.user.firstName;
    const today = todayMomentInUTCMidnight().valueOf() === collidingVisit.midnightEpochOfVisit;
    const dateString = moment(collidingVisit.midnightEpochOfVisit).format('Do MMM');

    const myVisitTime = myVisit.plannedStartTime ? moment(myVisit.plannedStartTime).format('LT') : undefined;

    PushNotification.localNotification({
        message: `${coworkerName} added a visit for ${today ? 'today' : dateString}. You too are visiting the patient ${today ? 'today' : `on ${dateString}`}${myVisitTime ? ` at ${myVisitTime}` : '. Set a time for the visit.'}`,
        userInfo: {
            navigateTo: screenNames.visitDayViewScreen,
            tabBarHidden: true,
            payload: {
                selectedScreen: 'list',
                visitID: myVisit.visitID,
                midnightEpoch: myVisit.midnightEpochOfVisit,
            }
        }
    });
}
