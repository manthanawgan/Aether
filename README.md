# Aether - Apply Rhythm-based visual effects to your videos

Aether is a web application that generates mesmerizing visual effects synchronized to music beats in videos. The core magic happens through computer vision and audio analysis to create dynamic, beat-synced visual overlays.

## What Aether Does

Aether takes any video with audio and transforms it into a visually stunning experience by:

- **Beat Detection**: Analyzes the audio track to detect musical beats and onsets
- **Feature Tracking**: Uses computer vision (ORB detector + Lucas-Kanade optical flow) to track interesting points in the video
- **Dynamic Overlays**: Spawns animated squares, text labels, and connecting lines that appear synchronized to the music
- **Real-time Processing**: Generates effects that respond to both the audio rhythm and visual content

## Visual Effects

The main visual effects include:
- **Beat-synced squares** that appear on detected musical beats
- **Animated text labels** (random codes, numbers, UUIDs) inside the squares
- **Connecting lines** between nearby points creating a network effect
- **Color inversion** inside squares for a "pop" effect
- **Ambient noise** - random points that appear even during quiet moments
- **Jitter effects** for organic, natural-looking motion

## Project Structure

```
Aether/
├── backend/                # FastAPI server (deployed on Render.com)
│   ├── api.py              # REST API endpoints
│   ├── main.py             # CORE EFFECTS ENGINE - The main video processing logic
│   ├── models.py           # Pydantic data models
│   ├── requirements.txt    # Python dependencies
│   └── render.yaml         # Render.com deployment config
├── frontend/               # Next.js web app (deployed on Vercel)
│   ├── app/                # Next.js 13+ app directory
│   ├── components/         # React components
│   └── public/             # Static assets
├── input-vids/             # Sample input videos
└── output-vids/            # Generated output videos
```

## Technical Stack

### Backend (Python)
- **FastAPI** - Modern, fast web framework
- **OpenCV** - Computer vision and image processing
- **MoviePy** - Video editing and processing
- **Librosa** - Audio analysis and beat detection
- **NumPy** - Numerical computations

### Frontend (React/Next.js)
- **Next.js 13+** - React framework with app directory
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Custom UI components** - Built with shadcn/ui

## Deployment Status - Unsuccessful :/

### Frontend (Vercel)
- **Status**: Successfully deployed
- **URL**: https://aether-rhythm.vercel.app
- **Tech**: Next.js with Vercel's seamless deployment

###  Backend (Render.com)
- **Status**: Deployment challenges encountered
- **Issues**: 
  - Python version compatibility (resolved by pinning to 3.11.10)
  - Missing system dependencies (ffmpeg, imagemagick)
  - Memory constraints on Render's free tier
- **Current State**: API is running but video processing fails due to missing dependencies

## The Core Magic: main.py

The heart of Aether lies in `backend/main.py`, which contains the sophisticated video processing pipeline:

### Key Functions:
- **`render_tracked_effect()`** - Main processing function that orchestrates the entire effect generation
- **`_extract_audio()`** - Extracts audio track from video for beat analysis
- **`_detect_onsets()`** - Uses Librosa to detect musical beats and onsets
- **`TrackedPoint`** - Class representing animated elements with position, life, and styling

### Processing Pipeline:
1. **Audio Analysis** - Extract audio and detect musical beats
2. **Feature Detection** - Use ORB detector to find interesting visual points
3. **Optical Flow Tracking** - Track points across frames using Lucas-Kanade
4. **Beat Synchronization** - Spawn new effects on detected beats
5. **Visual Rendering** - Draw squares, text, and connecting lines
6. **Video Output** - Compose final video with effects

##  Customizable Parameters

Users can adjust various parameters to customize the effects:

- **`fps`** - Output frame rate
- **`life_frames`** - How long effects remain visible
- **`pts_per_beat`** - Number of effects spawned per beat
- **`ambient_rate`** - Random effects per second
- **`jitter_px`** - Amount of random movement
- **`min_size`/`max_size`** - Size range for effect squares
- **`neighbor_links`** - Number of connecting lines per point
- **`orb_fast_threshold`** - Sensitivity of feature detection
- **`bell_width`** - Distribution of effect sizes

## Sample Videos

The project includes sample videos in `input-vids/` and generated outputs in `output-vids/` to demonstrate the effects.

## Contributing

This project showcases the intersection of computer vision, audio processing, and web development. While deployment has been challenging, the core technology and effects generation work beautifully locally.

---
