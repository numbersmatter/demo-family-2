import { redirect } from "@remix-run/node";
import { getActiveSemester } from "~/lib/business-logic/active-semester.server";
import { db } from "~/lib/db/db.server";

const getPageData = async ({ userId }: { userId: string }) => {
  const userProfileDoc = await db.users().read({ id: userId });

  const redirectLinks = {
    address: "/address",
    students: "/students",
    minors: "/minors",
    adults: "/adults",
  };

  // get active semester
  const { semesterId } = await getActiveSemester();

  // check if application already exists
  const applicationDoc = await db
    .applications()
    .checkApplication({ userId, semesterId });

  // if (applicationDoc) {
  //   throw redirect("/status");
  // }
  const applied = applicationDoc ? true : false;

  if (!userProfileDoc) {
    throw redirect("/language");
  }

  const address = userProfileDoc.address;
  const students = userProfileDoc.students;
  const adults = userProfileDoc.household_adults;
  const minors = userProfileDoc.minors;

  const language = userProfileDoc.language;

  return {
    address,
    language,
    redirectLinks,
    students,
    minors,
    adults,
    applied,
  };
};

const getPrimaryContact = async ({ userId }: { userId: string }) => {
  const primaryContact = {
    fname: "Homer",
    lname: "Simpson",
    email: "homer@simpson.com",
    phone: "555-555-5555",
  };
  return primaryContact;
};

export { getPageData, getPrimaryContact };
