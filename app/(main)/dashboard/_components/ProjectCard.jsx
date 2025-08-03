import { useConvexMutation } from "@/app/hooks/use-convex-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const ProjectCard = ({ project, onEdit = () => {} }) => {
  const { mutate: deleteProject, isLoading } = useConvexMutation(
    api.projects.deleteProject
  );

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;
    try {
      await deleteProject({ projectId: project._id });
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error(error);
    }
  };

  const lastUpdated = formatDistanceToNow(new Date(project.updatedAt), {
    addSuffix: true,
  });
  return (
    <Card className="py-0 group relative bg-slate-800/50 oveflow-hidden hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02]">
      <div className="aspect-video overflow-hidden relative">
        {project?.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          ""
        )}
      </div>
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
        <Button
          variant={"glass"}
          size={"sm"}
          onClick={onEdit}
          className={"gap-2"}
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant={"glass"}
          size={"sm"}
          onClick={handleDelete}
          className={"gap-2 text-red-400 hover:text-red-300"}
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
      <CardContent className={"pb-6"}>
        <h3 className="font-semibold text-white mb-1 truncate">
          {project?.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>Updated {lastUpdated}</span>
          <Badge
            variant={"secondary"}
            className={"text-xs bg-slate-700 text-white/70"}
          >
            {project?.width} x {project?.height}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
