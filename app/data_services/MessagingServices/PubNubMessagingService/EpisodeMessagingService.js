import {NetInfo} from 'react-native';
import firebase from 'react-native-firebase';
import {eventNames, parameterValues} from '../../../utils/constants';
import {BaseMessagingService} from './BaseMessagingService';
import {VisitService} from '../../VisitServices/VisitService';
import {UserDataService} from '../../UserDataService';
import {EpisodeDataService} from '../../EpisodeDataService';
import {pushNewVisitsToServer, pushVisitDeleteByIDs, pushVisitUpdateToServer} from '../../../utils/API/VisitAPI';
import {showVisitCollisionNotification} from '../NotificationService';
import {todayMomentInUTCMidnight} from '../../../utils/utils';

export class EpisodeMessagingService extends BaseMessagingService {
    static identifier = 'EpisodeMessagingService';

    getName() {
        return EpisodeMessagingService.identifier;
    }

    onMessage(messageObject) {
        const {message, channel} = messageObject;
        return new Promise((resolve, reject) => {
            console.log('onMessage called');
            console.log(message);
            const episodeID = channel.split('_')[1];
            const {actionType, visitID, userID} = message;
            if (userID === UserDataService.getCurrentUserProps().userID) {
                console.log(`message for my own visit, ignoring, mine:${UserDataService.getCurrentUserProps().userID}`);
                resolve();
                return;
            }
            switch (actionType) {
                case 'CREATE' :
                    UserDataService.getInstance().fetchAndSaveUserToRealmIfMissing(userID)
                        .then(() => VisitService.getInstance().fetchAndSaveVisitsByID([visitID]))
                        .then((visits) => {
                            if (!messageObject.suppressNotification) {
                                visits.forEach(visit => {
                                    if (!visit) {
                                        return;
                                    }
                                    // console.log(visit);
                                    const myVisitsForTheDay = VisitService.getInstance().visitRealmService.getVisitsOfCurrentUserForDate(visit.midnightEpochOfVisit);
                                    myVisitsForTheDay.forEach(myVisit => {
                                        if (myVisit.getEpisode().episodeID === visit.getEpisode().episodeID && visit.midnightEpochOfVisit >= todayMomentInUTCMidnight().valueOf()) {
                                            firebase.analytics().logEvent(eventNames.COLLABORATION, {
                                                type: 1
                                            });
                                            showVisitCollisionNotification(myVisit, visit);
                                        }
                                    });
                                });
                            }
                            resolve();
                        }).catch(error => {
                        console.log('error in create');
                        console.log(error);
                        resolve();
                        // reject(error);
                    });
                    break;
                case 'DELETE' :
                    try {
                        VisitService.getInstance().deleteVisitByID(visitID);
                    } catch (e) {
                        reject(e);
                        return;
                    }
                    resolve();
                    break;
                case 'UPDATE' :
                    VisitService.getInstance().fetchAndSaveVisitsByID([visitID], true)
                        .then(() => resolve())
                        .catch(error => {
                            console.log('error in update');
                            console.log(error);
                            resolve();
                            // reject(error)
                        });
                    break;
                case 'USER_UNASSIGNED' :
                    try {
                        VisitService.getInstance().deleteVisitsOfEpisodeByUserID(episodeID, userID);
                    } catch (e) {
                        console.log('failed to process user_unassignment');
                        console.log(e);
                        resolve();
                        return;
                    }
                    resolve();
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
    //                     VisitService.getInstance().deleteVisitByID(visitID);
    //                 } catch (e) {
    //                     reject(e);
    //                 }
    //                 resolve();
    //                 break;
    //             case 'UPDATE' :
    //                 VisitService.getInstance().fetchAndSaveEditedVisitsByID([visitID])
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
        this.taskQueue.addWorker('publishVisitMessage', this._publishVisitMessage.bind(this), {
            concurrency: 3,
            onFailed: (id, payload) => {
                console.log(`Publish to server Job "job-name-here" with id ${id} had an attempt end in failure. Payload: ${payload}`);
            }
        });
        this.taskQueue.addWorker('publishToServer', this._publishToServer.bind(this), {
            concurrency: 3,
            onFailed: (id, payload) => {
                console.log(`Publish to server job "job-name-here" with id ${id} had an attempt end in failure. Payload: ${payload}`);
            }
        });
    }

    async _publishVisitMessage(jobID, payload) {
        await this.pubnub.publish({
            channel: `episode_${payload.episodeID}`,
            message: {
                actionType: payload.actionType,
                visitID: payload.visitID,
                userID: payload.userID,
                pn_apns: payload.makePeersRefresh ?
                    {
                        aps: {
                            'content-available': 1
                        },
                    } : undefined,
                pn_gcm: payload.makePeersRefresh ?
                    {
                        data: {
                            content_available: true
                        },
                    } : undefined,
            }
        }).then(result => {
            console.log('publish visit result');
            console.log(payload);
            console.log(result);
        }).catch(error => {
            console.log('error publishing visit message on pubnub');
            console.log(error);
            throw new Error(`could not publish message ${error}`);
        });
    }

    async _publishToServer(jobID, payload) {
        console.log(`publish job here${payload}`);
        const {action, visits} = payload;
        let serverResponse;
        try {
            switch (action) {
                case 'CREATE':
                    console.log(JSON.stringify({visits}));
                    serverResponse = await pushNewVisitsToServer(visits);
                    break;
                case 'UPDATE':
                    console.log('update body');
                    await Promise.all(visits.map(async visit => {
                        console.log(JSON.stringify(visit));
                        await pushVisitUpdateToServer(visit);
                    }));
                    break;
                case 'DELETE':
                    serverResponse = await pushVisitDeleteByIDs(visits.map(visit => visit.visitID));
                    break;
                default:
                    console.log(`invalid task: ${payload}`);
                    break;
            }
        } catch (e) {
            console.log('error in making server call');
            console.log(payload);
            console.log(e);
            throw e;
        }

        visits.forEach(visit => {
            //TODO check server response is ok
            console.log('publishVisitMessage');
            this.taskQueue.createJob('publishVisitMessage', {
                visitID: visit.visitID,
                episodeID: visit.episodeID,
                actionType: action,
                userID: UserDataService.getCurrentUserProps().userID,
                makePeersRefresh: payload.action === 'CREATE'
            }, {
                attempts: 5
            });
        });
    }

    _getFlatVisitPayload(visit) {
        return {
            visitID: visit.visitID,
            episodeID: visit.getEpisode().episodeID,
            midnightEpochOfVisit: visit.midnightEpochOfVisit,
            isDone: visit.isDone,
            plannedStartTime: visit.plannedStartTime ? visit.plannedStartTime.toISOString() : undefined
        };
    }

    isVisitOfCommonInterest(visit) {
        return !(visit.getPlace() || visit.getPatient().isLocallyOwned);
    }

    _createPublishToServerJob(payload) {
        console.log('creating publish to server job');
        NetInfo.isConnected.fetch().then(isConnected => {
            this.taskQueue.createJob('publishToServer', payload, {attempts: 5}, isConnected);
        });
    }

    publishVisitCreate(visit) {
        if (!this.isVisitOfCommonInterest(visit)) { return; }

        this._createPublishToServerJob({
            action: 'CREATE',
            visits: [this._getFlatVisitPayload(visit)]
        });
    }

    publishVisitUpdate(visit) {
        if (!this.isVisitOfCommonInterest(visit)) { return; }

        this._createPublishToServerJob({
            action: 'UPDATE',
            visits: [this._getFlatVisitPayload(visit)]
        });
    }

    publishVisitDeletes(visits) {
        this._createPublishToServerJob({
            action: 'DELETE',
            visits: visits.filter(visit => this.isVisitOfCommonInterest(visit)).map(visit => this._getFlatVisitPayload(visit))
        });
    }

    subscribeToEpisodes(episodes, suppressNotificationFromHistory = false) {
        const channelObjects = episodes.map(episode => ({
            name: `episode_${episode.episodeID}`,
            //TODO this should be more sophisticated
            lastMessageTimestamp: '0',
            handler: EpisodeMessagingService.identifier,
        }));
        this._subscribeToChannelsByObject(channelObjects, suppressNotificationFromHistory);
    }

    unsubscribeToEpisodes(episodes) {
        const channelObjects = episodes.map(episode => ({
            name: `episode_${episode.episodeID}`,
            //TODO this should be more sophisticated
            lastMessageTimestamp: '0',
            handler: EpisodeMessagingService.identifier,
        }));
        this._unsubscribeFromChannelsByObject(channelObjects);
    }

    async _bootstrapChannels() {
        const episodes = EpisodeDataService.getInstance().getAllSyncedEpisodes();
        episodes.map(episode =>
            episode.visits.forEach(visit => this.publishVisitCreate(visit))
        );

        console.log('bootstrapping chanels');
        // episodes.forEach(episode => console.log(episode.episodeID));
        this.subscribeToEpisodes(episodes, true);
    }
}
