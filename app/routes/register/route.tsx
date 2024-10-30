import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { handleAuth } from './data/auth.server';
import { mutations } from './data/mutations.server';
import { getPageData } from './data/data-fetchers.server';
import AddressCheckCard from './components/address-check-card';
import StudentCheckCard from './components/student-check-card';
import SubmitCard from './components/submit-card';

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await handleAuth(args);
  const pageData = await getPageData({ userId: userId });
  return json({ ...pageData });
};

export const action = async (args: ActionFunctionArgs) => {
  let { userId } = await handleAuth(args);

  return await mutations.submitApplication({ userId });
};

export default function Route() {
  return (
    <div className='flex flex-col gap-4 px-5 py-5'>
      <AddressCheckCard />
      <StudentCheckCard />
      <SubmitCard />
    </div>
  )
}