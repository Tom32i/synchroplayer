import Codec from 'netcode/src/encoder/codec/Codec';
import Int8Codec from 'netcode/src/encoder/codec/Int8Codec';
//import StringCodec from 'netcode/src/encoder/codec/StringCodec';

export default [
    ['client:me', new Int8Codec()],
    ['client:add', new Int8Codec()],
    //['room:request', new Codec()],
    //['say', new StringCodec()],
];
