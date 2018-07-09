import PubNub from 'pubnub';

export class BaseMessagingService {
    deviceToken = null;
    connected = false;
    pubnub = new PubNub({
        publishKey: 'pub-c-087e1ed9-82bc-43f5-a2b0-1c62deff6a3b',
        subscribeKey: 'sub-c-572e27ae-7608-11e8-9fa1-423cba266524'
    });

    async initialChannels() {
        return null;
    }

    onMessage(msg) {
        
    }

    constructor() {
        this.pubnub.addListener({
            status(statusEvent) {
                console.log('pubnub status event');
                console.log(statusEvent);
                if (statusEvent.category === 'PNConnectedCategory') {
                    this.connected = true;
                }
            },
            message(msg) {
                console.log('pubnub message event');
                console.log(msg);

                this.onMessage(msg);
            }
        });

        this.initialChannels().then(channels => this.subscribeToChannels(channels));
    }

    saveDeviceToken(token) {
        this.deviceToken = token;
    }

    registerDeviceOnChannels(channels) {
        if (!this.deviceToken) {
            throw new Error('Register device called, but device token not registered with the messaging service');
        }
        return this.pubnub.push.addChannels(
            {
                channels,
                device: this.deviceToken,
                pushGateway: 'apns'
            }
        );
    }

    subscribeToChannels(channels) {
        if (!channels || channels.length === 0) {
            return;
        }
        return this.pubnub.subscribe({
            channels
        });
    }
}
