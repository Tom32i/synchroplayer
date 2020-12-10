import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import I18n from 'i18n-js';
import { open } from '@client/store/about';

function AboutButton(props) {
    return <button
        type="button"
        className="button icon-info"
        title={I18n.t('about.button')}
        onClick={props.open}
    />;
}

AboutButton.propTypes = {
    open: PropTypes.func.isRequired,
};

export default connect(
    null,
    dispatch => ({
        open: () => dispatch(open()),
    })
)(AboutButton);
