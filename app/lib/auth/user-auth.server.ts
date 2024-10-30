import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "./sessions.server";
import {
  checkSessionCookie,
  getFirebaseUser,
} from "../firebase/auth/auth.server";
import { getServerEnv } from "../env-variables.server";

const { SIGN_IN_PATH } = getServerEnv();

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
  const session = await getSession(args.request.headers.get("cookie"));
  const { uid } = await checkSessionCookie(session);
  if (!uid) {
    throw redirect(SIGN_IN_PATH, {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  }

  const user = await getFirebaseUser(uid);

  return {
    uid,
    user,
  };
};

export { checkAuth, requireAuth };
