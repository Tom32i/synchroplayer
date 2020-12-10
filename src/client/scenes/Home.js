import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { connect } from 'react-redux';
import { navigate } from '@client/navigation/store';
import Logo from '@client/components/Logo';
import AboutButton from '@client/components/AboutButton';
import AboutModal from '@client/components/AboutModal';

class Home extends Component {
    static propTypes = {
        video: PropTypes.bool.isRequired,
        join: PropTypes.func.isRequired,
    };

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
                <h1 className="title">Synchroplayer</h1>
                <p className="starter">{I18n.t('home.starter')}</p>
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
        video: state.player.url !== null,
    }),
    dispatch => ({
        join: id => dispatch(navigate('room', { id })),
    })
)(Home);
