import Client from 'netcode/src/client/Client';
import BinaryEncoder from 'netcode/src/encoder/BinaryEncoder';
import events from '@events';

export default class Api {
    constructor(host, protocol) {
        this.host = host;
        this.protocol = protocol;

        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
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

    play(time) {
        this.client.send('control:play', time);
    }

    pause(time) {
        this.client.send('control:pause', time);
    }

    end() {
        this.client.send('control:end');
    }

    stop() {
        this.client.send('control:stop');
    }

    seek(time) {
        this.client.send('control:seek', time);
    }

    setReady(ready) {
        this.client.send('user:ready', { id: 0, ready });
    }

    loadVideo(source, name, url) {
        this.client.send(`video:${source}`, { url, name });
    }

    offer(description) {
        this.client.send('peer:offer', JSON.stringify(description.toJSON()));
    }

    answer(description) {
        this.client.send('peer:answer', JSON.stringify(description.toJSON()));
    }

    newIceCandidate(candidate) {
        this.client.send('peer:candidate', JSON.stringify(candidate.toJSON()));
    }
}
