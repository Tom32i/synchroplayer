import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import I18n from 'i18n-js';
import { close } from '@client/store/about';
import Modal from '@client/components/Modal';

function AboutModal(props) {
    if (!props.open) {
        return null;
    }

    return (
        <Modal className="modal--large">
            <h4 className="title">{I18n.t('about.title')}</h4>
            <p className="message">
                Synchroplayer permet de regarder des vidéos, à plusieurs, en synchronisant automatiquement la lecture pour tous les participants.
            </p>
            <p className="message">
                Déposez un fichier vidéo local ou coller une URL.<br/>
                Vous pouvez aussi glisser un fichier de sous-titre.
            </p>

            <h5 className="subtitle">Raccourcis</h5>
            <ul className="shortcuts">
                <li className="shortcut-definition">
                    <span className="shortcut-keys">
                        <span className="shortcut">clic</span>
                        <span className="shortcut">espace</span>
                    </span>
                    <span className="label">Play / Pause</span>
                </li>
                <li className="shortcut-definition">
                    <span className="shortcut-keys">
                        <span className="shortcut">double clic</span>
                    </span>
                    <span className="label">Entrer / sortir du plein écran</span>
                </li>
                <li className="shortcut-definition">
                    <span className="shortcut-keys">
                        <span className="shortcut">&larr;</span>
                        <span className="shortcut">&rarr;</span>
                    </span>
                    <span className="label">Reculer / Avancer de 10 secondes</span>
                </li>
            </ul>
            <p className="message">
                Note: tous les participants peuvent controller la lecture.
            </p>

            <h5 className="subtitle">Ce projet est open-source</h5>
            <a className="action" href="https://github.com/Tom32i/synchroplayer" target="_blank" rel="noreferrer">
                {I18n.t('about.github_link')}
            </a>

            <button className="action" onClick={props.close}>
                {I18n.t('about.close')}
            </button>
        </Modal>
    );
}

AboutModal.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
};

export default connect(
    state => ({
        open: state.about.open,
    }),
    dispatch => ({
        close: () => dispatch(close()),
    })
)(AboutModal);
