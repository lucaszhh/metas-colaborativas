import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export async function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function logout() {
  return signOut(auth);
}
