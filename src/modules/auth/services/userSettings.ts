import { db } from "@/lib/firebase";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

export type UserSettings = {
  activeScopeId: string | null;
};

export async function setActiveScopeId(uid: string, scopeId: string | null) {
  const ref = doc(db, "userSettings", uid);
  await setDoc(
    ref,
    {
      activeScopeId: scopeId ?? null,
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
        onChange({ activeScopeId: null });
        return;
      }
      const data = snap.data() as { activeScopeId?: string | null };
      onChange({ activeScopeId: data.activeScopeId ?? null });
    },
    (err) => onError?.(err)
  );
}
