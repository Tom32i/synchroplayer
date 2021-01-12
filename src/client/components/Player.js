import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from '@client/container';
import { setShowtime } from '@client/store/player';
import { Video, YoutubeVideo } from '@client/components/video';
import Controls from '@client/components/Controls';
import Timeline from '@client/components/Timeline';
import AuthorizationModal from '@client/components/AuthorizationModal';
import Showtime from '@client/common/Showtime';

class Player extends Component {
    static propTypes = {
        source: PropTypes.string.isRequired,
        setShowtime: PropTypes.func.isRequired,
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
    }

    setVideo(video) {
        this.video = video;

        if (this.peer.spectator) {
            this.peer.spectator.setVideo(this.video.element);
        }
    }

    setTimeline(timeline) {
        this.timeline = timeline;
    }

    onTimeUpdate() {
        if (this.timeline) {
            this.timeline.setTime(this.video.currentTime, this.video.duration);
        }
    }

    onProgress() {
        if (this.timeline) {
            this.timeline.setLoadedParts(this.video.buffered, this.video.duration);
        }
    }

    onEnded() {
        this.api.end();
        this.showtime.onPaused();
    }

    onSeek(progress) {
        if (typeof progress === 'number' && !isNaN(progress)) {
            this.api.seek(progress * this.video.duration);
        }
    }

    onPlay() {
        this.api.play(this.video.currentTime);
    }

    onPause() {
        this.api.pause(this.video.currentTime);
    }

    onStop() {
        this.api.stop();
    }

    onBackward() {
        this.api.seek(Math.max(this.video.currentTime - 10, 0));
    }

    onForward() {
        this.api.seek(Math.min(this.video.currentTime + 10, this.video.duration));
    }

    onStream() {
        this.peer.distribute(this.video);
    }

    getVideoComponent(source) {
        switch (source) {
            case 'youtube':
                return YoutubeVideo;

                // case: 'peer':
                //    return StreamVideo;

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
                        onStream={source === 'file' ? this.onStream : undefined}
                    />
                </div>
            </figure>
        );
    }
}

export default connect(
    state => ({
        source: state.player.source,
    }),
    dispatch => ({
        setShowtime: showtime => dispatch(setShowtime(showtime)),
    })
)(Player);
