export default class Distributor {
    constructor(api) {
        this.api = api;
        this.connection = new RTCPeerConnection();

        this.onStatusChange = this.onStatusChange.bind(this);
        this.handleICECandidateEvent = this.handleICECandidateEvent.bind(this);
        this.onError = this.onError.bind(this);

        this.connection.addEventListener('icecandidate', this.handleICECandidateEvent);
        this.connection.addEventListener('track', this.handleTrackEvent.bind(this));
        this.connection.addEventListener('negotiationneeded', this.handleNegotiationNeededEvent.bind(this));
        this.connection.addEventListener('removetrack', this.handleRemoveTrackEvent.bind(this));
        this.connection.addEventListener('iceconnectionstatechange', this.handleICEConnectionStateChangeEvent.bind(this));
        this.connection.addEventListener('icegatheringstatechange', this.handleICEGatheringStateChangeEvent.bind(this));
        this.connection.addEventListener('signalingstatechange', this.handleSignalingStateChangeEvent.bind(this));

        //this.channel = this.connection.createDataChannel('video-send');
        //this.channel.addEventListner('open', this.onStatusChange);
        //this.channel.addEventListner('close', this.onStatusChange);
    }

    load(video, success) {
        const stream = video.captureStream();

        stream.getTracks().forEach(track => this.connection.addTrack(track, stream));

        /*const mirror = document.createElement('video');
        mirror.className = 'mirror';
        mirror.width = 480;
        mirror.height = 320;
        mirror.autoplay = true;
        document.body.appendChild(mirror);
        mirror.srcObject = stream;*/

        this.connection.createOffer()
            .then(offer => this.connection.setLocalDescription(offer))
            .then(() => success(this.connection.localDescription))
            .catch(this.onError);
    }

    answer(sdp) {
        console.log('answer', sdp.length);

        const description = new RTCSessionDescription({ type: 'answer', sdp });

        this.connection.setRemoteDescription(description).catch(this.onError);
    }

    candidate(sdp) {
        const candidate = new RTCIceCandidate(sdp);

        this.connection.addIceCandidate(candidate)
    }

    handleICECandidateEvent(event) {
        console.log('handleICECandidateEvent', event);
        if (event.candidate) {
            this.api.newIceCandidate(event.candidate);
        }
    }
    handleTrackEvent(event) {
        console.log('handleTrackEvent', event);
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

    onStatusChange(event) {

    }

    onError(error) {
        console.error(error);
    }
}
