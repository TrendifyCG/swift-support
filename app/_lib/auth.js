import { auth, firestore } from "@/app/_firebase/config";
import {
  addSocialAuthUser,
  checkUserExistsByEmail,
  checkUserExistsByUsername,
} from "@/app/_lib/data-service";
import {
  onAuthStateChanged as _onAuthStateChanged,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, writeBatch } from "firebase/firestore";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { generateUsername } from "../_util/utilities";

export function onAuthStateChanged(cb) {
  return _onAuthStateChanged(auth, cb);
}

async function signInWithProvider(provider) {
  try {
    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const token = await user.getIdToken();

    await updateUser(user);
    Cookies.set("auth_token", token, {
      path: "/",
    });

    window.location.href = "/user/dashboard";
  } catch (err) {
    toast.error(err.message);
  }
}

export async function googleAuth() {
  const provider = new GoogleAuthProvider();
  await signInWithProvider(provider);
}

export async function githubAuth() {
  const provider = new GithubAuthProvider();
  await signInWithProvider(provider);
}

async function ensureUniqueUsername(initialUsername) {
  let username = initialUsername;
  let usernameExists = await checkUserExistsByUsername(username);

  let counter = 1;
  while (usernameExists) {
    username = `${initialUsername}${counter}`;
    usernameExists = await checkUserExistsByUsername(username);
    counter++;
  }

  return username;
}

async function updateUser(user) {
  let baseUsername = user.displayName
    ? user.displayName.split(" ")[0].toLowerCase()
    : generateUsername();
  let username = baseUsername;
  let usernameExist = await checkUserExistsByUsername(username);

  while (usernameExist) {
    username = `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`;
    usernameExist = await checkUserExistsByUsername(username);
  }

  const emailExist = await checkUserExistsByEmail(user.email);

  if (!emailExist || usernameExist) {
    const userData = {
      uid: user.uid,
      email: user.email,
      username: username,
      image_url: user.photoURL || "/images/default_user.png",
    };

    await addSocialAuthUser(userData);
  }
}

export async function signInSystem({ email, password, rememberMe }) {
  try {
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();

    Cookies.set("auth_token", token, {
      expires: rememberMe ? 2 : undefined,
      path: "/",
    });
  } catch (error) {
    throw error;
  }
}

export async function signUpSystem({ username, email, password }) {
  const usernameExists = await checkUserExistsByUsername(username);

  if (usernameExists) {
    throw new Error("Username already taken.");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();

    const batch = writeBatch(firestore);

    const userDocRef = doc(firestore, "users", user.uid);
    const usernameDocRef = doc(firestore, "usernames", username);

    batch.set(userDocRef, {
      uid: user.uid,
      username: username,
      email: email,
      image_url: "/images/default_user.png",
    });

    batch.set(usernameDocRef, { uid: user.uid });

    await batch.commit();

    Cookies.set("auth_token", token, {
      path: "/",
    });
  } catch (error) {
    throw error;
  }
}

export async function logOut() {
  try {
    await auth.signOut();

    Cookies.remove("auth_token", { path: "/" });

    window.location.href = "/";
  } catch (error) {
    toast.error(error.message);
  }
}
