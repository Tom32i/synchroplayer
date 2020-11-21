import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Video extends Component {
    static propTypes = {
        src: PropTypes.string.isRequired,
        onCanPlay: PropTypes.func,
        onLoadedMetadata: PropTypes.func,
        onAuthorized: PropTypes.func.isRequired,
        onNotAuthorized: PropTypes.func.isRequired,
        onTimeUpdate: PropTypes.func.isRequired,
        onDurationChange: PropTypes.func.isRequired,
        preload: PropTypes.string,
        children: PropTypes.node,
    };

    static defaultProps = {
        onCanPlay: null,
        onLoadedMetadata: null,
        preload: 'auto',
        children: null,
    };

    constructor(props) {
        super(props);

        this.element = null;

        this.setElement = this.setElement.bind(this);
        this.play = this.play.bind(this);
        this.onError = this.onError.bind(this);
    }

    get duration() { return this.element.duration; }
    get currentTime() { return this.element.currentTime; }
    set currentTime(value) { this.element.currentTime = value; }
    get currentSrc() { return this.element.currentSrc; }

    setElement(element) {
        this.element = element;
    }

    play() {
        const { onAuthorized, onNotAuthorized } = this.props;

        let promise = null;

        try {
            promise = this.element.play();
        } catch (error) {
            onNotAuthorized(error);
        }

        if (promise) {
            promise.then(onAuthorized).catch(onNotAuthorized);
        } else {
            onAuthorized();
        }
    }

    pause() {
        this.element.pause();
    }

    /**
     * Video load error
     *
     * @param {Error} error
     */
    onError(error) {
        console.error(error);
    }

    render(){
        const { src, onCanPlay, onLoadedMetadata, onTimeUpdate, onDurationChange, preload, children } = this.props;

        return (
            <video
                ref={this.setElement}
                src={src}
                onCanPlay={onCanPlay}
                onLoadedMetadata={onLoadedMetadata}
                onTimeUpdate={onTimeUpdate}
                onDurationChange={onDurationChange}
                preload={preload}
            >
                {children}
            </video>
        );
    }
}
