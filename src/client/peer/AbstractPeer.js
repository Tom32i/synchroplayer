import EventEmitter from 'tom32i-event-emitter.js';

export default class AbstractPeer extends EventEmitter {
    constructor(iceServers = undefined) {
        super();

        this.connection = new RTCPeerConnection({ iceServers });

        this.loadLocalDescription = this.loadLocalDescription.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
        this.onIceCandidate = this.onIceCandidate.bind(this);
        this.onIceStateChange = this.onIceStateChange.bind(this);
        this.onError = this.onError.bind(this);

        this.connection.addEventListener('connectionstatechange', this.onStateChange);
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

    onStateChange() {
        const { connectionState } = this.connection;

        console.info('Peer connection status: ', connectionState);

        switch(connectionState) {
            case 'connected':
                this.emit('ready');
                break;
        }
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

        console.info('ICE connection status: ', iceConnectionState);
    }

    onError(error) {
        console.error(error);
    }

    clear() {
        this.connection.close();

        this.connection.removeEventListener('connectionstatechange', this.onStateChange);
        this.connection.removeEventListener('icecandidate', this.onIceCandidate);
        this.connection.removeEventListener('iceconnectionstatechange', this.onIceStateChange);
    }
}
