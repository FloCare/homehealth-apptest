import {NetInfo} from 'react-native';
import firebase from 'react-native-firebase';
import {BaseMessagingService} from './BaseMessagingService';
import {UserDataService} from '../../UserDataService';
import {EpisodeDataService} from '../../EpisodeDataService';
import {NoteDataService} from '../../NotesDataService';

export class NotesMessagingService extends BaseMessagingService {
    static identifier = 'NotesMessagingService';

    getName() {
        return NotesMessagingService.identifier;
    }

    onMessage(messageObject) {
        const {message, channel, timetoken} = messageObject;
        return new Promise((resolve, reject) => {
            console.log('onMessage called');
            const episodeID = channel.split('_')[1];
            const {actionType, userID, messageID, dataJson} = message;
            // if (userID === UserDataService.getCurrentUserProps().userID) {
            //     console.log('on message called for a message published by myself, ignoring');
            //     resolve();
            //     return;
            // }

            switch (actionType) {
                case 'NEW_NOTE' :
                    this.processNewNoteMessage(messageObject);
                    resolve();
                    // reject(error);
                    break;
                default:
                    console.log(`NotesMessagingService: unrecognised message: ${message}`);
                    reject();
            }
        });
    }

    processNewNoteMessage(messageObject) {
        const noteObject = this.getNoteObjectFromMessage(messageObject.message, messageObject.timetoken, true);
        NoteDataService.getInstance().saveNoteObject(noteObject);
    }

    getNoteObjectFromMessage(message, timetoken, synced) {
        const episode = EpisodeDataService.getInstance().getEpisodeByID(message.episodeID);
        const user = UserDataService.getInstance().getUserByID(message.userID);

        if (!episode || !user) {
            throw new Error('Episode or user missing for note message');
        }
        return {
            messageID: message.messageID,
            episode,
            messageType: message.messageType,
            user,
            superID: message.superID,
            data: message.data,

            timetoken,
            synced,
        };
    }

    initialiseWorkers() {
        this.taskQueue.addWorker('publishNotesMessage', this._publishNotesMessage.bind(this), {
            concurrency: 3,
            onFailed: (id, payload) => {
                console.log(`Publish Notes message Job "job-name-here" with id ${id} had an attempt end in failure. Payload: ${payload}`);
            }
        });
        this.taskQueue.addWorker('publishToServer', this._publishToServer.bind(this), {
            concurrency: 3,
            onFailed: (id, payload) => {
                console.log(`Publish to server job "job-name-here" with id ${id} had an attempt end in failure. Payload: ${payload}`);
            }
        });
    }

    async _publishNotesMessage(jobID, payload) {
        await this.pubnub.publish({
            channel: `episode_${payload.episodeID}_notes`,
            message: payload,
        }).then(result => {
            console.log('publish visit result');
            //console.log(payload);
            //console.log(result);
        }).catch(error => {
            console.log('error publishing visit message on pubnub');
            console.log(error);
            throw new Error(`could not publish message ${error}`);
        });
    }

    _createPublishNotesMessageJob(payload) {
        this.taskQueue.createJob('publishNotesMessage', {
            messageID: payload.messageID,
            episodeID: payload.episodeID,
            messageType: payload.messageType,
            userID: payload.userID,
            superID: payload.superID,
            data: payload.data,

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
        }, {
            attempts: 5
        });
    }

    publishNewNote(note) {
        this._createPublishNotesMessageJob({
            messageID: note.messageID,
            episodeID: note.episode.episodeID,
            messageType: note.messageType,
            userID: note.user.userID,
            superID: note.superID,
            data: note.data,
            makePeersRefresh: true
        });
    }

    subscribeToEpisodes(episodes, suppressNotificationFromHistory = false) {
        const channelObjects = episodes.map(episode => ({
            name: `episode_${episode.episodeID}_notes`,
            //TODO this should be more sophisticated
            lastMessageTimestamp: '0',
            handler: NotesMessagingService.identifier,
        }));
        this._subscribeToChannelsByObject(channelObjects, suppressNotificationFromHistory);
    }

    unsubscribeToEpisodes(episodes) {
        const channelObjects = episodes.map(episode => ({
            name: `episode_${episode.episodeID}_notes`,
            //TODO this should be more sophisticated
            lastMessageTimestamp: '0',
            handler: NotesMessagingService.identifier,
        }));
        this._unsubscribeFromChannelsByObject(channelObjects);
    }

    async _bootstrapChannels() {
        const episodes = EpisodeDataService.getInstance().getAllSyncedEpisodes();
        console.log('bootstrapping note channels');
        this.subscribeToEpisodes(episodes, true);
    }
}
