import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class User extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        ready: PropTypes.bool.isRequired,
        name: PropTypes.string,
    };

    static defaultProps = {
        name: '',
    };

    render() {
        const { id/* , name*/, ready } = this.props;

        return (
            <li className={`user ${ready ? 'ready' : 'loading'}`}>
                {id}
            </li>
        );
    }
}
