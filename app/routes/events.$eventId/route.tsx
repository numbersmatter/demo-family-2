import { isRouteErrorResponse, Link, useParams, useRouteError } from "@remix-run/react";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { handleAuth } from './data/auth.server';
import { mutations } from './data/mutations.server';
import { getPageData } from './data/data-fetchers.server';
import { Button } from "~/components/ui/button";
import EventSignupCard from "./components/event-signup-card";

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await handleAuth(args);
  const eventId = args.params.eventId as string;
  const pageData = await getPageData({ userId: userId, eventId });
  return json({ ...pageData });
};

export const action = async (args: ActionFunctionArgs) => {
  const clerkUser = await handleAuth(args);
  const formData = await args.request.formData();

  const primaryContact = {
    fname: clerkUser.fname,
    lname: clerkUser.lname,
    email: clerkUser.email,
    phone: clerkUser.phone,
  };

  return await mutations.requestReservation({
    formData,
    userId: clerkUser.userId,
    primaryContact,
  });
};

export default function Route() {
  return (
    <>
      <EventSignupCard />
    </>
  )
}



export function ErrorBoundary() {
  const error = useRouteError();
  const params = useParams();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="flex flex-col py-4 items-center justify-center gap-16">
        <h1 className="text-2xl">
          404: Event not found
        </h1>
        <span style={{ color: "red" }}>
          Event with ID "{params.eventId}" not found!
        </span>
        <Link to="/home">
          <Button >
            Go home
          </Button>
        </Link>
      </div>
    );
  }
  return <div />
}
