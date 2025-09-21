"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, CheckCircle, AlertCircle, FileVideo, Trash2, Eye } from "lucide-react"

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

interface ProcessingResultProps {
  downloadUrl?: string
  error?: string
  filename?: string
  success?: boolean
  message?: string
  processResult?: ProcessResult
  onDownload?: () => void
  onDelete?: () => void
  isDownloading?: boolean
  isDeleting?: boolean
  previewUrl?: string
}

const formatFileSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

export function ProcessingResult({ 
  downloadUrl, 
  error, 
  filename, 
  success, 
  message,
  processResult,
  onDownload,
  onDelete,
  isDownloading = false,
  previewUrl
}: ProcessingResultProps) {
  

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <br />
          <span className="text-xs text-muted-foreground mt-1 block">
            Make sure the backend server is running on port 8000
          </span>
        </AlertDescription>
      </Alert>
    )
  }


  if (processResult?.success && processResult.process_id) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            Processing Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-green-700 dark:text-green-300">
            {processResult.message}
          </p>

          {/* File Info */}
          <div className="space-y-2">
            {processResult.filename && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileVideo className="h-4 w-4" />
                <span>{processResult.filename}</span>
              </div>
            )}
            {processResult.file_size && (
              <p className="text-sm text-muted-foreground">
                Size: {formatFileSize(processResult.file_size)}
              </p>
            )}
          </div>

          {/* Video Preview */}
          {previewUrl && (
            <div className="border border-border rounded-lg overflow-hidden bg-black">
              <video 
                src={previewUrl} 
                controls 
                className="w-full max-h-64" 
                preload="metadata"
                controlsList="nodownload"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={onDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? "Downloading..." : "Download"}
            </Button>

            <Button
              onClick={onDelete}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>• Preview the video above before downloading</p>
            <p>• Click "Download" to save to your Downloads folder</p>
            <p>• Click "Delete" to remove from server</p>
          </div>
        </CardContent>
      </Card>
    )
  }


  if (success && message) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            Success!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700 dark:text-green-300">{message}</p>
        </CardContent>
      </Card>
    )
  }


  if (downloadUrl) {
    const handleDownload = () => {
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `processed_${filename || "video.mp4"}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Processing Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your video has been processed successfully. Click below to download.
          </p>

          <Button onClick={handleDownload} className="w-full" size="lg">
            <Download className="h-4 w-4 mr-2" />
            Download Processed Video
          </Button>

          {/* Video Preview */}
          <div className="border border-border rounded-lg overflow-hidden">
            <video 
              src={downloadUrl} 
              controls 
              className="w-full max-h-64 bg-black" 
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}