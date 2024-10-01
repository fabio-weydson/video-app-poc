from fastapi import Depends, FastAPI, Response, status
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from typing import List, Optional

from .database import SessionLocal
from .utils import *

from .models import *
from .schemas import Video, VideoCreate, VideoBase, VideoResponse
from .repository import VideoRepository


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI(
    title="Video Playist App API",
    description="A backend API for managing videos playlists",
    version="1.0.0",
    contact={"name": "Fabio Weydson"},
    license_info={"name": "Open Source"}
)

#TODO: Move to a config file
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return RedirectResponse(url="/docs")

@app.get("/videos", response_model = Optional[VideoResponse])
def read_videos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    videos = VideoRepository.get_videos(db, skip, limit)
    return {"data": videos}
    

@app.get("/video/{id}", response_model = Optional[VideoResponse])
def read_video(id: int, db: Session = Depends(get_db), response: Response = None):
    video = VideoRepository.get_video(db, id)

    if not video:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"message": "Video not found", "id": id}
    
    return {"data": [video]}

@app.post("/video", response_model = Optional[VideoResponse])
def create_video(video: VideoCreate, db: Session = Depends(get_db), response: Response = None):

    video.title = sanitize_input(video.title)
    video.description = sanitize_input(video.description)
    video.video_id = extract_youtube_id(sanitize_input(video.video_id))

    required_fields = {
        "title": video.title,
        "description": video.description,
        "video_id": video.video_id
    }

    for field, value in required_fields.items():
        if not value or len(value.strip()) == 0:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"message": f"{field.capitalize()} is required"}
    
    return VideoRepository.create_video(db, video)

@app.put("/video/{id}", response_model = Optional[VideoResponse])
def update_video(id: int, video: VideoBase, db: Session = Depends(get_db), response: Response = None):
    db_video = VideoRepository.get_video(db, id)
    if not db_video:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"message": "Video not found", "id": id}

    video.title = sanitize_input(video.title)
    video.description = sanitize_input(video.description)
    video.video_id = extract_youtube_id(sanitize_input(video.video_id))
    
    video_updated = VideoRepository.update_video(db, id, video)

    return {"message": "Video updated successfully", "video": video_updated}

@app.delete("/video/{id}", response_model = Optional[VideoResponse])
def delete_video(id: int, db: Session = Depends(get_db), response: Response = None):
    video = VideoRepository.get_video(db, id)
    if not video:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"message": "Video not found", "id": id}
    VideoRepository.delete_video(db, id)
    return {"message": "Video deleted successfully", "id": id}