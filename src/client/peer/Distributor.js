import AbstractPeer from '@client/peer/AbstractPeer';

export default class Distributor extends AbstractPeer {
    constructor(target, iceServers = undefined) {
        super(iceServers);

        this.target = target;
        this.stream = null;
        this.tracks = [];

        this.onLocalDescriptionLoaded = this.onLocalDescriptionLoaded.bind(this);
    }

    setStream(stream) {
        this.stream = stream;
        this.tracks = this.stream.getTracks().map(track => this.connection.addTrack(track, this.stream));

        this.connection.createOffer({ offerToReceiveAudio: 1, offerToReceiveVideo: 1 })
            .then(this.loadLocalDescription)
            .then(this.onLocalDescriptionLoaded)
            .catch(this.onError);
    }

    onLocalDescriptionLoaded() {
        this.emit('offer', {
            target: this.target,
            description: this.connection.localDescription,
        });
    }

    clear() {
        if (this.stream) {
            this.tracks.forEach(sender => this.connection.removeTrack(sender));
            this.tracks.length = 0;
            this.stream = null;
        }

        super.clear();
    }
}
