import { setVolume } from '@client/store/player';

export default class StorageListener {
    static VOLUME = 'VOLUME';

    constructor(store, storage, debug) {
        this.store = store;
        this.storage = storage;
        this.debug = debug;

        this.props = null;
    }

    static getProps(state) {
        return {
            volume: state.player.volume,
        };
    }

    load() {
        const volume = this.storage.get(this.constructor.VOLUME);

        if (typeof volume === 'number' && volume !== this.props.volume) {
            this.props.volume = volume;
            this.store.dispatch(setVolume(volume));
            this.log('Loaded volume', volume);
        }
    }

    update(prevProps) {
        const { VOLUME } = this.constructor;
        const { volume } = this.props;

        if (volume !== prevProps.volume && volume !== this.storage.get(VOLUME)) {
            this.storage.set(VOLUME, volume);
            this.log('Persisted volume', volume);
        }
    }

    log(...args) {
        if (this.debug) {
            console.info(...args);
        }
    }
}
