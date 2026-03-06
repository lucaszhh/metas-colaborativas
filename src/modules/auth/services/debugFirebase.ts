import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export async function debugFirebase() {
  console.log("env", {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  });

  console.log("auth.currentUser", auth.currentUser?.uid);

  try {
    if (!auth.currentUser?.uid) {
      console.log("sin user logueado");
      return;
    }

    const ref = doc(db, "userSettings", auth.currentUser.uid);
    const snap = await getDoc(ref);

    console.log("exists", snap.exists());
    console.log("data", snap.data());
  } catch (e) {
    console.error("getDoc Firestore error", e);
  }
}
