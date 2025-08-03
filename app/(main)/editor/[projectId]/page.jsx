"use client";
import { useConvexQuery } from "@/app/hooks/use-convex-query";
import { CanvasContext } from "@/context/context";
import { api } from "@/convex/_generated/api";
import { Loader2, Monitor } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { RingLoader } from "react-spinners";
import Canvas from "./_components/canvas";

const Editor = () => {
  const { projectId } = useParams();
  const [canvasEditor, setCanvasEditor] = useState(null);
  const [processingMessage, setProcessingMessage] = useState(null);
  const [activeTool, setActiveTool] = useState("resize");
  const {
    data: project,
    isLoading,
    error,
  } = useConvexQuery(api.projects.getProject, { projectId });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text=2xl font-bold text-white mb-2">
            Project Not Found
          </h1>
          <p className="text-white/70">
            The project you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }
  return (
    <CanvasContext.Provider
      value={{
        activeTool,
        onToolChange: setActiveTool,
        canvasEditor,
        setCanvasEditor,
        processingMessage,
        setProcessingMessage,
      }}
    >
      <div className="lg:hidden min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Monitor className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Desktop Required
          </h1>
          <p className="text-white/70 text-lg mb-2">
            This editor is only usable on desktop.
          </p>
          <p className="text-white/50 text-sm">
            Please use a larger screen to access the full editing experience.
          </p>
        </div>
      </div>

      <div className="hidden lg:block min-h-screen bg-slate-900">
        <div className="flex flex-col h-screen">
          {processingMessage ? (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center">
              <div className="rounded-lg p-6 flex flex-col items-center gap-4">
                <RingLoader color="#fff" />
                <div className="text-center">
                  <p className="text-white font-medium">{processingMessage}</p>
                  <p className="text-white/70 text-sm mt-1">
                    Please wait, do no switch tabs or navigate away.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {/* top bar  */}
          <div className="flex flex-1 overflow-hidden">
            {/* sidebar */}

            <div className="flex-1 bg-slate-800">
              {/* canvas  */}
              <Canvas project={project} />
            </div>
          </div>
        </div>
      </div>
    </CanvasContext.Provider>
  );
};

export default Editor;
