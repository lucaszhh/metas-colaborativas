import { writeBatch, type DocumentReference } from "firebase/firestore";
import { db } from "@/lib/firebase";

const DELETE_BATCH_SIZE = 400;

export async function deleteDocumentRefs(refs: DocumentReference[]) {
  if (refs.length === 0) return;

  for (let index = 0; index < refs.length; index += DELETE_BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = refs.slice(index, index + DELETE_BATCH_SIZE);

    for (const ref of chunk) {
      batch.delete(ref);
    }

    await batch.commit();
  }
}
