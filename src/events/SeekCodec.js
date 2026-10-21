import { Codec, UInt32Codec } from 'netcode/encoder';

export default class SeekCodec extends Codec {
    constructor() {
        super();

        this.uint32Codec = new UInt32Codec();
    }

    getByteLength() {
        return this.uint32Codec.getByteLength();
    }

    encode(buffer, offset, data) {
        // Seconds to milliseconds
        this.uint32Codec.encode(buffer, offset, data * 1000);
    }

    decode(buffer, offset) {
        // Milliseconds to seconds
        return this.uint32Codec.decode(buffer, offset) / 1000;
    }
}
