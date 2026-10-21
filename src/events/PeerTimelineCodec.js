import { Codec, UInt32Codec } from 'netcode/encoder';

export default class PeerTimelineCodec extends Codec {
    constructor() {
        super();

        this.uint32Codec = new UInt32Codec();
    }

    getByteLength() {
        return this.uint32Codec.getByteLength() * 2;
    }

    encode(buffer, offset, data) {
        const { currentTime, duration } = data;

        // Seconds to milliseconds
        this.uint32Codec.encode(buffer, offset, currentTime * 1000);

        offset += this.uint32Codec.getByteLength();

        // Seconds to milliseconds
        this.uint32Codec.encode(buffer, offset, duration * 1000);
    }

    decode(buffer, offset) {
        // Milliseconds to seconds
        const currentTime = this.uint32Codec.decode(buffer, offset) / 1000;

        offset += this.uint32Codec.getByteLength();

        // Milliseconds to seconds
        const duration = this.uint32Codec.decode(buffer, offset) / 1000;

        return { currentTime, duration };
    }
}
