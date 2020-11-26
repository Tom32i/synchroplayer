import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@client/components/Button';
import VolumeControl from '@client/components/VolumeControl';

class Controls extends Component {
    static propTypes = {
        playing: PropTypes.bool.isRequired,
        onPlay: PropTypes.func.isRequired,
        onPause: PropTypes.func.isRequired,
        onStop: PropTypes.func.isRequired,
        onBackward: PropTypes.func.isRequired,
        onForward: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.togglePlay = this.togglePlay.bind(this);
        this.toggleFullscreen = this.toggleFullscreen.bind(this);
    }

    get fullscreen() {
        return !!document.fullscreenElement;
    }

    toggleFullscreen() {
        if (this.fullscreen) {
            document.exitFullscreen();
        } else if (document.exitFullscreen) {
            document.documentElement.requestFullscreen();
        }
    }

    togglePlay() {
        const { playing, onPlay, onPause } = this.props;
        const action = playing ? onPause : onPlay;
        action();
    }

    render() {
        const { playing, onStop, onBackward, onForward } = this.props;
        const playIcon = playing ? 'icon-pause' : 'icon-play';
        const screenIcon = this.fullscreen ? 'icon-minimise' : 'icon-maximise';

        return (
            <div className="player-controls">
                <div className="group">
                    <Button label={<span className="icon-stop" />} onClick={onStop} />
                </div>
                <div className="group">
                    <Button label={<span className="icon-backward" onClick={onBackward} />} />
                    <Button label={<span className={playIcon} />} onClick={this.togglePlay} />
                    <Button label={<span className="icon-forward" onClick={onForward} />} />
                </div>
                <div className="group">
                    <VolumeControl />
                    <Button label={<span className={screenIcon} />} onClick={this.toggleFullscreen} />
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        playing: state.player.playing,
    })
)(Controls);
