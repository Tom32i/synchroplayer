import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from '@client/container';
import { setShowtime } from '@client/store/player';
import Video from '@client/components/Video';
import Controls from '@client/components/Controls';
import Timeline from '@client/components/Timeline';
import AuthorizationModal from '@client/components/AuthorizationModal';
import Showtime from '@client/common/Showtime';

class Player extends Component {
    static propTypes = {
        setShowtime: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.api = get('api');
        this.showtime = new Showtime(props.setShowtime);
        this.video = null;
        this.timeline = null;

        this.setVideo = this.setVideo.bind(this);
        this.setTimeline = this.setTimeline.bind(this);
        this.onTimeUpdate = this.onTimeUpdate.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onStop = this.onStop.bind(this);
        this.onBackward = this.onBackward.bind(this);
        this.onForward = this.onForward.bind(this);
        this.onSeek = this.onSeek.bind(this);
    }

    setVideo(video) {
        this.video = video;
    }

    setTimeline(timeline) {
        this.timeline = timeline;
    }

    onTimeUpdate() {
        if (this.timeline) {
            this.timeline.setTime(this.video.currentTime, this.video.duration);
        }
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

    render() {
        const { onPlayed, onPaused, onUIEnter, onUILeave } = this.showtime;

        return (
            <figure className="player">
                <AuthorizationModal />
                <Video
                    ref={this.setVideo}
                    onTimeUpdate={this.onTimeUpdate}
                    onPlayed={onPlayed}
                    onPaused={onPaused}
                />
                <div className="player-bottom-bar" onMouseEnter={onUIEnter} onMouseLeave={onUILeave}>
                    <Timeline ref={this.setTimeline} onSeek={this.onSeek} />
                    <Controls
                        onStop={this.onStop}
                        onPlay={this.onPlay}
                        onPause={this.onPause}
                        onBackward={this.onBackward}
                        onForward={this.onForward}
                    />
                </div>
            </figure>
        );
    }
}

export default connect(
    null,
    dispatch => ({
        setShowtime: showtime => dispatch(setShowtime(showtime)),
    })
)(Player);
