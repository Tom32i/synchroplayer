import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from '@client/container';
import Socket from '@client/components/Socket';
import Player from '@client/components/Player';
import UserList from '@client/components/UserList';

class Room extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        video: PropTypes.bool.isRequired,
    };

    render(){
        const { id, video } = this.props;

        return (
            <div className="room">
                <Socket host={`${get('config:protocol')}//${get('config:host')}/${id}/`} />
                {video ? <Player /> : null}
                <UserList />
            </div>
        );
    }
}

export default connect(
    state => ({
        video: state.player.video !== null,
    })
)(Room);
