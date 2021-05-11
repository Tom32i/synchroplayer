import EventEmitter from 'tom32i-event-emitter.js';

export default class Video extends EventEmitter {
    constructor(source, url, name) {
        super();

        this.source = source;
        this.url = url;
        this.name = name;
        this.playedAt = null;
        this.playedTime = 0;
        this.timelineCurrentTime = 0;
        this.timelineDuration = 0;
    }

    get playing() {
        return this.playedAt !== null;
    }

    get currentTime() {
        if (this.playing) {
            return this.playedTime + (Date.now() - this.playedAt) / 1000;
        }

        return this.playedTime;
    }

    play(time = this.currentTime, now = Date.now()) {
        if (!this.playing) {
            this.playedAt = now;
            this.playedTime = time;
            this.emit('play', time);
            console.warn('Video playing:', time);
        }
    }

    pause(time = this.currentTime) {
        if (this.playing) {
            this.playedAt = null;
            this.playedTime = time;
            this.emit('pause', time);
            console.warn('Video paused:', time);
        }
    }

    end() {
        if (this.playing || this.playedTime > 0) {
            this.playedAt = null;
            this.playedTime = 0;
            this.emit('end');
            console.warn('Video ended.');
        }
    }

    stop() {
        if (this.playing || this.playedTime > 0) {
            this.playedAt = null;
            this.playedTime = 0;
            this.emit('stop');
            console.warn('Video stopped.');
        }
    }

    seek(time, now = Date.now()) {
        if (this.playing) {
            this.playedAt = now;
        }

        this.playedTime = time;
        this.emit('seek', time);
        console.warn('Video seeked:', time);
    }

    setTimeline(currentTime, duration) {
        this.timelineCurrentTime = currentTime;
        this.timelineDuration = duration;
    }

    getTimeLine() {
        return {
            currentTime: this.timelineCurrentTime,
            duration: this.timelineDuration,
        };
    }
}
