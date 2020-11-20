import Client from 'netcode/src/client/Client';
import BinaryEncoder from 'netcode/src/encoder/BinaryEncoder';
import events from '@events';

export default class Api {
    constructor(host, protocol) {
        this.host = host;
        this.protocol = protocol;
    }

    addEventListener(name, callback) {
        this.client.addEventListener(name, callback);
    }

    removeEventListener(name, callback) {
        this.client.removeEventListener(name, callback);
    }

    join(room) {
        if (this.client) {
            throw new Error(`Already connected to ${this.client.socket.url}`);
        }

        this.client = new Client(
            `${this.protocol}//${this.host}/${room}/`,
            new BinaryEncoder(events)
        );
    }

    leave() {
        this.client.close();
        this.client = null;
    }

    play() {
        this.client.send('me:control:play');
    }

    pause() {
        this.client.send('me:control:pause');
    }

    ready() {
        this.client.send('me:ready');
    }
}
