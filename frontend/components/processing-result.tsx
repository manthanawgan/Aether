"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, CheckCircle, AlertCircle } from "lucide-react"

interface ProcessingResultProps {
  downloadUrl?: string
  error?: string
  filename?: string
}

export function ProcessingResult({ downloadUrl, error, filename }: ProcessingResultProps) {
  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `processed_${filename || "video.mp4"}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (downloadUrl) {
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
            <video src={downloadUrl} controls className="w-full max-h-64 bg-black" preload="metadata">
              Your browser does not support the video tag.
            </video>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
