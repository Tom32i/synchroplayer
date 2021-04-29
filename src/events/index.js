import Codec from 'netcode/src/encoder/codec/Codec';
import Int8Codec from 'netcode/src/encoder/codec/Int8Codec';
import FileVideoCodec from '@events/FileVideoCodec';
import UrlVideoCodec from '@events/UrlVideoCodec';
import UserReadyCodec from '@events/UserReadyCodec';
import SeekCodec from '@events/SeekCodec';
import PeerCodec from '@events/PeerCodec';
import PeerTimelineCodec from '@events/PeerTimelineCodec';

export default [
    ['user:me', new Int8Codec()],
    ['user:add', new Int8Codec()],
    ['user:remove', new Int8Codec()],
    ['user:ready', new UserReadyCodec()],
    ['user:streaming', new Int8Codec()],
    ['control:play', new SeekCodec()],
    ['control:pause', new SeekCodec()],
    ['control:seek', new SeekCodec()],
    ['control:end', new Codec()],
    ['control:stop', new Codec()],
    ['video:file', new FileVideoCodec()],
    ['video:url', new UrlVideoCodec()],
    ['video:youtube', new UrlVideoCodec()],
    ['peer:offer', new PeerCodec()],
    ['peer:answer', new PeerCodec()],
    ['peer:candidate', new PeerCodec()],
    ['peer:timeline', new PeerTimelineCodec()],
];
