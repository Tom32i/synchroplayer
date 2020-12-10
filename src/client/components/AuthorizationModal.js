import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import I18n from 'i18n-js';
import { get } from '@client/container';
import Modal from '@client/components/Modal';

function AuthorizationModal(props) {
    if (props.authorized) {
        return null;
    }

    return (
        <Modal>
            <h4 className="title">{I18n.t('player.authorization.title')}</h4>
            <p className="message">{I18n.t('player.authorization.content')}</p>
            <button className="action" onClick={get('api').play}>
                {I18n.t('player.authorization.ok')}
            </button>
        </Modal>
    );
}

AuthorizationModal.propTypes = {
    authorized: PropTypes.bool.isRequired,
};

export default connect(
    state => ({
        authorized: state.player.authorized,
    })
)(AuthorizationModal);
