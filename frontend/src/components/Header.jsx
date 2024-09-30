 import React from 'react';

const Header = ({ autoplay, setAutoplay }) => {
  return (
    <div className="header">
      <div className="content">
        <h1>Video Playlist App</h1>
        <label>
          Autoplay
          <input
            type="checkbox"
            checked={autoplay === 1}
            onChange={(e) => setAutoplay(e.target.checked ? 1 : 0)}
          />
        </label>
      </div>
    </div>
  );
};

export default Header;
