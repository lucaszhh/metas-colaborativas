import { useScopeMutations } from "@/modules/scopes/hooks/useScopeMutations";

export function useCreateScope() {
  const { createScope } = useScopeMutations();
  return createScope;
}
