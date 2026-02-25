import { db } from "@/lib/firebase";
import { collectionGroup, doc, onSnapshot, query, where } from "firebase/firestore";

export type WorkspaceSummary = {
  id: string;
  name: string;
  ownerId?: string;
};

export function subscribeMyWorkspaces(params: {
  uid: string;
  onChange: (workspaces: WorkspaceSummary[]) => void;
  onError?: (e: unknown) => void;
}) {
  const { uid, onChange, onError } = params;

  const workspacesById = new Map<string, WorkspaceSummary>();
  const workspaceUnsubs = new Map<string, () => void>();
  let order: string[] = [];

  const emit = () => {
    const list = order.map((id) => workspacesById.get(id)).filter(Boolean) as WorkspaceSummary[];
    onChange(list);
  };

  const membersQuery = query(collectionGroup(db, "members"), where("uid", "==", uid));
  const membersUnsub = onSnapshot(
    membersQuery,
    (snap) => {
      const ids = snap.docs.map((d) => d.ref.parent.parent?.id).filter(Boolean) as string[];
      order = Array.from(new Set(ids));

      for (const [id, unsub] of workspaceUnsubs) {
        if (!order.includes(id)) {
          unsub();
          workspaceUnsubs.delete(id);
          workspacesById.delete(id);
        }
      }

      for (const id of order) {
        if (workspaceUnsubs.has(id)) continue;

        if (!workspacesById.has(id)) {
          workspacesById.set(id, { id, name: "Workspace sin nombre" });
        }

        const unsub = onSnapshot(
          doc(db, "workspaces", id),
          (docSnap) => {
            if (!docSnap.exists()) {
              workspacesById.delete(id);
              emit();
              return;
            }
            const data = docSnap.data() as { name?: string; ownerId?: string };
            workspacesById.set(id, {
              id: docSnap.id,
              name: data.name ?? "Workspace sin nombre",
              ownerId: data.ownerId,
            });
            emit();
          },
          (err) => onError?.(err)
        );

        workspaceUnsubs.set(id, unsub);
      }

      emit();
    },
    (err) => onError?.(err)
  );

  return () => {
    membersUnsub();
    for (const unsub of workspaceUnsubs.values()) unsub();
  };
}
