import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Video extends Component {
    static propTypes = {
        reference: PropTypes.object.isRequired,
        src: PropTypes.string.isRequired,
        onCanPlay: PropTypes.func.isRequired,
        children: PropTypes.node,
    };

    static defaultProps = {
        children: null,
    };

    render(){
        const { reference, src, onCanPlay, children } = this.props;

        return (
            <video ref={reference} src={src} onCanPlay={onCanPlay} preload="auto">
                {children}
            </video>
        );
    }
}
