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

export type GoalListDoc = {
  id: string;
  title: string;
  createdBy: string;
};

export type GoalStatus = "open" | "close";

export type GoalDoc = {
  id: string;
  listId: string;
  title: string;
  status: GoalStatus;
  createdBy: string;
  description?: string;
};

export function subscribeGoalLists(params: {
  workspaceId: string;
  onChange: (lists: GoalListDoc[]) => void;
  onError?: (e: unknown) => void;
}) {
  const { workspaceId, onChange, onError } = params;

  const q = query(
    collection(db, "workspaces", workspaceId, "goalLists"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<GoalListDoc, "id">),
      }));
      onChange(data);
    },
    (err) => onError?.(err)
  );
}

export function subscribeGoalsByList(params: {
  workspaceId: string;
  listId: string;
  onChange: (goals: GoalDoc[]) => void;
  onError?: (e: unknown) => void;
}) {
  const { workspaceId, listId, onChange, onError } = params;

  const q = query(
    collection(db, "workspaces", workspaceId, "goals"),
    where("listId", "==", listId)
  );

  return onSnapshot(
    q,
    (snap) => {
      const data = snap.docs.map((d) => {
        const raw = d.data() as {
          listId: string;
          title?: string;
          createdBy?: string;
          description?: string;
          status?: GoalStatus;
          done?: boolean;
        };
        const status: GoalStatus = raw.status ?? (raw.done ? "close" : "open");
        return {
          id: d.id,
          listId: raw.listId,
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

export async function createGoalList(params: {
  workspaceId: string;
  uid: string;
  title: string;
}) {
  const { workspaceId, uid, title } = params;

  const ref = await addDoc(collection(db, "workspaces", workspaceId, "goalLists"), {
    title,
    createdBy: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

export async function updateGoalList(params: {
  workspaceId: string;
  listId: string;
  title: string;
}) {
  const { workspaceId, listId, title } = params;

  await updateDoc(doc(db, "workspaces", workspaceId, "goalLists", listId), {
    title,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteGoalList(params: { workspaceId: string; listId: string }) {
  const { workspaceId, listId } = params;

  const goalsQuery = query(
    collection(db, "workspaces", workspaceId, "goals"),
    where("listId", "==", listId)
  );
  const goalsSnap = await getDocs(goalsQuery);

  await deleteDocumentRefs([
    ...goalsSnap.docs.map((goalDoc) => goalDoc.ref),
    doc(db, "workspaces", workspaceId, "goalLists", listId),
  ]);
}

export async function createGoal(params: {
  workspaceId: string;
  uid: string;
  listId: string;
  title: string;
}) {
  const { workspaceId, uid, listId, title } = params;

  const ref = await addDoc(collection(db, "workspaces", workspaceId, "goals"), {
    listId,
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
  workspaceId: string;
  goalId: string;
  status: GoalStatus;
}) {
  const { workspaceId, goalId, status } = params;

  await updateDoc(doc(db, "workspaces", workspaceId, "goals", goalId), {
    status,
    done: status === "close",
    updatedAt: serverTimestamp(),
  });
}

export async function updateGoal(params: {
  workspaceId: string;
  goalId: string;
  title: string;
  description: string;
}) {
  const { workspaceId, goalId, title, description } = params;

  await updateDoc(doc(db, "workspaces", workspaceId, "goals", goalId), {
    title,
    description,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteGoal(params: { workspaceId: string; goalId: string }) {
  const { workspaceId, goalId } = params;
  await deleteDoc(doc(db, "workspaces", workspaceId, "goals", goalId));
}
