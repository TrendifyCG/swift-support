import { firestore, storage } from "@/app/_firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function checkUserExistsByEmail(email) {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("email", "==", email));

  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
}

export async function checkUserExistsByUsername(username) {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("username", "==", username));

  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty;
}

export async function addSocialAuthUser(userData) {
  const usersRef = collection(firestore, "users");
  try {
    await addDoc(usersRef, userData);
  } catch (error) {
    throw error;
  }
}

export async function getUserByUID(uid) {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("uid", "==", uid));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, data: userDoc.data() };
  } else {
    return null;
  }
}

export const uploadImage = async (image) => {
  if (!image) return null;

  try {
    const storageRef = ref(storage, `images/${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);

    return imageUrl;
  } catch (error) {
    throw error;
  }
};

export const uploadBase64Image = async (base64String, imageName) => {
  try {
    const [prefix, base64Data] = base64String.split(",");
    const mime = prefix.match(/:(.*?);/)[1];
    const binary = atob(base64Data);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], { type: mime });

    const imageRef = ref(storage, `images/${imageName}`);

    const snapshot = await uploadBytes(imageRef, blob);

    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    throw error;
  }
};

export const getConversations = async (uid, updateConvo) => {
  try {
    const conversationsRef = collection(firestore, "conversations");

    const q = query(conversationsRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const conversations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return conversations;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw new Error("Failed to retrieve conversations");
  }
};

export const saveConversations = async (conversations) => {
  try {
    await addDoc(collection(firestore, "conversations"), conversations);
  } catch (error) {
    throw error;
  }
};
