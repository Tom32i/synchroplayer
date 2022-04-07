import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class User extends Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        me: PropTypes.bool.isRequired,
        ready: PropTypes.bool.isRequired,
        streaming: PropTypes.bool.isRequired,
        name: PropTypes.string,
    };

    static defaultProps = {
        name: '',
    };

    render() {
        const { me, ready, streaming } = this.props;
        const classNames = [
            'user',
            ready ? 'ready' : 'loading',
            me ? 'me' : '',
            streaming ? 'streaming' : '',
        ];

        return (
            <li className={classNames.join(' ')}>
                <span className="icon-user" />
                <sup>
                    <span className={ready ? 'icon-check' : 'icon-cross'} />
                </sup>
                {streaming ? <sub><span className="icon-stream" /></sub> : null}
            </li>
        );
    }
}
