import {Notification} from '../Notification';

export const NotificationSchemaV1 = {
    name: Notification.getSchemaName(),
    primaryKey: 'notificationID',
    properties: {
        notificationID: 'string',

        createdTime: {type: 'int', indexed: true},
        type: 'string',

        body: 'string',
        screenName: 'string?',
        passProps: 'string?',
        navigatorStyle: 'string?',
        metadata: 'string?'
    }
};
