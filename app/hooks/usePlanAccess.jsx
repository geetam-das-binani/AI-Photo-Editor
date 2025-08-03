import { useAuth } from "@clerk/nextjs";

export function usePlanAccess() {
  const { has } = useAuth();
  const isPro = has?.({ plan: "pro" }) || false;
  const isFree = !isPro;

  const planAccess = {
    //Free plan tools
    resize: true,
    crop: true,
    adjust: true,
    text: true,

    // Pro Plan Tools
    background: isPro,
    ai_extender: isPro,
    ai_edit: isPro,
  };

  const hasAccess = (toolId) => {
    return planAccess[toolId] === true;
  };

  const getRestrictedTools = () => {
    return Object.keys(planAccess).filter((toolId) => !hasAccess(toolId));
  };

  const canCreateProject = (currentProjectCount) => {
    if (isPro) return true;
    return currentProjectCount < 3;
  };

  const canExport = (currentExportsThisMonth) => {
    if (isPro) return true;
    return currentExportsThisMonth < 20;
  };

  return {
    userPlan: isPro ? "pro" : "free_user",
    isPro,
    isFree,
    hasAccess,
    planAccess,
    getRestrictedTools,
    canCreateProject,
    canExport,
  };
}
