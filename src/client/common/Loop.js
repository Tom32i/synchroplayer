export default class Loop {
    constructor(callback, interval = null) {
        this.callback = callback;
        this.interval = interval;
        this.frame = null;
        this.update = this.update.bind(this);
    }

    get active() { return this.frame !== null; }

    setCallback(callback) {
        this.callback = callback;
    }

    start() {
        if (this.active) {
            return;
        }

        this.requestFrame();
    }

    stop() {
        if (!this.active) {
            return;
        }

        this.cancelFrame();
    }

    cancelFrame() {
        if (this.interval !== null) {
            window.cancelAnimationFrame(this.frame);
        } else {
            clearTimeout(this.frame);
        }

        this.frame = null;
    }

    requestFrame() {
        if (this.interval !== null) {
            this.frame = window.requestAnimationFrame(this.update);
        } else {
            this.frame = setTimeout(this.update, this.interval);
        }
    }

    update() {
        this.requestFrame();
        this.callback();
    }
}
