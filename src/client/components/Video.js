import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setLoaded, setAuthorized, setDuration } from '@client/store/player';
import Subtitles from '@client/components/Subtitles';

class Video extends Component {
    static propTypes = {
        src: PropTypes.string.isRequired,
        playing: PropTypes.bool.isRequired,
        time: PropTypes.number.isRequired,
        authorized: PropTypes.bool.isRequired,
        loaded: PropTypes.bool.isRequired,
        setDuration: PropTypes.func.isRequired,
        setLoaded: PropTypes.func.isRequired,
        setAuthorized: PropTypes.func.isRequired,
        onTimeUpdate: PropTypes.func.isRequired,
        onPlayed: PropTypes.func.isRequired,
        onPaused: PropTypes.func.isRequired,
        preload: PropTypes.string,
    };

    static defaultProps = {
        preload: 'auto',
    };

    constructor(props) {
        super(props);

        this.element = null;
        this.ready = false;

        this.setElement = this.setElement.bind(this);
        this.play = this.play.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
        this.onCanPlay = this.onCanPlay.bind(this);
        this.onDurationChange = this.onDurationChange.bind(this);
        this.onNotAuthorized = this.onNotAuthorized.bind(this);
        this.onAuthorized = this.onAuthorized.bind(this);
        this.onError = this.onError.bind(this);
    }

    get currentTime() { return this.element.currentTime; }
    get duration() { return this.element.duration; }
    get seekMin() { return this.element.seekable.start(0); }
    get seekMax() { return this.element.seekable.end(0); }

    componentDidUpdate(prevProps) {
        const { time, playing } = this.props;

        if (playing !== prevProps.playing) {
            this.seek(time);
            playing ? this.play() : this.pause();
        } else if (time !== prevProps.time) {
            this.seek(time);
        }
    }

    setElement(element) {
        this.element = element;
    }

    play() {
        let promise = null;

        try {
            promise = this.element.play();
        } catch (error) {
            this.onNotAuthorized(error);
        }

        if (promise) {
            promise.then(this.onAuthorized).catch(this.onNotAuthorized);
        } else {
            this.onAuthorized();
        }
    }

    pause() {
        this.element.pause();
    }

    seek(time) {
        if (typeof time === 'number') {
            this.element.currentTime = time;
        }
    }

    onAuthorized() {
        if (!this.props.authorized) {
            this.props.setAuthorized(true);
        }
    }

    onNotAuthorized(error) {
        if (error instanceof DOMException && error.name === 'NotAllowedError' && this.props.authorized) {
            this.props.setAuthorized(false);
        }
    }

    onLoadStart() {
        if (this.props.loaded) {
            this.props.setLoaded(false);
        }
    }

    onCanPlay() {
        if (!this.props.loaded) {
            this.props.setLoaded(true);

            if (this.props.time > this.element.currentTime) {
                this.seek(this.props.time);
            }
        }
    }

    onDurationChange() {
        this.props.setDuration(this.element.duration);
    }

    onError(error) {
        console.error(error);
    }

    render(){
        const { src, preload } = this.props;

        return (
            <video
                ref={this.setElement}
                src={src}
                preload={preload}
                onLoadStart={this.onLoadStart}
                onCanPlay={this.onCanPlay}
                onDurationChange={this.onDurationChange}
                onTimeUpdate={this.props.onTimeUpdate}
                onPlay={this.props.onPlayed}
                onPause={this.props.onPaused}
            >
                <Subtitles />
            </video>
        );
    }
}

export default connect(
    state => ({
        src: state.player.url,
        playing: state.player.playing,
        time: state.player.time,
        authorized: state.player.authorized,
        loaded: state.player.loaded,
    }),
    dispatch => ({
        setDuration: duration => dispatch(setDuration(duration)),
        setLoaded: authorized => dispatch(setLoaded(authorized)),
        setAuthorized: loaded => dispatch(setAuthorized(loaded)),
    }),
    null,
    { forwardRef: true }
)(Video);
