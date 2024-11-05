import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { handleAuth } from './data/auth.server';
import { mutations } from './data/mutations.server';
import { getPageData } from './data/data-fetchers.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await handleAuth(args);
  const pageData = await getPageData({ userId });
  return json({ ...pageData, userId });
};

export const action = async (args: ActionFunctionArgs) => {
  await handleAuth(args);
  return null;
};

export default function Route() {
  const { reservations, userId, eventDocs } = useLoaderData<typeof loader>();

  const reservationeventIds = reservations.map((r) => r.eventId);
  const eventIds = eventDocs.map((r) => r.id);
  return (
    <>

      <pre>{JSON.stringify(reservationeventIds, null, 2)}</pre>
      <pre>{JSON.stringify(reservations, null, 2)}</pre>
    </>
  )
}