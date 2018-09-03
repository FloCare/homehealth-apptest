import queueFactory from 'react-native-queue';
import {NetInfo} from 'react-native';
import {AssignedPatientsMessagingService} from './AssignedPatientsMessagingService';
import {stringToArrayBuffer} from '../../../utils/encryptionUtils';
import {EpisodeMessagingService} from './EpisodeMessagingService';
import {OrganisationMessagingService} from './OrganisationMessagingService';
import {ReportMessagingService} from './ReportMessagingService';

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
        const queue = await queueFactory();

        const messagingServices = {};
        messagingServices[AssignedPatientsMessagingService.identifier] = await new AssignedPatientsMessagingService(MessagingServiceCoordinator.getChannelRealm());
        messagingServices[EpisodeMessagingService.identifier] = await new EpisodeMessagingService(MessagingServiceCoordinator.getChannelRealm(), queue);
        messagingServices[OrganisationMessagingService.identifier] = await new OrganisationMessagingService(MessagingServiceCoordinator.getChannelRealm(), queue);
        messagingServices[ReportMessagingService.identifier] = await new ReportMessagingService(MessagingServiceCoordinator.getChannelRealm(), queue);

        MessagingServiceCoordinator.messagingServiceCoordinator = new MessagingServiceCoordinator(messagingServices, queue);
    }

    static getInstance() {
        if (!MessagingServiceCoordinator.messagingServiceCoordinator) {
            throw new Error('Messaging service coordinator requested before being initialised');
        }

        return MessagingServiceCoordinator.messagingServiceCoordinator;
    }

    constructor(messageServices, queue) {
        this.messageServices = messageServices;
        this.queue = queue;

        NetInfo.addEventListener('connectionChange', this.onConnectionStatusChange.bind(this));
        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) this.startQueue();
        });
    }

    onConnectionStatusChange(connectionInfo) {
        console.log(`Connection change, type: ${connectionInfo.type}, effectiveType: ${connectionInfo.effectiveType}`);
        if (connectionInfo.type !== 'none' && connectionInfo.type !== 'unknown') {
            console.log('detected going online, making a call to queue start');
            this.startQueue();
        } else {
            console.log('detected going offline, making a call to queue stop');
            this.stopQueue();
        }
    }

    stopQueue() {
        console.log('stopping queue');
        this.queue.stop();
    }

    startQueue() {
        console.log('starting queue');
        this.queue.start();
    }

    onNotificationRegister(token) {
        console.log('MSC got notification token arg');
        console.log(token);
        for (const serviceName in this.messageServices) {
            if (this.messageServices.hasOwnProperty(serviceName)) {
                this.messageServices[serviceName].onNotificationRegister(token);
            }
        }
    }

    onContentAvailable() {
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
