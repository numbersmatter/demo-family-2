import { DocumentData, FieldValue,  FirestoreDataConverter,  QueryDocumentSnapshot,  Timestamp } from "firebase-admin/firestore";
import * as m from "./registrations-types";
import { firestoreDb } from "~/lib/firebase/firestore.server";
import { R } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

interface RegConverter extends FirestoreDataConverter<m.RegistrationApp, m.RegistrationDb> {}

const registrationCollectionPath = `/registrations`;

const firestoreConverter: RegConverter = {
  toFirestore: (registration: m.RegistrationApp) => {
    return {
      id: registration.id,
      userId: registration.userId,
      semesterId: registration.semesterId,
      status: registration.status,
      address: registration.address,
      createdTimestamp: Timestamp.fromDate(registration.createdDate),
      updatedTimestamp: Timestamp.fromDate(registration.updatedDate),
      applicationId: registration.applicationId,
      household_adults: registration.household_adults,
      students: registration.students,
      minors: registration.minors,
      primaryContact: registration.primaryContact,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<m.RegistrationDb>) => {
    return {
      id: snapshot.id,
      userId: snapshot.data().userId,
      applicationId: snapshot.data().applicationId,
      household_adults: snapshot.data().household_adults,
      semesterId: snapshot.data().semesterId,
      status: snapshot.data().status,
      primaryContact: snapshot.data().primaryContact,
      createdDate: snapshot.data().createdTimestamp.toDate(),
      updatedDate: snapshot.data().updatedTimestamp.toDate(),
      students: snapshot.data().students,
      minors: snapshot.data().minors,
      address:  snapshot.data().address,
    };
  },
}

export const registrationsDb = () => {
  const firestore = firestoreDb();
  const readCollection = firestore.collection(registrationCollectionPath)
  .withConverter(firestoreConverter);

  const writeCollection = firestore.collection(registrationCollectionPath);


  const read = async (id: string) => {
    const docSnap = await readCollection.doc(id).get();
    const doc = docSnap.data();
    if (!doc) {
      return null;
    }
    return doc;
  };

  const create = async (data: m.RegistrationCreate) => {
    const docRef = writeCollection.doc();

    const writeData = {
      ...data,
      status: "registered",
      createdTimestamp: FieldValue.serverTimestamp(),
      updatedTimestamp: FieldValue.serverTimestamp(),
    };

    await docRef.set(writeData);

    return docRef.id;
  };

  const update = async ({
    id,
    data,
  }: {
    id: string;
    data: DocumentData;
  }) => {
    const docRef = writeCollection.doc(id);
    const updateData = {
      ...data,
      updatedDate: FieldValue.serverTimestamp(),
    };
    await docRef.update(updateData);

    return docRef.id;
  };

  const checkRegistration = async ({
    userId,
    semesterId,
  }: {
    userId: string;
    semesterId: string;
  }) => {
    const querySnapshot = await readCollection
      .where("userId", "==", userId)
      .where("semesterId", "==", semesterId)
      .get();
    const docs = querySnapshot.docs.map((doc) => doc.data());

    if (docs.length === 0) {
      return null;
    }

    return docs[0];
  };

  return {
    read,
    create,
    update,
    checkRegistration,
    collection: readCollection,
  };
};
