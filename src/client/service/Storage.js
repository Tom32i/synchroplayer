export default class Storage {
    /**
     * @param {LocalStorage|SessionStorage} storage Storage technology
     */
    constructor(storage = localStorage || sessionStorage) {
        this.storage = storage;
    }

    /**
     * Set key
     *
     * @param {String} key
     * @param {Object} value
     */
    set(key, value) {
        this.storage.setItem(key, JSON.stringify(value));

        return value;
    }

    /**
     * Get key
     *
     * @param {String} key
     *
     * @return {Object}
     */
    get(key) {
        const data = this.storage.getItem(key);

        try {
            return JSON.parse(data);
        } catch(error) {
            return null;
        }
    }
}
