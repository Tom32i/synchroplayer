import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Subtitles from '@client/components/Subtitles';

export default class Video extends Component {
    static propTypes = {
        src: PropTypes.string,
        playing: PropTypes.bool.isRequired,
        time: PropTypes.number.isRequired,
        authorized: PropTypes.bool.isRequired,
        loaded: PropTypes.bool.isRequired,
        setDuration: PropTypes.func.isRequired,
        setLoaded: PropTypes.func.isRequired,
        setAuthorized: PropTypes.func.isRequired,
        end: PropTypes.func.isRequired,
        onTimeUpdate: PropTypes.func.isRequired,
        onDurationChange: PropTypes.func.isRequired,
        onProgress: PropTypes.func.isRequired,
        onPlayed: PropTypes.func.isRequired,
        onPaused: PropTypes.func.isRequired,
        onEnded: PropTypes.func.isRequired,
        preload: PropTypes.string,
        autoplay: PropTypes.bool,
        volume: PropTypes.number.isRequired,
    };

    static defaultProps = {
        preload: 'auto',
        autoplay: false,
        src: undefined,
    };

    constructor(props) {
        super(props);

        this.element = null;
        this.ready = false;

        this.setElement = this.setElement.bind(this);
        this.play = this.play.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onCanPlay = this.onCanPlay.bind(this);
        this.onCanPlayThrough = this.onCanPlayThrough.bind(this);
        this.onDurationChange = this.onDurationChange.bind(this);
        this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onNotAuthorized = this.onNotAuthorized.bind(this);
        this.onEnded = this.onEnded.bind(this);
        this.onAuthorized = this.onAuthorized.bind(this);
        this.onError = this.onError.bind(this);
    }


    get currentTime() { return parseFloat(this.element.currentTime.toFixed(3), 10); }
    get duration() { return parseFloat(this.element.duration.toFixed(3), 10); }
    get buffered() { return this.element.buffered; }

    componentDidUpdate(prevProps) {
        const { time, playing, volume } = this.props;

        if (playing !== prevProps.playing) {
            playing ? this.play(time) : this.pause(time);
        } else if (time !== prevProps.time) {
            this.seek(time);
        }

        if (volume !== prevProps.volume) {
            this.element.volume = this.props.volume;
        }
    }

    componentWillUnmount() {
        if (this.element) {
            this.element.removeEventListener('resize', this.onResize);
        }
    }

    setElement(element) {
        this.element = element;

        if (this.element) {
            this.element.volume = this.props.volume;
            this.element.addEventListener('resize', this.onResize);
        }
    }

    play(time) {
        this.seek(time);

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

    pause(time) {
        this.element.pause();
        this.seek(time);
    }

    stop() {
        this.element.stop();
    }

    seek(time) {
        if (typeof time === 'number' && this.element.seekable.length) {
            this.element.currentTime = time;
        }
    }

    captureStream() {
        if (typeof this.element.mozCaptureStream === 'function') {
            console.log(this.element.readyState);
            return this.element.mozCaptureStream();
        }

        if (typeof this.element.captureStream === 'function') {
            console.log(this.element.readyState);
            return this.element.captureStream();
        }

        return null;
    }

    onAuthorized() {
        console.log('onAuthorized');
        if (!this.props.authorized) {
            this.props.setAuthorized(true);
        }
    }

    onNotAuthorized(error) {
        console.log('onNotAuthorized');
        if (error instanceof DOMException && error.name === 'NotAllowedError' && this.props.authorized) {
            this.props.setAuthorized(false);
        }
    }

    onLoadStart() {
        console.log('onLoadStart');
        if (this.props.loaded) {
            this.props.setLoaded(false);
        }
    }

    onProgress() {
        console.log('onProgress');
        this.props.onProgress();
    }

    onCanPlay() {
        console.log('onCanPlay');
        if (!this.props.loaded) {
            this.props.setLoaded(true);

            if (this.props.time > this.element.currentTime) {
                this.seek(this.props.time);
            }
        }
    }

    onCanPlayThrough() {
        console.log('onCanPlayThrough');
    }

    onLoadedMetadata(event) {
        console.log('onLoadedMetadata', event);
    }

    onResize(event) {
        console.log('onResize', event);
    }

    onDurationChange() {
        if (this.element.duration !== Infinity) {
            this.props.setDuration(this.element.duration);
            this.props.onDurationChange();
        }
    }

    onEnded() {
        this.props.end();
        this.props.onEnded();
    }

    onError(error) {
        console.error(error);
    }

    render(){
        const { src, preload, autoplay } = this.props;

        return (
            <video
                ref={this.setElement}
                src={src}
                preload={preload}
                autoPlay={autoplay}
                onLoadStart={this.onLoadStart}
                onProgress={this.onProgress}
                onCanPlay={this.onCanPlay}
                onCanPlayThrough={this.onCanPlayThrough}
                onDurationChange={this.onDurationChange}
                onLoadedMetadata={this.onLoadedMetadata}
                onTimeUpdate={this.props.onTimeUpdate}
                onPlay={this.props.onPlayed}
                onPause={this.props.onPaused}
                onEnded={this.onEnded}
            >
                <Subtitles />
            </video>
        );
    }
}
