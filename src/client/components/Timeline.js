import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Timeline extends Component {
    static propTypes = {
        onSeek: PropTypes.func.isRequired,
        played: PropTypes.string,
        time: PropTypes.string,
        duration: PropTypes.string,
    };

    static defaultProps = {
        time: '',
        duration: '',
        played: '',
    };

    static formatPercent(time, duration) {
        return (time / duration * 100).toFixed(3);
    }

    static formatTime(time) {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor(time / 60) % 60;
        const seconds = time % 60;

        if (hours) {
            return `${hours}:${minutes.toFixed(0).padStart(2, 0)}:${seconds.toFixed(0).padStart(2, 0)}`;
        }

        return `${minutes}:${seconds.toFixed(0).padStart(2, 0)}`;
    }

    constructor(props) {
        super(props);

        this.container = null;

        this.state = {
            loaded: [],
        };

        this.setContainer = this.setContainer.bind(this);
        this.renderLoadedPart = this.renderLoadedPart.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
    }

    setContainer(container) {
        this.container = container;
    }

    setLoadedParts(buffered, duration) {
        const { length } = buffered;

        // Is streaming?
        if (duration === Infinity || length === 0) {
            return;
        }

        const parts = new Array(length);

        for (let i = 0; i < length; i++) {
            parts[i] = [
                this.constructor.formatPercent(buffered.start(i), duration),
                this.constructor.formatPercent(buffered.end(i), duration)
            ];
        }

        this.setState({ loaded: parts });
    }

    onMouseDown(event) {
        this.props.onSeek(this.getPosition(event.nativeEvent));
    }

    getPosition(event) {
        return event.offsetX / this.container.offsetWidth;
    }

    renderLoadedPart(part, index) {
        const [start, end] = part;

        return <div key={index} className="loaded" style={{ left: `${start}%`, right: `${100 - end}%` }} />;
    }

    render() {
        const { played, time, duration } = this.props;
        const { loaded } = this.state;

        return (
            <div className="player-timeline">
                <div className="times">
                    <span className="time-current">{time}</span>
                    <span className="time-duration">{duration}</span>
                </div>
                <div className="progress-bar" ref={this.setContainer} onMouseDown={this.onMouseDown}>
                    {loaded.map(this.renderLoadedPart)}
                    <div className="played" style={{ width: `${played}%` }} />
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        played: Timeline.formatPercent(state.player.currentTime, state.player.duration),
        time: Timeline.formatTime(state.player.currentTime),
        duration: Timeline.formatTime(state.player.duration),
    }),
    null,
    null,
    { forwardRef: true }
)(Timeline);
