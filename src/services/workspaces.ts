import { db } from "@/lib/firebase";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";

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
