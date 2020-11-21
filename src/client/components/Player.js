import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import I18n from 'i18n-js';
import { get } from '@client/container';
import { setReady, setDuration } from '@client/store/player';
import Video from '@client/components/Video';
import Subtitle from '@client/components/Subtitle';
import Controls from '@client/components/Controls';
import Modal from '@client/components/Modal';

class Player extends Component {
    static propTypes = {
        url: PropTypes.string.isRequired,
        playing: PropTypes.bool.isRequired,
        subtitle: PropTypes.string,
        // Dispatchers
        setReady: PropTypes.func.isRequired,
        setDuration: PropTypes.func.isRequired,
    };

    static defaultProps = {
        subtitle: null,
    };

    constructor(props) {
        super(props);

        this.api = get('api');
        this.video = null;
        this.state = {
            authorized: true,
        };

        this.onCanPlay = this.onCanPlay.bind(this);
        this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
        this.onAuthorized = this.onAuthorized.bind(this);
        this.onNotAuthorized = this.onNotAuthorized.bind(this);
        this.setVideo = this.setVideo.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { playing } = this.props;

        if (playing !== prevProps.playing) {
            playing ? this.video.play() : this.video.pause();
        }
    }

    setVideo(video) {
        this.video = video;
    }

    onCanPlay() {
        this.props.setReady(true);
    }

    onLoadedMetadata() {
        this.props.setDuration(this.video.duration);
    }

    /**
     * Play authorized
     */
    onAuthorized() {
        this.setState({ authorized: true });
        this.props.setReady(true);
    }

    /**
     * Auto play not authorized
     */
    onNotAuthorized(error) {
        console.log('onNotAuthorized', error);
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
            this.setState({ authorized: false });
            this.props.setReady(false);
        }
    }

    renderAuthorisationModal(authorized) {
        if (authorized) {
            return null;
        }

        return (
            <Modal>
                <h4 className="title">{I18n.t('player.authorization.title')}</h4>
                <p className="message">{I18n.t('player.authorization.content')}</p>
                <button className="action" onClick={this.api.play}>
                    {I18n.t('player.authorization.ok')}
                </button>
            </Modal>
        );
    }

    render(){
        const { url, subtitle } = this.props;
        const { authorized } = this.state;

        return (
            <figure className="player">
                {this.renderAuthorisationModal(authorized)}
                <Video
                    ref={this.setVideo}
                    src={url}
                    onCanPlay={this.onCanPlay}
                    onLoadedMetadata={this.onLoadedMetadata}
                    onAuthorized={this.onAuthorized}
                    onNotAuthorized={this.onNotAuthorized}
                >
                    {subtitle ? <Subtitle src={subtitle} /> : null}
                </Video>
                <Controls />
            </figure>
        );
    }
}

export default connect(
    state => ({
        url: state.player.url,
        playing: state.player.playing,
        subtitle: state.player.subtitle,
    }),
    dispatch => ({
        setReady: ready => dispatch(setReady(ready)),
        setDuration: duration => dispatch(setDuration(duration)),
    })
)(Player);
