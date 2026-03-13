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

export async function createScope(params: { uid: string; name: string }) {
  const { uid, name } = params;

  const scopeRef = await addDoc(collection(db, "scopes"), {
    name,
    ownerId: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await setDoc(doc(db, "scopes", scopeRef.id, "members", uid), {
    uid,
    role: "owner",
    joinedAt: serverTimestamp(),
  });

  return scopeRef.id;
}

export async function updateScope(params: { scopeId: string; name: string }) {
  const { scopeId, name } = params;

  await updateDoc(doc(db, "scopes", scopeId), {
    name,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteScope(params: { scopeId: string }) {
  const { scopeId } = params;

  const [rolesSnap, goalsSnap, membersSnap] = await Promise.all([
    getDocs(collection(db, "scopes", scopeId, "roles")),
    getDocs(collection(db, "scopes", scopeId, "goals")),
    getDocs(collection(db, "scopes", scopeId, "members")),
  ]);

  await deleteDocumentRefs([
    ...rolesSnap.docs.map((docSnap) => docSnap.ref),
    ...goalsSnap.docs.map((docSnap) => docSnap.ref),
    ...membersSnap.docs.map((docSnap) => docSnap.ref),
    doc(db, "scopes", scopeId),
  ]);
}
