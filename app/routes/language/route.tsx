import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { handleAuth } from './data/auth.server';
import { mutations } from './data/mutations.server';
import SelectLanguageCard from './components/select-language-card';
import { dataFetchers } from './data/data-fetchers.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await handleAuth(args);

  const userProfile = await dataFetchers.getUserProfile(userId);


  return json({ userProfile });
};

export const action = async (args: ActionFunctionArgs) => {
  const { userId, email, authState } = await handleAuth(args);
  const formData = await args.request.formData();
  const intent = formData.get("intent");
  formData.set("userId", userId);
  formData.set("email", email);

  if (intent === "setLanguage") {
    return await mutations.setLanguagePreference({ formData, authState });
  }

  return null;
};

export default function Route() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      <SelectLanguageCard />
    </>
  )
}