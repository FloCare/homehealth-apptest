import PubNub from 'pubnub';
import {AsyncStorage} from 'react-native';
import {pubnubPubKey, pubnubSubKey} from '../../../utils/constants';
import {MessagingServiceCoordinator} from './MessagingServiceCoordinator';

export class BaseMessagingService {
    deviceToken = null;
    connected = false;
    channels = [];

    onMessage() {

    }

    onDisconnect() {
    }

    getSeedChannels() {
        return null;
    }

    async processFromHistory(channels) {
        console.log('processFromHistory');
        console.log(channels);
        for (const channel of channels) {
            const assignedVisitLastTimestamp = channel.lastMessageTimestamp;

            this.newClient().history({
                channel: channel.name,
                reverse: true,
                start: assignedVisitLastTimestamp,
                stringifiedTimeToken: true,
            }).then(async response => {
                console.log('processFromHistory response');
                console.log(response);
                for (const message of response.messages) {
                    await this.digestMessage({message: message.entry, timestamp: message.timetoken, channel: channel.name});
                }

                if (response.messages.length === 100) { this.processFromHistory([channel]); }
            }).catch(error => {
                console.log('error in history call');
                console.log(error);
            });
        }
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
        return this.onMessage(message.message)
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

    constructor(channelRealm) {
        return AsyncStorage.getItem('userID').then(userID => {
            this.pubnub = this.newClient(userID);
        }).then(() => {
            this.pubnub.addListener({
                status: this.statusHandler.bind(this),
                message: this.messageEventCallback.bind(this),
            });

            const channelsFromRealm = channelRealm.objects('Channel').filtered('handler = $0', this.constructor.name);
            if (channelsFromRealm && channelsFromRealm.length > 0) this.channels.push(...channelsFromRealm.values());

            if (this.channels.length === 0) {
                console.log('found channels length to be zero, calling seed generator');
                this.getSeedChannels().then(seedChannels => {
                    if (seedChannels.length > 0) {
                        const liveChannelObjects = this.saveChannelToRealm(seedChannels);
                        if (seedChannels.length > 0) this.channels.push(...liveChannelObjects);
                        this.startSubscription(this.channels);
                    }
                });
            } else this.startSubscription(this.channels);

            return this;
        }).catch(error => {
            throw new Error(`error initialising messaging service: ${error}`);
        });
    }

    saveChannelToRealm(channels) {
        console.log('save channel to realm');
        const realmObjects = [];
        try {
            MessagingServiceCoordinator.getChannelRealm().write(() => {
                channels.forEach(channel => {
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

    onNotificationRegister() {

    }

    registerDeviceOnChannels(token) {
        return this.pubnub.push.addChannels(
            {
                channels: this.channels,
                device: token,
                pushGateway: 'apns'
            }
        );
    }

    startSubscription(channels) {
        if (channels.length === 0) {
            console.log('No channels to subscribe to');
            return;
        }
        //TODO dont subscribe if history failed
        this.processFromHistory(channels).then(() => {
            this.connected = true;
            console.log(`subscribing to channels: ${channels}`);
            if (!channels || channels.length === 0) {
                return;
            }
            return this.pubnub.subscribe({
                channels: channels.map(channel => channel.name)
            });
        });
    }
}
