import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { handleAuth } from './data/auth.server';
import { mutations } from './data/mutations.server';
import { getPageData } from './data/data-fetchers.server';
import { StudentsCard } from './components/student-card';

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await handleAuth(args);

  const pageData = await getPageData({ userId: userId });
  return json({ ...pageData });
};

export const action = async (args: ActionFunctionArgs) => {
  const { userId } = await handleAuth(args);
  const formData = await args.request.formData();
  formData.set("userId", userId);
  const intent = formData.get("intent");

  if (intent === "addStudent") {
    return await mutations.addStudent({ formData });
  }

  if (intent === "removeStudent") {
    return await mutations.removeStudent({ formData });
  }

  return null
};

export default function Route() {
  return (
    <>
      <StudentsCard />
    </>
  )
}