import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from '@client/container';
import Button from '@client/components/Button';

class Controls extends Component {
    static propTypes = {
        playing: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);

        this.api = get('api');

        this.onStop = this.onStop.bind(this);
        this.togglePlay = this.togglePlay.bind(this);
        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.goBackward = this.goBackward.bind(this);
        this.goForward = this.goForward.bind(this);
    }

    get fullscreen() {
        return !!document.fullscreenElement;
    }

    onStop() {
        this.api.stop();
    }

    togglePlay() {
        this.props.playing ? this.api.pause() : this.api.play();
    }

    toggleFullscreen() {
        if (this.fullscreen) {
            document.exitFullscreen();
        } else if (document.exitFullscreen) {
            document.documentElement.requestFullscreen();
        }
    }

    goBackward() {

    }
    goForward() {

    }

    render() {
        const { playing } = this.props;
        const playIcon = playing ? 'icon-pause' : 'icon-play';
        const screenIcon = this.fullscreen ? 'icon-minimise' : 'icon-maximise';

        return (
            <div className="player-controls">
                <div className="group">
                    <Button label={<span className="icon-stop" />} onClick={this.onStop} />
                </div>
                <div className="group">
                    <Button label={<span className="icon-backward" onClick={this.goBackward} />} />
                    <Button label={<span className={playIcon} />} onClick={this.togglePlay} />
                    <Button label={<span className="icon-forward" onClick={this.goForward} />} />
                </div>
                <div className="group">
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
