export default class TimedEvent {
    /**
     * @param  {Function} Callback to execute
     * @param  {Number} Delay in ms
     */
    constructor(callback, delay) {
        this.callback = callback;
        this.delay = delay;
        this.timeout = null;

        this.resolve = this.resolve.bind(this);
    }

    schedule(delay = this.delay) {
        this.clear();

        if (this.timeout === null) {
            this.timeout = setTimeout(this.resolve, delay);
        }
    }

    clear() {
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    resolve() {
        this.clear();
        this.callback();
    }
}
