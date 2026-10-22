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

    encode(buffer, offset, data) {
        const { id, ready } = data;

        this.uint8Codec.encode(buffer, offset, id);

        offset += this.uint8Codec.getByteLength();

        this.booleanCodec.encode(buffer, offset, ready);
    }

    decode(buffer, offset) {
        const id = this.uint8Codec.decode(buffer, offset);

        offset += this.uint8Codec.getByteLength();

        const ready = this.booleanCodec.decode(buffer, offset);

        return { id, ready };
    }
}
