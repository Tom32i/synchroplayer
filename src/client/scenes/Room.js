import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from '@client/container';
import { join } from '@client/store/room';
import Socket from '@client/components/Socket';
import Video from '@client/components/Video';

class Room extends Component {
    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        /*const { room, ready } = this.props;

        if (room && ready && (room !== prevProps.room || ready !== prevProps.ready)) {
            this.socket.join(room);
        }*/
    }

    onReady() {

    }

    render(){
        const { id, video, subtitle } = this.props;

        return (
            <div className="room">
                <Socket host={`${get('config:protocol')}//${get('config:host')}/${id}/`} />
                <Video video={video} subtitle={subtitle} onReady={this.onReady} />
                <div className="controls">

                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        ready: state.room.connected,
        video: state.player.video,
        subtitle: state.player.subtitle,
    })
)(Room);
