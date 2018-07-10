import PubNub from 'pubnub';
import {AsyncStorage} from 'react-native';

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
                this.connected = true;
                break;
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
            publishKey: 'pub-c-087e1ed9-82bc-43f5-a2b0-1c62deff6a3b',
            subscribeKey: 'sub-c-572e27ae-7608-11e8-9fa1-423cba266524',
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
