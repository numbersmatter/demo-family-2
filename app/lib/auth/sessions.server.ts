import { createCookieSessionStorage } from "@remix-run/node";
import { getServerEnv } from "../env-variables.server";

const { COOKIE_SECRET, NODE_ENV } = getServerEnv();

const secureFlag = NODE_ENV === "production" ? true : false;

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      secrets: [COOKIE_SECRET],
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      secure: secureFlag,
    },
  });
