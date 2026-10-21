import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18n from '@client/translations';
import { open } from '@client/store/about';

function AboutButton(props) {
    return <button
        type="button"
        className="button icon-info"
        title={i18n.t('about.button')}
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
