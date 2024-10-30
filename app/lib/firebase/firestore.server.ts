import { getFirestore } from "firebase-admin/firestore";
import { initFirebase } from "./firebase.server";

export const firestoreDb = () => {
  const fireApp = initFirebase();
  const firestore = getFirestore(fireApp);

  return firestore;
};
