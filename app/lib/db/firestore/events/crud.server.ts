import {
  FieldValue,
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase-admin/firestore";
import * as m from "./event-types";
import { firestoreDb } from "~/lib/firebase/firestore.server";

const firestoreConverter: FirestoreDataConverter<m.EventAppModel> = {
  toFirestore: (event: m.EventAppModel) => {
    return {
      eventDate: Timestamp.fromDate(event.eventDate),
      createdDate: Timestamp.fromDate(event.createdDate),
      updatedDate: Timestamp.fromDate(event.updatedDate),
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
      eventDate: snapshot.data().eventDate.toDate(),
      createdDate: snapshot.data().createdDate.toDate(),
      updatedDate: snapshot.data().updatedDate.toDate(),
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

  const eventsCollection = firestore
    .collection("events")
    .withConverter(firestoreConverter);

  const writeCollection = firestore.collection("events");

  const read = async ({ eventId }: { eventId: string }) => {
    const docSnap = await eventsCollection.doc(eventId).get();
    const doc = docSnap.data();
    if (typeof doc === "undefined") {
      return null;
    }
    return doc;
  };

  const create = async (eventData: m.CreateEvent) => {
    const eventDocRef = writeCollection.doc();
    const createData = {
      ...eventData,
      eventDate: Timestamp.fromDate(eventData.eventDate),
      createdDate: FieldValue.serverTimestamp(),
      updatedDate: FieldValue.serverTimestamp(),
      stage: "planning",
      timeSlots: {},
      message: "",
    };
    await eventDocRef.set(createData);

    return eventDocRef.id;
  };

  const list = async () => {
    const querySnapshot = await eventsCollection.get();
    const docs = querySnapshot.docs.map((doc) => doc.data());
    return docs;
  };

  const listOpen = async () => {
    const querySnapshot = await eventsCollection
      .where("stage", "==", "open-for-requests")
      .get();
    const requestReadyEvents = querySnapshot.docs.map((doc) => doc.data());

    const pickupSnapshot = await eventsCollection
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
    const docRef = writeCollection.doc(id);
    return await docRef.update(updateData);
  };

  const listByStages = async ({
    stages,
  }: {
    stages: m.EventStage[];
  }) => {
    const querySnapshot = await eventsCollection
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
  };
};
