import { Codec, StringCodec, LongStringCodec } from 'netcode/src/encoder/codec';

export default class UrlVideoCodec extends Codec {
    constructor() {
        super();

        this.stringCodec = new StringCodec();
        this.longStringCodec = new LongStringCodec();
    }

    getByteLength(data) {
        return this.stringCodec.getByteLength(data.name)
            + this.longStringCodec.getByteLength(data.url);
    }

    encode(buffer, offset, data) {
        const { url, name } = data;

        this.stringCodec.encode(buffer, offset, name);

        offset += this.stringCodec.getByteLength(name);

        this.longStringCodec.encode(buffer, offset, url);
    }

    decode(buffer, offset) {
        const name = this.stringCodec.decode(buffer, offset);

        offset += this.stringCodec.getByteLength(name);

        const url = this.longStringCodec.decode(buffer, offset);

        return { url, name };
    }
}
