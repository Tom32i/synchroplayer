import AbstractPeer from '@client/peer/AbstractPeer';
import DebugCanvas from '@client/debug/DebugCanvas';

export default class Distributor extends AbstractPeer {
    loadVideo(video) {
        // const stream = new DebugCanvas().getStream();
        const stream = video.captureStream();

        this.onLocalDescriptionLoaded = this.onLocalDescriptionLoaded.bind(this);

        stream.getTracks().forEach(track => this.connection.addTrack(track, stream));

        this.connection.createOffer({ offerToReceiveAudio: 1, offerToReceiveVideo: 1 })
            .then(this.loadLocalDescription)
            .then(this.onLocalDescriptionLoaded)
            .catch(this.onError);
    }

    onLocalDescriptionLoaded() {
        this.api.offer(this.connection.localDescription);
    }

    onError(error) {
        console.error(error);
    }
}
