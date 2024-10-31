import { checkAuth } from "~/lib/auth/user-auth.server";
import { redirect, LoaderFunctionArgs } from "@remix-run/node";

export const handleAuth = async (args: LoaderFunctionArgs) => {
  const data = await checkAuth(args);

  // if user is authenticated, redirect to home page
  if (data.authenticated) {
    throw redirect("/");
  }

  return data;
};
