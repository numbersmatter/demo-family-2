import {
  DocumentData,
  FieldValue,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase-admin/firestore";
import * as m from "./reservation-types";
import { firestoreDb } from "~/lib/firebase/firestore.server";

function makeConfirmationCode(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}


interface ReserveConverter extends FirestoreDataConverter<m.ReservationAppModel, m.ReservationDbModel> {}

const reservationCollectionPath = `/reservations`;

const firestoreConverter: ReserveConverter = {
  toFirestore: (reservation: m.ReservationAppModel) => {
    return {
      id: reservation.id,
      createdTimestamp: Timestamp.fromDate(reservation.createdDate),
      updatedTimestamp: Timestamp.fromDate(reservation.updatedDate),
      eventId: reservation.eventId,
      status: reservation.status,
      time: reservation.time,
      primaryContact: reservation.primaryContact,
      userId: reservation.userId,
      confirm: reservation.confirm,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<m.ReservationDbModel>) => {
    const createdDate = snapshot.data().createdTimestamp 
    ? snapshot.data().createdTimestamp.toDate() 
    // @ts-expect-error some times createdTimestamp does not exist
    : snapshot.data().createdDate 
    // @ts-expect-error some times createdDate is not a timestamp
    ? snapshot.data().createdDate.toDate()
    : new Date();

    const updatedDate = snapshot.data().updatedTimestamp 
    ? snapshot.data().updatedTimestamp.toDate() 
    // @ts-expect-error some times updatedTimestamp does not exist
    : snapshot.data().updatedDate 
    // @ts-expect-error some times updatedDate is not a timestamp
    ? snapshot.data().updatedDate.toDate()
    : new Date();

    return {
      id: snapshot.id,
      userId: snapshot.data().userId,
      createdDate,
      updatedDate,
      eventId: snapshot.data().eventId,
      status: snapshot.data().status,
      time: snapshot.data().time,
      confirm: snapshot.data().confirm,
      primaryContact: snapshot.data().primaryContact,
    };
  },
};

export const reservationsDb = () => {
  const firestore = firestoreDb();


  const makeReservationCollection = firestore
  .collection(reservationCollectionPath);

  const readReservationCollection = firestore
    .collection(reservationCollectionPath)
    .withConverter(firestoreConverter);

  const read = async (id: string) => {
    const docSnap = await readReservationCollection.doc(id).get();
    const doc = docSnap.data();
    if (typeof doc === "undefined") {
      return null;
    }
    return doc;
  };

  const list = async () => {
    const querySnapshot = await readReservationCollection.get();
    const docs = querySnapshot.docs.map((doc) => doc.data());
    return docs;
  };

  const listByEvent = async ({ eventId }: { eventId: string }) => {
    const querySnapshot = await readReservationCollection
      .where("eventId", "==", eventId)
      .get();

    const docs = querySnapshot.docs.map((doc) => doc.data());

    return docs;
  };

  const makeReservation = async ({
    eventId,
    userId,
    fname,
    time,
    email,
    phone,
    lname,
  }: {
    eventId: string;
    userId: string;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    time: number;
  }) => {
    const reservationDocRef = makeReservationCollection.doc();
    const confirmCode = makeConfirmationCode(4);

    const reservationData = {
      id: reservationDocRef.id,
      createdDate: FieldValue.serverTimestamp(),
      updatedDate: FieldValue.serverTimestamp(),
      eventId: eventId,
      status: "pending",
      time: time,
      confirm: confirmCode,
      primaryContact: {
        fname,
        lname,
        email,
        phone,
      },
      userId,
    };

    await reservationDocRef.set(reservationData);

    return reservationDocRef.id;
  };

  // const listOpen = async () => {
  //   const requestReadyEvents = await readReservationCollection
  //     .where("stage", "==", "open-for-requests")
  //     .get();
  //   const requestDocs = requestReadyEvents.docs.map((doc) => doc.data());

  //   const pickupReadyEvents = await readReservationCollection
  //     .where("stage", "==", "open-for-pickups")
  //     .get();

  //   const pickupDocs = pickupReadyEvents.docs.map((doc) => doc.data());

  //   return [...requestDocs, ...pickupDocs];
  // };

  const checkReservation = async ({
    userId,
    eventId,
  }: {
    userId: string;
    eventId: string;
  }) => {
    const querySnapshot = await readReservationCollection
      .where("userId", "==", userId)
      .where("eventId", "==", eventId)
      .get();
    const docs = querySnapshot.docs.map((doc) => doc.data());

    if (docs.length === 0) {
      return null;
    }

    return docs[0];
  };

  const update = async ({
    id,
    data,
  }: {
    id: string;
    data: DocumentData;
  }) => {
    const updateData = {
      ...data,
      updatedDate: FieldValue.serverTimestamp(),
    };
    return await readReservationCollection.doc(id).update(updateData);
  };

  const checkUserReservations = async ({
    userId,
    eventIdArray,
  }: {
    userId: string;
    eventIdArray: string[];
  }) => {
    if(eventIdArray.length === 0){
      return [];
    }
    const querySnapshot = await readReservationCollection
      .where("userId", "==", userId)
      .where("eventId", "in", eventIdArray)
      .get();
    const docs = querySnapshot.docs.map((doc) => doc.data());

    return docs;
  };

  return {
    read,
    list,
    makeReservation,
    checkReservation,
    listByEvent,
    update,
    checkUserReservations,
    collection: readReservationCollection,
    // listOpen,
  };
};
