"use client"

import { Play } from "lucide-react"

interface GalleryVideo {
  id: string
  title: string
  thumbnail: string
  videoUrl: string
  duration: string
}

// Sample gallery videos - replace with your actual video data
const sampleVideos: GalleryVideo[] = [
  {
    id: "1",
    title: "Abstract Waves",
    thumbnail: "/abstract-colorful-waves-video-thumbnail.jpg",
    videoUrl: "#",
    duration: "0:45",
  },
  {
    id: "2",
    title: "Geometric Patterns",
    thumbnail: "/geometric-patterns-video-thumbnail.jpg",
    videoUrl: "#",
    duration: "1:20",
  },
  {
    id: "3",
    title: "Particle Effects",
    thumbnail: "/particle-effects-video-thumbnail.jpg",
    videoUrl: "#",
    duration: "0:58",
  },
  {
    id: "4",
    title: "Color Burst",
    thumbnail: "/colorful-burst-effects-video-thumbnail.jpg",
    videoUrl: "#",
    duration: "1:05",
  },
  {
    id: "5",
    title: "Fluid Motion",
    thumbnail: "/fluid-motion-graphics-video-thumbnail.jpg",
    videoUrl: "#",
    duration: "0:52",
  },
  {
    id: "6",
    title: "Digital Art",
    thumbnail: "/digital-art-video-thumbnail.jpg",
    videoUrl: "#",
    duration: "1:15",
  },
]

export function GalleryShowcase() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">Gallery Showcase</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleVideos.map((video) => (
            <div
              key={video.id}
              className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
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
  )
}
