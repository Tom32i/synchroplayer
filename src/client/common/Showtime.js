import Loop from '@client/common/Loop';

export default class Showtime {
    constructor(setShowtime) {
        this.setShowtime = setShowtime;
        this.loop = new Loop(this.update.bind(this));
        this.active = false;
        this.playing = false;
        this.using = false;
        this.watching = false;
        this.lastActivity  = 0;
        this.duration = 2000;

        this.onPlayed = this.onPlayed.bind(this);
        this.onPaused = this.onPaused.bind(this);
        this.onUIEnter = this.onUIEnter.bind(this);
        this.onUILeave = this.onUILeave.bind(this);
        this.onActivity = this.onActivity.bind(this);
    }

    onPlayed() {
        this.playing = true;
        this.onActivity();
        this.startWatching();
        this.loop.start();
    }

    onPaused() {
        this.playing = false;
        this.stopWatching();
        this.loop.stop();
        this.onActivity();
    }

    onUIEnter() {
        this.using = true;
    }

    onUILeave() {
        this.using = false;
    }

    onActivity() {
        this.lastActivity = Date.now();

        if (!this.loop.active) {
            this.update();
        }
    }

    startWatching() {
        if (!this.watching) {
            this.watching = true;
            document.addEventListener('mousemove', this.onActivity);
            document.addEventListener('keypress', this.onActivity);
        }
    }

    stopWatching() {
        if (this.watching) {
            this.watching = false;
            document.removeEventListener('mousemove', this.onActivity);
            document.removeEventListener('keypress', this.onActivity);
        }
    }

    update(now = Date.now()) {
        const active = this.playing && !this.using && (now - this.lastActivity) > this.duration;

        this.setActive(active);
    }

    setActive(active) {
        if (this.active !== active) {
            this.active = active;
            this.setShowtime(this.active);

            if (this.active) {
                this.loop.stop();
            } else {
                if (this.playing) {
                    this.loop.start();
                } else {
                    this.stopWatching();
                }
            }
        }
    }
}
