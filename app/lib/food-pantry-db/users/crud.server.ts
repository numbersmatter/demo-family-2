import {
  DocumentData,
  FieldValue,
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase-admin/firestore";
import * as m from "./user-types";
import { firestoreDb } from "~/lib/firebase/firestore.server";




type UserConverter = FirestoreDataConverter<m.UserAppModel, m.UserDbModel>;

const userCollectionPath = `/appUsers`;

const firestoreConverter: UserConverter = {
  toFirestore: (appUser: m.UserAppModel) => {
    return {
      email: appUser.email,
      createdTimestamp: Timestamp.fromDate(appUser.createdDate),
      updatedTimestamp: FieldValue.serverTimestamp(),
      language: appUser.language,
      address: appUser.address,
      household_adults: appUser.household_adults,
      minors: appUser.minors,
      students: appUser.students,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<m.UserDbModel>) => {
    return {
      id: snapshot.id,
      email: snapshot.data().email,
      createdDate: snapshot.data().createdTimestamp.toDate(),
      updatedDate: snapshot.data().updatedTimestamp.toDate(),
      language: snapshot.data().language,
      address: snapshot.data().address,
      household_adults: snapshot.data().household_adults,
      minors: snapshot.data().minors,
      students: snapshot.data().students,
    };
  },
};

export const UserDb = () => {
  const firestore = firestoreDb();

  const collectionRead = firestore
    .collection(userCollectionPath)
    .withConverter(firestoreConverter);

  const read = async ({ id }: { id: string }) => {
    const docSnap = await collectionRead.doc(id).get();
    const doc = docSnap.data();
    if (!doc) {
      return null;
    }
    return doc;
  };

  const list = async () => {
    const querySnapshot = await collectionRead.get();
    const docs = querySnapshot.docs.map((doc) => doc.data());
    return docs;
  };

  const collectionWrite = firestore.collection(userCollectionPath);
  const create = async (data: m.AppUserCreate) => {
    const docRef = collectionRead.doc(data.userId);
    const writeData = {
      language: data.language,
      email: data.email,
      students: [],
      minors: [],
      address: {
        street: "",
        unit: "",
        city: "",
        state: "",
        zip: "",
      },
      household_adults: 1,
      createdDate: FieldValue.serverTimestamp(),
      updatedDate: FieldValue.serverTimestamp(),
    };

    return await docRef.set(writeData, { merge: true });
  };

  const update = async ({
    id,
    updateData,
  }: {
    id: string;
    updateData: DocumentData;
  }) => {
    const docRef = collectionWrite.doc(id);

    const writeData = {
      ...updateData,
      updatedDate: FieldValue.serverTimestamp(),
    };

    return await docRef.update(writeData);
  };

  const addStudent = async ({
    userId,
    student,
  }: {
    userId: string;
    student: m.StudentCreate;
  }) => {
    const docRef = collectionWrite.doc(userId);
    const studentId = collectionRead.doc().id;

    const addStudent = {
      id: studentId,
      ...student,
    };

    const writeData = {
      students: FieldValue.arrayUnion(addStudent),
      updatedDate: FieldValue.serverTimestamp(),
    };

    return await docRef.update(writeData);
  };

  const removeStudent = async ({
    userId,
    studentId,
  }: {
    userId: string;
    studentId: string;
  }) => {
    const docRef = collectionWrite.doc(userId);
    const profileDoc = await read({ id: userId });
    if (!profileDoc) {
      throw new Error("User profile not found.");
    }
    const students = profileDoc.students;

    const newStudents = students.filter((student) => student.id !== studentId);

    const writeData = {
      students: newStudents,
      updatedDate: FieldValue.serverTimestamp(),
    };

    return await docRef.update(writeData);
  };

  const addMinor = async ({
    userId,
    minor,
  }: {
    userId: string;
    minor: m.MinorCreate;
  }) => {
    const docRef = collectionWrite.doc(userId);
    const studentId = collectionRead.doc().id;

    const addMinor = {
      id: studentId,
      ...minor,
    };

    const writeData = {
      minors: FieldValue.arrayUnion(addMinor),
      updatedDate: FieldValue.serverTimestamp(),
    };

    return await docRef.update(writeData);
  };

  const removeMinor = async ({
    userId,
    minorId,
  }: {
    userId: string;
    minorId: string;
  }) => {
    const docRef = collectionRead.doc(userId);
    const profileDoc = await read({ id: userId });
    if (!profileDoc) {
      throw new Error("User profile not found.");
    }
    const minors = profileDoc.minors;

    const newMinors = minors.filter((minor) => minor.id !== minorId);

    const writeData = {
      minors: newMinors,
      updatedDate: FieldValue.serverTimestamp(),
    };

    return await docRef.update(writeData);
  };

  return {
    read,
    list,
    create,
    update,
    addStudent,
    removeStudent,
    addMinor,
    removeMinor,
    collection: collectionRead,
  };
};