export default class User {
    constructor(id) {
        this.id = id;
        this.ready = false;
    }

    setReady() {
        this.ready = true;
    }
}
