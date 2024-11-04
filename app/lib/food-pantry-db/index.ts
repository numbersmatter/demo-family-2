import { applicationsDb } from "./applications/applications-crud.server";
import { eventsDb } from "./events/crud.server";
import { registrationsDb } from "./registrations/registrations-crud.server";
import { reservationsDb } from "./reservations/crud.server";
import { UserDb } from "./users/crud.server";


const foodpantryDb = {
  applications: applicationsDb,
  events: eventsDb,
  registrations: registrationsDb,
  reservations: reservationsDb,
  users: UserDb,
}

export default foodpantryDb;