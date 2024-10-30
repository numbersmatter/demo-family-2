import { json, redirect } from "@remix-run/node";
import { db } from "~/lib/db/db.server";
import { AddressSchema, AddStudentSchema } from "./schemas";
import { getPrimaryContact } from "./data-fetchers.server";
import { ApplicationStatus } from "~/lib/firebase/firestore/applications/application-types";
import { getActiveSemester } from "~/lib/business-logic/active-semester.server";

// export const submitApplicationOg = async ({
//   primaryContact,
//   appUserId,
// }: {
//   appUserId: string;
//   primaryContact: {
//     fname: string;
//     lname: string;
//     email: string;
//     phone: string;
//   };
// }) => {
//   const { addressCheck, studentsCheck, adults, minors } = await reviewData(
//     appUserId
//   );

//   if (addressCheck.success === false) {
//     return json({ status: "error", message: "address-check-failed" });
//   }

//   if (studentsCheck.success === false) {
//     return json({ status: "error", message: "student-check-failed" });
//   }

//   // const activeSemester = await db.organization.activeSemester();
//   // if (!activeSemester) {
//   //   throw new Error("No active semester");
//   // }

//   const { semesterId } = await getActiveSemester();

//   const applicationData = {
//     status: "pending" as ApplicationStatus,
//     semesterId,
//     address: addressCheck.address,
//     students: studentsCheck.students,
//     minors,
//     userId: appUserId,
//     adults,
//     primaryContact,
//   };

//   const applicationWrite = await db.applications({ semesterId }).create({
//     appUserId,
//     data: applicationData,
//   });

//   return json(applicationWrite);
// };

const submitApplication = async ({ userId }: { userId: string }) => {
  const userProfileDoc = await db.users().read({ id: userId });
  if (!userProfileDoc) {
    throw redirect("/language");
  }

  // get active semester
  const { semesterId } = await getActiveSemester();

  // check if application already exists
  const applicationDoc = await db
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

  const primaryContact = await getPrimaryContact({ userId });

  const applicationId = await db.applications().create({
    data: {
      status: "pending" as ApplicationStatus,
      semesterId,
      address,
      students,
      minors: userProfileDoc.minors,
      userId: userId,
      adults: userProfileDoc.household_adults,
      primaryContact,
    },
  });

  return redirect("/status");
};
export const mutations = { submitApplication };
