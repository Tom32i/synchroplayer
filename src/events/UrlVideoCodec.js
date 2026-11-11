import { Codec, StringLongCodec } from 'netcode/encoder';

export default class UrlVideoCodec extends Codec {
    constructor() {
        super();

        this.stringLongCodec = new StringLongCodec();
    }

    getByteLength(data) {
        return this.stringLongCodec.getByteLength(data.name)
            + this.stringLongCodec.getByteLength(data.url);
    }

    encode(cursor, data) {
        const { url, name } = data;

        this.stringLongCodec.encode(cursor, name);
        this.stringLongCodec.encode(cursor, url);
    }

    decode(cursor) {
        const name = this.stringLongCodec.decode(cursor);
        const url = this.stringLongCodec.decode(cursor);

        return { url, name };
    }
}
