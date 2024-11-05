import { applicationsDb } from "./firestore/applications/applications-crud.server";
import { appUserDb } from "./firestore/appUsers/crud.server";
import { eventsDb } from "./firestore/events/crud.server";
import { registrationsDb } from "./firestore/registrations/registrations-crud.server";
import { reservationsDb } from "./firestore/reservations/crud.server";
import { testCollectionDb } from "./firestore/TestCollection/crud.server";

export const dbOld = {
  test_collection: testCollectionDb,
  users: appUserDb,
  applications: applicationsDb,
  reservations: reservationsDb,
  events: eventsDb,
  registrations: registrationsDb,
};
