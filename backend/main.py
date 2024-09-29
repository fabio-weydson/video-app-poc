from typing import Union

from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

app = FastAPI(
    title="Video API",
    description="A simple API to manage videos",
    version="0.1",
    contact={"name": "Fabio Weydson"},
    license_info={"name": "Open Source"}
)

class VideoItem(BaseModel):
    id: int
    title: str
    description: str = None
    moment: int
    video_id: str

@app.get("/")
def read_root():
    return RedirectResponse(url="/docs")

@app.get("/videos")
def read_videos():
    return {"videos": "List of videos"}

@app.get("/videos/{id}")
def read_video(id: int, q: Union[str, None] = None):
    return {"id": id, "q": q}

@app.post("/video")
def create_video(video: VideoItem):
    return video

@app.put("/video/{id}")
def update_video(id: int, video: VideoItem):
    return {"title": video.title, "id": id}