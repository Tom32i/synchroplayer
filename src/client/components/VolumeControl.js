import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setVolume } from '@client/store/options';

class VolumeControl extends Component {
    static propTypes = {
        volume: PropTypes.number.isRequired,
        setVolume: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.min = 0;
        this.max = 1;

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.props.setVolume(parseFloat(event.target.value, 10));
    }

    getIcon(volume) {
        if (volume > 0.67) {
            return 'icon-volume-high';
        }
        if (volume > 0.33) {
            return 'icon-volume-medium';
        }
        if (volume > 0) {
            return 'icon-volume-low';
        }

        return 'icon-volume-none';
    }

    getStyle() {
        return {
            '--min': this.min,
            '--max': this.max,
            '--val': this.props.volume,
        };
    }

    render() {
        const { volume } = this.props;

        return <div className="volume-control-container">
            <span className={this.getIcon(volume)}></span>
            <input
                type="range"
                className="volume-control"
                value={volume}
                min={this.min}
                max={this.max}
                step="0.05"
                style={this.getStyle()}
                onChange={this.onChange}
            />
        </div>;
    }
}

export default connect(
    state => ({
        volume: state.options.volume,
    }),
    dispatch => ({
        setVolume: volume => dispatch(setVolume(volume)),
    })
)(VolumeControl);
