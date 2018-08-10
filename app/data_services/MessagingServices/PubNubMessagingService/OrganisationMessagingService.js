import {BaseMessagingService} from './BaseMessagingService';
import {UserDataService} from '../../UserDataService';

export class OrganisationMessagingService extends BaseMessagingService {
    static identifier = 'OrganisationMessagingService';

    getName() {
        return OrganisationMessagingService.identifier;
    }

    onMessage(messageObject) {
        const {message, channel} = messageObject;
        return new Promise((resolve, reject) => {
            console.log('onMessage called');
            console.log(message);
            // const organisationID = channel.split('_')[1];
            const {actionType, userID} = message;
            switch (actionType) {
                case 'USER_UPDATE' :
                    UserDataService.getInstance().fetchAndUpdateUserInRealm(userID)
                        .then(() => resolve())
                        .catch(error => {
                            console.log('error in user update');
                            console.log(error);
                            resolve();
                        });
                    break;
                default:
                    console.log(`unrecognised message: ${message}`);
                    reject();
            }
        });
    }

    initialiseWorkers() {
        // this.taskQueue.addWorker('publishVisitMessage', this._publishVisitMessage.bind(this), {
        //     concurrency: 3,
        //     onFailed: (id, payload) => {
        //         console.log(`Publish to server Job "job-name-here" with id ${id} had an attempt end in failure. Payload: ${payload}`);
        //     }
        // });
    }

    subscribeToOrganisation(organisation, suppressNotificationFromHistory = false) {
        const channelObject = {
            name: `organisation_${organisation.organisationID}`,
            //TODO this should be more sophisticated
            lastMessageTimestamp: '0',
            handler: OrganisationMessagingService.identifier,
        };
        this._subscribeToChannelsByObject([channelObject], suppressNotificationFromHistory);
    }

    unsubscribeToOrganisations(organisations) {
        const channelObjects = organisations.map(organisation => ({
            name: `organisation_${organisation.organisationID}`,
            //TODO this should be more sophisticated
            lastMessageTimestamp: '0',
            handler: OrganisationMessagingService.identifier,
        }));
        this._unsubscribeFromChannelsByObject(channelObjects);
    }

    async _bootstrapChannels() {
        const organisation = UserDataService.getCurrentUserProps().org;

        console.log('bootstrapping organisation channel');
        this.subscribeToOrganisation(organisation, true);
    }
}
