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
            percent: 0,
        };

        this.setContainer = this.setContainer.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
    }

    setContainer(container) {
        this.container = container;
    }

    setTime(time, duration) {
        this.setState({ percent: (time / duration * 100).toFixed(3) });
    }

    onMouseDown(event) {
        this.props.onSeek(this.getPosition(event.nativeEvent));
    }

    getPosition(event) {
        return event.offsetX / this.container.offsetWidth;
    }

    render() {
        const { percent } = this.state;

        return (
            <div  className="player-timeline">
                <div className="progress-bar" ref={this.setContainer} onMouseDown={this.onMouseDown}>
                    <div className="active" style={{ width: `${percent}%` }} />
                </div>
            </div>
        );
    }
}
