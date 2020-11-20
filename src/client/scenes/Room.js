import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Socket from '@client/components/Socket';
import Player from '@client/components/Player';
import UserList from '@client/components/UserList';
import Tuto from '@client/components/Tuto';

class Room extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        video: PropTypes.bool.isRequired,
    };

    render(){
        const { id, video } = this.props;

        return (
            <div className="room">
                <Socket room={id} />
                {video ? <Player /> : <Tuto/>}
                <UserList />
            </div>
        );
    }
}

export default connect(
    state => ({
        video: state.player.url !== null,
    })
)(Room);
