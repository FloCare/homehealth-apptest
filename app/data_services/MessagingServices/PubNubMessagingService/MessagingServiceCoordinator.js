import {AssignedPatientsMessageService} from './AssignedPatientsMessageService';

export class MessagingServiceCoordinator {
    static messagingServiceCoordinator;

    static async initialiseService() {
        MessagingServiceCoordinator.messagingServiceCoordinator = new MessagingServiceCoordinator({
            assignedPatientsMessageService: await new AssignedPatientsMessageService()
        });
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

