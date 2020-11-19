import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class User extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        name: PropTypes.string,
    };

    static defaultProps = {
        name: '',
    };

    render() {
        const { id, name } = this.props;

        return (
            <li className="user">
                {id} - {name}
            </li>
        );
    }
}
