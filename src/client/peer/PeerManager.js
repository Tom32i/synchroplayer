import Distributor from '@client/peer/Distributor';
import Spectator from '@client/peer/Spectator';
import 'webrtc-adapter';

export default class PeerManager {
    constructor(api) {
        this.api = api;
        this.distributor = null;
        this.spectator = null;
    }

    distribute(video) {
        this.ensureIsFree();

        this.distributor = new Distributor(this.api);
        this.distributor.loadVideo(video);
    }

    spectate(description) {
        this.ensureIsFree();

        this.spectator = new Spectator(this.api);

        this.spectator.loadRemoteDescription(description);
        this.spectator.answer();
    }

    answer(description) {
        this.distributor.loadRemoteDescription(description);
    }

    addCandidate(candidate) {
        if (this.distributor) {
            return this.distributor.addCandidate(candidate);
        }

        if (this.spectator) {
            return this.spectator.addCandidate(candidate);
        }
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
