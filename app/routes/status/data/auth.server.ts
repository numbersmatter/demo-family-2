import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { requireAuth } from "~/lib/auth/user-auth.server";

export const handleAuth = async (args: LoaderFunctionArgs) => {
  const data = await requireAuth(args);

  const  userInfo = {
    fname: data.fname,
    lname: data.lname,
    phone: data.phone,
    email: data.email,
  }


  return {
    userId: data.userId,
    authState: data.authState,
    email: data.email,
    userInfo,
  };
};
