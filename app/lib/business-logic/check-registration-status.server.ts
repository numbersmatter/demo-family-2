import { AuthStates } from "../auth/user-auth.server";
import foodpantryDb from "../food-pantry-db";
import { getActiveSemester } from "./active-semester.server";



export const checkRegistrationStatus = async (userId: string) => {
  const { semesterId } = await getActiveSemester();
  const registrationDoc = await foodpantryDb
    .registrations()
    .checkRegistration({ userId, semesterId });

  if (registrationDoc) {
    return "registered" as AuthStates;
  }

  return "authenticated" as AuthStates;
};