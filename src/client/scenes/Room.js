import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import I18n from 'i18n-js';
import Socket from '@client/components/Socket';
import Player from '@client/components/Player';
import UserList from '@client/components/UserList';
import Logo from '@client/components/Logo';
import AboutButton from '@client/components/AboutButton';
import AboutModal from '@client/components/AboutModal';
import { leave } from '@client/store/room';

class Room extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        url: PropTypes.bool.isRequired,
        source: PropTypes.string,
        name: PropTypes.string,
        showtime: PropTypes.bool.isRequired,
        onLeave: PropTypes.func.isRequired,
    };

    static defaultProps = {
        source: null,
        name: null,
    };

    componentWillUnmount() {
        this.props.onLeave();
    }

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
                <div className="top-bar">
                    <Logo />
                    <AboutButton />
                </div>
                <AboutModal />
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
    }),
    dispatch => ({
        onLeave: () => dispatch(leave()),
    })
)(Room);
