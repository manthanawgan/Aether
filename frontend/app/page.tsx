"use client"

import { useState } from "react"
import { Github } from "lucide-react"
import { VideoUpload } from "@/components/video-upload"
import { ParameterPanel } from "@/components/parameter-panel"
import { ProcessingResult } from "@/components/processing-result"
import { GalleryShowcase } from "@/components/gallery-showcase"

export interface VideoParams {
  fps: number | null
  life_frames: number
  pts_per_beat: number
  ambient_rate: number
  jitter_px: number
  min_size: number
  max_size: number
  neighbor_links: number
  orb_fast_threshold: number
  bell_width: number
  seed: number | null
}

interface ProcessResult {
  success?: boolean
  message?: string
  process_id?: string
  filename?: string
  original_filename?: string
  file_size?: number
  preview_url?: string
  download_url?: string
  error?: string
}

const defaultParams: VideoParams = {
  fps: 30,
  life_frames: 120,
  pts_per_beat: 20,
  ambient_rate: 5.0,
  jitter_px: 0.5,
  min_size: 15,
  max_size: 40,
  neighbor_links: 3,
  orb_fast_threshold: 20,
  bell_width: 4.0,
  seed: null
}

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://aether-rhythm.onrender.com'
  : 'http://localhost:8000'



export default function VideoProcessor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [params, setParams] = useState<VideoParams>(defaultParams)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [result, setResult] = useState<ProcessResult | null>(null)

  const handleProcess = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("params", JSON.stringify(params))

      console.log("Processing video:", selectedFile.name)
      console.log("Parameters:", params)

      try {
        const healthCheck = await fetch(`${API_BASE_URL}/`, {
          method: "GET",
          mode: 'cors',
        })
        
        if (!healthCheck.ok) {
          throw new Error("Server is not responding")
        }
        console.log("Server is reachable")
      } catch (serverError) {
        throw new Error("Cannot connect to server. Make sure the FastAPI server is running on port 8000")
      }

      const response = await fetch(`${API_BASE_URL}/`, {
        method: "POST",
        body: formData,
        mode: 'cors',
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Processing failed: ${response.status} - ${errorText}`)
      }

      // Parse JSON response with process info
      const processResult = await response.json()
      console.log("Process result:", processResult)

      if (processResult.success && processResult.process_id) {
        setResult(processResult)
      } else {
        throw new Error(processResult.message || "Processing failed")
      }
      
    } catch (error) {
      console.error("Processing error:", error)
      setResult({ 
        error: error instanceof Error ? error.message : "Processing failed" 
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = async () => {
    if (!result?.process_id) return

    setIsDownloading(true)

    try {
      console.log("Downloading file with process_id:", result.process_id)

      const response = await fetch(`${API_BASE_URL}/download/${result.process_id}`, {
        method: "GET",
        mode: 'cors',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Download failed: ${response.status} - ${errorText}`)
      }

      const blob = await response.blob()
      console.log("Downloaded blob size:", blob.size)

      const downloadUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = result.filename || 'processed_video.mp4'
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(downloadUrl)
      }, 1000)

      console.log("Download completed successfully")
      
    } catch (error) {
      console.error("Download error:", error)
      setResult({ 
        ...result,
        error: error instanceof Error ? error.message : "Download failed" 
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDelete = async () => {
    if (!result?.process_id) return

    setIsDeleting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/delete/${result.process_id}`, {
        method: "DELETE",
        mode: 'cors',
      })

      if (response.ok) {
        setResult(null) // Clear the result completely
        console.log("File deleted successfully")
      } else {
        const errorText = await response.text()
        console.error("Delete failed:", response.status, errorText)
        throw new Error(`Delete failed: ${response.status}`)
      }
    } catch (error) {
      console.error("Delete error:", error)
      setResult({ 
        ...result,
        error: error instanceof Error ? error.message : "Failed to delete file" 
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const   viewUrl = () => {
    if (!result?.process_id) return undefined
    return `${API_BASE_URL}/preview/${result.process_id}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Aether :/ </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Apply Rhythm-based visual effects to your videos - Preview & Download
              </p>
            </div>
            <a
              href="https://github.com/manthanawgan/Aether"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">Github</span>
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
              <ProcessingResult 
                error={result.error}
                filename={selectedFile?.name}
                processResult={result}
                onDownload={handleDownload}
                onDelete={handleDelete}
                isDownloading={isDownloading}
                isDeleting={isDeleting}
                previewUrl={getPreviewUrl()}
              />
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