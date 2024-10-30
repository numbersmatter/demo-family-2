import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { requireAuth } from "~/lib/auth/user-auth.server";

export const handleAuth = async (args: LoaderFunctionArgs) => {
  const data = await requireAuth(args);
  if (!data.userId) {
    throw redirect("/sign-in");
  }
  return {
    userId: data.userId,
    authState: data.authState,
    email: data.email,
  };
};
