import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { handleAuth } from './data/auth.server';
import { mutations } from './data/mutations.server';
import { getPageData } from './data/data-fetchers.server';
import { AddressCard } from './components/address-card';
import { useLoaderData } from '@remix-run/react';

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await handleAuth(args);

  const pageData = await getPageData({ userId: userId });

  return json({ ...pageData });
};

export const action = async (args: ActionFunctionArgs) => {
  const { userId, authState } = await handleAuth(args);
  const formData = await args.request.formData();
  formData.set("userId", userId);

  return await mutations.updateAddress({ formData, authState });
};

export default function Route() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      <AddressCard />

    </>
  )
}