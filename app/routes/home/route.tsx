import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { handleAuth } from './data/auth.server';
import { mutations } from './data/mutations.server';
import { getPageData } from './data/data-fetchers.server';
import { useLoaderData } from '@remix-run/react';
import OpenEvents from './components/open-events-card';
import Reservations from './components/reservations-card';

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await handleAuth(args);
  const pageData = await getPageData({ userId });
  return json({ ...pageData });
};

export const action = async (args: ActionFunctionArgs) => {
  const { userId } = await handleAuth(args);
  const formData = await args.request.formData();
  return await mutations.requestReservation({ formData, userId });

};

export default function Route() {
  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-6 py-6  sm:px-6 lg:px-8 ">
      <OpenEvents />
      <Reservations />
    </div>
  )
}