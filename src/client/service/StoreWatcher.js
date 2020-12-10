export default class StoreWatcher {
    /**
     * @param {Object} store Redux store
     * @param {Array} listeners
     */
    constructor(store, listeners = []) {
        this.store = store;
        this.listeners = listeners;
        this.unsubscribe = null;

        this.onStoreChange = this.onStoreChange.bind(this);

    }

    start() {
        if (!this.unsubscribe) {
            this.unsubscribe = this.store.subscribe(this.onStoreChange);
            const state = this.store.getState();
            this.listeners.forEach(listener => this.init(listener, state));
        }
    }

    stop() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    subscribeAll(listeners) {
        const state = this.store.getState();
        this.listeners.push(...listeners);
        listeners.forEach(listener => listener.props = listener.constructor.getProps(state));

        return this;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        this.init(listener, this.store.getState());

        return this;
    }

    onStoreChange() {
        const state = this.store.getState();

        this.listeners.forEach(listener => this.update(listener, state));
    }

    init(listener, state) {
        listener.props = listener.constructor.getProps(state);
    }

    update(listener, state) {
        const { props } = listener;
        listener.props = listener.constructor.getProps(state);
        listener.update(props);
    }
}
