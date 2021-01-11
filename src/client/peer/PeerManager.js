import Distributor from '@client/peer/Distributor';
import Spectator from '@client/peer/Spectator';
import 'webrtc-adapter';

export default class PeerManager {
    constructor(api) {
        this.api = api;
        this.distributor = null;
        this.spectator = null;

        this.onOffer = this.onOffer.bind(this);
        this.onAnswer = this.onAnswer.bind(this);
    }

    distribute(video) {
        this.ensureIsFree();

        this.distributor = new Distributor(this.api);
        this.distributor.load(video, this.onOffer);
    }

    spectate(sdp) {
        this.ensureIsFree();

        console.log('spectate', sdp.length);

        this.spectator = new Spectator(this.api);
        this.spectator.load(sdp, this.onAnswer);
    }

    candidate(candidate) {
        if (this.distributor) {
            return this.distributor.candidate(candidate);
        }

        if (this.spectator) {
            return this.spectator.candidate(candidate);
        }
    }

    onOffer(localDescription) {
        this.api.offer(localDescription.sdp);
    }

    onAnswer(localDescription) {
        this.api.answer(localDescription.sdp);
    }

    onCandidate(candidate) {
        this.api.answer(localDescription.sdp);
    }

    ensureIsFree() {
        if (this.distributor) {
            throw new Error('Already distributing.');
        }

        if (this.spectator) {
            throw new Error('Already spectating.');
        }
    }

    clear() {
        this.distributor = null;
        this.spectator = null;
    }
}
