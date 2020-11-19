import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Client from 'netcode/src/client/Client';
import BinaryEncoder from 'netcode/src/encoder/BinaryEncoder';
import events from '@events';
import { socketOpen, socketClose, me, userAdd, userReady } from '@client/store/room';

class Socket extends Component {
    static propTypes = {
        host: PropTypes.string.isRequired,
        ready: PropTypes.bool.isRequired,
        // Dispatchers
        onOpen: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        onMe: PropTypes.func.isRequired,
        onUser: PropTypes.func.isRequired,
        onUserReady: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.client = null;

        this.onError = this.onError.bind(this);
    }

    componentDidMount() {
        this.client = new Client(this.props.host, new BinaryEncoder(events));

        // Meta-events
        this.client.addEventListener('open', this.props.onOpen);
        this.client.addEventListener('close', this.props.onClose);
        this.client.addEventListener('error', this.onError);

        // Events
        this.client.addEventListener('user:me', this.props.onMe);
        this.client.addEventListener('user:add', this.props.onUser);
        this.client.addEventListener('user:ready', this.props.onUserReady);
    }

    componentWillUnmount() {
        // Meta-events
        this.client.removeEventListener('open', this.props.onOpen);
        this.client.removeEventListener('close', this.props.onClose);
        this.client.removeEventListener('error', this.onError);

        // Events
        this.client.removeEventListener('user:me', this.props.onMe);
        this.client.removeEventListener('user:add', this.props.onUser);
        this.client.removeEventListener('user:ready', this.props.onUserReady);

        // Close connection
        this.client.close();
        this.props.onClose();
    }

    componentDidUpdate(prevProps) {
        const { ready } = this.props;

        if (ready && ready !== prevProps.ready) {
            this.client.send('me:ready');
        }
    }

    onOpen() {
        this.store.dispatch(socketOpen());
    }

    onClose() {
        this.store.dispatch(socketClose());
    }

    /**
     * On error
     *
     * @param {Error} error
     */
    onError(error) {
        console.error(error);
    }

    render() {
        return null;
    }
}

export default connect(
    state => ({
        ready: state.player.ready,
    }),
    dispatch => ({
        onOpen: () => dispatch(socketOpen()),
        onClose: () => dispatch(socketClose()),
        onMe: event => dispatch(me(event.detail)),
        onUser: event => dispatch(userAdd(event.detail)),
        onUserReady: event => dispatch(userReady(event.detail)),
    })
)(Socket);
