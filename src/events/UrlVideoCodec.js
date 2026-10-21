import { Codec, StringCodec, StringLongCodec } from 'netcode/encoder';

export default class UrlVideoCodec extends Codec {
    constructor() {
        super();

        this.stringCodec = new StringCodec();
        this.stringLongCodec = new StringLongCodec();
    }

    getByteLength(data) {
        return this.stringCodec.getByteLength(data.name)
            + this.stringLongCodec.getByteLength(data.url);
    }

    encode(buffer, offset, data) {
        const { url, name } = data;

        this.stringCodec.encode(buffer, offset, name);

        offset += this.stringCodec.getByteLength(name);

        this.stringLongCodec.encode(buffer, offset, url);
    }

    decode(buffer, offset) {
        const name = this.stringCodec.decode(buffer, offset);

        offset += this.stringCodec.getByteLength(name);

        const url = this.stringLongCodec.decode(buffer, offset);

        return { url, name };
    }
}
