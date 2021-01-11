export default class Spectator {
    constructor(api) {
        this.api = api;
        this.connection = new RTCPeerConnection();
        this.stream = null;//new MediaStream();
        this.video = null;

        this.onReceive = this.onReceive.bind(this);
        this.handleTrackEvent = this.handleTrackEvent.bind(this);

        this.connection.addEventListener('datachannel', this.onReceive);

        this.connection.addEventListener('icecandidate', this.handleICECandidateEvent.bind(this));
        this.connection.addEventListener('track', this.handleTrackEvent);
        this.connection.addEventListener('negotiationneeded', this.handleNegotiationNeededEvent.bind(this));
        this.connection.addEventListener('removetrack', this.handleRemoveTrackEvent.bind(this));
        this.connection.addEventListener('iceconnectionstatechange', this.handleICEConnectionStateChangeEvent.bind(this));
        this.connection.addEventListener('icegatheringstatechange', this.handleICEGatheringStateChangeEvent.bind(this));
        this.connection.addEventListener('signalingstatechange', this.handleSignalingStateChangeEvent.bind(this));
    }

    load(sdp, success) {
        console.log('load', sdp.length);

        const description = new RTCSessionDescription({ type: 'offer', sdp });

        this.connection.setRemoteDescription(description)
            .then(() => this.connection.createAnswer())
            .then(answer => this.connection.setLocalDescription(answer))
            .then(() => success(this.connection.localDescription))
            .catch(this.onError);
    }

    candidate(sdp) {
        const candidate = new RTCIceCandidate(sdp);

        this.connection.addIceCandidate(candidate)
    }

    setVideo(video) {
        console.log('setVideo', video);
        this.video = video;
        this.playStreamOnVideo();
    }

    setStream(stream) {
        console.log('setStream', stream);
        this.stream = stream;
        this.playStreamOnVideo();
    }

    onReceive(event) {
        console.log('onReceive', event);
    }

    handleICECandidateEvent(event) {
        console.log('handleICECandidateEvent', event);
        if (event.candidate) {
            this.api.newIceCandidate(event.candidate);
        };
    }

    handleTrackEvent(event) {
        console.log('handleTrackEvent', event);

        if (!this.stream) {
            this.setStream(event.streams[0]);
        }
    }

    handleNegotiationNeededEvent(event) {
        console.log('handleNegotiationNeededEvent', event);
    }
    handleRemoveTrackEvent(event) {
        console.log('handleRemoveTrackEvent', event);
    }
    handleICEConnectionStateChangeEvent(event) {
        console.log('handleICEConnectionStateChangeEvent', event, this.connection.iceConnectionState);
    }
    handleICEGatheringStateChangeEvent(event) {
        console.log('handleICEGatheringStateChangeEvent', event);
    }
    handleSignalingStateChangeEvent(event) {
        console.log('handleSignalingStateChangeEvent', event, this.connection.signalingState);
    }

    playStreamOnVideo() {
        console.log('playStreamOnVideo', !!this.video, !!this.stream);

        if (this.video && this.stream) {
            this.video.autoplay = true;
            this.video.srcObject = this.stream;
            console.log('srcObject set', this.stream);
        }
    }

    onError(error) {
        console.error(error);
    }
}
