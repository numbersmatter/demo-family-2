import {
  FieldValue,
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase-admin/firestore";
import { Application, ApplicationDb } from "./application-types";
import { initFirebase } from "~/lib/firebase/firebase.server";
import * as m from "./application-types";
import { firestoreDb } from "~/lib/firebase/firestore.server";

const firestoreConverter: FirestoreDataConverter<m.Application> = {
  toFirestore: (application: m.Application) => {
    return {
      id: application.id,
      userId: application.userId,
      semesterId: application.semesterId,
      status: application.status,
      createdDate: application.createdDate,
      updatedDate: application.updatedDate,
      address: application.address,
      household_adults: application.household_adults,
      minors: application.minors,
      students: application.students,
      primaryContact: {
        fname: application.primaryContact.fname,
        lname: application.primaryContact.lname,
        email: application.primaryContact.email,
        phone: application.primaryContact.phone,
      },
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<m.ApplicationDb>) => {
    return {
      id: snapshot.id,
      userId: snapshot.data().userId,
      semesterId: snapshot.data().semesterId,
      status: snapshot.data().status,
      primaryContact: {
        fname: snapshot.data().primaryContact?.fname,
        lname: snapshot.data().primaryContact?.lname,
        email: snapshot.data().primaryContact?.email,
        phone: snapshot.data().primaryContact?.phone,
      },
      createdDate: snapshot.data().createdDate.toDate(),
      updatedDate: snapshot.data().updatedDate.toDate(),
      address: snapshot.data().address,
      household_adults: snapshot.data().household_adults,
      minors: snapshot.data().minors,
      students: snapshot.data().students,
    };
  },
};

export const applicationsDb = () => {
  const firestore = firestoreDb();
  const collection = firestore.collection(`applications`);
  const collectionRead = collection.withConverter(firestoreConverter);

  const read = async ({ id }: { id: string }) => {
    const docSnap = await collectionRead.doc(id).get();
    const doc = docSnap.data();
    if (!doc) {
      return null;
    }

    return doc;
  };

  const create = async ({
    data,
  }: {
    data: Omit<ApplicationDb, "createdDate">;
  }) => {
    const docRef = collection.doc();

    const writeData = {
      ...data,
      createdDate: FieldValue.serverTimestamp(),
      updatedDate: FieldValue.serverTimestamp(),
    };

    await docRef.set(writeData);
    return docRef.id;
  };

  const update = async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<Application>;
  }) => {
    const docRef = collection.doc(id);
    const updateData = {
      ...data,
      updatedDate: FieldValue.serverTimestamp(),
    };
    await docRef.update(updateData);

    return docRef.id;
  };
  const addStudent = async ({
    appUserId,
    data,
  }: {
    appUserId: string;
    data: m.Student;
  }) => {
    const docRef = collection.doc(appUserId);

    const writeData = {
      updatedDate: FieldValue.serverTimestamp(),
      students: FieldValue.arrayUnion(data),
    };

    await docRef.update(writeData);
    return docRef.id;
  };

  const removeStudent = async ({
    appUserId,
    studentId,
  }: {
    appUserId: string;
    studentId: string;
  }) => {
    const docRef = collection.doc(appUserId);
    const doc = await read({ id: appUserId });

    const students = doc?.students ?? [];

    const newStudents = students.filter((student) => student.id !== studentId);

    const writeData = {
      updatedDate: FieldValue.serverTimestamp(),
      students: newStudents,
    };

    await docRef.update(writeData);
    return docRef.id;
  };

  const addMinor = async ({
    appUserId,
    data,
  }: {
    appUserId: string;
    data: m.Minor;
  }) => {
    const docRef = collection.doc(appUserId);

    const writeData = {
      updatedDate: FieldValue.serverTimestamp(),
      minors: FieldValue.arrayUnion(data),
    };

    await docRef.update(writeData);
    return docRef.id;
  };

  const removeMinor = async ({
    appUserId,
    minorId,
  }: {
    appUserId: string;
    minorId: string;
  }) => {
    const docRef = collection.doc(appUserId);
    const doc = await read({ id: appUserId });

    const minors = doc?.minors ?? [];

    const newMinors = minors.filter((minor) => minor.id !== minorId);

    const writeData = {
      updatedDate: FieldValue.serverTimestamp(),
      minors: newMinors,
    };

    await docRef.update(writeData);
    return docRef.id;
  };

  const checkApplication = async ({
    userId,
    semesterId,
  }: {
    userId: string;
    semesterId: string;
  }) => {
    const querySnapshot = await collectionRead
      .where("userId", "==", userId)
      .where("semesterId", "==", semesterId)
      .get();
    const docs = querySnapshot.docs.map((doc) => doc.data());

    if (docs.length === 0) {
      return null;
    }

    return docs[0];
  };

  const getAllBySemester = async ({ semesterId }: { semesterId: string }) => {
    const querySnapshot = await collectionRead
      .where("semesterId", "==", semesterId)
      .get();
    const docs = querySnapshot.docs.map((doc) => doc.data());

    return docs;
  };

  const getAllForReviewBySemester = async ({
    semesterId,
  }: {
    semesterId: string;
  }) => {
    const querySnapshot = await collectionRead
      .where("status", "==", "pending")
      .where("semesterId", "==", semesterId)
      .get();
    const docs = querySnapshot.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      };
    });
    return docs;
  };

  return {
    read,
    create,
    update,
    addStudent,
    removeStudent,
    addMinor,
    removeMinor,
    checkApplication,
    getAllForReviewBySemester,
    getAllBySemester,
  };
};
