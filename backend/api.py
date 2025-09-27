from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from models import Params
from main import render_tracked_effect

import uuid
import os
import json
import time
from pathlib import Path
from typing import Dict
import threading
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://aether-rhythm.vercel.app",
        "https://aether-e3xe.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=["*"]
)

processed_files: Dict[str, dict] = {}

def cleanup_expired_files():
    current_time = time.time()
    expired_keys = []
    
    for file_id, file_info in processed_files.items():
        if current_time - file_info['created_at'] > 1800:  
            try:
                file_path = Path(file_info['path'])
                if file_path.exists():
                    file_path.unlink()
                    print(f"Auto-cleaned expired file: {file_path}")
                expired_keys.append(file_id)
            except Exception as e:
                print(f"Error cleaning up expired file: {e}")
                expired_keys.append(file_id)  # Remove from tracking anyway
    
    for key in expired_keys:
        processed_files.pop(key, None)

def safe_delete_file(file_path: Path, max_retries: int = 5, delay: float = 1.0):
    for attempt in range(max_retries):
        try:
            if file_path.exists():
                file_path.unlink()
                print(f"Successfully deleted: {file_path}")
                return True
            return True 
        except PermissionError as e:
            if attempt < max_retries - 1:
                print(f"File locked, retrying in {delay}s (attempt {attempt + 1}/{max_retries}): {file_path}")
                time.sleep(delay)
                delay *= 1.5  
            else:
                print(f"Failed to delete after {max_retries} attempts: {file_path}")
                raise e
        except Exception as e:
            print(f"Unexpected error deleting file: {e}")
            raise e
    return False

def stream_file_safe(file_path: Path, chunk_size: int = 8192):
    try:
        file_size = file_path.stat().st_size
        bytes_sent = 0
        
        with open(file_path, "rb") as file:
            while bytes_sent < file_size:
                remaining = file_size - bytes_sent
                current_chunk_size = min(chunk_size, remaining)
                
                chunk = file.read(current_chunk_size)
                if not chunk:
                    break
                    
                bytes_sent += len(chunk)
                yield chunk
                
    except Exception as e:
        print(f"Error streaming file: {e}")
        raise

@app.get("/")
@app.head("/")
def health():
    return {"message": "API is running - Preview & Download mode"}

@app.post("/process")
async def process_video(file: UploadFile = File(...), params: str = Form(...)):
    
    cleanup_expired_files()
    
    try:
        params_dict = json.loads(params)
        params_obj = Params(**params_dict)
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"Invalid params format: {str(e)}")
    
    if not file.filename or not file.filename.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a video file.")
    
    os.makedirs("temp", exist_ok=True)
    
    # Generate unique IDs
    process_id = str(uuid.uuid4())
    unique_id = str(uuid.uuid4())
    input_path = Path(f"temp/{unique_id}_{file.filename}")
    output_path = Path(f"temp/{process_id}_processed.mp4")

    try:
        print(f"Processing video: {file.filename}")
        
        content = await file.read()
        with open(input_path, "wb") as f:
            f.write(content)
        
        print(f"Processing with params: {params_dict}")
        
        render_tracked_effect(
            video_in=input_path,
            video_out=output_path,
            fps=params_obj.fps,
            pts_per_beat=params_obj.pts_per_beat,
            ambient_rate=params_obj.ambient_rate,
            jitter_px=params_obj.jitter_px,
            life_frames=params_obj.life_frames,
            min_size=params_obj.min_size,
            max_size=params_obj.max_size,
            neighbor_links=params_obj.neighbor_links,
            orb_fast_threshold=params_obj.orb_fast_threshold,
            bell_width=params_obj.bell_width,
            seed=params_obj.seed
        )

        if not output_path.exists():
            raise HTTPException(status_code=500, detail="Video processing failed - output file not created")
        
        file_size = output_path.stat().st_size
        print(f"Processing completed. Output: {output_path}, Size: {file_size} bytes")
        
        try:
            if input_path.exists():
                input_path.unlink()
                print(f"Input file cleaned up: {input_path}")
        except Exception as e:
            print(f"Error cleaning input file: {e}")
        
        processed_files[process_id] = {
            'path': str(output_path),
            'filename': f"processed_{file.filename}",
            'original_filename': file.filename,
            'size': file_size,
            'created_at': time.time()
        }
        
        return {
            "success": True,
            "message": "Video processing completed successfully!",
            "process_id": process_id,
            "filename": f"processed_{file.filename}",
            "original_filename": file.filename,
            "file_size": file_size,
            "preview_url": f"/preview/{process_id}",
            "download_url": f"/download/{process_id}"
        }
        
    except Exception as e:
        print(f"Error processing video: {str(e)}")
        
        for path in [input_path, output_path]:
            try:
                if path.exists():
                    path.unlink()
                    print(f"Cleaned up file on error: {path}")
            except Exception as cleanup_error:
                print(f"Error cleaning up {path}: {cleanup_error}")
        
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.get("/preview/{process_id}")
async def preview_video(process_id: str):
    
    if process_id not in processed_files:
        raise HTTPException(status_code=404, detail="File not found or expired")
    
    file_info = processed_files[process_id]
    file_path = Path(file_info['path'])
    
    if not file_path.exists():
        processed_files.pop(process_id, None)
        raise HTTPException(status_code=404, detail="File not found")
    
    return StreamingResponse(
        stream_file_safe(file_path),
        media_type="video/mp4",
        headers={
            "Content-Length": str(file_info['size']),
            "Accept-Ranges": "bytes",
            "Cache-Control": "no-cache"
        }
    )

@app.get("/download/{process_id}")
async def download_video(process_id: str):
    
    if process_id not in processed_files:
        raise HTTPException(status_code=404, detail="File not found or expired")
    
    file_info = processed_files[process_id]
    file_path = Path(file_info['path'])
    
    if not file_path.exists():
        processed_files.pop(process_id, None)
        raise HTTPException(status_code=404, detail="File not found")
    
    return StreamingResponse(
        stream_file_safe(file_path),
        media_type="video/mp4",
        headers={
            "Content-Disposition": f"attachment; filename={file_info['filename']}",
            "Content-Length": str(file_info['size'])
        }
    )

@app.delete("/delete/{process_id}")
async def delete_processed_video(process_id: str):
    
    if process_id not in processed_files:
        return {"success": True, "message": "File not found or already deleted"}
    
    file_info = processed_files[process_id]
    file_path = Path(file_info['path'])
    
    try:
        processed_files.pop(process_id, None)
        
        if file_path.exists():
            file_path.unlink()
            print(f"File deleted: {file_path}")
            
        return {"success": True, "message": "File deleted successfully"}
        
    except Exception as e:
        print(f"Delete error: {e}")
        return {"success": True, "message": f"File removed from tracking: {str(e)}"}

@app.get("/status")
def get_server_status():
    cleanup_expired_files()
    
    temp_path = Path("temp")
    file_count = len(list(temp_path.glob("*"))) if temp_path.exists() else 0
    
    return {
        "status": "running",
        "mode": "preview-and-download",
        "active_files": len(processed_files),
        "temp_files": file_count
    }

@app.on_event("shutdown")
async def cleanup_on_shutdown():
    print("Server shutting down, cleaning up temporary files...")
    temp_path = Path("temp")
    if temp_path.exists():
        for file_path in temp_path.glob("*"):
            try:
                file_path.unlink()
            except Exception as e:
                print(f"Error cleaning up {file_path} during shutdown: {e}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)