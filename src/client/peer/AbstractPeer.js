import EventEmitter from 'tom32i-event-emitter.js';

export default class AbstractPeer extends EventEmitter {
    constructor(iceServers = undefined) {
        super();

        this.connection = new RTCPeerConnection({ iceServers });

        this.loadLocalDescription = this.loadLocalDescription.bind(this);
        this.onIceCandidate = this.onIceCandidate.bind(this);
        this.onIceStateChange = this.onIceStateChange.bind(this);
        this.onError = this.onError.bind(this);

        this.connection.addEventListener('icecandidate', this.onIceCandidate);
        this.connection.addEventListener('iceconnectionstatechange', this.onIceStateChange);
    }

    addCandidate(data) {
        const candidate = new RTCIceCandidate(data);

        this.connection.addIceCandidate(candidate).catch(this.onError);
    }

    loadLocalDescription(description) {
        return this.connection.setLocalDescription(description);
    }

    loadRemoteDescription(data) {
        const description = new RTCSessionDescription(data);

        this.connection.setRemoteDescription(description).catch(this.onError);
    }

    onIceCandidate(event) {
        if (event.candidate) {
            this.emit('icecandidate', {
                target: this.target,
                description: event.candidate,
            });
        }
    }

    onIceStateChange() {
        const { iceConnectionState } = this.connection;

        switch (iceConnectionState) {
            case 'connected':
                this.emit('ready');
                break;

            default:
                console.info('ICE connection status: ', iceConnectionState);
        }
    }

    onError(error) {
        console.error(error);
    }

    clear() {
        this.connection.close();
    }
}
