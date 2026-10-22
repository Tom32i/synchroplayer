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

    encode(buffer, offset, data) {
        const { url, name } = data;

        this.stringLongCodec.encode(buffer, offset, name);

        offset += this.stringLongCodec.getByteLength(name);

        this.stringLongCodec.encode(buffer, offset, url);
    }

    decode(buffer, offset) {
        const name = this.stringLongCodec.decode(buffer, offset);

        offset += this.stringLongCodec.getByteLength(name);

        const url = this.stringLongCodec.decode(buffer, offset);

        return { url, name };
    }
}
