from fastapi import FastAPI. HTTPException
from pydantic import BaseModel
from typing import Optional, List
from models import 


app = FastAPI()

@app.get("/")
def root():
    return {}