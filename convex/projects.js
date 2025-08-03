import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const create = mutation({
  args: {
    title: v.string(),
    originalImageUrl: v.optional(v.string()),
    currentImageUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    canvasState: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    if (user.plan === "free") {
      const projectCount = await ctx.db
        .query("projects")
        .withIndex("by_users", (q) => q.eq("userId", user._id))
        .collect();

      if (projectCount.length >= 3) {
        throw new Error(
          "Free Plan limited to 3 Projects. Upgrade to Pro for unlimited projects."
        );
      }
    }
    const projectId = await ctx.db.insert("projects", {
      title: args.title,
      userId: user._id,
      originalImageUrl: args.originalImageUrl,
      currentImageUrl: args.currentImageUrl,
      thumbnailUrl: args.thumbnailUrl,
      width: args.width,
      height: args.height,
      canvasState: args.canvasState,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await ctx.db.patch(user._id, {
      projectsUsed: user.projectsUsed + 1,
      lastActiveAt: Date.now(),
    });

    return projectId;
  },
});

export const getUserProjects = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user_updated", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
    return projects;
  },
});

export const deleteProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    if (!user || project.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.projectId);
    await ctx.db.patch(user._id, {
      projectsUsed: Math.max(0, user.projectsUsed - 1),
      lastActiveAt: Date.now(),
    });

    return { success: true };
  },
});

export const getProject = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    if (!user || project.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    return project;
  },
});

export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    canvasState: v.optional(v.any()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    currentImageUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    activeTransformations: v.optional(v.string()),
    backgroundRemoved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    if (!user || project.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    const updatedFields = {
      updatedAt: Date.now(),
    };
    if (args.canvasState !== undefined) {
      updatedFields.canvasState = args.canvasState;
    }
    if (args.width !== undefined) {
      updatedFields.width = args.width;
    }
    if (args.height !== undefined) {
      updatedFields.height = args.height;
    }
    if (args.currentImageUrl !== undefined) {
      updatedFields.currentImageUrl = args.currentImageUrl;
    }
    if (args.thumbnailUrl !== undefined) {
      updatedFields.thumbnailUrl = args.thumbnailUrl;
    }
    if (args.activeTransformations !== undefined) {
      updatedFields.activeTransformations = args.activeTransformations;
    }
    if (args.backgroundRemoved !== undefined) {
      updatedFields.backgroundRemoved = args.backgroundRemoved;
    }
    await ctx.db.patch(args.projectId, updatedFields);

    await ctx.db.patch(user._id, {
      lastActiveAt: Date.now(),
    });

    return args.projectId;
  },
});
