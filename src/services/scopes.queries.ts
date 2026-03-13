import { db } from "@/lib/firebase";
import { collectionGroup, doc, onSnapshot, query, where } from "firebase/firestore";

export type ScopeSummary = {
  id: string;
  name: string;
  ownerId?: string;
};

export function subscribeMyScopes(params: {
  uid: string;
  onChange: (scopes: ScopeSummary[]) => void;
  onError?: (e: unknown) => void;
}) {
  const { uid, onChange, onError } = params;

  const scopesById = new Map<string, ScopeSummary>();
  const scopeUnsubs = new Map<string, () => void>();
  let order: string[] = [];

  const emit = () => {
    const scopes = order.map((id) => scopesById.get(id)).filter(Boolean) as ScopeSummary[];
    onChange(scopes);
  };

  const membersQuery = query(collectionGroup(db, "members"), where("uid", "==", uid));
  const membersUnsub = onSnapshot(
    membersQuery,
    (snap) => {
      const ids = snap.docs.map((d) => d.ref.parent.parent?.id).filter(Boolean) as string[];
      order = Array.from(new Set(ids));

      for (const [id, unsub] of scopeUnsubs) {
        if (!order.includes(id)) {
          unsub();
          scopeUnsubs.delete(id);
          scopesById.delete(id);
        }
      }

      for (const id of order) {
        if (scopeUnsubs.has(id)) continue;

        if (!scopesById.has(id)) {
          scopesById.set(id, { id, name: "Ambito sin nombre" });
        }

        const unsub = onSnapshot(
          doc(db, "scopes", id),
          (docSnap) => {
            if (!docSnap.exists()) {
              scopesById.delete(id);
              emit();
              return;
            }
            const data = docSnap.data() as { name?: string; ownerId?: string };
            scopesById.set(id, {
              id: docSnap.id,
              name: data.name ?? "Ambito sin nombre",
              ownerId: data.ownerId,
            });
            emit();
          },
          (err) => onError?.(err)
        );

        scopeUnsubs.set(id, unsub);
      }

      emit();
    },
    (err) => onError?.(err)
  );

  return () => {
    membersUnsub();
    for (const unsub of scopeUnsubs.values()) unsub();
  };
}
