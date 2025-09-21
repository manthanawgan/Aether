"use client"

import { Play, X } from "lucide-react"
import { useState } from "react"

interface GalleryVideo {
  id: string
  title: string
  thumbnail: string
  videoUrl: string
  duration: string
}


const sampleVideos: GalleryVideo[] = [
  {
    id: "1",
    title: "Formula-1",
    thumbnail: "/thumbnails/demo-img1.png",
    videoUrl: "/videos/demo-vid1.mp4", 
    duration: "0:37",
  },
  {
    id: "2",
    title: "Cristiano ronaldo",
    thumbnail: "/thumbnails/demo-img2.png",
    videoUrl: "/videos/demo-vid2.mp4", 
    duration: "0:14",
  },
  {
    id: "3",
    title: "Random Fire",
    thumbnail: "/thumbnails/demo-img3.png",
    videoUrl: "/videos/demo-vid3.mp4", 
    duration: "0:10",
  },
  {
    id: "4",
    title: "Fireworks",
    thumbnail: "/thumbnails/demo-img4.png",
    videoUrl: "/videos/demo-vid4.mp4", 
    duration: "0:13",
  },
  {
    id: "5",
    title: "Dude on a car",
    thumbnail: "/thumbnails/demo-img5.png",
    videoUrl: "/videos/demo-vid5.mp4",
    duration: "0:14",
  },
  {
    id: "6",
    title: "Car - Meow :3",
    thumbnail: "/thumbnails/demo-img6.png",
    videoUrl: "/videos/demo-vid6.mp4", 
    duration: "0:06",
  },
]

export function GalleryShowcase() {
  const [selectedVideo, setSelectedVideo] = useState<GalleryVideo | null>(null)

  const handleVideoClick = (video: GalleryVideo) => {
    setSelectedVideo(video)
  }

  const closeModal = () => {
    setSelectedVideo(null)
  }

  return (
    <>
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">Gallery Showcase</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleVideos.map((video) => (
              <div
                key={video.id}
                className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
                onClick={() => handleVideoClick(video)}
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-muted">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-primary/90 hover:bg-primary text-primary-foreground rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-6 h-6 ml-1" />
                    </button>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player */}
            <video
              controls
              autoPlay
              className="w-full h-auto max-h-[70vh]"
              poster={selectedVideo.thumbnail}
            >
              <source src={selectedVideo.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video Info */}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-foreground">
                {selectedVideo.title}
              </h3>
              <p className="text-muted-foreground mt-1">
                Duration: {selectedVideo.duration}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}