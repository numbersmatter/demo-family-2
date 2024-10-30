import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { requireAuth } from "~/lib/auth/user-auth.server";
import { checkRegistrationStatus } from "~/lib/business-logic/check-registration-status.server";

export const handleAuth = async (args: LoaderFunctionArgs) => {
  const data = await requireAuth(args);


  return {
    userId: data.userId,
    authState: data.authState,
    email: data.email,
  };
};
