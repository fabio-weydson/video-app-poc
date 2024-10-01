import axios from 'axios';

class ApiService {
    constructor() {
        this.API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    }

    async createVideo(data) {
        return axios.post(`${this.API_URL}/video`, data);
    }

    async fetchVideos() {
        const response = await axios.get(this.API_URL + '/videos');
        return response.data.data;
    }

    async fetchVideo(videoId) {
        const response = await axios.get(`${this.API_URL}/video/${videoId}`);
        return response.data.data;
    }

    async updateVideo(videoId, data) {
        return axios.put(`${this.API_URL}/video/${videoId}/`, data);
    }

    async deleteVideo(videoId) {
        await axios.delete(`${this.API_URL}/video/${videoId}/`);
    }
}

export default new ApiService();