import React, { Component, createRef } from 'react';
//import videojs from 'video.js';

export default class Video extends Component {
    constructor(props) {
        super(props);

        this.video = createRef();
        /*this.options = {
            autoplay: false,
            controls: true,
            sources: [
                { src: props.video, type: 'video/mp4' }
            ],
        };*/

        this.onReady = this.onReady.bind(this);
    }

    componentDidMount() {
        //console.log(this.video.current);
        //console.log(URL.createObjectURL(this.props.video));
        //this.video.current.src = URL.createObjectURL(this.props.video);
        //videojs(this.video.current);
        //this.player = videojs(this.video.current, this.options, this.onReady);
    }

    onReady() {
        console.log('player ready');
        this.props.onReady();
    }

    renderSubtitle(subtitle = null) {
        if (!subtitle) {
            return null;
        }

        return <track kind="subtitles" src={subtitle} default />;
    }

    render(){
        const { video, subtitle } = this.props;

        return (
            <div data-vjs-player>
                <video className="video-js" ref={this.video} src={video} onCanPlay={this.onReady} /*controls*/>
                    {this.renderSubtitle(subtitle)}
                </video>
            </div>
        );
    }
}
