from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
from models import Params
from main import render_tracked_effect

import uuid
import os
import json
from pathlib import Path

"""
have to build : frontend, some minor features in backend ( 21/9 ) 
"""

app = FastAPI()

@app.get("/")
def health():
    return {"message" : "hiii"}

@app.post("/process")
async def process_video(file : UploadFile = File(...), params : str = Form(...) ):
    try:
        params_dict = json.loads(params)
        params_obj = Params(**params_dict)
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"Invalid params format: {str(e)}")
    
    os.makedirs("temp", exist_ok=True)
    
    input_path = Path(f"temp/{uuid.uuid4()}_{file.filename}")
    output_path = input_path.with_name(input_path.stem + "_out.mp4")

    try:
        with open(input_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        render_tracked_effect(
            video_in=input_path,
            video_out=output_path,
            fps=params_obj.fps,
            pts_per_beat=params_obj.pts_per_beat,
            ambient_rate=params_obj.ambient_rate,
            jitter_px=params_obj.jitter_px,
            life_frames=params_obj.life_frame,  
            min_size=params_obj.min_size,
            max_size=params_obj.max_size,
            neighbor_links=params_obj.neighbor_links,
            orb_fast_threshold=params_obj.orb_fast_threshold,
            bell_width=params_obj.bell_width,
            seed=params_obj.seed
        )

        if not output_path.exists():
            raise HTTPException(status_code=500, detail="Video processing failed")
            
        return FileResponse(
            path=str(output_path), 
            media_type="video/mp4", 
            filename="processed.mp4"
        )
        
    except Exception as e:
        if input_path.exists():
            input_path.unlink()
        if output_path.exists():
            output_path.unlink()
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")
    
    finally:
        if input_path.exists():
            input_path.unlink()
