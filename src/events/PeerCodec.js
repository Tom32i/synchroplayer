import { Codec, Int8Codec, LongStringCodec } from 'netcode/src/encoder/codec';

export default class PeerCodec extends Codec {
    constructor() {
        super();

        this.int8Codec = new Int8Codec();
        this.longStringCodec = new LongStringCodec();
    }

    getByteLength(data) {
        return this.int8Codec.getByteLength() * 2 + this.longStringCodec.getByteLength(data.description);
    }

    encode(buffer, offset, data) {
        const { sender, target, description } = data;

        this.int8Codec.encode(buffer, offset, sender || 0);

        offset += this.int8Codec.getByteLength();

        this.int8Codec.encode(buffer, offset, target || 0);

        offset += this.int8Codec.getByteLength();

        this.longStringCodec.encode(buffer, offset, description);
    }

    decode(buffer, offset) {
        const sender = this.int8Codec.decode(buffer, offset);

        offset += this.int8Codec.getByteLength();

        const target = this.int8Codec.decode(buffer, offset);

        offset += this.int8Codec.getByteLength();

        const description = this.longStringCodec.decode(buffer, offset);

        return { sender, target, description };
    }
}
