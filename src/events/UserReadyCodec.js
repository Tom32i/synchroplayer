import { Codec, BooleanCodec, UInt8Codec } from 'netcode/encoder';

export default class UserReadyCodec extends Codec {
    constructor() {
        super();

        this.uint8Codec = new UInt8Codec();
        this.booleanCodec = new BooleanCodec();
    }

    getByteLength() {
        return this.uint8Codec.getByteLength()
            + this.booleanCodec.getByteLength();
    }

    encode(cursor, data) {
        const { id, ready } = data;

        this.uint8Codec.encode(cursor, id);
        this.booleanCodec.encode(cursor, ready);
    }

    decode(cursor) {
        const id = this.uint8Codec.decode(cursor);
        const ready = this.booleanCodec.decode(cursor);

        return { id, ready };
    }
}
