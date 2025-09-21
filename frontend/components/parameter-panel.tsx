"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Settings } from "lucide-react"
import type { VideoParams } from "@/app/page"

interface ParameterPanelProps {
  params: VideoParams
  onParamsChange: (params: VideoParams) => void
}

export function ParameterPanel({ params, onParamsChange }: ParameterPanelProps) {
  const updateParam = (key: keyof VideoParams, value: number | null) => {
    onParamsChange({
      ...params,
      [key]: value,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Processing Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fps">Frame Rate (FPS)</Label>
          <p className="text-xs text-muted-foreground">Controls output video smoothness</p>
          <div className="space-y-2">
            <Slider
              id="fps"
              min={15}
              max={120}
              step={1}
              value={[params.fps ?? 30]}
              onValueChange={(value) => updateParam("fps", value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>15</span>
              <span className="font-medium">{params.fps ?? 30} FPS</span>
              <span>120</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pts_per_beat">Effect Density</Label>
          <p className="text-xs text-muted-foreground">How many effects appear per beat</p>
          <div className="space-y-2">
            <Slider
              id="pts_per_beat"
              min={1}
              max={16}
              step={1}
              value={[params.pts_per_beat]}
              onValueChange={(value) => updateParam("pts_per_beat", value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span className="font-medium">{params.pts_per_beat} per beat</span>
              <span>16</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="life_frames">Effect Duration</Label>
          <p className="text-xs text-muted-foreground">How long each effect stays visible</p>
          <div className="space-y-2">
            <Slider
              id="life_frames"
              min={30}
              max={300}
              step={10}
              value={[params.life_frames]}
              onValueChange={(value) => updateParam("life_frames", value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30</span>
              <span className="font-medium">{params.life_frames} frames</span>
              <span>300</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="min_size">Minimum Shape Size</Label>
          <p className="text-xs text-muted-foreground">Controls minimum size of shapes</p>
          <div className="space-y-2">
            <Slider
              id="min_size"
              min={5}
              max={50}
              step={1}
              value={[params.min_size]}
              onValueChange={(value) => updateParam("min_size", value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5</span>
              <span className="font-medium">{params.min_size}px</span>
              <span>50</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_size">Maximum Shape Size</Label>
          <p className="text-xs text-muted-foreground">Controls maximum size of shapes</p>
          <div className="space-y-2">
            <Slider
              id="max_size"
              min={50}
              max={200}
              step={5}
              value={[params.max_size]}
              onValueChange={(value) => updateParam("max_size", value[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50</span>
              <span className="font-medium">{params.max_size}px</span>
              <span>200</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}