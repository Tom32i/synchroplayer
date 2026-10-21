import { Codec, UInt8Codec, StringLongCodec } from 'netcode/encoder';

export default class PeerCodec extends Codec {
    constructor() {
        super();

        this.uint8Codec = new UInt8Codec();
        this.stringLongCodec = new StringLongCodec();
    }

    getByteLength(data) {
        return this.uint8Codec.getByteLength() * 2 + this.stringLongCodec.getByteLength(data.description);
    }

    encode(buffer, offset, data) {
        const { sender, target, description } = data;

        this.uint8Codec.encode(buffer, offset, sender || 0);

        offset += this.uint8Codec.getByteLength();

        this.uint8Codec.encode(buffer, offset, target || 0);

        offset += this.uint8Codec.getByteLength();

        this.stringLongCodec.encode(buffer, offset, description);
    }

    decode(buffer, offset) {
        const sender = this.uint8Codec.decode(buffer, offset);

        offset += this.uint8Codec.getByteLength();

        const target = this.uint8Codec.decode(buffer, offset);

        offset += this.uint8Codec.getByteLength();

        const description = this.stringLongCodec.decode(buffer, offset);

        return { sender, target, description };
    }
}
