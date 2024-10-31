import { MetaFunction } from "@remix-run/react";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { handleAuth } from './data/auth.server';
import { mutations } from './data/mutations.server';
import { getPageData } from './data/data-fetchers.server';
import NotFound from './components/not-found';


export const meta: MetaFunction = () => [
  // your meta here
  { title: "404 - Page Not Found" },
  { name: "description", content: "404 - Page Not Found" },
];


export const loader = async (args: LoaderFunctionArgs) => {

  return json({}, { status: 404 });
};

export const action = async (args: ActionFunctionArgs) => {

  return null;
};

export default function Route() {
  return (
    <>
      <NotFound />
    </>
  )
}