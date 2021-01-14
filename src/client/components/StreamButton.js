import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@client/components/Button';
import { setStreaming } from '@client/store/player';

class StreamButton extends Component {
    static propTypes = {
        disabled: PropTypes.bool,
        streaming: PropTypes.bool.isRequired,
        toggleStream: PropTypes.func.isRequired,
    };

    static defaultProps = {
        disabled: false,
    };

    constructor(props) {
        super(props);

        this.toggleStream = this.toggleStream.bind(this);
    }

    toggleStream() {
        const { streaming, toggleStream } = this.props;

        toggleStream(!streaming);
    }

    render() {
        const { streaming, disabled } = this.props;

        return <Button
            disabled={disabled}
            label={<span className="icon-stream" />}
            className={streaming ? 'active' : ''}
            onClick={this.toggleStream}
        />;
    }
}

export default connect(
    state => ({
        streaming: state.player.streaming,
    }),
    /* dispatch => ({
        toggleStream: streaming => dispatch(setStreaming(streaming)),
    })*/
)(StreamButton);

