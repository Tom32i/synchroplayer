import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setReady } from '@client/store/player';
import Video from '@client/components/Video';
import Subtitle from '@client/components/Subtitle';
import Controls from '@client/components/Controls';

class Player extends Component {
    static propTypes = {
        video: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
        // Dispatchers
        setReady: PropTypes.func.isRequired,
    };

    static defaultProps = {
        subtitle: null,
    };

    constructor(props) {
        super(props);

        this.video = createRef();
    }

    render(){
        const { video, subtitle } = this.props;

        return (
            <figure className="player">
                <Video reference={this.video} src={video} onCanPlay={this.props.setReady}>
                    {subtitle ? <Subtitle src={subtitle} /> : null}
                </Video>
                <Controls />
            </figure>
        );
    }
}

export default connect(
    state => ({
        video: state.player.video,
        subtitle: state.player.subtitle,
    }),
    dispatch => ({
        setReady: () => dispatch(setReady())
    })
)(Player);
