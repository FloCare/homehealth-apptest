import queueFactory from 'react-native-queue';
import {AssignedPatientsMessageService} from './AssignedPatientsMessageService';
import {stringToArrayBuffer} from '../../../utils/encryptionUtils';
import {VisitMessagingService} from './VisitMessagingService';

const Realm = require('realm');

export class MessagingServiceCoordinator {
    static messagingServiceCoordinator;
    static channelRealm = null;

    static initialiseRealm(key) {
        try {
            MessagingServiceCoordinator.channelRealm = new Realm({
                schema: [{
                    name: 'Channel',
                    primaryKey: 'name',
                    properties: {
                        name: 'string',
                        lastMessageTimestamp: {type: 'string', default: '0'},
                        handler: 'string'
                    }
                }],
                encryptionKey: stringToArrayBuffer(key),
                path: 'database.channelRealm',
            });
        } catch (e) {
            console.log('failed to init channels realm');
            console.log(e);
        }
    }

    static getChannelRealm() {
        if (!MessagingServiceCoordinator.channelRealm) {
            throw new Error('channel realm requested before initialisation');
        }
        return MessagingServiceCoordinator.channelRealm;
    }

    static async initialiseService(channelRealmKey) {
        MessagingServiceCoordinator.initialiseRealm(channelRealmKey);
        this.queue = await queueFactory();

        const messagingServices = {};
        messagingServices[AssignedPatientsMessageService.name] = await new AssignedPatientsMessageService(MessagingServiceCoordinator.getChannelRealm());
        messagingServices[VisitMessagingService.name] = await new VisitMessagingService(MessagingServiceCoordinator.getChannelRealm(), this.queue);

        MessagingServiceCoordinator.messagingServiceCoordinator = new MessagingServiceCoordinator(messagingServices);
    }

    static getInstance() {
        if (!MessagingServiceCoordinator.messagingServiceCoordinator) {
            throw new Error('Messaging service coordinator requested before being initialised');
        }

        return MessagingServiceCoordinator.messagingServiceCoordinator;
    }

    constructor(messageServices) {
        this.messageServices = messageServices;
    }

    onNotificationRegister(token) {
        for (const serviceName in this.messageServices) {
            if (this.messageServices.hasOwnProperty(serviceName)) {
                this.messageServices[serviceName].onNotificationRegister(token);
            }
        }
    }

    onNotification(notification) {
        const allPromises = [];
        for (const serviceName in this.messageServices) {
            if (this.messageServices.hasOwnProperty(serviceName)) {
                allPromises.push(this.messageServices[serviceName].processFromHistory());
            }
        }
        return Promise.all(allPromises);
    }
}

export function getMessagingServiceInstance(serviceClassName) {
    const messagingServiceInstance = MessagingServiceCoordinator.getInstance().messageServices[serviceClassName.name];
    if (!messagingServiceInstance) {
        throw new Error(`Requested messaging service ${serviceClassName.name}not found`);
    }
    return messagingServiceInstance;
}
