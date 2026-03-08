import { useWorkspaceMutations } from "@/modules/workspaces/hooks/useWorkspaceMutations";

export function useCreateWorkspace() {
  const { createWorkspace } = useWorkspaceMutations();
  return createWorkspace;
}
