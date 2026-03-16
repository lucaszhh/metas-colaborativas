import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

export type UserSettings = {
  activeScopeId: string | null;
  defaultRolesSeedVersion: number | null;
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

export async function getUserSettings(uid: string): Promise<UserSettings> {
  const ref = doc(db, "userSettings", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return {
      activeScopeId: null,
      defaultRolesSeedVersion: null,
    };
  }

  const data = snap.data() as {
    activeScopeId?: string | null;
    defaultRolesSeedVersion?: number | null;
  };

  return {
    activeScopeId: data.activeScopeId ?? null,
    defaultRolesSeedVersion: data.defaultRolesSeedVersion ?? null,
  };
}

export async function markDefaultRolesSeeded(params: {
  uid: string;
  version: number;
  activeScopeId?: string | null;
}) {
  const { uid, version, activeScopeId } = params;
  const ref = doc(db, "userSettings", uid);

  await setDoc(
    ref,
    {
      ...(activeScopeId === undefined ? {} : { activeScopeId }),
      defaultRolesSeedVersion: version,
      defaultRolesSeededAt: serverTimestamp(),
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
        onChange({
          activeScopeId: null,
          defaultRolesSeedVersion: null,
        });
        return;
      }
      const data = snap.data() as {
        activeScopeId?: string | null;
        defaultRolesSeedVersion?: number | null;
      };
      onChange({
        activeScopeId: data.activeScopeId ?? null,
        defaultRolesSeedVersion: data.defaultRolesSeedVersion ?? null,
      });
    },
    (err) => onError?.(err)
  );
}
