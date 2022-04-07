import AbstractPeer from '@client/peer/AbstractPeer';

export default class Spectator extends AbstractPeer {
    constructor(target, iceServers) {
        super(iceServers);

        this.target = target;
        this.stream = null;

        this.onTrack = this.onTrack.bind(this);
        this.onRemoveTrack = this.onRemoveTrack.bind(this);
        this.onLocalDescriptionLoaded = this.onLocalDescriptionLoaded.bind(this);

        this.connection.addEventListener('track', this.onTrack);
    }

    answer() {
        this.connection.createAnswer()
            .then(this.loadLocalDescription)
            .then(this.onLocalDescriptionLoaded)
            .catch(this.onError);
    }

    onLocalDescriptionLoaded() {
        this.emit('answer', { description: this.connection.localDescription });
    }

    onTrack(event) {
        if (!this.stream) {
            this.stream = event.streams[0];
            this.stream.addEventListener('removetrack', this.onRemoveTrack);
            this.emit('stream');
        }
    }

    onRemoveTrack() {
    }

    clear() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream.removeEventListener('removetrack', this.onRemoveTrack);
            this.stream = null;
        }

        super.clear();
    }
}
