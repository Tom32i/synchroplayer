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

        this.onPlay = this.onPlay.bind(this);
        this.onPause = this.onPause.bind(this);
    }

    onPlay() {
        this.api.play();
    }

    onPause() {
        this.api.pause();
    }

    render() {
        const { playing } = this.props;

        return (
            <div className="player-contols">
                {playing ? <Button label="⏸" onClick={this.onPause} /> : <Button label="▶️" onClick={this.onPlay} />}
            </div>
        );
    }
}

export default connect(
    state => ({
        playing: state.player.playing,
    })
)(Controls);
