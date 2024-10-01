import React, { useState, useEffect, useMemo } from 'react';
import YouTube from 'react-youtube';

import './App.css';

import { ApiService } from './services';
import { PLAYER_STATE } from './constants';
import { Header, VideoForm } from './components';

const App = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
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

  const handleDeleteVideo = async (videoId) => {
    const confirm = window.confirm('Are you sure you want to delete this video?');
    if (!confirm) return;
    await ApiService.deleteVideo(videoId);
    fetchVideos();
  }

  const handleCreateVideo = async (video) => {
    await ApiService.createVideo(video);
    fetchVideos();
  }

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

  const handleVideoClick = (video) => {
    setCurrentVideo(video);
  };

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
        {!!currentVideo &&  <YouTube videoId={currentVideo.video_id} opts={opts} onStateChange={onVideoStateChange} />}
      </div>
      <div className="video-list">
        {!!videos && videos.map((video) => (
          <div key={video.id} className={`video-item ${currentVideo && currentVideo.id === video.id ? 'active' : ''}`}>
            <span onClick={() => handleVideoClick(video)}>{video.title}</span>
            <button onClick={() => handleDeleteVideo(video.id)}>X</button>
          </div>
        ))}
      </div>
      <VideoForm onCreateVideo={handleCreateVideo} />
    </div>
  );
};

export default App;