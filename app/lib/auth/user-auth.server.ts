import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "./sessions.server";
import {
  checkSessionCookie,
} from "../firebase/auth/auth.server";
import { getServerEnv } from "../env-variables.server";
import { getUserDetails } from "./testing-user.server";

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
  const {userId, email} = await getUserDetails(args);

  if(!userId){
    throw redirect(SIGN_IN_PATH);
  }
 

  

  return {
    userId,
    email,    
  };
};




export { checkAuth, requireAuth };
