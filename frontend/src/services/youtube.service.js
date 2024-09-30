import axios from 'axios';

class YoutubeService {
    async fetchVideoData(videoUrl) {
        const videoId = await this.fetchVideoId(videoUrl);
        const response = await axios.get(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`);
        const videoData = response.data;
        if (!videoData) return;
        return { title: videoData.title, description: videoData.author_name };
    }

    async fetchVideoId(videoUrl) {
        const videoId = videoUrl.split('v=')[1];
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
            return videoId.substring(0, ampersandPosition);
        }
        return videoId;
    }
}

const youtubeService = new YoutubeService();
export default youtubeService;