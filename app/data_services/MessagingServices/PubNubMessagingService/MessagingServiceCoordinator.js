// import Realm from 'realm';
import {AssignedPatientsMessageService} from './AssignedPatientsMessageService';
import {VisitMessagingService} from './VisitMessagingService';
import {stringToArrayBuffer} from "../../../utils/encryptionUtils";

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
        const messagingServices = {};
        messagingServices[AssignedPatientsMessageService.name] = await new AssignedPatientsMessageService(MessagingServiceCoordinator.getChannelRealm());
        // messagingServices[VisitMessagingService.name] = await new VisitMessagingService(MessagingServiceCoordinator.getChannelRealm());

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
        for (const serviceName in this.messageServices) {
            if (this.messageServices.hasOwnProperty(serviceName)) {
                this.messageServices[serviceName].processFromHistory();
            }
        }
    }
}

