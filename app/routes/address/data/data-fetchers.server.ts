import { redirect } from "@remix-run/node";
import foodpantryDb from "~/lib/food-pantry-db";

const getPageData = async ({ userId }: { userId: string }) => {
  const userProfileDoc = await foodpantryDb.users().read({ id: userId });

  if (!userProfileDoc) {
    throw redirect("/language");
  }

  const address = userProfileDoc.address;

  const language = userProfileDoc.language;

  return { address, language };
};

export { getPageData };
