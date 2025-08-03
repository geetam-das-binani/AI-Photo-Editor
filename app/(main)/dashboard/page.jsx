"use client";

import { api } from "@/convex/_generated/api";

import { useConvexQuery } from "@/app/hooks/use-convex-query";
import React, { useState } from "react";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import NewProjectModal from "./_components/NewProjectModal";

const Dashboard = () => {
  const { data: projects, isLoading } = useConvexQuery(
    api.projects.getUserProjects
  );
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  return (
    <div className="min-h-screen pb-16 pt-32">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Your Projects
            </h1>
            <p className="text-white/70">
              Create and manage your AI-powered image designs
            </p>
          </div>
          <Button
            onClick={() => setShowNewProjectModal(true)}
            className="gap-2"
            size="lg"
            variant="primary"
          >
            <Plus className="h-5 w-5" />
            New Project
          </Button>
        </div>

        {isLoading ? (
          <BarLoader width={"100%"} color="white" />
        ) : projects && projects.length > 0 ? (
          <></>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-2xl font-semibold text-white mb-3">
              Create Your First Project
            </h3>
            <p className="text-white/70 mb-8 max-w-md">
              Upload an image to start editing with our powerful AI tools
            </p>
            <Button
              onClick={() => setShowNewProjectModal(true)}
              className="gap-2"
              size="xl"
              variant="primary"
            >
              <Sparkles className="h-5 w-5" />
              Start Creating
            </Button>
          </div>
        )}

        <NewProjectModal
          isOpen={showNewProjectModal}
          onClose={() => setShowNewProjectModal(false)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
