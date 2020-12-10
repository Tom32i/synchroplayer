import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Timeline extends Component {
    static propTypes = {
        onSeek: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.container = null;

        this.state = {
            time: '',
            duration: '',
            loaded: [],
            played: 0,
        };

        this.setContainer = this.setContainer.bind(this);
        this.renderLoadedPart = this.renderLoadedPart.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
    }

    setContainer(container) {
        this.container = container;
    }

    setTime(time, duration) {
        this.setState({
            played: this.formetPercent(time, duration),
            time: this.formatTime(time),
            duration: this.formatTime(duration),
        });
    }

    setLoadedParts(buffered, duration) {
        const { length } = buffered;
        const parts = new Array(length);

        for (let i = 0; i < length; i++) {
            parts[i] = [
                this.formetPercent(buffered.start(i), duration),
                this.formetPercent(buffered.end(i), duration)
            ];
        }

        this.setState({ loaded: parts });
    }

    formetPercent(time, duration) {
        return (time / duration * 100).toFixed(3);
    }

    formatTime(time) {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor(time / 60) % 60;
        const seconds = time % 60;

        if (hours) {
            return `${hours}:${minutes.toFixed(0).padStart(2, 0)}:${seconds.toFixed(0).padStart(2, 0)}`;
        }

        return `${minutes}:${seconds.toFixed(0).padStart(2, 0)}`;
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
        const { played, loaded, time, duration } = this.state;

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
