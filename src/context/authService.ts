import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";

import { auth, db } from "@/lib/firebase";
import { doc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { resetUserExams } from "./userService";

export async function signupUser(
  email: string,
  password: string,
  extra: {
    username: string;
    program: string;
    semester: string;
    level: string;
  },
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    ...extra,
    createdAt: new Date(),
  });

  return cred;
}

export async function loginUser(
  email: string,
  password: string,
  rememberMe: boolean,
) {
  await setPersistence(
    auth,
    rememberMe ? browserLocalPersistence : browserSessionPersistence,
  );

  return await signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle(rememberMe: boolean) {
  await setPersistence(
    auth,
    rememberMe ? browserLocalPersistence : browserSessionPersistence,
  );

  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);

  const ref = doc(db, "users", result.user.uid);
  const snap = await getDoc(ref);

  return {
    user: result.user,
    isNewUser: !snap.exists(),
  };
}

export async function signupWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const ref = doc(db, "users", result.user.uid);
  const snap = await getDoc(ref);
  return { user: result.user, isNewUser: !snap.exists() };
}

export async function logoutUser() {
  return await signOut(auth);
}

export async function resetPassword(email: string) {
  return await sendPasswordResetEmail(auth, email);
}

export async function deleteAccount(password?: string) {
  const user = auth.currentUser;

  if (!user) throw new Error("No authenticated user");

  if (password && user.email) {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  }

  await deleteDoc(doc(db, "users", user.uid));
  await resetUserExams(user.uid);

  await deleteUser(user);
}
