import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Button extends Component {
    static propTypes = {
        label: PropTypes.node.isRequired,
        className: PropTypes.string,
        onClick: PropTypes.func,
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        className: '',
        onClick: undefined,
        disabled: false,
    };

    render() {
        const { label, className, disabled, onClick } = this.props;

        return (
            <button
                type="button"
                className={className}
                onClick={onClick}
                disabled={disabled}
            >
                {label}
            </button>
        );
    }
}
