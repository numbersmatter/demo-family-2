import { json, redirect } from "@remix-run/node";
import { AddressSchema, AddStudentSchema } from "./schemas";
import { getPrimaryContact } from "./data-fetchers.server";
import { getActiveSemester } from "~/lib/business-logic/active-semester.server";
import foodpantryDb from "~/lib/food-pantry-db";
import { ApplicationStatus } from "~/lib/food-pantry-db/applications/application-types";
import { PrimaryContact } from "~/lib/food-pantry-db/common-types";


const submitApplication = async ({ 
  userId, primaryContact 
}: { 
  userId: string 
  primaryContact: PrimaryContact
}) => {
  const userProfileDoc = await foodpantryDb.users().read({ id: userId });
  if (!userProfileDoc) {
    throw redirect("/language");
  }

  // get active semester
  const { semesterId } = await getActiveSemester();

  // check if application already exists
  const applicationDoc = await foodpantryDb
    .applications()
    .checkApplication({ userId, semesterId });

  if (applicationDoc) {
    throw redirect("/status");
  }

  const students = userProfileDoc.students;
  const address = userProfileDoc.address;

  const addressCheck = AddressSchema.safeParse(address);
  const studentData = students[0] ?? {};
  const studentsCheck = AddStudentSchema.safeParse(studentData);
  const success = addressCheck.success && studentsCheck.success;

  if (!success) {
    throw redirect("/register");
  }

  

  const applicationId = await foodpantryDb.applications().create({
    data: {
      status: "pending" as ApplicationStatus,
      semesterId,
      address,
      students,
      minors: userProfileDoc.minors,
      userId: userId,
      household_adults: userProfileDoc.household_adults,
      primaryContact,
    },
  });

  return redirect("/status");
};
export const mutations = { submitApplication };
