import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Button extends Component {
    static propTypes = {
        label: PropTypes.node.isRequired,
        className: PropTypes.string,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        className: '',
        onClick: undefined,
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
