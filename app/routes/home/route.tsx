import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { handleAuth } from './data/auth.server';
import { mutations } from './data/mutations.server';
import { getPageData } from './data/data-fetchers.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async (args: LoaderFunctionArgs) => {
  await handleAuth(args);
  const pageData = await getPageData();
  return json({ ...pageData });
};

export const action = async (args: ActionFunctionArgs) => {
  handleAuth(args);
  return null;
};

export default function Route() {
  const { testDocs } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Home</h1>
      <ul>
        {testDocs.map((doc) => (
          <li key={doc.id}>
            <h3>{doc.name}</h3>
            <p>{doc.test_text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}