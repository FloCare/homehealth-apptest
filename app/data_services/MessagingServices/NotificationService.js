import {AppState, Platform} from 'react-native';
import {configureNotificationAndroid, displayLocalNotificationAndroid} from './AndroidNotificationService';
import {configureNotificationIOS, displayLocalNotificationIOS} from './IOSNotificationService';
import {Notification} from '../../utils/data/schemas/Models/notification/Notification';

export function configure() {
    AppState.addEventListener('change', nextState => console.log(nextState));
    Platform.select({
        ios: configureNotificationIOS,
        android: configureNotificationAndroid
    })();
}

export function showNotification(body, data, notificationID) {
    Platform.select({
        ios: displayLocalNotificationIOS,
        android: displayLocalNotificationAndroid
    })({
        body,
        data,
        notificationID
    });
}

export class NotificationService {
    static notificationService;

    static initialiseService(floDB) {
        NotificationService.notificationService = new NotificationService(floDB);
    }

    static getInstance() {
        if (!NotificationService.notificationService) {
            throw new Error('Notification service requested before being initialised');
        }

        return NotificationService.notificationService;
    }

    static getFlatNotification(notification) {
        return notification;
    }

    constructor(floDB) {
        this.floDB = floDB;
    }

    addNotificationToCenter(notification) {
        if (!notification) { throw new Error('notification cant be null'); }
        try {
            this.floDB.write(() => {
                this.floDB.create(Notification, notification);
            });
        } catch (e) {
            console.log('error in writing to notification center');
            console.log(notification);
            throw e;
        }
    }

    subscribeToNotification(callback) {
        const results = this.floDB.objects(Notification).sorted('createdTime', true);
        console.log(`exisiting size ${results.length}`);
        results.addListener(notifications => {
            callback(notifications.map(notification => NotificationService.getFlatNotification(notification)));
        });
        callback(results);
    }
}
