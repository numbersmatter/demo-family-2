import { redirect } from '@remix-run/node';
import { db } from '~/lib/db/db.server';

const getPageData = async ({ userId }: { userId: string }) => {
  const userProfile = await db.users().read({id: userId});

  const language = userProfile?.language || "en";

  return { language };
};

export { getPageData };