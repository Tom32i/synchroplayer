import { Codec, StringLongCodec, UInt16Codec } from 'netcode/encoder';

export default class FileVideoCodec extends Codec {
    constructor() {
        super();

        this.uint16Codec = new UInt16Codec();
        this.stringLongCodec = new StringLongCodec();
    }

    getByteLength(data) {
        return this.uint16Codec.getByteLength()
            + this.stringLongCodec.getByteLength(data.name);
    }

    encode(buffer, offset, data) {
        const { name, duration } = data;

        this.uint16Codec.encode(buffer, offset, duration);

        offset += this.uint16Codec.getByteLength();

        this.stringLongCodec.encode(buffer, offset, name);
    }

    decode(buffer, offset) {
        const duration = this.uint16Codec.decode(buffer, offset);

        offset += this.uint16Codec.getByteLength();

        const name = this.stringLongCodec.decode(buffer, offset);

        return { name, duration };
    }
}
