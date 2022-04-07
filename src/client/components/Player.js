import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from '@client/container';
import { setShowtime, setTimeline } from '@client/store/player';
import { Video, YoutubeVideo } from '@client/components/video';
import Controls from '@client/components/Controls';
import Timeline from '@client/components/Timeline';
import AuthorizationModal from '@client/components/AuthorizationModal';
import Showtime from '@client/common/Showtime';

class Player extends Component {
    static propTypes = {
        source: PropTypes.string.isRequired,
        setShowtime: PropTypes.func.isRequired,
        setTimeline: PropTypes.func.isRequired,
        duration: PropTypes.number,
        currentTime: PropTypes.number,
    };

    static defaultProps = {
        duration: 0,
        currentTime: 0,
    };

    constructor(props) {
        super(props);

        this.api = get('api');
        this.peer = get('peer');
        this.showtime = new Showtime(props.setShowtime);
        this.video = null;
        this.timeline = null;

        this.setVideo = this.setVideo.bind(this);
        this.setTimeline = this.setTimeline.bind(this);
        this.onTimeUpdate = this.onTimeUpdate.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onEnded = this.onEnded.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onStop = this.onStop.bind(this);
        this.onBackward = this.onBackward.bind(this);
        this.onForward = this.onForward.bind(this);
        this.onSeek = this.onSeek.bind(this);
        this.onStream = this.onStream.bind(this);
        this.toggleStream = this.toggleStream.bind(this);
    }

    get duration() {
        if (this.props.source === 'peer') {
            return this.props.duration;
        }

        return this.video.duration;
    }

    get currentTime() {
        if (this.props.source === 'peer') {
            return this.props.currentTime;
        }

        return this.video.currentTime;
    }

    componentDidMount() {
        this.peer.addEventListener('stream', this.onStream);
    }

    componentWillUnmount() {
        this.peer.removeEventListener('stream', this.onStream);
    }

    componentDidUpdate(prevProps) {
        const { source } = this.props;

        if (source !== prevProps.source && prevProps.source === 'peer') {
            this.peer.clear();
        }
    }

    setVideo(video) {
        this.video = video;
    }

    setTimeline(timeline) {
        this.timeline = timeline;
    }

    onTimeUpdate() {
        if (this.timeline) {
            if (this.props.source !== 'peer') {
                this.props.setTimeline(this.video.currentTime, this.video.duration);
            }

            if (this.peer.isStreaming()) {
                this.api.setTimeline(this.video.currentTime, this.video.duration);
            }
        }
    }

    onProgress() {
        if (this.timeline && this.props.source !== 'peer') {
            this.timeline.setLoadedParts(this.video.buffered, this.video.duration);
        }
    }

    onEnded() {
        this.api.end();
        this.showtime.onPaused();
    }

    onSeek(progress) {
        if (typeof progress === 'number' && !isNaN(progress)) {
            this.api.seek(progress * this.duration);
        }
    }

    onPlay() {
        this.api.play(this.currentTime);
    }

    onPause() {
        this.api.pause(this.currentTime);
    }

    onStop() {
        this.api.stop();
    }

    onBackward() {
        this.api.seek(Math.max(this.currentTime - 10, 0));
    }

    onForward() {
        this.api.seek(Math.min(this.currentTime + 10, this.duration));
    }

    onStream() {
        this.video.loadStream(this.peer.spectator.stream);
    }

    toggleStream() {
        if (!this.peer.isStreaming()) {
            this.peer.distribute(this.video.captureStream());
            this.api.setTimeline(this.video.currentTime, this.video.duration);
        } else {
            this.peer.clear();
            this.api.stopStreaming();
        }
    }

    getVideoComponent(source) {
        switch (source) {
            case 'youtube':
                return YoutubeVideo;

            default:
                return Video;
        }
    }

    render() {
        const { source } = this.props;
        const VideoComponent = this.getVideoComponent(source);

        return (
            <figure className="player">
                <AuthorizationModal />
                <VideoComponent
                    ref={this.setVideo}
                    onTimeUpdate={this.onTimeUpdate}
                    onDurationChange={this.onTimeUpdate}
                    onProgress={this.onProgress}
                    onPlayed={this.showtime.onPlayed}
                    onPaused={this.showtime.onPaused}
                    onEnded={this.onEnded}
                    onPlay={this.onPlay}
                    onPause={this.onPause}
                />
                <div
                    className="player-bottom-bar"
                    onMouseEnter={this.showtime.onUIEnter}
                    onMouseLeave={this.showtime.onUILeave}
                >
                    <Timeline ref={this.setTimeline} onSeek={this.onSeek} />
                    <Controls
                        onStop={this.onStop}
                        onPlay={this.onPlay}
                        onPause={this.onPause}
                        onBackward={this.onBackward}
                        onForward={this.onForward}
                        toggleStream={source === 'file' ? this.toggleStream : undefined}
                    />
                </div>
            </figure>
        );
    }
}

export default connect(
    state => ({
        source: state.player.source,
        duration: state.player.duration,
        currentTime: state.player.currentTime,
    }),
    dispatch => ({
        setShowtime: showtime => dispatch(setShowtime(showtime)),
        setTimeline: (currentTime, duration) => dispatch(setTimeline(currentTime, duration)),
    })
)(Player);
