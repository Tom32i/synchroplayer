import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import Client from 'netcode/src/client/Client';
import BinaryEncoder from 'netcode/src/encoder/BinaryEncoder';
import events from '@events';
import { get } from '@client/container';
import { socketOpen, socketClose, me, clientAdd } from '@client/store/room';

class Socket extends Component {
    constructor(props) {
        super(props);

        this.client = null;

        this.onError = this.onError.bind(this);
    }

    componentDidMount() {
        this.client = new Client(this.props.host, new BinaryEncoder(events));

        // Meta-events
        this.client.addEventListener('open', this.props.onOpen);
        this.client.addEventListener('close', this.props.onClose);
        this.client.addEventListener('error', this.onError);

        // Events
        this.client.addEventListener('client:me', this.props.onMe);
        this.client.addEventListener('client:add', this.props.onClient);
    }

    componentWillUnmount() {
        // Meta-events
        this.client.removeEventListener('open', this.props.onOpen);
        this.client.removeEventListener('close', this.props.onClose);
        this.client.removeEventListener('error', this.onError);

        // Events
        this.client.removeEventListener('client:me', this.props.onMe);
        this.client.removeEventListener('client:add', this.props.onClient);

        // Close connection
        this.client.close();
        this.props.onClose();
    }

    onOpen() {
        this.store.dispatch(socketOpen());
    }

    onClose() {
        this.store.dispatch(socketClose());
    }

    /**
     * On error
     *
     * @param {Error} error
     */
    onError(error) {
        console.error(error);
    }

    render() {
        return null;
    }
}

export default connect(
    state => ({
        open: state.room.ready,
    }),
    dispatch => ({
        onOpen: () => dispatch(socketOpen()),
        onClose: () => dispatch(socketClose()),
        onMe: event => dispatch(me(event.detail)),
        onClient: event => dispatch(clientAdd(event.detail)),
    })
)(Socket);
