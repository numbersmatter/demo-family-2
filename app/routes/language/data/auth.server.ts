import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { requireAuth } from "~/lib/auth/user-auth.server";
import { checkRegistrationStatus } from "~/lib/business-logic/check-registration-status.server";

export const handleAuth = async (args: LoaderFunctionArgs) => {
  const { userId, email} = await requireAuth(args);
  const authState = await checkRegistrationStatus(userId);

 

  return {
    userId,
    authState,
    email,
  };
};