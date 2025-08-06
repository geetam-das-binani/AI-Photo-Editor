import { useConvexMutation } from "@/app/hooks/use-convex-query";
import { useCanvas } from "@/context/context";
import React, { useState, useEffect } from "react";
import { Expand, Lock, Unlock, Monitor } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ASPECT_RATIOS = [
  { name: "Instagram Story", ratio: [9, 16], label: "9:16" },
  { name: "Instagram Post", ratio: [1, 1], label: "1:1" },
  { name: "Youtube Thumbnail", ratio: [16, 9], label: "16:9" },
  { name: "Portrait", ratio: [2, 3], label: "2:3" },
  { name: "Facebook Cover", ratio: [851, 315], label: "2.7:1" },
  { name: "Twitter Header", ratio: [3, 1], label: "3:1" },
];

const ResizeControls = ({ project }) => {
  const { canvasEditor, processingMessage, setProcessingMessage } = useCanvas();
  const [newWidth, setNewWidth] = useState(project?.width || 800);
  const [newHeight, setNewHeight] = useState(project?.height || 600);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const {
    mutate: updateProject,
    data,
    isLoading,
  } = useConvexMutation(api.projects.updateProject);
  
  if (!canvasEditor || !project) {
    return (
      <div className="p-4">
        <p className="text-white/70 text-sm">Canvas not ready</p>
      </div>
    );
  }

  const hasChanges = newWidth !== project.width || newHeight !== project.height;
  return (
    <div className="space-y-6">
      {/* <div className="bg-slate-700/30 rounded-lg p-3">
        <h4 className="text-sm font-medium text-white mb-2">Current Size</h4>
        <div className="text-xs text-white/70">
          {project.width} × {project.height} pixels
        </div>
      </div> */}

      {/* <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white">Custom Size</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLockAspectRatio(!lockAspectRatio)}
            className="text-white/70 hover:text-white p-1"
          >
            {lockAspectRatio ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Unlock className="h-4 w-4" />
            )}
          </Button>
        </div>
        </div> */}

      {/* <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-white/70 mb-1 block">Width</label>
            <Input
              type="number"
              value={newWidth}
              onChange={(e) => handleWidthChange(e.target.value)}
              min="100"
              max="5000"
              className="bg-slate-700 border-white/20 text-white"
            />
          </div>
          <div>
            <label className="text-xs text-white/70 mb-1 block">Height</label>
            <Input
              type="number"
              value={newHeight}
              onChange={(e) => handleHeightChange(e.target.value)}
              min="100"
              max="5000"
              className="bg-slate-700 border-white/20 text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-white/70">
            {lockAspectRatio ? "Aspect ratio locked" : "Free resize"}
          </span>
        </div>
      </div> */}

      {/* 
  <div className="space-y-3">
        <h3 className="text-sm font-medium text-white">Aspect Ratios</h3>
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
          {ASPECT_RATIOS.map((aspectRatio) => {
            const dimensions = calculateAspectRatioDimensions(
              aspectRatio.ratio
            );
            return (
              <Button
                key={aspectRatio.name}
                variant={
                  selectedPreset === aspectRatio.name ? "default" : "outline"
                }
                size="sm"
                onClick={() => applyAspectRatio(aspectRatio)}
                className={`justify-between h-auto py-2 ${
                  selectedPreset === aspectRatio.name
                    ? "bg-cyan-500 hover:bg-cyan-600"
                    : "text-left"
                }`}
              >
                <div>
                  <div className="font-medium">{aspectRatio.name}</div>
                  <div className="text-xs opacity-70">
                    {dimensions.width} × {dimensions.height} (
                    {aspectRatio.label})
                  </div>
                </div>
                <Monitor className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </div> */}

      {/* {hasChanges && (
        <div className="bg-slate-700/30 rounded-lg p-3">
          <h4 className="text-sm font-medium text-white mb-2">
            New Size Preview
          </h4>
          <div className="text-xs text-white/70">
            <div>
              New Canvas: {newWidth} × {newHeight} pixels
            </div>
            <div className="text-cyan-400">
              {newWidth > project.width || newHeight > project.height
                ? "Canvas will be expanded"
                : "Canvas will be cropped"}
            </div>
            <div className="text-white/50 mt-1">
              Objects will maintain their current size and position
            </div>
          </div>
        </div>
      )} */}

      {/* <Button
        onClick={handleApplyResize}
        disabled={!hasChanges || processingMessage}
        className="w-full"
        variant="primary"
      >
        <Expand className="h-4 w-4 mr-2" />
        Apply Resize
      </Button> */}

      <div className="bg-slate-700/30 rounded-lg p-3">
        <p className="text-xs text-white/70">
          <strong>Resize Canvas:</strong> Changes canvas dimensions.
          <br />
          <strong>Aspect Ratios:</strong> Smart sizing based on your current
          canvas.
          <br />
          Objects maintain their size and position.
        </p>
      </div>
    </div>
  );
};

export default ResizeControls;
