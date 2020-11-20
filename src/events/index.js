import Codec from 'netcode/src/encoder/codec/Codec';
import Int8Codec from 'netcode/src/encoder/codec/Int8Codec';
// import ContentLocalCodec from '@events/ContentLocalCodec';

export default [
    // DOWN
    ['user:me', new Int8Codec()],
    ['user:add', new Int8Codec()],
    ['user:remove', new Int8Codec()],
    ['user:ready', new Int8Codec()],
    ['control:play', new Codec()],
    ['control:pause', new Codec()],
    ['control:stop', new Codec()],
    // ['user:seek', new SeekCodec()],
    // ['content:local', new ContentLocalCodec()],
    // UP
    ['me:ready', new Codec()],
    ['me:control:play', new Codec()],
    ['me:control:pause', new Codec()],
    ['me:control:stop', new Codec()],
    // ['me:seek', new SeekCodec()],
];
