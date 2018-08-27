import {AppState, Platform} from 'react-native';
import moment from 'moment/moment';
import {todayMomentInUTCMidnight} from '../../utils/utils';
import {configureNotificationAndroid, displayLocalNotificationAndroid} from './AndroidNotificationService';
import {configureNotificationIOS, displayLocalNotificationIOS} from './IOSNotificationService';
import {screenNames} from '../../utils/constants';

export function configure() {
    AppState.addEventListener('change', nextState => console.log(nextState));
    Platform.select({
        ios: configureNotificationIOS,
        android: configureNotificationAndroid
    })();
}

export function showVisitCollisionNotification(myVisit, collidingVisit) {
    const coworkerName = collidingVisit.user.firstName;
    const today = todayMomentInUTCMidnight().valueOf() === collidingVisit.midnightEpochOfVisit;
    const dateString = moment(collidingVisit.midnightEpochOfVisit).format('Do MMM');

    const myVisitTime = myVisit.plannedStartTime ? moment(myVisit.plannedStartTime).format('LT') : undefined;

    Platform.select({
        ios: displayLocalNotificationIOS,
        android: displayLocalNotificationAndroid
    })({
        body: `${coworkerName} added a visit for ${today ? 'today' : dateString}. You too are visiting the patient ${today ? 'today' : `on ${dateString}`}${myVisitTime ? ` at ${myVisitTime}` : '. Set a time for the visit.'}`,
        data: {
            navigateTo: screenNames.visitDayViewScreen,
            tabBarHidden: true,
            payload: {
                selectedScreen: 'list',
                visitID: myVisit.visitID,
                midnightEpoch: myVisit.midnightEpochOfVisit,
            }
        },
        notificationID: `${myVisit.visitID}_${collidingVisit.visitID}_${Date.now()}`
    });
}
