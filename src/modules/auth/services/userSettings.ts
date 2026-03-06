import { db } from "@/lib/firebase";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

export type UserSettings = {
  activeWorkspaceId: string | null;
};

export async function setActiveWorkspaceId(uid: string, workspaceId: string | null) {
  const ref = doc(db, "userSettings", uid);
  await setDoc(
    ref,
    {
      activeWorkspaceId: workspaceId ?? null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function subscribeUserSettings(params: {
  uid: string;
  onChange: (settings: UserSettings) => void;
  onError?: (e: unknown) => void;
}) {
  const { uid, onChange, onError } = params;
  const ref = doc(db, "userSettings", uid);

  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onChange({ activeWorkspaceId: null });
        return;
      }
      const data = snap.data() as { activeWorkspaceId?: string | null };
      onChange({ activeWorkspaceId: data.activeWorkspaceId ?? null });
    },
    (err) => {
      console.error("[userSettings] snapshot error:", err);
      onError?.(err);
    }
  );
}
