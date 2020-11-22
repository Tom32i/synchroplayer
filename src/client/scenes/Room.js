import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import I18n from 'i18n-js';
import Socket from '@client/components/Socket';
import Player from '@client/components/Player';
import UserList from '@client/components/UserList';

class Room extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        url: PropTypes.bool.isRequired,
        source: PropTypes.string,
        name: PropTypes.string,
        showtime: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        source: null,
        name: null,
    };

    renderContent() {
        const { source, url, name } = this.props;

        if (url) {
            return <Player />;
        }

        if (source === 'file') {
            return <div className="placeholder">{I18n.t('room.drop_file', { name })}</div>;
        }

        return <div className="placeholder">{I18n.t('room.drop_to_start')}</div>;
    }

    render(){
        const { id, showtime } = this.props;

        return (
            <div className={`room ${showtime ? 'showtime' : ''}`}>
                <Socket room={id} />
                {this.renderContent()}
                <UserList />
            </div>
        );
    }
}

export default connect(
    state => ({
        source: state.player.source,
        url: state.player.url !== null,
        name: state.player.name,
        showtime: state.player.showtime,
    })
)(Room);
