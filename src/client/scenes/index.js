import React from 'react';
import { connect } from 'react-redux';
import Home from '@client/scenes/Home';
import Room from '@client/scenes/Room';

function Router(props) {
    const { route, parameters } = props;

    switch (route) {
        case 'room':
            return <Room id={parameters.id} />;

        case 'home':
            return <Home />;

        default:
            throw new Error('Not found');
    }
}

export default connect(
    state => ({
        route: state.navigation.route,
        parameters: state.navigation.parameters,
    })
)(Router);
