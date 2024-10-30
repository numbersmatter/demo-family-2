import { LoaderFunctionArgs } from "@remix-run/node";
import { AppUserId } from "./user-auth.server";


export const getUserDetails = async (args: LoaderFunctionArgs) => {
  return {
    userId: "testUser5" as AppUserId,
    email: "test@gmail.com",
  };
};