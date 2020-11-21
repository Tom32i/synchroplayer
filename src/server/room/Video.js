import EventEmitter from 'tom32i-event-emitter.js';

export default class Video extends EventEmitter {
    constructor(source, url, name, duration) {
        super();

        this.source = source;
        this.url = url;
        this.name = name;
        this.duration = duration;
        this.playing = false;
        this.time = 0;
    }

    play() {
        this.setPlaying(true);
    }

    pause() {
        this.setPlaying(false);
    }

    setPlaying(playing) {
        if (playing !== this.playing) {
            this.playing = playing;
            this.emit('playing', playing);
        }
    }

    setTime(time) {
        this.time = time;

        this.emit('time', time);
    }
}
