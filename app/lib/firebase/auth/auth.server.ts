import type { Session } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { UserRecord, getAuth } from "firebase-admin/auth";
import * as firebaseRest from "./firebase-rest";

// import { destroySession, getSession } from "../../auth/sessions.server";
import { getRestConfig, initFirebase } from "../firebase.server";

export type UserStatus = {
  status: "loggedout" | "loggedin" | "onboarded";
};

const restConfig = getRestConfig();

const getServerAuth = () => {
  const fireApp = initFirebase();
  return getAuth(fireApp);
};

const serverAuth = getServerAuth();

export const getFirebaseUser = async (uid: string) => {
  const user = await serverAuth.getUser(uid);
  return user;
};
// const signInWithPassword = firebaseAuthConfig.signInWithPassword;

export const signInWithEmailAndPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const signInResponse = await firebaseRest.signInWithPassword(
    {
      email,
      password,
      returnSecureToken: true,
    },
    restConfig
  );

  if (firebaseRest.isError(signInResponse)) {
    throw new Error(signInResponse.error.message);
  }

  return signInResponse;
};

export const checkSessionCookie = async (session: Session) => {
  try {
    const decodedIdToken = await serverAuth.verifySessionCookie(
      session.get("session") || ""
    );
    return decodedIdToken;
  } catch {
    return { uid: undefined };
  }
};

// export const requireAuth = async (request: Request): Promise<UserRecord> => {
//   const session = await getSession(request.headers.get("cookie"));
//   const { uid } = await checkSessionCookie(session);
//   if (!uid) {
//     throw redirect("/login", {
//       headers: { "Set-Cookie": await destroySession(session) },
//     });
//   }
//   return serverAuth.getUser(uid);
// };

// export const checkAuth = async (request: Request) => {
//   const session = await getSession(request.headers.get("cookie"));
//   const { uid } = await checkSessionCookie(session);
//   if (!uid) {
//     return { status: "loggedout" };
//   }
//   return { status: "loggedin" };
// };

// export const signIn = async (email: string, password: string) => {
//   const { idToken } = await signInWithPassword(email, password);
//   return signInWithToken(idToken);
// };

export const signInWithToken = async (idToken: string) => {
  const expiresIn = 1000 * 60 * 60 * 24 * 7; // 1 week
  const sessionCookie = await serverAuth.createSessionCookie(idToken, {
    expiresIn,
  });
  return sessionCookie;
};

// export const signUp = async (name: string, email: string, password: string) => {
//   await serverAuth.createUser({
//     email,
//     password,
//     displayName: name,
//   });
//   return await signIn(email, password);
// };
