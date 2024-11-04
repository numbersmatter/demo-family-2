import {
  FieldValue,
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue,
} from "firebase-admin/firestore";
import * as m from "./event-types";
import { firestoreDb } from "~/lib/firebase/firestore.server";

interface EventConverter extends FirestoreDataConverter<m.EventAppModel, m.EventDbModel> {}

const eventCollectionPath = `/events`;

const firestoreConverter: EventConverter = {
  toFirestore: (event: m.EventAppModel) => {
    return {
      eventTimestamp: Timestamp.fromDate(event.eventDate),
      createdTimestamp: Timestamp.fromDate(event.createdDate),
      updatedTimestamp: Timestamp.fromDate(event.updatedDate),
      semesterId: event.semesterId,
      name: event.name,
      type: event.type,
      stage: event.stage,
      timeSlots: event.timeSlots.reduce(
        (acc, timeSlot) => ({ ...acc, [timeSlot.id]: timeSlot.label }),
        {}
      ),
      message: event.message,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<m.EventDbModel>) => {
    return {
      id: snapshot.id,
      name: snapshot.data().name,
      type: snapshot.data().type,
      stage: snapshot.data().stage,
      eventDate: snapshot.data().eventTimestamp.toDate(),
      createdDate: snapshot.data().createdTimestamp.toDate(),
      updatedDate: snapshot.data().updatedTimestamp.toDate(),
      timeSlots: Object.entries(snapshot.data().timeSlots)
        .map(([id, label]) => ({ id: Number(id), label }))
        .sort((a, b) => a.id - b.id),
      semesterId: snapshot.data().semesterId,
      message: snapshot.data().message,
    };
  },
};

export const eventsDb = () => {
  const firestore = firestoreDb();

  const collectionRead = firestore
    .collection(eventCollectionPath)
    .withConverter(firestoreConverter);

  const collectionWrite = firestore.collection(eventCollectionPath);

  const read = async ({ eventId }: { eventId: string }) => {
    const docSnap = await collectionRead.doc(eventId).get();
    const doc = docSnap.data();
    if (typeof doc === "undefined") {
      return null;
    }
    return doc;
  };

  const create = async (eventData: m.CreateEvent) => {
    const eventDocRef = collectionWrite.doc();
    const createData: WithFieldValue<m.EventDbModel> = {
      ...eventData,
      eventTimestamp: Timestamp.fromDate(eventData.eventDate),
      createdTimestamp: FieldValue.serverTimestamp(),
      updatedTimestamp: FieldValue.serverTimestamp(),
      stage: "planning",
      timeSlots: {},
      message: "",
    };
    await eventDocRef.set(createData);

    return eventDocRef.id;
  };

  const list = async () => {
    const querySnapshot = await collectionRead.get();
    const docs = querySnapshot.docs.map((doc) => doc.data());
    return docs;
  };

  const listOpen = async () => {
    const querySnapshot = await collectionRead
      .where("stage", "==", "open-for-requests")
      .get();
    const requestReadyEvents = querySnapshot.docs.map((doc) => doc.data());

    const pickupSnapshot = await collectionRead
      .where("stage", "==", "open-for-pickups")
      .get();

    const pickupReadyEvents = pickupSnapshot.docs.map((doc) => doc.data());

    return [...requestReadyEvents, ...pickupReadyEvents];
  };

  const update = async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<m.EventDbModel>;
  }) => {
    const updateData = {
      ...data,
      updatedDate: FieldValue.serverTimestamp(),
    };
    const docRef = collectionWrite.doc(id);
    return await docRef.update(updateData);
  };

  const listByStages = async ({
    stages,
  }: {
    stages: m.EventStage[];
  }) => {
    const querySnapshot = await collectionRead
      .where("stage", "in", stages)
      .get();
    const events = querySnapshot.docs.map((doc) => doc.data());
    return events;
  };

  return {
    read,
    list,
    listOpen,
    create,
    update,
    listByStages,
    collection: collectionRead,
  };
};
