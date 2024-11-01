import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { handleAuth } from './data/auth.server';
import { mutations } from './data/mutations.server';
import { getPageData } from './data/data-fetchers.server';
import AdultsCard from './components/adults-card';
import { useLoaderData } from '@remix-run/react';

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await handleAuth(args);
  const pageData = await getPageData({ userId: userId });
  return json({ ...pageData });
};

export const action = async (args: ActionFunctionArgs) => {
  const { userId } = await handleAuth(args);
  const formData = await args.request.formData();
  formData.set("userId", userId);

  return await mutations.setAdults({ formData });
};

export default function Route() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <AdultsCard />
      <pre>{JSON.stringify(data, null, 2)}</pre>

    </>
  )
}