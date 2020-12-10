import { Codec, Int32Codec } from 'netcode/src/encoder/codec';

export default class SeekCodec extends Codec {
    constructor() {
        super();

        this.int32Codec = new Int32Codec();
    }

    getByteLength() {
        return this.int32Codec.getByteLength();
    }

    encode(buffer, offset, data) {
        // Seconds to milliseconds
        this.int32Codec.encode(buffer, offset, data * 1000);
    }

    decode(buffer, offset) {
        // Milliseconds to seconds
        return this.int32Codec.decode(buffer, offset) / 1000;
    }
}
