import EventEmitter from 'tom32i-event-emitter.js';

export default class Video extends EventEmitter {
    constructor(source, url, name) {
        super();

        this.source = source;
        this.url = url;
        this.name = name;
        this.playedAt = null;
        this.at = null;
        this.currentTime = 0;
    }

    get playing() {
        return this.playedAt !== null;
    }

    get time() {
        if (this.playing) {
            return this.currentTime + (Date.now() - this.playedAt) / 1000;
        }

        return this.currentTime;
    }

    play(time = this.time) {
        if (!this.playing) {
            this.playedAt = Date.now();
            this.currentTime = time;
            this.emit('play', time);
            console.warn('Video playing:', time);
        }
    }

    pause(time = this.time) {
        if (this.playing) {
            this.playedAt = null;
            this.currentTime = time;
            this.emit('pause', time);
            console.warn('Video paused:', time);
        }
    }

    end() {
        if (this.playing || this.currentTime > 0) {
            this.playedAt = null;
            this.currentTime = this.time;
            this.emit('end');
            console.warn('Video ended.');
        }
    }

    stop() {
        if (this.playing || this.currentTime > 0) {
            this.playedAt = null;
            this.currentTime = 0;
            this.emit('stop');
            console.warn('Video stopped.');
        }
    }

    seek(time) {
        if (time !== this.currentTime) {
            if (this.playing) {
                this.playedAt = Date.now();
            }

            this.currentTime = time;
            this.emit('seek', time);
            console.warn('Video seeked:', time);
        }
    }
}
