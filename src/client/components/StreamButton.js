import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@client/components/Button';

class StreamButton extends Component {
    static propTypes = {
        disabled: PropTypes.bool,
        active: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired,
    };

    static defaultProps = {
        disabled: false,
    };

    render() {
        const { active, disabled, onClick } = this.props;

        return <Button
            disabled={disabled}
            label={<span className="icon-stream" />}
            className={active ? 'active' : ''}
            onClick={onClick}
        />;
    }
}

export default connect(
    state => ({
        active: state.room.streaming === state.room.me,
    }),
)(StreamButton);

