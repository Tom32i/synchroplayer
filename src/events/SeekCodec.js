import { Codec, UInt32Codec } from 'netcode/encoder';

export default class SeekCodec extends Codec {
    constructor() {
        super();

        this.uint32Codec = new UInt32Codec();
    }

    getByteLength() {
        return this.uint32Codec.getByteLength();
    }

    encode(cursor, data) {
        // Seconds to milliseconds
        this.uint32Codec.encode(cursor, data * 1000);
    }

    decode(cursor) {
        // Milliseconds to seconds
        return this.uint32Codec.decode(cursor) / 1000;
    }
}
