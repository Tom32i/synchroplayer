import EventEmitter from 'tom32i-event-emitter.js';

export default class User extends EventEmitter {
    constructor(id, ready = false) {
        super();

        this.id = id;
        this.ready = ready;
    }

    setReady(ready) {
        this.ready = ready;

        this.emit('ready', this);
    }
}
