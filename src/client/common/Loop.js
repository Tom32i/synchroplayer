export default class Loop {
    constructor(callback) {
        this.callback = callback;
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

        this.frame = window.requestAnimationFrame(this.update);
    }

    stop() {
        if (!this.active) {
            return;
        }

        window.cancelAnimationFrame(this.frame);

        this.frame = null;
    }

    update() {
        this.frame = window.requestAnimationFrame(this.update);
        this.callback();
    }
}
