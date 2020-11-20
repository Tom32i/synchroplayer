import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Button extends Component {
    static propTypes = {
        label: PropTypes.node.isRequired,
        onClick: PropTypes.func.isRequired,
        className: PropTypes.string.isRequired,
    };

    static defaultProps = {
        className: '',
    };

    render() {
        const { label, className, onClick } = this.props;

        return (
            <button
                type="button"
                className={className}
                onClick={onClick}
            >
                {label}
            </button>
        );
    }
}
