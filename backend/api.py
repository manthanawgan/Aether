from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from backend.models import Params
from fastapi import UploadFile, File, Form, FileResponse
from .main import render_tracked_effect

import uuid
import os



app = FastAPI()

@app.get("/")
def health():
    return {"message" : "hiii"}

@app.post("/process")
async def process_video(file : UploadFile = File(...), params : Params = Form(...) ):
    if file is None:
        raise HTTPException(status_code=404, details= "error, file is not apploaded")
    input_path = f"temp/{uuid.uuid4()}_{file.filename}"
    output_path = input_path.replace(".mp4", "_out.mp4")

    with open(input_path, "wb") as f:
        f.write(await file.read())

    render_tracked_effect(input_path,
                          output_path,
                          fps=Params.fps,
                          pts_per_beat=Params.pts_per_beat,
                          ambient_rate=Params.ambient_rate,
                          jitter_px=Params.jitter_px,
                          life_frames=Params.life_frame,
                          min_size=Params.min_size,
                          max_size=Params.max_size,
                          neighbor_links=Params.neighbor_links,
                          orb_fast_threshold=Params.orb_fast_threshold,
                          bell_width=Params.bell_width,
                          seed=Params.seed
                          )
    
    return FileResponse(output_path, media_type="video/mp4", filename="processed.mp4")
