from logging import log
from sqlalchemy.orm import Session

from .models import Video
from .schemas import VideoCreate, VideoUpdate

class VideoRepository:

    @staticmethod
    def get_video(db: Session, id: int):
        return db.query(Video).filter(Video.id == id).first()

    @staticmethod
    def get_videos(db: Session, skip: int = 0, limit: int = 100):
        res = db.query(Video).offset(skip).limit(limit).all()
        return res

    @staticmethod
    def create_video(db: Session, video: VideoCreate):
        db_video = Video(**video.dict())
        db.add(db_video)
        db.commit()
        db.refresh(db_video)
        return db_video

    @staticmethod
    def update_video(db: Session, id: int, video: VideoUpdate):
        db_video = db.query(Video).filter(Video.id == id).first()
        db_video.title = video.title
        db_video.description = video.description
        db_video.moment = video.moment
        db_video.video_id = video.video_id
        db.commit()
        db.refresh(db_video)
        return db_video

    @staticmethod
    def delete_video(db: Session, video_id: int):
        db_video = db.query(Video).filter(Video.id == video_id).first()
        db.delete(db_video)
        db.commit()
        return db_video