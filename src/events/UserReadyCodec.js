import { Codec, BooleanCodec, Int8Codec } from 'netcode/src/encoder/codec';

export default class UserReadyCodec extends Codec {
    constructor() {
        super();

        this.int8Codec = new Int8Codec();
        this.booleanCodec = new BooleanCodec();
    }

    getByteLength() {
        return this.int8Codec.getByteLength()
            + this.booleanCodec.getByteLength();
    }

    encode(buffer, offset, data) {
        const { id, ready } = data;

        this.int8Codec.encode(buffer, offset, id);

        offset += this.int8Codec.getByteLength();

        this.booleanCodec.encode(buffer, offset, ready);
    }

    decode(buffer, offset) {
        const id = this.int8Codec.decode(buffer, offset);

        offset += this.int8Codec.getByteLength();

        const ready = this.booleanCodec.decode(buffer, offset);

        return { id, ready };
    }
}
