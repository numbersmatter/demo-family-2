import { db } from "~/lib/db/db.server";

const getUserProfile = async (userId: string) => {
  const profileDoc = await db.users().read({ id: userId });

  return profileDoc;
};

export const dataFetchers = {
  getUserProfile,
};
