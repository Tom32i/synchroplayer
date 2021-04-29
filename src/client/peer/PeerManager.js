import EventEmitter from 'tom32i-event-emitter.js';
import Distributor from '@client/peer/Distributor';
import Spectator from '@client/peer/Spectator';
import 'webrtc-adapter';

export default class PeerManager extends EventEmitter {
    constructor(api, iceServers = undefined) {
        super();

        this.api = api;
        this.iceServers = iceServers;
        this.stream = null;
        this.spectator = null;
        this.distributors = new Map();
        this.others = [];

        this.createDistributor = this.createDistributor.bind(this);
        this.removeDistributor = this.removeDistributor.bind(this);
        this.onOffer = this.onOffer.bind(this);
        this.onAnswer = this.onAnswer.bind(this);
        this.onIceCandidate = this.onIceCandidate.bind(this);
        this.onStream = this.onStream.bind(this);
        this.onReady = this.onReady.bind(this);
    }

    isStreaming() {
        return this.stream !== null;
    }

    setOthers(others) {
        this.others = others;

        if (this.stream) {
            this.others.forEach(target => {
                if (!this.distributors.has(target)) {
                    setTimeout(() => this.createDistributor(target), 500);
                }
            });

            this.distributors.forEach((distributor, target) => {
                if (!this.others.includes(target)) {
                    this.removeDistributor(distributor);
                }
            });
        }
    }

    distribute(stream) {
        this.ensureIsFree();

        this.stream = stream;

        this.others.forEach(this.createDistributor);
    }

    createDistributor(target) {
        const distributor = new Distributor(target, this.iceServers);

        this.distributors.set(target, distributor);

        distributor.addEventListener('offer', this.onOffer);
        distributor.addEventListener('icecandidate', this.onIceCandidate);
        distributor.addEventListener('ready', this.onReady);

        distributor.setStream(this.stream);
    }

    removeDistributor(distributor) {
        distributor.removeEventListener('offer', this.onOffer);
        distributor.removeEventListener('icecandidate', this.onIceCandidate);
        distributor.removeEventListener('ready', this.onReady);
        distributor.clear();

        this.distributors.delete(distributor.target);
    }

    spectate(description, sender) {
        this.ensureIsFree();

        this.spectator = new Spectator(sender, this.iceServers);

        this.spectator.addEventListener('answer', this.onAnswer);
        this.spectator.addEventListener('icecandidate', this.onIceCandidate);
        this.spectator.addEventListener('stream', this.onStream);
        this.spectator.addEventListener('ready', this.onReady);

        this.spectator.loadRemoteDescription(description);
        this.spectator.answer();
    }

    answer(sender, description) {
        this.distributors.get(sender).loadRemoteDescription(description);
    }

    addCandidate(sender, candidate) {
        if (this.spectator) {
            return this.spectator.addCandidate(candidate);
        }

        return this.distributors.get(sender).addCandidate(candidate);
    }

    onOffer(event) {
        const { description, target } = event.detail;

        this.api.offer(description, target);
    }

    onAnswer(event) {
        const { description } = event.detail;

        this.api.answer(description);
    }

    onIceCandidate(event) {
        const { description, target } = event.detail;

        this.api.newIceCandidate(description, target);
    }

    onStream() {
        this.emit('stream');
    }

    onReady() {
        this.emit('ready');
    }

    ensureIsFree() {
        if (this.stream !== null) {
            throw new Error('Already distributing.');
        }

        if (this.spectator !== null) {
            throw new Error('Already spectating.');
        }
    }

    clear() {
        if (this.spectator !== null) {
            this.spectator.removeEventListener('answer', this.onAnswer);
            this.spectator.removeEventListener('icecandidate', this.onIceCandidate);
            this.spectator.removeEventListener('stream', this.onStream);
            this.spectator.removeEventListener('ready', this.onReady);
            this.spectator.clear();
            this.spectator = null;
        }

        if (this.stream) {
            this.distributors.forEach(this.removeDistributor);
            this.distributors.clear();

            this.stream.getTracks().forEach(track => track.stop());

            this.stream = null;
        }
    }
}
