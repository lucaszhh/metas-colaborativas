import { db } from "@/lib/firebase";
import { deleteDocumentRefs } from "@/lib/firestore-helpers";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export async function createWorkspace(params: { uid: string; name: string }) {
  const { uid, name } = params;

  const wsRef = await addDoc(collection(db, "workspaces"), {
    name,
    ownerId: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await setDoc(doc(db, "workspaces", wsRef.id, "members", uid), {
    uid,
    role: "owner",
    joinedAt: serverTimestamp(),
  });

  return wsRef.id;
}

export async function updateWorkspace(params: { workspaceId: string; name: string }) {
  const { workspaceId, name } = params;

  await updateDoc(doc(db, "workspaces", workspaceId), {
    name,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteWorkspace(params: { workspaceId: string }) {
  const { workspaceId } = params;

  const [goalListsSnap, goalsSnap, membersSnap] = await Promise.all([
    getDocs(collection(db, "workspaces", workspaceId, "goalLists")),
    getDocs(collection(db, "workspaces", workspaceId, "goals")),
    getDocs(collection(db, "workspaces", workspaceId, "members")),
  ]);

  await deleteDocumentRefs([
    ...goalListsSnap.docs.map((docSnap) => docSnap.ref),
    ...goalsSnap.docs.map((docSnap) => docSnap.ref),
    ...membersSnap.docs.map((docSnap) => docSnap.ref),
    doc(db, "workspaces", workspaceId),
  ]);
}
