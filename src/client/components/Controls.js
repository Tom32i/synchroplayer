import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@client/components/Button';
import VolumeControl from '@client/components/VolumeControl';

class Controls extends Component {
    static propTypes = {
        playing: PropTypes.bool.isRequired,
        loaded: PropTypes.bool.isRequired,
        onPlay: PropTypes.func.isRequired,
        onPause: PropTypes.func.isRequired,
        onStop: PropTypes.func.isRequired,
        onBackward: PropTypes.func.isRequired,
        onForward: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.timeout = null;

        this.togglePlay = this.togglePlay.bind(this);
        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.onKey = this.onKey.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    get fullscreen() {
        return !!document.fullscreenElement;
    }

    componentDidMount() {
        document.addEventListener('click', this.onClick);
        document.addEventListener('keyup', this.onKey);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onClick);
        document.removeEventListener('keyup', this.onKey);
    }

    onKey(event) {
        switch (event.keyCode) {
            // Space
            case 32:
                this.cancel(event);
                this.togglePlay();
                break;
            // Left
            case 37:
                this.cancel(event);
                this.props.onBackward();
                break;

            // Right
            case 39:
                this.cancel(event);
                this.props.onForward();
                break;
        }
    }

    cancel(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    onClick(event) {
        if (event.target.tagName.toLowerCase() !== 'figure') {
            return;
        }

        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        switch (event.detail) {
            case 1:
                this.timeout = setTimeout(this.togglePlay, 350);
                break;

            case 2:
                this.toggleFullscreen();
                break;
        }
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
        const { playing, loaded, onStop, onBackward, onForward } = this.props;
        const playIcon = loaded ? playing ? 'icon-pause' : 'icon-play' : 'icon-loader';
        const screenIcon = this.fullscreen ? 'icon-minimise' : 'icon-maximise';

        return (
            <div className="player-controls">
                <div className="group">
                    <Button disabled={!loaded} label={<span className="icon-stop" />} onClick={onStop} />
                </div>
                <div className="group">
                    <Button disabled={!loaded} label={<span className="icon-backward" onClick={onBackward} />} />
                    <Button disabled={!loaded} label={<span className={playIcon} />} onClick={this.togglePlay} />
                    <Button disabled={!loaded} label={<span className="icon-forward" onClick={onForward} />} />
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
        loaded: state.player.loaded,
    })
)(Controls);
