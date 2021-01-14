import EventEmitter from 'tom32i-event-emitter.js';
import Distributor from '@client/peer/Distributor';
import Spectator from '@client/peer/Spectator';
import 'webrtc-adapter';

export default class PeerManager extends EventEmitter {
    constructor(api, store, iceServers) {
        super();

        this.api = api;
        this.store = store;
        this.iceServers = undefined;// iceServers;
        this.distributors = null;
        this.spectator = null;

        this.createDistributor = this.createDistributor.bind(this);
        this.onOffer = this.onOffer.bind(this);
        this.onAnswer = this.onAnswer.bind(this);
        this.onIceCandidate = this.onIceCandidate.bind(this);
        this.onStream = this.onStream.bind(this);
        this.onReady = this.onReady.bind(this);
    }

    distribute(stream) {
        this.ensureIsFree();
        console.log('distribute', this.getOthers());
        this.distributors = this.getOthers().map(this.createDistributor);
        console.log(this.distributors);
        this.distributors.forEach(distributor => distributor.setStream(stream));
    }

    getOthers() {
        const { me, users } = this.store.getState().room;

        return users.map(user => user.id).filter(id => id !== me);
    }

    createDistributor(target) {
        const distributor = new Distributor(target, this.iceServers);

        distributor.addEventListener('offer', this.onOffer);
        distributor.addEventListener('icecandidate', this.onIceCandidate);
        distributor.addEventListener('ready', this.onReady);

        return distributor;
    }

    spectate(description) {
        this.ensureIsFree();

        this.spectator = new Spectator(this.iceServers);

        this.spectator.addEventListener('answer', this.onAnswer);
        this.spectator.addEventListener('icecandidate', this.onIceCandidate);
        this.spectator.addEventListener('stream', this.onStream);
        this.spectator.addEventListener('ready', this.onReady);

        this.spectator.loadRemoteDescription(description);
        this.spectator.answer();
    }

    answer(sender, description) {
        this.getDistributorById(sender).loadRemoteDescription(description);
    }

    addCandidate(sender, candidate) {
        if (this.spectator) {
            return this.spectator.addCandidate(candidate);
        }

        return this.getDistributorById(sender).addCandidate(candidate);
    }

    onOffer(event) {
        console.log('onOffer', event);
        const { description, target } = event.detail;
        this.api.offer(description, target);
    }

    onAnswer(event) {
        console.log('onAnswer');
        const { description, target } = event.detail;

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

    getDistributorById(id) {
        console.log('getDistributorById', id);
        return this.distributors.find(distributor => distributor.target === id);
    }

    ensureIsFree() {
        if (this.distributors) {
            throw new Error('Already distributing.');
        }

        if (this.spectator) {
            throw new Error('Already spectating.');
        }
    }

    clear() {
        if (this.spectator) {
            this.spectator.removeEventListener('answer', this.onAnswer);
            this.spectator.removeEventListener('icecandidate', this.onIceCandidate);
            this.spectator.clear();
            this.spectator = null;
        }

        this.distributors.forEach(distributor => {
            distributor.removeEventListener('offer', this.onOffer);
            distributor.removeEventListener('icecandidate', this.onIceCandidate);
            distributor.clear();
        });

        this.distributors = null;
    }
}
