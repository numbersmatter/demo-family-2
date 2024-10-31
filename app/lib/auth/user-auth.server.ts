import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "./sessions.server";
import {
  checkSessionCookie,
} from "../firebase/auth/auth.server";
import { getServerEnv } from "../env-variables.server";
import { getUserDetails } from "./testing-user.server";
import { checkRegistrationStatus } from "../business-logic/check-registration-status.server";
import { getClerkAuth } from "./clerk-auth.server";

const { SIGN_IN_PATH } = getServerEnv();

export type AuthStates = "logged-out" | "authenticated" | "registered";

export type AppUserId = string | null;

const checkAuth = async (args: LoaderFunctionArgs) => {
  // firebase auth setup
  const session = await getSession(args.request.headers.get("cookie"));
  const { uid } = await checkSessionCookie(session);
  if (!uid) {
    return {
      authenticated: false,
    };
  }
  return { authenticated: true };
};

const requireAuth = async (args: LoaderFunctionArgs) => {
  // const {userId, email} = await getUserDetails(args);
  const { userId, email } = await getClerkAuth(args);

  if(!userId){
    throw redirect(SIGN_IN_PATH);
  }
 
  const authState = await checkRegistrationStatus(userId);

  

  return {
    userId,
    email,    
    authState,
  };
};




export { checkAuth, requireAuth };
