import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { navigate } from '@client/navigation/store';

function Logo(props) {
    return (
        <a className="logo" href="/" onClick={props.goHome}>
            Synchroplayer
        </a>
    );
}

Logo.propTypes = {
    goHome: PropTypes.func.isRequired,
};

export default connect(
    null,
    dispatch => ({
        goHome: event => {
            event.preventDefault();

            return dispatch(navigate('home'));
        }
    })
)(Logo);
