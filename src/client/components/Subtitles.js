import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Subtitles extends Component {
    static propTypes = {
        current: PropTypes.number.isRequired,
        subtitles: PropTypes.arrayOf(
            PropTypes.shape({
                url: PropTypes.string,
                label: PropTypes.string,
            })
        ).isRequired,
    };

    constructor(props) {
        super(props);

        this.renderSubtitle = this.renderSubtitle.bind(this);
    }

    renderSubtitle(subtitle, index) {
        const { label, url } = subtitle;
        const active = index === this.props.current;

        return <track key={url} src={url} label={label} default={active} kind="subtitles" />;
    }

    render() {
        return this.props.subtitles.map(this.renderSubtitle);
    }
}

export default connect(
    state => ({
        current: state.player.subtitle || 0,
        subtitles: state.player.subtitles,
    }),
)(Subtitles);
