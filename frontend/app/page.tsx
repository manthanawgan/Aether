"use client"

import { useState } from "react"
import { Github } from "lucide-react"
import { VideoUpload } from "@/components/video-upload"
import { ParameterPanel } from "@/components/parameter-panel"
import { ProcessingResult } from "@/components/processing-result"
import { GalleryShowcase } from "@/components/gallery-showcase"

export interface VideoParams {
  fps: number
  life_frames: number
  pts_per_beat: number
  min_size: number
  max_size: number
}

const defaultParams: VideoParams = {
  fps: 30,
  life_frames: 120,
  pts_per_beat: 4,
  min_size: 10,
  max_size: 100,
}

export default function VideoProcessor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [params, setParams] = useState<VideoParams>(defaultParams)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ downloadUrl?: string; error?: string } | null>(null)

  const handleProcess = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      // Add parameters as JSON fields
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })

      const response = await fetch("/process", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Processing failed: ${response.statusText}`)
      }

      const blob = await response.blob()
      const downloadUrl = URL.createObjectURL(blob)
      setResult({ downloadUrl })
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : "Processing failed" })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Video Processor</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Upload and process your videos with custom parameters
              </p>
            </div>
            <a
              href="https://github.com/yourusername/video-processor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">Repository</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload & Generate */}
          <div className="space-y-6">
            <VideoUpload
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              onProcess={handleProcess}
              isProcessing={isProcessing}
            />

            {result && (
              <ProcessingResult downloadUrl={result.downloadUrl} error={result.error} filename={selectedFile?.name} />
            )}
          </div>

          {/* Right Panel - Parameters */}
          <div>
            <ParameterPanel params={params} onParamsChange={setParams} />
          </div>
        </div>
      </main>

      {/* Gallery Showcase */}
      <GalleryShowcase />
    </div>
  )
}
