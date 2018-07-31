import queueFactory from 'react-native-queue';
import {AssignedPatientsMessagingService} from './AssignedPatientsMessagingService';
import {stringToArrayBuffer} from '../../../utils/encryptionUtils';
import {EpisodeMessagingService} from './EpisodeMessagingService';

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
        messagingServices[AssignedPatientsMessagingService.identifier] = await new AssignedPatientsMessagingService(MessagingServiceCoordinator.getChannelRealm());
        messagingServices[EpisodeMessagingService.identifier] = await new EpisodeMessagingService(MessagingServiceCoordinator.getChannelRealm(), this.queue);

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

export function getMessagingServiceInstance(identifier) {
    const messagingServiceInstance = MessagingServiceCoordinator.getInstance().messageServices[identifier];
    if (!messagingServiceInstance) {
        throw new Error(`Requested messaging service ${identifier} not found`);
    }
    return messagingServiceInstance;
}
