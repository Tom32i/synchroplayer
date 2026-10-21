import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18n from '@client/translations';
import { get } from '@client/container';
import Modal from '@client/components/Modal';

function AuthorizationModal(props) {
    if (props.authorized) {
        return null;
    }

    return (
        <Modal>
            <h4 className="title">{i18n.t('player.authorization.title')}</h4>
            <p className="message">{i18n.t('player.authorization.content')}</p>
            <button className="action" onClick={get('api').play}>
                {i18n.t('player.authorization.ok')}
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
