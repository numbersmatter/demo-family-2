import { redirect } from "@remix-run/node";
import foodpantryDb from "~/lib/food-pantry-db";

const getPageData = async ({ userId }: { userId: string }) => {
  const userProfileDoc = await foodpantryDb.users().read({ id: userId });

  if (!userProfileDoc) {
    throw redirect("/language");
  }

  const students = userProfileDoc.students;

  const language = userProfileDoc.language;

  return { students, language };
};

export { getPageData };
