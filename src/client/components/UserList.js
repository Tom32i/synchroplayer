import React, { Component } from 'react';
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

    renderUser(user) {
        return <User key={user.id} user={user}/>;
    }

    render(){
        return (
            <ul className="user-list">
                {this.props.users.map(this.renderUser)}
            </ul>
        );
    }
}

export default connect(
    state => ({
        users: state.room.users,
    })
)(UserList);
