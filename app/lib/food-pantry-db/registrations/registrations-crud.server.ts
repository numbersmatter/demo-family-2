import { FieldValue,  FirestoreDataConverter,  QueryDocumentSnapshot,  Timestamp } from "firebase-admin/firestore";
import {
  Registration,
  RegistrationCreate,
  RegistrationDb,
} from "./registrations-types";
import { firestoreDb } from "~/lib/firebase/firestore.server";


const firestoreConverter: FirestoreDataConverter<Registration> = {
  toFirestore: (registration: Registration) => {
    return {
      id: registration.id,
      userId: registration.userId,
      semesterId: registration.semesterId,
      status: registration.status,
      createdDate: registration.createdDate,
      updatedDate: registration.updatedDate,
      primaryContact: {
        fname: registration.primaryContact.fname,
        lname: registration.primaryContact.lname,
        email: registration.primaryContact.email,
        phone: registration.primaryContact.phone,
      },
      adults: registration.household_adults,
      students: registration.students,
      minors: registration.minors,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<RegistrationDb>) => {
    return {
      id: snapshot.id,
      userId: snapshot.data().userId,
      applicationId: snapshot.data().applicationId,
      household_adults: snapshot.data().household_adults,
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
      students: snapshot.data().students,
      minors: snapshot.data().minors,
    };
  },
}

export const registrationsDb = () => {
  const firestore = firestoreDb();
  const readCollection = firestore.collection(`registrations`)
  .withConverter(firestoreConverter);

  const writeCollection = firestore.collection(`registrations`);


  const read = async (id: string) => {
    const docSnap = await readCollection.doc(id).get();
    const doc = docSnap.data();
    if (!doc) {
      return null;
    }
    return doc;
  };

  const create = async (data: RegistrationCreate) => {
    const docRef = writeCollection.doc();

    const writeData = {
      ...data,
      status: "registered",
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
    data: Partial<RegistrationDb>;
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
  };
};
