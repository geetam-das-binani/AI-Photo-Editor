import { useConvexMutation } from "@/app/hooks/use-convex-query";
import { useCanvas } from "@/context/context";
import { api } from "@/convex/_generated/api";
import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";
const CanvasEditor = ({ project }) => {
  const canvasRef = useRef();
  const containerRef = useRef();
  const [loading, setLoading] = useState(true);
  const { activeTool, onToolChange, canvasEditor, setCanvasEditor } =
    useCanvas();
  const { mutate: updateProject } = useConvexMutation(
    api.projects.updateProject
  );

  function calculateViewPortScale() {
    if (!containerRef.current || !project) return;
    const container = containerRef.current;
    const containerWidth = container.clientWidth - 40;
    const containerHeight = container.clientHeight - 40;

    const scaleX = containerWidth / project.width;
    const scaleY = containerHeight / project.height;
    const scale = Math.min(scaleX, scaleY, 1);
    return scale;
  }

  useEffect(() => {
    if (!canvasRef.current || !project || canvasEditor) return;

    const initializeCanvas = async () => {
      setLoading(true);
      const viewportScale = calculateViewPortScale();
      const canvas = new Canvas(canvasRef.current, {
        width: project.width,
        height: project.height,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
        controlsAboveOverlay: true,
        selection: true,
        hoverCursor: "move",
        moveCursor: "move",
        defaultCursor: "default",
        allowTouchScrolling: false,
        renderOnAddRemove: true,
        skipTargetFind: false,
      });

      canvas.setDimensions(
        {
          width: project.width * viewportScale,
          height: project.height * viewportScale,
        },
        { backstoreOnly: false }
      );
      canvas.setZoom(viewportScale);

      const scaleFactor = window.devicePixelRatio || 1;
      if (scaleFactor > 1) {
        canvas.getElement().width = project.width * scaleFactor;
        canvas.getElement().height = project.height * scaleFactor;
        canvas.getContext().scale(scaleFactor, scaleFactor);
      }

      if(project.currentImageUrl || project.originalImageUrl){

      }try {
        
      } catch (error) {
        
      }


    };
  }, [project]);
  return (
    <div
      className="relative flex justify-center items-center bg-secondary w-full h-full overflow-hidden"
      ref={containerRef}
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #64748b 25%, transparent 25%),
            linear-gradient(-45deg, #64748b 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #64748b 75%),
            linear-gradient(-45deg, transparent 75%, #64748b 75%)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <p className="text-white/70 text-sm">Loading canvas...</p>
          </div>
        </div>
      )}
      <div className="px-5">
        <canvas ref={canvasRef} id="canvas" className="border" />
      </div>
    </div>
  );
};

export default CanvasEditor;
