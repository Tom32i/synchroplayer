import { Codec, StringCodec } from 'netcode/src/encoder/codec';

export default class UrlVideoCodec extends Codec {
    constructor() {
        super();

        this.stringCodec = new StringCodec();
    }

    getByteLength(data) {
        return this.stringCodec.getByteLength(data.url)
            + this.stringCodec.getByteLength(data.name);
    }

    encode(buffer, offset, data) {
        const { url, name } = data;

        this.stringCodec.encode(buffer, offset, url);

        offset += this.stringCodec.getByteLength(url);

        this.stringCodec.encode(buffer, offset, name);
    }

    decode(buffer, offset) {
        const url = this.stringCodec.decode(buffer, offset);

        offset += this.stringCodec.getByteLength(url);

        const name = this.stringCodec.decode(buffer, offset);

        return { url, name };
    }
}
