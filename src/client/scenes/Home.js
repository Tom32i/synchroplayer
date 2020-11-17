import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigate } from '@client/navigation/store';

class Home extends Component {
    componentDidUpdate(prevProps) {
        const { video } = this.props;

        // Create a new room when loading video
        if (video && video !== prevProps.video) {
            this.props.join(Math.random().toString(16).slice(2));
        }
    }

    render() {
        return(
            <div className="home">
                <h1>Synchroplayer</h1>
                <p>Drop a video to start</p>
            </div>
        );
    }
}

export default connect(
    state => ({
        video: state.player.video !== null,
    }),
    dispatch => ({
        join: id => dispatch(navigate('room', { id })),
    })
)(Home);
