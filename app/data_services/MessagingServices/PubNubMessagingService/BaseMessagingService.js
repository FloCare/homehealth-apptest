import PubNub from 'pubnub';
import {pubnubPubKey, pubnubSubKey} from '../../../utils/constants';
import {MessagingServiceCoordinator} from './MessagingServiceCoordinator';
import {UserDataService} from '../../UserDataService';

export class BaseMessagingService {
    deviceToken = null;
    caughtUpOnHistory = false;
    channels = [];
    notificationTokenObject;

    onMessage() {

    }

    onDisconnect() {
    }

    _bootstrapChannels() {
        return null;
    }

    getChannelObjectsForPayload() {
        return undefined;
    }

    initialiseWorkers() {

    }

    async processFromHistory(channels = this.channels, suppressNotification = false) {
        console.log('processFromHistory');
        console.log(channels);

        const allPromises = [];
        for (const channel of channels) {
            const assignedVisitLastTimestamp = channel.lastMessageTimestamp;
            const newPromise = this.newClient().history({
                channel: channel.name,
                reverse: true,
                start: assignedVisitLastTimestamp,
                stringifiedTimeToken: true,
            }).then(async response => {
                console.log(`processFromHistory response for channel ${channel.name}`);
                console.log(response);
                for (const message of response.messages) {
                    try {
                        await this.digestMessage({
                            message: message.entry,
                            timestamp: message.timetoken,
                            channel: channel.name,
                            suppressNotification
                        });
                    } catch (e) {
                        console.log('skipping a message that threw error');
                    }
                }

                if (response.messages.length === 100) {
                    this.processFromHistory([channel]);
                }
            }).catch(error => {
                console.log('error in history call');
                console.log(error);
            });
            allPromises.push(newPromise);
        }
        await Promise.all(allPromises);
    }

    statusHandler(statusEvent) {
        console.log('pubnub status event');
        console.log(statusEvent);

        switch (statusEvent.category) {
            // case 'PNConnectedCategory':
            //     this.processFromHistory().then(() => {
            //         this.caughtUpOnHistory = true;
            //     });
            //     break;
            case 'PNTimeoutCategory':
            case 'PNNetworkIssuesCategory':
            case 'PNNetworkDownCategory':
                this.caughtUpOnHistory = false;
                this.onDisconnect(statusEvent);
                break;
            case 'PNReconnectedCategory':
            case 'PNNetworkUpCategory':
                this.processFromHistory(this.channels).then(() => {
                    this.caughtUpOnHistory = true;
                });
                break;
            default:
                console.log('unprocessed statusEvent');
        }
    }

    digestMessage(message) {
        console.log('digest message');
        return this.onMessage(message)
            .then(() => {
                this.updateLastMessageTime(message);
            })
            .catch(error => {
                console.log('error in messageEventCallback');
                console.log(error);
                throw error;
            });
    }

    async messageEventCallback(message) {
        console.log('pubnub message event');
        console.log(message);

        //TODO scope for error, if during history catchup new messages arrive
        if (this.caughtUpOnHistory) {
            this.digestMessage({message: message.message, timestamp: message.timetoken, channel: message.channel});
        } else {
            console.log('but  this.caughtUpOnHistory is false');
        }
    }

    updateLastMessageTime(message) {
        MessagingServiceCoordinator.getChannelRealm().write(() => {
            const channelObj = MessagingServiceCoordinator.getChannelRealm().objectForPrimaryKey('Channel', message.channel);
            channelObj.lastMessageTimestamp = message.timestamp;
        });
    }

    newClient(userID) {
        return new PubNub({
            publishKey: pubnubPubKey,
            subscribeKey: pubnubSubKey,
            uuid: userID,
            ssl: true,
            keepAlive: false
        });
    }

    constructor(channelRealm, taskQueue) {
        this.pubnub = this.newClient(UserDataService.getCurrentUserProps().userID);
        this.pubnub.addListener({
            status: this.statusHandler.bind(this),
            message: this.messageEventCallback.bind(this),
        });

        console.log(`base message running for ${this.getName()}`);
        this.taskQueue = taskQueue;
        this.initialiseWorkers();

        const channelsFromRealm = channelRealm.objects('Channel').filtered('handler = $0', this.getName());
        if (channelsFromRealm && channelsFromRealm.length > 0) this.channels.push(...channelsFromRealm.values());

        if (this.channels.length === 0) {
            this._bootstrapChannels();
        } else {
            this._startSubscription(this.channels);
        }
        return this;
    }

    _subscribeToChannelsByObject(channelObjects, suppressNotificationFromHistory = false) {
        const liveChannelObjects = this.saveChannelToRealm(channelObjects);
        this.channels.push(...liveChannelObjects);
        this._startSubscription(liveChannelObjects, suppressNotificationFromHistory);
        this.registerDeviceOnChannels(this.notificationTokenObject, liveChannelObjects);
    }

    //TODO unsubscribe from channels will aslo have to remove notification registration
    _unsubscribeFromChannelsByObject(channelObjects) {
        // console.log('here at unsubs');
        // console.log(channelObjects);
        const liveChannelsToRemove = this.channels.filter(channelLiveObject => {
            let toRemove = false;
            channelObjects.forEach(channelObject => {
                if (channelObject.name === channelLiveObject.name) {
                    toRemove = true;
                }
            });
            return toRemove;
        });

        // console.log(`${channelObjects.length},${liveChannelsToRemove.length},${this.channels.length}`);

        this._unsubscribe(liveChannelsToRemove);
        this.deregisterDeviceOnChannels(this.notificationTokenObject, liveChannelsToRemove);
        this.channels = this.channels.filter(channel => liveChannelsToRemove.indexOf(channel) === -1);
        this.deleteChannelsFromRealm(channelObjects.map(channelObject => channelObject.name));
    }

    deleteChannelsFromRealm(channelNames) {
        console.log('remove channel to realm');
        MessagingServiceCoordinator.getChannelRealm().write(() => {
            channelNames.forEach(channelName => {
                try {
                    const channelObject = MessagingServiceCoordinator.getChannelRealm().objectForPrimaryKey('Channel', channelName);
                    MessagingServiceCoordinator.getChannelRealm().delete(channelObject);
                } catch (e) {
                    console.log(`tried to delete channel name ${channelName} but it doesnt exist`);
                }
            });
        });
    }

    saveChannelToRealm(channelObjects) {
        console.log('save channel to realm');
        const realmObjects = [];
        try {
            MessagingServiceCoordinator.getChannelRealm().write(() => {
                channelObjects.forEach(channel => {
                    realmObjects.push(MessagingServiceCoordinator.getChannelRealm().create('Channel', channel, true));
                });
            });
            return realmObjects;
        } catch (error) {
            console.log('error in save channel to realm');
            console.log(error);
            throw error;
        }
    }


    onNotificationRegister(notificationTokenObject) {
        this.notificationTokenObject = notificationTokenObject;
        this.registerDeviceOnChannels(notificationTokenObject);
    }

    registerDeviceOnChannels(tokenObject, channels = this.channels) {
        console.log('register device on channels args');
        console.log(tokenObject);
        if (!tokenObject) {
            return;
        }

        return this.pubnub.push.addChannels(
            {
                channels: channels.map(channel => channel.name),
                device: tokenObject.token,
                pushGateway: tokenObject.pushGateway
            }
        ).then(result => {
            console.log('result of registering device on channel');
            console.log(result);
        }).catch(error => {
            console.log('error in registering device on channel');
            console.log(error);
        });
    }

    deregisterDeviceOnChannels(tokenObject, channels) {
        return this.pubnub.push.removeChannels(
            {
                channels: channels.map(channel => channel.name),
                device: tokenObject.token,
                pushGateway: tokenObject.pushGateway
            }
        ).then(result => {
            console.log('result of deregistering device on channel');
            console.log(result);
        }).catch(error => {
            console.log('error in deregistering device on channel');
            console.log(error);
        });
    }

    _startSubscription(channels, suppressNotificationFromHistory = false) {
        if (channels.length === 0) {
            console.log(`No channels to subscribe to: ${this.getName()}`);
            return;
        }
        //TODO dont subscribe if history failed
        this.processFromHistory(channels, suppressNotificationFromHistory).then(() => {
            this.caughtUpOnHistory = true;
            console.log(`subscribing to channels: ${channels.map(channel => channel.name)}`);
            if (!channels || channels.length === 0) {
                return;
            }
            return this.pubnub.subscribe({
                channels: channels.map(channel => channel.name)
            });
        }).catch(error => {
            console.log('error in catch up so skipping subscription');
            console.log(error);
        });
    }

    _unsubscribe(channels) {
        if (channels.length === 0) {
            console.log('No channels to unsubscribe to');
            return;
        }
        return this.pubnub.unsubscribe({
            channels: channels.map(channel => channel.name)
        });
    }
}
