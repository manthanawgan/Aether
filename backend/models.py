from typing import Optional
from pydantic import BaseModel


class Params(BaseModel):
    fps : Optional[float] = None
    life_frame : int = 10
    pts_per_beat : int = 20
    ambient_rate : float = 5.0
    jitter_px : float = 0.5
    min_size : int = 15
    max_size : int = 40
    neighbor_links : int = 3
    orb_fast_threshold : int = 20
    bell_width : float = 4.0
    seed : Optional[int] = None