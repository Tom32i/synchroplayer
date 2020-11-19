import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Subtitle extends Component {
    static propTypes = {
        src: PropTypes.string.isRequired,
    };

    render() {
        const { src } = this.props;

        return <track kind="subtitles" src={src} default />;
    }
}
