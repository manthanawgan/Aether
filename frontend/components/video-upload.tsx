"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Video, Loader2 } from "lucide-react"

interface VideoUploadProps {
  selectedFile: File | null
  onFileSelect: (file: File | null) => void
  onProcess: () => void
  isProcessing: boolean
}

export function VideoUpload({ selectedFile, onFileSelect, onProcess, isProcessing }: VideoUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
    },
    multiple: false,
  })

  const handleRemoveFile = () => {
    onFileSelect(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Upload Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedFile ? (
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-accent/50"
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? "Drop your video here" : "Drag & drop your video"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
            <p className="text-xs text-muted-foreground">Supports MP4, MOV, AVI, MKV, WebM formats</p>
          </div>
        ) : (
          <div className="border border-border rounded-lg p-4 bg-accent/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Video className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleRemoveFile} disabled={isProcessing}>
                Remove
              </Button>
            </div>
          </div>
        )}

        <Button onClick={onProcess} disabled={!selectedFile || isProcessing} className="w-full" size="lg">
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
