import {BaseMessagingService} from './BaseMessagingService';
import {VisitService} from '../../VisitServices/VisitService';
import {UserDataService} from '../../UserDataService';
import {EpisodeDataService} from '../../EpisodeDataService';

export class VisitMessagingService extends BaseMessagingService {
    onMessage(messageObject) {
        const {message, channel} = messageObject;
        return new Promise((resolve, reject) => {
            console.log('onMessage called');
            console.log(message);
            const {actionType, visitID, userID} = message;
            //TODO if userID is equal to my own, skip this message
            switch (actionType) {
                case 'CREATE' :
                    VisitService.getInstance().fetchAndSaveVisitsByID([visitID])
                        .then(() => resolve())
                        .catch(error => reject(error));
                    break;
                case 'DELETE' :
                    try {
                        VisitService.getInstance().deleteVisitsByID(visitID);
                    } catch (e) {
                        reject(e);
                    }
                    resolve();
                    break;
                case 'UPDATE' :
                    VisitService.getInstance().fetchAndEditVisitsByID([visitID])
                        .then(() => resolve())
                        .catch(error => reject(error));
                    break;
                default:
                    console.log(`unrecognised message: ${message}`);
                    reject();
            }
        });
    }

    // onBulkMessage(messageObjects) {
    //     for (const messageObject of messageObjects) {
    //         const {message} = messageObject;
    //         const {actionType, visitID} = message;
    //         switch (actionType) {
    //             case 'CREATE' :
    //                 VisitService.getInstance().fetchAndSaveVisitsByID([visitID])
    //                     .then(() => resolve())
    //                     .catch(error => reject(error));
    //                 break;
    //             case 'DELETE' :
    //                 try {
    //                     VisitService.getInstance().deleteVisitsByID(visitID);
    //                 } catch (e) {
    //                     reject(e);
    //                 }
    //                 resolve();
    //                 break;
    //             case 'UPDATE' :
    //                 VisitService.getInstance().fetchAndEditVisitsByID([visitID])
    //                     .then(() => resolve())
    //                     .catch(error => reject(error));
    //                 break;
    //             default:
    //                 // throw new Error('Unrecognised action type in assigned patient message');
    //                 console.log(`unrecognised message: ${message}`);
    //                 reject();
    //         }
    //     }
    // }

    initialiseWorkers() {
        this.taskQueue.addWorker('publishVisitMessage', this._publishVisitMessage.bind(this));
    }

    async _publishVisitMessage(jobID, payload) {
        await this.pubnub.publish({
            channel: `${payload.episodeID}_visits`,
            message: {
                actionType: payload.actionType,
                visitID: payload.visitID,
                userID: payload.userID,
                pn_apns: {
                    aps: {
                        'content-available': 1
                    },
                }
            }
        }).catch(error => {
            console.log('error publishing');
            throw new Error(`could not publish message ${error}`);
        });
    }

    publishVisitCreate(visit) {
        //TODO visitAPI
        console.log('publishVisitMessage');
        this.taskQueue.createJob('publishVisitMessage', {
            visitID: visit.visitID,
            episodeID: visit.getEpisode().episodeID,
            actionType: 'CREATE',
            userID: UserDataService.getCurrentUserProps().userID
        });
    }

    publishVisitUpdate(visit) {
        //TODO visitAPI
        this.taskQueue.createJob('publishVisitMessage', {
            visitID: visit.visitID,
            episodeID: visit.getEpisode().episodeID,
            actionType: 'UPDATE',
            userID: UserDataService.getCurrentUserProps().userID
        });
    }

    publishVisitDelete(visit) {
        //TODO visitAPI
        this.taskQueue.createJob('publishVisitMessage', {
            visitID: visit.visitID,
            episodeID: visit.getEpisode().episodeID,
            actionType: 'DELETE',
            userID: UserDataService.getCurrentUserProps().userID
        });
    }

    subscribeToEpisodes(episodes) {
        const channelObjects = episodes.map(episode => ({
            name: `${episode.episodeID}_visits`,
            //TODO this should be more sophisticated
            lastMessageTimestamp: '0',
            handler: this.constructor.name,
        }));
        this._subscribeToChannelsByObject(channelObjects);
    }

    unsubscribeToEpisodes(episodes) {
        const channelObjects = episodes.map(episode => ({
            name: `${episode.episodeID}_visits`,
            //TODO this should be more sophisticated
            lastMessageTimestamp: '0',
            handler: this.constructor.name,
        }));
        this._unsubscribeFromChannelsByObject(channelObjects);
    }

    async _bootstrapChannels() {
        const episodes = EpisodeDataService.getInstance().getAllSyncedEpisodes();
        episodes.map(episode =>
            episode.visits.forEach(visit => this.publishVisitCreate(visit))
        );

        this.subscribeToEpisodes(episodes);
    }
}
