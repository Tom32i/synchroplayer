import Codec from 'netcode/src/encoder/codec/Codec';
import Int8Codec from 'netcode/src/encoder/codec/Int8Codec';

export default [
    // DOWN
    ['user:me', new Int8Codec()],
    ['user:add', new Int8Codec()],
    ['user:remove', new Int8Codec()],
    ['user:ready', new Int8Codec()],
    // UP
    ['me:ready', new Codec()],
];
