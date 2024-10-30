import { redirect } from "@remix-run/node";
import { getActiveSemester } from "~/lib/business-logic/active-semester.server";
import { db } from "~/lib/db/db.server";

const getApplicateData = async ({ userId }: { userId: string }) => {
  const { semesterId } = await getActiveSemester();
  const applicationDoc = await db
    .applications()
    .checkApplication({ userId, semesterId });

  if (!applicationDoc) {
    throw redirect("/register");
  }

  const applicationDate = applicationDoc.createdDate
    .toDate()
    .toLocaleDateString();

  const applicationStatus = applicationDoc.status;
  return {
    applicationStatus,
    applicationDate,
    user: applicationDoc.primaryContact,
  };
};

const getPageData = async ({ userId }: { userId: string }) => {
  const userProfileDoc = await db.users().read({ id: userId });

  if (!userProfileDoc) {
    throw redirect("/language");
  }

  const address = userProfileDoc.address;

  const language = userProfileDoc.language;

  const { applicationDate, user, applicationStatus } = await getApplicateData({
    userId,
  });

  return { address, language, applicationDate, user, applicationStatus };
};

export { getPageData };
