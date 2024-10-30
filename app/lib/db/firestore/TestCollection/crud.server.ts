import {
  DocumentData,
  FieldValue,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import * as m from "./types";
import { firestoreDb } from "~/lib/firebase/firestore.server";

const readFirestoreConverter: FirestoreDataConverter<m.TestDocApp> = {
  toFirestore: (doc: m.TestDocApp) => {
    return {
      id: doc.id,
      test_text: doc.test_text,
      name: doc.name,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<m.TestDocDbModel>) => {
    return {
      id: snapshot.id,
      test_text: snapshot.data().test_text,
      name: snapshot.data().name,
    };
  },
};

export const testCollectionDb = () => {
  // For reads
  const collectionRead = firestoreDb()
    .collection(`/test`)
    .withConverter(readFirestoreConverter);

  const collectionWrite = firestoreDb().collection(`/test`);

  const create = async (data: m.TestDocDbModel) => {
    const docRef = collectionWrite.doc();
    const writeData = {
      ...data,
      createdDate: FieldValue.serverTimestamp(),
      updatedDate: FieldValue.serverTimestamp(),
    };
    await docRef.set(writeData);
    return docRef.id;
  };

  const read = async (id: string) => {
    const docSnap = await collectionRead.doc(id).get();
    const doc = docSnap.data();
    if (!doc) {
      return null;
    }
    return doc;
  };
  const update = async ({
    id,
    updateData,
  }: {
    id: string;
    updateData: DocumentData;
  }) => {
    const docRef = collectionWrite.doc(id);
    await docRef.update(updateData);
  };

  const list = async () => {
    const querySnapshot = await collectionRead.get();
    const docs = querySnapshot.docs.map((doc) => doc.data());
    return docs;
  };

  return {
    read,
    list,
    create,
    update,
  };
};
