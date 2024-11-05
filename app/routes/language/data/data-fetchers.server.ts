import { redirect } from '@remix-run/node';
import foodpantryDb from '~/lib/food-pantry-db';

const getPageData = async ({ userId }: { userId: string }) => {
  const userProfile = await foodpantryDb.users().read({id: userId});

  const language = userProfile?.language || "en";

  return { language };
};

export { getPageData };