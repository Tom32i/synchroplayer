import { Codec, StringCodec, Int16Codec } from 'netcode/src/encoder/codec';

export default class UrlVideoCodec extends Codec {
    constructor() {
        super();

        this.int16Codec = new Int16Codec();
        this.stringCodec = new StringCodec();
    }

    getByteLength(data) {
        return this.int16Codec.getByteLength()
            + this.stringCodec.getByteLength(data.url)
            + this.stringCodec.getByteLength(data.name);
    }

    encode(buffer, offset, data) {
        const { url, name, duration } = data;

        this.int16Codec.encode(buffer, offset, duration);

        offset += this.int16Codec.getByteLength();

        this.stringCodec.encode(buffer, offset, url);

        offset += this.stringCodec.getByteLength(url);

        this.stringCodec.encode(buffer, offset, name);
    }

    decode(buffer, offset) {
        const duration = this.int16Codec.decode(buffer, offset);

        offset += this.int16Codec.getByteLength();

        const url = this.stringCodec.decode(buffer, offset);

        offset += this.stringCodec.getByteLength(url);

        const name = this.stringCodec.decode(buffer, offset);

        return { url, name, duration };
    }
}
