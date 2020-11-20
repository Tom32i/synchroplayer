import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Video extends Component {
    static propTypes = {
        src: PropTypes.string.isRequired,
        onCanPlay: PropTypes.func,
        onLoadedMetadata: PropTypes.func,
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
    }

    get duration() { return this.element.duration; }
    get currentTime() { return this.element.currentTime; }

    setElement(element) {
        this.element = element;

        console.log('videoTracks', element.videoTracks);
        console.log('audioTracks', element.audioTracks);
        console.log('textTracks', element.textTracks);
        console.log('type', element.type);
        console.log('size', element.size);
        console.log(Object.keys(element))
    }

    play() {
        this.element.play();
    }

    pause() {
        this.element.pause();
    }

    render(){
        const { src, onCanPlay, onLoadedMetadata, preload, children } = this.props;

        return (
            <video
                ref={this.setElement}
                src={src}
                onCanPlay={onCanPlay}
                onLoadedMetadata={onLoadedMetadata}
                preload={preload}
            >
                {children}
            </video>
        );
    }
}
