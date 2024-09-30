import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import './App.css';

import youtubeService from './services/youtube.service';

const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [newVideo, setNewVideo] = useState({ title: '', description: '', video_id: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const videos =await fetchVideos();
      if (videos.length > 0) {
        setCurrentVideo(videos[0]);
      }
    }
    fetchData();
  }, []);

  const fetchVideos = async () => {
    const response = await axios.get(API_URL+'/videos/');
    setVideos(response.data.data);
    return response.data.data;
  };

  const handleVideoClick = (video) => {
    setCurrentVideo(video);
  };

  const handleDeleteVideo = async (videoId) => {
    const confirm = window.confirm('Are you sure you want to delete this video?');
    if (!confirm) return;
    await axios.delete(`${API_URL}/video/${videoId}/`);
    fetchVideos();
  }
  
  const handleInputChange = (e) => {
    setLoading(true);
    const { name, value } = e.target;
    if (name === 'video_id') {
      return youtubeService.fetchVideoData(value).then((data) => {
        if (data) { setNewVideo({ ...newVideo, ...data, video_id: value }); }
      });
    }
    setNewVideo({ ...newVideo, [name]: value });
    setLoading(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/video/`, newVideo);
    fetchVideos();
    setNewVideo({ title: '', description: '', video_id: '' });
  };

  const updateVideoTime = async (videoId, moment) => {
    await axios.put(`${API_URL}/video/${videoId}/`, { ...currentVideo, moment });
    fetchVideos();
  }
  

  const onStateChange = (e) => {
    const moment = Math.floor(e.target.getCurrentTime())
    updateVideoTime(currentVideo.id, moment);
  }

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
      start: currentVideo && currentVideo.moment,
    },
  };

  return (
    <div className="App">
      <div className="header">
        <div className="content">
        <h1>Video Playlist App</h1>
        <label>
          Autoplay
          <input
            type="checkbox"
            checked={opts.playerVars.autoplay === 1}
            onChange={(e) => {
              opts.playerVars.autoplay = e.target.checked ? 1 : 0;
            }}
          />
        </label>
        </div>
      </div>
      <div className="player">
        {currentVideo && (
            <YouTube videoId={currentVideo.video_id} opts={opts} onStateChange={onStateChange} />
        )}
      </div>
      <div className="video-list">
        {videos.length && videos.map((video) => (
          <div key={video.id} className={`video-item ${currentVideo && currentVideo.id === video.id ? 'active' : ''}`}>
            <span onClick={() => handleVideoClick(video)}>{video.title}</span>
            <button onClick={() => handleDeleteVideo(video.id)}>X</button>
          </div>
        ))}
      </div>
      <div className="add-video">
        <form onSubmit={handleFormSubmit}>
        <input
            type="text"
            name="video_id"
            value={newVideo.video_id}
            onChange={handleInputChange}
            placeholder="Video URL. Example: https://www.youtube.com/watch?v=nPM-QSCnNas"
            required
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newVideo.title}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newVideo.description}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
          <button type="submit">Add Video</button>
        </form>
      </div>
    </div>
  );
};

export default App;