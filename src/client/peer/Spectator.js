import AbstractPeer from '@client/peer/AbstractPeer';

export default class Spectator extends AbstractPeer {
    constructor(api) {
        super(api);

        this.stream = null;
        this.video = null;

        this.onTrack = this.onTrack.bind(this);
        this.onLocalDescriptionLoaded = this.onLocalDescriptionLoaded.bind(this);

        this.connection.addEventListener('track', this.onTrack);
        // this.connection.addEventListener('negotiationneeded', this.handleNegotiationNeededEvent.bind(this));
        // this.connection.addEventListener('removetrack', this.handleRemoveTrackEvent.bind(this));
        // this.connection.addEventListener('icegatheringstatechange', this.handleICEGatheringStateChangeEvent.bind(this));
        // this.connection.addEventListener('signalingstatechange', this.handleSignalingStateChangeEvent.bind(this));
    }

    answer() {
        this.connection.createAnswer()
            .then(this.loadLocalDescription)
            .then(this.onLocalDescriptionLoaded)
            .catch(this.onError);
    }

    setVideo(video) {
        this.video = video;

        this.playStreamOnVideo();
    }

    setStream(stream) {
        this.stream = stream;
        this.playStreamOnVideo();
    }

    onLocalDescriptionLoaded() {
        this.api.answer(this.connection.localDescription);
    }

    onTrack(event) {
        if (!this.stream) {
            this.setStream(event.streams[0]);
        }
    }

    playStreamOnVideo() {
        if (!!this.video && !!this.stream) {
            this.video.srcObject = this.stream;
        }
    }
}
