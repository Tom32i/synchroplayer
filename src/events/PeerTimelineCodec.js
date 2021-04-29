import { Codec, Int32Codec } from 'netcode/src/encoder/codec';

export default class PeerTimelineCodec extends Codec {
    constructor() {
        super();

        this.int32Codec = new Int32Codec();
    }

    getByteLength() {
        return this.int32Codec.getByteLength() * 2;
    }

    encode(buffer, offset, data) {
        const { currentTime, duration } = data;

        // Seconds to milliseconds
        this.int32Codec.encode(buffer, offset, currentTime * 1000);

        offset += this.int32Codec.getByteLength();

        // Seconds to milliseconds
        this.int32Codec.encode(buffer, offset, duration * 1000);
    }

    decode(buffer, offset) {
        // Milliseconds to seconds
        const currentTime = this.int32Codec.decode(buffer, offset) / 1000;

        offset += this.int32Codec.getByteLength();

        // Milliseconds to seconds
        const duration = this.int32Codec.decode(buffer, offset) / 1000;

        return { currentTime, duration };
    }
}
