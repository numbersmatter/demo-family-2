import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { handleAuth } from './data/auth.server';
import { mutations } from './data/mutations.server';
import { getPageData } from './data/data-fetchers.server';
import StatusCard from './components/status-card';

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await handleAuth(args);
  const pageData = await getPageData({ userId: userId });
  return json({ ...pageData });
};

export const action = async (args: ActionFunctionArgs) => {
  handleAuth(args);
  return null;
};

export default function Route() {
  return (
    <>
      <StatusCard />

    </>
  )
}