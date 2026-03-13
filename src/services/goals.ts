import { db } from "@/lib/firebase";
import { deleteDocumentRefs } from "@/lib/firestore-helpers";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export type RoleDoc = {
  id: string;
  title: string;
  createdBy: string;
};

export type GoalStatus = "open" | "close";

export type GoalDoc = {
  id: string;
  roleId: string;
  title: string;
  status: GoalStatus;
  createdBy: string;
  description?: string;
};

export function subscribeRoles(params: {
  scopeId: string;
  onChange: (roles: RoleDoc[]) => void;
  onError?: (e: unknown) => void;
}) {
  const { scopeId, onChange, onError } = params;

  const q = query(
    collection(db, "scopes", scopeId, "roles"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<RoleDoc, "id">),
      }));
      onChange(data);
    },
    (err) => onError?.(err)
  );
}

export function subscribeGoalsByRole(params: {
  scopeId: string;
  roleId: string;
  onChange: (goals: GoalDoc[]) => void;
  onError?: (e: unknown) => void;
}) {
  const { scopeId, roleId, onChange, onError } = params;

  const q = query(
    collection(db, "scopes", scopeId, "goals"),
    where("roleId", "==", roleId)
  );

  return onSnapshot(
    q,
    (snap) => {
      const data = snap.docs.map((d) => {
        const raw = d.data() as {
          roleId: string;
          title?: string;
          createdBy?: string;
          description?: string;
          status?: GoalStatus;
          done?: boolean;
        };
        const status: GoalStatus = raw.status ?? (raw.done ? "close" : "open");
        return {
          id: d.id,
          roleId: raw.roleId,
          title: raw.title ?? "",
          status,
          createdBy: raw.createdBy ?? "",
          description: raw.description ?? "",
        } satisfies GoalDoc;
      });
      onChange(data);
    },
    (err) => onError?.(err)
  );
}

export async function createRole(params: {
  scopeId: string;
  uid: string;
  title: string;
}) {
  const { scopeId, uid, title } = params;

  const ref = await addDoc(collection(db, "scopes", scopeId, "roles"), {
    title,
    createdBy: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

export async function updateRole(params: {
  scopeId: string;
  roleId: string;
  title: string;
}) {
  const { scopeId, roleId, title } = params;

  await updateDoc(doc(db, "scopes", scopeId, "roles", roleId), {
    title,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteRole(params: { scopeId: string; roleId: string }) {
  const { scopeId, roleId } = params;

  const goalsQuery = query(
    collection(db, "scopes", scopeId, "goals"),
    where("roleId", "==", roleId)
  );
  const goalsSnap = await getDocs(goalsQuery);

  await deleteDocumentRefs([
    ...goalsSnap.docs.map((goalDoc) => goalDoc.ref),
    doc(db, "scopes", scopeId, "roles", roleId),
  ]);
}

export async function createGoal(params: {
  scopeId: string;
  uid: string;
  roleId: string;
  title: string;
}) {
  const { scopeId, uid, roleId, title } = params;

  const ref = await addDoc(collection(db, "scopes", scopeId, "goals"), {
    roleId,
    title,
    status: "open" as GoalStatus,
    createdBy: uid,
    description: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

export async function updateGoalStatus(params: {
  scopeId: string;
  goalId: string;
  status: GoalStatus;
}) {
  const { scopeId, goalId, status } = params;

  await updateDoc(doc(db, "scopes", scopeId, "goals", goalId), {
    status,
    done: status === "close",
    updatedAt: serverTimestamp(),
  });
}

export async function updateGoal(params: {
  scopeId: string;
  goalId: string;
  title: string;
  description: string;
}) {
  const { scopeId, goalId, title, description } = params;

  await updateDoc(doc(db, "scopes", scopeId, "goals", goalId), {
    title,
    description,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteGoal(params: { scopeId: string; goalId: string }) {
  const { scopeId, goalId } = params;
  await deleteDoc(doc(db, "scopes", scopeId, "goals", goalId));
}
