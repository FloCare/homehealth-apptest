import {Notification} from '../Notification';

export const NotificationSchemaV1 = {
    name: Notification.getSchemaName(),
    primaryKey: 'notificationID',
    properties: {
        notificationID: 'string',

        createdTime: 'date',
        type: 'string',

        body: 'string',
        onClick: 'string?',
        onClickProps: 'string?',
        metaData: 'string?'
    }
};
