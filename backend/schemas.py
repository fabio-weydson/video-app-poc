from typing import List, Optional
from pydantic import BaseModel, Field


class VideoBase(BaseModel):
    id: int = None
    title: str = None
    description: Optional[str] = None
    moment: int = 0
    video_id: str

class VideoCreate(VideoBase):
    pass

class VideoUpdate(VideoBase):
    pass

class Video(VideoBase):
    id: int

    class Config:
        orm_mode = True

class VideoResponse(BaseModel):
    data: Optional[List[Video]] = None
    message: Optional[str] = None