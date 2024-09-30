import React, { useState, useEffect, useMemo } from 'react';
import YouTube from 'react-youtube';

import './App.css';

import Header from './components/Header';

import { YoutubeService, ApiService } from './services';

import { PLAYER_STATE } from './constants';

const App = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [newVideo, setNewVideo] = useState({ title: '', description: '', video_id: '' });
  const [loading, setLoading] = useState(false);
  const [autoplay, setAutoplay] = useState(1);

  useEffect(() => {
    async function fetchData() {
      const videos =await fetchVideos();
      if (videos.length > 0) {
        setCurrentVideo(videos[0]);
      }
    }
    fetchData();
  }, []);

  const fetchVideos = useMemo(() => async () => {
    const response = await ApiService.fetchVideos();
    setVideos(response);
    return response;
  }, []);

  const handleVideoClick = (video) => {
    setCurrentVideo(video);
  };

  const handleDeleteVideo = async (videoId) => {
    const confirm = window.confirm('Are you sure you want to delete this video?');
    if (!confirm) return;
    await ApiService.deleteVideo(videoId);
    fetchVideos();
  }
  
  const handleInputChange = async ({target}) => {
    setLoading(true);

    const { name, value } = target;

    if (name === 'video_id') {
      if (!value.includes('youtube.com')) {
        setNewVideo({ ...newVideo, [name]: value });
        setLoading(false);
        return;
      }

      const data = await YoutubeService.fetchVideoData(value);
      if (data) {
        setNewVideo({ ...newVideo, ...data, video_id: value });
      }
      setLoading(false);
      
    } else {
      setNewVideo({ ...newVideo, [name]: value });
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await ApiService.createVideo(newVideo);
    fetchVideos();
    setNewVideo({ title: '', description: '', video_id: '' });
  };

  const updateVideoTime = async (videoId, moment) => {
    await  ApiService.updateVideo(videoId, { ...currentVideo, moment });
   }
  

  const onVideoStateChange = ({target}) => {
    
    const duration = Math.floor(target.getDuration());
    const moment = Math.floor(target.getCurrentTime())
    const playerState = target.getPlayerState();

    if(duration === 0) return;
    if(playerState !== PLAYER_STATE.PLAYING && playerState !== PLAYER_STATE.PAUSED) return;

    // Video ended
    if(moment >= (duration-1)) { 
      updateVideoTime(currentVideo.id, 0);
      setCurrentVideo(videos[videos.indexOf(currentVideo) + 1]);

      // Playlist ended, restart
      if(videos.indexOf(currentVideo) === videos.length - 1) {
        updateVideoTime(currentVideo.id, 0);
        setCurrentVideo(videos[0]);
      }
      return;
    }
  
    updateVideoTime(currentVideo.id, moment);
  }

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay,
      start: currentVideo && currentVideo.moment,
      rel: 0,
    },
  };

  return (
    <div className="App">
      <Header autoplay={autoplay} setAutoplay={setAutoplay} />
      <div className="player">
        {currentVideo && (
            <YouTube videoId={currentVideo.video_id} opts={opts} onStateChange={onVideoStateChange} />
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