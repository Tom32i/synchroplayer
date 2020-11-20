import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setReady, setDuration } from '@client/store/player';
import Video from '@client/components/Video';
import Subtitle from '@client/components/Subtitle';
import Controls from '@client/components/Controls';

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

        this.video = null;

        this.onCanPlay = this.onCanPlay.bind(this);
        this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
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
        this.props.setReady();
    }

    onLoadedMetadata() {;
        this.props.setDuration(this.video.duration);
    }

    render(){
        const { url, subtitle } = this.props;

        return (
            <figure className="player">
                <Video
                    ref={this.setVideo}
                    src={url}
                    onCanPlay={this.onCanPlay}
                    onLoadedMetadata={this.onLoadedMetadata}
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
        setReady: () => dispatch(setReady()),
        setDuration: duration => dispatch(setDuration(duration)),
    })
)(Player);
