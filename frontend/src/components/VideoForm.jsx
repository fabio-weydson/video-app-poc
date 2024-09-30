import { useState } from 'react';
import { YoutubeService } from '../services';

const VideoForm = ({ onCreateVideo }) => {
    
    const [newVideo, setNewVideo] = useState({ title: '', description: '', video_id: '' });
    const [loading, setLoading] = useState(false);


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        onCreateVideo(newVideo);
    };

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

    return (
        <div className="add-video">
        <form onSubmit={handleFormSubmit}>
          <input
              type="text"
              name="video_id"
              value={newVideo.video_id}
              onChange={handleInputChange}
              placeholder="Video URL. Example: https://www.youtube.com/watch?v=nPM-QSCnNas"
              autoComplete="off"
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
    );
}

export default VideoForm;