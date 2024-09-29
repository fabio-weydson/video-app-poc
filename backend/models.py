from sqlalchemy import Column, Integer, String
from backend.database import Base

class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    moment = Column(Integer, default=0)
    video_id = Column(String, index=True)

    