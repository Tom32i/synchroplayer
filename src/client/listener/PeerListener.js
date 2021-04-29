export default class PeerListener {
    constructor(peer, debug) {
        this.peer = peer;
        this.debug = debug;

        this.props = null;
    }

    static getProps(state) {
        const { me, users } = state.room;

        return {
            others: users.map(user => user.id).filter(id => id !== me),
        };
    }

    load() {
        this.peer.setOthers(this.props.others);
    }

    update(prevProps) {
        const { others } = this.props;

        if (others.length !== prevProps.others.length) {
            this.peer.setOthers(others);
        }
    }

    log(...args) {
        if (this.debug) {
            console.info(...args);
        }
    }
}
