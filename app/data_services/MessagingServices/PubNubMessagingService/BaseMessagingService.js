import PubNub from 'pubnub';
import {AsyncStorage} from 'react-native';
import {pubnubPubKey, pubnubSubKey} from '../../../utils/constants';
import {MessagingServiceCoordinator} from './MessagingServiceCoordinator';

export class BaseMessagingService {
    deviceToken = null;
    connected = false;
    channels = [];
    notificationToken;

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

    async processFromHistory(channels = this.channels) {
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
                    console.log('processFromHistory response');
                    console.log(response);
                    for (const message of response.messages) {
                        await this.digestMessage({
                            message: message.entry,
                            timestamp: message.timetoken,
                            channel: channel.name
                        });
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
            //         this.connected = true;
            //     });
            //     break;
            case 'PNTimeoutCategory':
            case 'PNNetworkIssuesCategory':
            case 'PNNetworkDownCategory':
                this.connected = false;
                this.onDisconnect(statusEvent);
                break;
            case 'PNReconnectedCategory':
            case 'PNNetworkUpCategory':
                this.processFromHistory(this.channels).then(() => {
                    this.connected = true;
                });
                break;
            default:
                console.log('unprocessed statusEvent');
        }
    }

    digestMessage(message) {
        return this.onMessage(message)
            .then(() => {
                this.updateLastMessageTime(message);
            })
            .catch(error => {
                console.log('error in messageEventCallback');
                console.log(error);
            });
    }

    async messageEventCallback(message) {
        console.log('pubnub message event');
        console.log(message);

        //TODO scope for error, if during history catchup new messages arrive
        if (this.connected) {
            this.digestMessage({message: message.message, timestamp: message.timetoken, channel: message.channel});
        } else {
            console.log('but  this.connected is false');
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
        return AsyncStorage.getItem('userID').then(userID => {
            this.pubnub = this.newClient(userID);
        }).then(() => {
            this.pubnub.addListener({
                status: this.statusHandler.bind(this),
                message: this.messageEventCallback.bind(this),
            });

            this.taskQueue = taskQueue;
            this.initialiseWorkers();

            const channelsFromRealm = channelRealm.objects('Channel').filtered('handler = $0', this.constructor.name);
            if (channelsFromRealm && channelsFromRealm.length > 0) this.channels.push(...channelsFromRealm.values());

            if (this.channels.length === 0) {
                this._bootstrapChannels();
            } else {
                this._startSubscription(this.channels);
            }

            return this;
        }).catch(error => {
            throw new Error(`error initialising messaging service: ${error}`);
        });
    }

    _subscribeToChannelsByObject(channelObjects) {
        const liveChannelObjects = this.saveChannelToRealm(channelObjects);
        this.channels.push(...liveChannelObjects);
        this._startSubscription(liveChannelObjects);
        this.registerDeviceOnChannels(this.notificationToken, liveChannelObjects);
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
        this.deregisterDeviceOnChannels(this.notificationToken, liveChannelsToRemove);
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
                    realmObjects.push(MessagingServiceCoordinator.getChannelRealm().create('Channel', channel));
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
        this.notificationToken = notificationTokenObject.token;
        this.registerDeviceOnChannels(notificationTokenObject.token);
    }

    registerDeviceOnChannels(token, channels = this.channels) {
        return this.pubnub.push.addChannels(
            {
                channels: channels.map(channel => channel.name),
                device: token,
                pushGateway: 'apns'
            }
        );
    }

    deregisterDeviceOnChannels(token, channels) {
        return this.pubnub.push.removeChannels(
            {
                channels: channels.map(channel => channel.name),
                device: token,
                pushGateway: 'apns'
            }
        );
    }

    _startSubscription(channels) {
        if (channels.length === 0) {
            console.log('No channels to subscribe to');
            return;
        }
        //TODO dont subscribe if history failed
        this.processFromHistory(channels).then(() => {
            this.connected = true;
            console.log(`subscribing to channels: ${channels.map(channel => channel.name)}`);
            if (!channels || channels.length === 0) {
                return;
            }
            return this.pubnub.subscribe({
                channels: channels.map(channel => channel.name)
            });
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
