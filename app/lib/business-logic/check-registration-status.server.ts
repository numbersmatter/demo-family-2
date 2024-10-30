import { AuthStates } from "../auth/user-auth.server";
import { db } from "../db/db.server";
import { getActiveSemester } from "./active-semester.server";



export const checkRegistrationStatus = async (userId: string) => {
  const { semesterId } = await getActiveSemester();
  const registrationDoc = await db
    .registrations()
    .checkRegistration({ userId, semesterId });

  if (registrationDoc) {
    return "registered" as AuthStates;
  }

  return "authenticated" as AuthStates;
};