## Video Playlist App

This is a simple video playlist app that allows users to add videos to a playlist and play them in a sequence. 
The app is built using JS with React and Python FastAPI and uses a SQLite database to store the playlist data.

### Features
- Add Youtube videos to the playlist
- Remove videos from the playlist
- Shuffle the playlist
- Resume playing the video/playlist from where user left off

#### Coming soon
- Create multiple playlists
- Save the playlist to a file
- Load a playlist from a file

### Requirements
- Node.js
- Python 3.10+

### Installation and Usage

1. Clone the repository
2. Install the dependencies
    ```bash
    npm install
    ```
3. Start the frontend
    ```bash
    npm start
    ```
4. Install the Python dependencies
    ```bash
    pip install -r requirements.txt

5. Initialize the database
    ```bash
    alembic upgrade head
    ```
6. Start the backend
    ```bash
    fastapi run
    ```
7. Open the app in your browser
    ```
    http://localhost:3000
    ```
8. Open the API documentation
    ```
    http://localhost:8000/docs
    ```
9. Enjoy!