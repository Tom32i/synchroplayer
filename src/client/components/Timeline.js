import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Timeline extends Component {
    static propTypes = {
        duration: PropTypes.number.isRequired,
        time: PropTypes.number.isRequired,
        onSeek: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.container = null;

        this.state = {
            progress: 0,
        };

        this.setContainer = this.setContainer.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.stop = this.stop.bind(this);
    }

    componentWillUnmout() {
        this.stop();

        if (this.container) {
            this.container.removeEventListener('mousedown', this.onMouseDown);
        }
    }

    setContainer(container) {
        this.container = container;

        this.container.addEventListener('mousedown', this.onMouseDown);
    }

    onMouseDown(event) {
        // document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.stop);
        document.addEventListener('mouseout', this.stop);
        this.props.onSeek(this.getPosition(event));
    }

    /* onMouseMove(event) {
        //this.props.onSeek(this.getPosition(event));
        this.setState({ progress: this.getPosition(event) } );
    }*/

    onMouseUp(event) {
        this.props.onSeek(this.getPosition(event));
        this.stop();
    }

    stop() {
        // document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        document.removeEventListener('mouseout', this.stop);
    }

    getPosition(event) {
        return event.offsetX / this.container.offsetWidth;
    }

    render() {
        const { time, duration } = this.props;
        const percent = (time / duration * 100).toFixed(3);

        return (
            <div  className="player-timeline">
                <div className="progress-bar" ref={this.setContainer}>
                    <div className="active" style={{ width: `${percent}%` }} />
                </div>
            </div>
        );
    }
}

/* export default connect(
    state => ({
        duration: state.player.duration,
    })
)(Timeline);*/
