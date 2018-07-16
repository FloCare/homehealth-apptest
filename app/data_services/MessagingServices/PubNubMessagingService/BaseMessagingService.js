import PubNub from 'pubnub';
import {AsyncStorage} from 'react-native';
import {pubnubPubKey, pubnubSubKey} from "../../../utils/constants";

export class BaseMessagingService {
    deviceToken = null;
    connected = false;

    async initialChannels() {
        return null;
    }

    onMessage() {

    }

    onDisconnect() {
    }

    async processFromHistory() {

    }

    statusHandler(statusEvent) {
        console.log('pubnub status event');
        console.log(statusEvent);

        switch (statusEvent.category) {
            case 'PNConnectedCategory':
                this.processFromHistory().then(() => {
                    this.connected = true;
                });
                break;
            case 'PNTimeoutCategory':
            case 'PNNetworkIssuesCategory':
            case 'PNNetworkDownCategory':
                this.connected = false;
                this.onDisconnect(statusEvent);
                break;
            case 'PNReconnectedCategory':
            case 'PNNetworkUpCategory':
                this.processFromHistory().then(() => {
                    this.connected = true;
                });
                break;
            default:
                console.log('unprocessed statusEvent');
        }
    }

    messageHandler(message) {
        console.log('pubnub message event');
        console.log(message);

        //TODO scope for error, if during history catchup new messages arrive
        if (this.connected) {
            this.onMessage(message.message, message.timetoken);
        } else {
            console.log('but this.connected is false');
        }
    }

    newClient(userID) {
        return new PubNub({
            publishKey: pubnubPubKey,
            subscribeKey: pubnubSubKey,
            uuid: userID,
            ssl: true, // make it true
            keepAlive: false
        });
    }

    constructor() {
        return AsyncStorage.getItem('userID').then(userID => {
            this.pubnub = this.newClient(userID);
        }).then(() => {
            this.pubnub.addListener({
                status: this.statusHandler.bind(this),
                message: this.messageHandler.bind(this),
            });

            this.initialChannels().then(channels => {
                    this.channels = channels;
                }
            );
            this.processFromHistory().then(() => this.subscribeToChannels(this.channels));

            return this;
        }).catch(error => {
            throw new Error(`error initialising messaging service: ${error}`);
        });
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

    subscribeToChannels(channels) {
        console.log(`subscribing to channels: ${channels}`);
        if (!channels || channels.length === 0) {
            return;
        }
        return this.pubnub.subscribe({
            channels
        });
    }
}
