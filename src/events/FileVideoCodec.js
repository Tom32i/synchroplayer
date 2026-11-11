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

    encode(cursor, data) {
        const { name, duration } = data;

        this.uint16Codec.encode(cursor, duration);
        this.stringLongCodec.encode(cursor, name);
    }

    decode(cursor) {
        const duration = this.uint16Codec.decode(cursor);
        const name = this.stringLongCodec.decode(cursor);

        return { name, duration };
    }
}
