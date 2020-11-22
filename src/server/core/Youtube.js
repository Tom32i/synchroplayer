import ytdl from 'ytdl-core';
//import youtubedl from 'youtube-dl';

export default class Youtube {
    getUrl(url, callback) {
        ytdl.getInfo(url, { requestOptions: { part: 'videoDetails,formats' } })
            .then(callback)
            .catch(error => callback(null, error));
    }
}

