import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from '@client/container';
import { socketOpen, socketClose, me, userAdd, userRemove, userReady, userStreaming } from '@client/store/room';
import { play, pause, seek, stop, loadVideoFromServer, setTimeline, unloadStream } from '@client/store/player';

class Socket extends Component {
    static propTypes = {
        room: PropTypes.string.isRequired,
        ready: PropTypes.bool.isRequired,
        video: PropTypes.shape({
            url: PropTypes.string.isRequired,
            source: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            fromServer: PropTypes.bool.isRequired,
        }),
        // Dispatchers
        onOpen: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        onMe: PropTypes.func.isRequired,
        onUserAdd: PropTypes.func.isRequired,
        onUserRemove: PropTypes.func.isRequired,
        onUserReady: PropTypes.func.isRequired,
        onUserStreaming: PropTypes.func.isRequired,
        onControlPlay: PropTypes.func.isRequired,
        onControlPause: PropTypes.func.isRequired,
        onControlSeek: PropTypes.func.isRequired,
        onControlStop: PropTypes.func.isRequired,
        onVideo: PropTypes.func.isRequired,
        setTimeline: PropTypes.func.isRequired,
        unloadStream: PropTypes.func.isRequired,
    };

    static defaultProps = {
        video: null,
    };

    constructor(props) {
        super(props);

        this.api = get('api');
        this.peer = get('peer');

        this.onError = this.onError.bind(this);
        this.onVideoFile = this.onVideoFile.bind(this);
        this.onVideoUrl = this.onVideoUrl.bind(this);
        this.onVideoYoutube = this.onVideoYoutube.bind(this);
        this.onPeerOffer = this.onPeerOffer.bind(this);
        this.onPeerAnswer = this.onPeerAnswer.bind(this);
        this.onPeerCandidate = this.onPeerCandidate.bind(this);
        this.onPeerTimeline = this.onPeerTimeline.bind(this);
        this.onPeerStop = this.onPeerStop.bind(this);
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
        this.api.addEventListener('user:streaming', this.props.onUserStreaming);
        this.api.addEventListener('control:play', this.props.onControlPlay);
        this.api.addEventListener('control:pause', this.props.onControlPause);
        this.api.addEventListener('control:stop', this.props.onControlStop);
        this.api.addEventListener('control:seek', this.props.onControlSeek);
        this.api.addEventListener('video:file', this.onVideoFile);
        this.api.addEventListener('video:url', this.onVideoUrl);
        this.api.addEventListener('video:youtube', this.onVideoYoutube);
        this.api.addEventListener('peer:offer', this.onPeerOffer);
        this.api.addEventListener('peer:answer', this.onPeerAnswer);
        this.api.addEventListener('peer:candidate', this.onPeerCandidate);
        this.api.addEventListener('peer:timeline', this.onPeerTimeline);
        this.api.addEventListener('peer:stop', this.onPeerStop);
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
        this.api.removeEventListener('user:streaming', this.props.onUserStreaming);
        this.api.removeEventListener('control:play', this.props.onControlPlay);
        this.api.removeEventListener('control:pause', this.props.onControlPause);
        this.api.removeEventListener('control:stop', this.props.onControlStop);
        this.api.removeEventListener('control:seek', this.props.onControlSeek);
        this.api.removeEventListener('video:file', this.onVideoFile);
        this.api.removeEventListener('video:url', this.onVideoUrl);
        this.api.removeEventListener('video:youtube', this.onVideoYoutube);
        this.api.removeEventListener('peer:offer', this.onPeerOffer);
        this.api.removeEventListener('peer:answer', this.onPeerAnswer);
        this.api.removeEventListener('peer:candidate', this.onPeerCandidate);
        this.api.removeEventListener('peer:timeline', this.onPeerTimeline);
        this.api.removeEventListener('peer:stop', this.onPeerStop);

        // Close connection
        this.api.leave();
        this.props.onClose();
    }

    componentDidUpdate(prevProps) {
        const { ready, video } = this.props;

        if (ready !== prevProps.ready) {
            this.api.setReady(ready);
        }

        if (video && (!prevProps.video || video.url !== prevProps.video.url) && !video.fromServer) {
            const { source, name, url } = video;

            this.api.loadVideo(source, name, url);
        }
    }

    onVideoUrl(event) {
        const { name, url } = event.detail;
        this.props.onVideo('url', name, url);
    }

    onVideoYoutube(event) {
        const { name, url } = event.detail;
        this.props.onVideo('youtube', name, url);
    }

    onVideoFile(event) {
        const { name } = event.detail;
        this.props.onVideo('file', name);
    }

    onPeerOffer(event) {
        const { description, sender } = event.detail;
        this.peer.spectate(JSON.parse(description), sender);
        this.props.onVideo('peer');
    }

    onPeerAnswer(event) {
        const { sender, description } = event.detail;
        this.peer.answer(sender, JSON.parse(description));
    }

    onPeerCandidate(event) {
        const { sender, description } = event.detail;
        this.peer.addCandidate(sender, JSON.parse(description));
    }

    onPeerTimeline(event) {
        const { currentTime, duration } = event.detail;
        this.props.setTimeline(currentTime, duration);
    }

    onPeerStop() {
        this.props.unloadStream();
        this.peer.clear();
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
    state => {
        const { loaded, authorized, url, source, name, fromServer } = state.player;
        const { connected } = state.room;

        return {
            ready: connected && loaded && authorized,
            video: connected && url && source && name ? { url, source, name, fromServer } : null,
        };
    },
    dispatch => ({
        onOpen: () => dispatch(socketOpen()),
        onClose: () => dispatch(socketClose()),
        onMe: event => dispatch(me(event.detail)),
        onUserAdd: event => dispatch(userAdd(event.detail)),
        onUserRemove: event => dispatch(userRemove(event.detail)),
        onUserReady: event => dispatch(userReady(event.detail)),
        onUserStreaming: event => dispatch(userStreaming(event.detail)),
        onControlPlay: event => dispatch(play(event.detail)),
        onControlPause: event => dispatch(pause(event.detail)),
        onControlSeek: event => dispatch(seek(event.detail)),
        onControlStop: event => dispatch(stop(event.detail)),
        onVideo: (source, name, url = null) => dispatch(loadVideoFromServer(source, name, url)),
        unloadStream: () => dispatch(unloadStream()),
        setTimeline: (currentTime, duration) => dispatch(setTimeline(currentTime, duration)),
    })
)(Socket);
