import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { handleAuth } from './data/auth.server';
import { mutations } from './data/mutations.server';
import { getPageData } from './data/data-fetchers.server';
import SelectLanguageCard from './components/select-language-card';

export const loader = async (args: LoaderFunctionArgs) => {
  const { authState, email, userId } = await handleAuth(args);
  const pageData = await getPageData({ userId });
  return json({ ...pageData });
};

export const action = async (args: ActionFunctionArgs) => {
  const { authState, userId, email } = await handleAuth(args);
  const formData = await args.request.formData();
  formData.set("userId", userId);
  formData.set("email", email as string);

  return await mutations.setLanguagePreference({ formData, authState })
};

export default function Route() {
  return (
    <>
      <SelectLanguageCard />
    </>
  )
}