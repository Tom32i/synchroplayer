export default class AbstractPeer {
    constructor(api) {
        this.api = api;
        this.connection = new RTCPeerConnection(/* {
            iceServers:[
                {url:'stun:stun.l.google.com:19302'},
                {url:'stun:stun1.l.google.com:19302'},
                {url:'stun:stun2.l.google.com:19302'},
                {url:'stun:stun3.l.google.com:19302'},
                {url:'stun:stun4.l.google.com:19302'},
            ]
        }*/);

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
            this.api.newIceCandidate(event.candidate);
        }
    }

    onIceStateChange() {
        console.log('onIceStateChange', this.connection.iceConnectionState);
    }

    onError(error) {
        console.error(error);
    }
}
