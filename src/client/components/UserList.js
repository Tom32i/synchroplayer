import React, { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import User from '@client/components/User';

class UserList extends Component {
    static propTypes = {
        users: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
            })
        ).isRequired,
    };

    constructor(props) {
        super(props);

        this.renderUser = this.renderUser.bind(this);
        this.sortById = this.sortById.bind(this);
    }

    sortById(a, b) {
        return a.id.toString().localeCompare(b.id.toString());
    }

    renderUser(user) {
        return createElement(User, { key: user.id, ...user });
    }

    render() {
        const { users } = this.props;

        return (
            <ul className="user-list">
                {users.sort(this.sortById).map(this.renderUser)}
            </ul>
        );
    }
}

export default connect(
    state => ({
        users: state.room.users,
    })
)(UserList);
