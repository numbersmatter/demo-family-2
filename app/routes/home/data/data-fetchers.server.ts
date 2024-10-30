import { db } from "~/lib/db/db.server";

const getPageData = async () => {
  const testDocs = await db.test_collection().list();

  return { testDocs };
};

export { getPageData };
