import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from '@client/container';
import { socketOpen, socketClose, me, userAdd, userRemove, userReady } from '@client/store/room';
import { play, pause } from '@client/store/player';

class Socket extends Component {
    static propTypes = {
        room: PropTypes.string.isRequired,
        ready: PropTypes.bool.isRequired,
        // Dispatchers
        onOpen: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        onMe: PropTypes.func.isRequired,
        onUserAdd: PropTypes.func.isRequired,
        onUserRemove: PropTypes.func.isRequired,
        onUserReady: PropTypes.func.isRequired,
        onControlPlay: PropTypes.func.isRequired,
        onControlPause: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.api = get('api');

        this.onError = this.onError.bind(this);
    }

    componentDidMount() {
        this.api.join(this.props.room);

        // Meta-events
        this.api.addEventListener('open', this.props.onOpen);
        this.api.addEventListener('close', this.props.onClose);
        this.api.addEventListener('error', this.onError);

        // Events
        this.api.addEventListener('user:me', this.props.onMe);
        this.api.addEventListener('user:add', this.props.onUserAdd);
        this.api.addEventListener('user:remove', this.props.onUserRemove);
        this.api.addEventListener('user:ready', this.props.onUserReady);
        this.api.addEventListener('control:play', this.props.onControlPlay);
        this.api.addEventListener('control:pause', this.props.onControlPause);
    }

    componentWillUnmount() {
        // Meta-events
        this.api.removeEventListener('open', this.props.onOpen);
        this.api.removeEventListener('close', this.props.onClose);
        this.api.removeEventListener('error', this.onError);

        // Events
        this.api.removeEventListener('user:me', this.props.onMe);
        this.api.removeEventListener('user:add', this.props.onUserAdd);
        this.api.removeEventListener('user:remove', this.props.onUserRemove);
        this.api.removeEventListener('user:ready', this.props.onUserReady);
        this.api.removeEventListener('control:play', this.props.onControlPlay);
        this.api.removeEventListener('control:pause', this.props.onControlPause);

        // Close connection
        this.api.leave();
        this.props.onClose();
    }

    componentDidUpdate(prevProps) {
        const { ready } = this.props;

        if (ready && ready !== prevProps.ready) {
            this.api.ready();
        }

        /* if (video && video !== prevProps.video) {
            switch (video.source) {
                case 'local':
                    return this.client.send('content:local', video);
            }
        }*/
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
        // video: state.player.video,
    }),
    dispatch => ({
        onOpen: () => dispatch(socketOpen()),
        onClose: () => dispatch(socketClose()),
        onMe: event => dispatch(me(event.detail)),
        onUserAdd: event => dispatch(userAdd(event.detail)),
        onUserRemove: event => dispatch(userRemove(event.detail)),
        onUserReady: event => dispatch(userReady(event.detail)),
        onControlPlay: event => dispatch(play(event.detail)),
        onControlPause: event => dispatch(pause(event.detail)),
    })
)(Socket);
